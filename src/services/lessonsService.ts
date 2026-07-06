import { apiClient } from '~/lib/apiClient'
import type { CreateLessonDto, LessonDto, UpdateLessonDto } from '~/types/api/lesson'

export const lessonsService = {
  create(payload: CreateLessonDto) {
    return apiClient<void>('/lessons', {
      method: 'POST',
      body: payload,
    })
  },

  getById(id: number) {
    return apiClient<LessonDto>(`/lessons/${id}`)
  },

  update(id: number, payload: UpdateLessonDto) {
    return apiClient<void>(`/lessons/${id}`, {
      method: 'PUT',
      body: payload,
    })
  },

  delete(id: number) {
    return apiClient<void>(`/lessons/${id}`, {
      method: 'DELETE',
    })
  },
}
