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
  studyProgramId: number
}

export type StudyProgramDetailsDto = {
  id: number
  name: string
  hours: number
  subjects: StudyProgramSubjectDto[]
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

export type UpdateStudyProgramDto = {
  id: number
  name: string
  hours: number
  subjects: StudyProgramSubjectDto[]
}

export type StudyProgramsListParams = {
  search?: string
  page?: number
  pageRecords?: number
}

export type StudyProgramsListResponse = {
  studyPrograms: StudyProgramShortDto[]
  page: number
  pageRecords: number
  pagesCount: number
}
