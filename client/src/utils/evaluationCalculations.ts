import { Item, Stage, Evaluation } from '../types/evaluation';

/**
 * Obtiene la etiqueta de calidad basada en el porcentaje
 */
export function getQualityLabel(percentage: number) {
  if (percentage > 70) return 'Bueno';
  if (percentage >= 50) return 'Aceptable';
  return 'Deficiente';
}

/**
 * Calcula las puntuaciones para un solo Item
 */
export function calculateItemScores(item: Item) {
  let totalWeight = 0;
  let weightedScore = 0;
  let maxScore = 0;

  item.criteria.forEach(criterion => {
    totalWeight += criterion.weight;
    weightedScore += criterion.score * (criterion.weight / 100);
    maxScore += 5 * (criterion.weight / 100);
  });

  const actualScore = totalWeight > 0 ? Math.round(weightedScore * 10) / 10 : 0;
  const maxScoreRounded = totalWeight > 0 ? Math.round(maxScore * 10) / 10 : 5;
  const percentage = maxScoreRounded > 0 ? Math.round((actualScore / maxScoreRounded) * 100) : 0;

  return { actualScore, maxScore: maxScoreRounded, percentage, qualityLabel: getQualityLabel(percentage) };
}

/**
 * Calcula las puntuaciones para un Stage completo
 */
export function calculateStageScores(stage: Stage) {
  let totalItemWeight = 0;
  let weightedStageScore = 0;

  stage.items.forEach(item => {
    const itemScores = calculateItemScores(item);
    totalItemWeight += item.weight;
    weightedStageScore += itemScores.percentage * (item.weight / 100);
  });

  const actualPercentage = totalItemWeight > 0 ? Math.round(weightedStageScore) : 0;

  return { 
    actualPercentage, 
    score0To5: totalItemWeight > 0 ? Math.round((actualPercentage / 100) * 5 * 10) / 10 : 0,
    qualityLabel: getQualityLabel(actualPercentage)
  };
}

/**
 * Calcula la puntuación total de toda la evaluación (SDLC)
 */
export function calculateTotalEvaluationScores(evaluation: Evaluation) {
  let totalStageWeight = 0;
  let weightedTotalScore = 0;

  evaluation.stages.forEach(stage => {
    const stageScores = calculateStageScores(stage);
    totalStageWeight += stage.weight;
    weightedTotalScore += stageScores.actualPercentage * (stage.weight / 100);
  });

  const totalPercentage = totalStageWeight > 0 ? Math.round(weightedTotalScore) : 0;

  return {
    totalPercentage,
    score0To5: totalStageWeight > 0 ? Math.round((totalPercentage / 100) * 5 * 10) / 10 : 0,
    qualityLabel: getQualityLabel(totalPercentage)
  };
}
