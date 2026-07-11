import { useRef } from 'react'
import { cn } from '~/lib/cn'
import { ComboboxMenu } from './components/ComboboxMenu'
import { ComboboxTrigger } from './components/ComboboxTrigger'
import { useCombobox } from './hooks/useCombobox'
import { useComboboxMenuPosition } from './hooks/useComboboxMenuPosition'
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
  /** When false, only existing options can be selected (no free-text create). */
  allowCreate?: boolean
}

export const Combobox = ({
  label,
  options,
  value,
  onChange,
  wrapperClassName,
  id,
  placeholder,
  allowCreate = false,
}: ComboboxProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  const {
    open,
    containerRef,
    selectId,
    filteredOptions,
    exactMatch,
    inputValue,
    displayValue,
    actions,
  } = useCombobox({
    options,
    value,
    onChange,
    id,
    label,
    triggerRef,
    menuRef,
  })

  const menuPosition = useComboboxMenuPosition(open, triggerRef, displayValue)

  return (
    <div ref={containerRef} className={cn('field-group', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="field-label">
          {label}
        </label>
      )}

      <div className="relative w-full min-w-0">
        <ComboboxTrigger
          triggerRef={triggerRef}
          selectId={selectId}
          open={open}
          displayValue={displayValue}
          placeholder={placeholder}
          onInputChange={actions.handleInputChange}
          onOpen={actions.openDropdown}
          onToggle={actions.toggleDropdown}
        />

        {open && (
          <ComboboxMenu
            menuRef={menuRef}
            position={menuPosition}
            value={value}
            inputValue={inputValue}
            filteredOptions={filteredOptions}
            exactMatch={exactMatch}
            allowCreate={allowCreate}
            onSelectOption={actions.selectOption}
            onCreateOption={actions.createOption}
          />
        )}
      </div>
    </div>
  )
}
