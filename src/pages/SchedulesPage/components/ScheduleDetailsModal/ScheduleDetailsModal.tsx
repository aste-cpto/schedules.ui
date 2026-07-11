import { cn } from '~/lib/cn'
import { useEffect, useState } from 'react'
import { Pencil, Save, X, Loader2 } from 'lucide-react'
import { Button } from '~/ui/Button'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { Input } from '~/ui/Input'
import { DatePicker } from '~/ui/DatePicker'
import type { ScheduleDto } from '~/types/api/schedule'
import { formatApiDateToDisplay, parseIsoDate } from '~/lib/dateUtils'
import { ScheduleLessonsTable } from './components/ScheduleLessonsTable'
import { useScheduleDetails } from './hooks/useScheduleDetails'

type Props = {
  open: boolean
  schedule: ScheduleDto | null
  onClose: () => void
  onUpdate?: () => void
}

export const ScheduleDetailsModal = ({ open, schedule, onClose, onUpdate }: Props) => {
  useRegisterModalOpen(open)
  const {
    currentSchedule,
    lessons,
    loading,
    isSaving,
    isEditing,
    validationError,
    startEditing,
    cancelEditing,
    saveEditing,
    setLessons,
    editForm,
    updateHeaderField,
  } = useScheduleDetails({
    open,
    schedule,
    onUpdate,
  })

  const [tableWidth, setTableWidth] = useState<number | null>(null)

  useEffect(() => {
    if (!open) {
      setTableWidth(null)
    }
  }, [open])

  const contentWidth = tableWidth ?? undefined

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      panelClassName="w-fit max-w-[80vw] max-h-[90vh] flex flex-col overflow-hidden !py-6"
    >
      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-x-hidden',
          !contentWidth && 'w-full max-w-2xl',
          contentWidth != null && 'max-w-full',
        )}
        style={contentWidth ? { width: contentWidth, maxWidth: '100%' } : undefined}
      >
        <header className="flex shrink-0 items-start justify-between border-b border-border pb-4">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <h2 className="break-words text-2xl font-bold leading-tight text-text">
              {currentSchedule?.studyProgramName}
            </h2>

            {isEditing ? (
              <div className="flex flex-wrap items-end gap-4 animate-in fade-in slide-in-from-top-1">
                <Input
                  label="Група №"
                  value={editForm.groupName}
                  onChange={(e) => updateHeaderField('groupName', e.target.value)}
                  wrapperClassName="w-32"
                  clearable={false}
                />
                <DatePicker
                  label="Початок"
                  value={editForm.startDate}
                  onChange={(val) => updateHeaderField('startDate', val)}
                  maxDate={parseIsoDate(editForm.endDate) ?? undefined}
                  wrapperClassName="w-44"
                />
                <DatePicker
                  label="Завершення"
                  value={editForm.endDate}
                  onChange={(val) => updateHeaderField('endDate', val)}
                  minDate={parseIsoDate(editForm.startDate) ?? undefined}
                  wrapperClassName="w-44"
                />
              </div>
            ) : (
              <p className="text-base text-text-secondary">
                Група №{currentSchedule?.groupName} з{' '}
                {formatApiDateToDisplay(currentSchedule?.startDate ?? '')} по{' '}
                {formatApiDateToDisplay(currentSchedule?.endDate ?? '')}
              </p>
            )}
          </div>

          <div className="ml-4 flex shrink-0 gap-2 pt-1">
            {!isEditing ? (
              <Button type="button" onClick={startEditing} variant="secondary-accent">
                <Pencil className="h-4 w-4" />
                Редагувати розклад
              </Button>
            ) : (
              <>
                <Button type="button" onClick={saveEditing} variant="primary" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Зберегти
                </Button>
                <Button type="button" onClick={cancelEditing} variant="ghost" disabled={isSaving}>
                  <X className="h-4 w-4" />
                  Скасувати
                </Button>
              </>
            )}
          </div>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-hidden">
          {loading ? (
            <p className="py-20 text-center text-text-secondary">Завантаження...</p>
          ) : (
            currentSchedule && (
              <ScheduleLessonsTable
                lessons={lessons}
                schedule={currentSchedule}
                isEditing={isEditing}
                onLessonsChange={setLessons}
                onTableWidthChange={setTableWidth}
              />
            )
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-4 pt-2">
          {validationError && <FormErrorMessage message={validationError} />}

          {isEditing && (
            <p className="text-sm text-text-secondary">
              Натисніть на клітинку дня, щоб редагувати типи навчань, викладачів та години.
            </p>
          )}

          <div className="flex justify-end">
            <Button type="button" onClick={onClose} variant="primary" className="px-8">
              Закрити
            </Button>
          </div>
        </footer>
      </div>
    </ModalLayout>
  )
}
