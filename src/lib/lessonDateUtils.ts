import { formatDateToIso, parseIsoDate } from '~/lib/dateUtils'

export function getLessonDateKey(date: string): string {
  const parsed = parseIsoDate(date)
  if (parsed) return formatDateToIso(parsed)

  return date.split('T')[0] ?? date
}
