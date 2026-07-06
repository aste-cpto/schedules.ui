import { useEffect, useState } from 'react'
import { ModalLayout } from '~/components/ui/ModalLayout'
import { useToast } from '~/components/ui/toast/useToast'
import { getErrorMessage } from '~/lib/formatApiError'
import { studyProgramsService } from '~/services/studyProgramsService'
import type { StudyProgramDetailsDto } from '~/types/api/studyProgram'
import { StudyProgramSubjectsTable } from './components/StudyProgramSubjectsTable'
import { Button } from '~/components/ui/Button'

type StudyProgramDetailsModalProps = {
  open: boolean
  programId: number | null
  onClose: () => void
}

export const StudyProgramDetailsModal = ({
  open,
  programId,
  onClose,
}: StudyProgramDetailsModalProps) => {
  const toast = useToast()
  const [details, setDetails] = useState<StudyProgramDetailsDto | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !programId) {
      setDetails(null)
      return
    }

    const loadDetails = async () => {
      setLoading(true)

      try {
        const data = await studyProgramsService.getById(programId)

        setDetails({
          ...data,
          subjects: [...data.subjects].sort((a, b) => a.order - b.order),
        })
      } catch (err) {
        toast.error(getErrorMessage(err, 'Не вдалося завантажити деталі програми'))
        setDetails(null)
      } finally {
        setLoading(false)
      }
    }

    void loadDetails()
  }, [open, programId, toast])

  return (
    <ModalLayout
      open={open}
      onClose={onClose}
      panelClassName="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="flex flex-col gap-6">
        <header className="sticky top-0 bg-bg-surface">
          <h2 className="text-2xl font-bold text-text">Деталі навчальної програми</h2>
          {details && <p className="mt-1 text-text-secondary">{details.name}</p>}
        </header>

        {loading && (
          <p className="py-8 text-center text-text-secondary">Завантаження деталей програми...</p>
        )}

        {!loading && details && <StudyProgramSubjectsTable subjects={details.subjects} />}

        <footer className="flex justify-end sticky bottom-0 bg-bg-surface">
          <Button type="button" onClick={onClose} variant="primary" className="px-8">
            Закрити
          </Button>
        </footer>
      </div>
    </ModalLayout>
  )
}
