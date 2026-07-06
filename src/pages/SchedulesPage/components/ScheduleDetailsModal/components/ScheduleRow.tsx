import { memo, useMemo } from 'react'
import type { LessonDto } from '~/types/api/lesson'
import { getUniqueTeacherNames } from '../utils/groupLessonsByTeacher'
import { cn } from '~/lib/cn'
import { ScheduleLessonCell } from './ScheduleLessonCell'

export const ScheduleRow = memo(
  ({
    subjectId,
    index,
    dateColumns,
    lessonsByDate,
    isEditing,
    onUpdateLessonHours,
  }: {
    subjectId: number
    index: number
    dateColumns: string[]
    lessonsByDate: Record<string, LessonDto[]>
    isEditing: boolean
    onUpdateLessonHours?: (id: number, h: number) => void
  }) => {
    const allLessonsInRow = useMemo(() => Object.values(lessonsByDate).flat(), [lessonsByDate])
    const rowHours = useMemo(
      () => allLessonsInRow.reduce((sum, l) => sum + l.hours, 0),
      [allLessonsInRow],
    )
    const teacherNames = useMemo(() => getUniqueTeacherNames(allLessonsInRow), [allLessonsInRow])

    return (
      <tr
        className={cn(
          'border-b border-border transition-colors last:border-b-0 hover:bg-bg-muted/10',
          index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/30',
        )}
      >
        <td className="px-4 py-3 text-center tabular-nums text-text-secondary">{index + 1}</td>
        <td className="px-4 py-3 leading-snug font-medium text-text">
          {`Предмет №${subjectId}`}
        </td>
        <td className="px-4 py-3 text-center tabular-nums font-semibold text-text">{rowHours}</td>

        {dateColumns.map((date) => (
          <td key={date} className="px-2 py-3 align-top border-r border-border/30 last:border-r-0">
            <ScheduleLessonCell
              lessons={lessonsByDate[date] || []}
              isEditing={isEditing}
              onUpdateLessonHours={onUpdateLessonHours}
            />
          </td>
        ))}

        <td className="px-4 py-3 text-xs font-medium uppercase leading-snug text-text-secondary">
          <div className="flex flex-col gap-1">
            {teacherNames.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </td>
      </tr>
    )
  },
)
ScheduleRow.displayName = 'ScheduleRow'
