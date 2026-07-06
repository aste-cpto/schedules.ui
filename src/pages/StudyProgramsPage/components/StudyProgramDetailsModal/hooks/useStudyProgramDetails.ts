import { useEffect, useState } from 'react'
import { studyProgramsService } from '~/services/studyProgramsService'
import type { StudyProgramDetailsDto } from '~/types/api/studyProgram'

export const useStudyProgramDetails = (open: boolean, programId: number | null) => {
  const [details, setDetails] = useState<StudyProgramDetailsDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !programId) {
      setDetails(null)
      setError(null)
      return
    }

    const loadDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await studyProgramsService.getById(programId)
        const sortedSubjects = [...data.subjects].sort((a, b) => a.order - b.order)
        setDetails({ ...data, subjects: sortedSubjects })
      } catch {
        setError('Не вдалося завантажити деталі програми')
      } finally {
        setLoading(false)
      }
    }

    void loadDetails()
  }, [open, programId])

  return { details, loading, error }
}
