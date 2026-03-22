import { useStore, LEVELS } from '../store/useStore'

export default function BadgesPage() {
  const { badges, level, xp, selectedTitle, selectTitle } = useStore()

  const unlockedBadges = badges.filter(b => b.unlocked)
  const lockedBadges = badges.filter(b => !b.unlocked)

  return (
    <div className="flex flex-col gap-5 pb-2">
      {/* Profile card */}
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(168,85,247,0.25) 100%)',
          border: '1px solid rgba(129,140,248,0.2)',
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black"
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
              boxShadow: '0 8px 24px rgba(167,139,250,0.4)',
            }}
          >
            {level}
          </div>
          <div>
            <div className="text-lg font-black text-white">Seviye {level}</div>
            <div
              className="text-sm font-bold gradient-text"
            >
              {selectedTitle}
            </div>
            <div className="text-xs text-white/40 mt-0.5">{xp.toLocaleString()} toplam XP</div>
          </div>
        </div>
      </div>

      {/* Title selection */}
      <div>
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Ünvan Seç</h2>
        <div className="flex flex-col gap-1.5">
          {LEVELS.map(l => {
            const unlocked = level >= l.level
            const isSelected = selectedTitle === l.title
            const isGold = l.level >= 9

            return (
              <button
                key={l.level}
                onClick={() => unlocked && selectTitle(l.title)}
                disabled={!unlocked}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 active:scale-95"
                style={
                  isSelected
                    ? {
                        background: isGold
                          ? 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(251,191,36,0.15) 100%)'
                          : 'linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(192,132,252,0.2) 100%)',
                        border: `1px solid ${isGold ? 'rgba(245,158,11,0.5)' : 'rgba(129,140,248,0.4)'}`,
                      }
                    : unlocked
                    ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
                    : { background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', opacity: 0.4 }
                }
              >
                {/* Level circle */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={
                    unlocked
                      ? isGold
                        ? { background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', color: '#0a0a0f' }
                        : { background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }
                  }
                >
                  {unlocked ? l.level : '🔒'}
                </div>

                {/* Title */}
                <div className="flex-1 text-left">
                  <div
                    className={`text-sm font-bold ${isGold && unlocked ? 'gradient-text-gold' : unlocked ? 'text-white' : 'text-white/40'}`}
                  >
                    {l.title}
                  </div>
                  {!unlocked && (
                    <div className="text-[11px] text-white/30">
                      Seviye {l.level} gerekli ({l.xpRequired.toLocaleString()} XP)
                    </div>
                  )}
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: isGold ? '#f59e0b' : '#818cf8' }}
                  >
                    ✓
                  </div>
                )}

                {/* Gold crown for premium */}
                {isGold && unlocked && !isSelected && (
                  <div className="text-yellow-400 flex-shrink-0">👑</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Unlocked badges */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider">Kazanılan Rozetler</h2>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(129,140,248,0.2)', color: '#818cf8' }}
          >
            {unlockedBadges.length}
          </span>
        </div>

        {unlockedBadges.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎖️</div>
            <p className="text-sm text-white/40">Henüz rozet kazanmadın. Çalışmaya devam et!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {unlockedBadges.map(badge => (
              <div
                key={badge.id}
                className="glass rounded-2xl p-3 flex flex-col items-center text-center"
                style={badge.premium ? {
                  border: '1px solid rgba(245,158,11,0.5)',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.05) 100%)',
                } : {}}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2"
                  style={badge.premium
                    ? { background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.15) 100%)', boxShadow: '0 0 12px rgba(245,158,11,0.3)' }
                    : { background: 'rgba(129,140,248,0.15)' }
                  }
                >
                  {badge.icon}
                  {badge.premium && (
                    <span className="absolute -top-0.5 -right-0.5 text-xs">✨</span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-white leading-tight">{badge.name}</div>
                {badge.premium && <div className="text-[10px] text-yellow-500 mt-0.5">Premium</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locked badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Kilitli Rozetler</h2>
          <div className="grid grid-cols-3 gap-2">
            {lockedBadges.map(badge => (
              <div
                key={badge.id}
                className="glass rounded-2xl p-3 flex flex-col items-center text-center opacity-40"
                style={badge.premium ? { border: '1px solid rgba(245,158,11,0.2)' } : {}}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-2 relative"
                  style={{ background: 'rgba(255,255,255,0.05)', filter: 'grayscale(1)' }}
                >
                  {badge.icon}
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    🔒
                  </div>
                </div>
                <div className="text-[11px] font-bold text-white/50 leading-tight">{badge.name}</div>
                {badge.premium && <div className="text-[10px] text-yellow-600 mt-0.5">Premium</div>}
                <div className="text-[10px] text-white/30 mt-0.5 leading-tight">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
