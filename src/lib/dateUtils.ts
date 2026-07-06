export function parseDisplayDate(value: string): Date | null {
  const [day, month, year] = value.split('.').map(Number)
  if (!day || !month || !year) return null

  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

export function parseIsoDate(value: string): Date | null {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateToIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateToDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function formatApiDateToDisplay(value: string): string {
  const date = parseIsoDate(value)
  if (!date) return value

  return formatDateToDisplay(date)
}

export function toApiDateTime(dateInput: string, time = '00:00:00'): string {
  const isoDate = toIsoDateString(dateInput)
  return `${isoDate}T${time}`
}

export function toIsoDateString(value: string): string {
  const fromDisplay = parseDisplayDate(value)
  if (fromDisplay) return formatDateToIso(fromDisplay)

  const fromIso = parseIsoDate(value)
  if (fromIso) return formatDateToIso(fromIso)

  return value
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
