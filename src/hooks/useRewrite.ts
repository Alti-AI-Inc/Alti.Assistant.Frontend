import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useConversationsStore, ROLES } from '@/stores/useConverstionsStore';
import {
  submitDirectRewrite,
  handleRewriteRequest,
} from '@/actions/rewriteActions';

export function useRewrite() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const {
    rewriteConfig,
    rewriteMode,
    setRewriteMode,
    setRewriteConfig,
    updateRewriteConfig,
    resetRewriteConfig,
    updateActiveConversation,
    setLoadingResponse,
    setUserMessage,
    activeConversation,
  } = useConversationsStore();

  const [isLoading, setIsLoading] = useState(false);

  // Helper to reset config
  const resetAll = () => {
    resetRewriteConfig();
  };

  // --- Direct Rewrite Mutation ---
  const directRewriteMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!accessToken) throw new Error('No access token');
      const {
        intent,
        style,
        mode,
        outputFormat,
        targetAudience,
        additionalInstructions,
      } = rewriteConfig;

      return await submitDirectRewrite(
        {
          textContent: content,
          intent,
          style,
          mode,
          outputFormat,
          targetAudience,
          additionalInstructions,
        },
        accessToken,
      );
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (response.success && response.data) {
        const { rewrittenContent, message } = response.data;
        const result = rewrittenContent || message || 'Rewrite complete.';
        // For direct rewrite, we verify if there's a file?
        // API example 1 has "file": null.
        updateActiveConversation(result, ROLES.ASSISTANT);
      } else {
        const errorMessage = response.message || 'Failed to rewrite text';
        updateActiveConversation(errorMessage, ROLES.ASSISTANT);
      }
      resetAll();
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error('Direct rewrite error:', error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Assistant Rewrite Mutation (Unified) ---
  const assistantRewriteMutation = useMutation({
    mutationFn: async ({
      message,
      textContent,
      file,
      conversationId,
    }: {
      message: string;
      textContent?: string;
      file?: File;
      conversationId?: string;
    }) => {
      if (!accessToken) throw new Error('No access token');

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message', message);
        if (conversationId) formData.append('conversationId', conversationId);
        return await handleRewriteRequest(formData, accessToken);
      } else if (textContent) {
        return await handleRewriteRequest(
          { message, textContent, ...(conversationId && { conversationId }) },
          accessToken,
        );
      } else if (conversationId) {
        // Continue conversation - Pattern 2
        // Pass textContent if available (now supported)
        return await handleRewriteRequest(
          { message, textContent: textContent || '', conversationId },
          accessToken,
        );
      }
      throw new Error('Invalid parameters for assistant rewrite');
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (response.success && response.data) {
        const { conversationId, message, rewrittenContent, file } =
          response.data;

        if (conversationId) {
          router.replace(`/c/${conversationId}`);

          // Construct message to update in store
          // If we have a file, does the backend include it in message?
          // The response.data.file is metadata about the file.
          // We can update the conversation with the text content.
          // Backend usually syncs DB, so basic router replace fetches it.
          // But to be snappy, we update local store too.

          const displayContent = rewrittenContent || message || 'Processed.';

          // If response has a file, we might want to attach it to the message in store?
          // updateActiveConversation accepts options for documents/images.
          // But response.data.file type matches what we might expect?
          // Let's just pass displayContent for now to be safe.

          updateActiveConversation(
            displayContent,
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
      console.error('Assistant rewrite error:', error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Handlers ---

  const handleDirectRewrite = async (content: string) => {
    setUserMessage('');
    updateActiveConversation(content, ROLES.USER);
    await directRewriteMutation.mutateAsync({ content });
  };

  const handleAssistantRewrite = async (
    message: string,
    textContent?: string,
    file?: File,
  ) => {
    setUserMessage('');
    updateActiveConversation(message, ROLES.USER);

    const currentId = activeConversation?.conversationId;
    const isEditingExisting =
      currentId && currentId !== 'new-chat' && pathname.startsWith('/c/');

    if (isEditingExisting) {
      // Continue
      await assistantRewriteMutation.mutateAsync({
        message,
        conversationId: currentId,
        // file? user might upload file in continue? assuming yes if passed
        file,
      });
    } else {
      // New Chat
      await assistantRewriteMutation.mutateAsync({
        message,
        textContent,
        file,
      });
    }
  };

  return {
    rewriteConfig,
    rewriteMode,
    setRewriteMode,
    setRewriteConfig,
    updateRewriteConfig,
    handleDirectRewrite,
    handleAssistantRewrite,
    isLoading,
    resetRewriteConfig,
  };
}
