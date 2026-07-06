import type { TeachingLoadDto } from '~/types/api/teacher'

export function getLatestTeachingLoad(loads: TeachingLoadDto[]): TeachingLoadDto | null {
  if (loads.length === 0) return null

  return [...loads].sort((a, b) => b.startDate.localeCompare(a.startDate))[0]
}

export function getTeachingLoadYear(load: TeachingLoadDto | null): string | null {
  if (!load) return null

  const year = new Date(load.startDate).getFullYear()
  return Number.isNaN(year) ? null : String(year)
}
