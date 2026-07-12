export type ApiListQueryParams = {
  page?: number
  pageRecords?: number
  search?: string
}

export type SchedulesListQueryParams = ApiListQueryParams & {
  year?: number
  startDate?: string
  endDate?: string
}

export function buildApiListQuery(params?: ApiListQueryParams): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()

  if (params.page !== undefined) searchParams.set('Page', String(params.page))
  if (params.pageRecords !== undefined) searchParams.set('PageRecords', String(params.pageRecords))
  if (params.search) searchParams.set('Search', params.search)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export function buildSchedulesListQuery(params?: SchedulesListQueryParams): string {
  if (!params) return ''

  const searchParams = new URLSearchParams()

  if (params.page !== undefined) searchParams.set('Page', String(params.page))
  if (params.pageRecords !== undefined) searchParams.set('PageRecords', String(params.pageRecords))
  if (params.search) searchParams.set('Search', params.search)
  if (params.year !== undefined) searchParams.set('Year', String(params.year))
  if (params.startDate) searchParams.set('StartDate', params.startDate)
  if (params.endDate) searchParams.set('EndDate', params.endDate)

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}
