import type { LessonDto } from './lesson'

export type ScheduleDto = {
  id: number
  startDate: string
  endDate: string
  groupName: string
  status: string
  studyProgramId: number
  studyProgramName: string
  lessons?: LessonDto[]
}
export type SchedulesListParams = {
  search?: string
  page?: number
  pageRecords?: number
  startDate?: string
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
