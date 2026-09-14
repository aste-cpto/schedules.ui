import { Select } from '~/ui/Select'

type ReportsFiltersProps = {
  year: number
  options: { value: string; label: string }[]
  onYearChange: (year: number) => void
}

export const ReportsFilters = ({ year, options, onYearChange }: ReportsFiltersProps) => {
  return (
    <Select
      label="Рік"
      value={String(year)}
      onChange={(nextValue) => onYearChange(Number(nextValue))}
      options={options}
      wrapperClassName="w-full sm:w-[7rem] shrink-0"
    />
  )
}
