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
 * Check if a subdomain is available
 */
export async function checkSubdomainAvailability(
  subdomain: string
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
    console.log('Checking subdomain availability for:', subdomain);
    const response = await fetch(
      `${API_URL}/tenant/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check subdomain availability');
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
  data: CreateTenantData
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

export async function getTenantById(tenantId: string): Promise<ApiResponse<Tenant>> {
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
    throw error;
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
    throw error;
  }
}

/**
 * Get all tenants the user is a member of
 */
export async function getUserTenants(): Promise<ApiResponse<UserTenant[]>> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error('Unauthorized');
    }
    console.log('Fetching user tenants with access token:', session.accessToken);
    const response = await fetch(`${API_URL}/tenant/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user tenants');
    }
    const result = await response.json();
    console.log('User tenants response:', JSON.stringify(result));

    // Backend returns data.tenants array, not data directly
    return {
      success: result.success,
      data: result.data?.tenants || [],
      message: result.message,
    };
  } catch (error: any) {
    console.error('Error getting user tenants:', error);
    throw error;
  }
}

/**
 * Update tenant settings
 */
export async function updateTenantSettings(
  settings: TenantSettings
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
    throw error;
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
    throw error;
  }
}

/**
 * Switch to a different tenant context or personal mode
 * Pass tenantId to switch to a tenant, or null to switch to personal mode
 * Returns a new JWT token with the appropriate context
 */
export async function switchTenant(
  tenantId: string | null
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
    throw error;
  }
}
