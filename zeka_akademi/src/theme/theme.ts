/**
 * Merkezi tema - tüm ekranlar buradan renk alır
 */
import { colors } from './colors';

export const theme = {
  ...colors,
  // Kısayollar
  headerBg: colors.surface,
  headerText: colors.primaryDark,
  cardBg: colors.surface,
  accent: colors.primary,
} as const;
