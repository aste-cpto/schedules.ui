import { getCurrentYear } from '~/lib/dateUtils'

export const REPORT_YEARS = [2026, 2025, 2024] as const

const currentYear = getCurrentYear()

export const DEFAULT_REPORT_YEAR = REPORT_YEARS.find((year) => year === currentYear) ?? REPORT_YEARS[0]

export const REPORT_YEAR_OPTIONS = REPORT_YEARS.map((year) => ({
  value: String(year),
  label: String(year),
}))
