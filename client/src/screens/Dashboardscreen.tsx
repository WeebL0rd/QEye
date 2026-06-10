import { View, Text, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, spacing, typography } from '../styles/theme';
import { createGlobalStyles } from '../styles/styles';
import BarChart from '../components/BarChart';
import StatCard from '../components/StatCard';
import AreaChart from '../components/AreaChart';
import RadarChart from '../components/RadarChart';
import GaugeChart from '../components/GaugeChart';

export default function DashboardScreen() {
    const theme = useTheme();
    const router = useRouter();
    const globalStyles = createGlobalStyles(theme);

  // ─── Datos de ejemplo (reemplazar con datos reales de la evaluación) ──────

    const stageScores = [
        { label: 'Inicio',     value: 82, color: theme.good,       description: 'Planeación y arranque del proyecto' },
        { label: 'Diseño',     value: 65, color: theme.acceptable,  description: 'Arquitectura y definición técnica' },
        { label: 'Desarrollo', value: 54, color: theme.acceptable,  description: 'Implementación de funcionalidades' },
        { label: 'Pruebas',    value: 38, color: theme.deficient,   description: 'QA y validación de requerimientos' },
        { label: 'Cierre',     value: 75, color: theme.good,        description: 'Entrega y documentación final' },
    ];

    const criteriaScores = [
        { label: 'Docs',        value: 90, color: theme.primary },
        { label: 'Código',      value: 60, color: theme.primary },
        { label: 'Testing',     value: 35, color: theme.deficient },
        { label: 'Seguridad',   value: 72, color: theme.good },
        { label: 'Performance', value: 55, color: theme.acceptable },
        { label: 'UX',          value: 80, color: theme.good },
    ];

    const weightVsQuality = [
        { label: 'Requerimientos',  expected: 0.20, achieved: 0.09 },
        { label: 'Etapa de Diseño', expected: 0.20, achieved: 0.07 },
        { label: 'Desarrollo',      expected: 0.15, achieved: 0.03 },
        { label: 'Pruebas',         expected: 0.15, achieved: 0.04 },
        { label: 'Despliegue',      expected: 0.15, achieved: 0.10 },
        { label: 'Mantenimiento',   expected: 0.15, achieved: 0.10 },
    ];

    const radarData = stageScores.map(s => ({
        label: s.label,
        value: s.value,
        maxValue: 100,
    }));

    const totalScore = 62;

    return (
        <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background }}
        edges={['top', 'left', 'right']}
        >
        {/* Header */}
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            backgroundColor: theme.surface,
        }}>
            <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
            <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <Text style={[typography.h2, { color: theme.text.primary }]}>
            Dashboard
            </Text>
            <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={[globalStyles.scrollContent, { gap: spacing.md }]}>

            {/* Gauge — resumen ejecutivo */}
            <GaugeChart
            value={totalScore}
            title="Diagnóstico general"
            label="Puntaje total del proyecto"
            unit="%"
            />
            <View style={{ flexDirection: 'row' }}>
            <StatCard
                title=""
                value="62%"
                interpretation="Aceptable"
                accentColor={theme.acceptable}
                centered
            />
            </View>
            {/* StatCards */}
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <StatCard
                title="Etapas evaluadas"
                value="5/5"
                interpretation="Completo"
                accentColor={theme.good}
            />
            <StatCard
                title="Criterio más bajo"
                value="38%"
                interpretation="Deficiente"
                accentColor={theme.bad}
            />
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <StatCard
                title="Criterio más alto"
                value="90%"
                interpretation="Bueno"
                accentColor={theme.good}
            />
            <StatCard
                title="Etapa crítica"
                value="Pruebas"
                interpretation="38% — Deficiente"
                accentColor={theme.deficient}
                valueSize={22}
            />
            </View>

            {/* Radar — perfil de calidad por etapa */}
            <RadarChart
            title="Perfil de calidad por etapa"
            data={radarData}
            color={theme.primary}
            levels={3}
            size={300}
            unit="%"
            showValues
            />

            {/* Área — peso relativo vs calidad obtenida */}
            <AreaChart
            title="Peso relativo vs Calidad obtenida"
            data={weightVsQuality}
            expectedLabel="Peso Relativo"
            achievedLabel="Indicador de Calidad"
            expectedColor={theme.primary}
            achievedColor={theme.accent}
            yAxisSteps={5}
            chartHeight={220}
            cardHeight={500}
            />

            {/* Barras — puntaje por etapa */}
            <BarChart
            title="Puntaje por etapa"
            data={stageScores}
            maxValue={100}
            unit="%"
            height={200}
            barWidth={40}
            showValues
            />

            {/* Barras — puntaje por criterio */}
            <BarChart
            title="Puntaje por criterio"
            data={criteriaScores}
            maxValue={100}
            unit="%"
            height={180}
            barWidth={36}
            barColor={theme.primary}
            showValues
            />

        </ScrollView>
        </SafeAreaView>
    );
}