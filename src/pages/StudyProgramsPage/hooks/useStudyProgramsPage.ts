import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useStudyPrograms } from '~/hooks/useStudyPrograms'
import type { StudyProgramsFiltersValues } from '~/pages/StudyProgramsPage/components/StudyProgramsFilters'
import {
  defaultStudyProgramRowHandlers,
  type StudyProgramRowActionHandlers,
} from '~/pages/StudyProgramsPage/config/studyProgramRowActions'
import { useMemo, useState } from 'react'

const DEFAULT_PAGE_RECORDS = 20

export function useStudyProgramsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageRecords] = useState(DEFAULT_PAGE_RECORDS)

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
      onDelete: (id) => {
        void deleteStudyProgram(id)
      },
    }),
    [deleteStudyProgram],
  )

  const resetPage = () => setPage(1)

  const filterValues: StudyProgramsFiltersValues = {
    search,
  }

  const rangeLabel =
    pagination && pagination.total > 0
      ? `${(pagination.page - 1) * pagination.pageRecords + 1}–${Math.min(
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
    filters: {
      values: filterValues,
      onSearchChange: (value: string) => {
        setSearch(value)
        resetPage()
      },
    },
  }
}
