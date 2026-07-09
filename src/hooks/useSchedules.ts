import { useCallback, useEffect, useState } from 'react'
import { useToast } from '~/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
import { estimateTotalFromApiResponse } from '~/lib/paginationUtils'
import { mapScheduleDtoToSchedule } from '~/mappers/scheduleMapper'
import { schedulesService } from '~/services/schedulesService'
import type { SchedulesListParams } from '~/types/api/schedule'
import type { Schedule } from '~/types/schedule'

type SchedulesPagination = {
  page: number
  pageRecords: number
  pagesCount: number
  total: number
}

type RefetchOptions = {
  silent?: boolean
}

type UseSchedulesResult = {
  schedules: Schedule[]
  loading: boolean
  error: string | null
  pagination: SchedulesPagination | null
  refetch: (options?: RefetchOptions) => Promise<void>
  deleteSchedule: (id: number) => Promise<void>
}

export function useSchedules(params?: SchedulesListParams): UseSchedulesResult {
  const toast = useToast()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<SchedulesPagination | null>(null)

  const refetch = useCallback(async (options?: RefetchOptions) => {
    const silent = options?.silent ?? false

    if (!silent) {
      setLoading(true)
      setError(null)
    }

    try {
      const data = await schedulesService.getList(params)
      setSchedules(data.items.map(mapScheduleDtoToSchedule))
      setPagination({
        page: data.page,
        pageRecords: data.pageRecords,
        pagesCount: data.totalPages,
        total: estimateTotalFromApiResponse(
          data.page,
          data.pageRecords,
          data.totalPages,
          data.items.length,
        ),
      })
    } catch (err) {
      const message = getErrorMessage(err, 'Не вдалося завантажити розклади')
      if (!silent) {
        setError(message)
        setSchedules([])
        setPagination(null)
      }
      toast.error(message)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [params?.endDate, params?.page, params?.pageRecords, params?.search, params?.startDate, toast])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const deleteSchedule = useCallback(
    async (id: number) => {
      try {
        await schedulesService.delete(id)
        toast.success('Розклад видалено')
        await refetch()
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося видалити розклад'))
      }
    },
    [refetch, toast],
  )

  return {
    schedules,
    loading,
    error,
    pagination,
    refetch,
    deleteSchedule,
  }
}
