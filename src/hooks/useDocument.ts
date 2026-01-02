import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { useConversationsStore, ROLES } from '@/stores/useConverstionsStore';
import {
  generateDocument,
  startDocumentConversation,
  continueDocumentConversation,
  submitDirectReview,
  uploadReviewDocumentAssistant,
} from '@/actions/documentActions';

export function useDocument() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const {
    drafting,
    setDraftingMode,
    resetDrafting,
    startDrafting,
    review,
    setReviewMode,
    resetReview,
    startReview,
  } = useDocumentStore();

  const {
    updateActiveConversation,
    setLoadingResponse,
    setUserMessage,
    activeConversation,
  } = useConversationsStore();

  const [isLoading, setIsLoading] = useState(false);

  // --- Drafting Mutations ---

  // Helper to reset both modes
  const resetAll = () => {
    resetDrafting();
    resetReview();
  };

  // --- Drafting Mutations ---

  const directDraftingMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!accessToken) {
        console.error('No access token');
        return null;
      }

      const { config } = drafting;

      return await generateDocument(
        {
          content,
          documentType: config.docType,
          tone: config.tone,
          length: config.length,
          outputFormat: config.format,
          template: config.template,
          includeDate: true,
          includeTitle: true,
        },
        accessToken,
      );
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response || !response.success) {
        console.error(
          'Failed to generate document:',
          response?.debugMessage || 'Unknown error',
        );
        const errorMessage = response?.message || 'Failed to generate document';
        updateActiveConversation(errorMessage, ROLES.ASSISTANT);
      } else if (response.data) {
        const { document } = response.data;
        if (document && document.url) {
          const messageContent = response.message;
          updateActiveConversation(messageContent, ROLES.ASSISTANT, undefined, {
            document: document,
          });
        }
      }

      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Direct drafting error:', error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onSettled: () => {
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  const assistantDraftingMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      if (!accessToken) {
        console.error('No access token');
        return null;
      }
      return await startDocumentConversation({ message }, accessToken);
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response || !response.success) {
        console.error(
          'Assistant drafting failed:',
          response?.debugMessage || 'Unknown error',
        );
        updateActiveConversation(
          response?.message || 'An error occurred.',
          ROLES.ASSISTANT,
        );
      } else if (response.data) {
        const { conversationId, message, document } = response.data;

        if (conversationId) {
          router.replace(`/c/${conversationId}`);
          updateActiveConversation(message, ROLES.ASSISTANT, conversationId, {
            ...(document && { document: document }),
          });
        }
      }
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Assistant drafting error:', error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onSettled: () => {
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  const assistantContinueMutation = useMutation({
    mutationFn: async ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) => {
      if (!accessToken) {
        console.error('No access token');
        return null;
      }
      return await continueDocumentConversation(
        { conversationId, message },
        accessToken,
      );
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response || !response.success) {
        console.error(
          'Assistant continue drafting failed:',
          response?.debugMessage || 'Unknown error',
        );
        updateActiveConversation(
          response?.message || 'An error occurred.',
          ROLES.ASSISTANT,
        );
      } else if (response.data) {
        const { message, document } = response.data;
        updateActiveConversation(message, ROLES.ASSISTANT, undefined, {
          ...(document && { document: document }),
        });
      }
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Assistant continue drafting error:', error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onSettled: () => {
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Review Mutations ---

  const directReviewMutation = useMutation({
    mutationFn: async ({
      file,
      additionalInstructions,
    }: {
      file?: File;
      additionalInstructions?: string;
    }) => {
      if (!accessToken) {
        console.error('No access token');
        return null;
      }
      const { config } = review;

      const formData = new FormData();
      file && formData.append('file', file);
      formData.append('reviewType', config.reviewType);
      formData.append('reviewDepth', config.reviewDepth);
      formData.append('documentType', config.documentType);
      if (additionalInstructions) {
        formData.append('additionalInstructions', additionalInstructions);
      }
      if (config.additionalInstructions) {
        // combine or prefer explicit arg? config might store it too if we add UI for it
        // let's prefer method arg for now if passed, else config
      }

      return await submitDirectReview(formData, accessToken);
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response || !response.success) {
        console.error(
          'Direct review failed:',
          response?.debugMessage || 'Unknown error',
        );
        const errorMessage = response?.message || 'Failed to review document';
        updateActiveConversation(errorMessage, ROLES.ASSISTANT);
      } else if (response.data) {
        const { review: reviewContent, documentInfo } = response.data;
        // Display review content
        // Assuming we want to show it as an assistant message
        updateActiveConversation(
          reviewContent || 'Review complete.',
          ROLES.ASSISTANT,
        );
      }
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Direct review error:', error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onSettled: () => {
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  const assistantReviewMutation = useMutation({
    mutationFn: async ({
      file,
      message,
      conversationId,
    }: {
      file?: File;
      message: string;
      conversationId?: string;
    }) => {
      if (!accessToken) {
        console.error('No access token');
        return null;
      }
      const formData = new FormData();
      formData.append('message', message);
      file && formData.append('file', file);
      conversationId && formData.append('conversationId', conversationId);

      return await uploadReviewDocumentAssistant(formData, accessToken);
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response || !response.success) {
        console.error(
          'Assistant review failed:',
          response?.debugMessage || 'Unknown error',
        );
        updateActiveConversation(
          response?.message || 'Failed to upload document.',
          ROLES.ASSISTANT,
        );
      } else if (response.data) {
        const { conversationId, response: assistantResponse } = response.data;
        if (conversationId) {
          router.replace(`/c/${conversationId}`);
          updateActiveConversation(
            assistantResponse || 'Document uploaded.',
            ROLES.ASSISTANT,
            conversationId,
          );
        }
      }
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Assistant review error:', error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onSettled: () => {
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Draft Handlers ---

  const handleDirectDrafting = async (content: string) => {
    setUserMessage('');
    updateActiveConversation(content, ROLES.USER);
    await directDraftingMutation.mutateAsync({ content });
  };

  const handleAssistantDrafting = async (message: string) => {
    setUserMessage('');
    updateActiveConversation(message, ROLES.USER);
    const currentId = activeConversation?.conversationId;
    const isEditingExisting =
      currentId && currentId !== 'new-chat' && pathname.startsWith('/c/');

    if (isEditingExisting) {
      await assistantContinueMutation.mutateAsync({
        conversationId: currentId,
        message,
      });
    } else {
      await assistantDraftingMutation.mutateAsync({ message });
    }
  };

  // Review Handlers
  const handleDirectReview = async (file?: File, instructions?: string) => {
    updateActiveConversation(
      `Reviewing document: ${file && file.name}`,
      ROLES.USER,
    );
    await directReviewMutation.mutateAsync({
      file,
      additionalInstructions: instructions,
    });
  };

  const handleAssistantReview = async (file: File, message: string) => {
    setUserMessage('');
    updateActiveConversation(message, ROLES.USER, undefined, {});

    const currentId = activeConversation?.conversationId;
    const isEditingExisting =
      currentId && currentId !== 'new-chat' && pathname.startsWith('/c/');

    if (isEditingExisting) {
      await assistantReviewMutation.mutateAsync({
        file,
        message,
        conversationId: currentId,
      });
    } else {
      await assistantReviewMutation.mutateAsync({ file, message });
    }
  };

  return {
    drafting,
    review,
    startDrafting,
    startReview,
    handleDirectDrafting,
    handleAssistantDrafting,
    handleDirectReview,
    handleAssistantReview,
    setDraftingMode,
    setReviewMode,
    isLoading: isLoading,
    resetDrafting,
    resetReview,
  };
}
