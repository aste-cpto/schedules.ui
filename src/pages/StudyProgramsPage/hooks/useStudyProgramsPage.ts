import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useStudyPrograms } from '~/hooks/useStudyPrograms'
import type { StudyProgramsFiltersValues } from '~/pages/StudyProgramsPage/components/StudyProgramsFilters'
import {
  defaultStudyProgramRowHandlers,
  type StudyProgramRowActionHandlers,
} from '~/pages/StudyProgramsPage/config/studyProgramRowActions'
import { useMemo, useState } from 'react'

const DEFAULT_PAGE_RECORDS = 10

export type StudyProgramFormModalState =
  | { mode: 'create' }
  | { mode: 'edit'; programId: number }
  | null

export function useStudyProgramsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageRecords, setPageRecords] = useState(DEFAULT_PAGE_RECORDS)
  const [formModal, setFormModal] = useState<StudyProgramFormModalState>(null)
  const [detailsProgramId, setDetailsProgramId] = useState<number | null>(null)

  const debouncedSearch = useDebouncedValue(search)

  const listParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      page,
      pageRecords,
    }),
    [debouncedSearch, page, pageRecords],
  )

  const { studyPrograms, loading, error, pagination, refetch, deleteStudyProgram } =
    useStudyPrograms(listParams)

  const rowActions = useMemo<StudyProgramRowActionHandlers>(
    () => ({
      ...defaultStudyProgramRowHandlers,
      onView: (id) => setDetailsProgramId(id),
      onEdit: (id) => setFormModal({ mode: 'edit', programId: id }),
      onDelete: (id) => deleteStudyProgram(id),
    }),
    [deleteStudyProgram],
  )

  const resetPage = () => setPage(1)

  const filterValues: StudyProgramsFiltersValues = {
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
    studyPrograms,
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
    detailsProgramId,
    closeDetailsModal: () => setDetailsProgramId(null),
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
