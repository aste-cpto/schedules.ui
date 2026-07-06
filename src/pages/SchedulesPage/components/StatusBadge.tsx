import type { ScheduleStatus } from '~/types/schedule'

const STATUS_LABELS: Record<ScheduleStatus, string> = {
  активний: 'активний',
  неактивний: 'неактивний',
}

const STATUS_BADGE_CLASS: Record<ScheduleStatus, string> = {
  активний: 'status-badge status-badge--active',
  неактивний: 'status-badge status-badge--inactive',
}

type StatusBadgeProps = {
  status: ScheduleStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return <span className={STATUS_BADGE_CLASS[status]}>{STATUS_LABELS[status]}</span>
}
