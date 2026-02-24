import React, { createContext, useContext } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'
import { useToastState, type ToastItem } from '@/hooks/useToast'

// ─── Context ───────────────────────────────────────────────────────────────

interface ToastContextValue {
  showToast: (opts: { message: string; type: 'success' | 'error' | 'warning' | 'info'; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

// ─── Single Toast ───────────────────────────────────────────────────────────

const icons = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
}

const ToastCard: React.FC<{ toast: ToastItem; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  return (
    <div
      className={clsx(
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-modal animate-slide-in',
        'bg-bg-surface min-w-[280px] max-w-sm',
        toast.type === 'success' && 'border-success/30 text-success',
        toast.type === 'error'   && 'border-danger/30 text-danger',
        toast.type === 'warning' && 'border-warning/30 text-warning',
        toast.type === 'info'    && 'border-info/30 text-info',
      )}
    >
      <span className="shrink-0 mt-0.5">{icons[toast.type]}</span>
      <p className="flex-1 text-14 text-text-primary">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}

// ─── Provider + Container ──────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, showToast, removeToast } = useToastState()

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastCard toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
