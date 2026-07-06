import { cn } from '~/lib/cn'
import type { LessonDto } from '~/types/api/lesson'
import { groupLessonsByTeacher } from '~/pages/SchedulesPage/components/ScheduleDetailsModal/utils/groupLessonsByTeacher'

type LessonHoursChipProps = {
  lesson: LessonDto
  isEditing: boolean
  onUpdateLessonHours?: (lessonId: number, hours: number) => void
}

export const LessonHoursChip = ({
  lesson,
  isEditing,
  onUpdateLessonHours,
}: LessonHoursChipProps) => {
  if (isEditing) {
    return (
      <label className="inline-flex items-center gap-0.5 rounded border border-accent-indigo/30 bg-white px-1.5 py-0.5 text-[11px] text-accent-indigo shadow-sm">
        <span className="tabular-nums font-medium">{lesson.order}п/</span>
        <input
          type="number"
          min={1}
          value={lesson.hours}
          onChange={(event) => onUpdateLessonHours?.(lesson.id, Number(event.target.value))}
          className="w-7 border-0 bg-transparent p-0 text-center text-[11px] font-bold tabular-nums outline-none focus:ring-0"
          aria-label={`Години для заняття ${lesson.order}, викладач ${lesson.teacher.displayName}`}
        />
        <span>год</span>
      </label>
    )
  }

  return (
    <span className="inline-block rounded bg-bg-muted/60 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-text-secondary">
      {lesson.order}п/{lesson.hours}год
    </span>
  )
}

type ScheduleLessonCellProps = {
  lessons: LessonDto[]
  isEditing: boolean
  onUpdateLessonHours?: (lessonId: number, hours: number) => void
}

export const ScheduleLessonCell = ({
  lessons,
  isEditing,
  onUpdateLessonHours,
}: ScheduleLessonCellProps) => {
  if (lessons.length === 0) return null

  const teacherGroups = groupLessonsByTeacher(lessons)

  return (
    <div className={cn('flex flex-col', teacherGroups.length > 1 ? 'gap-3' : 'gap-1')}>
      {teacherGroups.map((group) => (
        <div key={group.teacherId} className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            {group.lessons.map((lesson) => (
              <LessonHoursChip
                key={lesson.id}
                lesson={lesson}
                isEditing={isEditing}
                onUpdateLessonHours={onUpdateLessonHours}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
