import type { TeacherStatus } from '~/types/api/teacher'

export const TEACHER_STATUS = {
  SUSPENDED: 'Suspended',
  ACTIVE: 'Active',
} as const satisfies Record<string, TeacherStatus>

export const TEACHER_STATUS_OPTIONS = [
  { value: TEACHER_STATUS.ACTIVE, label: 'Активний' },
  { value: TEACHER_STATUS.SUSPENDED, label: 'Неактивний' },
]

export function normalizeTeacherStatus(status: TeacherStatus | number | string): TeacherStatus {
  if (status === TEACHER_STATUS.ACTIVE || status === 1 || status === '1') {
    return TEACHER_STATUS.ACTIVE
  }

  return TEACHER_STATUS.SUSPENDED
}

export function getTeacherStatusLabel(status: TeacherStatus | number | string): string {
  return normalizeTeacherStatus(status) === TEACHER_STATUS.ACTIVE ? 'Активний' : 'Неактивний'
}

export function getTeacherStatusBadgeClass(status: TeacherStatus | number | string): string {
  return normalizeTeacherStatus(status) === TEACHER_STATUS.ACTIVE
    ? 'status-badge status-badge--active'
    : 'status-badge status-badge--inactive'
}
