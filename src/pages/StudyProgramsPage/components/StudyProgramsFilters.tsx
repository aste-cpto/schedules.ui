import { SearchInput } from '~/ui/SearchInput'
import { Select } from '~/ui/Select'

export type StudyProgramsFiltersValues = {
  search: string
  pageRecords: number
}

type StudyProgramsFiltersProps = {
  values: StudyProgramsFiltersValues
  onSearchChange: (value: string) => void
  onPageRecordsChange: (value: number) => void
}

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
]

export const StudyProgramsFilters = ({
  values,
  onSearchChange,
  onPageRecordsChange,
}: StudyProgramsFiltersProps) => {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
        <SearchInput
          label="Пошук"
          value={values.search}
          onChange={(event) => onSearchChange(event.target.value)}
          wrapperClassName="min-w-0 flex-1"
        />

        <Select
          label="На сторінці"
          value={String(values.pageRecords)}
          onChange={(nextValue) => onPageRecordsChange(Number(nextValue))}
          options={PAGE_SIZE_OPTIONS}
          wrapperClassName="w-full sm:w-[5.5rem] shrink-0"
        />
      </div>
    </div>
  )
}
