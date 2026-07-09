import { SearchInput } from '~/ui/SearchInput'

export type StudyProgramsFiltersValues = {
  search: string
}

type StudyProgramsFiltersProps = {
  values: StudyProgramsFiltersValues
  onSearchChange: (value: string) => void
}

export const StudyProgramsFilters = ({ values, onSearchChange }: StudyProgramsFiltersProps) => {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 shadow-sm">
      <SearchInput
        label="Пошук"
        value={values.search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
  )
}
