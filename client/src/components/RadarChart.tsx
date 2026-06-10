import { View, Text } from 'react-native';
import Svg, { Polygon, Polyline, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme, spacing, typography, radius } from '../styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RadarDataPoint {
  label: string;    // Nombre del eje
  value: number;    // Valor obtenido
  maxValue?: number; // Máximo posible para este eje (default: 100)
}

export interface RadarChartProps {
  data: RadarDataPoint[];
  title?: string;
  color?: string;          // Color del área (default: theme.primary)
  levels?: number;         // Cantidad de anillos de referencia (default: 4)
  size?: number;           // Tamaño total del SVG (default: 280)
  showValues?: boolean;    // Mostrar valor numérico junto a cada etiqueta
  unit?: string;           // Unidad para mostrar en valores (ej: '%')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.sin(angleRad),
    y: cy - r * Math.cos(angleRad),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RadarChart({
    data,
    title,
    color,
    levels = 4,
    size = 280,
    showValues = true,
    unit = '',
}: RadarChartProps) {
    const theme = useTheme();
    const fillColor = color ?? theme.primary;

    const n = data.length;
    if (n < 3) return null;

    const cx = size / 2;
    const cy = size / 2;
    const chartPadding = 55;
    const labelPadding = 28;
    const maxRadius = size / 2 - chartPadding;
    const angleStep = (2 * Math.PI) / n;

  // Polígono de datos
    const dataPoints = data.map((d, i) => {
        const max = d.maxValue ?? 100;
        const ratio = Math.min(d.value / max, 1);
        const angle = angleStep * i;
        return polarToCartesian(cx, cy, ratio * maxRadius, angle);
    });

    const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Polígonos de los anillos de fondo
    const levelPolygons = Array.from({ length: levels }, (_, l) => {
        const r = ((l + 1) / levels) * maxRadius;
        const pts = Array.from({ length: n }, (_, i) => {
        const p = polarToCartesian(cx, cy, r, angleStep * i);
        return `${p.x},${p.y}`;
        });
        return pts.join(' ');
    });

  // Posiciones de las etiquetas (fuera del radio máximo)
    const labelPositions = data.map((d, i) => {
        const angle = angleStep * i;
        const lp = polarToCartesian(cx, cy, maxRadius + labelPadding - 4, angle);
        return { ...lp, label: d.label, value: d.value, max: d.maxValue ?? 100 };
    });

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
        alignItems: 'center',
        }}>
        {title && (
            <Text style={[typography.h3, {
            color: theme.text.primary,
            marginBottom: spacing.md,
            alignSelf: 'flex-start',
            }]}>
            {title}
            </Text>
        )}

        <Svg width={size} height={size}>
            <Defs>
            <LinearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={fillColor} stopOpacity="0.4" />
                <Stop offset="1" stopColor={fillColor} stopOpacity="0.1" />
            </LinearGradient>
            </Defs>

            {/* Anillos de referencia */}
            {levelPolygons.map((pts, l) => (
            <Polygon
                key={l}
                points={pts}
                fill="none"
                stroke={theme.border}
                strokeWidth={1}
                opacity={0.8}
            />
            ))}

            {/* Ejes desde el centro */}
            {data.map((_, i) => {
            const tip = polarToCartesian(cx, cy, maxRadius, angleStep * i);
            return (
                <Line
                key={i}
                x1={cx} y1={cy}
                x2={tip.x} y2={tip.y}
                stroke={theme.border}
                strokeWidth={1}
                opacity={0.6}
                />
            );
            })}

            {/* Marcadores de nivel en el eje superior (eje 0) */}
            {Array.from({ length: levels }, (_, l) => {
            const r = ((l + 1) / levels) * maxRadius;
            const p = polarToCartesian(cx, cy, r, 0);
            const val = Math.round(((l + 1) / levels) * 100);
            return (
                <SvgText
                key={l}
                x={p.x + 3}
                y={p.y - 2}
                fontSize={8}
                fill={theme.text.disabled}
                textAnchor="start"
                >
                {val}%
                </SvgText>
            );
            })}

            {/* Área de datos */}
            <Polygon
            points={dataPolygon}
            fill="url(#radarGrad)"
            stroke={fillColor}
            strokeWidth={2}
            />

            {/* Puntos en cada vértice */}
            {dataPoints.map((p, i) => (
            <Circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill={fillColor}
                stroke={theme.surface}
                strokeWidth={2}
            />
            ))}

            {/* Etiquetas y valores */}
            {labelPositions.map((lp, i) => {
            // Determinar alineación según posición angular
            const angle = angleStep * i;
            const sinA = Math.sin(angle);
            let anchor: 'middle' | 'start' | 'end' = 'middle';
            if (sinA > 0.2) anchor = 'start';
            if (sinA < -0.2) anchor = 'end';

            const ratio = lp.value / lp.max;
            const valColor = ratio >= 0.7
                ? theme.good
                : ratio >= 0.5
                ? theme.acceptable
                : theme.deficient;

            return (
                <SvgText key={i} textAnchor={anchor}>
                <SvgText
                    x={lp.x}
                    y={lp.y}
                    fontSize={11}
                    fontWeight="600"
                    fill={theme.text.primary}
                >
                    {lp.label}
                </SvgText>
                {showValues && (
                    <SvgText
                    x={lp.x}
                    y={lp.y + 13}
                    fontSize={10}
                    fill={valColor}
                    fontWeight="700"
                    >
                    {lp.value}{unit}
                    </SvgText>
                )}
                </SvgText>
            );
            })}
        </Svg>
        </View>
    );
}