import { useStore, LEVELS } from '../store/useStore'

export default function XPBar() {
  const { xp, level, xpToNextLevel, selectedTitle } = useStore()

  const currentLevelXP = LEVELS.find(l => l.level === level)?.xpRequired ?? 0
  const nextLevelXP = xpToNextLevel
  const progress = nextLevelXP > currentLevelXP
    ? ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    : 100

  return (
    <div className="flex items-center gap-3 px-4 py-3 glass rounded-2xl">
      {/* Level badge */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
        style={{
          background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
          boxShadow: '0 0 12px rgba(167,139,250,0.4)',
        }}
      >
        {level}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold truncate" style={{ color: '#c084fc' }}>
            {selectedTitle}
          </span>
          <span className="text-xs text-white/40 ml-2 flex-shrink-0">
            {xp.toLocaleString()} XP
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full progress-bar"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)',
              boxShadow: '0 0 6px rgba(167,139,250,0.6)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
