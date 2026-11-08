import { apiClient } from '~/lib/apiClient'
import { buildSchedulesListQuery } from '~/lib/buildApiQuery'
import { normalizeScheduleDetails } from '~/mappers/scheduleMapper'
import type {
  CreateScheduleDto,
  ScheduleDetailsApiDto,
  SchedulesListParams,
  SchedulesListResponse,
  UpdateScheduleDto,
} from '~/types/api/schedule'
import type { TeacherListItemDto } from '~/types/api/teacher'

export const schedulesService = {
  getList(params?: SchedulesListParams) {
    return apiClient<SchedulesListResponse>(`/schedules${buildSchedulesListQuery(params)}`)
  },

  getScheduleTeachers(scheduleId: number, year?: number) {
    const query = year !== undefined ? `?year=${encodeURIComponent(year)}` : ''
    return apiClient<TeacherListItemDto[]>(`/schedules/${scheduleId}/teachers${query}`)
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

  async getById(id: number) {
    const data = await apiClient<ScheduleDetailsApiDto>(`/schedules/${id}`)
    return normalizeScheduleDetails(data)
  },
}
