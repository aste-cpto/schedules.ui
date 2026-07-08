export type StudyProgramTableColumnKey = 'index' | 'name' | 'hours' | 'actions'

export type StudyProgramTableColumn = {
  key: StudyProgramTableColumnKey
  label: string
  headerClassName?: string
  cellClassName?: string
}

export const STUDY_PROGRAM_TABLE_COLUMNS: StudyProgramTableColumn[] = [
  {
    key: 'index',
    label: '№',
    headerClassName: 'w-16 whitespace-nowrap px-4 py-3 font-semibold',
    cellClassName: 'whitespace-nowrap px-4 py-3 font-medium tabular-nums',
  },
  {
    key: 'name',
    label: 'Назва навчальної програми',
    headerClassName: 'min-w-[320px] px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 leading-snug',
  },
  {
    key: 'hours',
    label: 'Кількість годин',
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
