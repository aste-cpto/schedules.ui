import { toApiNumber } from '~/lib/lessonDateUtils'
import {
  getLessonTypeShortCode,
  isPairLessonType,
  normalizeLessonType,
} from '~/pages/SchedulesPage/config/lessonTypes'
import type { LessonDto } from '~/types/api/lesson'

export type CellDisplayLine = {
  key: string
  text: string
}

export function formatLessonDisplay(lesson: LessonDto, typeShortCode: string): string {
  const hours = toApiNumber(lesson.hours)
  const type = normalizeLessonType(lesson.type)

  if (isPairLessonType(type)) {
    return `${lesson.order} ${typeShortCode}  ${hours}год.`
  }

  return `${typeShortCode}  ${hours}год.`
}

export function compareLessonsForDisplay(a: LessonDto, b: LessonDto): number {
  const aIsPair = isPairLessonType(a.type)
  const bIsPair = isPairLessonType(b.type)

  if (aIsPair && bIsPair) {
    return a.order - b.order
  }

  if (aIsPair !== bIsPair) {
    return aIsPair ? -1 : 1
  }

  return a.id - b.id
}

export function sortLessonsForDisplay(lessons: LessonDto[]): LessonDto[] {
  return [...lessons].sort(compareLessonsForDisplay)
}

export function resolveLessonOrderForSave(type: LessonDto['type'], order: number): number {
  return isPairLessonType(type) ? order : 0
}

function isQualificationLessonType(type: LessonDto['type']): boolean {
  return normalizeLessonType(type) === 'Qualification'
}

function flushQualificationGroup(
  qualificationLessons: LessonDto[],
  lines: CellDisplayLine[],
): void {
  if (qualificationLessons.length === 0) return

  if (qualificationLessons.length >= 2) {
    const hours = qualificationLessons.reduce((sum, lesson) => sum + toApiNumber(lesson.hours), 0)

    lines.push({
      key: `ka-${qualificationLessons.map((lesson) => lesson.id).join('-')}`,
      text: `${getLessonTypeShortCode('Qualification')}  ${hours}год.`,
    })
    return
  }

  const lesson = qualificationLessons[0]
  lines.push({
    key: `lesson-${lesson.id}`,
    text: formatLessonDisplay(lesson, getLessonTypeShortCode(lesson.type)),
  })
}

export function getCellDisplayLines(lessons: LessonDto[]): CellDisplayLine[] {
  const sorted = sortLessonsForDisplay(lessons)
  const lines: CellDisplayLine[] = []
  const qualificationBuffer: LessonDto[] = []

  for (const lesson of sorted) {
    if (isQualificationLessonType(lesson.type)) {
      qualificationBuffer.push(lesson)
      continue
    }

    flushQualificationGroup(qualificationBuffer, lines)
    qualificationBuffer.length = 0

    lines.push({
      key: `lesson-${lesson.id}`,
      text: formatLessonDisplay(lesson, getLessonTypeShortCode(lesson.type)),
    })
  }

  flushQualificationGroup(qualificationBuffer, lines)

  return lines
}
