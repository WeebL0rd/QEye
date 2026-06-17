import { calculateStageScores, calculateItemScores, calculateTotalEvaluationScores } from '../utils/evaluationCalculations';
import { Evaluation, Stage, Item, Criterion } from '../types/evaluation';

 const mockEvaluation :Evaluation = {
  id: 'eval-001',
  userId: 'user-001',
  projectName: 'Evaluacion de prueba',
  createdAt: new Date('2026-06-16'),
  updatedAt: new Date('2026-06-16'),
  stages: [
    {
      id: 1,
      name: 'Requerimientos',
      weight: 20,
      items: [
        {
          id: 1,
          name: 'Alcance',
          weight: 40,
          criteria: [
            {
              id: 1,
              name: 'Definición de objetivos',
              weight: 60,
              score: 5,
              rubric: []
            },
            {
              id: 2,
              name: 'Delimitación de entregables',
              weight: 40,
              score: 4,
              rubric: []
            }
          ]
        },
        {
          id: 2,
          name: 'Reqs funcionales',
          weight: 40,
          criteria: [
            {
              id: 3,
              name: 'Cobertura de casos de uso',
              weight: 50,
              score: 4,
              rubric: []
            },
            {
              id: 4,
              name: 'Claridad de requisitos',
              weight: 50,
              score: 3,
              rubric: []
            }
          ]
        },
        {
          id: 3,
          name: 'Reqs no funcionales',
          weight: 20,
          criteria: [
            {
              id: 5,
              name: 'Seguridad',
              weight: 50,
              score: 4,
              rubric: []
            },
            {
              id: 6,
              name: 'Rendimiento',
              weight: 50,
              score: 2,
              rubric: []
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Diseño',
      weight: 30,
      items: [
        {
          id: 4,
          name: 'Arquitectura',
          weight: 50,
          criteria: [
            {
              id: 7,
              name: 'Modularidad',
              weight: 50,
              score: 5,
              rubric: []
            },
            {
              id: 8,
              name: 'Escalabilidad',
              weight: 50,
              score: 4,
              rubric: []
            }
          ]
        },
        {
          id: 5,
          name: 'Pantallas',
          weight: 50,
          criteria: [
            {
              id: 9,
              name: 'Usabilidad',
              weight: 50,
              score: 3,
              rubric: []
            },
            {
              id: 10,
              name: 'Consistencia visual',
              weight: 50,
              score: 4,
              rubric: []
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Desarrollo',
      weight: 40,
      items: [
        {
          id: 6,
          name: 'Codigo',
          weight: 25,
          criteria: [
            {
              id: 11,
              name: 'Legibilidad',
              weight: 50,
              score: 4,
              rubric: []
            },
            {
              id: 12,
              name: 'Buenas prácticas',
              weight: 50,
              score: 4,
              rubric: []
            }
          ]
        },
        {
          id: 7,
          name: 'Server',
          weight: 25,
          criteria: [
            {
              id: 13,
              name: 'Configuración',
              weight: 60,
              score: 5,
              rubric: []
            },
            {
              id: 14,
              name: 'Monitoreo',
              weight: 40,
              score: 3,
              rubric: []
            }
          ]
        },
        {
          id: 8,
          name: 'APIS',
          weight: 25,
          criteria: [
            {
              id: 15,
              name: 'Diseño REST',
              weight: 50,
              score: 4,
              rubric: []
            },
            {
              id: 16,
              name: 'Manejo de errores',
              weight: 50,
              score: 5,
              rubric: []
            }
          ]
        },
        {
          id: 9,
          name: 'Interfaces',
          weight: 25,
          criteria: [
            {
              id: 17,
              name: 'Integración frontend',
              weight: 50,
              score: 3,
              rubric: []
            },
            {
              id: 18,
              name: 'Experiencia de usuario',
              weight: 50,
              score: 4,
              rubric: []
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Pruebas',
      weight: 10,
      items: [
        {
          id: 10,
          name: 'Funcionales',
          weight: 40,
          criteria: [
            {
              id: 19,
              name: 'Cobertura funcional',
              weight: 10,
              score: 4,
              rubric: []
            },
            {
              id: 20,
              name: 'Evidencia de ejecución',
              weight: 90,
              score: 3,
              rubric: []
            }
          ]
        },
        {
          id: 11,
          name: 'Unitarias',
          weight: 50,
          criteria: [
            {
              id: 21,
              name: 'Cobertura de código',
              weight: 20,
              score: 2,
              rubric: []
            },
            {
              id: 22,
              name: 'Calidad de tests',
              weight: 80,
              score: 3,
              rubric: []
            }
          ]
        },
        {
          id: 12,
          name: 'Aceptacion',
          weight: 10,
          criteria: [
            {
              id: 23,
              name: 'Validación cliente',
              weight: 70,
              score: 5,
              rubric: []
            },
            {
              id: 24,
              name: 'Acta de conformidad',
              weight: 30,
              score: 4,
              rubric: []
            }
          ]
        }
      ]
    }
  ]
};

const mockStage = mockEvaluation.stages[0];

const mockItem = mockStage.items[0];


test(
  'calculateItemScores() - Alcance = 4.6\n' +
  'Definición de objetivos: 5 × 60% = 3.0\n' +
  'Delimitación de entregables: 4 × 40% = 1.6\n' +
  'Total: 3.0 + 1.6 = 4.6',
  () => {
    expect(calculateItemScores(mockItem).actualScore).toBe(4.6);
    expect(calculateItemScores(mockItem).percentage).toBe(92);
  }
);

test(
  'calculateStageScores() - Requerimientos = 77%\n' +
  'Alcance: 92 × 40% = 36.8\n' +
  'Reqs funcionales: 70 × 40% = 28\n' +
  'Reqs no funcionales: 60 × 20% = 12\n' +
  'Total: 36.8 + 28 + 12 = 76.8\n' +
  'Math.round(76.8) = 77',
  () => {
    expect(calculateStageScores(mockEvaluation.stages[0]).actualPercentage).toBe(77);
    expect(calculateStageScores(mockEvaluation.stages[0]).score0To5).toBe(3.9);
    expect(calculateStageScores(mockEvaluation.stages[0]).qualityLabel).toBe('Bueno');
  }
);

test(
  'calculateTotalEvaluationScores() = 78%\n' +
  'Requerimientos: 77 × 20% = 15.4\n' +
  'Diseño: 80 × 30% = 24\n' +
  'Desarrollo: 81 × 40% = 32.4\n' +
  'Pruebas: 62 × 10% = 6.2\n' +
  'Total: 15.4 + 24 + 32.4 + 6.2 = 78\n' +
  'Math.round(78) = 78',
  () => {
    expect(calculateTotalEvaluationScores(mockEvaluation).totalPercentage).toBe(78);
    expect(calculateTotalEvaluationScores(mockEvaluation).score0To5).toBe(3.9);
    expect(calculateTotalEvaluationScores(mockEvaluation).qualityLabel).toBe('Bueno');
  }
);
