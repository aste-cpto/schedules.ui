import { Loader2 } from 'lucide-react'
import { Button } from '~/ui/Button'

type LessonCellEditModalFooterProps = {
  isSaving: boolean
  isBusy: boolean
  onClose: () => void
  onSave: () => void
}

export const LessonCellEditModalFooter = ({
  isSaving,
  isBusy,
  onClose,
  onSave,
}: LessonCellEditModalFooterProps) => (
  <footer className="flex shrink-0 justify-end gap-3 border-t border-border pt-4">
    <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
      Закрити
    </Button>
    <Button type="button" variant="primary" onClick={onSave} disabled={isBusy}>
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Збереження...
        </>
      ) : (
        'Зберегти'
      )}
    </Button>
  </footer>
)
