import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { ModalLayout } from '~/ui/ModalLayout'
import { FormErrorMessage } from '~/ui/FormErrorMessage'
import { Input } from '~/ui/Input'
import { SortableSubjectRow } from './components/SortableSubjectRow'
import { useStudyProgramForm } from './hooks/useStudyProgramForm'
import { Button } from '~/ui/Button'

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
  const { state, actions } = useStudyProgramForm({
    open,
    mode,
    programId,
    onSuccess,
  })

  const isEdit = mode === 'edit'
  const isBusy = state.isLoading || state.isLoadingDetails

  return (
    <ModalLayout open={open} onClose={onClose} panelClassName="max-w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          actions.submit()
        }}
        className="flex flex-col gap-8"
      >
        <header>
          <h2 className="text-2xl font-bold text-text">
            {isEdit ? 'Редагування програми' : 'Нова програма'}
          </h2>
          <p className="text-text-secondary mt-1">
            {isEdit
              ? 'Оновіть назву програми та перелік її предметів'
              : 'Заповніть назву програми та перелік її предметів'}
          </p>
        </header>

        {state.isLoadingDetails ? (
          <p className="py-8 text-center text-text-secondary">Завантаження даних програми...</p>
        ) : (
          <>
            <Input
              label="Назва навчальної програми"
              placeholder="Наприклад: Факультет кібернетики"
              value={state.programName}
              onChange={(e) => actions.setProgramName(e.target.value)}
              required
            />

            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="font-semibold text-text">
                  Предмети програми ({state.subjects.length})
                </h3>
                <Button variant="secondary-accent" onClick={actions.addSubject}>
                  <Plus className="h-3.5 w-3.5" /> Додати предмет
                </Button>
              </div>

              <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                <DndContext
                  sensors={state.sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={actions.handleDragEnd}
                >
                  <SortableContext
                    items={state.subjects.map((subject) => subject.id)}
                    strategy={verticalListSortingStrategy}
                  >
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
                  </SortableContext>
                </DndContext>
              </div>
            </section>
          </>
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
