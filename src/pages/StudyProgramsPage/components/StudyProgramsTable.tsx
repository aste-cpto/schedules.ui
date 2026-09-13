import { TableHeader } from '~/ui/TableHeader'
import { DataTable } from '~/ui/DataTable'
import { cn } from '~/lib/cn'
import { StudyProgramRowActionsMenu } from '~/pages/StudyProgramsPage/components/StudyProgramRowActionsMenu'
import {
  STUDY_PROGRAM_TABLE_COLUMNS,
  type StudyProgramTableColumnKey,
} from '~/pages/StudyProgramsPage/config/studyProgramTableColumns'
import type { StudyProgramRowActionHandlers } from '~/pages/StudyProgramsPage/config/studyProgramRowActions'
import type { StudyProgramShortDto } from '~/types/api/studyProgram'

type StudyProgramsTableProps = {
  studyPrograms: StudyProgramShortDto[]
  rowActions?: StudyProgramRowActionHandlers
  startIndex?: number
}

function renderCell(
  columnKey: StudyProgramTableColumnKey,
  program: StudyProgramShortDto,
  rowNumber: number,
  rowActions?: StudyProgramRowActionHandlers,
) {
  switch (columnKey) {
    case 'index':
      return rowNumber
    case 'name':
      return program.name
    case 'hours':
      return program.hours
    case 'actions':
      return <StudyProgramRowActionsMenu program={program} actions={rowActions} />
  }
}

export const StudyProgramsTable = ({
  studyPrograms,
  rowActions,
  startIndex = 0,
}: StudyProgramsTableProps) => {
  return (
    <DataTable>
      <table className="min-w-full border-collapse text-sm">
          <TableHeader
            columns={STUDY_PROGRAM_TABLE_COLUMNS.map((column) => ({
              key: column.key,
              label: column.label,
              className: column.headerClassName,
            }))}
          />
          <tbody>
            {studyPrograms.length === 0 ? (
              <tr>
                <td
                  colSpan={STUDY_PROGRAM_TABLE_COLUMNS.length}
                  className="px-4 py-10 text-center text-sm text-text-secondary"
                >
                  Навчальних програм не знайдено. Спробуйте змінити фільтри.
                </td>
              </tr>
            ) : (
              studyPrograms.map((program, index) => (
                <tr
                  key={program.id}
                  className={cn(
                    'border-b border-border transition-colors last:border-b-0',
                    index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/30',
                    'hover:bg-accent-indigo/5',
                  )}
                >
                  {STUDY_PROGRAM_TABLE_COLUMNS.map((column) => (
                    <td key={column.key} className={column.cellClassName}>
                      {renderCell(column.key, program, startIndex + index + 1, rowActions)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
    </DataTable>
  )
}
