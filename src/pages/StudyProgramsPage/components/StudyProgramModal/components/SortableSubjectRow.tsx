import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import { Input } from '~/ui/Input'
import { cn } from '~/lib/cn'

export type SubjectField = {
  id: string
  name: string
  hours: number
  subjectId?: number
}

export const SortableSubjectRow = ({
  subject,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  subject: SubjectField
  index: number
  onUpdate: (f: keyof SubjectField, v: string | number) => void
  onRemove: () => void
  canRemove: boolean
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subject.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-end gap-3 rounded-xl border border-border/60 bg-bg-surface p-4 shadow-sm transition-shadow',
        isDragging && 'shadow-xl ring-2 ring-accent-indigo/20 border-accent-indigo/30',
      )}
    >
      <div className="flex items-center gap-2 pb-2.5">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="text-xs font-bold text-text-muted w-5">{index + 1}.</span>
      </div>

      <div className="flex-1">
        <Input
          label={index === 0 ? 'Назва предмета' : undefined}
          placeholder="Назва"
          value={subject.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          required
        />
      </div>

      <div className="w-28">
        <Input
          type="number"
          label={index === 0 ? 'Години' : undefined}
          placeholder="0"
          value={subject.hours || ''}
          onChange={(e) => onUpdate('hours', e.target.value)}
          required
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className={cn(
          'mb-1 flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
          canRemove
            ? 'text-text-muted hover:bg-red-50 hover:text-red-500'
            : 'text-text-muted/30 cursor-not-allowed',
        )}
      >
        <Trash2 className="h-4.5 w-4.5" />
      </button>
    </div>
  )
}
