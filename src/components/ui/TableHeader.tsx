import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

export type TableHeaderColumn = {
  key: string
  label: ReactNode
  className?: string
}

type TableHeaderProps = {
  columns: TableHeaderColumn[]
  rowClassName?: string
}

const DEFAULT_ROW_CLASS =
  'border-b border-border bg-gradient-to-r from-accent-violet via-accent-indigo to-accent-blue text-left text-text-inverse'

export const TableHeader = ({ columns, rowClassName }: TableHeaderProps) => {
  return (
    <thead>
      <tr className={cn(DEFAULT_ROW_CLASS, rowClassName)}>
        {columns.map((column) => (
          <th key={column.key} className={column.className}>
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}
