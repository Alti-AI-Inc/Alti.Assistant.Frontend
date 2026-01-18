import {
  postPlanAssistant,
  postPlanAssistantWithFile,
  generateDirectPlan,
} from '@/actions/planGenerationActions';
import { ROLES, useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export const usePlanGeneration = () => {
  const {
    planGenerationConfig,
    planGenerationMode,
    setPlanGenerationConfig,
    setPlanGenerationMode,
    resetPlanGenerationConfig,
    updatePlanGenerationConfig,
    updateActiveConversation,
    setLoadingResponse,
    activeConversation,
  } = useConversationsStore();

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Handle conversational assistant plan generation
   * Supports: new chat, continue chat, and file upload
   */
  const handleAssistantPlanGeneration = async (
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
      apiResponse = await postPlanAssistantWithFile(
        formData,
        session.accessToken,
      );
    } else {
      // JSON body flow for new chat or continue
      apiResponse = await postPlanAssistant(
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

      // Add assistant response with plan stage metadata
      updateActiveConversation(
        apiResponse.data.response,
        ROLES.ASSISTANT,
        apiResponse.data.conversationId,
        {
          planStage: apiResponse.data.planStage,
          hasAnalysis: apiResponse.data.hasAnalysis,
          hasBrainstorm: apiResponse.data.hasBrainstorm,
          hasPlan: apiResponse.data.hasPlan,
        },
      );
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to process plan generation request.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  /**
   * Handle direct plan generation with structured config
   * No file upload support in direct mode
   */
  const handleDirectPlanGeneration = async (idea: string) => {
    if (!session?.accessToken) return;

    setLoadingResponse(true);
    updateActiveConversation(idea, ROLES.USER);

    const apiResponse = await generateDirectPlan(
      idea,
      planGenerationConfig,
      session.accessToken,
    );

    if (apiResponse?.success && apiResponse.data) {
      // Direct generation returns analysis, brainstorm, and plan data
      updateActiveConversation(
        apiResponse.data.message || 'Plan generated successfully.',
        ROLES.ASSISTANT,
        undefined,
        {
          planAnalysis: apiResponse.data.analysis,
          planBrainstorm: apiResponse.data.brainstorm,
          planData: apiResponse.data.plan,
        },
      );
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to generate direct plan.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  return {
    planGenerationConfig,
    planGenerationMode,
    setPlanGenerationMode,
    setPlanGenerationConfig,
    updatePlanGenerationConfig,
    resetPlanGenerationConfig,
    handleAssistantPlanGeneration,
    handleDirectPlanGeneration,
  };
};
