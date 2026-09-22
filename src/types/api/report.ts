export type TeacherLoadReportParams = {
  year: number
  types?: string[]
}

export type TeacherLoadReportItemDto = {
  teacherId: number
  teacherName: string
  monthlyHours: number[]
  usedHours: number
  totalHours: number
}

export type TeacherLoadReportTotalsDto = {
  monthlyHours: number[]
  usedHours: number
  totalHours: number
}

export type TeacherLoadReportResponse = {
  year: number
  items: TeacherLoadReportItemDto[]
  totals: TeacherLoadReportTotalsDto
}
