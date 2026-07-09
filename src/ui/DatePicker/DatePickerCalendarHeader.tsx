import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '~/lib/cn'

type DatePickerCalendarHeaderProps = {
  monthDate: Date
  decreaseMonth: () => void
  increaseMonth: () => void
  prevMonthButtonDisabled: boolean
  nextMonthButtonDisabled: boolean
}

export const DatePickerCalendarHeader = ({
  monthDate,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: DatePickerCalendarHeaderProps) => {
  return (
    <div className="datepicker-custom-header">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="datepicker-custom-header__nav"
        aria-label="Попередній місяць"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <span className="datepicker-custom-header__title">
        {format(monthDate, 'LLLL yyyy', { locale: uk })}
      </span>

      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className={cn(
          'datepicker-custom-header__nav',
          nextMonthButtonDisabled && 'datepicker-custom-header__nav--disabled',
        )}
        aria-label="Наступний місяць"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
