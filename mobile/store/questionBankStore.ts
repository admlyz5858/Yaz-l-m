import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { QUESTION_BANK, type BankQuestion, type ExamCategory } from '@/data/questionBank';

export type QuestionProgress = {
  attempts: number;
  correctCount: number;
  lastWrong?: boolean;
};

type FilterState = {
  search: string;
  sınavlar: ExamCategory[];
  ders: string | null;
  zorlukMin: number;
  zorlukMax: number;
  onlyWrong: boolean;
  onlyUnsolved: boolean;
  sort: 'zorluk' | 'tarih' | 'doğruluk';
};

type QuestionBankState = {
  progress: Record<string, QuestionProgress>;
  filters: FilterState;
  setSearch: (s: string) => void;
  setFilters: (p: Partial<FilterState>) => void;
  resetFilters: () => void;
  recordAttempt: (questionId: string, correct: boolean) => void;
  getFilteredQuestions: () => BankQuestion[];
};

const defaultFilters = (): FilterState => ({
  search: '',
  sınavlar: [],
  ders: null,
  zorlukMin: 1,
  zorlukMax: 5,
  onlyWrong: false,
  onlyUnsolved: false,
  sort: 'zorluk',
});

function matches(q: BankQuestion, f: FilterState, progress: Record<string, QuestionProgress>): boolean {
  if (f.sınavlar.length > 0 && !f.sınavlar.includes(q.sınav_türü)) return false;
  if (f.ders && q.ders !== f.ders) return false;
  if (q.zorluk < f.zorlukMin || q.zorluk > f.zorlukMax) return false;
  const term = f.search.trim().toLowerCase();
  if (term) {
    const blob = `${q.metin} ${q.konu} ${q.ders}`.toLowerCase();
    if (!blob.includes(term)) return false;
  }
  const pr = progress[q.question_id];
  if (f.onlyWrong && !pr?.lastWrong) return false;
  if (f.onlyUnsolved && pr && pr.attempts > 0) return false;
  return true;
}

export const useQuestionBankStore = create<QuestionBankState>()(
  persist(
    (set, get) => ({
      progress: {},
      filters: defaultFilters(),
      setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
      setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
      resetFilters: () => set({ filters: defaultFilters() }),
      recordAttempt: (questionId, correct) =>
        set((s) => {
          const prev = s.progress[questionId] ?? { attempts: 0, correctCount: 0 };
          return {
            progress: {
              ...s.progress,
              [questionId]: {
                attempts: prev.attempts + 1,
                correctCount: prev.correctCount + (correct ? 1 : 0),
                lastWrong: !correct,
              },
            },
          };
        }),
      getFilteredQuestions: () => {
        const f = get().filters;
        let list = QUESTION_BANK.filter((q) => matches(q, f, get().progress));
        if (f.sort === 'zorluk') list = [...list].sort((a, b) => b.zorluk - a.zorluk);
        if (f.sort === 'doğruluk') list = [...list].sort((a, b) => a.doğru_cevap_oranı - b.doğru_cevap_oranı);
        return list;
      },
    }),
    {
      name: 'ladek-academy-question-progress',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ progress: s.progress }),
    },
  ),
);

export const DERS_LIST = [...new Set(QUESTION_BANK.map((q) => q.ders))].sort();
