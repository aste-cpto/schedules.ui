import { format, setMonth } from 'date-fns'
import { uk } from 'date-fns/locale'

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const REPORT_MONTHS = Array.from({ length: 12 }, (_, monthIndex) => ({
  monthIndex,
  label: capitalize(format(setMonth(new Date(2024, 0, 1), monthIndex), 'LLLL', { locale: uk })),
}))
