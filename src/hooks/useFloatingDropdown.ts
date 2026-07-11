import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from '@floating-ui/react'
import { useMemo } from 'react'

type UseFloatingDropdownOptions = {
  open: boolean
  gap?: number
  placement?: Placement
  /** Match dropdown width to trigger element */
  sameWidth?: boolean
  /** Fixed width (used with sameWidth or as override in size middleware) */
  width?: number
}

export function useFloatingDropdown({
  open,
  gap = 10,
  placement = 'bottom-start',
  sameWidth = true,
  width,
}: UseFloatingDropdownOptions) {
  const middleware = useMemo(
    () => [
      offset(gap),
      flip({ padding: gap }),
      shift({ padding: gap }),
      ...(sameWidth
        ? [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${width ?? rects.reference.width}px`,
                })
              },
            }),
          ]
        : []),
    ],
    [gap, sameWidth, width],
  )

  return useFloating({
    open,
    placement,
    whileElementsMounted: autoUpdate,
    middleware,
  })
}
