'use client';

import { getUserTenants, switchTenant } from '@/actions/tenantActions';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import useTenantStore, { Tenant } from '@/stores/useTenantStore';
import { toast } from 'sonner';

interface TenantContextValue {
  mode: 'personal' | 'tenant';
  activeTenantId: string | null;
  currentTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  switchToPersonalMode: () => Promise<void>;
  switchToTenantMode: (tenantId: string) => Promise<void>;
  refreshTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const {
    mode,
    activeTenantId,
    currentTenant,
    tenants,
    isHydrated,
    switchToPersonalMode: storeSwitchToPersonalMode,
    switchToTenantMode: storeSwitchToTenantMode,
    setTenants,
  } = useTenantStore();

  // Wrapper for switchToPersonalMode with API call and token refresh
  const switchToPersonalMode = useCallback(async () => {
    // Check if already in personal mode
    if (mode === 'personal' && !activeTenantId) {
      return; // Already in personal mode, no need to switch
    }

    try {
      // Call API to switch to personal mode (tenantId: null)
      const response = await switchTenant(null);
      
      if (response.success && response.data) {
        // Update session with new access token
        if (update) {
          await update({ accessToken: response.data.accessToken });
        }
        
        // Update local store state
        storeSwitchToPersonalMode();
      } else {
        toast.error(response.message || 'Failed to switch to personal mode');
        throw new Error(response.message || 'Failed to switch to personal mode');
      }
    } catch (error: unknown) {
      console.error('Failed to switch to personal mode:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to switch to personal mode');
      throw error;
    }
  }, [mode, activeTenantId, update, storeSwitchToPersonalMode]);

  // Wrapper for switchToTenantMode with API call and token refresh
  const switchToTenantMode = useCallback(async (tenantId: string) => {
    // Check if already in the target tenant mode
    if (mode === 'tenant' && activeTenantId === tenantId) {
      return; // Already in this tenant mode, no need to switch
    }

    try {
      // Call API to switch tenant and get new token
      const response = await switchTenant(tenantId);
      
      if (response.success && response.data) {
        // Update session with new access token
        if (update) {
          await update({ accessToken: response.data.accessToken });
        }
        
        // Update local store state
        storeSwitchToTenantMode(tenantId);
      } else {
        toast.error(response.message || 'Failed to switch organization');
        throw new Error(response.message || 'Failed to switch tenant');
      }
    } catch (error: unknown) {
      console.error('Failed to switch tenant:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to switch organization');
      throw error;
    }
  }, [mode, activeTenantId, update, storeSwitchToTenantMode]);

  // Function to manually refresh tenants list
  const refreshTenants = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      const response = await getUserTenants();
      if (response.success && response.data) {
        const storeTenants: Tenant[] = response.data.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role,
          subdomain: t.subdomain,
          slug: t.slug,
        }));
        setTenants(storeTenants);
      }
    } catch (error) {
      console.error('Failed to refresh tenant details:', error);
    }
  }, [session?.accessToken, setTenants]);

  // Fetch full tenant details from API when session is available
  useEffect(() => {
    const fetchTenantDetails = async () => {
      if (!session?.accessToken || !isHydrated) return;
      
      try {
        const response = await getUserTenants();
        if (response.success && response.data) {
          // Transform UserTenant[] to Tenant[] for the store
          const storeTenants: Tenant[] = response.data.map(t => ({
            id: t.id,
            name: t.name,
            role: t.role,
            subdomain: t.subdomain,
            slug: t.slug,
          }));
          
          // Only update if the data has changed to prevent unnecessary re-renders
          const hasChanged = JSON.stringify(storeTenants) !== JSON.stringify(tenants);
          if (hasChanged) {
            setTenants(storeTenants);
          }
        }
      } catch (error) {
        console.error('Failed to fetch tenant details:', error);
      }
    };

    fetchTenantDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, isHydrated, session?.user?.tenants?.length]);

  const value: TenantContextValue = {
    mode,
    activeTenantId,
    currentTenant,
    tenants,
    isLoading: status === 'loading' || !isHydrated,
    switchToPersonalMode,
    switchToTenantMode,
    refreshTenants,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Helper hook to get tenant-aware headers for API calls
export function useTenantHeaders() {
  const { mode, activeTenantId } = useTenant();

  return React.useMemo(() => {
    const headers: Record<string, string> = {};
    if (mode === 'tenant' && activeTenantId) {
      headers['X-Tenant-Id'] = activeTenantId;
    }
    return headers;
  }, [mode, activeTenantId]);
}
