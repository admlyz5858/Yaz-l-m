/**
 * LadeK Academy — marka (koyu lacivert, elektrik cyan #00E5FF, beyaz tipografi).
 */
export const Brand = {
  navy: '#002B5B',
  navyDeep: '#001a35',
  navyMid: '#0a2540',
  navyLight: '#152a45',
  /** Marka birincil cyan */
  electric: '#00E5FF',
  electricDim: '#06b6d4',
  royal: '#2563eb',
  glow: '#67e8f9',
  glowTop: '#a7f3d0',
  accent: '#38bdf8',
  success: '#22c55e',
  warning: '#f97316',
  danger: '#ef4444',
  purple: '#6b21a8',
  purpleLight: '#a855f7',
} as const;

/** Görünen isimler — “LadeK” içinde büyük K */
export const BrandStrings = {
  appName: 'LadeK',
  appNameFull: 'LadeK ACADEMY',
  /** Cümle içi / mağaza adı */
  appNameSentence: 'LadeK Academy',
  tagline: 'Akıllı sınav hazırlığı',
} as const;

export const Splash = {
  durationMs: 3400,
} as const;
