import { uk } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { forwardRef, useState } from 'react'
import DatePickerLib from 'react-datepicker'
import { FieldClearButton } from '~/ui/FieldClearButton'
import { cn } from '~/lib/cn'
import { formatDateToDisplay, formatDateToIso, parseIsoDate } from '~/lib/dateUtils'

const UK_WEEKDAY_SHORT: Record<string, string> = {
  неділя: 'Нд',
  понеділок: 'Пн',
  вівторок: 'Вт',
  середа: 'Ср',
  четвер: 'Чт',
  "п'ятниця": 'Пт',
  пʼятниця: 'Пт',
  пятниця: 'Пт',
  субота: 'Сб',
}

function formatWeekDay(day: string): string {
  return UK_WEEKDAY_SHORT[day.toLowerCase()] ?? day.slice(0, 2)
}

type DatePickerInputProps = {
  value?: string
  onClick?: () => void
  placeholder?: string
  onClear?: () => void
  isOpen?: boolean
}

const DatePickerInput = forwardRef<HTMLButtonElement, DatePickerInputProps>(
  ({ value, onClick, placeholder, onClear, isOpen }, ref) => {
    const hasValue = Boolean(value)

    return (
      <div className="datepicker-field">
        <button
          type="button"
          ref={ref}
          onClick={onClick}
          className={cn('datepicker-field__trigger', isOpen && 'datepicker-field__trigger--open')}
        >
          <span
            className={cn(
              'datepicker-field__value',
              !hasValue && 'datepicker-field__value--placeholder',
            )}
          >
            {value || placeholder}
          </span>

          <span className="flex shrink-0 items-center gap-1">
            {hasValue && <FieldClearButton onClick={() => onClear?.()} />}
            <Calendar className="datepicker-field__icon" aria-hidden />
          </span>
        </button>
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
  const [isOpen, setIsOpen] = useState(false)
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const selected = parseIsoDate(value)
  const displayValue = selected ? formatDateToDisplay(selected) : ''

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
        open={isOpen}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
        onChange={(date: Date | null) => onChange(date ? formatDateToIso(date) : '')}
        locale={uk}
        formatWeekDay={formatWeekDay}
        dateFormat="dd.MM.yyyy"
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        calendarClassName="datepicker-theme"
        popperClassName="datepicker-popper"
        customInput={
          <DatePickerInput
            value={displayValue}
            placeholder={placeholder}
            isOpen={isOpen}
            onClear={() => onChange('')}
          />
        }
      />
    </div>
  )
}
