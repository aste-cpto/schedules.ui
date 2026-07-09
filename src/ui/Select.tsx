import { ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'
import { useClickOutside } from '~/hooks/useClickOutside'
import { cn } from '~/lib/cn'

export type SelectOption = {
  value: string
  label: string
}

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
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const selectedOption = options.find((option) => option.value === value)

  useClickOutside(containerRef, () => setOpen(false), open)

  return (
    <div className={cn('field-group', wrapperClassName, disabled && 'opacity-60 cursor-not-allowed')}>
      {label && (
        <label id={`${selectId}-label`} className="field-label">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          id={selectId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          disabled={disabled}
          className={cn("field-select flex w-full items-center justify-between text-left", disabled && "cursor-not-allowed")}
        >
          <span>{selectedOption?.label ?? value}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-text-muted transition-transform',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </button>

        {open && (
          <ul
            role="listbox"
            aria-labelledby={label ? `${selectId}-label` : undefined}
            className="absolute top-[calc(100%+0.625rem)] z-50 w-full overflow-hidden rounded-md border border-border bg-bg-surface py-1 shadow-md"
          >
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
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
        )}
      </div>
    </div>
  )
}
