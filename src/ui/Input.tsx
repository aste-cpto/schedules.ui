import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { FieldClearButton } from '~/ui/FieldClearButton'
import { cn } from '~/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  wrapperClassName?: string
  leadingIcon?: ReactNode
  trailingAction?: ReactNode
  clearable?: boolean
}

export const Input = ({
  label,
  wrapperClassName,
  leadingIcon,
  trailingAction,
  clearable = true,
  className,
  id,
  value,
  defaultValue,
  onChange,
  ...props
}: InputProps) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const hasValue = String(value ?? defaultValue ?? '').length > 0
  const showClear = clearable && hasValue && !trailingAction
  const showLeadingIcon = Boolean(leadingIcon) && !showClear
  const showTrailingAction = Boolean(trailingAction)

  const handleClear = () => {
    onChange?.({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className={cn('field-group', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}

      <div className="relative">
        {showLeadingIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {leadingIcon}
          </span>
        )}

        <input
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          className={cn(
            'field-input',
            showLeadingIcon && 'pl-9',
            (showClear || showTrailingAction) && 'pr-9',
            className,
          )}
          onWheel={(e) => {
            if (props.type === 'number') {
              e.currentTarget.blur()
            }
            props.onWheel?.(e)
          }}
          {...props}
        />

        {showTrailingAction && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {trailingAction}
          </span>
        )}

        {showClear && (
          <FieldClearButton
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          />
        )}
      </div>
    </div>
  )
}
