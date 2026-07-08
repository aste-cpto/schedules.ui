import { ModalLayout } from '~/components/ui/ModalLayout'
import { FormErrorMessage } from '~/components/ui/FormErrorMessage'
import { Input } from '~/components/ui/Input'
import { Select } from '~/components/ui/Select'
import { Combobox } from '~/components/ui/Combobox'
import { Button } from '~/components/ui/Button'
import { useTeacherForm } from './hooks/useTeacherForm'

import type { TeacherStatus } from '~/types/api/teacher'

type TeacherModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  teacherId?: number
  initialStatus?: TeacherStatus
  onClose: () => void
  onSuccess: () => void
}

export const TeacherModal = ({
  open,
  mode,
  teacherId,
  initialStatus,
  onClose,
  onSuccess,
}: TeacherModalProps) => {
  const { state, actions } = useTeacherForm({
    open,
    mode,
    teacherId,
    initialStatus,
    onSuccess,
  })

  const isEdit = mode === 'edit'
  const isBusy = state.isLoading || state.isLoadingDetails

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
          <h2 className="text-2xl font-bold text-text">
            {isEdit ? 'Редагування викладача' : 'Новий викладач'}
          </h2>
          <p className="mt-1 text-text-secondary">
            {isEdit
              ? 'Оновіть особисті дані, статус та навантаження викладача'
              : 'Заповніть дані нового викладача'}
          </p>
        </header>

        {state.isLoadingDetails ? (
          <p className="py-8 text-center text-text-secondary">Завантаження даних викладача...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Прізвище"
              value={state.lastName}
              onChange={(event) => actions.setLastName(event.target.value)}
              required
            />
            <Input
              label="Ім'я"
              value={state.firstName}
              onChange={(event) => actions.setFirstName(event.target.value)}
              required
            />
            <Input
              label="По батькові"
              value={state.patronymic}
              onChange={(event) => actions.setPatronymic(event.target.value)}
              wrapperClassName={state.showStatus ? undefined : 'sm:col-span-2'}
              required
            />
            {state.showStatus && (
              <Select
                label="Статус"
                options={state.statusOptions}
                value={state.status}
                onChange={(value) => actions.setStatus(value as TeacherStatus)}
                disabled
              />
            )}
            {state.showLoadYear && (
              <Combobox
                label="Рік навантаження"
                value={state.selectedYear}
                options={state.yearOptions}
                onChange={(value) => actions.handleYearChange(value)}
                placeholder="Введіть або оберіть рік..."
              />
            )}
            <Input
              label="Годин на рік"
              type="number"
              min={1}
              value={state.hours}
              onChange={(event) => actions.setHours(event.target.value)}
              required
              wrapperClassName={state.showLoadYear ? undefined : 'sm:col-span-2'}
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
            disabled={isBusy || state.isLoadingDetails}
          >
            {state.isLoading ? 'Збереження...' : isEdit ? 'Зберегти' : 'Створити'}
          </Button>
        </footer>
      </form>
    </ModalLayout>
  )
}
