'use server';

import { extractAdminSubscriptionPackages } from '@/utils/adminSubscriptionPackages';
import { extractAdminMembersList } from '@/utils/adminTenantMembers';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  debugMessage?: string;
}

const BASE_URL = 'https://apiv2.asonai.com/api/v1';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || BASE_URL;

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

/** Values accepted by PATCH /admin/tenants/:id/status */
export type TenantLifecycleStatus = 'active' | 'suspended' | 'cancelled';

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

export interface SubscriptionRecord {
  _id: string;
  limits?: Record<string, unknown>;
  userId?: { _id?: string; email?: string } | string | null;
  price?: string | number;
  plan_name?: string;
  productId?: {
    _id?: string;
    plan?: string;
    name?: string;
    price?: number;
  } | null;
  duration?: string;
  paymentStatus?: string;
  tenantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AllSubscriptionsResponse {
  data: SubscriptionRecord[];
}

export async function getAllSubscriptions(
  accessToken?: string,
  query?: Record<string, string | number | undefined>,
): Promise<ApiResponse<AllSubscriptionsResponse>> {
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

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/subscription/admin/all${qs}`,
      {
        method: 'GET',
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to fetch subscriptions',
        statusCode: res.status,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Subscriptions fetched',
      data: data.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

export interface AdminTenantOwnerRef {
  _id: string;
  email: string;
}

export interface AdminTenantDetail {
  _id: string;
  name: string;
  slug?: string;
  subdomain?: string;
  /** Some API responses use camelCase */
  subDomain?: string;
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

export interface AdminSubscriptionPackage {
  _id: string;
  plan: string;
  name: string;
  displayName?: string;
  price: number;
  interval: string;
  features?: {
    dailyRequestLimit?: number;
    ragType?: string;
    storagePerUser?: number;
    canInviteTeam?: boolean;
  };
}

export interface AdminTenantMember {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  tenantId: string;
  role?: string;
  tenantRole?: string;
  status?: string;
  joinedAt?: string;
  createdAt?: string;
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

export async function updateTenantStatus(
  tenantId: string,
  status: TenantLifecycleStatus,
  accessToken?: string,
): Promise<ApiResponse<unknown>> {
  try {
    const res = await fetch(`${BASE_URL}/admin/tenants/${tenantId}/status`, {
      method: 'PATCH',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to update tenant status',
        statusCode: res.status,
      };
    }

    const data = await res.json().catch(() => ({}));
    return {
      success: true,
      message: data.message || 'Status updated',
      data: data.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

async function fetchSubscriptionPackagesFromUrl(
  url: string,
  accessToken?: string,
): Promise<{
  packages: AdminSubscriptionPackage[];
  message?: string;
  statusCode?: number;
}> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return {
      packages: [],
      message:
        (err as { message?: string }).message ||
        'Failed to fetch subscription packages',
      statusCode: res.status,
    };
  }

  const data = await res.json();
  return {
    packages: extractAdminSubscriptionPackages(data),
    message: (data as { message?: string }).message,
  };
}

export async function getAdminSubscriptionPackages(
  accessToken?: string,
): Promise<ApiResponse<AdminSubscriptionPackage[]>> {
  try {
    const result = await fetchSubscriptionPackagesFromUrl(
      `${API_BASE}/admin/subscription-packages`,
      accessToken,
    );

    if (result.statusCode && result.statusCode >= 400) {
      return {
        success: false,
        message: result.message || 'Failed to fetch subscription packages',
        statusCode: result.statusCode,
        data: [],
      };
    }

    return {
      success: true,
      message: result.message || 'Subscription packages retrieved successfully',
      data: result.packages,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

async function fetchTenantMembersFromUrl(
  url: string,
  tenantId: string,
  accessToken?: string,
): Promise<{
  members: AdminTenantMember[];
  message?: string;
  statusCode?: number;
}> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return {
      members: [],
      message:
        (err as { message?: string }).message ||
        'Failed to fetch tenant members',
      statusCode: res.status,
    };
  }

  const data = await res.json();
  return {
    members: extractAdminMembersList(data, tenantId),
    message: (data as { message?: string }).message,
  };
}

export async function getAdminTenantMembers(
  tenantId: string,
  accessToken?: string,
): Promise<ApiResponse<AdminTenantMember[]>> {
  try {
    const encodedTenantId = encodeURIComponent(tenantId);

    const adminResult = await fetchTenantMembersFromUrl(
      `${API_BASE}/admin/tenants/${encodedTenantId}/members?limit=100`,
      tenantId,
      accessToken,
    );

    if (adminResult.members.length > 0) {
      return {
        success: true,
        message: adminResult.message || 'Tenant members fetched',
        data: adminResult.members,
      };
    }

    const tenantScopedResult = await fetchTenantMembersFromUrl(
      `${API_BASE}/tenant/members/${encodedTenantId}`,
      tenantId,
      accessToken,
    );

    if (tenantScopedResult.members.length > 0) {
      return {
        success: true,
        message: tenantScopedResult.message || 'Tenant members fetched',
        data: tenantScopedResult.members,
      };
    }

    if (adminResult.statusCode && adminResult.statusCode >= 400) {
      return {
        success: false,
        message: adminResult.message || 'Failed to fetch tenant members',
        statusCode: adminResult.statusCode,
        data: [],
      };
    }

    return {
      success: true,
      message: adminResult.message || 'Tenant members fetched',
      data: [],
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

export async function assignUserSubscription(
  userId: string,
  payload: {
    productId: string;
    duration: string;
  },
  accessToken?: string,
): Promise<ApiResponse<unknown>> {
  try {
    const res = await fetch(
      `${API_BASE}/admin/users/${encodeURIComponent(userId)}/assign-subscription`,
      {
        method: 'POST',
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json().catch(() => ({}));
    const body = data as {
      success?: boolean;
      message?: string;
      data?: unknown;
    };

    if (!res.ok || body.success === false) {
      return {
        success: false,
        message: body.message || 'Failed to assign subscription',
        statusCode: res.status,
      };
    }

    return {
      success: true,
      message: body.message || 'Subscription assigned successfully',
      data: body.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}

export async function extendTenantTrial(
  tenantId: string,
  days: string | number,
  accessToken?: string,
): Promise<ApiResponse<unknown>> {
  try {
    const res = await fetch(
      `${BASE_URL}/admin/tenants/${tenantId}/extend-trial`,
      {
        method: 'POST',
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days: String(days) }),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        message: err.message || 'Failed to extend trial',
        statusCode: res.status,
      };
    }

    const data = await res.json().catch(() => ({}));
    return {
      success: true,
      message: data.message || 'Trial extended',
      data: data.data,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, message: 'Network error', debugMessage: msg };
  }
}
