import { TableHeader } from '~/ui/TableHeader'
import type { LessonDto } from '~/types/api/lesson'
import type { ScheduleDto } from '~/types/api/schedule'
import { ScheduleFooter } from './ScheduleFooter'
import { ScheduleEmptyState } from './ScheduleEmptyState'
import { ScheduleRow } from './ScheduleRow'
import { useScheduleData } from '../hooks/useScheduleData'

type Props = {
  lessons: LessonDto[]
  schedule: ScheduleDto
  isEditing: boolean
  onUpdateLessonHours?: (lessonId: number, hours: number) => void
}

export const ScheduleLessonsTable = ({
  lessons,
  schedule,
  isEditing,
  onUpdateLessonHours,
}: Props) => {
  const { dateColumns, columns, groupedData, subjectIds, totalHours, dailyTotals } =
    useScheduleData(lessons, schedule)

  return (
    <div className="overflow-x-auto">
      <div className="mx-auto w-max overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm">
        <table className="w-max border-collapse text-sm">
          <TableHeader columns={columns} variant="secondary" />

          <tbody>
            {subjectIds.length === 0 ? (
              <ScheduleEmptyState colSpan={columns.length} />
            ) : (
              subjectIds.map((subjectId, index) => (
                <ScheduleRow
                  key={subjectId}
                  index={index}
                  subjectId={subjectId}
                  dateColumns={dateColumns}
                  lessonsByDate={groupedData[subjectId] || {}}
                  isEditing={isEditing}
                  onUpdateLessonHours={onUpdateLessonHours}
                />
              ))
            )}
          </tbody>

          {subjectIds.length > 0 && (
            <ScheduleFooter
              dateColumns={dateColumns}
              dailyTotals={dailyTotals}
              totalHours={totalHours}
            />
          )}
        </table>
      </div>
    </div>
  )
}
