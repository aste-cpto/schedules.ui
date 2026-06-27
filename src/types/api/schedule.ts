export type StudyProgramDto = {
  id: number
  name: string
}

export type ScheduleDto = {
  id: number
  startDate: string
  endDate: string
  groupName: string
  status: string
  studyProgram: StudyProgramDto
  spName?: string
}

export type SchedulesListParams = {
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  pageRecords?: number
}

export type SchedulesListResponse = {
  schedules: ScheduleDto[]
  page: number
  pageRecords: number
  pagesCount: number
}

export type CreateScheduleDto = {
  groupName: string
  startDate: string
  endDate: string
  spId: number
}

export type UpdateScheduleDto = {
  startDate?: string
  groupName?: string
  endDate?: string
}
