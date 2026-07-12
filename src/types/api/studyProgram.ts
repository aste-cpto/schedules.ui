export type StudyProgramShortDto = {
  id: number
  name: string
  hours: number
}

export type StudyProgramSubjectDto = {
  id: number
  name: string
  hours: number
  order: number
  createdAt?: string
  updatedAt?: string
}

export type StudyProgramDetailsDto = {
  id: number
  name: string
  subjects: StudyProgramSubjectDto[]
  createdAt: string
  updatedAt: string
}

export type NewStudyProgramSubjectDto = {
  name: string
  hours: number
  order: number
}

export type CreateStudyProgramDto = {
  name: string
  subjects: NewStudyProgramSubjectDto[]
}

export type UpdateStudyProgramSubjectDto = {
  id: number
  name: string
  hours: number
  order: number
}

export type UpdateStudyProgramDto = {
  id: number
  name: string
  subjects: UpdateStudyProgramSubjectDto[]
}

export type StudyProgramsListParams = {
  search?: string
  page?: number
  pageRecords?: number
}

export type StudyProgramsListResponse = {
  items: StudyProgramShortDto[]
  page: number
  pageRecords: number
  totalPages: number
  totalCount: number
}
