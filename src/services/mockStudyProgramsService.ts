import { MOCK_STUDY_PROGRAMS } from '~/constants/mockStudyPrograms'
import { filterStudyPrograms, paginateStudyPrograms } from '~/lib/studyProgramFilters'
import type { StudyProgramShortDto, StudyProgramsListParams } from '~/types/api/studyProgram'

const DEFAULT_PAGE_RECORDS = 20

export type MockStudyProgramsListResult = {
  studyPrograms: StudyProgramShortDto[]
  page: number
  pageRecords: number
  pagesCount: number
  total: number
}

export function createMockStudyProgramsSource(): StudyProgramShortDto[] {
  return MOCK_STUDY_PROGRAMS.map((program) => ({ ...program }))
}

export function getMockStudyProgramsList(
  source: StudyProgramShortDto[],
  params?: StudyProgramsListParams,
): MockStudyProgramsListResult {
  const filtered = filterStudyPrograms(source, params ?? {})
  const paginated = paginateStudyPrograms(
    filtered,
    params?.page ?? 1,
    params?.pageRecords ?? DEFAULT_PAGE_RECORDS,
  )

  return {
    studyPrograms: paginated.items,
    page: paginated.page,
    pageRecords: paginated.pageRecords,
    pagesCount: paginated.pagesCount,
    total: paginated.total,
  }
}
