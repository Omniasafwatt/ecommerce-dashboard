import { useState, useCallback, useMemo } from 'react'

export interface PaginationParams {
  page: number
  limit: number
}

export interface UsePaginationReturn {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  nextPage: () => void
  prevPage: () => void
  goToFirstPage: () => void
  goToLastPage: (totalPages: number) => void
  paginationParams: PaginationParams
  reset: () => void
}

/**
 * Pagination hook.
 *
 * Manages `page` and `limit` state and exposes helpers for navigating pages.
 * Use `paginationParams` as query params when fetching paginated data.
 *
 * @param initialPage - Starting page (default: 1)
 * @param initialLimit - Starting page size (default: 20)
 */
export const usePagination = (
  initialPage = 1,
  initialLimit = 20
): UsePaginationReturn => {
  const [page, setPageState] = useState(initialPage)
  const [limit, setLimitState] = useState(initialLimit)

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.max(1, newPage))
  }, [])

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(Math.max(1, newLimit))
    // Reset to first page when page size changes
    setPageState(1)
  }, [])

  const nextPage = useCallback(() => {
    setPageState((prev) => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setPageState((prev) => Math.max(1, prev - 1))
  }, [])

  const goToFirstPage = useCallback(() => {
    setPageState(1)
  }, [])

  const goToLastPage = useCallback((totalPages: number) => {
    setPageState(Math.max(1, totalPages))
  }, [])

  const reset = useCallback(() => {
    setPageState(initialPage)
    setLimitState(initialLimit)
  }, [initialPage, initialLimit])

  const paginationParams = useMemo<PaginationParams>(
    () => ({ page, limit }),
    [page, limit]
  )

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    paginationParams,
    reset,
  }
}

export default usePagination
