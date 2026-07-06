import { TableHeader } from '~/components/ui/TableHeader'
import { cn } from '~/lib/cn'
import { RowActionsMenu } from '~/pages/SchedulesPage/components/RowActionsMenu'
import { ScheduleDetailsModal } from '~/pages/SchedulesPage/components/ScheduleDetailsModal/ScheduleDetailsModal'
import { SCHEDULE_TABLE_COLUMNS } from '~/pages/SchedulesPage/config/scheduleTableColumns'
import type { ScheduleRowActionHandlers } from '~/pages/SchedulesPage/config/scheduleRowActions'
import type { Schedule } from '~/types/schedule'
import { renderCell } from '../utils/RenderCell'
import { useScheduleTableState } from '../hooks/useScheduleTableState'

type SchedulesTableProps = {
  schedules: Schedule[]
  rowActions?: ScheduleRowActionHandlers
  onScheduleUpdated?: () => void
}

export const SchedulesTable = ({ schedules, rowActions, onScheduleUpdated }: SchedulesTableProps) => {
  const { isModalOpen, setIsModalOpen, scheduleDto, enhancedActions } = useScheduleTableState(
    schedules,
    rowActions,
  )
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <TableHeader
            columns={SCHEDULE_TABLE_COLUMNS.map((column) => ({
              key: column.key,
              label: column.label,
              className: column.headerClassName,
            }))}
          />
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td
                  colSpan={SCHEDULE_TABLE_COLUMNS.length}
                  className="px-4 py-10 text-center text-sm text-text-secondary"
                >
                  Розкладів не знайдено.
                </td>
              </tr>
            ) : (
              schedules.map((schedule, index) => {
                const inactive = schedule.status === 'неактивний'

                return (
                  <tr
                    key={schedule.id}
                    className={cn(
                      'border-b border-border transition-colors last:border-b-0',
                      inactive
                        ? 'bg-bg-muted/60 text-text-muted'
                        : index % 2 === 0
                          ? 'bg-bg-surface'
                          : 'bg-bg-muted/30',
                      !inactive && 'hover:bg-accent-indigo/5',
                    )}
                  >
                    {SCHEDULE_TABLE_COLUMNS.map((column) => (
                      <td key={column.key} className={column.cellClassName}>
                        {column.key === 'actions' ? (
                          <RowActionsMenu schedule={schedule} actions={enhancedActions} />
                        ) : (
                          renderCell(column.key, schedule, index)
                        )}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ScheduleDetailsModal
        open={isModalOpen}
        schedule={scheduleDto}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onScheduleUpdated}
      />
    </div>
  )
}
