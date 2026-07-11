export const VALIDATION_REQUIRED_FIELDS = "Заповніть усі обов'язкові поля коректно"

export const VALIDATION_SUBJECT_HOURS_EXCEEDED =
  'Перевищено ліміт годин для цього предмета. Перевірте розподіл годин у розкладі.'

export const VALIDATION_DUPLICATE_PAIR_IN_CELL = 'Не можна мати дві пари з однаковим номером.'

export const VALIDATION_DUPLICATE_PAIR_ON_DAY =
  'У цей день вже є пара з таким номером в іншому предметі.'

export function formatSubjectHoursHint(usedHours: number, plannedHours: number): string {
  return `${usedHours} з ${plannedHours} год.`
}

export function formatSubjectRemainingHint(remainingHours: number): string {
  if (remainingHours > 0) {
    return `Залишилось ${remainingHours} год.`
  }

  if (remainingHours === 0) {
    return 'Години розписані'
  }

  return `Перевищено на ${Math.abs(remainingHours)} год.`
}
