import {
  generateStructuredBrainstorm,
  postBrainstormAssistant,
} from '@/actions/brainstormActions';
import { ROLES, useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useBrainstorm = () => {
  const {
    brainstormConfig,
    brainstormMode,
    setBrainstormConfig,
    setBrainstormMode,
    resetBrainstormConfig,
    updateActiveConversation,
    setLoadingResponse,
  } = useConversationsStore();

  const { data: session } = useSession();
  const router = useRouter();

  const handleAssistantBrainstorm = async (
    message: string,
    conversationId?: string,
  ) => {
    if (!session?.accessToken) return;

    // Use passed conversationId if valid, otherwise try from store if it's not 'new-chat'
    // But typically for new assistant flow we want to check if we are in a conversation
    // Logic from ChatInput usually passes the current ID.

    setLoadingResponse(true);

    // Initial user message is already added by ChatInput via optimistic update usually
    // But we need to make sure we call the API
    updateActiveConversation(message, ROLES.USER);

    const apiResponse = await postBrainstormAssistant(
      {
        message,
        conversationId:
          conversationId === 'new-chat' ? undefined : conversationId,
      },
      session.accessToken,
    );

    if (apiResponse?.success && apiResponse.data) {
      // If new conversation, redirect
      if (
        apiResponse.data.conversationId &&
        (!conversationId || conversationId === 'new-chat')
      ) {
        router.replace(`/c/${apiResponse.data.conversationId}`);
        // We might need to wait for redirect or manually set conversation ID
        // But usually FullConversation handles loading new conv
      }

      // Add assistant response
      // Structure: We might get 'response' text AND 'brainstormData'
      updateActiveConversation(
        apiResponse.data.response, // The chat text part
        ROLES.ASSISTANT,
        apiResponse.data.conversationId,
        {
          brainstormData: apiResponse.data.brainstormData,
          metadata: apiResponse.data.metadata,
        },
      );
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to process brainstorm request.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  const handleStructuredGeneration = async (
    idea: string,
    conversationId?: string, // Although structured gen usually starts fresh or adds to history
  ) => {
    if (!session?.accessToken) return;

    setLoadingResponse(true);
    updateActiveConversation(idea, ROLES.USER);

    const apiResponse = await generateStructuredBrainstorm(
      idea,
      brainstormConfig,
      session.accessToken,
    );

    if (apiResponse?.success && apiResponse.data) {
      if (
        apiResponse.data.conversationId &&
        (!conversationId || conversationId === 'new-chat')
      ) {
        router.replace(`/c/${apiResponse.data.conversationId}`);
      }

      updateActiveConversation(
        apiResponse.data.response,
        ROLES.ASSISTANT,
        apiResponse.data.conversationId,
        {
          brainstormData: apiResponse.data.brainstormData,
          metadata: apiResponse.data.metadata,
          ideaAnalysis: apiResponse.data.ideaAnalysis,
        },
      );

      // Reset config and mode after successful generation as per user request
      // resetBrainstormConfig();
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to generate structured brainstorm.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  return {
    brainstormConfig,
    brainstormMode,
    setBrainstormMode,
    setBrainstormConfig,
    resetBrainstormConfig,
    handleAssistantBrainstorm,
    handleStructuredGeneration,
  };
};
