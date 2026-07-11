import { Pagination } from '~/ui/Pagination'
import { cn } from '~/lib/cn'

type TablePaginationBarProps = {
  rangeLabel: string | null
  pagination: { page: number; pagesCount: number } | null
  onPageChange: (page: number) => void
  className?: string
  sticky?: boolean
}

export function TablePaginationBar({
  rangeLabel,
  pagination,
  onPageChange,
  className,
  sticky = false,
}: TablePaginationBarProps) {
  if (!(rangeLabel || (pagination?.pagesCount ?? 0) > 1)) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 sm:flex-row sm:justify-between',
        sticky && 'sticky top-0 z-10 shrink-0 border-b border-border bg-bg-surface py-3',
        className,
      )}
    >
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
