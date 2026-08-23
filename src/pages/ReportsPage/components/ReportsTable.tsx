import { REPORT_MONTHS } from '~/pages/ReportsPage/config/reportMonths'
import { cn } from '~/lib/cn'
import { DataTable } from '~/ui/DataTable'
import { TableHeader } from '~/ui/TableHeader'
import type { TeacherLoadReportItemDto, TeacherLoadReportTotalsDto } from '~/types/api/report'

type ReportsTableProps = {
  items: TeacherLoadReportItemDto[]
  totals: TeacherLoadReportTotalsDto
}

const MONTH_CELL_CLASS = 'w-[5rem] px-1 py-2 text-center tabular-nums'
const TEACHER_CELL_CLASS = 'w-48 !px-3 py-2 leading-snug whitespace-nowrap'
const TOTAL_CELL_CLASS = 'w-16 px-1 py-2 text-center font-semibold tabular-nums'

const formatHours = (hours: number) => (hours > 0 ? hours : '—')

export const ReportsTable = ({ items, totals }: ReportsTableProps) => {
  return (
    <DataTable>
      <div className="scrollbar-hidden h-[28rem] overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <TableHeader
            sticky
            columns={[
              {
                key: 'teacher',
                label: 'Викладач',
                className: TEACHER_CELL_CLASS,
              },
              ...REPORT_MONTHS.map((month) => ({
                key: `month-${month.monthIndex}`,
                label: month.label,
                className: 'w-[5rem] !px-1 py-2 text-center text-xs font-semibold leading-tight',
              })),
              {
                key: 'total',
                label: 'Усього',
                className: 'w-16 !px-1 py-2 text-center font-semibold',
              },
            ]}
          />

          <tbody>
            {items.map((item, index) => (
              <tr
                key={item.teacherId}
                className={cn(
                  'border-b border-border transition-colors last:border-b-0',
                  index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/30',
                  'hover:bg-accent-indigo/5',
                )}
              >
                <td className={TEACHER_CELL_CLASS}>{item.teacherName}</td>
                {REPORT_MONTHS.map((month) => (
                  <td key={month.monthIndex} className={MONTH_CELL_CLASS}>
                    {formatHours(item.monthlyHours[month.monthIndex] ?? 0)}
                  </td>
                ))}
                <td className={TOTAL_CELL_CLASS}>{formatHours(item.totalHours)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot className="sticky bottom-0 z-10 bg-bg-muted">
            <tr className="border-t border-border bg-bg-muted">
              <td className={cn(TEACHER_CELL_CLASS, 'bg-bg-muted font-semibold text-text')}>
                Усього, год.
              </td>
              {REPORT_MONTHS.map((month) => (
                <td
                  key={month.monthIndex}
                  className={cn(MONTH_CELL_CLASS, 'bg-bg-muted font-semibold')}
                >
                  {formatHours(totals.monthlyHours[month.monthIndex] ?? 0)}
                </td>
              ))}
              <td className={cn(TOTAL_CELL_CLASS, 'bg-bg-muted text-base')}>
                {formatHours(totals.totalHours)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </DataTable>
  )
}
