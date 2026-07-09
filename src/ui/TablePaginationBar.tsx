import { Pagination } from '~/ui/Pagination'

type TablePaginationBarProps = {
  rangeLabel: string | null
  pagination: { page: number; pagesCount: number } | null
  onPageChange: (page: number) => void
}

export function TablePaginationBar({
  rangeLabel,
  pagination,
  onPageChange,
}: TablePaginationBarProps) {
  if (!(rangeLabel || (pagination?.pagesCount ?? 0) > 1)) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      {rangeLabel && <p className="text-sm text-text-secondary">{rangeLabel}</p>}

      {pagination && pagination.pagesCount > 1 && (
        <Pagination
          page={pagination.page}
          pagesCount={pagination.pagesCount}
          onPageChange={onPageChange}
          className="sm:ml-auto"
        />
      )}
    </div>
  )
}
