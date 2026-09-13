import { REPORT_YEAR_OPTIONS } from '~/pages/ReportsPage/config/reportYears'
import { Select } from '~/ui/Select'

type ReportsFiltersProps = {
  year: number
  onYearChange: (year: number) => void
}

export const ReportsFilters = ({ year, onYearChange }: ReportsFiltersProps) => {
  return (
    <Select
      label="Рік"
      value={String(year)}
      onChange={(nextValue) => onYearChange(Number(nextValue))}
      options={REPORT_YEAR_OPTIONS}
      wrapperClassName="w-full sm:w-[7rem] shrink-0"
    />
  )
}
