import { useStore, QUOTES } from '../store/useStore'
import XPBar from '../components/XPBar'
import StudyPet from '../components/StudyPet'
import { Timer, Trophy, Users, ChevronRight, Settings, RefreshCw } from 'lucide-react'

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-3 flex flex-col gap-1">
      <span className="text-xl">{icon}</span>
      <span className="text-lg font-black" style={{ color }}>{value}</span>
      <span className="text-[11px] text-white/40 leading-tight">{label}</span>
    </div>
  )
}

function DailyGoalCard() {
  const { todayStudyMinutes, dailyGoalMinutes, todayPomodoros } = useStore()
  const pct = Math.min((todayStudyMinutes / dailyGoalMinutes) * 100, 100)
  const done = pct >= 100

  return (
    <div
      className="glass rounded-2xl p-4"
      style={done ? { border: '1px solid rgba(74,222,128,0.3)' } : {}}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🎯</span>
          <span className="text-sm font-bold text-white">Günlük Hedef</span>
        </div>
        <span className="text-xs font-bold" style={{ color: done ? '#4ade80' : '#818cf8' }}>
          {todayStudyMinutes}/{dailyGoalMinutes} dk
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full progress-bar"
          style={{
            width: `${pct}%`,
            background: done ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #818cf8, #c084fc)',
            boxShadow: done ? '0 0 8px rgba(74,222,128,0.4)' : '0 0 8px rgba(129,140,248,0.4)',
          }}
        />
      </div>
      {done ? (
        <p className="text-xs text-green-400 font-semibold mt-1.5">🎉 Hedef tamamlandı! Harika iş!</p>
      ) : (
        <p className="text-xs text-white/30 mt-1.5">
          {Math.round(dailyGoalMinutes - todayStudyMinutes)} dakika kaldı · {todayPomodoros} 🍅 yapıldı
        </p>
      )}
    </div>
  )
}

function QuoteCard() {
  const { quoteIndex, nextQuote } = useStore()
  const quote = QUOTES[quoteIndex % QUOTES.length]

  return (
    <div
      className="glass rounded-2xl p-4 relative"
      style={{ border: '1px solid rgba(192,132,252,0.15)' }}
    >
      <div className="absolute top-3 right-3">
        <button
          onClick={nextQuote}
          className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={12} className="text-white/30" />
        </button>
      </div>
      <div className="text-2xl mb-2">💬</div>
      <p className="text-sm text-white/70 italic leading-relaxed mb-1">"{quote.text}"</p>
      <p className="text-xs text-white/30">— {quote.author}</p>
    </div>
  )
}

export default function HomePage() {
  const {
    totalStudyMinutes, weeklyStudyMinutes, todayStudyMinutes,
    streak, todayPomodoros, weeklyPomodoros,
    setActiveTab, level, xp,
    weeklyTasks, studyGroups, leaderboard,
    powerUps, openSettings, username,
  } = useStore()

  const totalHours = Math.floor(totalStudyMinutes / 60)
  const weeklyHours = (weeklyStudyMinutes / 60).toFixed(1)
  const myRank = leaderboard.find(e => e.isMe)?.rank ?? '—'
  const joinedGroup = studyGroups.find(g => g.joined)
  const activeMultiplier = powerUps.find(p => p.id === 'xp_multiplier' && p.active)
  const pendingTasks = weeklyTasks.filter(t => !t.completed)
  const hour = new Date().getHours()
  const greeting = hour < 5 ? 'Gece çalışıyorsun' : hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar'

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Header hero */}
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(168,85,247,0.3) 50%, rgba(236,72,153,0.2) 100%)',
          border: '1px solid rgba(129,140,248,0.2)',
        }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(168,85,247,0.3)' }} />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/50 text-sm">{greeting}, {username}! 👋</p>
                <button onClick={openSettings} className="ml-1 opacity-50 hover:opacity-80 transition-opacity">
                  <Settings size={14} className="text-white" />
                </button>
              </div>
              <h1 className="text-2xl font-black text-white leading-tight">
                Bugün Ne<br />Öğreneceksin?
              </h1>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 mb-0.5">Bu Hafta</div>
              <div className="text-2xl font-black text-white">{weeklyHours}s</div>
            </div>
          </div>

          {activeMultiplier && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}
            >
              ⚡ XP Çarpanı Aktif (2x)
            </div>
          )}

          <button
            onClick={() => setActiveTab('focus')}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
              boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
            }}
          >
            <Timer size={18} />
            Odaklanmaya Başla
          </button>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar />

      {/* Daily goal */}
      <DailyGoalCard />

      {/* Study Pet */}
      <StudyPet />

      {/* Quote of the day */}
      <QuoteCard />

      {/* Stats grid */}
      <div>
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-1">İstatistikler</h2>
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon="🔥" label="Gün Serisi" value={`${streak}`} color="#fb923c" />
          <StatCard icon="🍅" label="Bugün Pomo" value={`${todayPomodoros}`} color="#f87171" />
          <StatCard icon="⏱️" label="Toplam Saat" value={`${totalHours}s`} color="#60a5fa" />
          <StatCard icon="📅" label="Bu Hafta" value={`${weeklyHours}s`} color="#4ade80" />
          <StatCard icon="🎯" label="Haftalık Pomo" value={`${weeklyPomodoros}`} color="#c084fc" />
          <StatCard icon="🏆" label="Sıralama" value={`#${myRank}`} color="#fbbf24" />
        </div>
      </div>

      {/* Weekly Tasks preview */}
      {pendingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">Haftalık Görevler</h2>
            <button
              onClick={() => setActiveTab('focus')}
              className="text-xs text-purple-400 flex items-center gap-0.5"
            >
              Tümü <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {pendingTasks.slice(0, 2).map(task => {
              const progress = Math.min((task.current / task.target) * 100, 100)
              return (
                <div key={task.id} className="glass rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-white/80">{task.description}</span>
                    <span className="text-xs font-bold text-yellow-400">+{task.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)' }}
                      />
                    </div>
                    <span className="text-xs text-white/40 flex-shrink-0">
                      {typeof task.current === 'number' ? task.current.toFixed(task.unit === 'saat' ? 1 : 0) : task.current}/{task.target} {task.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setActiveTab('stats')}
          className="glass rounded-2xl p-3.5 flex items-center gap-3 hover:bg-white/5 transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
            <span className="text-lg">📊</span>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">İstatistikler</div>
            <div className="text-[11px] text-white/40">Haftalık analiz</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className="glass rounded-2xl p-3.5 flex items-center gap-3 hover:bg-white/5 transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(129,140,248,0.15)' }}>
            <Users size={18} className="text-indigo-400" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Gruplar</div>
            <div className="text-[11px] text-white/40">
              {joinedGroup ? joinedGroup.name : 'Gruba katıl'}
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className="glass rounded-2xl p-3.5 flex items-center gap-3 hover:bg-white/5 transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)' }}>
            <Trophy size={18} className="text-yellow-400" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Sıralama</div>
            <div className="text-[11px] text-white/40">#{myRank}. sıradasın</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className="glass rounded-2xl p-3.5 flex items-center gap-3 hover:bg-white/5 transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(192,132,252,0.15)' }}>
            <span className="text-lg">🏅</span>
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-white">Rozetler</div>
            <div className="text-[11px] text-white/40">Seviye {level} · {xp.toLocaleString()} XP</div>
          </div>
        </button>
      </div>
    </div>
  )
}
