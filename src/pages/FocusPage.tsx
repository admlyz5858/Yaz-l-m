import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Play, Pause, RotateCcw, Zap, Shield, CheckCircle2 } from 'lucide-react'

function PomodoroTimer() {
  const {
    pomodoroActive, pomodoroTimeLeft, pomodoroTotalTime, pomodoroPhase,
    pomodoroCount, todayPomodoros,
    startPomodoro, pausePomodoro, resetPomodoro, tickPomodoro
  } = useStore()

  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (pomodoroActive) {
      intervalRef.current = window.setInterval(tickPomodoro, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [pomodoroActive, tickPomodoro])

  const minutes = Math.floor(pomodoroTimeLeft / 60)
  const seconds = pomodoroTimeLeft % 60
  const progress = 1 - pomodoroTimeLeft / pomodoroTotalTime

  // SVG circle
  const r = 88
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference * (1 - progress)

  const isWork = pomodoroPhase === 'work'
  const primaryColor = isWork ? '#818cf8' : '#4ade80'
  const bgColor = isWork ? 'rgba(129,140,248,0.1)' : 'rgba(74,222,128,0.1)'

  return (
    <div className="flex flex-col items-center">
      {/* Phase indicator */}
      <div className="flex gap-2 mb-6">
        <button
          className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
          style={isWork
            ? { background: 'rgba(129,140,248,0.2)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.4)' }
            : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }
          }
        >
          Çalışma
        </button>
        <button
          className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
          style={!isWork
            ? { background: 'rgba(74,222,128,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)' }
            : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }
          }
        >
          Mola
        </button>
      </div>

      {/* Timer ring */}
      <div className="relative mb-6" style={{ width: 224, height: 224 }}>
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
          style={{
            background: bgColor,
            opacity: pomodoroActive ? 1 : 0.3,
            transition: 'opacity 0.5s',
          }}
        />

        <svg width="224" height="224" viewBox="0 0 224 224" className="absolute inset-0">
          {/* Background ring */}
          <circle
            cx="112" cy="112" r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <circle
            cx="112" cy="112" r={r}
            fill="none"
            stroke={primaryColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="timer-ring"
            style={{ filter: `drop-shadow(0 0 8px ${primaryColor})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-5xl font-black tabular-nums"
            style={{ color: 'white', textShadow: `0 0 20px ${primaryColor}40` }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-white/40 mt-1">
            {isWork ? 'Odak Zamanı' : 'Mola Zamanı'}
          </div>
          {pomodoroActive && (
            <div
              className="w-2 h-2 rounded-full mt-2 animate-pulse"
              style={{ background: primaryColor }}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={resetPomodoro}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10 active:scale-90"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <RotateCcw size={18} className="text-white/60" />
        </button>

        <button
          onClick={pomodoroActive ? pausePomodoro : startPomodoro}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${isWork ? '#c084fc' : '#22c55e'} 100%)`,
            boxShadow: `0 8px 24px ${primaryColor}50`,
          }}
        >
          {pomodoroActive
            ? <Pause size={26} className="text-white" fill="white" />
            : <Play size={26} className="text-white" fill="white" style={{ marginLeft: 2 }} />
          }
        </button>

        <div className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-xs font-bold" style={{ color: primaryColor }}>
            🍅{pomodoroCount}
          </span>
        </div>
      </div>

      {/* Pomodoro dots */}
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              background: i < (pomodoroCount % 4) ? primaryColor : 'rgba(255,255,255,0.1)',
              boxShadow: i < (pomodoroCount % 4) ? `0 0 6px ${primaryColor}` : 'none',
            }}
          />
        ))}
      </div>
      <div className="text-xs text-white/30 mt-2">Bugün {todayPomodoros} pomodoro</div>
    </div>
  )
}

function WeeklyTasks() {
  const { weeklyTasks, completeWeeklyTask } = useStore()

  return (
    <div>
      <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Haftalık Görevler</h3>
      <div className="flex flex-col gap-2">
        {weeklyTasks.map(task => {
          const progress = Math.min((task.current / task.target) * 100, 100)
          return (
            <div
              key={task.id}
              className="glass rounded-2xl p-3.5"
              style={task.completed ? { border: '1px solid rgba(74,222,128,0.3)' } : {}}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {task.completed && <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />}
                  <span className={`text-xs font-medium ${task.completed ? 'text-white/40 line-through' : 'text-white/80'}`}>
                    {task.description}
                  </span>
                </div>
                <span
                  className="text-xs font-bold flex-shrink-0 px-2 py-0.5 rounded-full"
                  style={task.completed
                    ? { background: 'rgba(74,222,128,0.15)', color: '#4ade80' }
                    : { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }
                  }
                >
                  {task.completed ? '✓' : `+${task.xpReward}`} XP
                </span>
              </div>
              {!task.completed && (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{
                          width: `${progress}%`,
                          background: progress >= 100
                            ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                            : 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)',
                        }}
                      />
                    </div>
                    <span className="text-xs text-white/40 flex-shrink-0">
                      {typeof task.current === 'number' ? task.current.toFixed(task.unit === 'saat' ? 1 : 0) : task.current}/{task.target} {task.unit}
                    </span>
                  </div>
                  {progress >= 100 && (
                    <button
                      onClick={() => completeWeeklyTask(task.id)}
                      className="w-full py-1.5 rounded-xl text-xs font-bold mt-1 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', color: '#0a0a0f' }}
                    >
                      Görevi Tamamla! 🎉
                    </button>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PowerUps() {
  const { powerUps, buyPowerUp, xp } = useStore()

  return (
    <div>
      <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Güçlendirmeler</h3>
      <div className="grid grid-cols-2 gap-2">
        {powerUps.map(pu => {
          const canAfford = xp >= pu.cost
          const icons = { xp_multiplier: <Zap size={20} />, streak_shield: <Shield size={20} /> }
          const colors = { xp_multiplier: '#fbbf24', streak_shield: '#60a5fa' }
          const color = colors[pu.id]
          return (
            <button
              key={pu.id}
              onClick={() => !pu.active && buyPowerUp(pu.id)}
              disabled={pu.active || !canAfford}
              className="glass rounded-2xl p-3.5 text-left transition-all duration-200 hover:bg-white/5 active:scale-95 disabled:opacity-60"
              style={pu.active ? { border: `1px solid ${color}50` } : {}}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `${color}20`, color }}
              >
                {icons[pu.id]}
              </div>
              <div className="text-xs font-bold text-white mb-0.5">{pu.name}</div>
              <div className="text-[11px] text-white/40 mb-2 leading-tight">{pu.description}</div>
              {pu.active ? (
                <div className="text-xs font-bold" style={{ color }}>✓ Aktif</div>
              ) : (
                <div
                  className="text-xs font-bold px-2 py-1 rounded-lg inline-block"
                  style={{
                    background: canAfford ? `${color}20` : 'rgba(255,255,255,0.05)',
                    color: canAfford ? color : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {pu.cost} XP
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FocusPage() {
  const { streak } = useStore()

  return (
    <div className="flex flex-col gap-5 pb-2">
      {/* Streak banner */}
      {streak > 0 && (
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(251,146,60,0.2) 0%, rgba(239,68,68,0.2) 100%)',
            border: '1px solid rgba(251,146,60,0.3)',
          }}
        >
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-sm font-bold text-white">{streak} Günlük Seri!</div>
            <div className="text-xs text-white/50">Seriyi korumak için bugün çalış</div>
          </div>
        </div>
      )}

      {/* Timer */}
      <div
        className="glass rounded-3xl py-6 px-4"
        style={{ border: '1px solid rgba(129,140,248,0.15)' }}
      >
        <h2 className="text-center text-sm font-bold text-white/40 uppercase tracking-wider mb-5">
          Odaklanma Merkezi
        </h2>
        <PomodoroTimer />
      </div>

      {/* Weekly Tasks */}
      <WeeklyTasks />

      {/* Power-ups */}
      <PowerUps />
    </div>
  )
}
