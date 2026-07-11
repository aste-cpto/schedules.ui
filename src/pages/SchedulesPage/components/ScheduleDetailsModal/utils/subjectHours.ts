import { getLessonDateKey, toApiNumber } from '~/lib/lessonDateUtils'
import type { LessonDto } from '~/types/api/lesson'
import type { ScheduleDto } from '~/types/api/schedule'

type HoursEntry = {
  clientId: string
  hours: number
}

export type SubjectHoursSummary = {
  plannedHours: number
  usedHours: number
  remainingHours: number
  isOverLimit: boolean
}

export type SubjectHoursStatus = SubjectHoursSummary & {
  subjectId: number
  subjectName: string
}

export function getSubjectPlannedHours(schedule: ScheduleDto, subjectId: number): number {
  const subject = schedule.subjects?.find((item) => item.id === subjectId)
  return subject ? toApiNumber(subject.hours) : 0
}

export function getSubjectUsedHours(lessons: LessonDto[], subjectId: number): number {
  return lessons
    .filter((lesson) => lesson.subjectId === subjectId)
    .reduce((sum, lesson) => sum + toApiNumber(lesson.hours), 0)
}

export function getSubjectHoursOnOtherDays(
  lessons: LessonDto[],
  subjectId: number,
  currentDate: string,
): number {
  return lessons
    .filter(
      (lesson) =>
        lesson.subjectId === subjectId && getLessonDateKey(lesson.date) !== currentDate,
    )
    .reduce((sum, lesson) => sum + toApiNumber(lesson.hours), 0)
}

export function getEntriesHours(entries: HoursEntry[]): number {
  return entries.reduce((sum, entry) => sum + toApiNumber(entry.hours), 0)
}

export function getSubjectHoursSummary(
  plannedHours: number,
  usedHours: number,
): SubjectHoursSummary {
  return {
    plannedHours,
    usedHours,
    remainingHours: plannedHours - usedHours,
    isOverLimit: usedHours > plannedHours,
  }
}

export function buildSubjectHoursSummary(
  schedule: ScheduleDto,
  lessons: LessonDto[],
  subjectId: number,
  currentDate: string,
  entries: HoursEntry[],
): SubjectHoursSummary {
  const plannedHours = getSubjectPlannedHours(schedule, subjectId)
  const hoursOnOtherDays = getSubjectHoursOnOtherDays(lessons, subjectId, currentDate)
  const hoursInCurrentCell = getEntriesHours(entries)
  const usedHours = hoursOnOtherDays + hoursInCurrentCell

  return getSubjectHoursSummary(plannedHours, usedHours)
}

export function buildSubjectsHoursStatus(
  lessons: LessonDto[],
  subjects: Array<{ id: number; name: string; hours: number }>,
): SubjectHoursStatus[] {
  return subjects.map((subject) => {
    const plannedHours = toApiNumber(subject.hours)
    const usedHours = getSubjectUsedHours(lessons, subject.id)

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      ...getSubjectHoursSummary(plannedHours, usedHours),
    }
  })
}
