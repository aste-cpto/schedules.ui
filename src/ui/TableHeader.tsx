import { type ReactNode } from 'react'
import { cn } from '~/lib/cn'

export type TableHeaderColumn = {
  key: string
  label: ReactNode
  className?: string
}

type TableVariant = 'primary' | 'secondary'

type TableHeaderProps = {
  columns: TableHeaderColumn[]
  rowClassName?: string
  variant?: TableVariant
}

const VARIANT_CLASSES: Record<TableVariant, string> = {
  primary:
    'bg-gradient-to-r from-accent-violet via-accent-indigo to-accent-blue text-text-inverse border-b border-border',
  secondary: 'bg-bg-muted text-text-secondary border-b border-border',
}

export const TableHeader = ({ columns, rowClassName, variant = 'primary' }: TableHeaderProps) => {
  return (
    <thead>
      <tr className={cn('text-left', VARIANT_CLASSES[variant], rowClassName)}>
        {columns.map((column) => (
          <th key={column.key} className={cn('px-4 py-3 font-semibold', column.className)}>
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}
