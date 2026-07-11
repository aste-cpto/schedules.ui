import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '~/ui/toast/useToast'
import { toApiDateTime } from '~/lib/dateUtils'
import { getErrorMessage } from '~/lib/formatApiError'
import { getLessonDateKey, toApiNumber } from '~/lib/lessonDateUtils'
import {
  VALIDATION_DUPLICATE_PAIR_IN_CELL,
  VALIDATION_DUPLICATE_PAIR_ON_DAY,
  VALIDATION_REQUIRED_FIELDS,
  VALIDATION_SUBJECT_HOURS_EXCEEDED,
} from '~/lib/validationMessages'
import { DEFAULT_LESSON_TYPE, isPairLessonType, normalizeLessonType } from '~/pages/SchedulesPage/config/lessonTypes'
import { lessonsService } from '~/services/lessonsService'
import { schedulesService } from '~/services/schedulesService'
import { teachersService } from '~/services/teachersService'
import type { LessonDto, LessonType } from '~/types/api/lesson'
import type { ScheduleDto } from '~/types/api/schedule'
import type { LessonCellContext } from '~/types/api/lesson'
import { buildSubjectHoursSummary } from '../utils/subjectHours'
import { resolveLessonOrderForSave, sortLessonsForDisplay } from '../utils/formatLessonDisplay'
import { validateLessonCellPairOrders } from '../utils/lessonCellValidation'

export type LessonEntryDraft = {
  clientId: string
  id?: number
  type: LessonType
  teacherId: number
  hours: number
  order: number
}

type UseLessonCellEditOptions = {
  open: boolean
  context: LessonCellContext | null
  schedule: ScheduleDto | null
  lessons: LessonDto[]
  onSaved: (lessons: LessonDto[]) => void
}

function createClientId(): string {
  return `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function lessonToDraft(lesson: LessonDto): LessonEntryDraft {
  return {
    clientId: `lesson-${lesson.id}`,
    id: lesson.id,
    type: normalizeLessonType(lesson.type),
    teacherId: lesson.teacherId,
    hours: toApiNumber(lesson.hours),
    order: toApiNumber(lesson.order),
  }
}

function createEmptyDraft(order: number, defaultType: LessonType): LessonEntryDraft {
  return {
    clientId: createClientId(),
    type: defaultType,
    teacherId: 0,
    hours: 2,
    order,
  }
}

function getNextPairOrder(entries: LessonEntryDraft[], excludeClientId?: string): number {
  const pairOrders = entries
    .filter((entry) => entry.clientId !== excludeClientId && isPairLessonType(entry.type))
    .map((entry) => entry.order)

  return pairOrders.length > 0 ? Math.max(...pairOrders) + 1 : 1
}

function applyEntryPatch(
  entry: LessonEntryDraft,
  patch: Partial<Omit<LessonEntryDraft, 'clientId'>>,
  allEntries: LessonEntryDraft[],
): LessonEntryDraft {
  const nextEntry = { ...entry, ...patch }

  if (patch.type !== undefined) {
    if (isPairLessonType(patch.type)) {
      if (!isPairLessonType(entry.type) || nextEntry.order <= 0) {
        nextEntry.order = getNextPairOrder(allEntries, entry.clientId)
      }
    } else {
      nextEntry.order = 0
    }
  }

  return nextEntry
}

function getCellLessons(lessons: LessonDto[], context: LessonCellContext | null): LessonDto[] {
  if (!context) return []

  return sortLessonsForDisplay(
    lessons.filter(
      (lesson) =>
        lesson.subjectId === context.subjectId && getLessonDateKey(lesson.date) === context.date,
    ),
  )
}

function isEntryValid(entry: LessonEntryDraft): boolean {
  if (entry.teacherId <= 0 || entry.hours <= 0) return false
  if (isPairLessonType(entry.type) && entry.order <= 0) return false

  return true
}

function syncCellValidationError(
  nextError: string | null,
  setValidationError: (value: string | null | ((prev: string | null) => string | null)) => void,
) {
  setValidationError((prev) => {
    if (nextError) return nextError
    if (
      prev === VALIDATION_SUBJECT_HOURS_EXCEEDED ||
      prev === VALIDATION_DUPLICATE_PAIR_IN_CELL ||
      prev === VALIDATION_DUPLICATE_PAIR_ON_DAY
    ) {
      return null
    }
    return prev
  })
}

export function useLessonCellEdit({
  open,
  context,
  schedule,
  lessons,
  onSaved,
}: UseLessonCellEditOptions) {
  const toast = useToast()
  const [entries, setEntries] = useState<LessonEntryDraft[]>([])
  const [initialEntries, setInitialEntries] = useState<LessonEntryDraft[]>([])
  const [teacherOptions, setTeacherOptions] = useState<{ value: string; label: string }[]>([])
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const cellLessons = useMemo(() => getCellLessons(lessons, context), [lessons, context])
  const defaultLessonType = DEFAULT_LESSON_TYPE

  const subjectHoursSummary = useMemo(() => {
    if (!context || !schedule) return null

    return buildSubjectHoursSummary(
      schedule,
      lessons,
      context.subjectId,
      context.date,
      entries,
    )
  }, [context, schedule, lessons, entries])

  const pairOrderValidationError = useMemo(() => {
    if (!context) return null

    return validateLessonCellPairOrders(entries, lessons, context)
  }, [context, entries, lessons])

  const hasBlockingValidationError = Boolean(
    subjectHoursSummary?.isOverLimit || pairOrderValidationError,
  )

  useEffect(() => {
    if (subjectHoursSummary?.isOverLimit) {
      syncCellValidationError(VALIDATION_SUBJECT_HOURS_EXCEEDED, setValidationError)
      return
    }

    if (pairOrderValidationError) {
      syncCellValidationError(pairOrderValidationError, setValidationError)
      return
    }

    syncCellValidationError(null, setValidationError)
  }, [subjectHoursSummary?.isOverLimit, pairOrderValidationError])

  useEffect(() => {
    if (!open || !context) {
      setEntries([])
      setInitialEntries([])
      setValidationError(null)
      return
    }

    const drafts = cellLessons.map(lessonToDraft)
    setEntries(drafts)
    setInitialEntries(drafts)
    setValidationError(null)
  }, [open, context, cellLessons])

  useEffect(() => {
    if (!open) return

    const loadTeachers = async () => {
      setIsLoadingTeachers(true)
      try {
        const data = await teachersService.getList({ page: 1, pageRecords: 200 })
        setTeacherOptions(
          data.items.map((teacher) => ({
            value: String(teacher.id),
            label: teacher.displayName,
          })),
        )
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося завантажити викладачів'))
        setTeacherOptions([])
      } finally {
        setIsLoadingTeachers(false)
      }
    }

    void loadTeachers()
  }, [open, toast])

  const addEntry = useCallback(() => {
    setValidationError(null)
    setEntries((prev) => {
      const nextOrder = getNextPairOrder(prev)
      return [...prev, createEmptyDraft(nextOrder, defaultLessonType)]
    })
  }, [defaultLessonType])

  const removeEntry = useCallback((clientId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.clientId !== clientId))
  }, [])

  const updateEntry = useCallback(
    (clientId: string, patch: Partial<Omit<LessonEntryDraft, 'clientId'>>) => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.clientId === clientId ? applyEntryPatch(entry, patch, prev) : entry,
        ),
      )
    },
    [],
  )

  const save = useCallback(async () => {
    if (!context || !schedule) return

    if (entries.some((entry) => !isEntryValid(entry))) {
      setValidationError(VALIDATION_REQUIRED_FIELDS)
      return
    }

    if (subjectHoursSummary?.isOverLimit) {
      setValidationError(VALIDATION_SUBJECT_HOURS_EXCEEDED)
      return
    }

    if (pairOrderValidationError) {
      setValidationError(pairOrderValidationError)
      return
    }

    setIsSaving(true)
    setValidationError(null)

    try {
      const initialIds = new Set(
        initialEntries.map((entry) => entry.id).filter((id): id is number => id !== undefined),
      )
      const currentIds = new Set(
        entries.map((entry) => entry.id).filter((id): id is number => id !== undefined),
      )

      const deletedIds = [...initialIds].filter((id) => !currentIds.has(id))
      await Promise.all(deletedIds.map((id) => lessonsService.delete(id)))

      const lessonDate = toApiDateTime(context.date, '00:00:00')

      await Promise.all(
        entries.map(async (entry) => {
          const payload = {
            date: lessonDate,
            hours: entry.hours,
            order: resolveLessonOrderForSave(entry.type, entry.order),
            type: entry.type,
            teacherId: entry.teacherId,
            subjectId: context.subjectId,
            scheduleId: schedule.id,
          }

          if (entry.id) {
            await lessonsService.update(entry.id, { ...payload, id: entry.id })
            return
          }

          await lessonsService.create(payload)
        }),
      )

      const updatedSchedule = await schedulesService.getById(schedule.id)

      const updatedLessons = updatedSchedule.lessons || []
      onSaved(updatedLessons)
      toast.success('Заняття збережено')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не вдалося зберегти заняття'))
    } finally {
      setIsSaving(false)
    }
  }, [context, entries, initialEntries, onSaved, pairOrderValidationError, schedule, subjectHoursSummary, toast])

  return {
    entries,
    teacherOptions,
    isLoadingTeachers,
    isSaving,
    validationError,
    subjectHoursSummary,
    hasBlockingValidationError,
    addEntry,
    removeEntry,
    updateEntry,
    save,
  }
}
