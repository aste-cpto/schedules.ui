import { Pencil, Trash2, type LucideIcon } from 'lucide-react'
import type { StudyProgramShortDto } from '~/types/api/studyProgram'

export type StudyProgramRowActionHandlers = {
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export type StudyProgramRowMenuItem = {
  label: string
  icon: LucideIcon
  iconClassName?: string
  tone?: 'default' | 'danger'
  onClick: () => void
}

export const defaultStudyProgramRowHandlers: StudyProgramRowActionHandlers = {
  onEdit: (id) => console.log('edit', id),
  onDelete: (id) => console.log('delete', id),
}

export function getStudyProgramRowActions(
  program: StudyProgramShortDto,
  handlers: StudyProgramRowActionHandlers = defaultStudyProgramRowHandlers,
): StudyProgramRowMenuItem[] {
  return [
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
      onClick: () => handlers.onDelete(program.id),
    },
  ]
}
