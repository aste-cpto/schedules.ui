import { useCallback, useEffect, useState } from 'react'
import { USE_MOCK_DATA } from '~/env'
import { getErrorMessage } from '~/lib/formatApiError'
import {
  createMockStudyProgramsSource,
  getMockStudyProgramsList,
} from '~/services/mockStudyProgramsService'
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

export function useStudyPrograms(params?: StudyProgramsListParams): UseStudyProgramsResult {
  const [mockSource, setMockSource] = useState<StudyProgramShortDto[]>(createMockStudyProgramsSource)
  const initialMock = USE_MOCK_DATA ? getMockStudyProgramsList(mockSource, params) : null

  const [studyPrograms, setStudyPrograms] = useState<StudyProgramShortDto[]>(
    initialMock?.studyPrograms ?? [],
  )
  const [loading, setLoading] = useState(!USE_MOCK_DATA)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<StudyProgramsPagination | null>(
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

      const data = getMockStudyProgramsList(mockSource, params)

      setStudyPrograms(data.studyPrograms)
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
      const data = await studyProgramsService.getList(params)
      setStudyPrograms(data.studyPrograms)
      setPagination({
        page: data.page,
        pageRecords: data.pageRecords,
        pagesCount: data.pagesCount,
        total: estimateTotalFromApiResponse(
          data.page,
          data.pageRecords,
          data.pagesCount,
          data.studyPrograms.length,
        ),
      })
    } catch (err) {
      setError(getErrorMessage(err, 'Не вдалося завантажити навчальні програми'))
      setStudyPrograms([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [mockSource, params?.page, params?.pageRecords, params?.search])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const deleteStudyProgram = useCallback(
    async (id: number) => {
      if (USE_MOCK_DATA) {
        setMockSource((prev) => prev.filter((program) => program.id !== id))
        return
      }

      try {
        await studyProgramsService.delete(id)
        await refetch()
      } catch (err) {
        setError(getErrorMessage(err, 'Не вдалося видалити навчальну програму'))
      }
    },
    [refetch],
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
