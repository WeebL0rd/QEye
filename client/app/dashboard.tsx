import { useLocalSearchParams } from 'expo-router';
import DashboardScreen from '../src/screens/Dashboardscreen';

export default function DashboardPage() {
    const { evaluation } = useLocalSearchParams<{ evaluation?: string }>();
    if (!evaluation) {
        return null;
    }
    const evaluationMetadata = JSON.parse(evaluation as string);
    return <DashboardScreen evaluationMetadata={evaluationMetadata} />;
}