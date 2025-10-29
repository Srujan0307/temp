import { Knex } from 'knex';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
  };
}

export interface PaginationOptions {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export async function paginate<T>(
  queryBuilder: Knex.QueryBuilder,
  options: PaginationOptions = {},
): Promise<PaginatedResult<T>> {
  const page = options.page || 1;
  const perPage = options.perPage || 10;
  const sort = options.sort || 'created_at';
  const order = options.order || 'desc';

  const countResult = await queryBuilder.clone().count();
  const total = parseInt(countResult[0].count as string, 10);

  const data = await queryBuilder
    .orderBy(sort, order)
    .offset((page - 1) * perPage)
    .limit(perPage);

  const lastPage = Math.ceil(total / perPage);

  const baseUrl = ''; // You would get this from the request object

  return {
    data,
    meta: {
      total,
      perPage,
      currentPage: page,
      lastPage,
      firstPage: 1,
      firstPageUrl: `${baseUrl}?page=1`,
      lastPageUrl: `${baseUrl}?page=${lastPage}`,
      nextPageUrl: page < lastPage ? `${baseUrl}?page=${page + 1}` : null,
      prevPageUrl: page > 1 ? `${baseUrl}?page=${page - 1}` : null,
    },
  };
}
