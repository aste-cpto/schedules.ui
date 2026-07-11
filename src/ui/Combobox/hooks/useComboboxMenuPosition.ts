import { useLayoutEffect, useState, type RefObject } from 'react'
import { COMBOBOX_MENU_GAP } from '../constants'

type MenuPosition = {
  top: number
  left: number
  width: number
}

export function useComboboxMenuPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  repositionKey: unknown,
): MenuPosition {
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const rect = triggerRef.current.getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + COMBOBOX_MENU_GAP,
      left: rect.left,
      width: rect.width,
    })
  }, [open, triggerRef, repositionKey])

  return menuPosition
}
