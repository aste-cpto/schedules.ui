import type { Schedule } from '~/types/schedule'
import type { ScheduleTableColumnKey } from '../config/scheduleTableColumns'
import { StatusBadge } from '../components/StatusBadge'

export function renderCell(columnKey: ScheduleTableColumnKey, schedule: Schedule, index: number) {
  switch (columnKey) {
    case 'index':
      return index + 1
    case 'status':
      return <StatusBadge status={schedule.status} />
    case 'group':
      return schedule.group
    case 'program':
      return schedule.program
    case 'start':
      return schedule.start
    case 'end':
      return schedule.end
    default:
      return null
  }
}
