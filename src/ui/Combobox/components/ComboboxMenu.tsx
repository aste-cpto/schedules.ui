import { FloatingPortal } from '@floating-ui/react'
import type { CSSProperties, RefObject } from 'react'
import { mergeRefs } from '~/lib/mergeRefs'
import { cn } from '~/lib/cn'
import { COMBOBOX_MENU_Z_INDEX } from '../constants'
import type { ComboboxOption } from '../types'

type ComboboxMenuProps = {
  menuRef: RefObject<HTMLUListElement | null>
  setFloating: (node: HTMLUListElement | null) => void
  floatingStyles: CSSProperties
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
  setFloating,
  floatingStyles,
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

  return (
    <FloatingPortal>
      <ul
        ref={mergeRefs(menuRef, setFloating)}
        role="listbox"
        style={floatingStyles}
        className={cn(
          'max-h-60 overflow-hidden overflow-y-auto rounded-md border border-border bg-bg-surface py-1 shadow-lg',
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
      </ul>
    </FloatingPortal>
  )
}
