import { View, Text, TouchableOpacity } from 'react-native';
import { Stage } from '../types/evaluation';
import { useTheme } from '../styles/theme';
import { createStageCardStyles } from '../styles/styles';
import { calculateStageScores } from '../utils/evaluationCalculations';

interface StageCardProps {
  stage: Stage;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export default function StageCard({ stage, isExpanded, onToggle, children }: StageCardProps) {
  const theme = useTheme();
  const styles = createStageCardStyles(theme);
  const { actualPercentage, qualityLabel } = calculateStageScores(stage);

  const getQualityColor = () => {
    if (actualPercentage > 70) return theme.good;
    if (actualPercentage >= 50) return theme.acceptable;
    return theme.deficient;
  };

  const handleToggle = () => {
    onToggle();
  };

  return (
    <View style={{ marginBottom: 8 }}>
      <TouchableOpacity
        style={styles.card}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{stage.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{
              backgroundColor: `${getQualityColor()}20`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: getQualityColor(),
              }}>
                {qualityLabel} ({actualPercentage}%)
              </Text>
            </View>
            <View style={styles.weightBadge}>
              <Text style={styles.weightText}>{stage.weight}%</Text>
            </View>
            <Text style={{ fontSize: 20, color: theme.text.secondary, fontWeight: '700' }}>
              {isExpanded ? '−' : '+'}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{stage.items.length} items</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && children}
    </View>
  );
}
