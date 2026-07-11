import { toApiNumber } from '~/lib/lessonDateUtils'
import { cn } from '~/lib/cn'
import {
  getDateColumnStyle,
  getStickyLeftSpanStyle,
  getStickyLeftStyle,
  getStickyRightStyle,
} from '../config/scheduleTableLayout'

const STICKY_FOOTER_CLASS = 'sticky z-20 bg-bg-muted/20'

export const ScheduleFooter = ({
  visibleDateColumns,
  dailyTotals,
  totalHours,
}: {
  visibleDateColumns: string[]
  dailyTotals: Record<string, number>
  totalHours: number
}) => (
  <tfoot>
    <tr className="border-t border-border bg-bg-muted/20 font-semibold">
      <td
        colSpan={2}
        style={getStickyLeftSpanStyle(['index', 'subject'])}
        className={cn(
          STICKY_FOOTER_CLASS,
          'px-4 py-4 text-left text-[11px] uppercase tracking-wider text-text-secondary border-r border-border/50',
        )}
      >
        Всього годин за день:
      </td>
      <td
        style={getStickyLeftStyle('hours')}
        className={cn(
          STICKY_FOOTER_CLASS,
          'px-4 py-3 text-center text-base font-bold tabular-nums text-text border-r border-border/50 shadow-[4px_0_6px_-4px_rgba(0,0,0,0.08)]',
        )}
      >
        {totalHours}
      </td>
      {visibleDateColumns.map((date) => (
        <td
          key={date}
          style={getDateColumnStyle()}
          className="px-1 py-2 text-center text-sm tabular-nums text-text"
        >
          {dailyTotals[date] ? toApiNumber(dailyTotals[date]) : '—'}
        </td>
      ))}
      <td style={getStickyRightStyle()} className={cn(STICKY_FOOTER_CLASS)} />
    </tr>
  </tfoot>
)
