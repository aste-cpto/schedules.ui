import { REPORT_MONTHS } from '~/pages/ReportsPage/config/reportMonths'
import { cn } from '~/lib/cn'
import { DataTable } from '~/ui/DataTable'
import { Tooltip } from '~/ui/Tooltip'
import type { TeacherLoadReportItemDto, TeacherLoadReportTotalsDto } from '~/types/api/report'

type ReportsTableProps = {
  items: TeacherLoadReportItemDto[]
  totals: TeacherLoadReportTotalsDto
}

const formatHours = (hours: number) => (hours > 0 ? String(hours) : '—')

const quarterTone = (quarter: number) =>
  quarter % 2 === 0 ? 'bg-accent-indigo/[0.03]' : 'bg-transparent'

const quarterEdge = (monthIndex: number) =>
  monthIndex === 2 || monthIndex === 5 || monthIndex === 8 ? 'border-r border-border/70' : ''

const OVER_NORM_TOOLTIP = 'Використано годин більше за норму'

const HoursPair = ({
  usedHours,
  totalHours,
  overNorm,
}: {
  usedHours: number
  totalHours: number
  overNorm?: boolean
}) => {
  const content = (
    <span className="inline-flex items-baseline justify-center gap-1.5">
      <span className={cn('font-semibold', overNorm ? 'text-rose-600' : 'text-text')}>
        {formatHours(usedHours)}
      </span>
      <span className="text-text-muted">/</span>
      <span className={cn(overNorm ? 'text-rose-500' : 'text-text-secondary')}>
        {formatHours(totalHours)}
      </span>
    </span>
  )

  if (!overNorm) return content

  return (
    <Tooltip content={OVER_NORM_TOOLTIP}>
      <button type="button" className="cursor-help">
        {content}
      </button>
    </Tooltip>
  )
}

export const ReportsTable = ({ items, totals }: ReportsTableProps) => {
  return (
    <DataTable className="border-border/60 shadow-none">
      <div className="scrollbar-hidden h-[30rem] overflow-auto">
        <table className="w-full min-w-[56rem] border-separate border-spacing-0 text-[0.9375rem]">
          <thead className="sticky top-0 z-30">
            <tr className="bg-bg-muted text-left text-text-secondary">
              <th className="sticky left-0 z-40 min-w-[12.5rem] border-b border-border bg-bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Викладач
              </th>
              {REPORT_MONTHS.map((month) => (
                <th
                  key={month.monthIndex}
                  className={cn(
                    'min-w-[3.25rem] border-b border-border px-1 py-3 text-center text-xs font-semibold uppercase tracking-wide',
                    quarterTone(month.quarter),
                    quarterEdge(month.monthIndex),
                  )}
                >
                  {month.label}
                </th>
              ))}
              <th className="sticky right-0 z-40 min-w-[8.5rem] border-b border-l border-border bg-bg-muted px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                Викор. / Норма
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const overNorm = item.usedHours > item.totalHours
              const rowBg = index % 2 === 0 ? 'bg-bg-surface' : 'bg-bg-muted/35'

              return (
                <tr key={item.teacherId} className="group hover:bg-accent-indigo/[0.04]">
                  <td
                    className={cn(
                      'sticky left-0 z-20 border-b border-border/40 px-4 py-3 font-medium text-text',
                      rowBg,
                      'group-hover:bg-accent-indigo/[0.04]',
                    )}
                  >
                    {item.teacherName}
                  </td>
                  {REPORT_MONTHS.map((month) => {
                    const hours = item.monthlyHours[month.monthIndex] ?? 0

                    return (
                      <td
                        key={month.monthIndex}
                        className={cn(
                          'border-b border-border/40 px-1 py-3 text-center tabular-nums',
                          rowBg,
                          quarterTone(month.quarter),
                          quarterEdge(month.monthIndex),
                          hours === 0 ? 'text-text-muted/70' : 'text-text-secondary',
                          'group-hover:bg-accent-indigo/[0.04]',
                        )}
                      >
                        {formatHours(hours)}
                      </td>
                    )
                  })}
                  <td
                    className={cn(
                      'sticky right-0 z-20 border-b border-l border-border/40 px-3 py-3 text-center',
                      rowBg,
                      'group-hover:bg-accent-indigo/[0.04]',
                    )}
                  >
                    <HoursPair
                      usedHours={item.usedHours}
                      totalHours={item.totalHours}
                      overNorm={overNorm}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>

          <tfoot className="sticky bottom-0 z-30">
            <tr>
              <td className="sticky left-0 z-40 border-t border-border bg-bg-muted px-4 py-3 font-semibold text-text">
                Усього, год.
              </td>
              {REPORT_MONTHS.map((month) => (
                <td
                  key={month.monthIndex}
                  className={cn(
                    'border-t border-border bg-bg-muted px-1 py-3 text-center font-semibold tabular-nums text-text',
                    quarterEdge(month.monthIndex),
                  )}
                >
                  {formatHours(totals.monthlyHours[month.monthIndex] ?? 0)}
                </td>
              ))}
              <td className="sticky right-0 z-40 border-t border-l border-border bg-bg-muted px-3 py-3 text-center">
                <HoursPair usedHours={totals.usedHours} totalHours={totals.totalHours} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </DataTable>
  )
}
