import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BankQuestion, ExamCategory } from '@/data/questionBank';
import { QUESTION_BANK } from '@/data/questionBank';

export type MockExamPreset = {
  id: string;
  label: string;
  exam: ExamCategory;
  subject: string;
  questionCount: number;
  durationSec: number;
};

export const MOCK_EXAM_PRESETS: MockExamPreset[] = [
  {
    id: 'lgs_tr',
    label: 'LGS — Türkçe',
    exam: 'LGS',
    subject: 'Türkçe',
    questionCount: 20,
    durationSec: 40 * 60,
  },
  {
    id: 'tyt_tr',
    label: 'YKS TYT — Türkçe',
    exam: 'YKS_TYT',
    subject: 'Türkçe',
    questionCount: 15,
    durationSec: 45 * 60,
  },
];

type HistoryRow = {
  id: string;
  presetId: string;
  correct: number;
  total: number;
  durationSec: number;
  at: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(preset: MockExamPreset): BankQuestion[] {
  const pool = QUESTION_BANK.filter(
    (q) =>
      q.sınav_türü === preset.exam &&
      q.ders === preset.subject &&
      q.soru_tipi === 'MCQ' &&
      q.şıklar &&
      q.doğru_index !== undefined,
  );
  const ordered = shuffle(pool);
  const out: BankQuestion[] = [];
  for (const q of ordered) {
    if (out.length >= preset.questionCount) break;
    out.push(q);
  }
  if (out.length < preset.questionCount) {
    const fallback = shuffle(
      QUESTION_BANK.filter((q) => q.soru_tipi === 'MCQ' && q.şıklar && q.doğru_index !== undefined),
    );
    const used = new Set(out.map((q) => q.question_id));
    for (const q of fallback) {
      if (out.length >= preset.questionCount) break;
      if (used.has(q.question_id)) continue;
      used.add(q.question_id);
      out.push(q);
    }
  }
  return out;
}

type MockExamStore = {
  presetId: string | null;
  questionIds: string[];
  answers: Record<string, number | null>;
  startedAt: number | null;
  endsAt: number | null;
  finishedAt: number | null;
  history: HistoryRow[];
  startPreset: (preset: MockExamPreset) => void;
  setAnswer: (questionId: string, choiceIndex: number) => void;
  timeUp: () => void;
  finish: () => { correct: number; total: number; durationSec: number } | null;
  clearSession: () => void;
};

export const useMockExamStore = create<MockExamStore>()(
  persist(
    (set, get) => ({
      presetId: null,
      questionIds: [],
      answers: {},
      startedAt: null,
      endsAt: null,
      finishedAt: null,
      history: [],

      startPreset: (preset) => {
        const qs = pickQuestions(preset);
        const now = Date.now();
        const answers: Record<string, number | null> = {};
        for (const q of qs) answers[q.question_id] = null;
        set({
          presetId: preset.id,
          questionIds: qs.map((q) => q.question_id),
          answers,
          startedAt: now,
          endsAt: now + preset.durationSec * 1000,
          finishedAt: null,
        });
      },

      setAnswer: (questionId, choiceIndex) => {
        if (get().finishedAt) return;
        set((s) => ({
          answers: { ...s.answers, [questionId]: choiceIndex },
        }));
      },

      timeUp: () => {
        const s = get();
        if (s.finishedAt || !s.presetId) return;
        get().finish();
      },

      finish: () => {
        const s = get();
        if (!s.presetId || !s.startedAt || s.finishedAt) return null;
        const endTime = Date.now();
        let correct = 0;
        for (const id of s.questionIds) {
          const q = QUESTION_BANK.find((x) => x.question_id === id);
          const a = s.answers[id];
          if (q && q.doğru_index !== undefined && a === q.doğru_index) correct += 1;
        }
        const total = s.questionIds.length;
        const durationSec = Math.max(1, Math.round((endTime - s.startedAt) / 1000));
        const row: HistoryRow = {
          id: `${endTime}`,
          presetId: s.presetId,
          correct,
          total,
          durationSec,
          at: endTime,
        };
        set((state) => ({
          finishedAt: endTime,
          history: [row, ...state.history].slice(0, 20),
        }));
        return { correct, total, durationSec };
      },

      clearSession: () =>
        set({
          presetId: null,
          questionIds: [],
          answers: {},
          startedAt: null,
          endsAt: null,
          finishedAt: null,
        }),
    }),
    {
      name: 'ladek-academy-mock-exam',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ history: s.history }),
    },
  ),
);

export function getQuestionsForActiveSession(): BankQuestion[] {
  const ids = useMockExamStore.getState().questionIds;
  return ids
    .map((id) => QUESTION_BANK.find((q) => q.question_id === id))
    .filter((q): q is BankQuestion => q != null);
}
