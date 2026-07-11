import { ChevronDown } from 'lucide-react'
import type { ChangeEvent, RefObject } from 'react'
import { cn } from '~/lib/cn'

type ComboboxTriggerProps = {
  triggerRef: RefObject<HTMLDivElement | null>
  selectId?: string
  open: boolean
  displayValue: string
  placeholder?: string
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  onOpen: () => void
  onToggle: () => void
}

export const ComboboxTrigger = ({
  triggerRef,
  selectId,
  open,
  displayValue,
  placeholder,
  onInputChange,
  onOpen,
  onToggle,
}: ComboboxTriggerProps) => (
  <div
    ref={triggerRef}
    className={cn(
      'field-select flex h-[42px] w-full min-w-0 cursor-text items-center justify-between gap-2 overflow-hidden text-left focus-within:border-border-strong focus-within:ring-2 focus-within:ring-text/5',
      open && 'border-border-strong ring-2 ring-text/5',
    )}
    onClick={onOpen}
  >
    <input
      id={selectId}
      type="text"
      value={displayValue}
      onChange={onInputChange}
      placeholder={placeholder}
      className="min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-sm text-text outline-none ring-0 placeholder:text-text-muted focus:border-0 focus:outline-none focus:ring-0"
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
        onToggle()
      }}
      aria-hidden
    />
  </div>
)
