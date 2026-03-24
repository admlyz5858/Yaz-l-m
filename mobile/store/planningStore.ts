import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ExamType } from '@/store/onboardingStore';
import type { DashboardTask, TaskType } from '@/store/dashboardStore';
import { useDashboardStore } from '@/store/dashboardStore';

export type PlanViewMode = 'week' | 'day' | 'month';

export type PlannedTask = {
  id: string;
  /** Haftanın günü 0=Paz ... 6=Cmt (JS getDay ile uyumlu) */
  weekday: number;
  /** Başlangıç saati 0–23 */
  startHour: number;
  startMinute: number;
  durationMin: number;
  subject: string;
  topic: string;
  color: string;
};

const SUBJECT_COLORS: Record<string, string> = {
  Matematik: '#2563eb',
  Türkçe: '#ea580c',
  Fen: '#16a34a',
  Sosyal: '#9333ea',
  Paragraf: '#0d9488',
  Genel: '#64748b',
};

function colorForSubject(subject: string): string {
  return SUBJECT_COLORS[subject] ?? '#6366f1';
}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** Pazartesi haftası için Paz=0 ... Cmt=6 slot indeksi */
function weekdayIndexMonFirst(jsWeekday: number): number {
  return jsWeekday === 0 ? 6 : jsWeekday - 1;
}

/**
 * Onboarding tercihlerinden haftalık plan üretir (GPT-4o yerine deterministik stub; PDF Bölüm 4).
 */
export function buildWeeklyPlanStub(params: {
  examTypes: ExamType[];
  capacityMin: number;
  slotPrefs: string[];
}): PlannedTask[] {
  const primary = params.examTypes[0] ?? 'YKS';
  const subjects =
    primary === 'LGS'
      ? ['Türkçe', 'Matematik', 'Fen']
      : primary === 'KPSS'
        ? ['Genel Yetenek', 'Genel Kültür']
        : ['Matematik', 'Türkçe', 'Fen'];

  const topics: Record<string, string> = {
    Matematik: 'Fonksiyonlar',
    Türkçe: 'Paragraf',
    Fen: 'Kuvvet ve hareket',
    'Genel Yetenek': 'Sayısal mantık',
    'Genel Kültür': 'Tarih özeti',
    Genel: 'Tekrar',
  };

  const tasks: PlannedTask[] = [];
  let id = 0;
  const blocksPerDay = Math.max(1, Math.min(3, Math.round(params.capacityMin / 90)));
  /** Pazartesi–Cuma (JS: 1–5), Cumartesi 6, Pazar 0 hafif */
  const workDays = [1, 2, 3, 4, 5, 6, 0];

  for (let di = 0; di < workDays.length; di++) {
    const jsDay = workDays[di];
    const isWeekend = jsDay === 0 || jsDay === 6;
    const dayBlocks = isWeekend ? Math.max(1, blocksPerDay - 1) : blocksPerDay;
    let hour = 9 + (di % 3);
    for (let b = 0; b < dayBlocks; b++) {
      const subject = subjects[(di + b) % subjects.length];
      const topic = topics[subject] ?? 'Konu çalışması';
      const duration = Math.min(90, Math.max(30, Math.round(params.capacityMin / Math.max(blocksPerDay, 1))));
      tasks.push({
        id: `plan-${id++}`,
        weekday: jsDay,
        startHour: hour,
        startMinute: 0,
        durationMin: duration,
        subject,
        topic,
        color: colorForSubject(subject),
      });
      hour = Math.min(21, hour + 2);
    }
  }

  return tasks;
}

function plannedTasksToDashboardTasks(planned: PlannedTask[]): DashboardTask[] {
  const typeCycle: TaskType[] = ['topic', 'questions', 'flashcard', 'mock_exam'];
  const today = new Date().getDay();
  const todayTasks = planned.filter((p) => p.weekday === today);
  const pick = todayTasks.length > 0 ? todayTasks : planned.slice(0, 4);
  return pick.slice(0, 7).map((p, i) => ({
    id: `dash-${p.id}`,
    subject: p.subject,
    title: `${p.topic}`,
    minutes: p.durationMin,
    type: typeCycle[i % typeCycle.length],
    done: false,
  }));
}

type PlanningState = {
  weekOffset: number;
  viewMode: PlanViewMode;
  plannedTasks: PlannedTask[];
  planVersion: number;
  lastGeneratedAt: string | null;
  setWeekOffset: (n: number) => void;
  setViewMode: (m: PlanViewMode) => void;
  /** Tercihlerden plan üret, dashboard görevlerini güncelle */
  generatePlanFromPreferences: (prefs: {
    examTypes: ExamType[];
    capacityMin: number;
    slots: string[];
  }) => void;
  moveTask: (id: string, weekday: number, startHour: number, startMinute: number) => void;
  /** Haftalık tamamlanma özeti (stub: plan slotlarına göre) */
  getWeekStats: () => {
    completionPercent: number;
    subjectShares: { subject: string; minutes: number }[];
    plannedMinutes: number;
    actualMinutes: number;
    streakPlanDays: number;
  };
};

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set, get) => ({
      weekOffset: 0,
      viewMode: 'week',
      plannedTasks: [],
      planVersion: 0,
      lastGeneratedAt: null,

      setWeekOffset: (weekOffset) => set({ weekOffset }),
      setViewMode: (viewMode) => set({ viewMode }),

      generatePlanFromPreferences: (prefs) => {
        const plannedTasks = buildWeeklyPlanStub({
          examTypes: prefs.examTypes,
          capacityMin: prefs.capacityMin,
          slotPrefs: prefs.slots,
        });
        const dashTasks = plannedTasksToDashboardTasks(plannedTasks);
        useDashboardStore.getState().replaceTasksFromPlan(dashTasks);
        set({
          plannedTasks,
          planVersion: get().planVersion + 1,
          lastGeneratedAt: new Date().toISOString(),
        });
      },

      moveTask: (id, weekday, startHour, startMinute) =>
        set((s) => ({
          plannedTasks: s.plannedTasks.map((t) =>
            t.id === id ? { ...t, weekday, startHour, startMinute } : t,
          ),
        })),

      getWeekStats: () => {
        const tasks = get().plannedTasks;
        const plannedMinutes = tasks.reduce((a, t) => a + t.durationMin, 0);
        const subjectMap = new Map<string, number>();
        for (const t of tasks) {
          subjectMap.set(t.subject, (subjectMap.get(t.subject) ?? 0) + t.durationMin);
        }
        const subjectShares = [...subjectMap.entries()].map(([subject, minutes]) => ({ subject, minutes }));
        const dash = useDashboardStore.getState().tasks;
        const done = dash.filter((t) => t.done).length;
        const completionPercent = dash.length === 0 ? 0 : Math.round((done / dash.length) * 100);
        const actualMinutes = Math.round((completionPercent / 100) * plannedMinutes);
        return {
          completionPercent,
          subjectShares,
          plannedMinutes,
          actualMinutes,
          streakPlanDays: completionPercent >= 80 ? 3 : completionPercent >= 40 ? 1 : 0,
        };
      },
    }),
    {
      name: 'ladek-academy-planning',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        weekOffset: s.weekOffset,
        viewMode: s.viewMode,
        plannedTasks: s.plannedTasks,
        planVersion: s.planVersion,
        lastGeneratedAt: s.lastGeneratedAt,
      }),
    },
  ),
);

export { startOfWeekMonday, addDays, weekdayIndexMonFirst };
