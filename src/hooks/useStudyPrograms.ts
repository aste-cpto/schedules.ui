import { useCallback, useState } from 'react'
import { useModalGuard } from '~/contexts/ModalGuardContext'
import { useAutoListFetch } from '~/hooks/useAutoListFetch'
import { useToast } from '~/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
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
  deleteStudyProgram: (id: number) => Promise<boolean>
}

export function useStudyPrograms(params?: StudyProgramsListParams): UseStudyProgramsResult {
  const toast = useToast()
  const { isModalOpen } = useModalGuard()
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
        total: data.totalCount,
      })
    } catch (err) {
      const message = getErrorMessage(err, 'Не вдалося завантажити навчальні програми')
      setError(message)
      if (message) {
        toast.error(message)
      }
      setStudyPrograms([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.pageRecords, params?.search, toast])

  useAutoListFetch(refetch, [params?.page, params?.pageRecords, params?.search], {
    pause: isModalOpen,
  })

  const deleteStudyProgram = useCallback(
    async (id: number) => {
      try {
        await studyProgramsService.delete(id)
        toast.success('Програму видалено')
        await refetch()
        return true
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося видалити навчальну програму'))
        return false
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
