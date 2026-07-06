export function estimateTotalFromApiResponse(
  page: number,
  pageRecords: number,
  pagesCount: number,
  itemsOnPage: number,
): number {
  if (pagesCount === 0) return 0
  if (page >= pagesCount) return (pagesCount - 1) * pageRecords + itemsOnPage
  return pagesCount * pageRecords
}
