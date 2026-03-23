/**
 * ZekaAkademi - Tema Renkleri
 * Belgeye uygun: Gradient lacivert → mor
 */

export const colors = {
  // Ana palette
  primary: '#1a237e',      // Lacivert
  primaryDark: '#0d1347',
  secondary: '#7c4dff',    // Mor
  secondaryLight: '#b47cff',

  // Gradient
  gradientStart: '#1a237e',
  gradientEnd: '#7c4dff',

  // UI
  white: '#ffffff',
  black: '#000000',
  background: '#f5f5f7',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',

  // Durum
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
} as const;
