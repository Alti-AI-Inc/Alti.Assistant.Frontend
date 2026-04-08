'use client';

import { useSidebarStore } from '@/stores/useSidebarStore';
import { useCallback } from 'react';

/**
 * Hook to manage multiple left sidebars on the Spaces page
 * Provides convenient methods to control all sidebars at once
 */
export const useMultiSidebar = () => {
  const store = useSidebarStore();

  /**
   * Open all sidebars
   */
  const openAll = useCallback(() => {
    store.setLeftSidebar2Open(true);
    store.setLeftSidebar3Open(true);
  }, [store]);

  /**
   * Close all sidebars
   */
  const closeAll = useCallback(() => {
    store.setLeftSidebar2Open(false);
    store.setLeftSidebar3Open(false);
  }, [store]);

  /**
   * Toggle all sidebars
   */
  const toggleAll = useCallback(() => {
    store.toggleLeftSidebar2();
    store.toggleLeftSidebar3();
  }, [store]);

  /**
   * Toggle one sidebar while keeping state of others
   */
  const toggleSidebar = useCallback(
    (sidebar: 'left2' | 'left3') => {
      switch (sidebar) {
        case 'left2':
          store.toggleLeftSidebar2();
          break;
        case 'left3':
          store.toggleLeftSidebar3();
          break;
      }
    },
    [store],
  );

  /**
   * Get all sidebar states
   */
  const getStates = useCallback(
    () => ({
      left2: store.isLeftSidebar2Open,
      left3: store.isLeftSidebar3Open,
    }),
    [store.isLeftSidebar2Open, store.isLeftSidebar3Open],
  );

  /**
   * Set specific sidebar state
   */
  const setSidebarOpen = useCallback(
    (sidebar: 'left2' | 'left3', isOpen: boolean) => {
      switch (sidebar) {
        case 'left2':
          store.setLeftSidebar2Open(isOpen);
          break;
        case 'left3':
          store.setLeftSidebar3Open(isOpen);
          break;
      }
    },
    [store],
  );

  return {
    openAll,
    closeAll,
    toggleAll,
    toggleSidebar,
    getStates,
    setSidebarOpen,
    // Also expose individual state
    isLeftSidebar2Open: store.isLeftSidebar2Open,
    isLeftSidebar3Open: store.isLeftSidebar3Open,
  };
};
