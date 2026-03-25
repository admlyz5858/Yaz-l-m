/**
 * Merkezi tema — LadeK Academy
 */
import { colors } from './colors';

export const theme = {
  ...colors,
  headerBg: colors.surface,
  headerText: colors.primaryDark,
  cardBg: colors.surface,
  accent: colors.primary,
} as const;
