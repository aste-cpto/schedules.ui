import { DatePicker } from '~/ui/DatePicker'
import { SearchInput } from '~/ui/SearchInput'
import { Select } from '~/ui/Select'
import { parseIsoDate } from '~/lib/dateUtils'

export type SchedulesFiltersValues = {
  search: string
  startDate: string
  endDate: string
  pageRecords: number
}

type SchedulesFiltersProps = {
  values: SchedulesFiltersValues
  onSearchChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onPageRecordsChange: (value: number) => void
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
]

export const SchedulesFilters = ({
  values,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onPageRecordsChange,
}: SchedulesFiltersProps) => {
  const startDate = parseIsoDate(values.startDate) ?? undefined
  const endDate = parseIsoDate(values.endDate) ?? undefined

  return (
    <div className="rounded-xl border border-border bg-bg-surface p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <SearchInput
          label="Пошук"
          value={values.search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <DatePicker
          label="Початок від"
          value={values.startDate}
          onChange={onStartDateChange}
          maxDate={endDate}
        />

        <DatePicker
          label="Завершення до"
          value={values.endDate}
          onChange={onEndDateChange}
          minDate={startDate}
        />

        <Select
          label="На сторінці"
          value={String(values.pageRecords)}
          onChange={(nextValue) => onPageRecordsChange(Number(nextValue))}
          options={PAGE_SIZE_OPTIONS}
        />
      </div>
    </div>
  )
}
