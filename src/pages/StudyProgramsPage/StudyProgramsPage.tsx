import { ErrorAlert } from '~/components/ui/ErrorAlert'
import { Pagination } from '~/components/ui/Pagination'
import { StudyProgramsFilters } from '~/pages/StudyProgramsPage/components/StudyProgramsFilters'
import { StudyProgramsTable } from '~/pages/StudyProgramsPage/components/StudyProgramsTable'
import { useStudyProgramsPage } from '~/pages/StudyProgramsPage/hooks/useStudyProgramsPage'

function StudyProgramsPage() {
  const {
    studyPrograms,
    loading,
    error,
    pagination,
    rangeLabel,
    rowActions,
    refetch,
    setPage,
    filters,
  } = useStudyProgramsPage()

  return (
    <main className="container-app py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Довідник навчальних програм</h1>
        <p className="mt-1 text-caption">Перегляд та керування навчальними програмами</p>
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="rounded-xl border border-border bg-bg-surface px-4 py-8 text-center text-text-secondary">
            Завантаження навчальних програм...
          </p>
        )}

        {!loading && error && <ErrorAlert message={error} onRetry={() => void refetch()} />}

        {!loading && !error && (
          <>
            <StudyProgramsFilters {...filters} />

            <StudyProgramsTable studyPrograms={studyPrograms} rowActions={rowActions} />

            {(pagination?.pagesCount ?? 0) > 1 || rangeLabel ? (
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                {rangeLabel && <p className="text-sm text-text-secondary">{rangeLabel}</p>}

                {pagination && pagination.pagesCount > 1 && (
                  <Pagination
                    page={pagination.page}
                    pagesCount={pagination.pagesCount}
                    onPageChange={setPage}
                    className="sm:ml-auto"
                  />
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  )
}

export default StudyProgramsPage
