export type LessonType = 'Pair' | 'Training' | 'Practice' | 'Consultation' | 'Qualification'

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

export type LessonCellContext = {
  subjectId: number
  subjectName: string
  date: string
}
