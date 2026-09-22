import { apiClient } from '~/lib/apiClient'
import type { TeacherLoadReportParams, TeacherLoadReportResponse } from '~/types/api/report'

export const reportsService = {
  getUsedHours(params: TeacherLoadReportParams) {
    const searchParams = new URLSearchParams()
    searchParams.set('year', String(params.year))
    
    if (params.types && params.types.length > 0) {
      params.types.forEach((type) => searchParams.append('types', type))
    }

    return apiClient<TeacherLoadReportResponse>(`/reports/used-hours?${searchParams.toString()}`)
  },
}
