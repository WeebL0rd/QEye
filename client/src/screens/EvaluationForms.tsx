import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../styles/theme';
import { createGlobalStyles } from '../styles/styles';
import { spacing, typography } from '../styles/theme';
import StageCard from '../components/StageCard';
import ItemCard from '../components/ItemCard';
import rubricTemplate from '../constants/rubricTemplate';
import { Evaluation, SavedEvaluation } from '../types/evaluation';
import { calculateTotalEvaluationScores } from '../utils/evaluationCalculations';
import { loadEvaluation, saveEvaluation } from '../utils/evaluationParser';
import { useRouter } from 'expo-router';

interface EvaluationFormsProps {
  evaluationMetadata: SavedEvaluation;
}

export default function EvaluationForms({ evaluationMetadata }: EvaluationFormsProps) {
  const theme = useTheme();
  //const navigation = useNavigation();  // ← reemplaza useRouter()
  const router = useRouter();
  const globalStyles = createGlobalStyles(theme);

  const loadedEvaluation = loadEvaluation(rubricTemplate, evaluationMetadata);
  const [evaluation, setEvaluation] = useState<Evaluation>(loadedEvaluation);

  const [expandedStageId, setExpandedStageId] = useState<number | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

  const handleUpdateCriterionScore = (criterionId: number, score: number) => {
    setEvaluation(prev => ({
      ...prev,
      updatedAt: new Date(),
      stages: prev.stages.map(stage => ({
        ...stage,
        items: stage.items.map(item => ({
          ...item,
          criteria: item.criteria.map(criterion =>
            criterion.id === criterionId
              ? { ...criterion, score }
              : criterion
          )
        }))
      }))
    }));
  };

  const handleToggleStage = (stageId: number) => {
    setExpandedStageId(prev => prev === stageId ? null : stageId);
    setExpandedItemId(null);
  };

  const handleToggleItem = (itemId: number) => {
    setExpandedItemId(prev => prev === itemId ? null : itemId);
  };

  const totalScores = calculateTotalEvaluationScores(evaluation);

  const getTotalQualityColor = () => {
    if (totalScores.totalPercentage > 70) return theme.good;
    if (totalScores.totalPercentage >= 50) return theme.acceptable;
    return theme.deficient;
  };

  const handleSave = () => {
    const saved = saveEvaluation(evaluation);
    console.log('Evaluación guardada compacta:', saved);
    alert('Evaluación guardada!');
  };

  return (
    <SafeAreaView
      style={{ flex: 2, backgroundColor: theme.background }}
      edges={['top', 'left', 'right']}
    >
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
          Editar
        </Text>
        <TouchableOpacity onPress={handleSave} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Text style={[typography.body, { color: theme.primary, fontWeight: '600' }]}>
            Guardar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/dashboard')} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Text style={[typography.body, { color: theme.primary, fontWeight: '600' }]}>
              Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[globalStyles.scrollContent, { paddingBottom: spacing.xl }]}>
        <View style={{
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
        }}>
          <Text style={[typography.h1, { color: theme.text.primary, marginBottom: 16 }]}>
            {evaluation.projectName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={[typography.body, { color: theme.text.secondary, marginBottom: 4 }]}>
                Puntuación total
              </Text>
              <Text style={[typography.h1, { color: getTotalQualityColor(), fontSize: 36 }]}>
                {totalScores.totalPercentage}%
              </Text>
            </View>
            <View style={{
              backgroundColor: `${getTotalQualityColor()}20`,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '800',
                color: getTotalQualityColor(),
              }}>
                {totalScores.qualityLabel}
              </Text>
            </View>
          </View>
        </View>

        {evaluation.stages.map(stage => (
          <StageCard
            key={stage.id}
            stage={stage}
            isExpanded={expandedStageId === stage.id}
            onToggle={() => handleToggleStage(stage.id)}
          >
            <View style={{ paddingLeft: 16, paddingTop: 8 }}>
              {stage.items.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isExpanded={expandedItemId === item.id}
                  onToggle={() => handleToggleItem(item.id)}
                  onUpdateCriterionScore={handleUpdateCriterionScore}
                />
              ))}
            </View>
          </StageCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}