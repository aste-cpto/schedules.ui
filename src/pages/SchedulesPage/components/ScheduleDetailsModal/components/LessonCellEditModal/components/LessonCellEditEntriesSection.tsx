import { Plus } from 'lucide-react'
import { Button } from '~/ui/Button'
import type { LessonEntryDraft } from '../../../hooks/useLessonCellEdit'
import { LessonCellEditEntryRow } from './LessonCellEditEntryRow'

type SelectOption = {
  value: string
  label: string
}

type LessonCellEditEntriesSectionProps = {
  entries: LessonEntryDraft[]
  teacherOptions: SelectOption[]
  typeSelectOptions: SelectOption[]
  isBusy: boolean
  onAdd: () => void
  onUpdateEntry: (clientId: string, patch: Partial<Omit<LessonEntryDraft, 'clientId'>>) => void
  onRemoveEntry: (clientId: string) => void
}

export const LessonCellEditEntriesSection = ({
  entries,
  teacherOptions,
  typeSelectOptions,
  isBusy,
  onAdd,
  onUpdateEntry,
  onRemoveEntry,
}: LessonCellEditEntriesSectionProps) => (
  <div className="min-h-0 flex-1">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-indigo">
        призначені типи навчань
      </h3>
      <Button type="button" variant="secondary-accent" onClick={onAdd} disabled={isBusy}>
        <Plus className="h-4 w-4" />
        Додати
      </Button>
    </div>

    {entries.length === 0 ? (
      <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-secondary">
        Для цього дня ще не призначено занять. Натисніть «Додати», щоб створити перше.
      </p>
    ) : (
      <div className="space-y-3">
        {entries.map((entry) => (
          <LessonCellEditEntryRow
            key={entry.clientId}
            entry={entry}
            teacherOptions={teacherOptions}
            typeSelectOptions={typeSelectOptions}
            isBusy={isBusy}
            onUpdate={(patch) => onUpdateEntry(entry.clientId, patch)}
            onRemove={() => onRemoveEntry(entry.clientId)}
          />
        ))}
      </div>
    )}
  </div>
)
