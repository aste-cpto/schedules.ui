export const ScheduleFooter = ({
  dateColumns,
  dailyTotals,
  totalHours,
}: {
  dateColumns: string[]
  dailyTotals: Record<string, number>
  totalHours: number
}) => (
  <tfoot>
    <tr className="border-t border-border bg-bg-muted/20 font-semibold">
      <td
        colSpan={2}
        className="px-4 py-4 text-left text-text-secondary uppercase text-[11px] tracking-wider"
      >
        Всього годин за день:
      </td>
      <td className="px-4 py-3 text-center text-base font-bold tabular-nums text-text">
        {totalHours}
      </td>
      {dateColumns.map((date) => (
        <td key={date} className="px-2 py-3 text-center text-sm tabular-nums text-text">
          {dailyTotals[date] || '—'}
        </td>
      ))}
      <td />
    </tr>
  </tfoot>
)
