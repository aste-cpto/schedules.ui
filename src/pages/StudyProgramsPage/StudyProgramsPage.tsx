import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/Button'
import { ErrorAlert } from '~/components/ui/ErrorAlert'
import { Pagination } from '~/components/ui/Pagination'
import { StudyProgramDetailsModal } from '~/pages/StudyProgramsPage/components/StudyProgramDetailsModal/StudyProgramDetailsModal'
import { StudyProgramModal } from '~/pages/StudyProgramsPage/components/StudyProgramModal/StudyProgramModal'
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
    formModal,
    openCreateModal,
    closeFormModal,
    detailsProgramId,
    closeDetailsModal,
    filters,
  } = useStudyProgramsPage()

  return (
    <main className="container-app py-8">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Довідник навчальних програм</h1>
          <p className="mt-1 text-caption">Перегляд та керування навчальними програмами</p>
        </div>

        <Button variant="secondary-accent" onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Додати програму
        </Button>
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

      <StudyProgramModal
        open={formModal !== null}
        mode={formModal?.mode ?? 'create'}
        programId={formModal?.mode === 'edit' ? formModal.programId : undefined}
        onClose={closeFormModal}
        onSuccess={() => {
          closeFormModal()
          void refetch()
        }}
      />

      <StudyProgramDetailsModal
        open={detailsProgramId !== null}
        programId={detailsProgramId}
        onClose={closeDetailsModal}
      />
    </main>
  )
}

export default StudyProgramsPage
