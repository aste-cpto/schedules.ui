import { useEffect, useState, useMemo } from 'react'
import { useToast } from '~/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
import { getCurrentYear } from '~/lib/dateUtils'
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

  const [initialLastName, setInitialLastName] = useState('')
  const [initialFirstName, setInitialFirstName] = useState('')
  const [initialPatronymic, setInitialPatronymic] = useState('')

  const [teachingLoads, setTeachingLoads] = useState<TeachingLoadDto[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('')

  const [initialStatusValue, setInitialStatusValue] = useState<TeacherStatus>(initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const parsedHours = Number(hours)
  const isValidYear = /^\d{4}$/.test(selectedYear.trim())

  const isFormValid =
    lastName.trim() !== '' &&
    firstName.trim() !== '' &&
    patronymic.trim() !== '' &&
    hours.trim() !== '' &&
    Number.isFinite(parsedHours) &&
    parsedHours >= 0 &&
    (mode === 'create' || isValidYear)

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
      setInitialLastName('')
      setInitialFirstName('')
      setInitialPatronymic('')
      setHours('')
      setStatus(TEACHER_STATUS.ACTIVE)
      setSelectedYear('')
      setTeachingLoads([])
      setInitialStatusValue(TEACHER_STATUS.ACTIVE)
      setValidationError(null)
      return
    }

    if (!teacherId) return

    const loadTeacher = async () => {
      setIsLoadingDetails(true)
      setValidationError(null)

      try {
        const data = await teachersService.getById(teacherId)
        const loads = data.teachingLoads ?? []
        const latestLoad = getLatestTeachingLoad(loads)
        const normalizedStatus = normalizeTeacherStatus(data.status ?? initialStatus)

        setLastName(data.lastName)
        setFirstName(data.firstName)
        setPatronymic(data.patronymic)
        setInitialLastName(data.lastName)
        setInitialFirstName(data.firstName)
        setInitialPatronymic(data.patronymic)

        setTeachingLoads(loads)

        const year = getTeachingLoadYear(latestLoad) ?? String(getCurrentYear())
        setSelectedYear(year)
        setHours(String(latestLoad?.hours ?? ''))

        setStatus(normalizedStatus)
        setInitialStatusValue(normalizedStatus)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося завантажити дані викладача'))
      } finally {
        setIsLoadingDetails(false)
      }
    }

    void loadTeacher()
  }, [open, mode, teacherId, initialStatus, toast])

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    const existingLoad = teachingLoads.find((load) => getTeachingLoadYear(load) === year)
    if (existingLoad) {
      setHours(String(existingLoad.hours))
    } else {
      setHours('')
    }
  }

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
        onSuccess()
      } else if (teacherId) {
        const updateTasks: (() => Promise<void>)[] = []

        if (
          lastName.trim() !== initialLastName ||
          firstName.trim() !== initialFirstName ||
          patronymic.trim() !== initialPatronymic
        ) {
          updateTasks.push(() =>
            teachersService.update(teacherId, {
              lastName: lastName.trim(),
              firstName: firstName.trim(),
              patronymic: patronymic.trim(),
            }),
          )
        }

        if (status !== initialStatusValue) {
          updateTasks.push(() => teachersService.updateStatus({ id: teacherId, status }))
        }

        const existingLoad = teachingLoads.find(
          (load) => getTeachingLoadYear(load) === selectedYear,
        )

        if (existingLoad) {
          if (existingLoad.hours !== parsedHours) {
            updateTasks.push(() =>
              teachersService.updateTeachingLoad({
                id: existingLoad.id,
                teacherId,
                hours: parsedHours,
                startDate: existingLoad.startDate,
                endDate: existingLoad.endDate ?? null,
              }),
            )
          }
        } else {
          const startDate = `${selectedYear}-01-01T00:00:00Z`
          updateTasks.push(() =>
            teachersService.createTeachingLoad({
              teacherId,
              hours: parsedHours,
              startDate,
            }),
          )
        }

        if (updateTasks.length === 0) {
          toast.success('Немає змін для збереження')
          onSuccess()
          return
        }

        const results = await Promise.allSettled(updateTasks.map((task) => task()))

        const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')

        if (rejected.length > 0) {
          rejected.forEach((r) => {
            const msg = getErrorMessage(r.reason, 'Не вдалося оновити викладача')
            if (msg) toast.error(msg)
          })

          const successful = results.filter((r) => r.status === 'fulfilled')
          if (successful.length > 0) {
            toast.success('Частину даних оновлено')
          }
          return
        }

        toast.success('Викладача оновлено')
        onSuccess()
      }
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

  const yearOptions = useMemo(() => {
    const years = teachingLoads
      .map((load) => getTeachingLoadYear(load))
      .filter((year): year is string => year !== null)

    // Sort descending
    years.sort((a, b) => b.localeCompare(a))

    return Array.from(new Set(years)).map((year) => ({
      value: year,
      label: year,
    }))
  }, [teachingLoads])

  return {
    state: {
      lastName,
      firstName,
      patronymic,
      hours,
      status,
      selectedYear,
      yearOptions,
      statusOptions: TEACHER_STATUS_OPTIONS,
      isLoading,
      isLoadingDetails,
      isFormValid,
      validationError,
      showStatus: mode === 'edit',
      showLoadYear: mode === 'edit',
    },
    actions: {
      setLastName,
      setFirstName,
      setPatronymic,
      setHours,
      setStatus,
      handleYearChange,
      submit,
    },
  }
}
