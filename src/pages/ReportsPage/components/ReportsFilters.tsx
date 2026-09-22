import { Select } from '~/ui/Select'
import { MultiSelect } from '~/ui/MultiSelect'

type ReportsFiltersProps = {
  year: number
  options: { value: string; label: string }[]
  onYearChange: (year: number) => void
  loadTypes: string[]
  onLoadTypesChange: (types: string[]) => void
}

const LOAD_TYPE_OPTIONS = [
  { value: 'Pedagogical', label: 'Педагогічне' },
  { value: 'Training', label: 'Виробниче навчання' },
  { value: 'Practice', label: 'Виробнича практика' },
]

export const ReportsFilters = ({ 
  year, 
  options, 
  onYearChange, 
  loadTypes, 
  onLoadTypesChange 
}: ReportsFiltersProps) => {
  const handleLoadTypeChange = (newValues: string[]) => {
    if (newValues.length === 0) {
      onLoadTypesChange(['Pedagogical'])
      return
    }

    const wasPedagogical = loadTypes.includes('Pedagogical')
    const hasPedagogical = newValues.includes('Pedagogical')
    
    if (!wasPedagogical && hasPedagogical) {
      onLoadTypesChange(['Pedagogical'])
      return
    }

    if (wasPedagogical && newValues.length > 1) {
      onLoadTypesChange(newValues.filter(v => v !== 'Pedagogical'))
      return
    }

    onLoadTypesChange(newValues)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Select
        label="Рік"
        value={String(year)}
        onChange={(nextValue) => onYearChange(Number(nextValue))}
        options={options}
        wrapperClassName="w-full shrink-0 sm:w-[7rem]"
      />
      <MultiSelect
        label="Вид навантаження"
        value={loadTypes}
        onChange={handleLoadTypeChange}
        options={LOAD_TYPE_OPTIONS}
        wrapperClassName="w-full shrink-0 sm:w-[15rem]"
      />
    </div>
  )
}
