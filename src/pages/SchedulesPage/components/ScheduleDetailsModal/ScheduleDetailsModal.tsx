import { Pencil, Save, X, Loader2 } from 'lucide-react'
import { Button } from '~/ui/Button'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { ModalLayout } from '~/ui/ModalLayout'
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
    updateLessonHours,
    editForm,
    updateHeaderField,
  } = useScheduleDetails({
    open,
    schedule,
    onUpdate,
  })

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      panelClassName="max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden !py-6"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <header className="flex shrink-0 items-start justify-between border-b border-border pb-4">
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-2xl font-bold leading-tight text-text">
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

        <div className="min-h-0 flex-1 overflow-auto">
          {loading ? (
            <p className="py-20 text-center text-text-secondary">Завантаження...</p>
          ) : (
            currentSchedule && (
              <ScheduleLessonsTable
                lessons={lessons}
                schedule={currentSchedule}
                isEditing={isEditing}
                onUpdateLessonHours={updateLessonHours}
              />
            )
          )}
        </div>

        <footer className="flex shrink-0 flex-col gap-4 pt-2">
          {validationError && <FormErrorMessage message={validationError} />}

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
