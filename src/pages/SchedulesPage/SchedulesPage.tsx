import { Plus } from 'lucide-react'
import { Button } from '~/ui/Button'
import { ErrorAlert } from '~/ui/ErrorAlert'
import { Pagination } from '~/ui/Pagination'
import { ScheduleModal } from '~/pages/SchedulesPage/components/ScheduleModal/ScheduleModal'
import { SchedulesFilters } from '~/pages/SchedulesPage/components/SchedulesFilters'
import { SchedulesTable } from '~/pages/SchedulesPage/components/SchedulesTable'
import { useSchedulesPage } from '~/pages/SchedulesPage/hooks/useSchedulesPage'

function SchedulesPage() {
  const {
    schedules,
    loading,
    error,
    pagination,
    rangeLabel,
    rowActions,
    refetch,
    setPage,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    filters,
  } = useSchedulesPage()

  return (
    <main className="container-app py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Розклад навчальних програм</h1>
          <p className="mt-1 text-caption">Перегляд та керування розкладами груп</p>
        </div>

        <Button variant="secondary-accent" onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Додати розклад
        </Button>
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

            <SchedulesTable
              schedules={schedules}
              rowActions={rowActions}
              onScheduleUpdated={() => void refetch({ silent: true })}
            />

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

      <ScheduleModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={() => void refetch()}
      />
    </main>
  )
}

export default SchedulesPage
