import { useState } from 'react'
import { ReportsFilters } from '~/pages/ReportsPage/components/ReportsFilters'
import { ReportsTable } from '~/pages/ReportsPage/components/ReportsTable'
import { MOCK_TEACHER_LOAD_REPORTS } from '~/pages/ReportsPage/config/mockTeacherLoadReports'
import { DEFAULT_REPORT_YEAR } from '~/pages/ReportsPage/config/reportYears'

function ReportsPage() {
  const [year, setYear] = useState<number>(DEFAULT_REPORT_YEAR)
  const report = MOCK_TEACHER_LOAD_REPORTS[year]

  return (
    <main className="container-app py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Звіти</h1>
          <p className="mt-1 text-caption">Педагогічне навантаження викладачів</p>
        </div>

        <ReportsFilters year={year} onYearChange={setYear} />
      </div>

      {report && <ReportsTable items={report.items} totals={report.totals} />}
    </main>
  )
}

export default ReportsPage
