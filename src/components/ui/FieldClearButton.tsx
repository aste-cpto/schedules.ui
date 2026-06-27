import { X } from 'lucide-react'
import { cn } from '~/lib/cn'

type FieldClearButtonProps = {
  onClick: () => void
  className?: string
}

export const FieldClearButton = ({ onClick, className }: FieldClearButtonProps) => {
  return (
    <button
      type="button"
      aria-label="Очистити"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className={cn(
        'inline-flex h-4 w-4 shrink-0 items-center justify-center text-text-muted transition-colors hover:text-text',
        className,
      )}
    >
      <X className="h-4 w-4" strokeWidth={2.25} />
    </button>
  )
}
