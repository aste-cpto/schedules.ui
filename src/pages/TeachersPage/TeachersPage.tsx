import { Loader2, Plus } from 'lucide-react'
import { Button } from '~/ui/Button'
import { ErrorAlert } from '~/ui/ErrorAlert'
import { TablePaginationBar } from '~/ui/TablePaginationBar'
import { TeacherModal } from '~/pages/TeachersPage/components/TeacherModal/TeacherModal'
import { TeachersFilters } from '~/pages/TeachersPage/components/TeachersFilters'
import { TeachersTable } from '~/pages/TeachersPage/components/TeachersTable'
import { useTeachersPage } from '~/pages/TeachersPage/hooks/useTeachersPage'

function TeachersPage() {
  const {
    teachers,
    loading,
    error,
    pagination,
    rangeLabel,
    rowActions,
    refetch,
    setPage,
    formModal,
    openCreateModal,
    closeFormModal,
    filters,
  } = useTeachersPage()

  return (
    <main className="container-app py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Довідник викладачів</h1>
          <p className="mt-1 text-caption">Перегляд та керування викладачами</p>
        </div>

        <Button variant="secondary-accent" onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Додати викладача
        </Button>
      </div>

      <div className="space-y-4">
        {error && <ErrorAlert message={error} onRetry={() => void refetch()} />}

        {!error && (
          <>
            <TeachersFilters {...filters} />

            <TablePaginationBar
              rangeLabel={rangeLabel}
              pagination={pagination}
              onPageChange={setPage}
            />

            <div className="relative">
              <TeachersTable teachers={teachers} rowActions={rowActions} />

              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-xl bg-bg-surface/80 text-sm text-text-secondary backdrop-blur-[1px]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Завантаження викладачів...
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

      <TeacherModal
        open={formModal !== null}
        mode={formModal?.mode ?? 'create'}
        teacherId={formModal?.mode === 'edit' ? formModal.teacherId : undefined}
        initialStatus={formModal?.mode === 'edit' ? formModal.status : undefined}
        onClose={closeFormModal}
        onSuccess={() => {
          closeFormModal()
          void refetch()
        }}
      />
    </main>
  )
}

export default TeachersPage
