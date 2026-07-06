export type ScheduleDto = {
  id: number
  startDate: string
  endDate: string
  groupName: string
  status: string
  studyProgramId: number
  studyProgramName: string
}

export type SchedulesListParams = {
  search?: string
  page?: number
  pageRecords?: number
  /** Client-side filter only — not sent to API */
  startDate?: string
  /** Client-side filter only — not sent to API */
  endDate?: string
}

export type SchedulesListResponse = {
  items: ScheduleDto[]
  page: number
  pageRecords: number
  totalPages: number
}

export type CreateScheduleDto = {
  startDate: string
  endDate: string
  groupName: string
  status: string
  studyProgramId: number
}

export type UpdateScheduleDto = {
  id: number
  startDate: string
  endDate: string
  groupName: string
  status: string
  studyProgramId: number
}
