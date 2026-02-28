import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserMode = 'personal' | 'tenant';

export interface Tenant {
  id: string;
  name: string;
  role: string;
  subdomain?: string;
  slug?: string;
  memberCount?: number;
}

interface TenantStore {
  mode: UserMode;
  activeTenantId: string | null;
  tenants: Tenant[];
  currentTenant: Tenant | null;
  isHydrated: boolean;

  // Actions
  switchToPersonalMode: () => void;
  switchToTenantMode: (tenantId: string) => void;
  setTenants: (tenants: Tenant[]) => void;
  refreshCurrentTenant: () => void;
  setHydrated: () => void;
  reset: () => void;
}

const useTenantStore = create<TenantStore>()(
  persist(
    (set: any, get: any) => ({
      mode: 'personal',
      activeTenantId: null,
      tenants: [],
      currentTenant: null,
      isHydrated: false,

      switchToPersonalMode: () => {
        set({
          mode: 'personal',
          activeTenantId: null,
          currentTenant: null,
        });
      },

      switchToTenantMode: (tenantId: string) => {
        const { tenants } = get();
        const tenant = tenants.find((t: Tenant) => t.id === tenantId);

        if (tenant) {
          set({
            mode: 'tenant',
            activeTenantId: tenantId,
            currentTenant: tenant,
          });
        } else {
          console.warn(`Tenant with id ${tenantId} not found`);
        }
      },

      setTenants: (tenants: Tenant[]) => {
        set({ tenants });
        // Refresh current tenant if we're in tenant mode
        const { mode, activeTenantId } = get();
        if (mode === 'tenant' && activeTenantId) {
          const currentTenant = tenants.find((t: Tenant) => t.id === activeTenantId);
          if (currentTenant) {
            set({ currentTenant });
          } else {
            // Tenant no longer exists, switch to personal mode
            set({
              mode: 'personal',
              activeTenantId: null,
              currentTenant: null,
            });
          }
        }
      },

      refreshCurrentTenant: () => {
        const { tenants, activeTenantId } = get();
        if (activeTenantId) {
          const currentTenant = tenants.find((t: Tenant) => t.id === activeTenantId);
          set({ currentTenant: currentTenant || null });
        }
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },

      reset: () => {
        set({
          mode: 'personal',
          activeTenantId: null,
          tenants: [],
          currentTenant: null,
        });
      },
    }),
    {
      name: 'tenant-store',
      onRehydrateStorage: () => (state: any) => {
        console.log('Rehydrated tenant store with state:', state);
        state?.setHydrated();
      },
    }
  )
);

export default useTenantStore;
