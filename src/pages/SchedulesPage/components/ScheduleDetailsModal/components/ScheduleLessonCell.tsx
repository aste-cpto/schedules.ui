import { cn } from '~/lib/cn'
import type { LessonDto } from '~/types/api/lesson'
import { getCellDisplayLines } from '../utils/formatLessonDisplay'

type ScheduleLessonCellProps = {
  lessons: LessonDto[]
  isEditing: boolean
  isRecentlyEdited?: boolean
  onClick?: () => void
}

export const ScheduleLessonCell = ({
  lessons,
  isEditing,
  isRecentlyEdited = false,
  onClick,
}: ScheduleLessonCellProps) => {
  const isClickable = isEditing && Boolean(onClick)
  const displayLines = getCellDisplayLines(lessons)

  return (
    <button
      type="button"
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        'group flex h-full min-h-full w-full flex-col rounded-md px-1 py-1.5 text-left transition-colors',
        isRecentlyEdited && 'lesson-cell-recently-edited',
        isClickable &&
          'cursor-pointer hover:bg-accent-indigo/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo/40',
        !isClickable && 'cursor-default',
        lessons.length === 0 && isClickable && !isRecentlyEdited && 'border border-dashed border-border/80',
      )}
    >
      {displayLines.length === 0 ? (
        <span
          className={cn(
            'flex flex-1 items-center justify-center text-center text-[11px] text-text-muted',
            isClickable &&
              'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
          )}
        >
          {isClickable ? 'Додати заняття' : '—'}
        </span>
      ) : (
        <div className="flex flex-col gap-1">
          {displayLines.map((line) => (
            <span
              key={line.key}
              className="text-[11px] font-medium uppercase leading-snug text-text-secondary underline decoration-border/80 underline-offset-2"
            >
              {line.text}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}
