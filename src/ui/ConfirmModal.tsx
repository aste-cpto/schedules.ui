import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { Button } from './Button'

export type ConfirmHandlerResult = void | boolean | Promise<void | boolean>

type ConfirmModalProps = {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  onConfirm: () => ConfirmHandlerResult
  onClose: () => void
}

const TITLE_ID = 'confirm-modal-title'
const DESCRIPTION_ID = 'confirm-modal-description'

export const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  variant = 'default',
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const confirmButtonVariant = variant === 'danger' ? 'danger' : 'primary'

  useRegisterModalOpen(open)

  useEffect(() => {
    if (!open) {
      setIsConfirming(false)
    }
  }, [open])

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
      panelClassName="flex min-h-[12rem] flex-col justify-between"
    >
      <div className="text-center">
        <h2 id={TITLE_ID} className="text-lg font-semibold text-text">
          {title}
        </h2>
        <p id={DESCRIPTION_ID} className="mt-3 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-[14rem] grid-cols-2 gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isConfirming}
          className="w-full"
        >
          {cancelText}
        </Button>

        <Button
          variant={confirmButtonVariant}
          onClick={() => void handleConfirm()}
          disabled={isConfirming}
          className="w-full"
        >
          {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
        </Button>
      </div>
    </ModalLayout>
  )
}
