import EvaluationForms from '../src/screens/EvaluationForms';
import { savedEvaluation } from '../src/constants/preloadedSavedEvaluation'; // Preloaded data (remover más adelante)

export default function HomeScreen() {
  return <EvaluationForms evaluationMetadata={savedEvaluation} />;
}
