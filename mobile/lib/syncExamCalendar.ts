import { useDashboardStore } from '@/store/dashboardStore';
import type { ExamType } from '@/store/onboardingStore';
import { useOnboardingStore } from '@/store/onboardingStore';

import {
  fetchExamCalendarFromUrl,
  getExamCalendarUrl,
  loadBundledFallback,
  pickExamDateForUser,
  type RemoteExamCalendarPayload,
} from './examCalendarRemote';

export type SyncExamCalendarResult = {
  ok: boolean;
  skipped?: boolean;
  usedFallback?: boolean;
  error?: string;
};

function applyPayload(payload: RemoteExamCalendarPayload, primaryExam: ExamType) {
  const picked = pickExamDateForUser(payload.exams, primaryExam);
  if (!picked) {
    return { ok: false as const, error: 'Profildeki sınav türü için takvimde kayıt yok.' };
  }
  useDashboardStore.getState().applyRemoteExamDate(picked.dateIso, {
    updatedAt: payload.updatedAt,
    version: payload.version,
    sourceLabel: payload.source,
  });
  return { ok: true as const };
}

/**
 * Uzaktan JSON takvimi çeker ve geri sayım tarihini günceller.
 * URL yoksa bundle içi `examCalendar.fallback.json` kullanılır (offline / örnek).
 */
export async function syncExamCalendarIfPossible(): Promise<SyncExamCalendarResult> {
  const ob = useOnboardingStore.getState();
  if (!ob.completed || ob.draft.examTypes.length === 0) {
    return { ok: true, skipped: true };
  }
  const primary = ob.draft.examTypes[0];
  const url = getExamCalendarUrl();

  if (url) {
    try {
      const payload = await fetchExamCalendarFromUrl(url);
      const r = applyPayload(payload, primary);
      if (!r.ok) return { ok: false, error: r.error };
      return { ok: true };
    } catch (e) {
      try {
        const fallback = loadBundledFallback();
        const r = applyPayload(fallback, primary);
        if (!r.ok) return { ok: false, error: r.error };
        return { ok: true, usedFallback: true };
      } catch {
        return {
          ok: false,
          error: e instanceof Error ? e.message : 'Takvim yüklenemedi',
        };
      }
    }
  }

  try {
    const fallback = loadBundledFallback();
    const r = applyPayload(fallback, primary);
    if (!r.ok) return { ok: false, error: r.error };
    return { ok: true, skipped: true, usedFallback: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Yerel takvim okunamadı' };
  }
}
