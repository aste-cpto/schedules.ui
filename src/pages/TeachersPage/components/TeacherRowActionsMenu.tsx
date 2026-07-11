import { EllipsisVertical } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ConfirmModal } from '~/ui/ConfirmModal'
import { useClickOutside } from '~/hooks/useClickOutside'
import { cn } from '~/lib/cn'
import {
  getTeacherRowActions,
  type TeacherRowActionHandlers,
  type TeacherRowMenuItem,
} from '~/pages/TeachersPage/config/teacherRowActions'
import type { TeacherItemDto } from '~/types/api/teacher'

const MENU_ICON_CLASS = 'h-4 w-4 shrink-0 text-text-muted'
const MENU_WIDTH = 256
const MENU_GAP = 4

type MenuPosition = {
  top: number
  left: number
}

type TeacherRowActionsMenuProps = {
  teacher: TeacherItemDto
  actions?: TeacherRowActionHandlers
}

export const TeacherRowActionsMenu = ({ teacher, actions }: TeacherRowActionsMenuProps) => {
  const [open, setOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside([triggerRef, menuRef], () => setOpen(false), open)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const menuHeight = menuRef.current.offsetHeight
    const spaceBelow = window.innerHeight - triggerRect.bottom
    const openUpward = spaceBelow < menuHeight + MENU_GAP && triggerRect.top > menuHeight + MENU_GAP

    setPosition({
      top: openUpward ? triggerRect.top - menuHeight - MENU_GAP : triggerRect.bottom + MENU_GAP,
      left: Math.min(
        Math.max(MENU_GAP, triggerRect.right - MENU_WIDTH),
        window.innerWidth - MENU_WIDTH - MENU_GAP,
      ),
    })
  }, [open])

  const items = getTeacherRowActions(teacher, actions)

  const handleItemClick = (tone: TeacherRowMenuItem['tone'], onClick: () => void) => {
    if (tone === 'danger') {
      setDeleteModalOpen(true)
    } else {
      onClick()
    }

    setOpen(false)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Дії"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-muted hover:text-text"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 overflow-hidden rounded-lg border border-border bg-bg-surface py-1 shadow-lg"
          >
            {items.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => !item.disabled && handleItemClick(item.tone, item.onClick)}
                  className={cn(
                    'dropdown-menu-item',
                    item.tone === 'danger' && 'dropdown-menu-item--danger',
                  )}
                >
                  <Icon className={item.iconClassName ?? MENU_ICON_CLASS} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>,
          document.body,
        )}

      <ConfirmModal
        open={deleteModalOpen}
        title="Видалення викладача"
        description="Ви впевнені, що хочете видалити цього викладача? Викладач буде деактивований."
        confirmText="Видалити"
        variant="danger"
        onConfirm={() => actions?.onDelete(teacher.id) ?? false}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  )
}
