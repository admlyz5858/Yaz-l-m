import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tab = 'home' | 'focus' | 'leaderboard' | 'groups' | 'badges'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  premium: boolean
  unlockedAt?: number
}

export interface PowerUp {
  id: 'xp_multiplier' | 'streak_shield'
  name: string
  description: string
  icon: string
  cost: number
  active: boolean
  expiresAt?: number
}

export interface StudyGroup {
  id: string
  name: string
  icon: string
  description: string
  members: number
  weeklyGoalHours: number
  currentHours: number
  joined: boolean
}

export interface WeeklyTask {
  id: string
  description: string
  target: number
  current: number
  unit: string
  xpReward: number
  completed: boolean
}

export interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  xp: number
  level: number
  isMe?: boolean
  streak: number
}

export type PetMood = 'sleeping' | 'sad' | 'neutral' | 'happy' | 'excited'

export interface AppState {
  // Navigation
  activeTab: Tab
  setActiveTab: (tab: Tab) => void

  // User stats
  xp: number
  level: number
  xpToNextLevel: number
  totalStudyMinutes: number
  weeklyStudyMinutes: number
  todayStudyMinutes: number
  streak: number
  selectedTitle: string
  username: string

  // Pomodoro
  pomodoroActive: boolean
  pomodoroTimeLeft: number
  pomodoroTotalTime: number
  pomodoroPhase: 'work' | 'break'
  pomodoroCount: number
  todayPomodoros: number
  weeklyPomodoros: number

  // Gamification
  badges: Badge[]
  powerUps: PowerUp[]
  weeklyTasks: WeeklyTask[]
  levelUpModal: boolean
  newLevel: number

  // Social
  leaderboard: LeaderboardEntry[]
  studyGroups: StudyGroup[]

  // Pet
  petMood: PetMood
  petName: string

  // Actions
  startPomodoro: () => void
  pausePomodoro: () => void
  resetPomodoro: () => void
  tickPomodoro: () => void
  addXP: (amount: number) => void
  closeLevelUpModal: () => void
  buyPowerUp: (id: PowerUp['id']) => void
  joinGroup: (id: string) => void
  selectTitle: (title: string) => void
  completeWeeklyTask: (id: string) => void
  updatePetMood: () => void
}

export const LEVELS = [
  { level: 1, title: 'Yeni Öğrenci', xpRequired: 0 },
  { level: 2, title: 'Çalışkan Öğrenci', xpRequired: 500 },
  { level: 3, title: 'Azimli Öğrenci', xpRequired: 1200 },
  { level: 4, title: 'Kararlı Öğrenci', xpRequired: 2500 },
  { level: 5, title: 'Yıldız Öğrenci', xpRequired: 4500 },
  { level: 6, title: 'Uzman Öğrenci', xpRequired: 7500 },
  { level: 7, title: 'Usta Öğrenci', xpRequired: 12000 },
  { level: 8, title: 'Büyük Üstad', xpRequired: 18000 },
  { level: 9, title: 'Efsane', xpRequired: 27000 },
  { level: 10, title: 'Şehit 🏆', xpRequired: 40000 },
]

function getLevelInfo(xp: number) {
  let level = 1
  let xpToNext = LEVELS[1]?.xpRequired ?? 500
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      level = LEVELS[i].level
      xpToNext = LEVELS[i + 1]?.xpRequired ?? LEVELS[i].xpRequired
      break
    }
  }
  return { level, xpToNextLevel: xpToNext }
}

function getPetMood(todayMinutes: number, streak: number): PetMood {
  if (todayMinutes === 0) return 'sleeping'
  if (todayMinutes < 25) return 'sad'
  if (todayMinutes < 60) return 'neutral'
  if (todayMinutes < 120 || streak < 3) return 'happy'
  return 'excited'
}

const initialBadges: Badge[] = [
  { id: 'first_pomodoro', name: 'İlk Adım', description: 'İlk Pomodoro\'nu tamamla', icon: '🍅', unlocked: false, premium: false },
  { id: 'streak_3', name: '3 Günlük Seri', description: '3 gün üst üste çalış', icon: '🔥', unlocked: false, premium: false },
  { id: 'streak_7', name: 'Haftalık Seri', description: '7 gün üst üste çalış', icon: '⚡', unlocked: false, premium: false },
  { id: 'streak_30', name: 'Aylık Seri', description: '30 gün üst üste çalış', icon: '💎', unlocked: false, premium: true },
  { id: 'hours_10', name: '10 Saat', description: 'Toplam 10 saat çalış', icon: '⏰', unlocked: false, premium: false },
  { id: 'hours_50', name: '50 Saat', description: 'Toplam 50 saat çalış', icon: '🕐', unlocked: false, premium: false },
  { id: 'hours_100', name: '100 Saat', description: 'Toplam 100 saat çalış', icon: '💯', unlocked: false, premium: true },
  { id: 'level_5', name: 'Yıldız', description: 'Seviye 5\'e ulaş', icon: '⭐', unlocked: false, premium: false },
  { id: 'level_9', name: 'Efsanevi', description: 'Seviye 9\'a ulaş', icon: '👑', unlocked: false, premium: true },
  { id: 'pomodoro_25', name: 'Pomodoro Ustası', description: '25 Pomodoro tamamla', icon: '🏅', unlocked: false, premium: false },
  { id: 'group_join', name: 'Takım Oyuncusu', description: 'Bir gruba katıl', icon: '🤝', unlocked: false, premium: false },
  { id: 'early_bird', name: 'Erken Kuş', description: '06:00\'dan önce çalış', icon: '🌅', unlocked: false, premium: false },
]

const initialWeeklyTasks: WeeklyTask[] = [
  { id: 'hours_15', description: 'Bu hafta 15 saat çalış', target: 15, current: 0, unit: 'saat', xpReward: 500, completed: false },
  { id: 'pomodoro_12', description: '12 Pomodoro tamamla', target: 12, current: 0, unit: 'pomodoro', xpReward: 300, completed: false },
  { id: 'days_5', description: '5 farklı gün çalış', target: 5, current: 0, unit: 'gün', xpReward: 400, completed: false },
]

const initialGroups: StudyGroup[] = [
  { id: 'marathon', name: 'Maraton Koşucuları', icon: '🏃', description: 'Günde 4+ saat çalışanlar', members: 2847, weeklyGoalHours: 28, currentHours: 0, joined: false },
  { id: 'night_owls', name: 'Gece Kuşları', icon: '🦉', description: 'Gece çalışmayı sevenler', members: 1923, weeklyGoalHours: 20, currentHours: 0, joined: false },
  { id: 'early_birds', name: 'Sabah Erenleri', icon: '🌅', description: 'Sabah çalışmayı sevenler', members: 1456, weeklyGoalHours: 15, currentHours: 0, joined: false },
  { id: 'sprinters', name: 'Sprint Takımı', icon: '⚡', description: 'Kısa yoğun seanslar', members: 3102, weeklyGoalHours: 10, currentHours: 0, joined: false },
]

const initialLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Ayşe K.', avatar: '👩‍💻', xp: 12800, level: 8, streak: 45 },
  { rank: 2, name: 'Mehmet D.', avatar: '👨‍🎓', xp: 11200, level: 7, streak: 30 },
  { rank: 3, name: 'Zeynep A.', avatar: '👩‍🎓', xp: 9800, level: 7, streak: 22 },
  { rank: 4, name: 'Ali R.', avatar: '👨‍💻', xp: 8400, level: 6, streak: 15 },
  { rank: 5, name: 'Fatma B.', avatar: '👩‍🏫', xp: 7200, level: 6, streak: 12 },
  { rank: 6, name: 'Sen', avatar: '🧑‍💻', xp: 0, level: 1, streak: 0, isMe: true },
  { rank: 7, name: 'Emre S.', avatar: '👨‍🏫', xp: 5100, level: 5, streak: 8 },
  { rank: 8, name: 'Hande Y.', avatar: '👩‍🔬', xp: 4200, level: 5, streak: 6 },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      xp: 0,
      level: 1,
      xpToNextLevel: 500,
      totalStudyMinutes: 0,
      weeklyStudyMinutes: 0,
      todayStudyMinutes: 0,
      streak: 0,
      selectedTitle: 'Yeni Öğrenci',
      username: 'Sen',

      pomodoroActive: false,
      pomodoroTimeLeft: 25 * 60,
      pomodoroTotalTime: 25 * 60,
      pomodoroPhase: 'work',
      pomodoroCount: 0,
      todayPomodoros: 0,
      weeklyPomodoros: 0,

      badges: initialBadges,
      powerUps: [
        { id: 'xp_multiplier', name: 'XP Çarpanı', description: '1 saat boyunca 2x XP kazan', icon: '⚡', cost: 200, active: false },
        { id: 'streak_shield', name: 'Seri Kalkanı', description: 'Seriyi 1 gün koru', icon: '🛡️', cost: 150, active: false },
      ],
      weeklyTasks: initialWeeklyTasks,
      levelUpModal: false,
      newLevel: 1,

      leaderboard: initialLeaderboard,
      studyGroups: initialGroups,

      petMood: 'sleeping',
      petName: 'Mochi',

      startPomodoro: () => set({ pomodoroActive: true }),
      pausePomodoro: () => set({ pomodoroActive: false }),
      resetPomodoro: () => {
        const state = get()
        const totalTime = state.pomodoroPhase === 'work' ? 25 * 60 : 5 * 60
        set({ pomodoroActive: false, pomodoroTimeLeft: totalTime, pomodoroTotalTime: totalTime })
      },

      tickPomodoro: () => {
        const state = get()
        if (!state.pomodoroActive) return

        if (state.pomodoroTimeLeft <= 1) {
          if (state.pomodoroPhase === 'work') {
            const newCount = state.pomodoroCount + 1
            const newToday = state.todayPomodoros + 1
            const newWeekly = state.weeklyPomodoros + 1
            const studyMinutesEarned = 25
            const newToday$ = state.todayStudyMinutes + studyMinutesEarned
            const newWeekly$ = state.weeklyStudyMinutes + studyMinutesEarned
            const newTotal = state.totalStudyMinutes + studyMinutesEarned

            // XP for pomodoro
            const multiplier = state.powerUps.find(p => p.id === 'xp_multiplier' && p.active) ? 2 : 1
            const xpEarned = 50 * multiplier
            const newXP = state.xp + xpEarned
            const { level: newLevel, xpToNextLevel } = getLevelInfo(newXP)
            const leveledUp = newLevel > state.level

            // Update leaderboard
            const newLeaderboard = state.leaderboard.map(e =>
              e.isMe ? { ...e, xp: newXP, level: newLevel, streak: state.streak } : e
            ).sort((a, b) => b.xp - a.xp).map((e, i) => ({ ...e, rank: i + 1 }))

            // Check badges
            const newBadges = state.badges.map(b => {
              if (b.unlocked) return b
              if (b.id === 'first_pomodoro' && newCount >= 1) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'pomodoro_25' && newCount >= 25) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'hours_10' && newTotal >= 600) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'level_5' && newLevel >= 5) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'level_9' && newLevel >= 9) return { ...b, unlocked: true, unlockedAt: Date.now() }
              return b
            })

            // Update weekly tasks
            const newTasks = state.weeklyTasks.map(t => {
              if (t.completed) return t
              if (t.id === 'pomodoro_12') {
                const updated = { ...t, current: Math.min(t.current + 1, t.target) }
                return { ...updated, completed: updated.current >= updated.target }
              }
              if (t.id === 'hours_15') {
                const newHours = newWeekly$ / 60
                const updated = { ...t, current: Math.min(newHours, t.target) }
                return { ...updated, completed: updated.current >= updated.target }
              }
              return t
            })

            const petMood = getPetMood(newToday$, state.streak)

            set({
              pomodoroPhase: 'break',
              pomodoroTimeLeft: 5 * 60,
              pomodoroTotalTime: 5 * 60,
              pomodoroActive: false,
              pomodoroCount: newCount,
              todayPomodoros: newToday,
              weeklyPomodoros: newWeekly,
              todayStudyMinutes: newToday$,
              weeklyStudyMinutes: newWeekly$,
              totalStudyMinutes: newTotal,
              xp: newXP,
              level: newLevel,
              xpToNextLevel,
              levelUpModal: leveledUp,
              newLevel: leveledUp ? newLevel : state.newLevel,
              badges: newBadges,
              weeklyTasks: newTasks,
              leaderboard: newLeaderboard,
              petMood,
              selectedTitle: leveledUp ? (LEVELS.find(l => l.level === newLevel)?.title ?? state.selectedTitle) : state.selectedTitle,
            })
          } else {
            set({
              pomodoroPhase: 'work',
              pomodoroTimeLeft: 25 * 60,
              pomodoroTotalTime: 25 * 60,
              pomodoroActive: false,
            })
          }
        } else {
          set({ pomodoroTimeLeft: state.pomodoroTimeLeft - 1 })
        }
      },

      addXP: (amount) => {
        const state = get()
        const newXP = state.xp + amount
        const { level: newLevel, xpToNextLevel } = getLevelInfo(newXP)
        const leveledUp = newLevel > state.level
        set({
          xp: newXP,
          level: newLevel,
          xpToNextLevel,
          levelUpModal: leveledUp,
          newLevel: leveledUp ? newLevel : state.newLevel,
        })
      },

      closeLevelUpModal: () => set({ levelUpModal: false }),

      buyPowerUp: (id) => {
        const state = get()
        const powerUp = state.powerUps.find(p => p.id === id)
        if (!powerUp || state.xp < powerUp.cost) return
        const expiresAt = id === 'xp_multiplier' ? Date.now() + 60 * 60 * 1000 : undefined
        set({
          xp: state.xp - powerUp.cost,
          powerUps: state.powerUps.map(p =>
            p.id === id ? { ...p, active: true, expiresAt } : p
          ),
        })
      },

      joinGroup: (id) => {
        const state = get()
        const alreadyJoined = state.studyGroups.find(g => g.id === id)?.joined
        const newBadges = !alreadyJoined
          ? state.badges.map(b => b.id === 'group_join' ? { ...b, unlocked: true, unlockedAt: Date.now() } : b)
          : state.badges
        set({
          studyGroups: state.studyGroups.map(g =>
            g.id === id ? { ...g, joined: !g.joined } : g
          ),
          badges: newBadges,
        })
      },

      selectTitle: (title) => set({ selectedTitle: title }),

      completeWeeklyTask: (id) => {
        const state = get()
        const task = state.weeklyTasks.find(t => t.id === id)
        if (!task || task.completed) return
        state.addXP(task.xpReward)
        set({
          weeklyTasks: state.weeklyTasks.map(t =>
            t.id === id ? { ...t, completed: true } : t
          ),
        })
      },

      updatePetMood: () => {
        const state = get()
        set({ petMood: getPetMood(state.todayStudyMinutes, state.streak) })
      },
    }),
    {
      name: 'study-assistant-storage',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        xpToNextLevel: state.xpToNextLevel,
        totalStudyMinutes: state.totalStudyMinutes,
        weeklyStudyMinutes: state.weeklyStudyMinutes,
        todayStudyMinutes: state.todayStudyMinutes,
        streak: state.streak,
        selectedTitle: state.selectedTitle,
        username: state.username,
        badges: state.badges,
        pomodoroCount: state.pomodoroCount,
        todayPomodoros: state.todayPomodoros,
        weeklyPomodoros: state.weeklyPomodoros,
        studyGroups: state.studyGroups,
        weeklyTasks: state.weeklyTasks,
        powerUps: state.powerUps,
        leaderboard: state.leaderboard,
        petMood: state.petMood,
        petName: state.petName,
      }),
    }
  )
)
