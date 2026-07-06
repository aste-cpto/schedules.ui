import { getTeacherStatusBadgeClass, getTeacherStatusLabel } from '~/pages/TeachersPage/config/teacherStatus'
import type { TeacherStatus } from '~/types/api/teacher'

type TeacherStatusBadgeProps = {
  status: TeacherStatus | number | string
}

export const TeacherStatusBadge = ({ status }: TeacherStatusBadgeProps) => {
  return (
    <span className={getTeacherStatusBadgeClass(status)}>{getTeacherStatusLabel(status)}</span>
  )
}
