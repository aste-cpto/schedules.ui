import type { LessonDto } from './lesson'
import type { StudyProgramSubjectDto } from './studyProgram'

export type ScheduleStudyProgramRefDto = {
  id: number
  name: string
  subjects?: StudyProgramSubjectDto[]
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
  subjects?: StudyProgramSubjectDto[]
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
