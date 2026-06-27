import { apiClient } from '~/lib/apiClient'
import type { CreateLessonDto, LessonDto } from '~/types/api/lesson'
import type {
  CreateScheduleDto,
  ScheduleDto,
  SchedulesListParams,
  SchedulesListResponse,
  UpdateScheduleDto,
} from '~/types/api/schedule'

function buildSchedulesQuery(params?: SchedulesListParams): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()

  if (params.startDate) searchParams.set('startDate', params.startDate)
  if (params.endDate) searchParams.set('endDate', params.endDate)
  if (params.search) searchParams.set('search', params.search)
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.pageRecords !== undefined) searchParams.set('pageRecords', String(params.pageRecords))

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const schedulesService = {
  getList(params?: SchedulesListParams) {
    return apiClient<SchedulesListResponse>(`/schedules${buildSchedulesQuery(params)}`)
  },

  create(payload: CreateScheduleDto) {
    return apiClient<ScheduleDto>('/schedules', {
      method: 'POST',
      body: payload,
    })
  },

  update(id: number, payload: UpdateScheduleDto) {
    return apiClient<ScheduleDto>(`/schedules/${id}`, {
      method: 'PATCH',
      body: payload,
    })
  },

  delete(id: number) {
    return apiClient<void>(`/schedules/${id}`, {
      method: 'DELETE',
    })
  },

  getLessons(scheduleId: number) {
    return apiClient<LessonDto[]>(`/schedules/${scheduleId}/lessons`)
  },

  addLesson(scheduleId: number, payload: CreateLessonDto) {
    return apiClient<void>(`/schedules/${scheduleId}/lessons`, {
      method: 'POST',
      body: payload,
    })
  },
}
