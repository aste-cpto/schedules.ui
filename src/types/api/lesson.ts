export type TeacherShortDto = {
  id: number
  displayName: string
}

export type LessonDto = {
  id: number
  date: string
  schedule_id: number
  subject_id: number
  teacher: TeacherShortDto
  type: string
  order: number
  hours: number
}

export type CreateLessonDto = {
  hours: number
  order: number
  type: string
  id: number
  teacher_id: number
  subject_id: number
  date: string
}
