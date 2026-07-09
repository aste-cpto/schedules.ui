import { Loader2, Plus } from 'lucide-react'
import { Button } from '~/ui/Button'
import { ErrorAlert } from '~/ui/ErrorAlert'
import { TablePaginationBar } from '~/ui/TablePaginationBar'
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
        {error && <ErrorAlert message={error} onRetry={() => void refetch()} />}

        {!error && (
          <>
            <SchedulesFilters {...filters} />

            <TablePaginationBar
              rangeLabel={rangeLabel}
              pagination={pagination}
              onPageChange={setPage}
            />

            <div className="relative">
              <SchedulesTable
                schedules={schedules}
                rowActions={rowActions}
                onScheduleUpdated={() => void refetch({ silent: true })}
              />

              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-xl bg-bg-surface/80 text-sm text-text-secondary backdrop-blur-[1px]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Завантаження розкладів...
                </div>
              )}
            </div>

            <TablePaginationBar
              rangeLabel={rangeLabel}
              pagination={pagination}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ScheduleModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        onSuccess={() => {
          closeCreateModal()
          void refetch()
        }}
      />
    </main>
  )
}

export default SchedulesPage
