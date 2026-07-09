import { CloudOff, RefreshCw } from 'lucide-react'
import { Button } from './Button'

type ErrorAlertProps = {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorAlert = ({
  title = 'Не вдалося завантажити дані',
  message,
  onRetry,
  retryLabel = 'Спробувати знову',
}: ErrorAlertProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-bg-surface px-6 py-12 text-center shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-violet via-accent-indigo to-accent-blue" />

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-indigo/10">
        <CloudOff className="h-7 w-7 text-accent-indigo" strokeWidth={2} />
      </div>

      <div className="flex flex-col items-center gap-6 mt-4">
        <h2 className="mt-5 text-base font-semibold text-text">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button type="button" onClick={onRetry} variant="primary" className="mt-8 gap-2">
          <RefreshCw className="h-4 w-4" strokeWidth={2.25} />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
