export type ApiListQueryParams = {
  page?: number
  pageRecords?: number
  search?: string
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
