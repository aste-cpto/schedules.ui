import { useState, useEffect, useCallback } from 'react'
import { useToast } from '~/ui/toast/useToast'
import { toIsoDateString, parseIsoDate } from '~/lib/dateUtils'
import { getErrorMessage } from '~/lib/formatApiError'
import { VALIDATION_REQUIRED_FIELDS } from '~/lib/validationMessages'
import { lessonsService } from '~/services/lessonsService'
import { schedulesService } from '~/services/schedulesService'
import type { LessonDto } from '~/types/api/lesson'
import type { ScheduleDto, UpdateScheduleDto } from '~/types/api/schedule'

type ScheduleEditForm = {
  groupName: string
  startDate: string
  endDate: string
}

function mergeScheduleDateTime(originalIso: string, nextDate: string): string {
  const original = parseIsoDate(originalIso)
  const next = parseIsoDate(nextDate)

  if (!original || !next) return nextDate

  const merged = new Date(
    next.getFullYear(),
    next.getMonth(),
    next.getDate(),
    original.getHours(),
    original.getMinutes(),
    original.getSeconds(),
  )

  return merged.toISOString()
}

function isEditFormValid(form: ScheduleEditForm): boolean {
  return form.groupName.trim() !== '' && form.startDate !== '' && form.endDate !== ''
}

type Props = {
  open: boolean
  schedule: ScheduleDto | null
  onUpdate?: () => void
}

export const useScheduleDetails = ({ open, schedule, onUpdate }: Props) => {
  const toast = useToast()
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleDto | null>(schedule)
  const [lessons, setLessons] = useState<LessonDto[]>([])
  const [initialLessons, setInitialLessons] = useState<LessonDto[]>([])
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const [editForm, setEditForm] = useState<ScheduleEditForm>({
    groupName: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    setCurrentSchedule(schedule)
  }, [schedule])

  useEffect(() => {
    if (isEditFormValid(editForm) && validationError) {
      setValidationError(null)
    }
  }, [editForm, validationError])

  const resetForm = useCallback((source: ScheduleDto | null) => {
    if (source) {
      setEditForm({
        groupName: source.groupName,
        startDate: toIsoDateString(source.startDate),
        endDate: toIsoDateString(source.endDate),
      })
    }
    setValidationError(null)
  }, [])

  useEffect(() => {
    if (!open || !currentSchedule) {
      setLessons([])
      setInitialLessons([])
      setIsEditing(false)
      setValidationError(null)
      return
    }

    const scheduleId = currentSchedule.id

    const loadData = async () => {
      setLoading(true)
      try {
        resetForm(currentSchedule)
        const data = await schedulesService.getById(scheduleId)
        const loadedLessons = data.lessons || []
        setLessons(loadedLessons)
        setInitialLessons(loadedLessons)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося завантажити деталі розкладу'))
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [open, currentSchedule?.id, resetForm, toast])

  const startEditing = () => {
    resetForm(currentSchedule)
    setValidationError(null)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setLessons(initialLessons)
    resetForm(currentSchedule)
  }

  const updateHeaderField = (field: keyof ScheduleEditForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateLessonHours = (lessonId: number, hours: number) => {
    setLessons((prev) =>
      prev.map((lesson) => (lesson.id === lessonId ? { ...lesson, hours } : lesson)),
    )
  }

  const saveEditing = async () => {
    if (!currentSchedule) return

    if (!isEditFormValid(editForm)) {
      setValidationError(VALIDATION_REQUIRED_FIELDS)
      return
    }

    setIsSaving(true)
    setValidationError(null)

    try {
      const payload: UpdateScheduleDto = {
        id: currentSchedule.id,
        groupName: editForm.groupName,
        startDate: mergeScheduleDateTime(currentSchedule.startDate, editForm.startDate),
        endDate: mergeScheduleDateTime(currentSchedule.endDate, editForm.endDate),
        status: currentSchedule.status ?? '',
        studyProgramId: currentSchedule.studyProgramId,
      }

      await schedulesService.update(currentSchedule.id, payload)

      const changedLessons = lessons.filter((lesson) => {
        const initial = initialLessons.find((item) => item.id === lesson.id)
        return initial && initial.hours !== lesson.hours
      })

      await Promise.all(
        changedLessons.map((lesson) =>
          lessonsService.update(lesson.id, {
            id: lesson.id,
            date: lesson.date,
            hours: lesson.hours,
            order: lesson.order,
            type: lesson.type,
            teacherId: lesson.teacherId,
            subjectId: lesson.subjectId,
            scheduleId: lesson.scheduleId,
          }),
        ),
      )

      const updated = await schedulesService.getById(currentSchedule.id)
      setCurrentSchedule({
        ...updated,
        studyProgramName: updated.studyProgramName || currentSchedule.studyProgramName,
      })
      resetForm(updated)
      setInitialLessons(lessons)
      setIsEditing(false)
      toast.success('Розклад оновлено')
      onUpdate?.()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не вдалося оновити розклад'))
    } finally {
      setIsSaving(false)
    }
  }

  return {
    currentSchedule,
    lessons,
    loading,
    isSaving,
    isEditing,
    validationError,
    editForm,
    startEditing,
    cancelEditing,
    saveEditing,
    updateHeaderField,
    updateLessonHours,
  }
}
