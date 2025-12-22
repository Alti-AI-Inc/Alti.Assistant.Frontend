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
} from '@/actions/documentActions';

export function useDocumentDrafting() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const { drafting, setDraftingMode, resetDrafting, startDrafting } =
    useDocumentStore();
  const {
    updateActiveConversation,
    setLoadingResponse,
    setUserMessage,
    activeConversation,
  } = useConversationsStore();

  const [isDraftingLoading, setIsDraftingLoading] = useState(false);

  // --- API Mutations ---

  const directDraftingMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!accessToken) throw new Error('No access token');

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
          // Language isn't in store yet, defaulting to 'en' or optional
        },
        accessToken,
      );
    },
    onMutate: () => {
      setIsDraftingLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: (response, variables) => {
      if (!response.success || !response.data) {
        console.error('Failed to generate document', response);
        // Handle error specifically if needed
        return;
      }

      const { document } = response.data;
      if (document && document.url) {
        // Create an assistant message with the document
        // Use the message returned from the server action
        const messageContent = response.message;

        // Update the conversation with the assistant's response
        // We pass undefined for conversationId to maintain the current conversation state/ID
        // This ensures no redirect happens and the message is preserved in the history
        updateActiveConversation(messageContent, ROLES.ASSISTANT, undefined, {
          document: document,
        });
      }

      resetDrafting(); // Workflow complete
      setIsDraftingLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Direct drafting error:', error);
      setIsDraftingLoading(false);
      setLoadingResponse(false);
    },
  });

  const assistantDraftingMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      if (!accessToken) throw new Error('No access token');

      return await startDocumentConversation({ message }, accessToken);
    },
    onMutate: () => {
      setIsDraftingLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (response.success && response.data) {
        const { conversationId, message } = response.data;

        // Redirect logic
        if (conversationId) {
          router.replace(`/c/${conversationId}`);

          // Update conversation store with the assistant's response so it appears immediately
          // even before the redirect fully loads the new page data
          const { document } = response.data;
          updateActiveConversation(message, ROLES.ASSISTANT, conversationId, {
            ...(document && { document: document }),
          });
        }
      }
      resetDrafting();
      setIsDraftingLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Assistant drafting error:', error);
      setIsDraftingLoading(false);
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
      if (!accessToken) throw new Error('No access token');
      console.log('continueDocumentConversation', {
        conversationId,
        message,
      });
      return await continueDocumentConversation(
        { conversationId, message },
        accessToken,
      );
    },
    onMutate: () => {
      setIsDraftingLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (response.success && response.data) {
        const { message, document } = response.data;
        updateActiveConversation(message, ROLES.ASSISTANT, undefined, {
          ...(document && { document: document }),
        });
      }
      resetDrafting();
      setIsDraftingLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Assistant continue drafting error:', error);
      setIsDraftingLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Handlers ---

  const handleDirectDrafting = async (content: string) => {
    setUserMessage(''); // Clear input
    // Add user message to UI
    updateActiveConversation(content, ROLES.USER);

    await directDraftingMutation.mutateAsync({ content });
  };

  const handleAssistantDrafting = async (message: string) => {
    setUserMessage('');
    updateActiveConversation(message, ROLES.USER);
    const currentId = activeConversation?.conversationId;
    const isEditingExisting =
      currentId && currentId !== 'new-chat' && pathname.startsWith('/c/');
    console.log('isEditingExisting', isEditingExisting);
    if (isEditingExisting) {
      await assistantContinueMutation.mutateAsync({
        conversationId: currentId,
        message,
      });
    } else {
      await assistantDraftingMutation.mutateAsync({ message });
    }
  };

  return {
    drafting,
    startDrafting,
    handleDirectDrafting,
    handleAssistantDrafting,
    setDraftingMode,
    isLoading: isDraftingLoading,
    resetDrafting,
  };
}
