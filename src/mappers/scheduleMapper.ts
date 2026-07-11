import { formatDateToDisplay, parseIsoDate } from '~/lib/dateUtils'
import type {
  ScheduleDetailsApiDto,
  ScheduleDto,
  ScheduleShortDto,
} from '~/types/api/schedule'
import type { Schedule, ScheduleStatus } from '~/types/schedule'

function formatDisplayDate(value: string): string {
  const date = parseIsoDate(value)
  if (!date) return value

  return formatDateToDisplay(date)
}

function mapStatus(status: string | null | undefined): ScheduleStatus {
  if (!status) return 'активний'

  const normalized = status.trim().toLowerCase()

  if (normalized === 'active' || normalized === 'активний') {
    return 'активний'
  }

  return 'неактивний'
}

export function normalizeScheduleDetails(dto: ScheduleDetailsApiDto): ScheduleDto {
  return {
    id: dto.id,
    startDate: dto.startDate,
    endDate: dto.endDate,
    groupName: dto.groupName,
    studyProgramId: dto.studyProgram.id,
    studyProgramName: dto.studyProgram.name,
    subjects: dto.studyProgram.subjects ?? [],
    lessons: dto.lessons,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export function mapScheduleShortToSchedule(dto: ScheduleShortDto): Schedule {
  return {
    id: dto.id,
    status: mapStatus(undefined),
    group: dto.groupName,
    program: dto.studyProgramName,
    start: formatDisplayDate(dto.startDate),
    end: formatDisplayDate(dto.endDate),
    startDateIso: dto.startDate,
    endDateIso: dto.endDate,
    studyProgramId: dto.studyProgramId,
    apiStatus: '',
  }
}

export function mapScheduleToDto(schedule: Schedule): ScheduleDto {
  return {
    id: schedule.id,
    startDate: schedule.startDateIso,
    endDate: schedule.endDateIso,
    groupName: schedule.group,
    status: schedule.apiStatus,
    studyProgramId: schedule.studyProgramId,
    studyProgramName: schedule.program,
  }
}
