import { apiClient } from '~/lib/apiClient'
import { buildApiListQuery } from '~/lib/buildApiQuery'
import type { LessonDto } from '~/types/api/lesson'
import type {
  CreateScheduleDto,
  ScheduleDto,
  SchedulesListParams,
  SchedulesListResponse,
  UpdateScheduleDto,
} from '~/types/api/schedule'

function filterSchedulesByDate(
  items: ScheduleDto[],
  startDate?: string,
  endDate?: string,
): ScheduleDto[] {
  if (!startDate && !endDate) return items

  return items.filter((item) => {
    const itemStart = item.startDate.slice(0, 10)
    const itemEnd = item.endDate.slice(0, 10)

    if (startDate && itemEnd < startDate) return false
    if (endDate && itemStart > endDate) return false

    return true
  })
}

export const schedulesService = {
  async getList(params?: SchedulesListParams) {
    const data = await apiClient<SchedulesListResponse>(
      `/schedules${buildApiListQuery(params)}`,
    )

    const filteredItems = filterSchedulesByDate(data.items, params?.startDate, params?.endDate)

    return {
      ...data,
      items: filteredItems,
    }
  },

  create(payload: CreateScheduleDto) {
    return apiClient<void>('/schedules', {
      method: 'POST',
      body: payload,
    })
  },

  update(id: number, payload: UpdateScheduleDto) {
    return apiClient<void>(`/schedules/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },

  delete(id: number) {
    return apiClient<void>(`/schedules/${id}`, {
      method: 'DELETE',
    })
  },

  getById(id: number) {
    return apiClient<ScheduleDto>(`/schedules/${id}`)
  },

  /** Not documented in OpenAPI v1 — used by schedule details modal */
  getLessons(scheduleId: number) {
    return apiClient<LessonDto[]>(`/schedules/${scheduleId}/lessons`)
  },
}
