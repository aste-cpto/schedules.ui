import { cn } from '~/lib/cn'
import type { StudyProgramSubjectDto } from '~/types/api/studyProgram'
import { TableHeader, type TableHeaderColumn } from '~/ui/TableHeader'

type StudyProgramSubjectsTableProps = {
  subjects: StudyProgramSubjectDto[]
}

const COLUMNS: TableHeaderColumn[] = [
  { key: 'index', label: '№', className: 'w-20 text-center' },
  { key: 'name', label: 'Предмети', className: 'text-left' },
  { key: 'hours', label: 'К-ть год.', className: 'w-28 text-center' },
]

export const StudyProgramSubjectsTable = ({ subjects }: StudyProgramSubjectsTableProps) => {
  const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <TableHeader columns={COLUMNS} variant="secondary" />

          <tbody>
            {subjects.map((subject, index) => (
              <tr
                key={subject.id}
                className={cn(
                  'border-b border-border transition-colors last:border-b-0 hover:bg-bg-muted/10',
                  index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/30',
                )}
              >
                <td className="px-4 py-3 text-center tabular-nums text-text-secondary">
                  {index + 1}
                </td>
                <td className="px-4 py-3 leading-snug font-medium text-text">{subject.name}</td>
                <td className="px-4 py-3 text-center tabular-nums font-semibold text-text">
                  {subject.hours}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t border-border bg-bg-muted/20">
              <td
                colSpan={2}
                className="pl-24 py-3 text-left text-text-secondary uppercase font-medium"
              >
                Загальна кількість годин:
              </td>
              <td className="px-4 py-3 text-center text-base font-bold tabular-nums text-text">
                {totalHours}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
