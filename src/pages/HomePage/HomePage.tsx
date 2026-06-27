import { ErrorAlert } from '~/components/ui/ErrorAlert'
import { Pagination } from '~/components/ui/Pagination'
import { SchedulesFilters } from '~/pages/HomePage/components/SchedulesFilters'
import { SchedulesTable } from '~/pages/HomePage/components/SchedulesTable'
import { useSchedulesPage } from '~/pages/HomePage/hooks/useSchedulesPage'

function HomePage() {
  const {
    schedules,
    loading,
    error,
    pagination,
    rangeLabel,
    rowActions,
    refetch,
    setPage,
    filters,
  } = useSchedulesPage()

  return (
    <main className="container-app py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text">Розклад навчальних програм</h1>
        <p className="mt-1 text-caption">Перегляд та керування розкладами груп</p>
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="rounded-xl border border-border bg-bg-surface px-4 py-8 text-center text-text-secondary">
            Завантаження розкладів...
          </p>
        )}

        {!loading && error && <ErrorAlert message={error} onRetry={() => void refetch()} />}

        {!loading && !error && (
          <>
            <SchedulesFilters {...filters} />

            <SchedulesTable schedules={schedules} rowActions={rowActions} />

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

export default HomePage
