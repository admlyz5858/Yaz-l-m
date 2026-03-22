import React, { useEffect } from 'react'
import { useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import LevelUpModal from './components/LevelUpModal'
import SettingsModal from './components/SettingsModal'
import ToastContainer from './components/ToastContainer'
import HomePage from './pages/HomePage'
import FocusPage from './pages/FocusPage'
import StatsPage from './pages/StatsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import GroupsPage from './pages/GroupsPage'
import BadgesPage from './pages/BadgesPage'

const PAGE_TITLES: Record<string, string> = {
  home: 'StudyFlow',
  focus: 'Odaklanma',
  stats: 'İstatistikler',
  leaderboard: 'Sıralama',
  groups: 'Gruplar',
  badges: 'Rozetler',
}

export default function App() {
  const { activeTab, updatePetMood } = useStore()

  useEffect(() => {
    const interval = setInterval(updatePetMood, 60000)
    return () => clearInterval(interval)
  }, [updatePetMood])

  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />,
    focus: <FocusPage />,
    stats: <StatsPage />,
    leaderboard: <LeaderboardPage />,
    groups: <GroupsPage />,
    badges: <BadgesPage />,
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0a0a0f' }}>
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', top: '-10%', right: '-10%' }}
        />
        <div
          className="absolute w-80 h-80 rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)', bottom: '10%', left: '-10%' }}
        />
        <div
          className="absolute w-64 h-64 rounded-full blur-[80px] opacity-8"
          style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)', top: '40%', left: '30%' }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-12 pb-3">
        <h1 className="text-xl font-black gradient-text">{PAGE_TITLES[activeTab]}</h1>
        <div
          className="text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(129,140,248,0.15)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.2)' }}
        >
          ✨ StudyFlow
        </div>
      </header>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-24">
        <div key={activeTab} className="animate-slide-up">
          {pages[activeTab]}
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNav />

      {/* Modals */}
      <LevelUpModal />
      <SettingsModal />
    </div>
  )
}
