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
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

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
 */
export function useImageGeneration() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const userId = session?.user?.id;

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
    setSuggestions,
    reset,
  } = useImageGenStore();

  // Conversation store for updating chat UI
  const { updateActiveConversation, setLoadingResponse } =
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
      if (!accessToken) throw new Error('Missing access token');

      console.log('[useImageGeneration] evaluatePrompt - sending:', {
        prompt,
        conversationId: convId,
      });

      return evaluatePrompt(prompt, convId, accessToken);
    },
    onMutate: () => {
      setWorkflow('evaluating');
    },
    onSuccess: response => {
      if (!response.success || !response.data) {
        setError(response.message || 'Failed to evaluate prompt');
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
      if (!accessToken) throw new Error('No access token');

      console.log('[useImageGeneration] analyzeIntent - sending:', {
        request,
        hasImage,
        existingConversationId,
      });

      return analyzeImageIntent(
        request,
        hasImage,
        existingConversationId,
        accessToken,
      );
    },
    onMutate: ({ request }) => {
      startImageGeneration();
      // Add user message to chat (same pattern as useConverstionsStore)
      updateActiveConversation(request, ROLES.USER);
      setLoadingResponse(true);
    },
    onSuccess: async (response, variables) => {
      if (!response.success || !response.data) {
        setError(response.message || 'Failed to analyze intent');
        setLoadingResponse(false);
        return;
      }

      const {
        isEditable: respIsEditable,
        intent: respIntent,
        conversationId: newConversationId,
        userId: newUserId,
      } = response.data;

      console.log('[useImageGeneration] analyzeIntent - result:', {
        isEditable: respIsEditable,
        intent: respIntent,
        conversationId: newConversationId,
      });

      // Store conversation info - IMPORTANT: wait for this before next API calls
      setIntent(respIntent);
      setIsEditable(respIsEditable);
      setConversationId(newConversationId);
      setUserId(newUserId);

      if (respIsEditable) {
        // Workflow #2: Edit flow - need image from user
        setWorkflow('editing');
        // Only add this message if we're in edit mode and need user to upload image
        updateActiveConversation(
          'Please upload the image you want to edit.',
          ROLES.ASSISTANT,
          newConversationId,
        );
        setLoadingResponse(false);
      } else {
        // Workflow #1: Generation flow - auto-chain to evaluatePrompt
        console.log('[useImageGeneration] Auto-chaining to evaluatePrompt...');
        setWorkflow('evaluating');

        // Use the NEW conversationId from the response
        await evaluatePromptMutation.mutateAsync({
          prompt: variables.request,
          convId: newConversationId,
        });
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
        throw new Error(
          `Missing required data: accessToken=${!!accessToken}, convId=${currentConvId}, userId=${currentUserId}`,
        );
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
    },
    onSuccess: response => {
      if (!response.success || !response.data) {
        setError(response.message || 'Failed to add detail');
        setLoadingResponse(false);
        return;
      }

      const {
        evaluation,
        conversationHistory: history,
        messageCount,
      } = response.data;

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
        throw new Error('Missing required data');
      }

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
      if (!response.success || !response.data) {
        setError(response.message || 'Failed to finalize prompt');
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
      const store = useImageGenStore.getState();
      updateActiveConversation(
        'Generating your image...',
        ROLES.ASSISTANT,
        store.conversationId || undefined,
      );

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

      if (!accessToken) throw new Error('No access token');

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
    },
    onSuccess: response => {
      if (!response.success || !response.data) {
        setError(response.message || 'Failed to generate image');
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

      // Add generated image to chat
      updateActiveConversation(
        answer,
        ROLES.ASSISTANT,
        newConversationId || currentConvId || undefined,
        { images: image.url },
      );

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
        throw new Error('Missing required data');
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
    },
    onSuccess: response => {
      if (!response.success || !response.data) {
        setError(response.message || 'Failed to edit image');
        setLoadingResponse(false);
        return;
      }

      const { responseMessage } = response.data;
      const { answer, image } = responseMessage;

      // Handle nested url structure from edit response
      const imageUrl =
        typeof image.url === 'object' ? image.url.url : image.url;

      setGeneratedImage({
        url: imageUrl,
        filename: image.filename,
        service: image.service,
      });

      const store = useImageGenStore.getState();
      updateActiveConversation(
        answer,
        ROLES.ASSISTANT,
        store.conversationId || undefined,
        { images: imageUrl },
      );

      setWorkflow('complete');
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('[useImageGeneration] editImage error:', error);
      setError(error.message);
      setLoadingResponse(false);
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
    ) => {
      // Clear any existing suggestions
      setSuggestions([]);

      if (hasImage && existingImageBase64) {
        startImageEditing(existingImageBase64);
      }

      // Get existing conversation ID from store
      const store = useImageGenStore.getState();

      // This will auto-chain to evaluatePrompt for generation flow
      await analyzeIntentMutation.mutateAsync({
        request: message,
        hasImage,
        existingConversationId: store.conversationId || undefined,
      });
    },
    [analyzeIntentMutation, setSuggestions, startImageEditing],
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
