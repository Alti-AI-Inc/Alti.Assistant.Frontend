'use server';

import { auth } from '@/auth';
import {
  ApiResponse,
  CheckSubdomainAvailability,
  CreateTenantData,
  SwitchTenantResponse,
  Tenant,
  TenantSettings,
  TenantUsage,
  UserTenant,
} from '@/types/tenant';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Support multiple backend shapes for GET /tenant/all (and similar).
 * e.g. { data: [...] }, { data: { tenants: [...] } }, { tenants: [...] }
 */
function extractTenantRowsFromListResponse(
  result: Record<string, unknown>,
): unknown[] {
  const tryArray = (v: unknown) => (Array.isArray(v) ? v : null);

  for (const key of [
    'tenants',
    'organizations',
    'items',
    'data',
    'list',
  ] as const) {
    const v = tryArray(result[key]);
    if (v) return v;
  }

  const data = result.data;
  if (data && typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    for (const key of [
      'tenants',
      'organizations',
      'items',
      'list',
      'data',
    ] as const) {
      const v = tryArray(obj[key]);
      if (v) return v;
    }
  }

  return [];
}

const MEMBER_COUNT_NUMERIC_KEYS = [
  'usersCount',
  'users_count',
  'memberCount',
  'member_count',
  'membersCount',
  'members_count',
  'userCount',
  'user_count',
  'totalUsers',
  'total_users',
  'total',
  'count',
  'totalCount',
  'total_count',
] as const;

function parseNonNegativeInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.min(Math.floor(value), 10_000_000);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n) && n >= 0) return Math.min(n, 10_000_000);
  }
  return null;
}

function pickNumericCountFromRecord(o: Record<string, unknown>): number | null {
  for (const key of MEMBER_COUNT_NUMERIC_KEYS) {
    const n = parseNonNegativeInt(o[key]);
    if (n !== null) return n;
  }
  const usage = o.usage;
  if (usage && typeof usage === 'object') {
    const u = usage as Record<string, unknown>;
    for (const key of MEMBER_COUNT_NUMERIC_KEYS) {
      const n = parseNonNegativeInt(u[key]);
      if (n !== null) return n;
    }
  }
  return null;
}

function pickArrayLengthCount(o: Record<string, unknown>): number | null {
  for (const key of ['users', 'members', 'user', 'items'] as const) {
    const v = o[key];
    if (Array.isArray(v)) return v.length;
  }
  return null;
}

/**
 * Best-effort user/member count from GET /tenant/user/:id, a /tenant/all row, or nested `tenant` / `usage`.
 */
function getMemberCountFromUnknownPayload(
  payload: unknown,
  depth = 0,
): number | null {
  if (depth > 6 || payload == null) return null;

  if (Array.isArray(payload)) return payload.length;

  if (typeof payload !== 'object') return null;

  const o = payload as Record<string, unknown>;

  const numeric = pickNumericCountFromRecord(o);
  if (numeric !== null) return numeric;

  const len = pickArrayLengthCount(o);
  if (len !== null) return len;

  const data = o.data;
  if (data !== undefined && data !== o) {
    const inner = getMemberCountFromUnknownPayload(data, depth + 1);
    if (inner !== null) return inner;
  }

  const tenant = o.tenant;
  if (tenant && typeof tenant === 'object' && tenant !== o) {
    const inner = getMemberCountFromUnknownPayload(tenant, depth + 1);
    if (inner !== null) return inner;
  }

  const result = o.result;
  if (result && typeof result === 'object') {
    const inner = getMemberCountFromUnknownPayload(result, depth + 1);
    if (inner !== null) return inner;
  }

  return null;
}

/**
 * Check if a subdomain is available
 */
export async function checkSubdomainAvailability(
  subdomain: string,
): Promise<ApiResponse<CheckSubdomainAvailability>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return {
        success: false,
        data: { subdomain, available: false },
        message: 'Authentication required',
      };
    }
    const response = await fetch(
      `${API_URL}/tenant/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || 'Failed to check subdomain availability',
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error checking subdomain:', error);
    return {
      success: false,
      data: { subdomain, available: false },
      message: error.message || 'Failed to check subdomain availability',
    };
  }
}

/**
 * Create a new tenant/organization
 * Returns new access token with tenant context
 */
export async function createTenant(
  data: CreateTenantData,
): Promise<ApiResponse<Tenant & { accessToken?: string }>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create tenant');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    throw error;
  }
}

export async function getTenantById(
  tenantId: string,
): Promise<ApiResponse<Tenant>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/details/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get tenant by ID');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting tenant by ID:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error getting tenant by ID',
    };
  }
}

/**
 * Get current tenant details
 */
export async function getCurrentTenant(): Promise<ApiResponse<Tenant>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get current tenant');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting current tenant:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error getting current tenant',
    };
  }
}

/**
 * Get all tenants the user is a member of
 */
export async function getUserTenants(): Promise<ApiResponse<UserTenant[]>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return {
        success: false,
        data: [],
        message: 'Unauthorized',
      };
    }
    const response = await fetch(`${API_URL}/tenant/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      const message =
        (error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : null) || 'Failed to get user tenants';

      return {
        success: false,
        data: [],
        message,
      };
    }
    const result = (await response.json()) as Record<string, unknown>;
    const list = extractTenantRowsFromListResponse(result);

    const tenants: UserTenant[] = list
      .map((raw): UserTenant | null => {
        const item = raw as Record<string, unknown>;
        const nested =
          item.tenant && typeof item.tenant === 'object' && item.tenant !== null
            ? (item.tenant as Record<string, unknown>)
            : null;

        const id =
          item.id ?? item._id ?? item.tenantId ?? nested?.id ?? nested?._id;
        if (id === undefined || id === null) return null;

        const name =
          (nested?.name as string | undefined) ??
          (item.name as string | undefined) ??
          '';
        const slug =
          (nested?.slug as string | undefined) ??
          (item.slug as string | undefined) ??
          '';
        const subdomain =
          (nested?.subdomain as string | undefined) ??
          (item.subdomain as string | undefined) ??
          '';

        const tenantRole =
          (typeof item.tenantRole === 'string' && item.tenantRole) ||
          (nested &&
            typeof (nested as Record<string, unknown>).tenantRole ===
              'string' &&
            String((nested as Record<string, unknown>).tenantRole)) ||
          (typeof item.role === 'string' && item.role) ||
          (nested && typeof nested.role === 'string' && nested.role) ||
          'member';

        const usersCountFromList =
          getMemberCountFromUnknownPayload(item) ??
          (nested ? getMemberCountFromUnknownPayload(nested) : null) ??
          undefined;

        return {
          id: String(id),
          name: String(name),
          slug: String(slug),
          subdomain: String(subdomain),
          status: (item.status as UserTenant['status']) ?? 'active',
          plan: String(item.plan ?? nested?.plan ?? ''),
          role: String(tenantRole).toLowerCase(),
          permissions: item.permissions as string[] | undefined,
          joinedAt:
            typeof item.joinedAt === 'string' ? item.joinedAt : undefined,
          ...(usersCountFromList !== undefined && usersCountFromList !== null
            ? { usersCount: usersCountFromList }
            : {}),
        };
      })
      .filter((t): t is UserTenant => t !== null);

    return {
      success: result.success !== false,
      data: tenants,
      message: typeof result.message === 'string' ? result.message : undefined,
    };
  } catch (error: any) {
    console.error('Error getting user tenants:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error getting user tenants',
      data: [],
    };
  }
}

function extractUsersCountFromTenantUserPayload(
  body: Record<string, unknown>,
): number {
  return getMemberCountFromUnknownPayload(body) ?? 0;
}

/**
 * GET /tenant/user/:tenantId — tenant user summary (e.g. total usersCount)
 */
export async function getTenantUserCount(
  tenantId: string,
): Promise<ApiResponse<{ usersCount: number }>> {
  const fail = (message: string): ApiResponse<{ usersCount: number }> => ({
    success: false,
    data: { usersCount: 0 },
    message,
  });

  try {
    const session = await auth();
    if (!session?.accessToken) {
      return fail('Unauthorized');
    }

    const response = await fetch(
      `${API_URL}/tenant/user/${encodeURIComponent(tenantId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      let message = 'Failed to fetch tenant user count';
      try {
        const err = (await response.json()) as Record<string, unknown>;
        if (typeof err.message === 'string') message = err.message;
      } catch {
        /* ignore */
      }
      return fail(message);
    }

    const json = (await response.json()) as Record<string, unknown>;
    const usersCount = extractUsersCountFromTenantUserPayload(json);

    return {
      success: true,
      data: { usersCount },
      message: typeof json.message === 'string' ? json.message : undefined,
    };
  } catch (error: any) {
    console.error('Error getting tenant user count:', error);
    return fail(error.message || 'Failed to fetch tenant user count');
  }
}

/**
 * Update tenant settings
 */
export async function updateTenantSettings(
  settings: TenantSettings,
): Promise<ApiResponse<Tenant>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ settings }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update tenant settings');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error updating tenant settings:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error updating tenant settings',
    };
  }
}

/**
 * Get tenant usage statistics
 */
export async function getTenantUsage(): Promise<ApiResponse<TenantUsage>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/tenant/usage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get tenant usage');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting tenant usage:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error getting tenant usage',
    };
  }
}

/**
 * Switch to a different tenant context or personal mode
 * Pass tenantId to switch to a tenant, or null to switch to personal mode
 * Returns a new JWT token with the appropriate context
 */
export async function switchTenant(
  tenantId: string | null,
): Promise<ApiResponse<SwitchTenantResponse>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }

    // Request a new token with the new tenant context
    const response = await fetch(`${API_URL}/tenant/switch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ tenantId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to switch tenant');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error switching tenant:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error switching tenant',
    };
  }
}
