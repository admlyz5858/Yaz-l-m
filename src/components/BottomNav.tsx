import { useStore, Tab } from '../store/useStore'
import { Home, Timer, Trophy, Users, Award } from 'lucide-react'

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Ana Sayfa', icon: Home },
  { id: 'focus', label: 'Odaklan', icon: Timer },
  { id: 'leaderboard', label: 'Sıralama', icon: Trophy },
  { id: 'groups', label: 'Gruplar', icon: Users },
  { id: 'badges', label: 'Rozetler', icon: Award },
]

export default function BottomNav() {
  const { activeTab, setActiveTab } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/10">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200"
              style={active ? {
                background: 'linear-gradient(135deg, rgba(129,140,248,0.2) 0%, rgba(192,132,252,0.2) 100%)'
              } : {}}
            >
              <Icon
                size={20}
                className="transition-all duration-200"
                style={active
                  ? { color: '#a78bfa', filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.6))' }
                  : { color: 'rgba(255,255,255,0.4)' }
                }
              />
              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={active ? { color: '#a78bfa' } : { color: 'rgba(255,255,255,0.4)' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
