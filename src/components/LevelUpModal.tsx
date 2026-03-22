import { useEffect, useRef } from 'react'
import { useStore, LEVELS } from '../store/useStore'

function Confetti() {
  const colors = ['#818cf8', '#c084fc', '#f472b6', '#fb923c', '#facc15', '#4ade80']
  const pieces = Array.from({ length: 30 })
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((_, i) => {
        const color = colors[i % colors.length]
        const left = `${Math.random() * 100}%`
        const delay = `${Math.random() * 0.5}s`
        const duration = `${1.5 + Math.random() * 1.5}s`
        const size = 6 + Math.random() * 8
        return (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left,
              top: '-10px',
              width: size,
              height: size,
              background: color,
              animation: `confetti-fall ${duration} ${delay} ease-in forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        )
      })}
    </div>
  )
}

export default function LevelUpModal() {
  const { levelUpModal, newLevel, closeLevelUpModal, selectedTitle } = useStore()
  const audioRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (levelUpModal) {
      try {
        const ctx = new AudioContext()
        const playNote = (freq: number, start: number, dur: number) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.value = freq
          osc.type = 'sine'
          gain.gain.setValueAtTime(0.3, ctx.currentTime + start)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
          osc.start(ctx.currentTime + start)
          osc.stop(ctx.currentTime + start + dur)
        }
        playNote(523, 0, 0.2)
        playNote(659, 0.2, 0.2)
        playNote(784, 0.4, 0.3)
        playNote(1047, 0.7, 0.5)
        audioRef.current = ctx
      } catch {}
    }
  }, [levelUpModal])

  if (!levelUpModal) return null

  const levelData = LEVELS.find(l => l.level === newLevel)
  const title = levelData?.title ?? selectedTitle

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={closeLevelUpModal}
    >
      <Confetti />
      <div
        className="relative glass rounded-3xl p-8 max-w-sm w-full mx-4 text-center animate-bounce-in"
        style={{ border: '1px solid rgba(167,139,250,0.4)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.15) 0%, transparent 70%)',
          }}
        />

        <div className="text-7xl mb-4 animate-float">🎉</div>
        <div
          className="text-xs font-bold tracking-widest uppercase mb-2"
          style={{ color: '#a78bfa' }}
        >
          Seviye Atladın!
        </div>
        <div
          className="text-6xl font-black mb-3 gradient-text"
        >
          {newLevel}
        </div>
        <div
          className="text-xl font-bold mb-2"
          style={{ color: '#e2e8f0' }}
        >
          {title}
        </div>
        <p className="text-sm text-white/50 mb-6">
          Harika gidiyorsun! Yeni ünvanını kazandın.
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: Math.min(newLevel, 5) }).map((_, i) => (
            <span
              key={i}
              className="text-2xl"
              style={{ animationDelay: `${i * 0.1}s`, animation: 'bounce-in 0.5s ease forwards' }}
            >
              ⭐
            </span>
          ))}
        </div>

        <button
          onClick={closeLevelUpModal}
          className="w-full py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
            color: 'white',
          }}
        >
          Harika! Devam Et 🚀
        </button>
      </div>
    </div>
  )
}
