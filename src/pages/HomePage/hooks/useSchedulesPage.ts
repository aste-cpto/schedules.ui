import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useSchedules } from '~/hooks/useSchedules'
import {
  defaultScheduleRowHandlers,
  type ScheduleRowActionHandlers,
} from '~/pages/HomePage/config/scheduleRowActions'
import type { SchedulesFiltersValues } from '~/pages/HomePage/components/SchedulesFilters'
import { useMemo, useState } from 'react'

const DEFAULT_PAGE_RECORDS = 10

export function useSchedulesPage() {
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [pageRecords, setPageRecords] = useState(DEFAULT_PAGE_RECORDS)

  const debouncedSearch = useDebouncedValue(search)

  const listParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page,
      pageRecords,
    }),
    [debouncedSearch, endDate, page, pageRecords, startDate],
  )

  const { schedules, loading, error, pagination, refetch, deleteSchedule } =
    useSchedules(listParams)

  const rowActions = useMemo<ScheduleRowActionHandlers>(
    () => ({
      ...defaultScheduleRowHandlers,
      onDelete: (id) => {
        void deleteSchedule(id)
      },
    }),
    [deleteSchedule],
  )

  const resetPage = () => setPage(1)

  const filterValues: SchedulesFiltersValues = {
    search,
    startDate,
    endDate,
    pageRecords,
  }

  const rangeLabel =
    pagination && pagination.total > 0
      ? `${(pagination.page - 1) * pagination.pageRecords + 1}–${Math.min(
          pagination.page * pagination.pageRecords,
          pagination.total,
        )} з ${pagination.total}`
      : null

  return {
    schedules,
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
      onStartDateChange: (value: string) => {
        setStartDate(value)
        resetPage()
      },
      onEndDateChange: (value: string) => {
        setEndDate(value)
        resetPage()
      },
      onPageRecordsChange: (value: number) => {
        setPageRecords(value)
        resetPage()
      },
    },
  }
}
