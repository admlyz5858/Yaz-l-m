import Constants from 'expo-constants';

import type { ExamType } from '@/store/onboardingStore';

import fallback from '@/data/examCalendar.fallback.json';

export type RemoteExamEntry = {
  key: string;
  label: string;
  /** ISO 8601 — sınavın yerel başlangıç anı (countdown için) */
  dateIso: string;
};

export type RemoteExamCalendarPayload = {
  version: number;
  updatedAt: string;
  source?: string;
  exams: RemoteExamEntry[];
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function parseExamCalendarPayload(raw: unknown): RemoteExamCalendarPayload {
  if (!isRecord(raw)) throw new Error('Geçersiz JSON');
  const version = raw.version;
  const updatedAt = raw.updatedAt;
  const exams = raw.exams;
  if (typeof version !== 'number' || typeof updatedAt !== 'string' || !Array.isArray(exams)) {
    throw new Error('Takvim şeması eksik');
  }
  const out: RemoteExamEntry[] = [];
  for (const e of exams) {
    if (!isRecord(e)) continue;
    const key = e.key;
    const label = e.label;
    const dateIso = e.dateIso;
    if (typeof key !== 'string' || typeof label !== 'string' || typeof dateIso !== 'string') continue;
    const t = Date.parse(dateIso);
    if (Number.isNaN(t)) continue;
    out.push({ key: key.toUpperCase(), label, dateIso });
  }
  if (out.length === 0) throw new Error('Sınav listesi boş');
  return { version, updatedAt, source: typeof raw.source === 'string' ? raw.source : undefined, exams: out };
}

/** Ortam: app.config.js veya EXPO_PUBLIC_EXAM_CALENDAR_URL (EAS env) */
export function getExamCalendarUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_EXAM_CALENDAR_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) return fromEnv.trim();
  const extra = Constants.expoConfig?.extra as { examCalendarUrl?: string } | undefined;
  if (extra?.examCalendarUrl?.trim()) return extra.examCalendarUrl.trim();
  return '';
}

export function mapOnboardingToCalendarKey(exam: ExamType): string | null {
  switch (exam) {
    case 'YKS':
      return 'YKS';
    case 'LGS':
      return 'LGS';
    case 'KPSS':
      return 'KPSS';
    case 'ALES':
      return 'ALES';
    case 'DGS':
      return 'DGS';
    case 'UNIVERSITY':
      return 'YKS';
    case 'OTHER':
      return null;
    default:
      return null;
  }
}

export function pickExamDateForUser(
  exams: RemoteExamEntry[],
  primaryExam: ExamType,
): RemoteExamEntry | null {
  const k = mapOnboardingToCalendarKey(primaryExam);
  if (!k) return null;
  return exams.find((e) => e.key === k) ?? null;
}

export async function fetchExamCalendarFromUrl(url: string): Promise<RemoteExamCalendarPayload> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: unknown = await res.json();
    return parseExamCalendarPayload(json);
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

export function loadBundledFallback(): RemoteExamCalendarPayload {
  return parseExamCalendarPayload(fallback as unknown);
}
