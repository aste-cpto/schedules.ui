import { Pencil, Trash2, type LucideIcon } from 'lucide-react'
import type { Schedule } from '~/types/schedule'

export type ScheduleRowActionHandlers = {
  onEdit: (id: number) => void
  onTrainingTypes: (id: number) => void
  onToggleBlock: (id: number) => void
  onTemplate: (id: number) => void
  onExport: (id: number) => void
  onDelete: (id: number) => void
}

export type ScheduleRowMenuItem = {
  label: string
  icon: LucideIcon
  iconClassName?: string
  tone?: 'default' | 'danger'
  onClick: () => void
}

export const defaultScheduleRowHandlers: ScheduleRowActionHandlers = {
  onEdit: (id) => console.log('edit', id),
  onTrainingTypes: (id) => console.log('training-types', id),
  onToggleBlock: (id) => console.log('toggle-block', id),
  onTemplate: (id) => console.log('template', id),
  onExport: (id) => console.log('export', id),
  onDelete: (id) => console.log('delete', id),
}

export function getScheduleRowActions(
  schedule: Schedule,
  handlers: ScheduleRowActionHandlers = defaultScheduleRowHandlers,
): ScheduleRowMenuItem[] {
  return [
    {
      label: 'Переглянути та редагувати',
      icon: Pencil,
      onClick: () => handlers.onEdit(schedule.id),
    },
    /*
    {
      label: schedule.isBlocked ? 'Розблокувати' : 'Заблокувати',
      icon: Lock,
      onClick: () => handlers.onToggleBlock(schedule.id),
    },
    {
      label: 'Проект за шаблоном',
      icon: LayoutTemplate,
      onClick: () => handlers.onTemplate(schedule.id),
    },
    {
      label: 'Експорт в Excel',
      icon: Download,
      onClick: () => handlers.onExport(schedule.id),
    },
    */
    {
      label: 'Видалити',
      icon: Trash2,
      iconClassName: 'h-4 w-4 shrink-0 text-rose-500/80',
      tone: 'danger',
      onClick: () => handlers.onDelete(schedule.id),
    },
  ]
}
