export type ToastType = 'success' | 'error'

export type ToastItem = {
  id: string
  type: ToastType
  message: string
}

export type ToastContextValue = {
  success: (message: string) => void
  error: (message: string) => void
}

export const TOAST_DURATION_MS = 3000
