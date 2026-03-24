/**
 * Ladek ACADEMY — marka renkleri (koyu lacivert, elektrik mavisi, cyan vurgu).
 */
export const Brand = {
  /** Ana arka plan */
  navy: '#0a1628',
  navyMid: '#0f2744',
  navyLight: '#152a45',
  /** Elektrik mavisi / vurgu */
  electric: '#22d3ee',
  electricDim: '#06b6d4',
  /** Ağaç / devre parıltısı */
  glow: '#67e8f9',
  glowTop: '#a7f3d0',
  accent: '#38bdf8',
  success: '#22c55e',
  warning: '#f97316',
  danger: '#ef4444',
  /** Eski mor tonları — bazı ekranlarda geçiş için */
  purple: '#6b21a8',
  purpleLight: '#a855f7',
} as const;

export const BrandStrings = {
  appName: 'Ladek',
  appNameFull: 'Ladek ACADEMY',
  tagline: 'Akıllı sınav hazırlığı',
} as const;

export const Splash = {
  durationMs: 3200,
} as const;
