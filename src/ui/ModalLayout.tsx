import { X } from 'lucide-react'
import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/cn'

type ModalLayoutProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  panelClassName?: string
  closeLabel?: string
  showCloseButton?: boolean
  labelledBy?: string
  describedBy?: string
}
export const ModalLayout = ({
  open,
  onClose,
  children,
  panelClassName,
  closeLabel = 'Закрити',
  showCloseButton = true,
  labelledBy,
  describedBy,
}: ModalLayoutProps) => {
  if (!open) return null

  const classes = panelClassName?.split(' ') || []
  const maxWidthClass = classes.find((c) => c.startsWith('max-w-')) || 'max-w-md'
  const otherPanelClasses = classes.filter((c) => !c.startsWith('max-w-')).join(' ')

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn('relative w-full mx-auto', maxWidthClass)}
        onClick={(event) => event.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="absolute -right-10 -top-5 inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          className={cn(
            'rounded-xl border border-border bg-bg-surface px-6 py-8 shadow-lg w-full',
            otherPanelClasses,
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
