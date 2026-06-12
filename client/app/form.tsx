import { useLocalSearchParams } from 'expo-router';
import EvaluationForms from '../src/screens/EvaluationForms';
import { savedEvaluation as emptyEvaluation } from '../src/constants/emptyEvaluation';
import { SavedEvaluation } from '../src/types/evaluation';

export default function Forms() {
    const { evaluation } = useLocalSearchParams<{ evaluation?: string }>();

    const evaluationMetadata: SavedEvaluation = evaluation
        ? JSON.parse(evaluation as string)
        : emptyEvaluation;

    return <EvaluationForms evaluationMetadata={evaluationMetadata} />;
}