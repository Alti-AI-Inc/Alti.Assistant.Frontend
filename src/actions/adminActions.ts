'use server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  debugMessage?: string;
}

const BASE_URL = 'https://apiv2.asonai.com/api/v1';

export interface FreePlanUsage {
  promptsUsed: number;
  imagesUsed: number;
  lastResetAt?: string;
}

export interface DailyRequestLimit {
  requestsUsed: number;
  maxRequests: number;
  lastResetAt?: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  isSubscribed: boolean;
  role: string;
  tenantId: string | null;
  createdAt: string;
  freePlanUsage?: FreePlanUsage;
  dailyRequestLimit?: DailyRequestLimit;
}

export interface AllUsersResponse {
  meta: {
    page: number;
    limit: number;
    total: number;
    paidUser?: number;
    freeUser?: number;
    unverifyUsers?: number;
  };
  data: AdminUser[];
}

export async function getAllUsers(
  accessToken?: string,
  query?: Record<string, string | number | undefined>,
): Promise<ApiResponse<AllUsersResponse>> {
  try {
    const qs = query
      ? '?' +
        Object.entries(query)
          .filter(([, v]) => v !== undefined && v !== null && v !== '')
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
          )
          .join('&')
      : '';

    const res = await fetch(`${BASE_URL}/admin/all-user${qs}`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to fetch users',
        statusCode: res.status,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Users fetched',
      data: data.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

export async function deleteUser(
  userId: string,
  accessToken?: string,
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const res = await fetch(`${BASE_URL}/admin/delete-user/${userId}`, {
      method: 'DELETE',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to delete user',
        statusCode: res.status,
      };
    }

    return { success: true, message: 'User deleted', data: { deleted: true } };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

export interface PaymentRecord {
  _id: string;
  price: number;
  planName?: string;
  userEmail?: string;
  createdAt?: string;
}

export interface AllPaymentsResponse {
  meta?: { page?: number; limit?: number; total?: number };
  data: PaymentRecord[];
}

export interface AdminTenantListItem {
  _id: string;
  name: string;
  subdomain: string;
  slug?: string;
  status: string;
  plan: string;
  createdAt: string;
}

export interface AllTenantsResponse {
  meta?: { page?: number; limit?: number; total?: number };
  data: AdminTenantListItem[];
}

export interface AdminTenantOwnerRef {
  _id: string;
  email: string;
}

export interface AdminTenantDetail {
  _id: string;
  name: string;
  slug?: string;
  subdomain: string;
  status: string;
  plan: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  memberCount?: number;
  __v?: number;
  ownerId?: string | AdminTenantOwnerRef;
  settings?: {
    allowMemberInvites?: boolean;
    requireApproval?: boolean;
    maxMembers?: number;
  };
  limits?: {
    maxApiCalls?: number;
    maxStorage?: number;
    maxUsers?: number;
  };
  usage?: {
    apiCallsUsed?: number;
    storageUsed?: number;
    usersCount?: number;
    lastResetAt?: string;
  };
  subscription?: {
    stripeCustomerId?: string;
  };
}

export async function getAllPayments(
  accessToken?: string,
  query?: Record<string, string | number | undefined>,
): Promise<ApiResponse<AllPaymentsResponse>> {
  try {
    const qs = query
      ? '?' +
        Object.entries(query)
          .filter(([, v]) => v !== undefined && v !== null && v !== '')
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
          )
          .join('&')
      : '';

    const res = await fetch(`${BASE_URL}/admin/all-payment${qs}`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to fetch payments',
        statusCode: res.status,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Payments fetched',
      data: data.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

export async function getTenants(
  accessToken?: string,
  query?: Record<string, string | number | undefined>,
): Promise<ApiResponse<AllTenantsResponse>> {
  try {
    const qs = query
      ? '?' +
        Object.entries(query)
          .filter(([, v]) => v !== undefined && v !== null && v !== '')
          .map(
            ([k, v]) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
          )
          .join('&')
      : '';

    const res = await fetch(`${BASE_URL}/admin/tenants${qs}`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to fetch tenants',
        statusCode: res.status,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Tenants fetched',
      data: data.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

export async function getTenantById(
  tenantId: string,
  accessToken?: string,
): Promise<ApiResponse<AdminTenantDetail>> {
  try {
    const res = await fetch(`${BASE_URL}/admin/tenants/${tenantId}`, {
      method: 'GET',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to fetch tenant',
        statusCode: res.status,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Tenant fetched',
      data: data.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}
