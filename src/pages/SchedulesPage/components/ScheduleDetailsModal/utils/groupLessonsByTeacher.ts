import type { LessonDto } from '~/types/api/lesson'
import { compareLessonsForDisplay } from './formatLessonDisplay'

export type TeacherLessonGroup = {
  teacherKey: string
  teacherId: number
  teacherName: string
  lessons: LessonDto[]
}

export function getTeacherKey(teacher: LessonDto['teacher']): string {
  return `${teacher.id}:${teacher.displayName}`
}

export function groupLessonsByTeacher(lessons: LessonDto[]): TeacherLessonGroup[] {
  const groups = new Map<string, TeacherLessonGroup>()

  lessons.forEach((lesson) => {
    const teacherKey = getTeacherKey(lesson.teacher)
    const existing = groups.get(teacherKey)

    if (existing) {
      existing.lessons.push(lesson)
      return
    }

    groups.set(teacherKey, {
      teacherKey,
      teacherId: lesson.teacher.id,
      teacherName: lesson.teacher.displayName,
      lessons: [lesson],
    })
  })

  return Array.from(groups.values()).map((group) => ({
    ...group,
    lessons: group.lessons.sort(compareLessonsForDisplay),
  }))
}

export function getUniqueTeacherNames(lessons: LessonDto[]): string[] {
  const names = new Set<string>()

  lessons.forEach((lesson) => {
    names.add(lesson.teacher.displayName)
  })

  return Array.from(names)
}
