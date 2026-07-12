import { cn } from '~/lib/cn'
import { formatDateDisplay } from '~/utils/dateHelpers'
import {
  getDateColumnStyle,
  getStickyLeftStyle,
  getStickyRightStyle,
} from '../config/scheduleTableLayout'

type ScheduleTableHeaderProps = {
  visibleDateColumns: string[]
}

const STICKY_HEADER_CLASS = 'sticky z-20 bg-bg-muted'

export const ScheduleTableHeader = ({ visibleDateColumns }: ScheduleTableHeaderProps) => (
  <thead className="sticky top-0 z-30">
    <tr className="border-b border-border bg-bg-muted text-left text-text-secondary">
      <th
        style={getStickyLeftStyle('index')}
        className={cn(
          STICKY_HEADER_CLASS,
          'px-4 py-3 text-center font-semibold border-r border-border/50',
        )}
      >
        №
      </th>
      <th
        style={getStickyLeftStyle('subject')}
        className={cn(
          STICKY_HEADER_CLASS,
          'whitespace-normal px-3 py-3 text-left font-semibold border-r border-border/50',
        )}
      >
        Предмети
      </th>
      <th
        style={getStickyLeftStyle('hours')}
        className={cn(
          STICKY_HEADER_CLASS,
          'px-4 py-3 text-center font-semibold border-r border-border/50 shadow-[4px_0_6px_-4px_rgba(0,0,0,0.08)]',
        )}
      >
        К-ть год.
      </th>

      {visibleDateColumns.map((date) => (
        <th
          key={date}
          style={getDateColumnStyle()}
          className="bg-bg-muted px-2 py-2 text-center text-xs font-semibold"
        >
          {formatDateDisplay(date)}
        </th>
      ))}

      <th
        style={getStickyRightStyle()}
        className={cn(
          STICKY_HEADER_CLASS,
          'px-3 py-3 text-left font-semibold whitespace-normal shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.08)]',
        )}
      >
        Викладачі
      </th>
    </tr>
  </thead>
)
