import { X } from 'lucide-react'
import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/cn'

type ModalLayoutProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  panelClassName?: string
  overlayClassName?: string
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
  overlayClassName,
  closeLabel = 'Закрити',
  showCloseButton = true,
  labelledBy,
  describedBy,
}: ModalLayoutProps) => {
  if (!open) return null

  const classes = panelClassName?.split(/\s+/).filter(Boolean) ?? []
  const maxWidthClass = classes.find((c) => c.startsWith('max-w-')) || 'max-w-md'
  const fitsContent = classes.includes('w-fit')
  const otherPanelClasses = classes
    .filter((c) => !c.startsWith('max-w-') && c !== 'w-fit' && c !== 'w-full')
    .join(' ')
  const showScrollbars = classes.includes('scrollbar-visible')
  const usesInternalScroll = classes.some(
    (c) =>
      c === 'modal-form-panel' ||
      c === 'overflow-hidden' ||
      c === '!overflow-hidden' ||
      c.endsWith(':overflow-hidden'),
  )

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center bg-black/40 p-4',
        overlayClassName ?? 'z-[100]',
      )}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          'relative mx-auto',
          fitsContent ? 'w-fit max-w-full' : 'w-full',
          maxWidthClass,
        )}
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
            'rounded-xl border border-border bg-bg-surface px-6 py-8 shadow-lg max-h-[90vh]',
            fitsContent ? 'w-fit max-w-full' : 'w-full',
            fitsContent && otherPanelClasses.includes('flex') && 'items-start',
            usesInternalScroll ? 'min-h-0 overflow-hidden' : 'overflow-y-auto',
            !showScrollbars && 'scrollbar-hidden',
            otherPanelClasses.includes('flex') && 'min-h-0',
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
