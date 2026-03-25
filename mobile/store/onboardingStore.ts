import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Katalog `trExamCatalog` kimlikleri (ÖSYM/MEB/diğer) + geriye dönük uyumluluk.
 * Yeni eklenen her sınav `ExamCatalogItem.id` ile burada temsil edilir.
 */
export type ExamType = string;

export type YksField = 'SAY' | 'EA' | 'SOZ' | 'DIL';

export type StudySlotPref = 'MORNING' | 'NOON' | 'EVENING' | 'NIGHT';

export type OnboardingDraft = {
  fullName: string;
  examTypes: ExamType[];
  yksField?: YksField;
  targetNet?: string;
};

type OnboardingState = {
  completed: boolean;
  draft: OnboardingDraft;
  /** AI plan tercihleri (PDF Bölüm 2.7 / 4) */
  planningPreferences: { capacityMin: number; slots: StudySlotPref[] } | null;
  setCompleted: (v: boolean) => void;
  setDraft: (patch: Partial<OnboardingDraft>) => void;
  setPlanningPreferences: (p: { capacityMin: number; slots: StudySlotPref[] }) => void;
  resetDraft: () => void;
};

const emptyDraft = (): OnboardingDraft => ({
  fullName: '',
  examTypes: [],
});

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      draft: emptyDraft(),
      planningPreferences: null,
      setCompleted: (completed) => set({ completed }),
      setDraft: (patch) =>
        set((s) => ({
          draft: { ...s.draft, ...patch },
        })),
      setPlanningPreferences: (planningPreferences) => set({ planningPreferences }),
      resetDraft: () => set({ draft: emptyDraft(), planningPreferences: null }),
    }),
    {
      name: 'ladek-academy-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        completed: s.completed,
        draft: s.draft,
        planningPreferences: s.planningPreferences,
      }),
    },
  ),
);
