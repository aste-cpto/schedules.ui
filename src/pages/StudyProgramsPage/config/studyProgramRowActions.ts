import { Eye, Pencil, Trash2, type LucideIcon } from 'lucide-react'
import type { StudyProgramShortDto } from '~/types/api/studyProgram'

export type StudyProgramRowActionHandlers = {
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export type StudyProgramRowMenuItem = {
  label: string
  icon: LucideIcon
  iconClassName?: string
  tone?: 'default' | 'danger'
  disabled?: boolean
  onClick: () => void
}

export const defaultStudyProgramRowHandlers: StudyProgramRowActionHandlers = {
  onView: (id) => console.log('view', id),
  onEdit: (id) => console.log('edit', id),
  onDelete: (id) => console.log('delete', id),
}

export function getStudyProgramRowActions(
  program: StudyProgramShortDto,
  handlers: StudyProgramRowActionHandlers = defaultStudyProgramRowHandlers,
): StudyProgramRowMenuItem[] {
  return [
    {
      label: 'Переглянути деталі',
      icon: Eye,
      onClick: () => handlers.onView(program.id),
    },
    {
      label: 'Редагувати',
      icon: Pencil,
      onClick: () => handlers.onEdit(program.id),
    },
    {
      label: 'Видалити',
      icon: Trash2,
      iconClassName: 'h-4 w-4 shrink-0 text-rose-500/80',
      tone: 'danger',
      disabled: true,
      onClick: () => handlers.onDelete(program.id),
    },
  ]
}
