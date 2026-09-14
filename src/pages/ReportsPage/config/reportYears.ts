import { useEffect, useState } from 'react'
import { apiClient } from '~/lib/apiClient'
import { getCurrentYear } from '~/lib/dateUtils'
import { getErrorMessage } from '~/lib/formatApiError'
import { useToast } from '~/ui/toast/useToast'

let cachedYearsPromise: Promise<number[]> | null = null

export function fetchReportYears(): Promise<number[]> {
  if (!cachedYearsPromise) {
    cachedYearsPromise = apiClient<number[]>('/teachers/loads/years')
      .then((years) => {
        if (!years || years.length === 0) {
          return [getCurrentYear()]
        }
        return years.sort((a, b) => b - a)
      })
      .catch((err) => {
        cachedYearsPromise = null
        throw err
      })
  }
  return cachedYearsPromise
}

export function useReportYears() {
  const toast = useToast()
  const [years, setYears] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchReportYears()
      .then((data) => {
        if (isMounted) {
          setYears(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          toast.error(getErrorMessage(err, 'Не вдалося завантажити доступні роки'))
          setYears([getCurrentYear()])
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [toast])

  const options = years.map((year) => ({
    value: String(year),
    label: String(year),
  }))

  const currentYear = getCurrentYear()
  const defaultYear = years.find((year) => year === currentYear) ?? years[0]

  return { years, options, defaultYear, loading }
}
