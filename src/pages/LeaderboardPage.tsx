import { useStore, LEVELS } from '../store/useStore'
import { Crown, Flame } from 'lucide-react'

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(251,191,36,0.15) 100%)', border: 'rgba(245,158,11,0.4)', rankColor: '#fbbf24', icon: '🥇' },
  { bg: 'linear-gradient(135deg, rgba(148,163,184,0.2) 0%, rgba(203,213,225,0.1) 100%)', border: 'rgba(148,163,184,0.4)', rankColor: '#94a3b8', icon: '🥈' },
  { bg: 'linear-gradient(135deg, rgba(180,83,9,0.2) 0%, rgba(217,119,6,0.1) 100%)', border: 'rgba(180,83,9,0.4)', rankColor: '#d97706', icon: '🥉' },
]

export default function LeaderboardPage() {
  const { leaderboard, xp, level } = useStore()

  const myEntry = leaderboard.find(e => e.isMe)
  const sortedBoard = [...leaderboard].sort((a, b) => a.rank - b.rank)

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.1) 100%)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(245,158,11,0.2)' }}
        />
        <div className="relative flex items-center gap-3">
          <Crown size={28} className="text-yellow-400" />
          <div>
            <h1 className="text-xl font-black text-white">Haftalık Sıralama</h1>
            <p className="text-xs text-white/50">XP'ne göre sıralanıyorsun</p>
          </div>
          {myEntry && (
            <div className="ml-auto text-right">
              <div className="text-2xl font-black text-yellow-400">#{myEntry.rank}</div>
              <div className="text-xs text-white/40">Sıran</div>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-2">
        {sortedBoard.slice(0, 3).map((entry, i) => {
          const style = RANK_STYLES[i]
          const heights = ['h-24', 'h-20', 'h-16']
          const orders = [1, 0, 2]
          return (
            <div
              key={entry.rank}
              className={`order-${orders[i]} flex flex-col items-center gap-2 rounded-2xl p-3`}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                order: orders[i],
              }}
            >
              <div className="text-2xl">{style.icon}</div>
              <div className="text-2xl">{entry.avatar}</div>
              <div className="text-center">
                <div className="text-xs font-bold text-white">{entry.name}</div>
                <div className="text-[11px]" style={{ color: style.rankColor }}>
                  {entry.xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full leaderboard */}
      <div className="flex flex-col gap-1.5">
        {sortedBoard.map((entry) => {
          const isTop3 = entry.rank <= 3
          const levelTitle = LEVELS.find(l => l.level === entry.level)?.title ?? 'Öğrenci'

          return (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200`}
              style={
                entry.isMe
                  ? {
                      background: 'linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(192,132,252,0.15) 100%)',
                      border: '1px solid rgba(129,140,248,0.4)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }
              }
            >
              {/* Rank */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                style={
                  isTop3
                    ? { background: RANK_STYLES[entry.rank - 1].bg, color: RANK_STYLES[entry.rank - 1].rankColor }
                    : entry.isMe
                    ? { background: 'rgba(129,140,248,0.2)', color: '#818cf8' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }
                }
              >
                {entry.rank}
              </div>

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                {entry.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${entry.isMe ? 'text-white' : 'text-white/80'}`}>
                    {entry.name}
                  </span>
                  {entry.isMe && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(129,140,248,0.3)', color: '#818cf8' }}
                    >
                      Sen
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-white/40">
                  Sv.{entry.level} · {levelTitle}
                </div>
              </div>

              {/* XP + Streak */}
              <div className="text-right flex-shrink-0">
                <div className={`text-sm font-black ${entry.isMe ? 'text-indigo-400' : 'text-white/60'}`}>
                  {entry.xp.toLocaleString()}
                </div>
                <div className="flex items-center justify-end gap-0.5 text-[11px] text-orange-400">
                  <Flame size={10} />
                  {entry.streak}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center text-xs text-white/20 py-2">
        Sıralama her pazar sıfırlanır • XP'nle yukarı çık!
      </div>
    </div>
  )
}
