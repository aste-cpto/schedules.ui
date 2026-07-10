import { uk } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import { forwardRef, useState } from 'react'
import DatePickerLib from 'react-datepicker'
import { FieldClearButton } from '~/ui/FieldClearButton'
import { DatePickerCalendarHeader } from '~/ui/DatePicker/DatePickerCalendarHeader'
import { cn } from '~/lib/cn'
import { formatDateToDisplay, formatDateToIso, parseIsoDate } from '~/lib/dateUtils'

const UK_WEEKDAY_SHORT: Record<string, string> = {
  неділя: 'Нд',
  понеділок: 'Пн',
  вівторок: 'Вт',
  середа: 'Ср',
  четвер: 'Чт',
  пятниця: 'Пт',
  субота: 'Сб',
}

function normalizeWeekdayKey(day: string): string {
  return day.toLowerCase().replace(/[''`ʼ\u2019]/g, '')
}

function formatWeekDay(day: string): string {
  return UK_WEEKDAY_SHORT[normalizeWeekdayKey(day)] ?? day.slice(0, 2)
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
        <div
          className={cn(
            'datepicker-field__trigger relative',
            isOpen && 'datepicker-field__trigger--open',
          )}
        >
          <button
            type="button"
            ref={ref}
            onClick={onClick}
            className="flex w-full min-w-0 items-center justify-between gap-2 border-0 bg-transparent p-0 text-left text-inherit"
          >
            <span
              className={cn(
                'datepicker-field__value',
                !hasValue && 'datepicker-field__value--placeholder',
                hasValue && 'pr-5',
              )}
            >
              {value || placeholder}
            </span>

            <Calendar className="datepicker-field__icon" aria-hidden />
          </button>

          {hasValue && (
            <FieldClearButton
              onClick={() => onClear?.()}
              className="absolute right-9 top-1/2 z-10 -translate-y-1/2"
            />
          )}
        </div>
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
  disabled?: boolean
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
  disabled,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const selected = parseIsoDate(value)
  const displayValue = selected ? formatDateToDisplay(selected) : ''

  return (
    <div className={cn('field-group', wrapperClassName, disabled && 'opacity-60')}>
      {label && (
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
      )}

      <DatePickerLib
        id={fieldId}
        disabled={disabled}
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
        renderCustomHeader={(props) => <DatePickerCalendarHeader {...props} />}
        calendarClassName="datepicker-theme"
        popperClassName="datepicker-popper"
        customInput={
          <DatePickerInput
            value={displayValue}
            placeholder={placeholder}
            isOpen={isOpen}
            onClear={disabled ? undefined : () => onChange('')}
          />
        }
      />
    </div>
  )
}
