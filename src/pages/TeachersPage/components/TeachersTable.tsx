import { TableHeader } from '~/ui/TableHeader'
import { DataTable } from '~/ui/DataTable'
import { cn } from '~/lib/cn'
import { TeacherRowActionsMenu } from '~/pages/TeachersPage/components/TeacherRowActionsMenu'
import { TeacherStatusBadge } from '~/pages/TeachersPage/components/TeacherStatusBadge'
import {
  TEACHER_TABLE_COLUMNS,
  type TeacherTableColumnKey,
} from '~/pages/TeachersPage/config/teacherTableColumns'
import type { TeacherRowActionHandlers } from '~/pages/TeachersPage/config/teacherRowActions'
import type { TeacherItemDto } from '~/types/api/teacher'

type TeachersTableProps = {
  teachers: TeacherItemDto[]
  rowActions?: TeacherRowActionHandlers
  startIndex?: number
}

function renderCell(
  columnKey: TeacherTableColumnKey,
  teacher: TeacherItemDto,
  rowNumber: number,
  rowActions?: TeacherRowActionHandlers,
) {
  switch (columnKey) {
    case 'index':
      return rowNumber
    case 'displayName':
      return teacher.displayName
    case 'status':
      return <TeacherStatusBadge status={teacher.status} />
    case 'loadHours':
      return teacher.loadHours
    case 'availableHours':
      return teacher.availableHours
    case 'actions':
      return <TeacherRowActionsMenu teacher={teacher} actions={rowActions} />
  }
}

export const TeachersTable = ({ teachers, rowActions, startIndex = 0 }: TeachersTableProps) => {
  return (
    <DataTable>
      <table className="min-w-full border-collapse text-sm">
        <TableHeader
          columns={TEACHER_TABLE_COLUMNS.map((column) => ({
            key: column.key,
            label: column.label,
            className: column.headerClassName,
          }))}
        />
        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td
                colSpan={TEACHER_TABLE_COLUMNS.length}
                className="px-4 py-10 text-center text-sm text-text-secondary"
              >
                Викладачів не знайдено. Спробуйте змінити пошук.
              </td>
            </tr>
          ) : (
            teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className={cn(
                  'border-b border-border transition-colors last:border-b-0',
                  index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/30',
                  'hover:bg-accent-indigo/5',
                )}
              >
                {TEACHER_TABLE_COLUMNS.map((column) => (
                  <td key={column.key} className={column.cellClassName}>
                    {renderCell(column.key, teacher, startIndex + index + 1, rowActions)}
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
