/**
 * Basitleştirilmiş aralıklı tekrar (PDF Bölüm 6.3 FSRS — tam model yerine MVP).
 * 1–5 derecesi: Yeniden | Zor | Orta | Kolay | Çok Kolay
 */

export type FsrsRating = 1 | 2 | 3 | 4 | 5;

export type CardSchedule = {
  /** Sonraki gösterim (epoch ms) */
  due: number;
  /** Tahmini aralık (gün) */
  intervalDays: number;
  /** Kolaylık faktörü (SM-2 benzeri) */
  ease: number;
  tekrarSayısı: number;
};

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function initialSchedule(): CardSchedule {
  return {
    due: Date.now(),
    intervalDays: 0,
    ease: 2.5,
    tekrarSayısı: 0,
  };
}

/**
 * Yeni zamanlama; ilk başarılı cevapta kısa aralıklar, sonra ease ile büyüme.
 */
export function scheduleAfterReview(prev: CardSchedule, rating: FsrsRating): CardSchedule {
  const now = Date.now();

  if (rating === 1) {
    return {
      due: now + 10 * MINUTE,
      intervalDays: 0,
      ease: Math.max(1.3, prev.ease - 0.2),
      tekrarSayısı: prev.tekrarSayısı + 1,
    };
  }

  let ease = prev.ease;
  let intervalDays = prev.intervalDays;

  if (prev.intervalDays === 0 || prev.tekrarSayısı === 0) {
    const firstSuccess: Record<Exclude<FsrsRating, 1>, number> = {
      2: 0.5,
      3: 1,
      4: 3,
      5: 7,
    };
    intervalDays = firstSuccess[rating as Exclude<FsrsRating, 1>];
    ease += [0, 0, 0, 0.05, 0.1][rating - 1] ?? 0;
  } else {
    const mult: Record<Exclude<FsrsRating, 1>, number> = {
      2: 1.3,
      3: 2.0,
      4: 2.8,
      5: 4.0,
    };
    intervalDays = Math.max(0.5, prev.intervalDays * mult[rating as Exclude<FsrsRating, 1>]);
    ease += [0, -0.05, 0, 0.05, 0.1][rating - 1] ?? 0;
    ease = Math.min(3.0, Math.max(1.3, ease));
  }

  const due = now + intervalDays * DAY;

  return {
    due,
    intervalDays,
    ease,
    tekrarSayısı: prev.tekrarSayısı + 1,
  };
}

export function isDue(s: CardSchedule, now = Date.now()): boolean {
  return s.due <= now;
}

export function formatDueLabel(s: CardSchedule, now = Date.now()): string {
  if (s.due <= now) return 'Şimdi';
  const diffMin = Math.round((s.due - now) / MINUTE);
  if (diffMin < 60) return `${diffMin} dk sonra`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} saat sonra`;
  const diffD = Math.round((s.due - now) / DAY);
  return `${diffD} gün sonra`;
}
