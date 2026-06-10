// theme.ts

import { useColorScheme } from 'react-native';

// ─── Paleta base (de la imagen) ───────────────────────────────────────────────
export const PALETTE = {
  blue:       '#525FE1',
  orange:     '#F86F03',
  amber:      '#FFA41B',
  cream:      '#FFF6F4',

  // Calidad
  bad:        '#f81303',
  deficient:  '#F86F03', // orange — mal estado
  acceptable: '#FFA41B', // amber  — estado medio
  good:       '#22c55e', // verde  — buen estado (externo a la paleta, semántico)

  // Neutros claros
  white:      '#FFFFFF',
  gray50:     '#F8F9FA',
  gray100:    '#F1F3F5',
  gray200:    '#E9ECEF',
  gray400:    '#ADB5BD',
  gray600:    '#6C757D',
  gray800:    '#343A40',
  gray900:    '#212529',

  // Neutros oscuros
  dark900:    '#0F0F14',
  dark800:    '#16161E',
  dark700:    '#1E1E2A',
  dark600:    '#2A2A3A',
  dark400:    '#4A4A6A',
  dark200:    '#8888AA',
};

// ─── Tokens semánticos por tema ───────────────────────────────────────────────
export const lightTheme = {
  primary:           PALETTE.blue,
  primarySoft:       '#ECEFFE',   // blue al 10% sobre blanco
  accent:            PALETTE.orange,
  accentSoft:        '#FEF0E6',

  bad:               PALETTE.bad,
  deficient:         PALETTE.deficient,
  acceptable:        PALETTE.acceptable,
  good:              PALETTE.good,

  background:        PALETTE.gray50,
  surface:           PALETTE.white,
  surfaceRaised:     PALETTE.white,
  border:            PALETTE.gray200,
  divider:           PALETTE.gray100,

  text: {
    primary:         PALETTE.gray900,
    secondary:       PALETTE.gray600,
    disabled:        PALETTE.gray400,
    inverse:         PALETTE.white,
    onPrimary:       PALETTE.white,
    onAccent:        PALETTE.white,
  },

  shadow: {
    color:           '#000000',
    opacity:         0.08,
    radius:          8,
    offset:          { width: 0, height: 2 },
    elevation:       3,
  },
};

export const darkTheme: typeof lightTheme = {
  primary:           '#7B85F0',   // blue aclarado para contraste sobre oscuro
  primarySoft:       '#1E2040',
  accent:            PALETTE.amber,
  accentSoft:        '#2A1F0A',

  deficient:         '#FF8C3A',   // naranja más brillante sobre oscuro
  acceptable:        '#FFB740',
  good:              '#4ADE80',

  background:        PALETTE.dark900,
  surface:           PALETTE.dark800,
  surfaceRaised:     PALETTE.dark700,
  border:            PALETTE.dark600,
  divider:           PALETTE.dark700,

  text: {
    primary:         '#F0F0F8',
    secondary:       PALETTE.dark200,
    disabled:        PALETTE.dark400,
    inverse:         PALETTE.gray900,
    onPrimary:       PALETTE.white,
    onAccent:        PALETTE.gray900,
  },

  shadow: {
    color:           '#000000',
    opacity:         0.3,
    radius:          12,
    offset:          { width: 0, height: 4 },
    elevation:       6,
  },
};

// ─── Hook de conveniencia ─────────────────────────────────────────────────────
export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}

export type Theme = typeof lightTheme;

// ─── Tipografía ───────────────────────────────────────────────────────────────
export const typography = {
  h1:      { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2:      { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3:      { fontSize: 18, fontWeight: '600' as const },
  body:    { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  small:   { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label:   { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5 },
  score:   { fontSize: 32, fontWeight: '800' as const, letterSpacing: -1 },
};

// ─── Espaciado y radios ───────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

// ─── Helper: color de calidad ─────────────────────────────────────────────────
export function qualityColor(score: number, theme: Theme): string {
  if (score >= 70) return theme.good;
  if (score >= 50) return theme.acceptable;
  return theme.deficient;
}