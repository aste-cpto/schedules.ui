import { useCallback, useEffect, useState } from 'react'
import { USE_MOCK_DATA } from '~/env'
import { getErrorMessage } from '~/lib/formatApiError'
import { mapScheduleDtoToSchedule } from '~/mappers/scheduleMapper'
import {
  createMockSchedulesSource,
  getMockSchedulesList,
} from '~/services/mockSchedulesService'
import { schedulesService } from '~/services/schedulesService'
import type { SchedulesListParams } from '~/types/api/schedule'
import type { Schedule } from '~/types/schedule'

type SchedulesPagination = {
  page: number
  pageRecords: number
  pagesCount: number
  total: number
}

type UseSchedulesResult = {
  schedules: Schedule[]
  loading: boolean
  error: string | null
  pagination: SchedulesPagination | null
  refetch: () => Promise<void>
  deleteSchedule: (id: number) => Promise<void>
}

function estimateTotalFromApiResponse(
  page: number,
  pageRecords: number,
  pagesCount: number,
  itemsOnPage: number,
): number {
  if (pagesCount === 0) return 0
  if (page >= pagesCount) return (pagesCount - 1) * pageRecords + itemsOnPage
  return pagesCount * pageRecords
}

export function useSchedules(params?: SchedulesListParams): UseSchedulesResult {
  const [mockSource, setMockSource] = useState<Schedule[]>(createMockSchedulesSource)
  const initialMock = USE_MOCK_DATA ? getMockSchedulesList(mockSource, params) : null

  const [schedules, setSchedules] = useState<Schedule[]>(initialMock?.schedules ?? [])
  const [loading, setLoading] = useState(!USE_MOCK_DATA)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<SchedulesPagination | null>(
    initialMock
      ? {
          page: initialMock.page,
          pageRecords: initialMock.pageRecords,
          pagesCount: initialMock.pagesCount,
          total: initialMock.total,
        }
      : null,
  )

  const refetch = useCallback(async () => {
    if (USE_MOCK_DATA) {
      setError(null)

      const data = getMockSchedulesList(mockSource, params)

      setSchedules(data.schedules)
      setPagination({
        page: data.page,
        pageRecords: data.pageRecords,
        pagesCount: data.pagesCount,
        total: data.total,
      })
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await schedulesService.getList(params)
      setSchedules(data.schedules.map(mapScheduleDtoToSchedule))
      setPagination({
        page: data.page,
        pageRecords: data.pageRecords,
        pagesCount: data.pagesCount,
        total: estimateTotalFromApiResponse(
          data.page,
          data.pageRecords,
          data.pagesCount,
          data.schedules.length,
        ),
      })
    } catch (err) {
      setError(getErrorMessage(err, 'Не вдалося завантажити розклади'))
      setSchedules([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [
    mockSource,
    params?.endDate,
    params?.page,
    params?.pageRecords,
    params?.search,
    params?.startDate,
  ])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const deleteSchedule = useCallback(
    async (id: number) => {
      if (USE_MOCK_DATA) {
        setMockSource((prev) => prev.filter((schedule) => schedule.id !== id))
        return
      }

      try {
        await schedulesService.delete(id)
        await refetch()
      } catch (err) {
        setError(getErrorMessage(err, 'Не вдалося видалити розклад'))
      }
    },
    [refetch],
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
