import { useStore } from '../store/useStore'
import { Users, CheckCircle2 } from 'lucide-react'

export default function GroupsPage() {
  const { studyGroups, joinGroup, weeklyStudyMinutes } = useStore()

  const joinedGroups = studyGroups.filter(g => g.joined)
  const availableGroups = studyGroups.filter(g => !g.joined)

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(99,102,241,0.15) 100%)',
          border: '1px solid rgba(129,140,248,0.2)',
        }}
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(129,140,248,0.2)' }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Users size={22} className="text-indigo-400" />
            <h1 className="text-xl font-black text-white">Çalışma Grupları</h1>
          </div>
          <p className="text-xs text-white/50">
            Bir gruba katıl, birlikte daha fazla başar
          </p>
        </div>
      </div>

      {/* Joined groups */}
      {joinedGroups.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Gruplarım</h2>
          <div className="flex flex-col gap-2">
            {joinedGroups.map(group => {
              const myHours = weeklyStudyMinutes / 60
              const groupProgress = Math.min((myHours / group.weeklyGoalHours) * 100, 100)
              const totalProgress = Math.min((group.currentHours / group.weeklyGoalHours) * 100, 100)

              return (
                <div
                  key={group.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(129,140,248,0.12) 0%, rgba(99,102,241,0.08) 100%)',
                    border: '1px solid rgba(129,140,248,0.25)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: 'rgba(129,140,248,0.15)' }}
                      >
                        {group.icon}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{group.name}</div>
                        <div className="text-[11px] text-white/40">{group.members.toLocaleString()} üye</div>
                      </div>
                    </div>
                    <button
                      onClick={() => joinGroup(group.id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Ayrıl
                    </button>
                  </div>

                  {/* My progress */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">Benim ilerleme</span>
                      <span className="text-indigo-400 font-semibold">
                        {myHours.toFixed(1)}/{group.weeklyGoalHours}s
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{
                          width: `${groupProgress}%`,
                          background: groupProgress >= 100
                            ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                            : 'linear-gradient(90deg, #818cf8 0%, #6366f1 100%)',
                          boxShadow: '0 0 6px rgba(129,140,248,0.5)',
                        }}
                      />
                    </div>
                  </div>

                  {groupProgress >= 100 && (
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold"
                      style={{ color: '#4ade80' }}
                    >
                      <CheckCircle2 size={12} />
                      Haftalık hedef tamamlandı! 🎉
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Available groups */}
      <div>
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
          {joinedGroups.length > 0 ? 'Diğer Gruplar' : 'Gruplara Katıl'}
        </h2>
        <div className="flex flex-col gap-2">
          {availableGroups.map(group => {
            const groupProgressPct = (group.currentHours / group.weeklyGoalHours) * 100

            return (
              <div
                key={group.id}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    {group.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-sm">{group.name}</div>
                        <div className="text-[11px] text-white/40 mt-0.5">{group.description}</div>
                      </div>
                      <button
                        onClick={() => joinGroup(group.id)}
                        className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                          color: 'white',
                        }}
                      >
                        Katıl
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                  <div className="flex items-center gap-1">
                    <Users size={10} />
                    {group.members.toLocaleString()} üye
                  </div>
                  <span>Haftalık hedef: {group.weeklyGoalHours}s</span>
                </div>

                {/* Group weekly progress bar */}
                <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(groupProgressPct, 100)}%`,
                      background: 'rgba(129,140,248,0.4)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info */}
      <div
        className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="text-xs font-bold text-white/60 mb-2">💡 Gruplar Hakkında</h3>
        <ul className="text-xs text-white/40 space-y-1.5">
          <li>• Gruba katılınca "Takım Oyuncusu" rozeti kazanırsın</li>
          <li>• Haftalık hedefi tamamlayınca bonus XP alırsın</li>
          <li>• Grup sıralamasında en üste çıkmaya çalış</li>
        </ul>
      </div>
    </div>
  )
}
