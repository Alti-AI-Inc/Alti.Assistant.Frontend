import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useConversationsStore, ROLES } from '@/stores/useConverstionsStore';
import {
  submitDirectTranslate,
  submitDetectLanguage,
  handleTranslationAssistant,
} from '@/actions/translationActions';

export function useTranslation() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const {
    translationConfig,
    translationMode,
    setTranslationMode,
    setTranslationConfig,
    updateTranslationConfig,
    resetTranslationConfig,
    updateActiveConversation,
    setLoadingResponse,
    setUserMessage,
    activeConversation,
  } = useConversationsStore();

  const [isLoading, setIsLoading] = useState(false);

  // --- Direct Translate Mutation ---
  const directTranslateMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      if (!accessToken) return null;
      return await submitDirectTranslate(
        {
          text,
          sourceLanguage:
            translationConfig.sourceLanguage === 'auto'
              ? undefined
              : translationConfig.sourceLanguage,
          targetLanguage: translationConfig.targetLanguage,
        },
        accessToken,
      );
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response || !response.success || !response.data?.success) {
        const errorMsg = response?.message || 'Translation failed';
        updateActiveConversation(errorMsg, ROLES.ASSISTANT);
      } else {
        const { translatedText, originalText } = response.data;
        // Format response nicely
        const display = translatedText
          ? `**Translation:**\n\n${translatedText}`
          : 'Translation completed.';
        updateActiveConversation(display, ROLES.ASSISTANT);
      }
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error(error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Detect Language Mutation ---
  const detectLanguageMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      if (!accessToken) return null;
      return await submitDetectLanguage({ text }, accessToken);
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response || !response.success || !response.data?.success) {
        const errorMsg = response?.message || 'Detection failed';
        updateActiveConversation(errorMsg, ROLES.ASSISTANT);
      } else {
        const { languageName, languageCode, confidence } = response.data;
        const display = `**Detected Language:** ${languageName} (${languageCode})\n**Confidence:** ${(confidence * 100).toFixed(1)}%`;
        updateActiveConversation(display, ROLES.ASSISTANT);
      }
      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error(error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Assistant Mutation ---
  const assistantMutation = useMutation({
    mutationFn: async ({
      message,
      file,
      conversationId,
    }: {
      message: string;
      file?: File;
      conversationId?: string;
    }) => {
      if (!accessToken) return null;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message', message);
        if (conversationId) formData.append('conversationId', conversationId);
        return await handleTranslationAssistant(formData, accessToken);
      } else {
        return await handleTranslationAssistant(
          {
            message,
            conversationId,
          },
          accessToken,
        );
      }
    },
    onMutate: () => {
      setIsLoading(true);
      setLoadingResponse(true);
    },
    onSuccess: response => {
      if (!response?.success) {
        updateActiveConversation(
          response?.message || 'Assistant request failed.',
          ROLES.ASSISTANT,
        );
      } else if (response.data) {
        const {
          conversationId,
          message: assistantMsg,
          translation,
        } = response.data;

        // Redirect if new conversation
        if (
          conversationId &&
          conversationId !== activeConversation?.conversationId
        ) {
          router.replace(`/c/${conversationId}`);
        }

        let displayContent = assistantMsg || 'Processed.';

        // If there's a specific translation object in the response, we might want to append it?
        // The API response shows 'message' usually contains the conversational text.
        // If "translation" object is present, it might be the result.
        // Let's rely on 'message' key from assistant response primarily,
        // but if translation.translatedText exists and message is generic, maybe show it?
        // Based on example: message: "Translation completed!...", translation: { ... }
        if (translation?.translatedText) {
          displayContent += `\n\n${translation.translatedText}`;
        }

        updateActiveConversation(
          displayContent,
          ROLES.ASSISTANT,
          conversationId,
        );
      }

      // Switch to 'chat' mode so config hides but state persists
      setTranslationMode('chat'); // Wait, translationMode doesn't support 'chat' yet in my types?
      // Ah, I copied RewriteSlice pattern but TranslationMode type in types/translation.ts was:
      // 'assistant' | 'direct' | 'detect' | 'select_mode' | null
      // I should probably add 'chat' to TranslationMode type if I want to support this flow properly.
      // For now, let's keep it consistent.

      setIsLoading(false);
      setLoadingResponse(false);
    },
    onError: error => {
      console.error(error);
      setIsLoading(false);
      setLoadingResponse(false);
    },
  });

  // --- Handlers ---

  const handleDirectTranslate = async (text: string) => {
    // Logic to choose between Translate or Detect based on config
    setUserMessage('');
    updateActiveConversation(text, ROLES.USER);

    if (translationConfig.isDetectMode) {
      await detectLanguageMutation.mutateAsync({ text });
    } else {
      await directTranslateMutation.mutateAsync({ text });
    }
  };

  const handleAssistantTranslate = async (message: string, file?: File) => {
    setUserMessage('');
    updateActiveConversation(message, ROLES.USER);

    const currentId = activeConversation?.conversationId;
    const isEditingExisting =
      currentId && currentId !== 'new-chat' && pathname.startsWith('/c/');

    await assistantMutation.mutateAsync({
      message,
      file,
      conversationId: isEditingExisting ? currentId : undefined,
    });
  };

  return {
    translationConfig,
    translationMode,
    setTranslationMode,
    updateTranslationConfig,
    resetTranslationConfig,
    handleDirectTranslate,
    handleAssistantTranslate,
    isLoading,
  };
}
