export type ScheduleTableColumnKey =
  | 'index'
  | 'status'
  | 'group'
  | 'program'
  | 'start'
  | 'end'
  | 'actions'

export type ScheduleTableColumn = {
  key: ScheduleTableColumnKey
  label: string
  headerClassName?: string
  cellClassName?: string
}

export const SCHEDULE_TABLE_COLUMNS: ScheduleTableColumn[] = [
  {
    key: 'index',
    label: '№',
    headerClassName: 'whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 font-medium',
  },
  {
    key: 'status',
    label: 'Статус',
    headerClassName: 'whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3',
  },
  {
    key: 'group',
    label: 'Група №',
    headerClassName: 'whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 font-medium',
  },
  {
    key: 'program',
    label: 'Навчальна програма',
    headerClassName: 'min-w-[280px] px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 leading-snug',
  },
  {
    key: 'start',
    label: 'Початок',
    headerClassName: 'whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 font-semibold tabular-nums',
  },
  {
    key: 'end',
    label: 'Завершення',
    headerClassName: 'whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 tabular-nums',
  },
  {
    key: 'actions',
    label: 'Дії',
    headerClassName: 'whitespace-nowrap px-4 py-3 text-right font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 text-right',
  },
]
