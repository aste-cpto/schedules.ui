import { FloatingPortal } from '@floating-ui/react'
import { ChevronDown, Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { useClickOutside } from '~/hooks/useClickOutside'
import { useFloatingDropdown } from '~/hooks/useFloatingDropdown'
import { mergeRefs } from '~/lib/mergeRefs'
import { cn } from '~/lib/cn'

export type MultiSelectOption = {
  value: string
  label: string
}

type MultiSelectProps = {
  label?: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  wrapperClassName?: string
  id?: string
  disabled?: boolean
  placeholder?: string
}

export const MultiSelect = ({
  label,
  options,
  value,
  onChange,
  wrapperClassName,
  id,
  disabled,
  placeholder = 'Оберіть...'
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  const { refs, floatingStyles } = useFloatingDropdown({ open, gap: 10 })
  useClickOutside([containerRef, triggerRef, menuRef], () => setOpen(false), open)

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label)
    .join(', ')

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className={cn('field-group', wrapperClassName, disabled && 'opacity-60 cursor-not-allowed')}>
      {label && <label id={`${selectId}-label`} className="field-label">{label}</label>}
      <div ref={containerRef} className="relative w-full min-w-0">
        <button
          ref={mergeRefs(triggerRef, refs.setReference)}
          type="button"
          onClick={() => !disabled && setOpen((prev) => !prev)}
          disabled={disabled}
          className={cn(
            'field-select flex h-[42px] w-full min-w-0 items-center justify-between gap-2 overflow-hidden text-left',
            open && 'border-border-strong ring-2 ring-text/5',
          )}
        >
          <span className="min-w-0 flex-1 truncate text-sm">
            {value.length > 0 ? selectedLabels : <span className="text-text-muted">{placeholder}</span>}
          </span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-text-muted transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <FloatingPortal>
            <ul
              ref={mergeRefs(menuRef, refs.setFloating)}
              style={floatingStyles}
              className="z-[120] max-h-60 min-w-[200px] overflow-hidden overflow-y-auto rounded-md border border-border bg-bg-surface py-1 shadow-lg"
            >
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        handleToggle(option.value)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text transition-colors hover:bg-bg-muted"
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        isSelected ? "bg-accent-indigo border-accent-indigo text-white" : "border-border-strong"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span className={cn(isSelected && 'font-semibold')}>{option.label}</span>
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
