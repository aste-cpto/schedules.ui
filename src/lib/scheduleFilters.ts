/** Локальна фільтрація — тільки для mock-режиму. З API все робить GET /schedules. */
import { parseDisplayDate, parseIsoDate, startOfDay } from '~/lib/dateUtils'
import type { SchedulesListParams } from '~/types/api/schedule'
import type { Schedule } from '~/types/schedule'

export function filterSchedules(schedules: Schedule[], params: SchedulesListParams): Schedule[] {
  let result = schedules

  const search = params.search?.trim().toLowerCase()
  if (search) {
    result = result.filter(
      (schedule) =>
        schedule.group.toLowerCase().includes(search) ||
        schedule.program.toLowerCase().includes(search),
    )
  }

  if (params.startDate) {
    const from = parseIsoDate(params.startDate)
    if (from) {
      const fromDay = startOfDay(from)
      result = result.filter((schedule) => {
        const start = parseDisplayDate(schedule.start)
        return start && startOfDay(start) >= fromDay
      })
    }
  }

  if (params.endDate) {
    const to = parseIsoDate(params.endDate)
    if (to) {
      const toDay = startOfDay(to)
      result = result.filter((schedule) => {
        const end = parseDisplayDate(schedule.end)
        return end && startOfDay(end) <= toDay
      })
    }
  }

  return result
}

export function paginateSchedules<T>(
  items: T[],
  page = 1,
  pageRecords = 10,
): { items: T[]; page: number; pageRecords: number; pagesCount: number; total: number } {
  const total = items.length

  if (total === 0) {
    return { items: [], page: 1, pageRecords, pagesCount: 0, total: 0 }
  }

  const pagesCount = Math.ceil(total / pageRecords)
  const safePage = Math.min(Math.max(page, 1), pagesCount)
  const start = (safePage - 1) * pageRecords

  return {
    items: items.slice(start, start + pageRecords),
    page: safePage,
    pageRecords,
    pagesCount,
    total,
  }
}
