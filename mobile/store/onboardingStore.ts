import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ExamType = 'YKS' | 'LGS' | 'KPSS' | 'ALES' | 'DGS' | 'UNIVERSITY' | 'OTHER';

export type YksField = 'SAY' | 'EA' | 'SOZ' | 'DIL';

export type OnboardingDraft = {
  fullName: string;
  examTypes: ExamType[];
  yksField?: YksField;
  targetNet?: string;
};

type OnboardingState = {
  completed: boolean;
  draft: OnboardingDraft;
  setCompleted: (v: boolean) => void;
  setDraft: (patch: Partial<OnboardingDraft>) => void;
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
      setCompleted: (completed) => set({ completed }),
      setDraft: (patch) =>
        set((s) => ({
          draft: { ...s.draft, ...patch },
        })),
      resetDraft: () => set({ draft: emptyDraft() }),
    }),
    {
      name: 'zeka-akademi-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ completed: s.completed, draft: s.draft }),
    },
  ),
);
