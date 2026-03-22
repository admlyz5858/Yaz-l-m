import { useStore, PetMood } from '../store/useStore'

const PET_DATA: Record<PetMood, { emoji: string; mood: string; color: string; message: string }> = {
  sleeping: { emoji: '😴', mood: 'Uyuyor', color: '#94a3b8', message: 'Biraz çalışalım mı?' },
  sad: { emoji: '😔', mood: 'Üzgün', color: '#f87171', message: 'Daha fazla çalışmamı ister misin?' },
  neutral: { emoji: '😐', mood: 'Nötr', color: '#fbbf24', message: 'Devam et, daha iyisi mümkün!' },
  happy: { emoji: '😊', mood: 'Mutlu', color: '#4ade80', message: 'Harika gidiyorsun!' },
  excited: { emoji: '🤩', mood: 'Çılgın', color: '#818cf8', message: 'İnanılmazsın! Devam et!' },
}

export default function StudyPet() {
  const { petMood, petName, streak } = useStore()
  const data = PET_DATA[petMood]

  return (
    <div
      className="glass rounded-2xl p-4 flex items-center gap-4"
      style={{ border: `1px solid ${data.color}30` }}
    >
      {/* Pet */}
      <div className="relative flex-shrink-0">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-float"
          style={{ background: `${data.color}20` }}
        >
          {data.emoji}
        </div>
        {/* Mood indicator */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 border-[#0a0a0f]"
          style={{ background: data.color }}
        >
          {petMood === 'sleeping' ? '💤' : petMood === 'excited' ? '✨' : ''}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-bold text-sm text-white">{petName}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${data.color}20`, color: data.color }}
          >
            {data.mood}
          </span>
        </div>
        <p className="text-xs text-white/50 mb-2">{data.message}</p>
        {/* Happiness bar */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const moodValues: Record<PetMood, number> = { sleeping: 0, sad: 1, neutral: 2, happy: 3, excited: 5 }
            const filled = i < moodValues[petMood]
            return (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{ background: filled ? data.color : 'rgba(255,255,255,0.1)' }}
              />
            )
          })}
        </div>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div className="flex-shrink-0 text-center">
          <div className="text-2xl">🔥</div>
          <div className="text-xs font-bold text-orange-400">{streak}</div>
        </div>
      )}
    </div>
  )
}
