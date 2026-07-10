import type { LessonDto } from './lesson'

export type ScheduleStudyProgramRefDto = {
  id: number
  name: string
  createdAt?: string
  updatedAt?: string
}

export type ScheduleShortDto = {
  id: number
  startDate: string
  endDate: string
  groupName: string
  studyProgramId: number
  studyProgramName: string
}

export type ScheduleDetailsApiDto = {
  id: number
  startDate: string
  endDate: string
  groupName: string
  studyProgram: ScheduleStudyProgramRefDto
  createdAt: string
  updatedAt: string
  lessons: LessonDto[]
}

export type ScheduleDto = {
  id: number
  startDate: string
  endDate: string
  groupName: string
  studyProgramId: number
  studyProgramName: string
  status?: string
  lessons?: LessonDto[]
  createdAt?: string
  updatedAt?: string
}

export type SchedulesListParams = {
  search?: string
  page?: number
  pageRecords?: number
  year?: number
}

export type SchedulesListResponse = {
  items: ScheduleShortDto[]
  page: number
  pageRecords: number
  totalPages: number
}

export type CreateScheduleDto = {
  startDate: string
  endDate: string
  groupName: string
  studyProgramId: number
}

export type UpdateScheduleDto = {
  startDate: string
  endDate: string
  groupName: string
  studyProgramId: number
}
