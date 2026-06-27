/** Локальна фільтрація — тільки для mock-режиму. З API все робить GET /study-programs. */
import { paginateSchedules } from '~/lib/scheduleFilters'
import type { StudyProgramShortDto, StudyProgramsListParams } from '~/types/api/studyProgram'

export function filterStudyPrograms(
  studyPrograms: StudyProgramShortDto[],
  params: StudyProgramsListParams,
): StudyProgramShortDto[] {
  const search = params.search?.trim().toLowerCase()
  if (!search) return studyPrograms

  return studyPrograms.filter((program) => program.name.toLowerCase().includes(search))
}

export function paginateStudyPrograms(
  items: StudyProgramShortDto[],
  page = 1,
  pageRecords = 20,
) {
  return paginateSchedules(items, page, pageRecords)
}
