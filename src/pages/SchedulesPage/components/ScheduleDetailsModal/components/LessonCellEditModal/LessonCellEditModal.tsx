import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { LESSON_TYPE_OPTIONS } from '~/pages/SchedulesPage/config/lessonTypes'
import type { LessonCellContext, LessonDto } from '~/types/api/lesson'
import type { ScheduleDto } from '~/types/api/schedule'
import { useLessonCellEdit } from '../../hooks/useLessonCellEdit'
import { LessonCellEditEntriesSection } from './components/LessonCellEditEntriesSection'
import { LessonCellEditModalFooter } from './components/LessonCellEditModalFooter'
import { LessonCellEditModalHeader } from './components/LessonCellEditModalHeader'

type LessonCellEditModalProps = {
  open: boolean
  context: LessonCellContext | null
  schedule: ScheduleDto | null
  lessons: LessonDto[]
  onClose: () => void
  onSaved: (lessons: LessonDto[], context: LessonCellContext) => void
}

const typeSelectOptions = LESSON_TYPE_OPTIONS.map((option) => ({
  value: String(option.value),
  label: option.label,
}))

export const LessonCellEditModal = ({
  open,
  context,
  schedule,
  lessons,
  onClose,
  onSaved,
}: LessonCellEditModalProps) => {
  useRegisterModalOpen(open)
  const {
    entries,
    teacherOptions,
    isLoadingTeachers,
    isSaving,
    validationError,
    subjectHoursSummary,
    hasBlockingValidationError,
    addEntry,
    removeEntry,
    updateEntry,
    save,
  } = useLessonCellEdit({
    open,
    context,
    schedule,
    lessons,
    onSaved: (updatedLessons) => {
      if (context) {
        onSaved(updatedLessons, context)
      }
      onClose()
    },
  })

  const isBusy = isSaving || isLoadingTeachers

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      overlayClassName="z-[110]"
      panelClassName="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden !py-6"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <LessonCellEditModalHeader
          date={context?.date ?? ''}
          subjectName={context?.subjectName}
          usedHours={subjectHoursSummary?.usedHours}
          plannedHours={subjectHoursSummary?.plannedHours}
          isOverLimit={subjectHoursSummary?.isOverLimit}
        />

        <LessonCellEditEntriesSection
          entries={entries}
          teacherOptions={teacherOptions}
          typeSelectOptions={typeSelectOptions}
          isBusy={isBusy}
          onAdd={addEntry}
          onUpdateEntry={updateEntry}
          onRemoveEntry={removeEntry}
        />

        {validationError && <FormErrorMessage message={validationError} />}

        <LessonCellEditModalFooter
          isSaving={isSaving}
          isBusy={isBusy || hasBlockingValidationError}
          onClose={onClose}
          onSave={() => void save()}
        />
      </div>
    </ModalLayout>
  )
}
