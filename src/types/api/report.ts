export type TeacherLoadReportParams = {
  year: number
}

export type TeacherLoadReportItemDto = {
  teacherId: number
  teacherName: string
  monthlyHours: number[]
  totalHours: number
}

export type TeacherLoadReportTotalsDto = {
  monthlyHours: number[]
  totalHours: number
}

export type TeacherLoadReportResponse = {
  year: number
  items: TeacherLoadReportItemDto[]
  totals: TeacherLoadReportTotalsDto
}
