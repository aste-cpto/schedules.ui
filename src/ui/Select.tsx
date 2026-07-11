import { FloatingPortal } from '@floating-ui/react'
import { ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'
import { useClickOutside } from '~/hooks/useClickOutside'
import { useFloatingDropdown } from '~/hooks/useFloatingDropdown'
import { mergeRefs } from '~/lib/mergeRefs'
import { cn } from '~/lib/cn'

export type SelectOption = {
  value: string
  label: string
}

const MENU_GAP = 10
const MENU_Z_INDEX = 'z-[120]'

type SelectProps = {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  wrapperClassName?: string
  id?: string
  disabled?: boolean
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  wrapperClassName,
  id,
  disabled,
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const selectedOption = options.find((option) => option.value === value)

  const { refs, floatingStyles } = useFloatingDropdown({ open, gap: MENU_GAP })

  useClickOutside([containerRef, triggerRef, menuRef], () => setOpen(false), open)

  return (
    <div className={cn('field-group', wrapperClassName, disabled && 'opacity-60 cursor-not-allowed')}>
      {label && (
        <label id={`${selectId}-label`} className="field-label">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative w-full min-w-0">
        <button
          ref={mergeRefs(triggerRef, refs.setReference)}
          type="button"
          id={selectId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          disabled={disabled}
          className={cn(
            'field-select flex h-[42px] w-full min-w-0 items-center justify-between gap-2 overflow-hidden text-left',
            open && 'border-border-strong ring-2 ring-text/5',
            disabled && 'cursor-not-allowed',
          )}
        >
          <span className="min-w-0 flex-1 truncate">{selectedOption?.label ?? value}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-text-muted transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </button>

        {open && (
          <FloatingPortal>
            <ul
              ref={mergeRefs(menuRef, refs.setFloating)}
              role="listbox"
              aria-labelledby={label ? `${selectId}-label` : undefined}
              style={floatingStyles}
              className={cn(
                'max-h-60 overflow-hidden overflow-y-auto rounded-md border border-border bg-bg-surface py-1 shadow-lg',
                MENU_Z_INDEX,
              )}
            >
              {options.map((option) => {
                const isSelected = option.value === value

                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault()
                        onChange(option.value)
                        setOpen(false)
                      }}
                      className={cn(
                        'flex w-full px-3 py-2 text-left text-sm text-text transition-colors hover:bg-bg-muted',
                        isSelected && 'font-semibold',
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </FloatingPortal>
        )}
      </div>
    </div>
  )
}
