import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { Button } from './Button'
import type { ConfirmHandlerResult } from './ConfirmModal'

export type { ConfirmHandlerResult }

export type DeleteConfirmModalProps = {
  open: boolean
  title?: string
  entityName?: string
  description?: ReactNode
  consequence?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => ConfirmHandlerResult
  onClose: () => void
}

const TITLE_ID = 'delete-confirm-modal-title'
const DESCRIPTION_ID = 'delete-confirm-modal-description'

export const DeleteConfirmModal = ({
  open,
  title = 'Підтвердження видалення',
  entityName,
  description,
  consequence,
  confirmText = 'Видалити',
  cancelText = 'Скасувати',
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) => {
  const [isConfirming, setIsConfirming] = useState(false)

  useRegisterModalOpen(open)

  const handleConfirm = async () => {
    if (isConfirming) return

    setIsConfirming(true)
    try {
      const result = await onConfirm()
      if (result !== false) {
        onClose()
      }
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <ModalLayout
      open={open}
      onClose={isConfirming ? () => undefined : onClose}
      labelledBy={TITLE_ID}
      describedBy={DESCRIPTION_ID}
      panelClassName="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2 id={TITLE_ID} className="text-base font-semibold text-text">
              {title}
            </h2>
            {entityName && (
              <p className="mt-1 truncate font-medium text-text">
                «{entityName}»
              </p>
            )}
            {description && (
              <p id={DESCRIPTION_ID} className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {description}
              </p>
            )}
          </div>
        </div>

        {consequence && (
          <div className="rounded-lg border border-border bg-bg-muted/60 p-3 text-xs leading-relaxed text-text-secondary">
            {consequence}
          </div>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isConfirming}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={() => void handleConfirm()}
            disabled={isConfirming}
            className="min-w-[5.5rem]"
          >
            {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}
