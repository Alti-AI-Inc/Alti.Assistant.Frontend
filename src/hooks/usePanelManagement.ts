'use client';

import { useColumnPanelStore } from '@/stores/useColumnPanelStore';
import { useCallback } from 'react';

/**
 * Hook to manage column panels on the Spaces page
 * Provides convenient methods to control panels
 */
export const usePanelManagement = () => {
  const store = useColumnPanelStore();

  /**
   * Toggle a single panel
   */
  const togglePanel = useCallback(
    (panelId: 'panel1' | 'panel2' | 'panel3') => {
      store.togglePanel(panelId);
    },
    [store],
  );

  /**
   * Show all panels
   */
  const showAllPanels = useCallback(() => {
    store.showAllPanels();
  }, [store]);

  /**
   * Hide all panels
   */
  const hideAllPanels = useCallback(() => {
    store.hideAllPanels();
  }, [store]);

  /**
   * Reset all panels to default
   */
  const resetAllPanels = useCallback(() => {
    store.resetAllPanels();
  }, [store]);

  /**
   * Resize a single panel
   */
  const resizePanel = useCallback(
    (panelId: 'panel1' | 'panel2' | 'panel3', width: number) => {
      store.setPanelWidth(panelId, width);
    },
    [store],
  );

  /**
   * Get all panel states
   */
  const getPanelStates = useCallback(
    () => ({
      panel1: store.panels.panel1,
      panel2: store.panels.panel2,
      panel3: store.panels.panel3,
    }),
    [store.panels],
  );

  /**
   * Get count of visible panels
   */
  const getVisiblePanelCount = useCallback(() => {
    return [
      store.panels.panel1.isVisible,
      store.panels.panel2.isVisible,
      store.panels.panel3.isVisible,
    ].filter(Boolean).length;
  }, [store.panels]);

  return {
    togglePanel,
    showAllPanels,
    hideAllPanels,
    resetAllPanels,
    resizePanel,
    getPanelStates,
    getVisiblePanelCount,
    // Direct store access for advanced use cases
    store,
  };
};
