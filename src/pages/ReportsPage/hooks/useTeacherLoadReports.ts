import { useCallback, useState } from 'react'
import { useModalGuard } from '~/contexts/ModalGuardContext'
import { useAutoListFetch } from '~/hooks/useAutoListFetch'
import { getErrorMessage } from '~/lib/formatApiError'
import { useToast } from '~/ui/toast/useToast'
import { reportsService } from '~/services/reportsService'
import type { TeacherLoadReportResponse, TeacherLoadReportParams } from '~/types/api/report'

export function useTeacherLoadReports(params: TeacherLoadReportParams | null) {
  const toast = useToast()
  const { isModalOpen } = useModalGuard()
  const [report, setReport] = useState<TeacherLoadReportResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!params) return
    setLoading(true)
    setError(null)

    try {
      const data = await reportsService.getUsedHours(params)
      setReport(data)
    } catch (err) {
      const message = getErrorMessage(err, 'Не вдалося завантажити звіт')
      setError(message)
      if (message) {
        toast.error(message)
      }
      setReport(null)
    } finally {
      setLoading(false)
    }
  }, [params?.year, toast])

  useAutoListFetch(refetch, [params?.year], {
    pause: isModalOpen,
  })

  return {
    report,
    loading,
    error,
    refetch,
  }
}
