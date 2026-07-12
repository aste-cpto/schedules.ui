import { useCallback, useEffect, useMemo, useState } from 'react'
import { TablePaginationBar } from '~/ui/TablePaginationBar'
import type { LessonDto } from '~/types/api/lesson'
import type { ScheduleDto } from '~/types/api/schedule'
import { ScheduleFooter } from './ScheduleFooter'
import { ScheduleEmptyState } from './ScheduleEmptyState'
import { ScheduleRow } from './ScheduleRow'
import { ScheduleTableHeader } from './ScheduleTableHeader'
import { LessonCellEditModal } from './LessonCellEditModal/LessonCellEditModal'
import { getScheduleTableWidth, SCHEDULE_DAYS_PER_PAGE } from '../config/scheduleTableLayout'
import { useScheduleData } from '../hooks/useScheduleData'
import { useDateColumnsPagination } from '../hooks/useDateColumnsPagination'
import { useRecentlyEditedCell } from '../hooks/useRecentlyEditedCell'
import { buildSubjectsHoursStatus } from '../utils/subjectHours'
import type { LessonCellContext } from '~/types/api/lesson'

type Props = {
  lessons: LessonDto[]
  schedule: ScheduleDto
  isEditing: boolean
  onLessonsChange: (lessons: LessonDto[]) => void
  onTableWidthChange?: (width: number) => void
}

export const ScheduleLessonsTable = ({
  lessons,
  schedule,
  isEditing,
  onLessonsChange,
  onTableWidthChange,
}: Props) => {
  const { dateColumns, groupedData, subjects, totalHours, dailyTotals } = useScheduleData(
    lessons,
    schedule,
  )
  const { visibleDateColumns, page, pagesCount, setPage, rangeLabel } =
    useDateColumnsPagination(dateColumns)
  const [cellContext, setCellContext] = useState<LessonCellContext | null>(null)
  const { markRecentlyEdited, isRecentlyEdited } = useRecentlyEditedCell()

  const subjectsHours = useMemo(
    () => buildSubjectsHoursStatus(lessons, subjects),
    [lessons, subjects],
  )

  const tableColSpan = 3 + visibleDateColumns.length + 1
  const tableWidth = useMemo(
    () => getScheduleTableWidth(visibleDateColumns.length),
    [visibleDateColumns.length],
  )
  const showPaginationBar = Boolean(rangeLabel || pagesCount > 1)

  useEffect(() => {
    onTableWidthChange?.(tableWidth)
  }, [onTableWidthChange, tableWidth])

  const focusEditedCellPage = useCallback(
    (context: LessonCellContext) => {
      const dateIndex = dateColumns.indexOf(context.date)
      if (dateIndex === -1) return

      const targetPage = Math.floor(dateIndex / SCHEDULE_DAYS_PER_PAGE) + 1
      setPage(targetPage)
    },
    [dateColumns, setPage],
  )

  const handleLessonSaved = useCallback(
    (updatedLessons: LessonDto[], savedContext: LessonCellContext) => {
      onLessonsChange(updatedLessons)
      focusEditedCellPage(savedContext)
      markRecentlyEdited({
        subjectId: savedContext.subjectId,
        date: savedContext.date,
      })
    },
    [focusEditedCellPage, markRecentlyEdited, onLessonsChange],
  )

  const isRecentlyEditedInRow = useCallback(
    (subjectId: number) => (date: string) => isRecentlyEdited(subjectId, date),
    [isRecentlyEdited],
  )

  return (
    <>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
        {showPaginationBar && (
          <TablePaginationBar
            rangeLabel={rangeLabel}
            pagination={{ page, pagesCount }}
            onPageChange={setPage}
            sticky
          />
        )}

        <div className="min-h-0 flex-1 flex flex-col items-start">
          <div
            className="overflow-auto min-h-0 rounded-xl bg-bg-surface shadow-sm ring-1 ring-border ring-inset [scrollbar-gutter:stable]"
            style={{ width: tableWidth, maxWidth: '100%' }}
          >
            <table className="w-full border-collapse text-sm">
                <ScheduleTableHeader visibleDateColumns={visibleDateColumns} />

                <tbody>
                  {subjects.length === 0 ? (
                    <ScheduleEmptyState colSpan={tableColSpan} />
                  ) : (
                    subjects.map((subject, index) => {
                      const subjectHours = subjectsHours.find(
                        (item) => item.subjectId === subject.id,
                      )

                      return (
                        <ScheduleRow
                          key={subject.id}
                          subjectId={subject.id}
                          subjectName={subject.name}
                          index={index}
                          plannedHours={subject.hours}
                          remainingHours={subjectHours?.remainingHours ?? subject.hours}
                          isOverLimit={subjectHours?.isOverLimit ?? false}
                          visibleDateColumns={visibleDateColumns}
                          lessonsByDate={groupedData[subject.id] || {}}
                          isEditing={isEditing}
                          isRecentlyEdited={isRecentlyEditedInRow(subject.id)}
                          onCellClick={isEditing ? setCellContext : undefined}
                        />
                      )
                    })
                  )}
                </tbody>

                {subjects.length > 0 && (
                  <ScheduleFooter
                    visibleDateColumns={visibleDateColumns}
                    dailyTotals={dailyTotals}
                    totalHours={totalHours}
                  />
                )}
              </table>
            </div>
        </div>
      </div>

      <LessonCellEditModal
        open={cellContext !== null}
        context={cellContext}
        schedule={schedule}
        lessons={lessons}
        onClose={() => setCellContext(null)}
        onSaved={handleLessonSaved}
      />
    </>
  )
}
