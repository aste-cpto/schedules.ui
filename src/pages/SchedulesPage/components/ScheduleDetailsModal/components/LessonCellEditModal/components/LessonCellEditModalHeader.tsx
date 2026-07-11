import { formatApiDateToDisplay } from '~/lib/dateUtils'
import { formatSubjectHoursHint } from '~/lib/validationMessages'
import { cn } from '~/lib/cn'

type LessonCellEditModalHeaderProps = {
  date: string
  subjectName?: string
  usedHours?: number
  plannedHours?: number
  isOverLimit?: boolean
}

export const LessonCellEditModalHeader = ({
  date,
  subjectName,
  usedHours,
  plannedHours,
  isOverLimit = false,
}: LessonCellEditModalHeaderProps) => {
  const showHoursHint =
    subjectName && usedHours !== undefined && plannedHours !== undefined && plannedHours > 0

  return (
    <header className="shrink-0 space-y-2 border-b border-border pb-4">
      <h2 className="text-xl font-bold text-accent-indigo">
        Типи навчань станом на {formatApiDateToDisplay(date)}
      </h2>

      {showHoursHint && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-medium text-text">{subjectName}</span>
          <span
            className={cn(
              'rounded-md px-2 py-0.5 font-semibold tabular-nums',
              isOverLimit
                ? 'bg-rose-500/10 text-rose-600'
                : 'bg-accent-indigo/10 text-accent-indigo',
            )}
          >
            {formatSubjectHoursHint(usedHours, plannedHours)}
          </span>
          {isOverLimit && (
            <span className="text-rose-600">Перевищено ліміт годин для предмета</span>
          )}
        </div>
      )}
    </header>
  )
}
