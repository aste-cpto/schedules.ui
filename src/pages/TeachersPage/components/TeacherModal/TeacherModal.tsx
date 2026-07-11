import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { Input } from '~/ui/Input'
import { Select } from '~/ui/Select'
import { Combobox } from '~/ui/Combobox/Combobox'
import { useTeacherForm } from './hooks/useTeacherForm'
import { ModalFormFooter } from '~/ui/modal/ModalFormFooter'
import { ModalHeader } from '~/ui/modal/ModalHeader'
import { ModalScrollBody } from '~/ui/modal/ModalScrollBody'

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
  useRegisterModalOpen(open)
  const { state, actions } = useTeacherForm({
    open,
    mode,
    teacherId,
    initialStatus,
    onSuccess,
  })

  const isEdit = mode === 'edit'

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
          title={isEdit ? 'Редагування викладача' : 'Новий викладач'}
          description={
            isEdit
              ? 'Оновіть особисті дані, статус та навантаження викладача'
              : 'Заповніть дані нового викладача'
          }
        />

        <ModalScrollBody>
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
                  allowCreate
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

          {state.validationError && <FormErrorMessage message={state.validationError} className="mt-4" />}
        </ModalScrollBody>

        <ModalFormFooter
          onCancel={onClose}
          submitLabel={isEdit ? 'Зберегти' : 'Створити'}
          loadingLabel="Збереження..."
          isLoading={state.isLoading}
          disabled={state.isLoadingDetails}
        />
      </form>
    </ModalLayout>
  )
}
