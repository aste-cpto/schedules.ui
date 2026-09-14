import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { ModalLayout } from '~/ui/ModalLayout'
import { useRegisterModalOpen } from '~/contexts/ModalGuardContext'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { Input } from '~/ui/Input'
import { SortableSubjectRow } from './components/SortableSubjectRow'
import { useStudyProgramForm } from './hooks/useStudyProgramForm'
import { Button } from '~/ui/Button'
import { ModalFormFooter } from '~/ui/modal/ModalFormFooter'
import { ModalHeader } from '~/ui/modal/ModalHeader'
import { ModalScrollBody } from '~/ui/modal/ModalScrollBody'

type StudyProgramModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  programId?: number
  onClose: () => void
  onSuccess: () => void
}

export const StudyProgramModal = ({
  open,
  mode,
  programId,
  onClose,
  onSuccess,
}: StudyProgramModalProps) => {
  useRegisterModalOpen(open)
  const { state, actions } = useStudyProgramForm({
    open,
    mode,
    programId,
    onSuccess,
  })

  const isEdit = mode === 'edit'
  const displayedValidationError = state.validationError ?? state.duplicateSubjectError

  return (
    <ModalLayout open={open} onClose={onClose} panelClassName="max-w-3xl modal-form-panel">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          actions.submit()
        }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <ModalHeader
          title={isEdit ? 'Редагування програми' : 'Нова програма'}
          description={
            isEdit
              ? 'Оновіть назву програми та перелік її предметів'
              : 'Заповніть назву програми та перелік її предметів'
          }
        />

        <ModalScrollBody>
          {state.isLoadingDetails ? (
            <p className="py-8 text-center text-text-secondary">Завантаження даних програми...</p>
          ) : (
            <div className="flex flex-col gap-8">
              <Input
                label="Назва навчальної програми"
                placeholder="Введіть назву"
                value={state.programName}
                onChange={(e) => actions.setProgramName(e.target.value)}
                required
              />

              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-semibold text-text">
                    Предмети програми ({state.subjects.length})
                  </h3>
                  <Button type="button" variant="secondary-accent" onClick={actions.addSubject}>
                    <Plus className="h-3.5 w-3.5" /> Додати предмет
                  </Button>
                </div>

                <DndContext
                  sensors={state.sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={actions.handleDragEnd}
                >
                  <SortableContext
                    items={state.subjects.map((subject) => subject.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {state.subjects.map((subject, index) => (
                        <SortableSubjectRow
                          key={subject.id}
                          subject={subject}
                          index={index}
                          canRemove={state.subjects.length > 1}
                          onUpdate={(field, value) => actions.updateSubject(subject.id, field, value)}
                          onRemove={() => actions.removeSubject(subject.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </section>
            </div>
          )}

          {displayedValidationError && (
            <FormErrorMessage message={displayedValidationError} className="mt-4" />
          )}
        </ModalScrollBody>

        <ModalFormFooter
          onCancel={onClose}
          submitLabel={isEdit ? 'Зберегти' : 'Створити'}
          loadingLabel="Збереження..."
          isLoading={state.isLoading}
          disabled={state.isLoadingDetails || Boolean(displayedValidationError)}
        />
      </form>
    </ModalLayout>
  )
}
