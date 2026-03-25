import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SoundPreset = 'silent' | 'rain' | 'library' | 'lofi' | 'forest';

export type PomodoroSettings = {
  workSec: number;
  shortBreakSec: number;
  longBreakSec: number;
  /** Kaç çalışmadan sonra uzun mola */
  sessionsUntilLong: number;
  soundPreset: SoundPreset;
};

type SessionEntry = {
  at: string;
  workMinutes: number;
  subject?: string;
};

type PomodoroState = {
  settings: PomodoroSettings;
  /** Bugün tamamlanan çalışma (odak) oturumu sayısı — gün değişince sıfırlanır */
  completedWorkToday: number;
  dayKey: string;
  streakDays: number;
  lastStreakDate: string | null;
  totalWorkMinutes: number;
  sessionLog: SessionEntry[];
  setSettings: (p: Partial<PomodoroSettings>) => void;
  /** Çalışma oturumu bittiğinde */
  recordWorkSession: (workMinutes: number, subject?: string) => void;
  resetTodayIfNeeded: () => void;
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const defaultSettings = (): PomodoroSettings => ({
  workSec: 25 * 60,
  shortBreakSec: 5 * 60,
  longBreakSec: 15 * 60,
  sessionsUntilLong: 4,
  soundPreset: 'silent',
});

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings(),
      completedWorkToday: 0,
      dayKey: todayKey(),
      streakDays: 0,
      lastStreakDate: null,
      totalWorkMinutes: 0,
      sessionLog: [],

      resetTodayIfNeeded: () => {
        const t = todayKey();
        if (get().dayKey !== t) {
          set({ dayKey: t, completedWorkToday: 0 });
        }
      },

      setSettings: (patch) =>
        set((s) => ({
          settings: { ...s.settings, ...patch },
        })),

      recordWorkSession: (workMinutes, subject) => {
        get().resetTodayIfNeeded();
        const today = todayKey();
        const y = yesterdayKey();
        const s = get();
        const last = s.lastStreakDate;

        let newStreak = s.streakDays;
        if (last === today) {
          newStreak = s.streakDays;
        } else if (last === y) {
          newStreak = s.streakDays + 1;
        } else {
          newStreak = 1;
        }

        set((st) => {
          const log = [{ at: new Date().toISOString(), workMinutes, subject }, ...st.sessionLog].slice(0, 80);
          return {
            completedWorkToday: st.completedWorkToday + 1,
            dayKey: today,
            streakDays: newStreak,
            lastStreakDate: today,
            totalWorkMinutes: st.totalWorkMinutes + workMinutes,
            sessionLog: log,
          };
        });
      },
    }),
    {
      name: 'ladek-academy-pomodoro',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        settings: s.settings,
        completedWorkToday: s.completedWorkToday,
        dayKey: s.dayKey,
        streakDays: s.streakDays,
        lastStreakDate: s.lastStreakDate,
        totalWorkMinutes: s.totalWorkMinutes,
        sessionLog: s.sessionLog,
      }),
    },
  ),
);
