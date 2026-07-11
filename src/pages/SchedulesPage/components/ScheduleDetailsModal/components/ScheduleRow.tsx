import { memo, useMemo } from 'react'
import type { LessonDto } from '~/types/api/lesson'
import { toApiNumber } from '~/lib/lessonDateUtils'
import { formatSubjectRemainingHint } from '~/lib/validationMessages'
import { getUniqueTeacherNames } from '../utils/groupLessonsByTeacher'
import type { LessonCellContext } from '~/types/api/lesson'
import { cn } from '~/lib/cn'
import {
  getDateColumnStyle,
  getStickyLeftStyle,
  getStickyRightStyle,
} from '../config/scheduleTableLayout'
import { ScheduleLessonCell } from './ScheduleLessonCell'

function getRowBackgroundClass(index: number, isComplete: boolean) {
  if (isComplete) return 'bg-emerald-500/10'

  return index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/30'
}

export const ScheduleRow = memo(
  ({
    subjectId,
    subjectName,
    plannedHours,
    remainingHours,
    isOverLimit,
    index,
    visibleDateColumns,
    lessonsByDate,
    isEditing,
    isRecentlyEdited,
    onCellClick,
  }: {
    subjectId: number
    subjectName: string
    plannedHours: number
    remainingHours: number
    isOverLimit: boolean
    index: number
    visibleDateColumns: string[]
    lessonsByDate: Record<string, LessonDto[]>
    isEditing: boolean
    isRecentlyEdited?: (date: string) => boolean
    onCellClick?: (context: LessonCellContext) => void
  }) => {
    const allLessonsInRow = useMemo(() => Object.values(lessonsByDate).flat(), [lessonsByDate])
    const teacherNames = useMemo(() => getUniqueTeacherNames(allLessonsInRow), [allLessonsInRow])
    const isComplete = !isOverLimit && remainingHours === 0 && plannedHours > 0
    const rowBackgroundClass = getRowBackgroundClass(index, isComplete)

    return (
      <tr
        className={cn(
          'border-b border-border transition-colors last:border-b-0',
          isComplete ? 'hover:bg-emerald-500/15' : 'hover:bg-bg-muted/10',
          rowBackgroundClass,
        )}
      >
        <td
          style={getStickyLeftStyle('index')}
          className={cn(
            'sticky z-10 px-4 py-3 text-center tabular-nums text-text-secondary border-r border-border/50',
            rowBackgroundClass,
          )}
        >
          {index + 1}
        </td>
        <td
          style={getStickyLeftStyle('subject')}
          className={cn(
            'sticky z-10 whitespace-normal break-words px-3 py-3 font-medium leading-snug border-r border-border/50 align-top',
            isComplete ? 'text-emerald-800' : 'text-text',
            rowBackgroundClass,
          )}
        >
          {subjectName}
        </td>
        <td
          style={getStickyLeftStyle('hours')}
          className={cn(
            'sticky z-10 px-2 py-3 text-center border-r border-border/50 shadow-[4px_0_6px_-4px_rgba(0,0,0,0.08)] align-top',
            rowBackgroundClass,
          )}
        >
          <div className="font-semibold tabular-nums text-text">{toApiNumber(plannedHours)}</div>
          <div
            className={cn(
              'mt-1 text-[10px] font-medium leading-tight tabular-nums',
              isOverLimit ? 'text-rose-600' : remainingHours === 0 ? 'text-emerald-700' : 'text-text-muted',
            )}
          >
            {formatSubjectRemainingHint(remainingHours)}
          </div>
        </td>

        {visibleDateColumns.map((date) => (
          <td
            key={date}
            style={getDateColumnStyle()}
            className={cn(
              'h-px border-r border-border/30 p-1 last:border-r-0',
              rowBackgroundClass,
            )}
          >
            <ScheduleLessonCell
              lessons={lessonsByDate[date] || []}
              isEditing={isEditing}
              isRecentlyEdited={isRecentlyEdited?.(date)}
              onClick={
                onCellClick
                  ? () =>
                      onCellClick({
                        subjectId,
                        subjectName,
                        date,
                      })
                  : undefined
              }
            />
          </td>
        ))}

        <td
          style={getStickyRightStyle()}
          className={cn(
            'sticky z-10 whitespace-normal break-words px-3 py-3 text-xs font-medium leading-snug text-text-secondary shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.08)] align-top',
            rowBackgroundClass,
          )}
        >
          <div className="flex flex-col gap-1">
            {teacherNames.length > 0 ? (
              teacherNames.map((name) => (
                <span key={name} className="break-words uppercase">
                  {name}
                </span>
              ))
            ) : (
              <span>—</span>
            )}
          </div>
        </td>
      </tr>
    )
  },
)
ScheduleRow.displayName = 'ScheduleRow'
