export const SCHEDULE_STATUS_OPTIONS = [
  { value: 'Active', label: 'Активний' },
  { value: 'Inactive', label: 'Неактивний' },
] as const

export const DEFAULT_SCHEDULE_STATUS = SCHEDULE_STATUS_OPTIONS[0].value
