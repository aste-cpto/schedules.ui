import { EllipsisVertical } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ConfirmModal } from '~/ui/ConfirmModal'
import {
  getScheduleRowActions,
  type ScheduleRowActionHandlers,
  type ScheduleRowMenuItem,
} from '~/pages/SchedulesPage/config/scheduleRowActions'
import { useClickOutside } from '~/hooks/useClickOutside'
import { cn } from '~/lib/cn'
import type { Schedule } from '~/types/schedule'

const MENU_ICON_CLASS = 'h-4 w-4 shrink-0 text-text-muted'
const MENU_WIDTH = 256
const MENU_GAP = 4

export const RowActionsMenu = ({
  schedule,
  actions,
}: {
  schedule: Schedule
  actions?: ScheduleRowActionHandlers
}) => {
  const [open, setOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside([triggerRef, menuRef], () => setOpen(false), open)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return
    const triggerRect = triggerRef.current.getBoundingClientRect()
    setPosition({
      top: triggerRect.bottom + MENU_GAP,
      left: Math.max(MENU_GAP, triggerRect.right - MENU_WIDTH),
    })
  }, [open])

  const items = getScheduleRowActions(schedule, actions)

  const handleItemClick = (item: ScheduleRowMenuItem) => {
    if (item.tone === 'danger') {
      setDeleteModalOpen(true)
    } else {
      item.onClick()
    }
    setOpen(false)
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg-muted"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 rounded-lg border border-border bg-bg-surface py-1 shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-bg-muted',
                  item.tone === 'danger' ? 'text-rose-600' : 'text-text',
                )}
              >
                <item.icon className={item.iconClassName ?? MENU_ICON_CLASS} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}

      <ConfirmModal
        open={deleteModalOpen}
        title="Видалення"
        description="Видалити цей розклад?"
        variant="danger"
        onConfirm={() => {
          actions?.onDelete(schedule.id)
          setDeleteModalOpen(false)
        }}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  )
}
