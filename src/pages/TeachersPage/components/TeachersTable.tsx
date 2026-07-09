import { TableHeader } from '~/ui/TableHeader'
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
}

function renderCell(
  columnKey: TeacherTableColumnKey,
  teacher: TeacherItemDto,
  index: number,
  rowActions?: TeacherRowActionHandlers,
) {
  switch (columnKey) {
    case 'index':
      return index + 1
    case 'displayName':
      return teacher.displayName
    case 'status':
      return <TeacherStatusBadge status={teacher.status} />
    case 'loadHours':
      return teacher.loadHours
    case 'actions':
      return <TeacherRowActionsMenu teacher={teacher} actions={rowActions} />
  }
}

export const TeachersTable = ({ teachers, rowActions }: TeachersTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm">
      <div className="overflow-x-auto">
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
                      {renderCell(column.key, teacher, index, rowActions)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
