export type TeacherStatus = 'Active' | 'Suspended'

export type TeacherListItemDto = {
  id: number
  displayName: string
  status: TeacherStatus
  loadHours: number
  availableHours: number
}

export type TeachersListParams = {
  page?: number
  pageRecords?: number
  search?: string
}

export type TeachersListResponse = {
  items: TeacherListItemDto[]
  page: number
  pageRecords: number
  totalPages: number
}

export type TeachingLoadDto = {
  id: number
  teacherId: number
  hours: number
  startDate: string
  endDate?: string | null
  createdAt: string
  updatedAt: string
}

export type TeacherDetailsDto = {
  id: number
  firstName: string
  lastName: string
  patronymic: string
  status: TeacherStatus
  teachingLoads?: TeachingLoadDto[]
  createdAt: string
  updatedAt: string
}

export type CreateTeacherDto = {
  firstName: string
  lastName: string
  patronymic: string
  hours: number
}

export type UpdateTeacherDto = {
  id: number
  firstName: string
  lastName: string
  patronymic: string
}

export type UpdateTeacherStatusDto = {
  id: number
  status: TeacherStatus
}

export type CreateTeachingLoadDto = {
  teacherId: number
  hours: number
  startDate: string
  endDate?: string | null
}

export type UpdateTeachingLoadDto = {
  id: number
  teacherId: number
  hours: number
  startDate: string
  endDate?: string | null
}

/** @deprecated Use TeacherListItemDto */
export type TeacherItemDto = TeacherListItemDto
