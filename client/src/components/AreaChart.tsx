import { View, Text, ScrollView } from 'react-native';
import Svg, { Polyline, Polygon, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme, spacing, typography, radius } from '../styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AreaChartDataPoint {
    label: string;
    expected: number;
    achieved: number;
}

export interface AreaChartProps {
    data: AreaChartDataPoint[];
    title?: string;
    expectedLabel?: string;
    achievedLabel?: string;
    expectedColor?: string;
    achievedColor?: string;
    maxValue?: number;
    yAxisSteps?: number;
    chartHeight?: number;
    unit?: string;
    cardHeight?: number; // Altura máxima de la card con scroll vertical
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toPoints(values: number[], xs: number[], h: number, maxVal: number, paddingTop: number): string {
    return values
        .map((v, i) => `${xs[i]},${paddingTop + h - (v / maxVal) * h}`)
        .join(' ');
}

function toPolygon(values: number[], xs: number[], h: number, maxVal: number, paddingTop: number): string {
    const top = toPoints(values, xs, h, maxVal, paddingTop);
    const baseline = paddingTop + h;
    return `${xs[0]},${baseline} ${top} ${xs[xs.length - 1]},${baseline}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AreaChart({
    data,
    title,
    expectedLabel = 'Esperado',
    achievedLabel = 'Conseguido',
    expectedColor,
    achievedColor,
    maxValue,
    yAxisSteps = 5,
    chartHeight = 220,
    unit = '',
    cardHeight = 480,
}: AreaChartProps) {
    const theme = useTheme();

    const expColor = expectedColor ?? theme.primary;
    const achColor = achievedColor ?? theme.accent;

    const allValues = data.flatMap(d => [d.expected, d.achieved]);
    const computedMax = maxValue ?? Math.ceil(Math.max(...allValues) * 1.25 * 100) / 100;
    const effectiveMax = computedMax === 0 ? 1 : computedMax;

  // Layout
    const paddingTop   = 16; // espacio para que el tick superior no se corte
    const paddingBottom = 16
    const yAxisWidth   = 44;
    const paddingRight = 16;
    const pointSpacing = 90;
    const svgWidth     = (data.length - 1) * pointSpacing + paddingRight;
    const svgHeight    = chartHeight + paddingTop + paddingBottom;

    const xs = data.map((_, i) => i * pointSpacing);

    const yTicks = Array.from({ length: yAxisSteps + 1 }, (_, i) =>
        parseFloat(((effectiveMax / yAxisSteps) * (yAxisSteps - i)).toFixed(4))
    );

    const expectedPoints = data.map(d => d.expected);
    const achievedPoints = data.map(d => d.achieved);

    return (
        <View style={{
        backgroundColor: theme.surface,
        borderRadius: radius.lg,
        shadowColor: theme.shadow.color,
        shadowOpacity: theme.shadow.opacity,
        shadowRadius: theme.shadow.radius,
        shadowOffset: theme.shadow.offset,
        elevation: theme.shadow.elevation,
        height: cardHeight,         // altura fija → habilita scroll vertical
        overflow: 'hidden',
        }}>
        {/* Scroll vertical de toda la card */}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: spacing.md }}
            nestedScrollEnabled
        >
            {/* Título */}
            {title && (
            <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
                {title}
            </Text>
            )}

            {/* Scroll horizontal solo para el gráfico */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row' }}>

                {/* Eje Y */}
                <View style={{ width: yAxisWidth, height: svgHeight, justifyContent: 'flex-start' }}>
                {yTicks.map((tick, i) => {
                    // alinear con paddingTop del SVG
                    const top = paddingTop + (i / yAxisSteps) * chartHeight - 7;
                    return (
                    <Text
                        key={i}
                        style={[typography.label, {
                        position: 'absolute',
                        top,
                        right: 6,
                        color: theme.text.secondary,
                        fontSize: 10,
                        textAlign: 'right',
                        }]}
                    >
                        {tick}{unit}
                    </Text>
                    );
                })}
                </View>

                {/* SVG */}
                <Svg width={svgWidth} height={svgHeight}>
                <Defs>
                    <LinearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={expColor} stopOpacity="0.35" />
                    <Stop offset="1" stopColor={expColor} stopOpacity="0.08" />
                    </LinearGradient>
                    <LinearGradient id="gradAch" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={achColor} stopOpacity="0.55" />
                    <Stop offset="1" stopColor={achColor} stopOpacity="0.10" />
                    </LinearGradient>
                </Defs>

                {/* Grid */}
                {yTicks.map((_, i) => {
                    const y = paddingTop + (i / yAxisSteps) * chartHeight;
                    return (
                    <Line key={i} x1={0} y1={y} x2={svgWidth} y2={y}
                        stroke={theme.border} strokeWidth={1} opacity={0.7} />
                    );
                })}

                {/* Área esperada */}
                <Polygon points={toPolygon(expectedPoints, xs, chartHeight, effectiveMax, paddingTop)} fill="url(#gradExp)" />
                <Polyline points={toPoints(expectedPoints, xs, chartHeight, effectiveMax, paddingTop)}
                    fill="none" stroke={expColor} strokeWidth={2} opacity={0.8} />

                {/* Área conseguida */}
                <Polygon points={toPolygon(achievedPoints, xs, chartHeight, effectiveMax, paddingTop)} fill="url(#gradAch)" />
                <Polyline points={toPoints(achievedPoints, xs, chartHeight, effectiveMax, paddingTop)}
                    fill="none" stroke={achColor} strokeWidth={2} />

                {/* Números de referencia en el eje X */}
                {data.map((_, i) => (
                    <SvgText
                    key={i}
                    x={xs[i]}
                    y={svgHeight - 2}
                    fontSize={10}
                    fontWeight="600"
                    fill={theme.text.disabled}
                    textAnchor="middle"
                    >
                    {i + 1}
                    </SvgText>
                ))}

                {/* Puntos en la línea conseguida */}
                {achievedPoints.map((v, i) => {
                    const cy = paddingTop + chartHeight - (v / effectiveMax) * chartHeight;
                    return (
                    <Polyline
                        key={i}
                        points={`${xs[i] - 3},${cy} ${xs[i]},${cy - 5} ${xs[i] + 3},${cy}`}
                        fill={achColor} stroke="none" opacity={0.9}
                    />
                    );
                })}
                </Svg>
            </View>
            </ScrollView>

            {/* Línea base */}
            <View style={{
            marginLeft: yAxisWidth,
            height: 1,
            backgroundColor: theme.border,
            marginBottom: spacing.sm,
            }} />

            {/* Etiquetas numeradas — en dos columnas, fuera del SVG */}
            <View style={{ marginLeft: yAxisWidth }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {data.map((d, i) => (
                <View key={i} style={{
                    width: '50%',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 4,
                    paddingVertical: 3,
                    paddingRight: spacing.sm,
                }}>
                    {/* Número con mismo color que el tick en el SVG */}
                    <Text style={[typography.label, {
                    color: theme.text.disabled,
                    fontSize: 10,
                    minWidth: 14,
                    paddingTop: 1,
                    }]}>
                    {i + 1}.
                    </Text>
                    <Text style={[typography.small, {
                    color: theme.text.secondary,
                    flexShrink: 1,
                    lineHeight: 16,
                    }]}>
                    {d.label}
                    </Text>
                </View>
                ))}
            </View>
            </View>

            {/* Separador */}
            <View style={{ height: 1, backgroundColor: theme.border, marginVertical: spacing.sm }} />

            {/* Leyenda de series */}
            <View style={{ flexDirection: 'row', gap: spacing.lg }}>
            <LegendDot color={expColor} label={expectedLabel} theme={theme} />
            <LegendDot color={achColor} label={achievedLabel} theme={theme} />
            </View>

        </ScrollView>
        </View>
    );
}

// ─── Leyenda ──────────────────────────────────────────────────────────────────

function LegendDot({ color, label, theme }: { color: string; label: string; theme: any }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color, opacity: 0.8 }} />
        <Text style={[typography.small, { color: theme.text.secondary }]}>{label}</Text>
        </View>
    );
}