import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

type DataTableProps = {
  children: ReactNode
  className?: string
}

export const DataTable = ({ children, className }: DataTableProps) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}
