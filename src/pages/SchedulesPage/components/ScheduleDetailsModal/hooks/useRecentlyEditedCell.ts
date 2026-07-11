import { useCallback, useEffect, useState } from 'react'
import type { LessonCellContext } from '~/types/api/lesson'

export type RecentlyEditedCell = Pick<LessonCellContext, 'subjectId' | 'date'>

const HIGHLIGHT_DURATION_MS = 2500

export function useRecentlyEditedCell() {
  const [recentlyEditedCell, setRecentlyEditedCell] = useState<RecentlyEditedCell | null>(null)

  useEffect(() => {
    if (!recentlyEditedCell) return

    const timer = window.setTimeout(() => {
      setRecentlyEditedCell(null)
    }, HIGHLIGHT_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [recentlyEditedCell])

  const markRecentlyEdited = useCallback((cell: RecentlyEditedCell) => {
    setRecentlyEditedCell(cell)
  }, [])

  const isRecentlyEdited = useCallback(
    (subjectId: number, date: string) =>
      recentlyEditedCell?.subjectId === subjectId && recentlyEditedCell.date === date,
    [recentlyEditedCell],
  )

  return {
    recentlyEditedCell,
    markRecentlyEdited,
    isRecentlyEdited,
  }
}
