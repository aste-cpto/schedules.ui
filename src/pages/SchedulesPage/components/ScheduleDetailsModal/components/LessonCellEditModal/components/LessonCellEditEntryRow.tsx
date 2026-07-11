import { Trash2 } from 'lucide-react'
import { Button } from '~/ui/Button'
import { Combobox } from '~/ui/Combobox/Combobox'
import { Input } from '~/ui/Input'
import { Select } from '~/ui/Select'
import { cn } from '~/lib/cn'
import { isPairLessonType } from '~/pages/SchedulesPage/config/lessonTypes'
import type { LessonType } from '~/types/api/lesson'
import type { LessonEntryDraft } from '../../../hooks/useLessonCellEdit'

type SelectOption = {
  value: string
  label: string
}

type LessonCellEditEntryRowProps = {
  entry: LessonEntryDraft
  teacherOptions: SelectOption[]
  typeSelectOptions: SelectOption[]
  isBusy: boolean
  onUpdate: (patch: Partial<Omit<LessonEntryDraft, 'clientId'>>) => void
  onRemove: () => void
}

export const LessonCellEditEntryRow = ({
  entry,
  teacherOptions,
  typeSelectOptions,
  isBusy,
  onUpdate,
  onRemove,
}: LessonCellEditEntryRowProps) => {
  const showPairOrder = isPairLessonType(entry.type)

  return (
    <div
      className={cn(
        'grid gap-3 rounded-lg border border-border bg-bg-surface p-4',
        showPairOrder ? 'sm:grid-cols-[1.4fr_1fr_100px_80px_auto]' : 'sm:grid-cols-[1.4fr_1fr_100px_auto]',
      )}
    >
      <Combobox
        label="Викладач"
        options={teacherOptions}
        value={entry.teacherId ? String(entry.teacherId) : ''}
        onChange={(value) => onUpdate({ teacherId: Number(value) || 0 })}
        placeholder="Оберіть викладача"
      />
      <Select
        label="Тип заняття"
        options={typeSelectOptions}
        value={String(entry.type)}
        onChange={(value) => onUpdate({ type: value as LessonType })}
        disabled={typeSelectOptions.length === 0}
      />
      <Input
        label="Години"
        type="number"
        min={1}
        value={String(entry.hours)}
        onChange={(event) => onUpdate({ hours: Number(event.target.value) || 0 })}
        clearable={false}
      />
      {showPairOrder && (
        <Input
          label="№ пари"
          type="number"
          min={1}
          value={String(entry.order)}
          onChange={(event) => onUpdate({ order: Number(event.target.value) || 0 })}
          clearable={false}
        />
      )}
      <div className="flex items-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onRemove}
          disabled={isBusy}
          aria-label="Видалити заняття"
        >
          <Trash2 className="h-4 w-4 text-rose-500" />
        </Button>
      </div>
    </div>
  )
}
