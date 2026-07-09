import { AlertCircle } from 'lucide-react'
import { cn } from '~/lib/cn'

type FormErrorMessageProps = {
  message: string
  className?: string
}

export const FormErrorMessage = ({ message, className }: FormErrorMessageProps) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-3 text-sm font-medium text-rose-700',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden />
      <span>{message}</span>
    </div>
  )
}
