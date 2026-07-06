import { useEffect, useState } from 'react'
import { useToast } from '~/components/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
import { formatDateToIso } from '~/lib/dateUtils'
import { VALIDATION_REQUIRED_FIELDS } from '~/lib/validationMessages'
import {
  normalizeTeacherStatus,
  TEACHER_STATUS,
  TEACHER_STATUS_OPTIONS,
} from '~/pages/TeachersPage/config/teacherStatus'
import {
  getLatestTeachingLoad,
  getTeachingLoadYear,
} from '~/pages/TeachersPage/lib/teachingLoadUtils'
import { teachersService } from '~/services/teachersService'
import type { TeacherStatus, TeachingLoadDto } from '~/types/api/teacher'

type TeacherFormMode = 'create' | 'edit'

type UseTeacherFormOptions = {
  open: boolean
  mode: TeacherFormMode
  teacherId?: number
  initialStatus?: TeacherStatus
  onSuccess: () => void
}

export const useTeacherForm = ({
  open,
  mode,
  teacherId,
  initialStatus = TEACHER_STATUS.ACTIVE,
  onSuccess,
}: UseTeacherFormOptions) => {
  const toast = useToast()
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [patronymic, setPatronymic] = useState('')
  const [hours, setHours] = useState('')
  const [status, setStatus] = useState<TeacherStatus>(TEACHER_STATUS.ACTIVE)
  const [loadYear, setLoadYear] = useState<string | null>(null)
  const [currentTeachingLoad, setCurrentTeachingLoad] = useState<TeachingLoadDto | null>(null)
  const [initialStatusValue, setInitialStatusValue] = useState<TeacherStatus>(initialStatus)
  const [initialHours, setInitialHours] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const parsedHours = Number(hours)
  const isFormValid =
    lastName.trim() !== '' &&
    firstName.trim() !== '' &&
    patronymic.trim() !== '' &&
    hours.trim() !== '' &&
    Number.isFinite(parsedHours) &&
    parsedHours >= 0

  useEffect(() => {
    if (isFormValid && validationError) {
      setValidationError(null)
    }
  }, [isFormValid, validationError])

  useEffect(() => {
    if (!open) return

    if (mode === 'create') {
      setLastName('')
      setFirstName('')
      setPatronymic('')
      setHours('')
      setStatus(TEACHER_STATUS.ACTIVE)
      setLoadYear(null)
      setCurrentTeachingLoad(null)
      setInitialStatusValue(TEACHER_STATUS.ACTIVE)
      setInitialHours(null)
      setValidationError(null)
      return
    }

    if (!teacherId) return

    const loadTeacher = async () => {
      setIsLoadingDetails(true)
      setValidationError(null)

      try {
        const data = await teachersService.getById(teacherId)
        const latestLoad = getLatestTeachingLoad(data.teachingLoads ?? [])
        const normalizedStatus = normalizeTeacherStatus(data.status ?? initialStatus)

        setLastName(data.lastName)
        setFirstName(data.firstName)
        setPatronymic(data.patronymic)
        setHours(String(latestLoad?.hours ?? ''))
        setLoadYear(getTeachingLoadYear(latestLoad))
        setCurrentTeachingLoad(latestLoad)
        setStatus(normalizedStatus)
        setInitialStatusValue(normalizedStatus)
        setInitialHours(latestLoad?.hours ?? null)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося завантажити дані викладача'))
      } finally {
        setIsLoadingDetails(false)
      }
    }

    void loadTeacher()
  }, [open, mode, teacherId, initialStatus, toast])

  const submit = async () => {
    if (!isFormValid) {
      setValidationError(VALIDATION_REQUIRED_FIELDS)
      return
    }

    setIsLoading(true)
    setValidationError(null)

    try {
      if (mode === 'create') {
        await teachersService.create({
          lastName: lastName.trim(),
          firstName: firstName.trim(),
          patronymic: patronymic.trim(),
          hours: parsedHours,
        })
        toast.success('Викладача створено')
      } else if (teacherId) {
        await teachersService.update(teacherId, {
          lastName: lastName.trim(),
          firstName: firstName.trim(),
          patronymic: patronymic.trim(),
        })

        if (status !== initialStatusValue) {
          await teachersService.updateStatus({ id: teacherId, status })
        }

        if (initialHours !== parsedHours) {
          if (currentTeachingLoad) {
            await teachersService.updateTeachingLoad({
              id: currentTeachingLoad.id,
              teacherId,
              hours: parsedHours,
              startDate: currentTeachingLoad.startDate,
              endDate: currentTeachingLoad.endDate ?? null,
            })
          } else {
            await teachersService.createTeachingLoad({
              teacherId,
              hours: parsedHours,
              startDate: formatDateToIso(new Date()),
            })
          }
        }

        toast.success('Викладача оновлено')
      }

      onSuccess()
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          mode === 'create' ? 'Не вдалося створити викладача' : 'Не вдалося оновити викладача',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    state: {
      lastName,
      firstName,
      patronymic,
      hours,
      status,
      loadYear,
      statusOptions: TEACHER_STATUS_OPTIONS,
      isLoading,
      isLoadingDetails,
      isFormValid,
      validationError,
      showStatus: mode === 'edit',
      showLoadYear: mode === 'edit' && loadYear !== null,
    },
    actions: {
      setLastName,
      setFirstName,
      setPatronymic,
      setHours,
      setStatus,
      submit,
    },
  }
}
