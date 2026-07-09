import { Pencil, Trash2, type LucideIcon } from 'lucide-react'
import type { TeacherItemDto } from '~/types/api/teacher'

export type TeacherRowActionHandlers = {
  onEdit: (teacher: TeacherItemDto) => void
  onDelete: (id: number) => void
}

export type TeacherRowMenuItem = {
  label: string
  icon: LucideIcon
  iconClassName?: string
  tone?: 'default' | 'danger'
  disabled?: boolean
  onClick: () => void
}

export const defaultTeacherRowHandlers: TeacherRowActionHandlers = {
  onEdit: (teacher) => console.log('edit', teacher.id),
  onDelete: (id) => console.log('delete', id),
}

export function getTeacherRowActions(
  teacher: TeacherItemDto,
  handlers: TeacherRowActionHandlers = defaultTeacherRowHandlers,
): TeacherRowMenuItem[] {
  return [
    {
      label: 'Редагувати',
      icon: Pencil,
      onClick: () => handlers.onEdit(teacher),
    },
    {
      label: 'Видалити',
      icon: Trash2,
      iconClassName: 'h-4 w-4 shrink-0 text-rose-500/80',
      tone: 'danger',
      disabled: true,
      onClick: () => handlers.onDelete(teacher.id),
    },
  ]
}
