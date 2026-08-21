import type { QueryPaginationDto } from './dto/query-pagination.dto';

export function paginationOf(query: QueryPaginationDto, fallbackLimit = 10) {
  const page = query.page ?? 1;
  const limit = query.limit ?? fallbackLimit;
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export function paginated<T>(data: T[], page: number, limit: number, total: number) {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit) || 1),
    },
  };
}
