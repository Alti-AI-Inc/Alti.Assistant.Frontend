/**
 * API Client Utility
 *
 * Provides automatic tenant context injection via X-Tenant-Id header
 * when user is in organization mode. This ensures all API calls are
 * properly scoped to the active tenant for data isolation.
 */

import { UserMode } from '@/types/tenant';

export interface ApiClientOptions extends RequestInit {
  skipTenantHeader?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

const LOCAL_API_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

/**
 * Get current tenant context from localStorage
 * This matches the logic in useTenantStore
 */
function getTenantContext(): { mode: UserMode; activeTenantId: string | null } {
  if (typeof window === 'undefined') {
    return { mode: UserMode.PERSONAL, activeTenantId: null };
  }

  try {
    const stored = localStorage.getItem('tenant-store');
    if (!stored) {
      return { mode: UserMode.PERSONAL, activeTenantId: null };
    }

    const parsed = JSON.parse(stored);
    return {
      mode: parsed.state?.mode || UserMode.PERSONAL,
      activeTenantId: parsed.state?.activeTenantId || null,
    };
  } catch (error) {
    console.error('Error reading tenant context:', error);
    return { mode: UserMode.PERSONAL, activeTenantId: null };
  }
}

/**
 * Enhanced fetch with automatic tenant header injection
 *
 * @param url - API endpoint URL
 * @param options - Fetch options including skipTenantHeader flag
 * @returns Promise<Response>
 */
export async function apiClient(
  url: string,
  options: ApiClientOptions = {},
): Promise<Response> {
  const { skipTenantHeader = false, headers = {}, ...restOptions } = options;

  // Build headers object
  const requestHeaders: HeadersInit = { ...headers };

  // Add tenant header if in tenant mode and not skipped
  if (!skipTenantHeader) {
    const { mode, activeTenantId } = getTenantContext();
    if (mode === UserMode.TENANT && activeTenantId) {
      (requestHeaders as Record<string, string>)['X-Tenant-Id'] =
        activeTenantId;
    }
  }

  // If in browser and URL is absolute pointing to the API host, convert to same-origin path to use Next.js proxy rewrite and prevent CORS failure
  let requestUrl = url;
  if (typeof window !== 'undefined' && url.startsWith('http')) {
    try {
      const parsed = new URL(url);
      const apiEnvUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiEnvUrl) {
        const parsedApiEnv = new URL(apiEnvUrl);
        if (parsed.host === parsedApiEnv.host) {
          requestUrl = `${parsed.pathname}${parsed.search}`;
        }
      }
    } catch {
      // ignore
    }
  }

  // Make the request
  try {
    const response = await fetch(requestUrl, {
      ...restOptions,
      headers: requestHeaders,
    });

    return response;
  } catch (error) {
    console.warn('API Client Warning:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * API client with automatic JSON parsing and error handling
 *
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @returns Promise<ApiResponse<T>>
 */
export async function apiClientJson<T = unknown>(
  url: string,
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError: any = null;
      try {
        parsedError = JSON.parse(errorText);
      } catch (e) {
        // Not a JSON response
      }

      const friendlyMessage = parsedError?.message || 'Request failed';
      return {
        success: false,
        message: friendlyMessage,
        debugMessage: friendlyMessage,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Success',
      data: data.data || data,
    };
  } catch (error: unknown) {
    console.error('API Client JSON Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      debugMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Helper to build API URL with base URL from env
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  let cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  if (typeof window !== 'undefined' && cleanBaseUrl) {
    try {
      const parsedBaseUrl = new URL(cleanBaseUrl);

      // Keep browser requests same-origin when the configured API points at a
      // local backend so CSP can allow the call and Next.js can proxy it.
      if (
        parsedBaseUrl.protocol === 'http:' &&
        LOCAL_API_HOSTNAMES.has(parsedBaseUrl.hostname)
      ) {
        cleanBaseUrl = parsedBaseUrl.pathname.replace(/\/$/, '');
      }
    } catch {
      // Leave relative and otherwise non-URL values unchanged.
    }
  }

  return `${cleanBaseUrl}/${cleanEndpoint}`;
}

/**
 * Check if current context is tenant mode
 */
export function isInTenantMode(): boolean {
  const { mode } = getTenantContext();
  return mode === UserMode.TENANT;
}

/**
 * Get active tenant ID if in tenant mode
 */
export function getActiveTenantId(): string | null {
  const { mode, activeTenantId } = getTenantContext();
  return mode === UserMode.TENANT ? activeTenantId : null;
}
