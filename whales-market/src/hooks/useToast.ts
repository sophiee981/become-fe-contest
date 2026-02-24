import { useState, useCallback } from 'react'

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

export const useToastState = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((opts: {
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
  }) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const toast: ToastItem = { id, message: opts.message, type: opts.type, duration: opts.duration ?? 3000 }
    setToasts(prev => [...prev, toast])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, showToast, removeToast }
}
