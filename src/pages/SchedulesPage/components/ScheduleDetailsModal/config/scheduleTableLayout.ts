export const SCHEDULE_DAYS_PER_PAGE = 7

const INDEX_WIDTH = 40
const SUBJECT_WIDTH = 140
const HOURS_WIDTH = 70
const TEACHERS_WIDTH = 140

export const SCHEDULE_TABLE_COLUMNS = {
  index: { width: INDEX_WIDTH, left: 0 },
  subject: { width: SUBJECT_WIDTH, left: INDEX_WIDTH },
  hours: { width: HOURS_WIDTH, left: INDEX_WIDTH + SUBJECT_WIDTH },
  date: { width: 110 },
  teachers: { width: TEACHERS_WIDTH },
} as const

type StickyLeftColumn = keyof Pick<typeof SCHEDULE_TABLE_COLUMNS, 'index' | 'subject' | 'hours'>

export function getStickyLeftStyle(column: StickyLeftColumn) {
  const { width, left } = SCHEDULE_TABLE_COLUMNS[column]

  return {
    left,
    width,
    minWidth: width,
    maxWidth: width,
  }
}

export function getStickyRightStyle() {
  const { width } = SCHEDULE_TABLE_COLUMNS.teachers

  return {
    right: 0,
    width,
    minWidth: width,
    maxWidth: width,
  }
}

export function getDateColumnStyle() {
  const { width } = SCHEDULE_TABLE_COLUMNS.date

  return {
    width,
    minWidth: width,
    maxWidth: width,
  }
}

export function getStickyLeftSpanStyle(columns: Array<'index' | 'subject'>) {
  const width = columns.reduce((sum, column) => sum + SCHEDULE_TABLE_COLUMNS[column].width, 0)

  return {
    left: 0,
    width,
    minWidth: width,
    maxWidth: width,
  }
}
