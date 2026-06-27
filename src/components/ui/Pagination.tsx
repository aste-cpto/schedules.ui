import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '~/lib/cn'

type PaginationProps = {
  page: number
  pagesCount: number
  onPageChange: (page: number) => void
  className?: string
}

function getPageNumbers(page: number, pagesCount: number): (number | 'ellipsis')[] {
  if (pagesCount <= 5) {
    return Array.from({ length: pagesCount }, (_, index) => index + 1)
  }

  if (page <= 3) {
    return [1, 2, 3, 4, 'ellipsis', pagesCount]
  }

  if (page >= pagesCount - 2) {
    return [1, 'ellipsis', pagesCount - 3, pagesCount - 2, pagesCount - 1, pagesCount]
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', pagesCount]
}

export const Pagination = ({ page, pagesCount, onPageChange, className }: PaginationProps) => {
  if (pagesCount <= 1) return null

  const pages = getPageNumbers(page, pagesCount)

  return (
    <nav aria-label="Пагінація" className={cn('flex items-center justify-center gap-1', className)}>
      <button
        type="button"
        aria-label="Попередня сторінка"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-surface text-text-secondary transition-colors hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-sm text-text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-semibold transition-colors',
              item === page
                ? 'bg-gradient-to-r from-accent-violet via-accent-indigo to-accent-blue text-text-inverse shadow-sm'
                : 'border border-border bg-bg-surface text-text-secondary hover:bg-bg-muted',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Наступна сторінка"
        disabled={page >= pagesCount}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-surface text-text-secondary transition-colors hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
