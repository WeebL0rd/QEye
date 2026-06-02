import { StyleSheet } from 'react-native';
import type { Theme } from './theme';
import { spacing, radius, typography } from './theme';

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
export function createGlobalStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: spacing.md,
      paddingBottom: spacing.xxl,
    },
    safeArea: {
      flex: 1,
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: spacing.md,
    },
  });
}

// ─── STAGE CARD STYLES ─────────────────────────────────────────────────────────
export function createStageCardStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      marginVertical: spacing.sm,
      shadowColor: theme.shadow.color,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      shadowOffset: theme.shadow.offset,
      elevation: theme.shadow.elevation,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.xs,
    },
    name: {
      ...typography.h3,
      color: theme.text.primary,
      flex: 1,
      marginRight: spacing.sm,
    },
    weightBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    weightText: {
      ...typography.label,
      color: theme.primary,
    },
    description: {
      ...typography.body,
      color: theme.text.secondary,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.sm,
    },
    metaText: {
      ...typography.small,
      color: theme.text.secondary,
    },
  });
}

// ─── ITEM CARD STYLES ──────────────────────────────────────────────────────────
export function createItemCardStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      marginVertical: spacing.sm,
      shadowColor: theme.shadow.color,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      shadowOffset: theme.shadow.offset,
      elevation: theme.shadow.elevation,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.xs,
    },
    name: {
      ...typography.body,
      fontWeight: '600',
      color: theme.text.primary,
      flex: 1,
      marginRight: spacing.sm,
    },
    weightBadge: {
      backgroundColor: theme.primarySoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    weightText: {
      ...typography.label,
      color: theme.primary,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    criteriaCount: {
      ...typography.small,
      color: theme.text.secondary,
    },
  });
}

// ─── CRITERION CARD STYLES ─────────────────────────────────────────────────────
export function createCriterionCardStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: radius.md,
      padding: spacing.lg,
      marginVertical: spacing.sm,
      shadowColor: theme.shadow.color,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      shadowOffset: theme.shadow.offset,
      elevation: theme.shadow.elevation,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    name: {
      ...typography.h3,
      color: theme.text.primary,
      flex: 1,
      marginRight: spacing.sm,
    },
    weightBadge: {
      backgroundColor: theme.accentSoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    weightText: {
      ...typography.label,
      color: theme.accent,
    },
    description: {
      ...typography.body,
      color: theme.text.secondary,
      lineHeight: 22,
      marginBottom: spacing.md,
    },
  });
}

// ─── SCORE SELECTOR STYLES ─────────────────────────────────────────────────────
export function createScoreSelectorStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      marginTop: spacing.sm,
    },
    label: {
      ...typography.label,
      color: theme.text.primary,
      marginBottom: spacing.sm,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.xs,
    },
    scoreButton: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: radius.sm,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreButtonText: {
      ...typography.h2,
      fontWeight: '800',
    },
    scoreButtonUnselected: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
    },
    scoreButtonTextUnselected: {
      color: theme.text.primary,
    },
  });
}

// ─── PROGRESS BAR STYLES ───────────────────────────────────────────────────────
export function createProgressBarStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      marginVertical: spacing.md,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    label: {
      ...typography.small,
      color: theme.text.secondary,
    },
    percentage: {
      ...typography.small,
      fontWeight: '600',
      color: theme.text.primary,
    },
    track: {
      height: 8,
      backgroundColor: theme.divider,
      borderRadius: radius.full,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: radius.full,
    },
  });
}

// ─── BUTTON STYLES ─────────────────────────────────────────────────────────────
export function createButtonStyles(theme: Theme) {
  return StyleSheet.create({
    primary: {
      backgroundColor: theme.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryText: {
      ...typography.body,
      fontWeight: '600',
      color: theme.text.onPrimary,
    },
    secondary: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryText: {
      ...typography.body,
      fontWeight: '600',
      color: theme.text.primary,
    },
    accent: {
      backgroundColor: theme.accent,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accentText: {
      ...typography.body,
      fontWeight: '600',
      color: theme.text.onAccent,
    },
  });
}

// ─── SCREEN HEADER STYLES ──────────────────────────────────────────────────────
export function createScreenHeaderStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      backgroundColor: theme.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    title: {
      ...typography.h1,
      color: theme.text.primary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body,
      color: theme.text.secondary,
    },
    metaRow: {
      flexDirection: 'row',
      marginTop: spacing.sm,
      gap: spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    metaText: {
      ...typography.small,
      color: theme.text.secondary,
    },
  });
}

// ─── QUALITY INDICATOR STYLES ──────────────────────────────────────────────────
export function createQualityIndicatorStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    badgeText: {
      ...typography.label,
      color: theme.text.inverse,
    },
    scoreText: {
      ...typography.h2,
      fontWeight: '800',
    },
  });
}
