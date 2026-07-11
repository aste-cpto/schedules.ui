import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { Input } from '~/ui/Input'
import { DatePicker } from '~/ui/DatePicker'
import { Combobox } from '~/ui/Combobox/Combobox'
import { Select } from '~/ui/Select'
import { parseIsoDate } from '~/lib/dateUtils'
import { SCHEDULE_STATUS_OPTIONS } from '~/pages/SchedulesPage/config/scheduleStatus'
import { useScheduleForm } from './hooks/useScheduleForm'
import { ModalFormFooter } from '~/ui/modal/ModalFormFooter'
import { ModalHeader } from '~/ui/modal/ModalHeader'
import { ModalScrollBody } from '~/ui/modal/ModalScrollBody'

type ScheduleModalProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export const ScheduleModal = ({ open, onClose, onSuccess }: ScheduleModalProps) => {
  useRegisterModalOpen(open)
  const { state, actions } = useScheduleForm({ open, onSuccess })

  return (
    <ModalLayout open={open} onClose={onClose} panelClassName="max-w-2xl modal-form-panel">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void actions.submit()
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <ModalHeader
          title="Новий розклад"
          description="Заповніть дані для створення розкладу групи"
        />

        <ModalScrollBody>
          {state.isLoadingPrograms ? (
            <p className="py-8 text-center text-text-secondary">Завантаження програм...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Група №"
                placeholder="Наприклад: Основи крою, пошиття та машинної вишивки для початківців"
                value={state.groupName}
                onChange={(event) => actions.setGroupName(event.target.value)}
                wrapperClassName="sm:col-span-2"
                required
              />
              <Combobox
                label="Навчальна програма"
                options={state.studyProgramOptions}
                value={state.studyProgramId}
                onChange={actions.setStudyProgramId}
                placeholder="Оберіть навчальну програму..."
                wrapperClassName="sm:col-span-2"
              />
              <DatePicker
                label="Початок"
                value={state.startDate}
                onChange={actions.setStartDate}
                maxDate={parseIsoDate(state.endDate) ?? undefined}
              />
              <DatePicker
                label="Завершення"
                value={state.endDate}
                onChange={actions.setEndDate}
                minDate={parseIsoDate(state.startDate) ?? undefined}
              />
              <Select
                label="Статус"
                options={[...SCHEDULE_STATUS_OPTIONS]}
                value={state.status}
                onChange={actions.setStatus}
                wrapperClassName="sm:col-span-2"
                disabled
              />
            </div>
          )}

          {state.validationError && <FormErrorMessage message={state.validationError} className="mt-4" />}
        </ModalScrollBody>

        <ModalFormFooter
          onCancel={onClose}
          submitLabel="Створити"
          loadingLabel="Створення..."
          isLoading={state.isLoading}
          disabled={state.isLoadingPrograms}
        />
      </form>
    </ModalLayout>
  )
}
