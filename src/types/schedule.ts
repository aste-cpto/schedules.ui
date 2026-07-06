export type ScheduleStatus = 'активний' | 'неактивний'

export interface Schedule {
  id: number
  status: ScheduleStatus
  group: string
  program: string
  start: string
  end: string
  startDateIso: string
  endDateIso: string
  studyProgramId: number
  apiStatus: string
  isBlocked?: boolean
  isTemplate?: boolean
}
