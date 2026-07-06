import { useState, useMemo, useEffect } from 'react'
import type { Schedule } from '~/types/schedule'
import { mapScheduleToDto } from '~/mappers/scheduleMapper'
import {
  defaultScheduleRowHandlers,
  type ScheduleRowActionHandlers,
} from '~/pages/SchedulesPage/config/scheduleRowActions'

export const useScheduleTableState = (
  schedules: Schedule[],
  rowActions?: ScheduleRowActionHandlers,
) => {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const scheduleDto = useMemo(() => {
    if (!selectedSchedule) return null
    return mapScheduleToDto(selectedSchedule)
  }, [selectedSchedule])

  useEffect(() => {
    if (!selectedSchedule) return

    const updated = schedules.find((item) => item.id === selectedSchedule.id)
    if (!updated) return

    if (
      updated.startDateIso !== selectedSchedule.startDateIso ||
      updated.endDateIso !== selectedSchedule.endDateIso ||
      updated.group !== selectedSchedule.group
    ) {
      setSelectedSchedule(updated)
    }
  }, [schedules, selectedSchedule])

  const handleEditClick = (id: number) => {
    const schedule = schedules.find((s) => s.id === id)
    if (schedule) {
      setSelectedSchedule(schedule)
      setIsModalOpen(true)
    }
    rowActions?.onEdit?.(id)
  }

  const enhancedActions: ScheduleRowActionHandlers = {
    onEdit: handleEditClick,
    onTrainingTypes: rowActions?.onTrainingTypes ?? defaultScheduleRowHandlers.onTrainingTypes,
    onToggleBlock: rowActions?.onToggleBlock ?? defaultScheduleRowHandlers.onToggleBlock,
    onTemplate: rowActions?.onTemplate ?? defaultScheduleRowHandlers.onTemplate,
    onExport: rowActions?.onExport ?? defaultScheduleRowHandlers.onExport,
    onDelete: rowActions?.onDelete ?? defaultScheduleRowHandlers.onDelete,
  }

  return {
    isModalOpen,
    setIsModalOpen,
    scheduleDto,
    enhancedActions,
  }
}
