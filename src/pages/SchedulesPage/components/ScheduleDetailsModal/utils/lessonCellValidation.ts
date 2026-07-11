import { getLessonDateKey } from '~/lib/lessonDateUtils'
import {
  VALIDATION_DUPLICATE_PAIR_IN_CELL,
  VALIDATION_DUPLICATE_PAIR_ON_DAY,
} from '~/lib/validationMessages'
import { isPairLessonType } from '~/pages/SchedulesPage/config/lessonTypes'
import type { LessonDto } from '~/types/api/lesson'
import type { LessonCellContext } from '~/types/api/lesson'
import type { LessonEntryDraft } from '../hooks/useLessonCellEdit'

export function findDuplicatePairOrdersInCell(entries: LessonEntryDraft[]): number | null {
  const pairOrders = entries.filter((entry) => isPairLessonType(entry.type)).map((entry) => entry.order)
  const seen = new Set<number>()

  for (const order of pairOrders) {
    if (seen.has(order)) return order
    seen.add(order)
  }

  return null
}

export function getPairOrdersOnDayExcludingCell(
  lessons: LessonDto[],
  context: LessonCellContext,
): Set<number> {
  return new Set(
    lessons
      .filter(
        (lesson) =>
          getLessonDateKey(lesson.date) === context.date &&
          isPairLessonType(lesson.type) &&
          lesson.subjectId !== context.subjectId,
      )
      .map((lesson) => lesson.order),
  )
}

export function findDuplicatePairOrderOnDay(
  entries: LessonEntryDraft[],
  lessons: LessonDto[],
  context: LessonCellContext,
): number | null {
  const dayOrders = getPairOrdersOnDayExcludingCell(lessons, context)

  for (const entry of entries) {
    if (!isPairLessonType(entry.type)) continue
    if (dayOrders.has(entry.order)) return entry.order
  }

  return null
}

export function validateLessonCellPairOrders(
  entries: LessonEntryDraft[],
  lessons: LessonDto[],
  context: LessonCellContext,
): string | null {
  const duplicateInCell = findDuplicatePairOrdersInCell(entries)
  if (duplicateInCell !== null) {
    return VALIDATION_DUPLICATE_PAIR_IN_CELL
  }

  const duplicateOnDay = findDuplicatePairOrderOnDay(entries, lessons, context)
  if (duplicateOnDay !== null) {
    return VALIDATION_DUPLICATE_PAIR_ON_DAY
  }

  return null
}
