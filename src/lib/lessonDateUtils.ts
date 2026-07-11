import { toIsoDateString } from '~/lib/dateUtils'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function getLessonDateKey(date: string): string {
  const datePart = date.split('T')[0] ?? date
  if (ISO_DATE_PATTERN.test(datePart)) {
    return datePart
  }

  return toIsoDateString(date)
}

export function toApiNumber(value: number | string | null | undefined): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}
