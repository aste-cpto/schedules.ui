import { useMemo, useState } from 'react'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useTeachers } from '~/hooks/useTeachers'
import type { TeachersFiltersValues } from '~/pages/TeachersPage/components/TeachersFilters'
import {
  defaultTeacherRowHandlers,
  type TeacherRowActionHandlers,
} from '~/pages/TeachersPage/config/teacherRowActions'
import type { TeacherListItemDto } from '~/types/api/teacher'
import type { TeacherStatus } from '~/types/api/teacher'

const DEFAULT_PAGE_RECORDS = 10

export type TeacherFormModalState =
  | { mode: 'create' }
  | { mode: 'edit'; teacherId: number; status: TeacherStatus }
  | null

export function useTeachersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageRecords, setPageRecords] = useState(DEFAULT_PAGE_RECORDS)
  const [formModal, setFormModal] = useState<TeacherFormModalState>(null)

  const debouncedSearch = useDebouncedValue(search)

  const listParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      page,
      pageRecords,
    }),
    [debouncedSearch, page, pageRecords],
  )

  const { teachers, loading, error, pagination, refetch, deactivateTeacher } =
    useTeachers(listParams)

  const rowActions = useMemo<TeacherRowActionHandlers>(
    () => ({
      ...defaultTeacherRowHandlers,
      onEdit: (teacher: TeacherListItemDto) =>
        setFormModal({ mode: 'edit', teacherId: teacher.id, status: teacher.status }),
      onDelete: (id) => deactivateTeacher(id),
    }),
    [deactivateTeacher],
  )

  const resetPage = () => setPage(1)

  const filterValues: TeachersFiltersValues = {
    search,
    pageRecords,
  }

  const rangeLabel =
    pagination && pagination.total > 0
      ? `Відображається ${(pagination.page - 1) * pagination.pageRecords + 1}–${Math.min(
          pagination.page * pagination.pageRecords,
          pagination.total,
        )} з ${pagination.total}`
      : null

  return {
    teachers,
    loading,
    error,
    pagination,
    rangeLabel,
    rowActions,
    refetch,
    setPage,
    formModal,
    openCreateModal: () => setFormModal({ mode: 'create' }),
    closeFormModal: () => setFormModal(null),
    filters: {
      values: filterValues,
      onSearchChange: (value: string) => {
        setSearch(value)
        resetPage()
      },
      onPageRecordsChange: (value: number) => {
        setPageRecords(value)
        resetPage()
      },
    },
  }
}
