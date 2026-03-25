/**
 * LadeK Academy — Marka renkleri
 * Lacivert, elektrik mavisi, cyan (kitap + dijital ağaç teması)
 */

export const colors = {
  primary: '#2563eb',        // Royal / electric blue
  primaryDark: '#0c1929',    // Deep navy
  secondary: '#22d3ee',      // Cyan glow / vurgu
  secondaryLight: '#67e8f9',

  gradientStart: '#0a1628',
  gradientEnd: '#1e40af',

  white: '#ffffff',
  black: '#020617',
  background: '#f1f5f9',   // Slate 100 — açık yüzey
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',

  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#0ea5e9',
} as const;

export const brand = {
  appName: 'LadeK',
  appNameFull: 'LadeK Academy',
  tagline: 'Akıllı sınav hazırlık ve AI destekli öğrenme',
} as const;
