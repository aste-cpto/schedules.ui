import { createContext, useCallback, useMemo, useState, useRef, type ReactNode } from 'react'
import { ToastViewport } from './ToastViewport'
import { TOAST_DURATION_MS, ERROR_TOAST_DURATION_MS, type ToastContextValue, type ToastItem } from './types'

export const ToastContext = createContext<ToastContextValue | null>(null)

type ToastProviderProps = {
  children: ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Used to synchronously track active messages for deduplication.
  // This prevents race conditions when multiple identical errors are triggered
  // simultaneously, and avoids adding state dependencies to useCallback.
  const activeMessages = useRef<Set<string>>(new Set())

  const showToast = useCallback(
    (type: ToastItem['type'], message: string) => {
      if (!message || activeMessages.current.has(message)) return

      const id = crypto.randomUUID()
      activeMessages.current.add(message)

      setToasts((prev) => [...prev, { id, type, message }])
      const duration = type === 'error' ? ERROR_TOAST_DURATION_MS : TOAST_DURATION_MS
      
      window.setTimeout(() => {
        activeMessages.current.delete(message)
        dismiss(id)
      }, duration)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message: string) => showToast('success', message),
      error: (message: string) => showToast('error', message),
    }),
    [showToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
