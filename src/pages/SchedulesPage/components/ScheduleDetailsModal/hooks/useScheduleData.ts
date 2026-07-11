import { useMemo } from 'react'
import type { LessonDto } from '~/types/api/lesson'
import { getLessonDateKey, toApiNumber } from '~/lib/lessonDateUtils'
import type { ScheduleDto } from '~/types/api/schedule'
import type { StudyProgramSubjectDto } from '~/types/api/studyProgram'
import { getBusinessDatesInRange } from '~/utils/dateHelpers'

export type ScheduleSubjectRow = StudyProgramSubjectDto

function buildSubjects(schedule: ScheduleDto, lessons: LessonDto[]): ScheduleSubjectRow[] {
  if (schedule.subjects?.length) {
    return [...schedule.subjects].sort((a, b) => a.order - b.order)
  }

  const subjectIds = Array.from(new Set(lessons.map((lesson) => lesson.subjectId))).sort(
    (a, b) => a - b,
  )

  return subjectIds.map((subjectId, index) => {
    const subjectLessons = lessons.filter((lesson) => lesson.subjectId === subjectId)

    return {
      id: subjectId,
      name: `Предмет №${subjectId}`,
      hours: subjectLessons.reduce((sum, lesson) => sum + toApiNumber(lesson.hours), 0),
      order: index + 1,
    }
  })
}

export const useScheduleData = (lessons: LessonDto[], schedule: ScheduleDto) => {
  const dateColumns = useMemo(
    () => getBusinessDatesInRange(schedule.startDate, schedule.endDate),
    [schedule.startDate, schedule.endDate],
  )

  const { groupedData, subjects, totalHours, dailyTotals } = useMemo(() => {
    const map: Record<number, Record<string, LessonDto[]>> = {}
    const daily: Record<string, number> = {}

    lessons.forEach((lesson) => {
      const dateKey = getLessonDateKey(lesson.date)
      const hours = toApiNumber(lesson.hours)

      if (!map[lesson.subjectId]) map[lesson.subjectId] = {}
      if (!map[lesson.subjectId][dateKey]) map[lesson.subjectId][dateKey] = []
      map[lesson.subjectId][dateKey].push(lesson)

      daily[dateKey] = (daily[dateKey] || 0) + hours
    })

    const subjectRows = buildSubjects(schedule, lessons)
    const plannedTotalHours = subjectRows.reduce((sum, subject) => sum + toApiNumber(subject.hours), 0)

    return {
      groupedData: map,
      subjects: subjectRows,
      totalHours: plannedTotalHours,
      dailyTotals: daily,
    }
  }, [lessons, schedule])

  return { dateColumns, groupedData, subjects, totalHours, dailyTotals }
}
