import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme, spacing, typography, radius, qualityColor } from '../styles/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GaugeChartProps {
    value: number;          // Valor actual (0-100)
    title?: string;         // Título encima del gauge
    label?: string;         // Texto debajo del valor (ej: 'Puntuación total')
    unit?: string;          // Unidad (default: '%')
    minValue?: number;      // Mínimo (default: 0)
    maxValue?: number;      // Máximo (default: 100)
    size?: number;          // Diámetro del SVG (default: 260)
    // Umbrales personalizables
    thresholdAcceptable?: number;  // Default: 50
    thresholdGood?: number;        // Default: 70
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const start = {
        x: cx + r * Math.cos(toRad(startDeg)),
        y: cy + r * Math.sin(toRad(startDeg)),
    };
    const end = {
        x: cx + r * Math.cos(toRad(endDeg)),
        y: cy + r * Math.sin(toRad(endDeg)),
    };
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

function needleCoords(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

// ─── Component ────────────────────────────────────────────────────────────────

const START_DEG = 180;   // ángulo SVG del valor mínimo  (izquierda)
const END_DEG   = 0;   // ángulo SVG del valor máximo  (derecha) — 210+300
const SWEEP     = START_DEG // grados totales del arco

export default function GaugeChart({
    value,
    title,
    label,
    unit = '%',
    minValue = 0,
    maxValue = 100,
    size = 280,
    thresholdAcceptable = 50,
    thresholdGood = 70,
    }: GaugeChartProps) {
    const theme = useTheme();

    const cx = size / 2;
    const cy = size / 2 + 10; // bajar levemente el centro para dejar espacio al título
    const outerR = size * 0.42;
    const innerR = outerR - 18;
    const needleR = outerR - 8;
    const trackWidth = 18;

    // Normalizar valor
    const clamped = Math.min(Math.max(value, minValue), maxValue);
    const ratio = (clamped - minValue) / (maxValue - minValue);

    // Ángulo SVG de la aguja (el arco empieza en START_DEG en coords SVG)
    const needleDeg = START_DEG + ratio * SWEEP;

    // Colores de los segmentos
    const badEnd  = START_DEG + (thresholdAcceptable / maxValue) * SWEEP;
    const midEnd  = START_DEG + (thresholdGood       / maxValue) * SWEEP;
    const goodEnd = END_DEG;

    const accentColor = qualityColor(value, theme);

    // Punta de la aguja
    const tip  = needleCoords(cx, cy, needleR, needleDeg);
    const base1 = needleCoords(cx, cy, 10, needleDeg + 90);
    const base2 = needleCoords(cx, cy, 10, needleDeg - 90);

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
            marginBottom: spacing.xs,
            alignSelf: 'flex-start',
            }]}>
            {title}
            </Text>
        )}

        <Svg width={size+10} height={size * 0.72}>
            <Defs>
            <LinearGradient id="trackBg" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={theme.border} stopOpacity="1" />
                <Stop offset="1" stopColor={theme.border} stopOpacity="0.4" />
            </LinearGradient>
            </Defs>

            {/* Pista de fondo (track gris) */}
            <Path
            d={describeArc(cx, cy, outerR - trackWidth / 2, START_DEG, END_DEG - 0.1)}
            fill="none"
            stroke={theme.divider}
            strokeWidth={trackWidth}
            strokeLinecap="round"
            />

            {/* Segmento Deficiente */}
            <Path
            d={describeArc(cx, cy, outerR - trackWidth / 2, START_DEG, badEnd)}
            fill="none"
            stroke={theme.bad}
            strokeWidth={trackWidth}
            strokeLinecap="butt"
            opacity={0.85}
            />

            {/* Segmento Aceptable */}
            <Path
            d={describeArc(cx, cy, outerR - trackWidth / 2, badEnd, midEnd)}
            fill="none"
            stroke={theme.acceptable}
            strokeWidth={trackWidth}
            strokeLinecap="butt"
            opacity={0.85}
            />

            {/* Segmento Bueno */}
            <Path
            d={describeArc(cx, cy, outerR - trackWidth / 2, midEnd, goodEnd - 0.1)}
            fill="none"
            stroke={theme.good}
            strokeWidth={trackWidth}
            strokeLinecap="butt"
            opacity={0.85}
            />

            {/* Marcadores de umbral */}
            {[thresholdAcceptable, thresholdGood].map((thresh, i) => {
            const deg = START_DEG + (thresh / maxValue) * SWEEP;
            const inner = needleCoords(cx, cy, innerR - 4, deg);
            const outer = needleCoords(cx, cy, outerR + 2, deg);
            return (
                <Line
                key={i}
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke={theme.surface}
                strokeWidth={2.5}
                />
            );
            })}

            {/* Etiquetas min/max */}
            <SvgText
            x={needleCoords(cx, cy, outerR + 10, START_DEG).x-2}
            y={needleCoords(cx, cy, outerR + 10, START_DEG).y + 4}
            fontSize={10}
            fill={theme.text.secondary}
            textAnchor="middle"
            >
            {minValue}{unit}
            </SvgText>
            <SvgText
            x={needleCoords(cx, cy, outerR + 10, END_DEG).x}
            y={needleCoords(cx, cy, outerR + 10, END_DEG).y + 4}
            fontSize={10}
            fill={theme.text.secondary}
            textAnchor="middle"
            >
            {maxValue}{unit}
            </SvgText>

            {/* Aguja */}
            <Path
            d={`M ${base1.x} ${base1.y} L ${tip.x} ${tip.y} L ${base2.x} ${base2.y} Z`}
            fill={accentColor}
            opacity={0.9}
            />

            {/* Centro de la aguja */}
            <Circle cx={cx} cy={cy} r={10} fill={theme.surface} stroke={accentColor} strokeWidth={2.5} />
            <Circle cx={cx} cy={cy} r={4}  fill={accentColor} />
        </Svg>

        {/* Label debajo */}
        {label && (
            <Text style={[typography.small, {
            color: theme.text.secondary,
            textAlign: 'center',
            marginTop: -spacing.sm,
            }]}>
            {label}
            </Text>
        )}
        </View>
    );
}