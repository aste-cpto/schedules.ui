import { FloatingPortal } from '@floating-ui/react'
import { EllipsisVertical } from 'lucide-react'
import { useRef, useState } from 'react'
import { ConfirmModal } from '~/ui/ConfirmModal'
import { useClickOutside } from '~/hooks/useClickOutside'
import { useFloatingDropdown } from '~/hooks/useFloatingDropdown'
import { mergeRefs } from '~/lib/mergeRefs'
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

type TeacherRowActionsMenuProps = {
  teacher: TeacherItemDto
  actions?: TeacherRowActionHandlers
}

export const TeacherRowActionsMenu = ({ teacher, actions }: TeacherRowActionsMenuProps) => {
  const [open, setOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { refs, floatingStyles } = useFloatingDropdown({
    open,
    gap: MENU_GAP,
    placement: 'bottom-end',
    sameWidth: false,
    width: MENU_WIDTH,
  })

  useClickOutside([triggerRef, menuRef], () => setOpen(false), open)

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
        ref={mergeRefs(triggerRef, refs.setReference)}
        type="button"
        aria-label="Дії"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-muted hover:text-text"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={mergeRefs(menuRef, refs.setFloating)}
            style={{ ...floatingStyles, width: MENU_WIDTH }}
            className="z-50 overflow-hidden rounded-lg border border-border bg-bg-surface py-1 shadow-lg"
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
          </div>
        </FloatingPortal>
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
