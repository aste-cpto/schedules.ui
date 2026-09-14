import {
  FloatingPortal,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { cloneElement, useState, type ReactElement } from 'react'
import { cn } from '~/lib/cn'

type TooltipProps = {
  content: string
  children: ReactElement
  className?: string
}

export const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [open, setOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  })

  const hover = useHover(context, { move: false, delay: { open: 80, close: 40 } })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role])
  const { setReference, setFloating } = refs

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: setReference, ...(children.props as Record<string, unknown>) }),
      )}
      {open && (
        <FloatingPortal>
          <div
            ref={setFloating}
            style={floatingStyles}
            className={cn(
              'z-[130] max-w-xs rounded-md border border-border bg-bg-surface px-2.5 py-1.5 text-xs font-medium text-text shadow-md',
              className,
            )}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
