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
import { SavedEvaluation } from '../types/evaluation';
import { calculateDashboardData } from '../utils/dashboardCalculations';

interface DashboardScreenProps {
    evaluationMetadata: SavedEvaluation;
}

export default function DashboardScreen({ evaluationMetadata }: DashboardScreenProps) {
    const theme = useTheme();
    const router = useRouter();
    const globalStyles = createGlobalStyles(theme);

    const data = calculateDashboardData(evaluationMetadata, {
        good: theme.good,
        acceptable: theme.acceptable,
        deficient: theme.deficient,
        primary: theme.primary,
    });
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

                {/* Nombre del proyecto */}
                <Text style={[typography.h2, { color: theme.text.primary, paddingHorizontal: spacing.sm }]}>
                    {data.projectName}
                </Text>

                {/* Gauge */}
                <GaugeChart
                    value={data.totalScore}
                    title="Diagnóstico general"
                    unit="%"
                />

                <View style={{ flexDirection: 'row' }}>
                    <StatCard
                        title="Puntaje total"
                        value={`${data.totalScore}%`}
                        accentColor={
                            data.totalScore > 70 ? theme.good
                            : data.totalScore >= 50 ? theme.acceptable
                            : theme.deficient
                        }
                        centered
                    />
                </View>
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <StatCard
                        title="Estado"
                        value={data.qualityLabel}
                        accentColor={
                            data.totalScore > 70 ? theme.good
                            : data.totalScore >= 50 ? theme.acceptable
                            : theme.deficient
                        }
                        valueSize={22}
                        centered
                    />
                </View>
                {/* StatCards */}
                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <StatCard
                        title="Etapa más alta"
                        value={`${data.highestStage.value}%`}
                        interpretation={data.highestStage.label}
                        accentColor={theme.good}
                    />
                    <StatCard
                        title="Etapa más baja"
                        value={`${data.lowestStage.value}%`}
                        interpretation={data.lowestStage.label}
                        accentColor={theme.deficient}
                    />
                </View>

                {/* Radar */}
                <RadarChart
                    title="Perfil de calidad por etapa"
                    data={data.radarData}
                    color={theme.primary}
                    levels={3}
                    size={300}
                    unit="%"
                    showValues
                />

                {/* Área */}
                <AreaChart
                    title="Peso relativo vs Calidad obtenida"
                    data={data.weightVsQuality}
                    expectedLabel="Peso Relativo"
                    achievedLabel="Indicador de Calidad"
                    expectedColor={theme.primary}
                    achievedColor={theme.accent}
                    yAxisSteps={5}
                    chartHeight={220}
                    cardHeight={500}
                />

                {/* Barras — resumen por etapa */}
                <BarChart
                    title="Puntaje por etapa"
                    data={data.stageScores}
                    maxValue={100}
                    unit="%"
                    height={200}
                    barWidth={40}
                    showValues
                />

                {/* ── Desglose por sección — un BarChart por etapa ── */}
                {data.stageBreakdowns.map((breakdown, index) => (
                    <BarChart
                        key={index}
                        title={breakdown.stageLabel}
                        data={breakdown.sections}
                        maxValue={100}
                        unit="%"
                        height={200}
                        barWidth={36}
                        showValues
                    />
                ))}

            </ScrollView>
        </SafeAreaView>
    );
}