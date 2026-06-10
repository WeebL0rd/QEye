import { View, Text, ScrollView } from 'react-native';
import { useTheme, spacing, typography, radius } from '../styles/theme';
import type { Theme } from '../styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BarData {
    label: string;       // Etiqueta debajo de la barra
    value: number;       // Valor numérico
    description?: string; // Leyenda opcional al hacer hover / debajo
    color?: string;      // Color personalizado para esta barra
}

    export interface BarChartProps {
    data: BarData[];
    title?: string;
    maxValue?: number;        // Si no se pasa, se calcula automáticamente
    yAxisSteps?: number;      // Cantidad de líneas del eje Y (default: 5)
    barColor?: string;        // Color por defecto para todas las barras
    barWidth?: number;        // Ancho de cada barra (default: 36)
    height?: number;          // Altura del área de barras (default: 200)
    unit?: string;            // Unidad para el eje Y (ej: '%', 'pts')
    showValues?: boolean;     // Mostrar valor encima de cada barra
    }

    // ─── Component ────────────────────────────────────────────────────────────────

    export default function BarChart({
    data,
    title,
    maxValue,
    yAxisSteps = 5,
    barColor,
    barWidth = 36,
    height = 200,
    unit = '',
    showValues = true,
    }: BarChartProps) {
    const theme = useTheme();

    const computedMax = maxValue ?? Math.ceil(Math.max(...data.map(d => d.value)) * 1.2);
    const effectiveMax = computedMax === 0 ? 1 : computedMax;

    // Generar ticks del eje Y
    const yTicks = Array.from({ length: yAxisSteps + 1 }, (_, i) =>
        Math.round((effectiveMax / yAxisSteps) * (yAxisSteps - i))
    );

    const defaultBarColor = barColor ?? theme.primary;
    const yAxisWidth = 40;

    return (
        <View style={{
        backgroundColor: theme.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        shadowColor: theme.shadow.color,
        shadowOpacity: theme.shadow.opacity,
        shadowRadius: theme.shadow.radius,
        shadowOffset: theme.shadow.offset,
        elevation: theme.shadow.elevation,
        }}>
        {/* Título */}
        {title && (
            <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
            {title}
            </Text>
        )}

        {/* Área del gráfico */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row' }}>

            {/* Eje Y */}
            <View style={{ width: yAxisWidth, height: height + 32, justifyContent: 'space-between', paddingBottom: 32 }}>
                {yTicks.map((tick, i) => (
                <Text
                    key={i}
                    style={[
                    typography.label,
                    {
                        color: theme.text.secondary,
                        textAlign: 'right',
                        fontSize: 10,
                        lineHeight: 14,
                    }
                    ]}
                >
                    {tick}{unit}
                </Text>
                ))}
            </View>

            {/* Líneas de cuadrícula + barras */}
            <View>
                {/* Contenedor de barras con líneas de fondo */}
                <View style={{ position: 'relative', height, flexDirection: 'row', alignItems: 'flex-end' }}>

                {/* Líneas horizontales del grid */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' }}>
                    {yTicks.map((_, i) => (
                    <View
                        key={i}
                        style={{
                        height: 1,
                        backgroundColor: theme.border,
                        opacity: 0.6,
                        }}
                    />
                    ))}
                </View>

                {/* Barras */}
                {data.map((item, index) => {
                    const barHeight = Math.max((item.value / effectiveMax) * height, 2);
                    const color = item.color ?? defaultBarColor;

                    return (
                    <View
                        key={index}
                        style={{
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginHorizontal: spacing.sm,
                        height,
                        }}
                    >
                        {/* Valor encima de la barra */}
                        {showValues && (
                        <Text style={[
                            typography.label,
                            { color: theme.text.secondary, marginBottom: 4, fontSize: 11 }
                        ]}>
                            {item.value}{unit}
                        </Text>
                        )}

                        {/* Barra */}
                        <View style={{
                        width: barWidth,
                        height: barHeight,
                        backgroundColor: color,
                        borderRadius: radius.sm,
                        borderBottomLeftRadius: 2,
                        borderBottomRightRadius: 2,
                        opacity: 0.9,
                        }} />
                    </View>
                    );
                })}
                </View>

                {/* Línea base del eje X */}
                <View style={{ height: 1, backgroundColor: theme.border, marginLeft: spacing.sm }} />

                {/* Etiquetas del eje X */}
                <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
                {data.map((item, index) => (
                    <View
                    key={index}
                    style={{
                        width: barWidth,
                        marginHorizontal: spacing.sm,
                        alignItems: 'center',
                    }}
                    >
                    <Text
                        style={[
                        typography.label,
                        {
                            color: theme.text.secondary,
                            fontSize: 10,
                            textAlign: 'center',
                        }
                        ]}
                        numberOfLines={2}
                    >
                        {item.label}
                    </Text>
                    </View>
                ))}
                </View>
            </View>
            </View>
        </ScrollView>

        {/* Leyendas / descripciones */}
        {data.some(d => d.description) && (
            <View style={{
            marginTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingTop: spacing.sm,
            gap: spacing.xs,
            }}>
            {data.filter(d => d.description).map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: item.color ?? defaultBarColor,
                }} />
                <Text style={[typography.small, { color: theme.text.secondary, flex: 1 }]}>
                    <Text style={{ fontWeight: '600', color: theme.text.primary }}>{item.label}: </Text>
                    {item.description}
                </Text>
                </View>
            ))}
            </View>
        )}
        </View>
    );
    }