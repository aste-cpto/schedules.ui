import { apiClient } from '~/lib/apiClient'
import { buildApiListQuery } from '~/lib/buildApiQuery'
import type {
  CreateStudyProgramDto,
  StudyProgramDetailsDto,
  StudyProgramsListParams,
  StudyProgramsListResponse,
  UpdateStudyProgramDto,
} from '~/types/api/studyProgram'

export const studyProgramsService = {
  getList(params?: StudyProgramsListParams) {
    return apiClient<StudyProgramsListResponse>(
      `/study-programs${buildApiListQuery(params)}`,
    )
  },

  getById(id: number) {
    return apiClient<StudyProgramDetailsDto>(`/study-programs/${id}`)
  },

  create(payload: CreateStudyProgramDto) {
    return apiClient<void>('/study-programs', {
      method: 'POST',
      body: payload,
    })
  },

  update(id: number, payload: UpdateStudyProgramDto) {
    return apiClient<void>(`/study-programs/${id}`, {
      method: 'PUT',
      body: { ...payload, id },
    })
  },

  delete(id: number) {
    return apiClient<void>(`/study-programs/${id}`, {
      method: 'DELETE',
    })
  },
}
