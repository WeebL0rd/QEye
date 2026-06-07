import { View, Text, TouchableOpacity } from 'react-native';
import { Item } from '../types/evaluation';
import { useTheme } from '../styles/theme';
import { createItemCardStyles } from '../styles/styles';
import { calculateItemScores } from '../utils/evaluationCalculations';
import CriterionCard from './CriterionCard';

interface ItemCardProps {
  item: Item;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateCriterionScore: (criterionId: number, score: number) => void;
}

export default function ItemCard({ item, isExpanded, onToggle, onUpdateCriterionScore }: ItemCardProps) {
  const theme = useTheme();
  const styles = createItemCardStyles(theme);

  const getQualityColor = (percentage: number) => {
    if (percentage > 70) return theme.good;
    if (percentage >= 50) return theme.acceptable;
    return theme.deficient;
  };

  const { actualScore, maxScore, percentage, qualityLabel } = calculateItemScores(item);
  const completedCriteria = item.criteria.filter(c => c.score > 0).length;
  const qualityColor = getQualityColor(percentage);

  const handleToggle = () => {
    onToggle();
  };

  return (
    <View style={{ marginBottom: 8 }}>
      <TouchableOpacity
        style={[styles.card, { marginVertical: 0 }]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.weightBadge}>
              <Text style={styles.weightText}>{item.weight}%</Text>
            </View>
            <Text style={{ fontSize: 20, color: theme.text.secondary, fontWeight: '700' }}>
              {isExpanded ? '−' : '+'}
            </Text>
          </View>
        </View>

        <View style={[styles.metaRow, { marginBottom: 8 }]}>
          <Text style={styles.criteriaCount}>
            {completedCriteria}/{item.criteria.length} criterios evaluados
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text.primary }}>
            Puntuación: {actualScore}/{maxScore}
          </Text>
          <View style={{
            backgroundColor: `${qualityColor}20`,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '700',
              color: qualityColor,
            }}>
              {qualityLabel} ({percentage}%)
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={{ paddingLeft: 16, paddingTop: 8 }}>
          {item.criteria.map(criterion => (
            <CriterionCard
              key={criterion.id}
              criterion={criterion}
              onUpdateScore={onUpdateCriterionScore}
            />
          ))}
        </View>
      )}
    </View>
  );
}
