import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../styles/theme';
import { createScoreSelectorStyles } from '../styles/styles';

interface ScoreSelectorProps {
  currentScore: number;
  onSelectScore: (score: number) => void;
}

export default function ScoreSelector({ currentScore, onSelectScore }: ScoreSelectorProps) {
  const theme = useTheme();
  const styles = createScoreSelectorStyles(theme);
  const scores = [0, 1, 2, 3, 4, 5];

  const getScoreButtonStyle = (score: number) => {
    const isSelected = currentScore === score;
    let backgroundColor: string;
    let borderColor: string;
    let textColor: string;

    if (isSelected) {
      if (score === 0) {
        backgroundColor = theme.text.disabled;
        borderColor = theme.text.disabled;
        textColor = theme.text.inverse;
      } else if (score <= 2) {
        backgroundColor = theme.deficient;
        borderColor = theme.deficient;
        textColor = theme.text.onPrimary;
      } else if (score <= 3) {
        backgroundColor = theme.acceptable;
        borderColor = theme.acceptable;
        textColor = theme.text.onAccent;
      } else {
        backgroundColor = theme.good;
        borderColor = theme.good;
        textColor = theme.text.inverse;
      }
    } else {
      backgroundColor = styles.scoreButtonUnselected.backgroundColor;
      borderColor = styles.scoreButtonUnselected.borderColor;
      textColor = styles.scoreButtonTextUnselected.color;
    }

    return {
      button: {
        ...styles.scoreButton,
        backgroundColor,
        borderColor,
      },
      text: {
        ...styles.scoreButtonText,
        color: textColor,
      },
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Puntuación (1-5)</Text>
      <View style={styles.buttonsContainer}>
        {scores.map((score) => {
          const buttonStyles = getScoreButtonStyle(score);
          return (
            <TouchableOpacity
              key={score}
              style={buttonStyles.button}
              onPress={() => onSelectScore(score)}
              activeOpacity={0.7}
            >
              <Text style={buttonStyles.text}>{score}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
