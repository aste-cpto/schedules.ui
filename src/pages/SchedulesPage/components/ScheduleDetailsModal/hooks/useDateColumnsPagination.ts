import { useEffect, useMemo, useState } from 'react'
import { SCHEDULE_DAYS_PER_PAGE } from '../config/scheduleTableLayout'

export function useDateColumnsPagination(dateColumns: string[]) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [dateColumns])

  const pagesCount = Math.max(1, Math.ceil(dateColumns.length / SCHEDULE_DAYS_PER_PAGE))
  const safePage = Math.min(page, pagesCount)

  const visibleDateColumns = useMemo(() => {
    const start = (safePage - 1) * SCHEDULE_DAYS_PER_PAGE
    return dateColumns.slice(start, start + SCHEDULE_DAYS_PER_PAGE)
  }, [dateColumns, safePage])

  const rangeLabel =
    pagesCount > 1
      ? `${(safePage - 1) * SCHEDULE_DAYS_PER_PAGE + 1}–${Math.min(
          safePage * SCHEDULE_DAYS_PER_PAGE,
          dateColumns.length,
        )} з ${dateColumns.length} днів`
      : null

  return {
    visibleDateColumns,
    page: safePage,
    pagesCount,
    setPage,
    rangeLabel,
  }
}
