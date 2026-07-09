import { apiClient } from '~/lib/apiClient'
import { buildApiListQuery } from '~/lib/buildApiQuery'
import type {
  CreateScheduleDto,
  ScheduleDto,
  SchedulesListParams,
  SchedulesListResponse,
  UpdateScheduleDto,
} from '~/types/api/schedule'

export const schedulesService = {
  getList(params?: SchedulesListParams) {
    return apiClient<SchedulesListResponse>(`/schedules${buildApiListQuery(params)}`)
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
}
