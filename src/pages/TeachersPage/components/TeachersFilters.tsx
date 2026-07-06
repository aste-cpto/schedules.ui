import { SearchInput } from '~/components/ui/SearchInput'

export type TeachersFiltersValues = {
  search: string
}

type TeachersFiltersProps = {
  values: TeachersFiltersValues
  onSearchChange: (value: string) => void
}

export const TeachersFilters = ({ values, onSearchChange }: TeachersFiltersProps) => {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 shadow-sm">
      <SearchInput
        label="Пошук"
        placeholder="Пошук за ПІБ викладача"
        value={values.search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
  )
}
