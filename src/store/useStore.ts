import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tab = 'home' | 'focus' | 'stats' | 'groups' | 'badges'

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
export type AmbientSound = 'none' | 'lofi' | 'rain' | 'cafe' | 'nature'

export interface Subject {
  id: string
  name: string
  icon: string
  color: string
  totalMinutes: number
  weeklyMinutes: number
}

export interface DayRecord {
  date: string // YYYY-MM-DD
  minutes: number
  pomodoros: number
}

export interface Toast {
  id: string
  message: string
  icon: string
  type: 'success' | 'info' | 'achievement'
}

export interface Quote {
  text: string
  author: string
}

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
  dailyGoalMinutes: number

  // Pomodoro
  pomodoroActive: boolean
  pomodoroTimeLeft: number
  pomodoroTotalTime: number
  pomodoroPhase: 'work' | 'break'
  pomodoroCount: number
  todayPomodoros: number
  weeklyPomodoros: number
  pomodoroDuration: number   // minutes
  breakDuration: number      // minutes
  activeSubjectId: string | null
  ambientSound: AmbientSound

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

  // Subjects
  subjects: Subject[]

  // History
  history: DayRecord[]

  // Toasts
  toasts: Toast[]

  // Settings modal
  settingsOpen: boolean

  // Daily quote index
  quoteIndex: number

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
  setAmbientSound: (sound: AmbientSound) => void
  setActiveSubject: (id: string | null) => void
  addSubject: (name: string, icon: string, color: string) => void
  removeSubject: (id: string) => void
  setPomodoroDuration: (minutes: number) => void
  setBreakDuration: (minutes: number) => void
  setUsername: (name: string) => void
  setPetName: (name: string) => void
  setDailyGoal: (minutes: number) => void
  openSettings: () => void
  closeSettings: () => void
  dismissToast: (id: string) => void
  addToast: (message: string, icon: string, type: Toast['type']) => void
  nextQuote: () => void
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

export const QUOTES: Quote[] = [
  { text: 'Başarı, her gün tekrarlanan küçük çabaların toplamıdır.', author: 'Robert Collier' },
  { text: 'Bugün zor olan, yarın alışkanlık haline gelir.', author: 'Anonim' },
  { text: 'Öğrenmek bir hazinedir, sahibini her yere taşır.', author: 'Çin Atasözü' },
  { text: 'Disiplin, istekler ile başarılar arasındaki köprüdür.', author: 'Jim Rohn' },
  { text: 'Zihni açık, kalemi hazır, azmi kuvvetli tut.', author: 'Anonim' },
  { text: 'Her büyük yolculuk tek bir adımla başlar.', author: 'Lao Tzu' },
  { text: 'Çalışmak ibadet, bilmek güçtür.', author: 'Francis Bacon' },
  { text: 'Bugün yapabileceğini yarına bırakma.', author: 'Benjamin Franklin' },
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

function todayStr() {
  return new Date().toISOString().slice(0, 10)
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
  { id: 'night_owl', name: 'Gece Kuşu', description: '23:00\'dan sonra çalış', icon: '🦉', unlocked: false, premium: false },
  { id: 'multi_subject', name: 'Çok Yönlü', description: '3 farklı ders çalış', icon: '📚', unlocked: false, premium: false },
  { id: 'daily_goal', name: 'Hedef Avcısı', description: 'Günlük hedefini tamamla', icon: '🎯', unlocked: false, premium: false },
  { id: 'power_user', name: 'Güçlendirici', description: 'Bir güçlendirme satın al', icon: '⚗️', unlocked: false, premium: false },
]

const initialWeeklyTasks: WeeklyTask[] = [
  { id: 'hours_15', description: 'Bu hafta 15 saat çalış', target: 15, current: 0, unit: 'saat', xpReward: 500, completed: false },
  { id: 'pomodoro_12', description: '12 Pomodoro tamamla', target: 12, current: 0, unit: 'pomodoro', xpReward: 300, completed: false },
  { id: 'days_5', description: '5 farklı gün çalış', target: 5, current: 0, unit: 'gün', xpReward: 400, completed: false },
  { id: 'streak_keep', description: '3 gün seri yap', target: 3, current: 0, unit: 'gün', xpReward: 250, completed: false },
]

const initialGroups: StudyGroup[] = [
  { id: 'marathon', name: 'Maraton Koşucuları', icon: '🏃', description: 'Günde 4+ saat çalışanlar', members: 2847, weeklyGoalHours: 28, currentHours: 0, joined: false },
  { id: 'night_owls', name: 'Gece Kuşları', icon: '🦉', description: 'Gece çalışmayı sevenler', members: 1923, weeklyGoalHours: 20, currentHours: 0, joined: false },
  { id: 'early_birds', name: 'Sabah Erenleri', icon: '🌅', description: 'Sabah çalışmayı sevenler', members: 1456, weeklyGoalHours: 15, currentHours: 0, joined: false },
  { id: 'sprinters', name: 'Sprint Takımı', icon: '⚡', description: 'Kısa yoğun seanslar', members: 3102, weeklyGoalHours: 10, currentHours: 0, joined: false },
  { id: 'bookworms', name: 'Kitap Kurdu', icon: '📖', description: 'Okuma odaklı çalışanlar', members: 987, weeklyGoalHours: 12, currentHours: 0, joined: false },
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

const initialSubjects: Subject[] = [
  { id: 'math', name: 'Matematik', icon: '📐', color: '#60a5fa', totalMinutes: 0, weeklyMinutes: 0 },
  { id: 'science', name: 'Fen', icon: '🔬', color: '#4ade80', totalMinutes: 0, weeklyMinutes: 0 },
  { id: 'history', name: 'Tarih', icon: '📜', color: '#fb923c', totalMinutes: 0, weeklyMinutes: 0 },
  { id: 'language', name: 'Dil', icon: '🗣️', color: '#c084fc', totalMinutes: 0, weeklyMinutes: 0 },
  { id: 'general', name: 'Genel', icon: '📚', color: '#818cf8', totalMinutes: 0, weeklyMinutes: 0 },
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
      dailyGoalMinutes: 120,

      pomodoroActive: false,
      pomodoroTimeLeft: 25 * 60,
      pomodoroTotalTime: 25 * 60,
      pomodoroPhase: 'work',
      pomodoroCount: 0,
      todayPomodoros: 0,
      weeklyPomodoros: 0,
      pomodoroDuration: 25,
      breakDuration: 5,
      activeSubjectId: 'general',
      ambientSound: 'none',

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

      subjects: initialSubjects,
      history: [],
      toasts: [],
      settingsOpen: false,
      quoteIndex: 0,

      startPomodoro: () => set({ pomodoroActive: true }),
      pausePomodoro: () => set({ pomodoroActive: false }),
      resetPomodoro: () => {
        const state = get()
        const totalTime = state.pomodoroPhase === 'work'
          ? state.pomodoroDuration * 60
          : state.breakDuration * 60
        set({ pomodoroActive: false, pomodoroTimeLeft: totalTime, pomodoroTotalTime: totalTime })
      },

      tickPomodoro: () => {
        const state = get()
        if (!state.pomodoroActive) return

        if (state.pomodoroTimeLeft <= 1) {
          if (state.pomodoroPhase === 'work') {
            const studyMins = state.pomodoroDuration
            const newCount = state.pomodoroCount + 1
            const newToday = state.todayPomodoros + 1
            const newWeekly = state.weeklyPomodoros + 1
            const newTodayMins = state.todayStudyMinutes + studyMins
            const newWeeklyMins = state.weeklyStudyMinutes + studyMins
            const newTotal = state.totalStudyMinutes + studyMins

            // XP
            const multiplier = state.powerUps.find(p => p.id === 'xp_multiplier' && p.active) ? 2 : 1
            const xpEarned = Math.round(studyMins * 2 * multiplier)
            const newXP = state.xp + xpEarned
            const { level: newLevel, xpToNextLevel } = getLevelInfo(newXP)
            const leveledUp = newLevel > state.level

            // Update leaderboard
            const newLeaderboard = state.leaderboard
              .map(e => e.isMe ? { ...e, xp: newXP, level: newLevel, streak: state.streak } : e)
              .sort((a, b) => b.xp - a.xp)
              .map((e, i) => ({ ...e, rank: i + 1 }))

            // Update subjects
            const newSubjects = state.subjects.map(s =>
              s.id === state.activeSubjectId
                ? { ...s, totalMinutes: s.totalMinutes + studyMins, weeklyMinutes: s.weeklyMinutes + studyMins }
                : s
            )

            // Update history
            const today = todayStr()
            const existingDay = state.history.find(d => d.date === today)
            const newHistory: DayRecord[] = existingDay
              ? state.history.map(d => d.date === today
                  ? { ...d, minutes: d.minutes + studyMins, pomodoros: d.pomodoros + 1 }
                  : d)
              : [...state.history.slice(-29), { date: today, minutes: studyMins, pomodoros: 1 }]

            // Hour & badge checks
            const hour = new Date().getHours()
            const newBadges = state.badges.map(b => {
              if (b.unlocked) return b
              if (b.id === 'first_pomodoro' && newCount >= 1) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'pomodoro_25' && newCount >= 25) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'hours_10' && newTotal >= 600) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'hours_50' && newTotal >= 3000) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'hours_100' && newTotal >= 6000) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'level_5' && newLevel >= 5) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'level_9' && newLevel >= 9) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'early_bird' && hour < 6) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'night_owl' && hour >= 23) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'daily_goal' && newTodayMins >= state.dailyGoalMinutes) return { ...b, unlocked: true, unlockedAt: Date.now() }
              if (b.id === 'multi_subject' && newSubjects.filter(s => s.totalMinutes > 0).length >= 3) return { ...b, unlocked: true, unlockedAt: Date.now() }
              return b
            })

            // New badge toasts
            const justUnlocked = newBadges.filter((b, i) => b.unlocked && !state.badges[i].unlocked)
            const newToasts: Toast[] = [
              ...state.toasts,
              ...justUnlocked.map(b => ({
                id: `badge-${b.id}-${Date.now()}`,
                message: `"${b.name}" rozeti kazandın!`,
                icon: b.icon,
                type: 'achievement' as const,
              })),
              {
                id: `xp-${Date.now()}`,
                message: `+${xpEarned} XP kazandın! 🎉`,
                icon: '⚡',
                type: 'success' as const,
              },
            ]

            // Weekly tasks
            const newTasks = state.weeklyTasks.map(t => {
              if (t.completed) return t
              if (t.id === 'pomodoro_12') {
                const updated = { ...t, current: Math.min(t.current + 1, t.target) }
                return { ...updated, completed: updated.current >= updated.target }
              }
              if (t.id === 'hours_15') {
                const updated = { ...t, current: Math.min(newWeeklyMins / 60, t.target) }
                return { ...updated, completed: updated.current >= updated.target }
              }
              return t
            })

            const petMood = getPetMood(newTodayMins, state.streak)

            set({
              pomodoroPhase: 'break',
              pomodoroTimeLeft: state.breakDuration * 60,
              pomodoroTotalTime: state.breakDuration * 60,
              pomodoroActive: false,
              pomodoroCount: newCount,
              todayPomodoros: newToday,
              weeklyPomodoros: newWeekly,
              todayStudyMinutes: newTodayMins,
              weeklyStudyMinutes: newWeeklyMins,
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
              subjects: newSubjects,
              history: newHistory,
              toasts: newToasts,
              selectedTitle: leveledUp ? (LEVELS.find(l => l.level === newLevel)?.title ?? state.selectedTitle) : state.selectedTitle,
            })
          } else {
            set({
              pomodoroPhase: 'work',
              pomodoroTimeLeft: get().pomodoroDuration * 60,
              pomodoroTotalTime: get().pomodoroDuration * 60,
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
        set({ xp: newXP, level: newLevel, xpToNextLevel, levelUpModal: leveledUp, newLevel: leveledUp ? newLevel : state.newLevel })
      },

      closeLevelUpModal: () => set({ levelUpModal: false }),

      buyPowerUp: (id) => {
        const state = get()
        const powerUp = state.powerUps.find(p => p.id === id)
        if (!powerUp || state.xp < powerUp.cost) return
        const expiresAt = id === 'xp_multiplier' ? Date.now() + 60 * 60 * 1000 : undefined
        const newBadges = state.badges.map(b =>
          b.id === 'power_user' && !b.unlocked ? { ...b, unlocked: true, unlockedAt: Date.now() } : b
        )
        const toast: Toast = { id: `pu-${Date.now()}`, message: `${powerUp.name} aktifleştirildi!`, icon: powerUp.icon, type: 'success' }
        set({
          xp: state.xp - powerUp.cost,
          powerUps: state.powerUps.map(p => p.id === id ? { ...p, active: true, expiresAt } : p),
          badges: newBadges,
          toasts: [...state.toasts, toast],
        })
      },

      joinGroup: (id) => {
        const state = get()
        const alreadyJoined = state.studyGroups.find(g => g.id === id)?.joined
        const newBadges = !alreadyJoined
          ? state.badges.map(b => b.id === 'group_join' ? { ...b, unlocked: true, unlockedAt: Date.now() } : b)
          : state.badges
        const newGroups = state.studyGroups.map(g => g.id === id ? { ...g, joined: !g.joined } : g)
        const joinedNow = newGroups.find(g => g.id === id)?.joined
        const toast: Toast = joinedNow
          ? { id: `grp-${Date.now()}`, message: `Gruba katıldın!`, icon: '🤝', type: 'success' }
          : { id: `grp-${Date.now()}`, message: `Gruptan ayrıldın`, icon: '👋', type: 'info' }
        set({ studyGroups: newGroups, badges: newBadges, toasts: [...state.toasts, toast] })
      },

      selectTitle: (title) => set({ selectedTitle: title }),

      completeWeeklyTask: (id) => {
        const state = get()
        const task = state.weeklyTasks.find(t => t.id === id)
        if (!task || task.completed) return
        const { level: newLevel, xpToNextLevel } = getLevelInfo(state.xp + task.xpReward)
        const toast: Toast = { id: `task-${Date.now()}`, message: `Görev tamamlandı! +${task.xpReward} XP`, icon: '✅', type: 'achievement' }
        set({
          xp: state.xp + task.xpReward,
          level: newLevel,
          xpToNextLevel,
          weeklyTasks: state.weeklyTasks.map(t => t.id === id ? { ...t, completed: true } : t),
          toasts: [...state.toasts, toast],
        })
      },

      updatePetMood: () => {
        const state = get()
        set({ petMood: getPetMood(state.todayStudyMinutes, state.streak) })
      },

      setAmbientSound: (sound) => set({ ambientSound: sound }),
      setActiveSubject: (id) => set({ activeSubjectId: id }),

      addSubject: (name, icon, color) => {
        const id = `custom-${Date.now()}`
        set(s => ({ subjects: [...s.subjects, { id, name, icon, color, totalMinutes: 0, weeklyMinutes: 0 }] }))
      },

      removeSubject: (id) => {
        set(s => ({ subjects: s.subjects.filter(sub => sub.id !== id) }))
      },

      setPomodoroDuration: (minutes) => {
        set({ pomodoroDuration: minutes, pomodoroTimeLeft: minutes * 60, pomodoroTotalTime: minutes * 60, pomodoroActive: false })
      },

      setBreakDuration: (minutes) => {
        set({ breakDuration: minutes })
      },

      setUsername: (name) => {
        set(s => ({
          username: name,
          leaderboard: s.leaderboard.map(e => e.isMe ? { ...e, name } : e),
        }))
      },

      setPetName: (name) => set({ petName: name }),
      setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
      openSettings: () => set({ settingsOpen: true }),
      closeSettings: () => set({ settingsOpen: false }),

      dismissToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
      addToast: (message, icon, type) => {
        const toast: Toast = { id: `t-${Date.now()}`, message, icon, type }
        set(s => ({ toasts: [...s.toasts, toast] }))
      },

      nextQuote: () => set(s => ({ quoteIndex: (s.quoteIndex + 1) % QUOTES.length })),
    }),
    {
      name: 'study-assistant-v2',
      partialize: (s) => ({
        xp: s.xp, level: s.level, xpToNextLevel: s.xpToNextLevel,
        totalStudyMinutes: s.totalStudyMinutes, weeklyStudyMinutes: s.weeklyStudyMinutes,
        todayStudyMinutes: s.todayStudyMinutes, streak: s.streak,
        selectedTitle: s.selectedTitle, username: s.username, dailyGoalMinutes: s.dailyGoalMinutes,
        badges: s.badges, pomodoroCount: s.pomodoroCount,
        todayPomodoros: s.todayPomodoros, weeklyPomodoros: s.weeklyPomodoros,
        studyGroups: s.studyGroups, weeklyTasks: s.weeklyTasks, powerUps: s.powerUps,
        leaderboard: s.leaderboard, petMood: s.petMood, petName: s.petName,
        subjects: s.subjects, history: s.history, quoteIndex: s.quoteIndex,
        pomodoroDuration: s.pomodoroDuration, breakDuration: s.breakDuration,
        ambientSound: s.ambientSound, activeSubjectId: s.activeSubjectId,
      }),
    }
  )
)
