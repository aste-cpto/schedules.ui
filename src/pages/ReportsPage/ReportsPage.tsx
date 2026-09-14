import { useEffect, useMemo, useState } from 'react'
import { ReportsFilters } from '~/pages/ReportsPage/components/ReportsFilters'
import { ReportsTable } from '~/pages/ReportsPage/components/ReportsTable'
import { useReportYears } from '~/pages/ReportsPage/config/reportYears'
import { useTeacherLoadReports } from '~/pages/ReportsPage/hooks/useTeacherLoadReports'

function ReportsPage() {
  const { options, defaultYear, loading: yearsLoading } = useReportYears()
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    if (!yearsLoading && year === null && defaultYear !== undefined) {
      setYear(defaultYear)
    }
  }, [yearsLoading, defaultYear, year])

  const params = useMemo(() => (year !== null ? { year } : null), [year])
  const { report, loading: reportLoading } = useTeacherLoadReports(params)

  const showLoading = yearsLoading || reportLoading

  return (
    <main className="container-app py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Звіти</h1>
          <p className="mt-1 text-caption">Педагогічне навантаження викладачів</p>
        </div>

        {year !== null && (
          <ReportsFilters year={year} options={options} onYearChange={setYear} />
        )}
      </div>

      <div className="relative min-h-[30rem]">
        {report && <ReportsTable items={report.items} totals={report.totals} />}
        
        {showLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-xl bg-bg-surface/80 text-sm text-text-secondary backdrop-blur-[1px]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-r-accent-indigo" />
            Завантаження...
          </div>
        )}
      </div>
    </main>
  )
}

export default ReportsPage
