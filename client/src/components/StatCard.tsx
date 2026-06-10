import { View, Text } from 'react-native';
import { useTheme, spacing, typography, radius } from '../styles/theme';

export interface StatCardProps {
    title: string;
    value: string;
    interpretation?: string;
    accentColor?: string;
    backgroundColor?: string;
    valueSize?: number;
    centered?: boolean;      // Centra todo el contenido horizontalmente
}

export default function StatCard({
    title,
    value,
    interpretation,
    accentColor,
    backgroundColor,
    valueSize = 36,
    centered = false,
}: StatCardProps) {
    const theme = useTheme();

    const color = accentColor ?? theme.primary;
    const bg = backgroundColor ?? theme.surface;
    const align = centered ? 'center' : 'flex-start';

    return (
        <View style={{
        backgroundColor: bg,
        borderRadius: radius.lg,
        padding: spacing.md,
        shadowColor: theme.shadow.color,
        shadowOpacity: theme.shadow.opacity,
        shadowRadius: theme.shadow.radius,
        shadowOffset: theme.shadow.offset,
        elevation: theme.shadow.elevation,
        flex: 1,
        alignItems: align,
        }}>
        <Text
            style={[typography.label, {
            color: theme.text.secondary,
            marginBottom: spacing.sm,
            textAlign: centered ? 'center' : 'left',
            }]}
            numberOfLines={2}
        >
            {title.toUpperCase()}
        </Text>

        <Text style={[typography.score, {
            color,
            fontSize: valueSize,
            marginBottom: spacing.xs,
            textAlign: centered ? 'center' : 'left',
        }]}>
            {value}
        </Text>

        {interpretation && (
            <View style={{
            backgroundColor: `${color}20`,
            paddingHorizontal: spacing.sm,
            paddingVertical: 3,
            borderRadius: radius.full,
            }}>
            <Text style={[typography.label, { color, fontSize: 11 }]}>
                {interpretation}
            </Text>
            </View>
        )}
        </View>
    );
}