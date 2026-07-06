import { apiClient } from '~/lib/apiClient'
import { buildApiListQuery } from '~/lib/buildApiQuery'
import type {
  CreateTeacherDto,
  TeacherDetailsDto,
  TeachersListParams,
  TeachersListResponse,
  UpdateTeacherDto,
  UpdateTeacherStatusDto,
  CreateTeachingLoadDto,
  UpdateTeachingLoadDto,
} from '~/types/api/teacher'

export const teachersService = {
  getList(params?: TeachersListParams) {
    return apiClient<TeachersListResponse>(`/teachers${buildApiListQuery(params)}`)
  },

  getById(id: number) {
    return apiClient<TeacherDetailsDto>(`/teachers/${id}`)
  },

  create(payload: CreateTeacherDto) {
    return apiClient<void>('/teachers', {
      method: 'POST',
      body: payload,
    })
  },

  update(id: number, payload: Omit<UpdateTeacherDto, 'id'>) {
    return apiClient<void>(`/teachers/${id}`, {
      method: 'PUT',
      body: { ...payload, id },
    })
  },

  updateStatus(payload: UpdateTeacherStatusDto) {
    return apiClient<void>('/teachers/status', {
      method: 'PATCH',
      body: payload,
    })
  },

  createTeachingLoad(payload: CreateTeachingLoadDto) {
    return apiClient<void>('/teachers/loads', {
      method: 'POST',
      body: payload,
    })
  },

  updateTeachingLoad(payload: UpdateTeachingLoadDto) {
    return apiClient<void>('/teachers/loads', {
      method: 'PUT',
      body: payload,
    })
  },
}
