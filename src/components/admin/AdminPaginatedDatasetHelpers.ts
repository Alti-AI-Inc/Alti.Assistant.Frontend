export type SortOrder = 'asc' | 'desc';

export type AdminListMeta = {
  page?: number;
  limit?: number;
  total?: number;
  paidUser?: number;
  freeUser?: number;
  unverifyUsers?: number;
};

/** Normalize getAllUsers / getAllPayments success payload → rows + meta. */
export function parseAdminListPayload<T>(payload: unknown): {
  list: T[];
  meta?: AdminListMeta;
} {
  if (payload === null || payload === undefined) {
    return { list: [] };
  }

  const root = payload as {
    meta?: AdminListMeta;
    data?: unknown;
  };

  if (Array.isArray(root.data)) {
    return { list: root.data as T[], meta: root.meta };
  }

  if (Array.isArray(payload)) {
    return { list: payload as T[] };
  }

  return { list: [] };
}

export function paginationLabel(
  meta: AdminListMeta | undefined,
  listLen: number,
  pageSize: number,
) {
  const total = meta?.total ?? listLen;
  const page = meta?.page ?? 1;
  const limit = Math.max(1, meta?.limit ?? (listLen > 0 ? listLen : pageSize));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return { total, page, limit, from, to };
}
