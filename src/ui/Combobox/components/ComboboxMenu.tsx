import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '~/lib/cn'
import { COMBOBOX_MENU_Z_INDEX } from '../constants'
import type { ComboboxOption } from '../types'

type ComboboxMenuProps = {
  menuRef: RefObject<HTMLUListElement | null>
  position: { top: number; left: number; width: number }
  value: string
  inputValue: string
  filteredOptions: ComboboxOption[]
  exactMatch?: ComboboxOption
  allowCreate?: boolean
  onSelectOption: (optionValue: string, optionLabel: string) => void
  onCreateOption: (value: string) => void
}

export const ComboboxMenu = ({
  menuRef,
  position,
  value,
  inputValue,
  filteredOptions,
  exactMatch,
  allowCreate = false,
  onSelectOption,
  onCreateOption,
}: ComboboxMenuProps) => {
  const trimmedInput = inputValue.trim()
  const showCreateOption = allowCreate && !exactMatch && trimmedInput !== ''
  const showEmptyState =
    filteredOptions.length === 0 && (trimmedInput === '' || !allowCreate)

  return createPortal(
    <ul
      ref={menuRef}
      role="listbox"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      className={cn(
        'fixed max-h-60 overflow-hidden overflow-y-auto rounded-md border border-border bg-bg-surface py-1 shadow-lg',
        COMBOBOX_MENU_Z_INDEX,
      )}
    >
      {filteredOptions.length > 0
        ? filteredOptions.map((option) => {
            const isSelected = option.value === value

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    onSelectOption(option.value, option.label)
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
        : null}

      {showCreateOption && (
        <li role="option" aria-selected={false}>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault()
              onCreateOption(inputValue)
            }}
            className="flex w-full px-3 py-2 text-left text-sm font-medium text-accent-indigo transition-colors hover:bg-bg-muted"
          >
            Додати новий "{trimmedInput}"
          </button>
        </li>
      )}

      {showEmptyState && (
        <li className="px-3 py-2 text-sm text-text-muted">Немає результатів</li>
      )}
    </ul>,
    document.body,
  )
}
