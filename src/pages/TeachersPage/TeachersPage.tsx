import { Plus } from 'lucide-react'
import { Button } from '~/ui/Button'
import { ErrorAlert } from '~/ui/ErrorAlert'
import { Pagination } from '~/ui/Pagination'
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
        {loading && (
          <p className="rounded-xl border border-border bg-bg-surface px-4 py-8 text-center text-text-secondary">
            Завантаження викладачів...
          </p>
        )}

        {!loading && error && <ErrorAlert message={error} onRetry={() => void refetch()} />}

        {!loading && !error && (
          <>
            <TeachersFilters {...filters} />

            <TeachersTable teachers={teachers} rowActions={rowActions} />

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
