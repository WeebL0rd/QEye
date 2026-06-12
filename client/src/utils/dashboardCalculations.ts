import { SavedEvaluation } from '../types/evaluation';
import rubricTemplate from '../constants/rubricTemplate';

// ─── Tipos de salida ──────────────────────────────────────────────────────────

export type StageScore = {
    label: string;
    value: number;
    color: string;
    description: string;
};

export type SectionScore = {
    label: string;
    value: number;
    color: string;
};

export type StageBreakdown = {
    stageLabel: string;
    sections: SectionScore[];
};

export type WeightVsQuality = {
    label: string;
    expected: number;
    achieved: number;
};

export type RadarPoint = {
    label: string;
    value: number;
    maxValue: number;
};

export type DashboardData = {
    projectName: string;
    totalScore: number;
    qualityLabel: string;
    stageScores: StageScore[];
    stageBreakdowns: StageBreakdown[];
    weightVsQuality: WeightVsQuality[];
    radarData: RadarPoint[];
    lowestStage: { label: string; value: number };
    highestStage: { label: string; value: number };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAGE_NAMES: Record<number, string> = {
    1: 'Reqs',
    2: 'Diseño',
    3: 'Dev',
    4: 'Prueba',
    5: 'Desp',
    6: 'Mant',
};

function getQualityLabel(pct: number): string {
    if (pct >= 80) return 'Excelente';
    if (pct >= 70) return 'Bueno';
    if (pct >= 50) return 'Aceptable';
    if (pct >= 30) return 'Deficiente';
    return 'Muy deficiente';
}

function getColor(pct: number, theme: { good: string; acceptable: string; deficient: string }): string {
    if (pct > 70) return theme.good;
    if (pct >= 50) return theme.acceptable;
    return theme.deficient;
}

// Acorta el nombre de una sección para que quepa en el eje X de una barra
function shortenItemName(name: string): string {
    // Tomar las primeras 2 palabras significativas
    const words = name.replace(/[()]/g, '').split(' ');
    const significant = words.filter(w => w.length > 3);
    return significant.slice(0, 2).join(' ') || words[0];
}

// ─── Función principal ────────────────────────────────────────────────────────

export function calculateDashboardData(
    savedEvaluation: SavedEvaluation,
    theme: { good: string; acceptable: string; deficient: string; primary: string }
): DashboardData {

    const scoreMap = new Map<number, number>(
        savedEvaluation.scores.map(s => [s.criterionId, s.score])
    );

    // Calcular puntaje por stage y breakdown por sección
    const stageScores: StageScore[] = [];
    const stageBreakdowns: StageBreakdown[] = [];

    rubricTemplate.stages.forEach(stage => {
        let stageTotalWeighted = 0;
        let stageTotalPossible = 0;

        // Secciones (items) de esta etapa
        const sections: SectionScore[] = stage.items.map((item, index) => {
            let itemWeighted = 0;
            let itemPossible = 0;

            item.criteria.forEach(criterion => {
                const score = scoreMap.get(criterion.id) ?? 0;
                itemWeighted += (score / 5) * criterion.weight;
                itemPossible += criterion.weight;
            });

            const pct = itemPossible > 0
                ? Math.round((itemWeighted / itemPossible) * 100)
                : 0;

            stageTotalWeighted += itemWeighted;
            stageTotalPossible += itemPossible;

            return {
                label: String(index+1),
                value: pct,
                color: getColor(pct, theme),
                description: item.name
            };
        });

        const stagePct = stageTotalPossible > 0
            ? Math.round((stageTotalWeighted / stageTotalPossible) * 100)
            : 0;

        stageScores.push({
            label: STAGE_NAMES[stage.id] ?? `Etapa ${stage.id}`,
            value: stagePct,
            color: getColor(stagePct, theme),
            description: stage.name,
        });

        stageBreakdowns.push({
            stageLabel: stage.name,
            sections,
        });
    });

    // Puntaje total ponderado por peso de stage
    const totalWeightSum = rubricTemplate.stages.reduce((acc, s) => acc + s.weight, 0);
    const totalScore = Math.round(
        stageScores.reduce((acc, s, i) => {
            const stageWeight = rubricTemplate.stages[i].weight;
            return acc + (s.value * stageWeight) / totalWeightSum;
        }, 0)
    );

    // Peso relativo vs calidad obtenida
    const weightVsQuality: WeightVsQuality[] = rubricTemplate.stages.map((stage, i) => ({
        label: STAGE_NAMES[stage.id] ?? `Etapa ${stage.id}`,
        expected: parseFloat((stage.weight / totalWeightSum).toFixed(3)),
        achieved: parseFloat((stageScores[i].value / 100 * (stage.weight / totalWeightSum)).toFixed(3)),
    }));

    const radarData: RadarPoint[] = stageScores.map(s => ({
        label: s.label,
        value: s.value,
        maxValue: 100,
    }));

    const sorted = [...stageScores].sort((a, b) => a.value - b.value);
    const lowestStage = { label: sorted[0].label, value: sorted[0].value };
    const highestStage = { label: sorted[sorted.length - 1].label, value: sorted[sorted.length - 1].value };

    return {
        projectName: savedEvaluation.projectName,
        totalScore,
        qualityLabel: getQualityLabel(totalScore),
        stageScores,
        stageBreakdowns,
        weightVsQuality,
        radarData,
        lowestStage,
        highestStage,
    };
}