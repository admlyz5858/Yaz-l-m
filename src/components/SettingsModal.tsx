import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X, User, Clock, Coffee, Smile } from 'lucide-react'

const POMODORO_DURATIONS = [15, 20, 25, 30, 45, 60]
const BREAK_DURATIONS = [5, 10, 15, 20]
const DAILY_GOALS = [
  { label: '30 dk', value: 30 },
  { label: '1 saat', value: 60 },
  { label: '2 saat', value: 120 },
  { label: '3 saat', value: 180 },
  { label: '4 saat', value: 240 },
  { label: '6 saat', value: 360 },
]
const PET_NAMES = ['Mochi', 'Luna', 'Piko', 'Nova', 'Zara', 'Atom']

export default function SettingsModal() {
  const {
    settingsOpen, closeSettings,
    username, setUsername,
    petName, setPetName,
    pomodoroDuration, setPomodoroDuration,
    breakDuration, setBreakDuration,
    dailyGoalMinutes, setDailyGoal,
  } = useStore()

  const [tempUsername, setTempUsername] = useState(username)

  if (!settingsOpen) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={closeSettings}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl overflow-y-auto"
        style={{
          background: '#13131f',
          border: '1px solid rgba(255,255,255,0.08)',
          maxHeight: '85dvh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between py-4 mb-2">
            <h2 className="text-lg font-black text-white">Ayarlar</h2>
            <button
              onClick={closeSettings}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <X size={16} className="text-white/60" />
            </button>
          </div>

          {/* Username */}
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-indigo-400" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Kullanıcı Adı</span>
            </div>
            <div className="flex gap-2">
              <input
                value={tempUsername}
                onChange={e => setTempUsername(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-sm text-white outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                placeholder="İsmini gir..."
                maxLength={20}
              />
              <button
                onClick={() => { if (tempUsername.trim()) setUsername(tempUsername.trim()) }}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)', color: 'white' }}
              >
                Kaydet
              </button>
            </div>
          </section>

          {/* Pet name */}
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Smile size={14} className="text-yellow-400" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Evcil Hayvan Adı</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PET_NAMES.map(name => (
                <button
                  key={name}
                  onClick={() => setPetName(name)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
                  style={petName === name
                    ? { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0a0a0f' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }
                  }
                >
                  {name}
                </button>
              ))}
            </div>
          </section>

          {/* Pomodoro duration */}
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-red-400" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Pomodoro Süresi</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POMODORO_DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setPomodoroDuration(d)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
                  style={pomodoroDuration === d
                    ? { background: 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)', color: 'white' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }
                  }
                >
                  {d} dk
                </button>
              ))}
            </div>
          </section>

          {/* Break duration */}
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Coffee size={14} className="text-green-400" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Mola Süresi</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BREAK_DURATIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setBreakDuration(d)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
                  style={breakDuration === d
                    ? { background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: '#0a0a0f' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }
                  }
                >
                  {d} dk
                </button>
              ))}
            </div>
          </section>

          {/* Daily goal */}
          <section className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🎯</span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Günlük Hedef</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DAILY_GOALS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setDailyGoal(g.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
                  style={dailyGoalMinutes === g.value
                    ? { background: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)', color: 'white' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }
                  }
                >
                  {g.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
