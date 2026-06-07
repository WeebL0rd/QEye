import { Evaluation, SavedEvaluation } from "../types/evaluation";


export function saveEvaluation(evaluation: Evaluation) : SavedEvaluation {
    return {
        id: evaluation.id,
        userId: evaluation.userId,
        projectName: evaluation.projectName,
        createdAt: evaluation.createdAt,
        updatedAt: evaluation.updatedAt,
        scores: evaluation.stages.flatMap(stage => 
                                            stage.items.flatMap(
                                                item => item.criteria.map(criterion =>(
                                                    {
                                                        criterionId: criterion.id,
                                                        score: criterion.score
                                                    }
                                                ))
                                            ))
    }
}

export function loadEvaluation(
    template: Evaluation,
    savedEvaluation: SavedEvaluation) : Evaluation {
    return {
        ...template,
        stages: template.stages.map(stage => ({
            ...stage,
            items: stage.items.map(item => ({
                ...item,
                criteria: item.criteria.map(criterion => ({
                    ...criterion,
                    score: savedEvaluation.scores.find(score => score.criterionId === criterion.id)?.score || 0
                }))
            }))
        }))
    }
}