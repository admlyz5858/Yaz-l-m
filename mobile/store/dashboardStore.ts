import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ExamType } from '@/store/onboardingStore';

export type TaskType = 'topic' | 'questions' | 'flashcard' | 'mock_exam';

export type DashboardTask = {
  id: string;
  subject: string;
  title: string;
  minutes: number;
  type: TaskType;
  done: boolean;
};

type DashboardState = {
  /** 0–100 — bugünkü planlanan süre içinde tamamlanan oran */
  dailyGoalPercent: number;
  streakDays: number;
  /** Birincil sınav etiketi + hedef tarih (ISO) */
  primaryExamLabel: string;
  targetExamDateIso: string;
  /** İkincil sınav chip (opsiyonel) */
  secondaryExamChip?: string;
  tasks: DashboardTask[];
  /** Basit liderlik sırası (MVP mock) */
  leaderboardRankToday: number;
  setTaskDone: (id: string, done: boolean) => void;
  toggleTask: (id: string) => void;
  /** AI plan üretildiğinde görev listesini değiştirir */
  replaceTasksFromPlan: (tasks: DashboardTask[]) => void;
  seedFromOnboarding: (examTypes: ExamType[], fullName?: string) => void;
};

const examLabels: Record<ExamType, string> = {
  YKS: 'YKS',
  LGS: 'LGS',
  KPSS: 'KPSS',
  ALES: 'ALES',
  DGS: 'DGS',
  UNIVERSITY: 'Üniversite',
  OTHER: 'Sınav',
};

function defaultExamDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

function buildSeedTasks(examTypes: ExamType[]): DashboardTask[] {
  const primary = examTypes[0] ?? 'YKS';
  const subjectMap: Record<ExamType, string> = {
    YKS: 'Matematik',
    LGS: 'Türkçe',
    KPSS: 'Genel Yetenek',
    ALES: 'Sayısal',
    DGS: 'Sayısal',
    UNIVERSITY: 'Ders çalışması',
    OTHER: 'Genel',
  };
  const s = subjectMap[primary] ?? 'Genel';

  return [
    {
      id: 't1',
      subject: s,
      title: 'Konu özeti + örnek sorular',
      minutes: 45,
      type: 'topic',
      done: false,
    },
    {
      id: 't2',
      subject: 'Paragraf',
      title: 'Soru bankası — 15 soru',
      minutes: 30,
      type: 'questions',
      done: false,
    },
    {
      id: 't3',
      subject: 'Kavram',
      title: 'Flash kart tekrarı',
      minutes: 15,
      type: 'flashcard',
      done: false,
    },
    {
      id: 't4',
      subject: 'Genel',
      title: 'Mini deneme (20 soru)',
      minutes: 40,
      type: 'mock_exam',
      done: false,
    },
  ];
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dailyGoalPercent: 0,
      streakDays: 0,
      primaryExamLabel: 'YKS',
      targetExamDateIso: defaultExamDate(127),
      secondaryExamChip: undefined,
      tasks: [],
      leaderboardRankToday: 42,
      setTaskDone: (id, done) =>
        set((s) => {
          const tasks = s.tasks.map((t) => (t.id === id ? { ...t, done } : t));
          const total = tasks.length;
          const completed = tasks.filter((t) => t.done).length;
          const dailyGoalPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
          return { tasks, dailyGoalPercent };
        }),
      toggleTask: (id) => {
        const t = get().tasks.find((x) => x.id === id);
        if (t) get().setTaskDone(id, !t.done);
      },
      replaceTasksFromPlan: (tasks) => {
        const dailyGoalPercent =
          tasks.length === 0 ? 0 : Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
        set({ tasks, dailyGoalPercent });
      },
      seedFromOnboarding: (examTypes, _fullName) => {
        if (get().tasks.length > 0) return;
        const primary = examTypes[0];
        const label = primary ? examLabels[primary] : 'YKS';
        set({
          primaryExamLabel: label,
          targetExamDateIso: defaultExamDate(127),
          secondaryExamChip: examTypes[1] ? examLabels[examTypes[1]] : undefined,
          tasks: buildSeedTasks(examTypes.length ? examTypes : ['YKS']),
          dailyGoalPercent: 0,
        });
      },
    }),
    {
      name: 'zeka-akademi-dashboard',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        dailyGoalPercent: s.dailyGoalPercent,
        streakDays: s.streakDays,
        primaryExamLabel: s.primaryExamLabel,
        targetExamDateIso: s.targetExamDateIso,
        secondaryExamChip: s.secondaryExamChip,
        tasks: s.tasks,
        leaderboardRankToday: s.leaderboardRankToday,
      }),
    },
  ),
);

export function getGreetingName(fullName?: string): string {
  if (!fullName?.trim()) return '';
  return fullName.trim().split(/\s+/)[0] ?? '';
}

export function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

export function formatCountdown(targetIso: string): { line1: string; line2: string; urgency: 'normal' | 'soon' | 'critical' } {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  let urgency: 'normal' | 'soon' | 'critical' = 'normal';
  if (days <= 7) urgency = 'critical';
  else if (days <= 30) urgency = 'soon';

  return {
    line1: `${days} gün ${hours} saat`,
    line2: 'Hazırlık sürecinin bir kısmını tamamladın — hedefe odaklan.',
    urgency,
  };
}
