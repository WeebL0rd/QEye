import { View, Text } from 'react-native';
import { Criterion } from '../types/evaluation';
import { useTheme } from '../styles/theme';
import { createCriterionCardStyles } from '../styles/styles';
import ScoreSelector from './ScoreSelector';

interface CriterionCardProps {
  criterion: Criterion;
  onUpdateScore: (criterionId: number, score: number) => void;
}

export default function CriterionCard({ criterion, onUpdateScore }: CriterionCardProps) {
  const theme = useTheme();
  const styles = createCriterionCardStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{criterion.name}</Text>
        <View style={styles.weightBadge}>
          <Text style={styles.weightText}> Valor del criterio: {criterion.weight}%</Text>
        </View>
      </View>

      {criterion.rubric.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.text.secondary, marginBottom: 8 }}>Rúbrica:</Text>
          {criterion.rubric.map((rubricItem, index) => (
            <Text key={`${criterion.id}-${rubricItem.id}-${index}`} style={{ fontSize: 14, color: theme.text.secondary, marginBottom: 4 }}>
              {rubricItem.description}
            </Text>
          ))}
        </View>
      )}

      <ScoreSelector
        currentScore={criterion.score}
        onSelectScore={(score) => onUpdateScore(criterion.id, score)}
      />
    </View>
  );
}
