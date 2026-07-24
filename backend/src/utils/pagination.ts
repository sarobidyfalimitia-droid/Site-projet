import { Request } from 'express'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
  search?: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Extract pagination params from query string.
 * Defaults: page=1, limit=10, max limit=100
 */
export function getPaginationParams(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10))
  const skip = (page - 1) * limit
  const search = req.query.search as string | undefined

  return { page, limit, skip, search }
}

/**
 * Build a paginated response object.
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    data,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  }
}

/**
 * Build a Prisma where clause for text search across multiple fields.
 * Returns undefined if no search term is provided.
 */
export function buildSearchFilter(search?: string, fields: string[] = ['name']) {
  if (!search) return undefined
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: 'insensitive' as const },
    })),
  }
}
