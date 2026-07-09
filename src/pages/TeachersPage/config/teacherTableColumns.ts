import { getCurrentYear } from '~/lib/dateUtils'

export type TeacherTableColumnKey =
  | 'index'
  | 'displayName'
  | 'status'
  | 'loadHours'
  | 'actions'

export type TeacherTableColumn = {
  key: TeacherTableColumnKey
  label: string
  headerClassName?: string
  cellClassName?: string
}

const currentYear = getCurrentYear()

export const TEACHER_TABLE_COLUMNS: TeacherTableColumn[] = [
  {
    key: 'index',
    label: '№',
    headerClassName: 'w-16 whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 font-medium tabular-nums',
  },
  {
    key: 'displayName',
    label: "Прізвище, ім'я, по-батькові викладача",
    headerClassName: 'min-w-[280px] px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 leading-snug',
  },
  {
    key: 'status',
    label: 'Статус',
    headerClassName: 'w-36 whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3',
  },
  {
    key: 'loadHours',
    label: `Годин на ${currentYear} рік`,
    headerClassName: 'w-36 whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 tabular-nums',
  },
  {
    key: 'actions',
    label: 'Дії',
    headerClassName: 'w-28 whitespace-nowrap px-4 py-3 text-right font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 text-right',
  },
]
