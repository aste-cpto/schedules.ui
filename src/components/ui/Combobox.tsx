import { ChevronDown } from 'lucide-react'
import { useRef, useState, useMemo, useEffect } from 'react'
import { useClickOutside } from '~/hooks/useClickOutside'
import { cn } from '~/lib/cn'

export type ComboboxOption = {
  value: string
  label: string
}

type ComboboxProps = {
  label?: string
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  wrapperClassName?: string
  id?: string
  placeholder?: string
}

export const Combobox = ({
  label,
  options,
  value,
  onChange,
  wrapperClassName,
  id,
  placeholder,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(
    () => options.find((o) => o.value === value)?.label ?? value
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  // Sync inputValue when external value changes
  useEffect(() => {
    const matchedOption = options.find((o) => o.value === value)
    setInputValue(matchedOption?.label ?? value)
  }, [value, options])

  useClickOutside(containerRef, () => {
    setOpen(false)
    setInputValue(value) // reset to confirmed value on blur
  }, open)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setOpen(true)
  }

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options
    
    // Show all options if the input value matches the currently selected item's label
    const selectedLabel = options.find((opt) => opt.value === value)?.label ?? value
    if (inputValue === selectedLabel) return options

    const lowerInput = inputValue.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(lowerInput))
  }, [options, inputValue, value])

  const exactMatch = options.find((opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase())

  return (
    <div className={cn('field-group', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="field-label">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative w-full">
        <div
          className={cn(
            'field-select flex w-full items-center justify-between text-left cursor-text focus-within:ring-2 focus-within:ring-primary focus-within:border-primary',
            open && 'ring-2 ring-primary border-primary'
          )}
          onClick={() => setOpen(true)}
        >
          <input
            id={selectId}
            type="text"
            value={open ? inputValue : (options.find(o => o.value === value)?.label ?? value)}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-text-muted"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-text-muted transition-transform cursor-pointer',
              open && 'rotate-180',
            )}
            onClick={(e) => {
              e.stopPropagation()
              setOpen((prev) => !prev)
              if (!open) setInputValue(value)
            }}
            aria-hidden
          />
        </div>

        {open && (
          <ul
            role="listbox"
            className="absolute top-[calc(100%+0.625rem)] z-50 w-full overflow-hidden rounded-md border border-border bg-bg-surface py-1 shadow-md max-h-60 overflow-y-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value

                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        // Use onMouseDown to prevent blur before click
                        e.preventDefault()
                        onChange(option.value)
                        setInputValue(option.label)
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
              })
            ) : null}

            {!exactMatch && inputValue.trim() !== '' && (
              <li role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onChange(inputValue.trim())
                    setInputValue(inputValue.trim())
                    setOpen(false)
                  }}
                  className="flex w-full px-3 py-2 text-left text-sm text-primary font-medium transition-colors hover:bg-bg-muted"
                >
                  Додати новий "{inputValue.trim()}"
                </button>
              </li>
            )}
            
            {filteredOptions.length === 0 && (!inputValue || inputValue.trim() === '') && (
              <li className="px-3 py-2 text-sm text-text-muted">Немає результатів</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
