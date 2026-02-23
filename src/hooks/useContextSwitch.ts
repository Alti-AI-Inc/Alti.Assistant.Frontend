'use client';

import { useEffect, useRef } from 'react';
import useTenantStore from '@/stores/useTenantStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { useKnowledgebaseStore } from '@/stores/useKnowledgebaseStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { useImageGenStore } from '@/stores/useImageGenStore';

/**
 * Hook that listens to tenant context switches and clears all data stores
 * when switching between personal and organization modes.
 * This ensures data isolation between contexts.
 */
export function useContextSwitch() {
  const { mode, activeTenantId } = useTenantStore();
  const prevModeRef = useRef<string | null>(null);
  const prevTenantIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Skip the first render (initialization)
    if (prevModeRef.current === null) {
      prevModeRef.current = mode;
      prevTenantIdRef.current = activeTenantId;
      return;
    }

    // Detect context switch: mode changed OR (in tenant mode AND tenant changed)
    const modeChanged = prevModeRef.current !== mode;
    const tenantChanged =
      mode === 'tenant' &&
      prevTenantIdRef.current !== activeTenantId &&
      activeTenantId !== null;

    if (modeChanged || tenantChanged) {
      console.log('[useContextSwitch] Context switch detected:', {
        from: { mode: prevModeRef.current, tenant: prevTenantIdRef.current },
        to: { mode, tenant: activeTenantId },
      });

      // Clear all conversation-related stores
      const clearConversationData = useConversationsStore.getState().clearConversationData;
      if (clearConversationData) {
        clearConversationData();
      }

      // Clear knowledge base store
      const clearKnowledgeBaseData = useKnowledgebaseStore.getState().clearKnowledgeBaseData;
      if (clearKnowledgeBaseData) {
        clearKnowledgeBaseData();
      }

      // Clear document store if it has a clear function
      const documentStore = useDocumentStore.getState();
      if ('clearDocumentData' in documentStore && typeof documentStore.clearDocumentData === 'function') {
        (documentStore as { clearDocumentData: () => void }).clearDocumentData();
      }

      // Clear image generation store if it has a clear function
      const imageGenStore = useImageGenStore.getState();
      if ('clearImageGenData' in imageGenStore && typeof imageGenStore.clearImageGenData === 'function') {
        (imageGenStore as { clearImageGenData: () => void }).clearImageGenData();
      }

      console.log('[useContextSwitch] All stores cleared for new context');

      // Update refs for next comparison
      prevModeRef.current = mode;
      prevTenantIdRef.current = activeTenantId;
    }
  }, [mode, activeTenantId]);
}
