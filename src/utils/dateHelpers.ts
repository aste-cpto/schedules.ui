import { eachDayOfInterval, format, isValid, isWeekend, parseISO } from 'date-fns'
import { uk } from 'date-fns/locale'
import { formatDateToIso, parseDisplayDate, toIsoDateString } from '~/lib/dateUtils'

export function parseScheduleDate(dateStr: string): Date | null {
  const fromDisplay = parseDisplayDate(dateStr)
  if (fromDisplay) return fromDisplay

  const calendarDate = toIsoDateString(dateStr)
  const fromIso = parseISO(calendarDate)
  return isValid(fromIso) ? fromIso : null
}

export const getBusinessDatesInRange = (start: string, end: string): string[] => {
  const startDate = parseScheduleDate(start)
  const endDate = parseScheduleDate(end)

  if (!startDate || !endDate) return []

  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  return allDays.filter((day) => !isWeekend(day)).map((day) => formatDateToIso(day))
}

export const formatDateDisplay = (dateStr: string) => {
  const date = parseScheduleDate(dateStr)
  if (!date) return dateStr

  return format(date, 'dd.MM.yyyy', { locale: uk })
}
