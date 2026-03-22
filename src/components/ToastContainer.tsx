import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore()

  return (
    <div className="fixed top-14 left-0 right-0 z-[80] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.slice(-3).map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: { id: string; message: string; icon: string; type: string }; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const colors = {
    success: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' },
    info: { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)', text: '#60a5fa' },
    achievement: { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
  }
  const c = colors[toast.type as keyof typeof colors] ?? colors.info

  return (
    <div
      className="pointer-events-auto animate-slide-up flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-lg"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(12px)',
        maxWidth: 320,
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span className="text-lg flex-shrink-0">{toast.icon}</span>
      <span className="text-xs font-semibold" style={{ color: c.text }}>{toast.message}</span>
    </div>
  )
}
