import { apiClient } from '~/lib/apiClient'
import type { TeacherLoadReportParams, TeacherLoadReportResponse } from '~/types/api/report'

export const reportsService = {
  getUsedHours(params: TeacherLoadReportParams) {
    return apiClient<TeacherLoadReportResponse>(`/reports/used-hours?year=${params.year}`)
  },
}
