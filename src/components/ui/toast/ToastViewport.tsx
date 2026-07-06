import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/cn'
import type { ToastItem } from './types'

type ToastViewportProps = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export const ToastViewport = ({ toasts, onDismiss }: ToastViewportProps) => {
  if (toasts.length === 0) return null

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[150] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={cn(
            'toast animate-in fade-in slide-in-from-bottom-2',
            toast.type === 'success' && 'toast--success',
            toast.type === 'error' && 'toast--error',
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Закрити"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body,
  )
}
