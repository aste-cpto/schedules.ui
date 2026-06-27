import { uk } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { forwardRef } from 'react'
import DatePickerLib from 'react-datepicker'
import { FieldClearButton } from '~/components/ui/FieldClearButton'
import { cn } from '~/lib/cn'
import { formatDateToIso, parseIsoDate } from '~/lib/dateUtils'
import 'react-datepicker/dist/react-datepicker.css'

type DatePickerInputProps = {
  value?: string
  onClick?: () => void
  placeholder?: string
  onClear?: () => void
}

const DatePickerInput = forwardRef<HTMLButtonElement, DatePickerInputProps>(
  ({ value, onClick, placeholder, onClear }, ref) => {
    const hasValue = Boolean(value)

    return (
      <div className="field-input flex w-full items-center !p-0">
        <button
          type="button"
          ref={ref}
          onClick={onClick}
          className="flex min-h-[42px] flex-1 items-center px-3 text-left text-sm"
        >
          <span className={cn(hasValue ? 'text-text' : 'text-text-muted')}>
            {value || placeholder}
          </span>
          {!hasValue && <Calendar className="h-4 w-4 shrink-0 text-text-muted absolute right-4" />}
        </button>

        {hasValue && (
          <FieldClearButton
            onClick={() => {
              onClear?.()
            }}
            className="mr-3"
          />
        )}
      </div>
    )
  },
)

DatePickerInput.displayName = 'DatePickerInput'

type DatePickerProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  wrapperClassName?: string
  minDate?: Date
  maxDate?: Date
  id?: string
}

export const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'Оберіть дату',
  wrapperClassName,
  minDate,
  maxDate,
  id,
}: DatePickerProps) => {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const selected = parseIsoDate(value)

  return (
    <div className={cn('field-group', wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
      )}

      <DatePickerLib
        id={fieldId}
        wrapperClassName="w-full"
        selected={selected}
        onChange={(date: Date | null) => onChange(date ? formatDateToIso(date) : '')}
        locale={uk}
        dateFormat="dd.MM.yyyy"
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        calendarClassName="datepicker-theme"
        popperClassName="datepicker-popper"
        customInput={<DatePickerInput placeholder={placeholder} onClear={() => onChange('')} />}
      />
    </div>
  )
}
