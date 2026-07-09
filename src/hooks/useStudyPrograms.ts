import { useCallback, useEffect, useState } from 'react'
import { useToast } from '~/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
import { estimateTotalFromApiResponse } from '~/lib/paginationUtils'
import { studyProgramsService } from '~/services/studyProgramsService'
import type {
  StudyProgramShortDto,
  StudyProgramsListParams,
} from '~/types/api/studyProgram'

type StudyProgramsPagination = {
  page: number
  pageRecords: number
  pagesCount: number
  total: number
}

type UseStudyProgramsResult = {
  studyPrograms: StudyProgramShortDto[]
  loading: boolean
  error: string | null
  pagination: StudyProgramsPagination | null
  refetch: () => Promise<void>
  deleteStudyProgram: (id: number) => Promise<void>
}

export function useStudyPrograms(params?: StudyProgramsListParams): UseStudyProgramsResult {
  const toast = useToast()
  const [studyPrograms, setStudyPrograms] = useState<StudyProgramShortDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<StudyProgramsPagination | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await studyProgramsService.getList(params)
      setStudyPrograms(data.items)
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
      const message = getErrorMessage(err, 'Не вдалося завантажити навчальні програми')
      setError(message)
      toast.error(message)
      setStudyPrograms([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.pageRecords, params?.search, toast])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const deleteStudyProgram = useCallback(
    async (id: number) => {
      try {
        await studyProgramsService.delete(id)
        toast.success('Програму видалено')
        await refetch()
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося видалити навчальну програму'))
      }
    },
    [refetch, toast],
  )

  return {
    studyPrograms,
    loading,
    error,
    pagination,
    refetch,
    deleteStudyProgram,
  }
}
