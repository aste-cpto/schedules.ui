import type { LessonType } from '~/types/api/lesson'

export const LESSON_TYPE_OPTIONS = [
  { value: 'Pair', label: 'Пара', shortCode: 'П' },
  { value: 'Training', label: 'Виробниче навчання', shortCode: 'ВН' },
  { value: 'Practice', label: 'Виробнича практика', shortCode: 'ВП' },
  { value: 'Consultation', label: 'Консультація', shortCode: 'К' },
  { value: 'Qualification', label: 'Кваліфікаційна атестація', shortCode: 'КА' },
] as const satisfies ReadonlyArray<{ value: LessonType; label: string; shortCode: string }>

const LESSON_TYPE_BY_INDEX: LessonType[] = LESSON_TYPE_OPTIONS.map((option) => option.value)

export const DEFAULT_LESSON_TYPE: LessonType = LESSON_TYPE_OPTIONS[0].value

export function normalizeLessonType(type: number | string | null | undefined): LessonType {
  if (typeof type === 'string') {
    const match = LESSON_TYPE_OPTIONS.find((option) => option.value === type)
    if (match) return match.value
  }

  const numericType = Number(type)
  if (Number.isFinite(numericType) && LESSON_TYPE_BY_INDEX[numericType]) {
    return LESSON_TYPE_BY_INDEX[numericType]
  }

  return DEFAULT_LESSON_TYPE
}

export function isPairLessonType(type: LessonType | number | string | null | undefined): boolean {
  return normalizeLessonType(type) === 'Pair'
}

export function getLessonTypeLabel(type: number | string): string {
  const normalized = normalizeLessonType(type)
  return LESSON_TYPE_OPTIONS.find((option) => option.value === normalized)?.label ?? String(type)
}

export function getLessonTypeShortCode(type: number | string): string {
  const normalized = normalizeLessonType(type)
  return LESSON_TYPE_OPTIONS.find((option) => option.value === normalized)?.shortCode ?? '?'
}
