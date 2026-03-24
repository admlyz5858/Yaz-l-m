/**
 * ZekaAkademi - Tema Renkleri
 * Teal & Amber - Sıcak, modern, eğitim odaklı
 */

export const colors = {
  // Ana palette
  primary: '#0d9488',       // Teal 600
  primaryDark: '#0f766e',   // Teal 700
  secondary: '#f59e0b',     // Amber 500
  secondaryLight: '#fbbf24',

  // Gradient (Splash, Onboarding, Auth)
  gradientStart: '#0f766e',
  gradientEnd: '#0d9488',

  // UI
  white: '#ffffff',
  black: '#0f172a',
  background: '#f0fdfa',    // Teal 50
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',

  // Durum
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#0ea5e9',
} as const;
