import { useCallback, useEffect, useState } from 'react'
import { useToast } from '~/components/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
import { estimateTotalFromApiResponse } from '~/lib/paginationUtils'
import {
  normalizeTeacherStatus,
  TEACHER_STATUS,
} from '~/pages/TeachersPage/config/teacherStatus'
import { teachersService } from '~/services/teachersService'
import type { TeacherListItemDto, TeachersListParams } from '~/types/api/teacher'

type TeachersPagination = {
  page: number
  pageRecords: number
  pagesCount: number
  total: number
}

type UseTeachersResult = {
  teachers: TeacherListItemDto[]
  loading: boolean
  error: string | null
  pagination: TeachersPagination | null
  refetch: () => Promise<void>
  deactivateTeacher: (id: number) => Promise<void>
}

function normalizeTeacherItem(item: TeacherListItemDto): TeacherListItemDto {
  return {
    ...item,
    status: normalizeTeacherStatus(item.status),
  }
}

export function useTeachers(params?: TeachersListParams): UseTeachersResult {
  const toast = useToast()
  const [teachers, setTeachers] = useState<TeacherListItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<TeachersPagination | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await teachersService.getList(params)
      const normalizedItems = data.items.map(normalizeTeacherItem)

      setTeachers(normalizedItems)
      setPagination({
        page: data.page,
        pageRecords: data.pageRecords,
        pagesCount: data.totalPages,
        total: estimateTotalFromApiResponse(
          data.page,
          data.pageRecords,
          data.totalPages,
          normalizedItems.length,
        ),
      })
    } catch (err) {
      const message = getErrorMessage(err, 'Не вдалося завантажити викладачів')
      setError(message)
      toast.error(message)
      setTeachers([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.pageRecords, params?.search, toast])

  useEffect(() => {
    void refetch()
  }, [refetch])

  const deactivateTeacher = useCallback(
    async (id: number) => {
      try {
        await teachersService.updateStatus({ id, status: TEACHER_STATUS.SUSPENDED })
        toast.success('Викладача деактивовано')
        await refetch()
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося видалити викладача'))
      }
    },
    [refetch, toast],
  )

  return {
    teachers,
    loading,
    error,
    pagination,
    refetch,
    deactivateTeacher,
  }
}
