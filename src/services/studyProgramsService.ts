import { apiClient } from '~/lib/apiClient'
import type {
  CreateStudyProgramDto,
  StudyProgramDetailsDto,
  StudyProgramsListParams,
  StudyProgramsListResponse,
  UpdateStudyProgramDto,
} from '~/types/api/studyProgram'

function buildStudyProgramsQuery(params?: StudyProgramsListParams): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()

  if (params.search) searchParams.set('search', params.search)
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.pageRecords !== undefined) searchParams.set('pageRecords', String(params.pageRecords))

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const studyProgramsService = {
  getList(params?: StudyProgramsListParams) {
    return apiClient<StudyProgramsListResponse>(`/study-programs${buildStudyProgramsQuery(params)}`)
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
      body: payload,
    })
  },

  delete(id: number) {
    return apiClient<void>(`/study-programs/${id}`, {
      method: 'DELETE',
    })
  },
}
