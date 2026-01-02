'use client';

import {
  addDetail,
  analyzeImageIntent,
  editImage,
  evaluatePrompt,
  finalizePrompt,
  generateImage,
} from '@/actions/imageActions';
import { useImageGenStore } from '@/stores/useImageGenStore';
import { useConversationsStore, ROLES } from '@/stores/useConverstionsStore';
import { useMutation, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Define the conversation type based on useConversationsStore structure
type ProcessedMessage = any;
interface ActiveConversation {
  messages: ProcessedMessage[];
}

/**
 * Helper to build conversation history string
 */
const getHistoryContext = (
  activeConversation: ActiveConversation | null,
): string => {
  if (activeConversation?.messages && activeConversation.messages.length > 0) {
    return activeConversation.messages
      .filter(msg => msg.role === ROLES.USER || msg.role === ROLES.ASSISTANT)
      .map(
        msg =>
          `${msg.role === ROLES.USER ? 'User' : 'Assistant'}: ${msg.content || ''}`,
      )
      .join('\n');
  }
  return '';
};

/**
 * Options for the useImageGeneration hook
 */
interface UseImageGenerationOptions {
  /** Next.js router instance for URL redirects */
  router?: AppRouterInstance;
  /** React Query client for invalidating queries */
  queryClient?: QueryClient;
}

/**
 * Custom hook for managing the enhanced image generation/editing workflow.
 *
 * Workflow #1 (Generation): analyzeIntent → evaluatePrompt → [addDetail loop] → finalizePrompt → generateImage
 * Workflow #2 (Editing): analyzeIntent → editImage
 *
 * Key behaviors:
 * - Suggestions are stored in imageGenStore only, NOT added to main chat
 * - Waits for conversationId from analyzeIntent before subsequent calls
 * - Clears input on submit (handled by ChatInput)
 * - Follows same pattern as useConverstionsStore for message handling
 * - Redirects URL to /c/{conversationId} after initialization (matches standard chat)
 */
export function useImageGeneration(options?: UseImageGenerationOptions) {
  const { router, queryClient } = options || {};
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;
  const pathname = usePathname();

  // Image generation store
  const {
    workflow,
    intent,
    isEditable,
    promptScore,
    suggestions,
    missingElements,
    conversationId,
    conversationHistory,
    enhancedPrompt,
    generatedImage,
    aspectRatio,
    negativePrompt,
    imageBase64,
    error,
    setWorkflow,
    setIntent,
    setIsEditable,
    setConversationId,
    setUserId,
    setConversationHistory,
    setMessageCount,
    setEnhancedPrompt,
    setGeneratedImage,
    setError,
    updateFromEvaluation,
    startImageGeneration,
    startImageEditing,
    prepareForAnalysis,
    setSuggestions,
    reset,
  } = useImageGenStore();

  // console.log('conversationId', conversationId);

  // Conversation store for updating chat UI
  const { updateActiveConversation, setLoadingResponse, setUserMessage } =
    useConversationsStore();

  // ============ Step 2: Evaluate Prompt ============
  const evaluatePromptMutation = useMutation({
    mutationFn: async ({
      prompt,
      convId,
    }: {
      prompt: string;
      convId: string;
    }) => {
      if (!accessToken) {
        console.error('Missing access token');
        return null;
      }

      // Get conversation history from store
      const { activeConversation } = useConversationsStore.getState();

      const historyContext = getHistoryContext(activeConversation);

      console.log('[useImageGeneration] evaluatePrompt - sending:', {
        originalPrompt: prompt,
        fullPrompt: prompt, // prompt is already full if needed, but we pass history separately now
        conversationId: convId,
        historyContextLength: historyContext.length,
      });

      return evaluatePrompt(prompt, convId, historyContext, accessToken);
    },
    onMutate: () => {
      setWorkflow('evaluating');
    },
    onSuccess: response => {
      if (!response?.success && response?.debugMessage) {
        console.error('Action failed:', response.debugMessage);
      }
      if (!response || !response.success || !response.data) {
        setError(response?.message || 'Failed to evaluate prompt');
        setLoadingResponse(false);
        return;
      }

      const { evaluation, conversationId: respConvId } = response.data;

      // Update store with evaluation data (suggestions stored here, NOT in chat)
      updateFromEvaluation(evaluation);

      // Store the conversation ID from response if available
      if (respConvId) {
        setConversationId(respConvId);
      }

      // DO NOT add suggestions to main chat - they're only shown in ImageGenSuggestions component
      // Just set the workflow state appropriately
      if (evaluation.score < 65) {
        setWorkflow('collecting');
      } else {
        setWorkflow('confirming');
      }

      setLoadingResponse(false);
    },
    onError: error => {
      console.error('[useImageGeneration] evaluatePrompt error:', error);
      setError(error.message);
      setLoadingResponse(false);
    },
  });

  // ============ Step 1: Analyze Intent (auto-chains to next step) ============
  const analyzeIntentMutation = useMutation({
    mutationFn: async ({
      request,
      hasImage,
      existingConversationId,
    }: {
      request: string;
      hasImage: boolean;
      existingConversationId?: string;
    }) => {
      if (!accessToken) {
        console.error('No access token');
        return null;
      }

      console.log('[useImageGeneration] analyzeIntent - calling API:', {
        request,
        hasImage,
        conversationId: existingConversationId,
      });

      return analyzeImageIntent(
        request,
        hasImage,
        existingConversationId,
        accessToken,
      );
    },
    onMutate: ({ request, existingConversationId }) => {
      prepareForAnalysis();
      updateActiveConversation(request, ROLES.USER, existingConversationId);

      setLoadingResponse(true);
      setUserMessage('');
    },
    onSuccess: async (response, variables) => {
      if (!response?.success && response?.debugMessage) {
        console.error('Action failed:', response.debugMessage);
      }
      if (!response || !response.success || !response.data) {
        setError(response?.message || 'Failed to analyze intent');
        setLoadingResponse(false);
        return;
      }

      const {
        isEditable: respIsEditable,
        intent: respIntent,
        conversationId: backendConversationId,
        userId: newUserId,
      } = response.data;

      const { request, existingConversationId } = variables;

      // === Handle Redirect for New/Changed Conversation ===
      // Always update the store with the backend conversation ID
      if (backendConversationId) {
        setConversationId(backendConversationId);

        // Determine if we need to redirect
        let needsRedirect =
          !existingConversationId ||
          backendConversationId !== existingConversationId;

        // SAFEGUARD: If intent is edit but no image is uploaded, DO NOT REDIRECT.
        const currentStore = useImageGenStore.getState();
        if (respIsEditable && !currentStore.imageBase64 && needsRedirect) {
          console.log(
            '[useImageGeneration] Blocking redirect for implicit edit without image',
          );
          needsRedirect = false;
        }

        if (needsRedirect) {
          console.log(
            '[useImageGeneration] Redirecting to conversation:',
            backendConversationId,
          );

          // Ensure the User message is associated with this new ID in the store
          // so it persists/shows up after redirect if store state is preserved
          updateActiveConversation(request, ROLES.USER, backendConversationId);

          if (router) {
            router.replace(`/c/${backendConversationId}`);
          }

          // Invalidate conversation list queries
          if (queryClient && accessToken) {
            queryClient.invalidateQueries({
              queryKey: ['conversations', accessToken],
            });
          }
        }
      }

      // Update Local State
      setIntent(respIntent);
      setIsEditable(respIsEditable);
      setUserId(newUserId);

      // Get latest state for decision making
      const store = useImageGenStore.getState();

      // Continue the Flow based on Intent
      if (respIsEditable) {
        // Workflow #2: Edit flow
        // Check if we have an image in the store (set by ChatInput)
        if (store.imageBase64) {
          console.log(
            '[useImageGeneration] Intent is edit and image exists. Triggering edit...',
          );
          // Auto-trigger edit
          await editImageMutation.mutateAsync({
            prompt: request,
            base64: store.imageBase64,
          });
        } else {
          // No image yet - ask user
          console.log(
            '[useImageGeneration] Intent is edit but no image. Asking user...',
          );
          setWorkflow('editing');
          updateActiveConversation(
            'Please upload the image you want to edit.',
            ROLES.ASSISTANT,
            backendConversationId || existingConversationId,
          );
          setLoadingResponse(false);
        }
      } else {
        // Workflow #1: Generation flow
        // STRICT CHECK: Only proceed if original user intent was 'generate'
        if (store.intent === 'generate') {
          console.log('[useImageGeneration] Setting workflow to evaluating');
          setWorkflow('evaluating');

          // Only chain if we didn't redirect (same conversation ID)
          // Fix: Use stored conversationId as fallback for current
          const effectiveCurrentId = existingConversationId;

          if (backendConversationId === effectiveCurrentId) {
            console.log(
              '[useImageGeneration] Staying on same page, letting useEffect handle continuation...',
            );
          } else {
            console.log(
              '[useImageGeneration] Redirecting, letting useEffect handle continuation on new page...',
            );
          }
        } else {
          // Mismatch: User wanted 'edit' (UI), but backend said 'generate' (Content)
          console.warn(
            '[useImageGeneration] Intent mismatch. User: edit, Backend: generate. Stopping.',
          );
          setLoadingResponse(false);
          updateActiveConversation(
            'It looks like you might want to generate a new image instead of editing. To edit, please make sure you attach an image and describe the changes you want to make.',
            ROLES.ASSISTANT,
            backendConversationId || existingConversationId,
          );
        }
      }
    },
    onError: error => {
      console.error('[useImageGeneration] analyzeIntent error:', error);
      setError(error.message);
      setLoadingResponse(false);
    },
  });

  // ============ Step 3: Add Detail ============
  const addDetailMutation = useMutation({
    mutationFn: async ({ detail }: { detail: string }) => {
      // Get current values from store
      const store = useImageGenStore.getState();
      const currentConvId = store.conversationId;
      const currentUserId = store.userId || userId;

      if (!accessToken || !currentConvId || !currentUserId) {
        console.error(
          `Missing required data: accessToken=${!!accessToken}, convId=${currentConvId}, userId=${currentUserId}`,
        );
        return null; // throw new Error(...)
      }

      console.log('[useImageGeneration] addDetail - sending:', {
        conversationId: currentConvId,
        userId: currentUserId,
        detail,
      });

      return addDetail(currentConvId, currentUserId, detail, accessToken);
    },
    onMutate: ({ detail }) => {
      const store = useImageGenStore.getState();
      // Add user message to chat
      updateActiveConversation(
        detail,
        ROLES.USER,
        store.conversationId || undefined,
      );
      // Clear suggestions when user submits new detail
      setSuggestions([]);
      setLoadingResponse(true);
      setUserMessage('');
    },
    onSuccess: response => {
      if (!response?.success && response?.debugMessage) {
        console.error('Action failed:', response.debugMessage);
      }
      if (!response || !response.success || !response.data) {
        setError(response?.message || 'Failed to add detail');
        setLoadingResponse(false);
        return;
      }

      const {
        evaluation,
        conversationHistory: history,
        messageCount,
        conversationId: newConvId,
      } = response.data;

      // Check if conversation ID changed (e.g. from new-chat to real ID)
      const store = useImageGenStore.getState();
      if (newConvId && newConvId !== store.conversationId) {
        console.log(
          '[useImageGeneration] addDetail - conversation ID changed/assigned:',
          newConvId,
        );
        setConversationId(newConvId);
        if (router) {
          router.push(`/c/${newConvId}`);
        }
      }

      // Update store with new evaluation (suggestions go to store, NOT chat)
      updateFromEvaluation(evaluation);
      setConversationHistory(history);
      setMessageCount(messageCount);

      // Just update workflow state - suggestions are in store for component to display
      if (evaluation.score >= 65) {
        setWorkflow('confirming');
      } else {
        setWorkflow('collecting');
      }

      setLoadingResponse(false);
    },
    onError: error => {
      console.error('[useImageGeneration] addDetail error:', error);
      setError(error.message);
      setLoadingResponse(false);
    },
  });

  // ============ Step 4: Finalize Prompt ============
  const finalizePromptMutation = useMutation({
    mutationFn: async () => {
      const store = useImageGenStore.getState();
      const currentConvId = store.conversationId;
      const currentUserId = store.userId || userId;

      if (!accessToken || !currentConvId || !currentUserId) {
        console.error('Missing required data');
        return null;
      }

      // TODO: Add backend sync API here to push conversation to backend
      // This should be called BEFORE finalizePrompt to ensure conversation is saved
      // Example:
      // await syncConversationToBackend(currentConvId, currentUserId, accessToken);

      console.log('[useImageGeneration] finalizePrompt - sending:', {
        conversationId: currentConvId,
        userId: currentUserId,
      });

      return finalizePrompt(currentConvId, currentUserId, accessToken);
    },
    onMutate: () => {
      setWorkflow('finalizing');
      // Clear suggestions
      setSuggestions([]);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response?.success && response?.debugMessage) {
        console.error('Action failed:', response.debugMessage);
      }
      if (!response || !response.success || !response.data) {
        setError(response?.message || 'Failed to finalize prompt');
        setLoadingResponse(false);
        return;
      }

      const { enhancedPrompt: prompt, conversationHistory: history } =
        response.data;

      setEnhancedPrompt(prompt);
      setConversationHistory(history);

      console.log(
        '[useImageGeneration] finalizePrompt - enhanced prompt:',
        prompt,
      );

      // Add a simple "generating" message to chat
      // const store = useImageGenStore.getState();

      setWorkflow('generating');
    },
    onError: error => {
      console.error('[useImageGeneration] finalizePrompt error:', error);
      setError(error.message);
      setLoadingResponse(false);
    },
  });

  // ============ Step 5: Generate Image ============
  const generateImageMutation = useMutation({
    mutationFn: async ({ prompt }: { prompt: string }) => {
      const store = useImageGenStore.getState();
      const currentConvId = store.conversationId;
      const currentUserId = store.userId || userId;
      const currentAspectRatio = store.aspectRatio;
      const currentNegativePrompt = store.negativePrompt;

      if (!accessToken) {
        console.error('No access token');
        return null;
      }

      console.log('[useImageGeneration] generateImage - sending:', {
        prompt,
        aspectRatio: currentAspectRatio,
        negativePrompt: currentNegativePrompt || undefined,
        conversationId: currentConvId,
        userId: currentUserId,
      });

      return generateImage(
        prompt,
        accessToken,
        currentAspectRatio,
        currentNegativePrompt || undefined,
        currentConvId || undefined,
        currentUserId || undefined,
      );
    },
    onMutate: () => {
      setWorkflow('generating');
      setLoadingResponse(true);
      setUserMessage('');
    },
    onSuccess: response => {
      if (!response?.success && response?.debugMessage) {
        console.error('Action failed:', response.debugMessage);
      }
      if (!response || !response.success || !response.data) {
        setError(response?.message || 'Failed to generate image');
        setLoadingResponse(false);
        return;
      }

      const { responseMessage, conversationId: newConversationId } =
        response.data;
      const { answer, image } = responseMessage;

      setGeneratedImage({
        url: image.url,
        filename: image.filename,
        service: image.service,
        reasoning: image.reasoning,
      });

      const store = useImageGenStore.getState();
      const currentConvId = store.conversationId;

      if (newConversationId && !currentConvId) {
        setConversationId(newConversationId);
      }

      // Only add to chat if we have an image
      if (image && image.url) {
        updateActiveConversation(
          '', // No text, only image
          ROLES.ASSISTANT,
          newConversationId || currentConvId || undefined,
          { imageUrl: image.url },
        );
      }

      setWorkflow('complete');
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('[useImageGeneration] generateImage error:', error);
      setError(error.message);
      setLoadingResponse(false);
    },
  });

  // ============ Edit Flow: Edit Image ============
  const editImageMutation = useMutation({
    mutationFn: async ({
      prompt,
      base64,
    }: {
      prompt: string;
      base64: string;
    }) => {
      const store = useImageGenStore.getState();
      const currentConvId = store.conversationId;
      const currentUserId = store.userId || userId;
      const currentAspectRatio = store.aspectRatio;

      if (!accessToken || !currentConvId || !currentUserId) {
        console.error('Missing required data');
        return null;
      }

      console.log('[useImageGeneration] editImage - sending:', {
        prompt,
        conversationId: currentConvId,
        userId: currentUserId,
        aspectRatio: currentAspectRatio,
        imageBase64Length: base64.length,
      });

      return editImage(
        prompt,
        base64,
        currentConvId,
        currentUserId,
        accessToken,
        currentAspectRatio,
      );
    },
    onMutate: ({ prompt }) => {
      const store = useImageGenStore.getState();
      updateActiveConversation(
        prompt,
        ROLES.USER,
        store.conversationId || undefined,
      );
      setWorkflow('editing');
      setLoadingResponse(true);
      setUserMessage('');
    },
    onSuccess: response => {
      if (!response?.success && response?.debugMessage) {
        console.error('Action failed:', response.debugMessage);
      }
      if (!response || !response.success || !response.data) {
        const errorMsg = response?.message || 'Failed to edit image';
        setError(errorMsg);
        setLoadingResponse(false);

        console.log(
          '[useImageGeneration] editImage error - sending error message:',
          errorMsg,
        );
        const store = useImageGenStore.getState();
        updateActiveConversation(
          `Retry: ${errorMsg}`,
          ROLES.ASSISTANT,
          store.conversationId || undefined,
        );
        return;
      }

      const { responseMessage } = response.data;
      const { answer, image } = responseMessage;

      console.log(
        '[useImageGeneration] editImage success - image object:',
        image,
      );

      // Handle nested url structure from edit response
      // The server sometimes returns { url: { url: "..." } } or just { url: "..." }
      const imageUrl =
        typeof image.url === 'object' &&
        image.url !== null &&
        'url' in image.url
          ? (image.url as any).url
          : image.url;

      console.log(
        '[useImageGeneration] editImage - extracted imageUrl:',
        imageUrl,
      );

      setGeneratedImage({
        url: imageUrl,
        filename: image.filename,
        service: image.service,
      });

      const store = useImageGenStore.getState();
      console.log(
        '[useImageGeneration] editImage - updating conversation with:',
        {
          answer,
          conversationId: store.conversationId,
          imageUrl,
        },
      );

      // 1. Update Zustand Store (Local State)
      // Only add to chat if we have an image
      if (imageUrl) {
        updateActiveConversation(
          '', // No text, only image
          ROLES.ASSISTANT,
          store.conversationId || undefined,
          { imageUrl: imageUrl },
        );

        // 2. Update React Query Cache (Server State)
        if (store.conversationId && accessToken && queryClient) {
          queryClient.setQueryData(
            ['activeConversation', store.conversationId, accessToken],
            (oldData: any) => {
              if (!oldData) return oldData;

              const newMessage = {
                role: ROLES.ASSISTANT,
                content: '', // No text
                metadata: {
                  imageUrl: imageUrl,
                },
                timestamp: new Date().toISOString(),
              };

              return {
                ...oldData,
                messages: [...(oldData.messages || []), newMessage],
              };
            },
          );
        }
      }

      setWorkflow('complete');
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('[useImageGeneration] editImage error:', error);
      setError(error.message);
      setLoadingResponse(false);

      const store = useImageGenStore.getState();
      updateActiveConversation(
        `${error.message}`,
        ROLES.ASSISTANT,
        store.conversationId || undefined,
      );
    },
  });

  // ============ Workflow Handlers ============

  /**
   * Start the image generation workflow with a user message.
   * Automatically chains: analyzeIntent → evaluatePrompt (for generation)
   * Input is cleared by ChatInput after calling this.
   */
  const handleImageRequest = useCallback(
    async (
      message: string,
      hasImage: boolean = false,
      existingImageBase64?: string,
      outgoingConversationId?: string,
    ) => {
      // Clear any existing suggestions
      setSuggestions([]);
      hasResumedEvaluation.current = false;

      // If we have an explicit conversation ID from the UI (e.g. existing chat),
      // ensure it's set in the store so all subsequent steps use it.
      if (outgoingConversationId) {
        console.log(
          '[useImageGeneration] handleImageRequest outgoingConversationId',
          outgoingConversationId,
        );
        setConversationId(outgoingConversationId);
      }

      // Use the explicit ID if available, otherwise fall back to what's in the store
      // (which might have just been set above, or exists from a previous step)
      const currentConversationId =
        outgoingConversationId || useImageGenStore.getState().conversationId;
      console.log(
        '[useImageGeneration] handleImageRequest currentConversationId',
        currentConversationId,
      );

      if (hasImage && existingImageBase64) {
        startImageEditing(existingImageBase64);
      } else {
        const store = useImageGenStore.getState();
        if (store.intent === 'edit') {
          // Keep it as edit
        } else {
          startImageGeneration();
        }
      }

      // Check if we have prior images in the conversation history
      const { activeConversation } = useConversationsStore.getState();
      const hasPriorImages =
        activeConversation?.messages?.some(
          msg => msg.metadata?.imageUrl || msg.metadata?.images,
        ) ?? false;

      console.log('[useImageGeneration] handleImageRequest check:', {
        conversationId: {
          store: useImageGenStore.getState().conversationId,
          outgoing: outgoingConversationId,
          effective: currentConversationId,
        },
        hasPriorImages,
        message,
      });

      // SPLIT WORKFLOW:
      // 1. Existing Chat + Has Prior Images -> Direct Generation (Skip Analyze/Evaluate)
      // 2. New Chat OR No Prior Images -> Full Analyze-Evaluate Flow

      if (currentConversationId && hasPriorImages && !hasImage) {
        console.log(
          '[useImageGeneration] Existing context detected. Skipping analysis, going straight to generation.',
        );

        // Update UI immediately
        updateActiveConversation(
          message,
          ROLES.USER,
          currentConversationId || undefined,
        );

        // Call Generate Directly
        await generateImageMutation.mutateAsync({
          prompt: message,
        });
      } else {
        // Full Flow (Analyze -> Evaluate -> ...)
        console.log(
          '[useImageGeneration] New context or no prior images. Starting full analysis workflow.',
        );

        await analyzeIntentMutation.mutateAsync({
          request: message, // Send ONLY the recent message, backend handles history if needed for analysis
          hasImage,
          existingConversationId: currentConversationId || undefined,
        });
      }
    },
    [
      analyzeIntentMutation,
      setSuggestions,
      startImageEditing,
      startImageGeneration,
    ],
  );

  /**
   * Handle user confirmation (Yes/No) when score >= 65.
   * If No: finalizePrompt → generateImage (auto-chained)
   * If Yes: stay in collecting mode for more details
   */
  const handleUserConfirmation = useCallback(
    async (wantsMoreDetails: boolean) => {
      if (wantsMoreDetails) {
        // User wants to add more details - stay in collecting mode
        setWorkflow('collecting');
      } else {
        // User is done - finalize and generate (auto-chain)
        console.log(
          '[useImageGeneration] User confirmed - finalizing and generating...',
        );

        await finalizePromptMutation.mutateAsync();

        // Get the enhanced prompt from store after finalize
        const store = useImageGenStore.getState();
        const finalPrompt = store.enhancedPrompt;
        console.log('[useImageGeneration] Using enhanced prompt:', finalPrompt);

        if (finalPrompt) {
          await generateImageMutation.mutateAsync({ prompt: finalPrompt });
        }
      }
    },
    [setWorkflow, finalizePromptMutation, generateImageMutation],
  );

  /**
   * Handle adding a detail message during the collection phase.
   * Called when user hits enter - input is cleared by ChatInput.
   * Suggestions are cleared and new ones loaded from response.
   */
  const handleAddDetail = useCallback(
    async (detail: string) => {
      await addDetailMutation.mutateAsync({ detail });
    },
    [addDetailMutation],
  );

  /**
   * Trigger image generation with the enhanced prompt
   */
  const handleGenerateImage = useCallback(async () => {
    const store = useImageGenStore.getState();
    const promptToUse = store.enhancedPrompt || '';
    if (!promptToUse) {
      setError('No prompt available for generation');
      return;
    }
    await generateImageMutation.mutateAsync({ prompt: promptToUse });
  }, [generateImageMutation, setError]);

  /**
   * Handle image editing
   */
  const handleEditImage = useCallback(
    async (prompt: string, base64: string) => {
      await editImageMutation.mutateAsync({ prompt, base64 });
    },
    [editImageMutation],
  );

  // ============ Effect: Resume Flow After Redirect ============
  // This handles the "analyze -> redirect -> evaluate" transition
  const hasResumedEvaluation = useRef(false);

  useEffect(() => {
    // Only run if we are in 'evaluating' state and NOT currently processing

    if (
      workflow === 'evaluating' &&
      !evaluatePromptMutation.isPending &&
      !hasResumedEvaluation.current
    ) {
      // Check if we have a conversation ID and we are on the correct page for it
      // Wait for the URL to reflect the new conversation ID before continuing
      if (conversationId && accessToken && pathname?.includes(conversationId)) {
        console.log(
          '[useImageGeneration] Resuming evaluation flow for conversation:',
          conversationId,
        );

        // We need to find the prompt from the history since it's not passed via URL
        const { activeConversation } = useConversationsStore.getState();

        // Find the last user message
        // This assumes the user message was added to the history before redirect
        const lastUserMessage = activeConversation?.messages
          ?.filter(m => m.role === ROLES.USER)
          ?.slice(-1)[0]?.content;

        if (lastUserMessage) {
          console.log(
            '[useImageGeneration] Found pending prompt from history:',
            lastUserMessage,
          );
          hasResumedEvaluation.current = true;
          evaluatePromptMutation.mutate({
            prompt: lastUserMessage,
            convId: conversationId,
          });
        } else {
          console.warn(
            '[useImageGeneration] Could not find pending prompt in history to resume evaluation',
          );
        }
      }
    }
  }, [workflow, conversationId, accessToken, pathname, evaluatePromptMutation]);

  // Computed states
  const isLoading =
    analyzeIntentMutation.isPending ||
    evaluatePromptMutation.isPending ||
    addDetailMutation.isPending ||
    finalizePromptMutation.isPending ||
    generateImageMutation.isPending ||
    editImageMutation.isPending;

  const shouldShowConfirmation = workflow === 'confirming' && promptScore >= 65;
  const isCollectingDetails = workflow === 'collecting';
  const isImageWorkflowActive =
    workflow !== 'idle' && workflow !== 'complete' && workflow !== 'error';

  return {
    // State
    workflow,
    intent,
    isEditable,
    promptScore,
    suggestions,
    missingElements,
    conversationId,
    conversationHistory,
    enhancedPrompt,
    generatedImage,
    aspectRatio,
    imageBase64,
    error,

    // Computed
    isLoading,
    shouldShowConfirmation,
    isCollectingDetails,
    isImageWorkflowActive,

    // Actions
    handleImageRequest,
    handleUserConfirmation,
    handleAddDetail,
    handleGenerateImage,
    handleEditImage,
    reset,

    // Mutations (for advanced usage)
    analyzeIntentMutation,
    evaluatePromptMutation,
    addDetailMutation,
    finalizePromptMutation,
    generateImageMutation,
    editImageMutation,

    // Store setters
    setAspectRatio: useImageGenStore.getState().setAspectRatio,
    setNegativePrompt: useImageGenStore.getState().setNegativePrompt,
    setImageBase64: useImageGenStore.getState().setImageBase64,
  };
}
