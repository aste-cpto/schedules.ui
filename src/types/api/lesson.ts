export type LessonType = 'Pair' | 'Practice'

export type LessonTeacherDto = {
  id: number
  displayName: string
}

export type LessonDto = {
  id: number
  date: string
  hours: number
  order: number
  type: LessonType
  teacherId: number
  subjectId: number
  scheduleId: number
  teacher: LessonTeacherDto
  createdAt: string
  updatedAt: string
}

export type CreateLessonDto = {
  date: string
  hours: number
  order: number
  type: LessonType
  teacherId: number
  subjectId: number
  scheduleId: number
}

export type UpdateLessonDto = {
  id?: number
  date: string
  hours: number
  order: number
  type: LessonType
  teacherId: number
  subjectId: number
  scheduleId: number
}
