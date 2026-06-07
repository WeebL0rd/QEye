export interface Evaluation {
    id: string;
    userId: string;
    projectName: string;
    stages: Stage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Stage {
    id: number;
    name: string;
    weight: number; // % total del Ciclo de vida de desarrollo de software
    items: Item[];
}

export interface Item {
    id: number;
    name: string;
    weight: number; // % total de la etapa
    criteria: Criterion[];
}

export interface Criterion {
    id: number;
    name: string;
    weight: number; // % total del item
    score: number; // 0-5 (0 = no asignado // Muy deficiente, Deficiente, Aceptable, Bueno, Excelente)
    rubric: RubricCriteria[];
}

export interface RubricCriteria {
    id: number;
    weight: number;
    description: string; // % total del criterio
}

export interface SavedEvaluation {
  id: string;
  userId: string;
  projectName: string;
  createdAt: Date;
  updatedAt: Date;
  scores: EvaluationScore[];
}

export interface EvaluationScore {
  criterionId: number;
  score: number;
}