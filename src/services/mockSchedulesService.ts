import { MOCK_SCHEDULES } from '~/constants/mockSchedules'
import { filterSchedules, paginateSchedules } from '~/lib/scheduleFilters'
import type { SchedulesListParams } from '~/types/api/schedule'
import type { Schedule } from '~/types/schedule'

const DEFAULT_PAGE_RECORDS = 10

export type MockSchedulesListResult = {
  schedules: Schedule[]
  page: number
  pageRecords: number
  pagesCount: number
  total: number
}

export function createMockSchedulesSource(): Schedule[] {
  return MOCK_SCHEDULES.map((schedule) => ({ ...schedule }))
}

export function getMockSchedulesList(
  source: Schedule[],
  params?: SchedulesListParams,
): MockSchedulesListResult {
  const filtered = filterSchedules(source, params ?? {})
  const paginated = paginateSchedules(
    filtered,
    params?.page ?? 1,
    params?.pageRecords ?? DEFAULT_PAGE_RECORDS,
  )

  return {
    schedules: paginated.items,
    page: paginated.page,
    pageRecords: paginated.pageRecords,
    pagesCount: paginated.pagesCount,
    total: paginated.total,
  }
}
