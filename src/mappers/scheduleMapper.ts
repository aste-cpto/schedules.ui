import type { ScheduleDto } from '~/types/api/schedule'
import type { Schedule, ScheduleStatus } from '~/types/schedule'

function formatDisplayDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function mapStatus(status: string): ScheduleStatus {
  const normalized = status.trim().toLowerCase()

  if (normalized === 'active' || normalized === 'активний') {
    return 'активний'
  }

  return 'неактивний'
}

export function mapScheduleDtoToSchedule(dto: ScheduleDto): Schedule {
  return {
    id: dto.id,
    status: mapStatus(dto.status),
    group: dto.groupName,
    program: dto.studyProgram?.name ?? dto.spName ?? '',
    start: formatDisplayDate(dto.startDate),
    end: formatDisplayDate(dto.endDate),
  }
}
