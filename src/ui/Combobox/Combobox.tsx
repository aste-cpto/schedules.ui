import { ChevronDown } from 'lucide-react'
import { cn } from '~/lib/cn'
import { useCombobox } from './hooks/useCombobox'
import type { ComboboxOption } from './types'

export type { ComboboxOption } from './types'

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
  const {
    open,
    containerRef,
    selectId,
    filteredOptions,
    exactMatch,
    inputValue,
    displayValue,
    actions,
  } = useCombobox({ options, value, onChange, id, label })

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
            'field-select flex w-full cursor-text items-center justify-between text-left focus-within:border-primary focus-within:ring-2 focus-within:ring-primary',
            open && 'border-primary ring-2 ring-primary',
          )}
          onClick={actions.openDropdown}
        >
          <input
            id={selectId}
            type="text"
            value={displayValue}
            onChange={actions.handleInputChange}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none placeholder:text-text-muted"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 cursor-pointer text-text-muted transition-transform',
              open && 'rotate-180',
            )}
            onClick={(event) => {
              event.stopPropagation()
              actions.toggleDropdown()
            }}
            aria-hidden
          />
        </div>

        {open && (
          <ul
            role="listbox"
            className="absolute top-[calc(100%+0.625rem)] z-50 max-h-60 w-full overflow-hidden overflow-y-auto rounded-md border border-border bg-bg-surface py-1 shadow-md"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value

                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onMouseDown={(event) => {
                        event.preventDefault()
                        actions.selectOption(option.value, option.label)
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
                  onMouseDown={(event) => {
                    event.preventDefault()
                    actions.createOption(inputValue)
                  }}
                  className="flex w-full px-3 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-bg-muted"
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
