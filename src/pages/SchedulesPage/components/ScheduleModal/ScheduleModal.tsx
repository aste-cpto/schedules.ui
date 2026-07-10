import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { Input } from '~/ui/Input'
import { DatePicker } from '~/ui/DatePicker'
import { Select } from '~/ui/Select'
import { Button } from '~/ui/Button'
import { parseIsoDate } from '~/lib/dateUtils'
import { SCHEDULE_STATUS_OPTIONS } from '~/pages/SchedulesPage/config/scheduleStatus'
import { useScheduleForm } from './hooks/useScheduleForm'

type ScheduleModalProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export const ScheduleModal = ({ open, onClose, onSuccess }: ScheduleModalProps) => {
  useRegisterModalOpen(open)
  const { state, actions } = useScheduleForm({ open, onSuccess })

  const isBusy = state.isLoading || state.isLoadingPrograms

  return (
    <ModalLayout open={open} onClose={onClose} panelClassName="max-w-2xl">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          void actions.submit()
        }}
        className="flex flex-col gap-6"
      >
        <header>
          <h2 className="text-2xl font-bold text-text">Новий розклад</h2>
          <p className="mt-1 text-text-secondary">Заповніть дані для створення розкладу групи</p>
        </header>

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
            <Select
              label="Навчальна програма"
              options={state.studyProgramOptions}
              value={state.studyProgramId}
              onChange={actions.setStudyProgramId}
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

        {state.validationError && <FormErrorMessage message={state.validationError} />}

        <footer className="flex justify-end gap-3 pt-2">
          <Button type="button" onClick={onClose} variant="ghost" disabled={isBusy}>
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-8"
            disabled={isBusy || state.isLoadingPrograms}
          >
            {state.isLoading ? 'Створення...' : 'Створити'}
          </Button>
        </footer>
      </form>
    </ModalLayout>
  )
}
