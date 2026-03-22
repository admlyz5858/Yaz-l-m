import { useStore } from '../store/useStore'
import { BarChart2, Flame, Clock, Target } from 'lucide-react'

function WeeklyBarChart() {
  const { history } = useStore()

  // Build last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const record = history.find(h => h.date === dateStr)
    return {
      label: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'][d.getDay()],
      minutes: record?.minutes ?? 0,
      isToday: i === 6,
    }
  })

  const maxMins = Math.max(...days.map(d => d.minutes), 60)

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={16} className="text-indigo-400" />
        <h3 className="text-sm font-bold text-white">Bu Hafta</h3>
        <span className="ml-auto text-xs text-white/40">
          {days.reduce((a, d) => a + d.minutes, 0) >= 60
            ? `${(days.reduce((a, d) => a + d.minutes, 0) / 60).toFixed(1)} saat`
            : `${days.reduce((a, d) => a + d.minutes, 0)} dk`}
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-28">
        {days.map((day, i) => {
          const pct = maxMins > 0 ? (day.minutes / maxMins) : 0
          const height = Math.max(pct * 96, day.minutes > 0 ? 8 : 3)
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg transition-all duration-500 relative group"
                style={{
                  height: height,
                  background: day.isToday
                    ? 'linear-gradient(180deg, #818cf8 0%, #6366f1 100%)'
                    : day.minutes > 0
                    ? 'linear-gradient(180deg, rgba(129,140,248,0.5) 0%, rgba(99,102,241,0.3) 100%)'
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: day.isToday ? '0 0 10px rgba(129,140,248,0.4)' : 'none',
                }}
              >
                {day.minutes > 0 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white/60 whitespace-nowrap">
                    {day.minutes >= 60 ? `${Math.round(day.minutes / 60)}s` : `${day.minutes}dk`}
                  </div>
                )}
              </div>
              <span className={`text-[11px] font-medium ${day.isToday ? 'text-indigo-400' : 'text-white/30'}`}>
                {day.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StreakCalendar() {
  const { history } = useStore()

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const record = history.find(h => h.date === dateStr)
    return {
      minutes: record?.minutes ?? 0,
      isToday: i === 29,
      day: d.getDate(),
    }
  })

  const getColor = (minutes: number, isToday: boolean) => {
    if (minutes === 0) return 'rgba(255,255,255,0.05)'
    if (minutes < 30) return 'rgba(129,140,248,0.2)'
    if (minutes < 60) return 'rgba(129,140,248,0.4)'
    if (minutes < 120) return 'rgba(129,140,248,0.65)'
    return isToday ? '#818cf8' : '#6366f1'
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Flame size={16} className="text-orange-400" />
        <h3 className="text-sm font-bold text-white">Son 30 Gün</h3>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
        {days.map((day, i) => (
          <div
            key={i}
            className="aspect-square rounded-md transition-all duration-300"
            style={{
              background: getColor(day.minutes, day.isToday),
              outline: day.isToday ? '2px solid rgba(129,140,248,0.6)' : 'none',
              outlineOffset: '1px',
            }}
            title={`${day.day}: ${day.minutes} dk`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 justify-end">
        <span className="text-[10px] text-white/30">Az</span>
        {['rgba(255,255,255,0.05)', 'rgba(129,140,248,0.2)', 'rgba(129,140,248,0.4)', 'rgba(129,140,248,0.65)', '#818cf8'].map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-white/30">Çok</span>
      </div>
    </div>
  )
}

function SubjectBreakdown() {
  const { subjects } = useStore()
  const total = subjects.reduce((a, s) => a + s.totalMinutes, 0)
  const sorted = [...subjects].filter(s => s.totalMinutes > 0).sort((a, b) => b.totalMinutes - a.totalMinutes)

  if (sorted.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 text-center">
        <div className="text-3xl mb-2">📊</div>
        <p className="text-sm text-white/40">Henüz ders verisi yok. Çalışmaya başla!</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📊</span>
        <h3 className="text-sm font-bold text-white">Ders Dağılımı</h3>
      </div>
      <div className="flex flex-col gap-2.5">
        {sorted.map(s => {
          const pct = total > 0 ? (s.totalMinutes / total) * 100 : 0
          return (
            <div key={s.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <span className="text-xs font-medium text-white/80">{s.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>{s.totalMinutes >= 60 ? `${(s.totalMinutes / 60).toFixed(1)}s` : `${s.totalMinutes}dk`}</span>
                  <span style={{ color: s.color }}>{pct.toFixed(0)}%</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full progress-bar"
                  style={{ width: `${pct}%`, background: s.color, boxShadow: `0 0 6px ${s.color}60` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function StatsPage() {
  const {
    totalStudyMinutes, weeklyStudyMinutes, todayStudyMinutes,
    streak, pomodoroCount, weeklyPomodoros, todayPomodoros,
    dailyGoalMinutes, history,
  } = useStore()

  const totalHours = (totalStudyMinutes / 60).toFixed(1)
  const weeklyHours = (weeklyStudyMinutes / 60).toFixed(1)
  const todayHours = (todayStudyMinutes / 60).toFixed(1)
  const goalPct = Math.min((todayStudyMinutes / dailyGoalMinutes) * 100, 100)
  const bestDay = history.length > 0 ? Math.max(...history.map(h => h.minutes)) : 0

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(79,70,229,0.2) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(99,102,241,0.3)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={20} className="text-indigo-400" />
            <h1 className="text-xl font-black text-white">İstatistikler</h1>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Bugün', value: `${todayHours}s`, icon: '📅', color: '#818cf8' },
              { label: 'Bu Hafta', value: `${weeklyHours}s`, icon: '📆', color: '#60a5fa' },
              { label: 'Toplam', value: `${totalHours}s`, icon: '🗓️', color: '#4ade80' },
            ].map(stat => (
              <div key={stat.label} className="glass rounded-xl p-2.5 text-center">
                <div className="text-lg">{stat.icon}</div>
                <div className="text-base font-black mt-0.5" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily goal */}
      <div
        className="glass rounded-2xl p-4"
        style={goalPct >= 100 ? { border: '1px solid rgba(74,222,128,0.3)' } : {}}
      >
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className={goalPct >= 100 ? 'text-green-400' : 'text-indigo-400'} />
          <h3 className="text-sm font-bold text-white">Günlük Hedef</h3>
          <span className="ml-auto text-xs font-bold" style={{ color: goalPct >= 100 ? '#4ade80' : '#818cf8' }}>
            {todayStudyMinutes}/{dailyGoalMinutes} dk
          </span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full progress-bar"
            style={{
              width: `${goalPct}%`,
              background: goalPct >= 100
                ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                : 'linear-gradient(90deg, #818cf8, #c084fc)',
            }}
          />
        </div>
        {goalPct >= 100 && (
          <p className="text-xs text-green-400 font-semibold mt-2">🎉 Günlük hedef tamamlandı!</p>
        )}
      </div>

      {/* Weekly bar chart */}
      <WeeklyBarChart />

      {/* Streak calendar */}
      <StreakCalendar />

      {/* Subject breakdown */}
      <SubjectBreakdown />

      {/* More stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: '🔥', label: 'Günlük Seri', value: `${streak} gün`, color: '#fb923c' },
          { icon: '🍅', label: 'Toplam Pomo', value: `${pomodoroCount}`, color: '#f87171' },
          { icon: '📅', label: 'Bugün Pomo', value: `${todayPomodoros}`, color: '#c084fc' },
          { icon: '⚡', label: 'En İyi Gün', value: bestDay >= 60 ? `${(bestDay / 60).toFixed(1)}s` : `${bestDay}dk`, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-3.5 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="text-base font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-white/40">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
