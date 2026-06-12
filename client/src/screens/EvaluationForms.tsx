import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import api from '../services/api';
import { useState } from 'react';
import { useRouter } from 'expo-router';
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

interface EvaluationFormsProps {
  evaluationMetadata: SavedEvaluation;
}

export default function EvaluationForms(
  { evaluationMetadata }: EvaluationFormsProps
) {
  const theme = useTheme();
  const router = useRouter();
  const globalStyles = createGlobalStyles(theme);

  // Cargar evaluación
  const loadedEvaluation = loadEvaluation(rubricTemplate, evaluationMetadata);
  const [evaluation, setEvaluation] = useState<Evaluation>(loadedEvaluation);

  // Estado para edición del nombre
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectNameDraft, setProjectNameDraft] = useState(evaluation.projectName);

  // Estado para controlar qué stage/item está expandido (null = ninguno)
  const [expandedStageId, setExpandedStageId] = useState<number | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

  const handleConfirmName = () => {
    const trimmed = projectNameDraft.trim();
    if (trimmed) {
      setEvaluation(prev => ({ ...prev, projectName: trimmed }));
    } else {
      // Si quedó vacío, revertir al nombre anterior
      setProjectNameDraft(evaluation.projectName);
    }
    setIsEditingName(false);
  };

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

  const handleSave = async () => {
    // Si el usuario dejó el campo abierto, confirmar nombre antes de guardar
    if (isEditingName) handleConfirmName();

    try {
      const saved = saveEvaluation(evaluation);
      const isNew = saved.id === 'Pending';

      // Si es nueva → POST /docs/save
      // Si ya existe → PUT /docs/update/:id
      const response = isNew
        ? await api.post('/docs/save', saved)
        : await api.put(`/docs/update/${saved.id}`, saved);

      if (!response.data.success) {
        alert(`Error al guardar: ${response.data.message}`);
        return;
      }

      alert('Evaluación guardada!');
      router.back();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error de conexión al guardar.');
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 2, backgroundColor: theme.background }}
      edges={['top', 'left', 'right']}
    >
      {/* Encabezado personalizado */}
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
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
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
        <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard', params: { evaluation: JSON.stringify(saveEvaluation(evaluation))}})}
                          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <Text style={[typography.body, { color: theme.primary, fontWeight: '600' }]}>
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[globalStyles.scrollContent, { paddingBottom: spacing.xl }]}>
        {/* Header con nombre editable y puntuación total */}
        <View style={{
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
        }}>
          {/* Nombre del proyecto con botón de edición */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 }}>
            {isEditingName ? (
              <>
                <TextInput
                  value={projectNameDraft}
                  onChangeText={setProjectNameDraft}
                  onSubmitEditing={handleConfirmName}
                  autoFocus
                  style={[
                    typography.h1,
                    {
                      flex: 1,
                      color: theme.text.primary,
                      borderBottomWidth: 2,
                      borderBottomColor: theme.primary,
                      paddingBottom: 2,
                    }
                  ]}
                />
                {/* Botón confirmar */}
                <TouchableOpacity
                  onPress={handleConfirmName}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="checkmark" size={22} color={theme.primary} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[typography.h1, { flex: 1, color: theme.text.primary }]}>
                  {evaluation.projectName}
                </Text>
                {/* Botón lápiz */}
                <TouchableOpacity
                  onPress={() => {
                    setProjectNameDraft(evaluation.projectName);
                    setIsEditingName(true);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="pencil-outline" size={20} color={theme.text.secondary} />
                </TouchableOpacity>
              </>
            )}
          </View>

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

        {/* Lista de stages desplegables */}
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