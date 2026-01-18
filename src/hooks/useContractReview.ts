import {
  postContractAssistant,
  postContractAssistantWithFile,
  submitDirectContractReview,
} from '@/actions/contractReviewActions';
import { ROLES, useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useContractReview = () => {
  const {
    contractReviewConfig,
    contractReviewMode,
    setContractReviewConfig,
    setContractReviewMode,
    resetContractReviewConfig,
    updateContractReviewConfig,
    updateActiveConversation,
    setLoadingResponse,
    activeConversation,
  } = useConversationsStore();

  const { data: session } = useSession();
  const router = useRouter();

  /**
   * Handle conversational assistant contract review
   * Supports: new chat, continue chat, and optional file upload
   */
  const handleAssistantContractReview = async (
    message: string,
    conversationId?: string,
    file?: File,
  ) => {
    if (!session?.accessToken) return;

    setLoadingResponse(true);
    updateActiveConversation(message, ROLES.USER);

    let apiResponse;

    if (file) {
      // File upload flow using FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('message', message);
      if (conversationId && conversationId !== 'new-chat') {
        formData.append('conversationId', conversationId);
      }
      apiResponse = await postContractAssistantWithFile(
        formData,
        session.accessToken,
      );
    } else {
      // JSON body flow for text-only chat
      apiResponse = await postContractAssistant(
        {
          message,
          conversationId:
            conversationId === 'new-chat' ? undefined : conversationId,
        },
        session.accessToken,
      );
    }

    if (apiResponse?.success && apiResponse.data) {
      // If new conversation, redirect
      if (
        apiResponse.data.conversationId &&
        (!conversationId || conversationId === 'new-chat')
      ) {
        router.replace(`/c/${apiResponse.data.conversationId}`);
      }

      // Add assistant response with contract info metadata
      updateActiveConversation(
        apiResponse.data.response,
        ROLES.ASSISTANT,
        apiResponse.data.conversationId,
        {
          contractInfo: apiResponse.data.contractInfo,
          reviewParams: apiResponse.data.reviewParams,
        },
      );
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to process contract review request.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  /**
   * Handle direct contract review with file upload
   * File is REQUIRED for direct review
   */
  const handleDirectContractReview = async (file: File) => {
    if (!session?.accessToken) return;
    if (!file) {
      console.error('[useContractReview] File is required for direct review');
      return;
    }

    setLoadingResponse(true);
    updateActiveConversation(`Reviewing contract: ${file.name}`, ROLES.USER);

    const apiResponse = await submitDirectContractReview(
      file,
      contractReviewConfig,
      session.accessToken,
    );

    if (apiResponse?.success && apiResponse.data) {
      // Direct review returns review text and contract info
      updateActiveConversation(
        apiResponse.data.review || 'Contract review completed.',
        ROLES.ASSISTANT,
        undefined,
        {
          contractInfo: apiResponse.data.contractInfo,
          reviewParams: apiResponse.data.reviewParams,
        },
      );
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to complete contract review.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  return {
    contractReviewConfig,
    contractReviewMode,
    setContractReviewMode,
    setContractReviewConfig,
    updateContractReviewConfig,
    resetContractReviewConfig,
    handleAssistantContractReview,
    handleDirectContractReview,
  };
};
