import { useEffect, useState } from 'react'
import { useToast } from '~/ui/toast/useToast'
import { toApiDateTime } from '~/lib/dateUtils'
import { getErrorMessage } from '~/lib/formatApiError'
import { VALIDATION_REQUIRED_FIELDS } from '~/lib/validationMessages'
import { DEFAULT_SCHEDULE_STATUS } from '~/pages/SchedulesPage/config/scheduleStatus'
import { schedulesService } from '~/services/schedulesService'
import { studyProgramsService } from '~/services/studyProgramsService'
import type { SelectOption } from '~/ui/Select'

type UseScheduleFormOptions = {
  open: boolean
  onSuccess: () => void
}

export const useScheduleForm = ({ open, onSuccess }: UseScheduleFormOptions) => {
  const toast = useToast()
  const [groupName, setGroupName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<string>(DEFAULT_SCHEDULE_STATUS)
  const [studyProgramId, setStudyProgramId] = useState('')
  const [studyProgramOptions, setStudyProgramOptions] = useState<SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const isFormValid =
    groupName.trim() !== '' &&
    startDate !== '' &&
    endDate !== '' &&
    studyProgramId !== '' &&
    status !== ''

  useEffect(() => {
    if (isFormValid && validationError) {
      setValidationError(null)
    }
  }, [isFormValid, validationError])

  useEffect(() => {
    if (!open) return

    setGroupName('')
    setStartDate('')
    setEndDate('')
    setStatus(DEFAULT_SCHEDULE_STATUS)
    setStudyProgramId('')
    setValidationError(null)

    const loadPrograms = async () => {
      setIsLoadingPrograms(true)
      try {
        const data = await studyProgramsService.getList({ page: 1, pageRecords: 100 })
        setStudyProgramOptions(
          data.items.map((program) => ({
            value: String(program.id),
            label: program.name,
          })),
        )
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося завантажити навчальні програми'))
        setStudyProgramOptions([])
      } finally {
        setIsLoadingPrograms(false)
      }
    }

    void loadPrograms()
  }, [open, toast])

  const submit = async () => {
    if (!isFormValid) {
      setValidationError(VALIDATION_REQUIRED_FIELDS)
      return
    }

    setIsLoading(true)
    setValidationError(null)

    try {
      await schedulesService.create({
        groupName: groupName.trim(),
        startDate: toApiDateTime(startDate, '00:00:00'),
        endDate: toApiDateTime(endDate, '23:59:59'),
        studyProgramId: Number(studyProgramId),
      })

      toast.success('Розклад створено')
      onSuccess()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Не вдалося створити розклад'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    state: {
      groupName,
      startDate,
      endDate,
      status,
      studyProgramId,
      studyProgramOptions,
      isLoading,
      isLoadingPrograms,
      isFormValid,
      validationError,
    },
    actions: {
      setGroupName,
      setStartDate,
      setEndDate,
      setStatus,
      setStudyProgramId,
      submit,
    },
  }
}
