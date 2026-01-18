import {
  postReportAssistant,
  postReportAssistantWithFile,
  generateDirectReport,
  handleReportRequest,
} from '@/actions/reportActions';
import { ROLES, useConversationsStore } from '@/stores/useConverstionsStore';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export const useReportGeneration = () => {
  const {
    reportGenerationConfig,
    reportGenerationMode,
    setReportGenerationConfig,
    setReportGenerationMode,
    resetReportGenerationConfig,
    updateReportGenerationConfig,
    updateActiveConversation,
    setLoadingResponse,
    activeConversation,
  } = useConversationsStore();

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Handle Assistant Report Generation
   * Supports both new chat and continue chat flows, with optional file upload
   */
  const handleAssistantReportGeneration = async (
    message: string,
    conversationId?: string,
    file?: File,
  ) => {
    if (!session?.accessToken) return;

    setLoadingResponse(true);
    updateActiveConversation(message, ROLES.USER);

    let apiResponse;

    if (file) {
      // File upload flow - use FormData
      const formData = new FormData();
      formData.append('message', message);
      formData.append('files', file);

      if (reportGenerationConfig.outputFormat) {
        formData.append('outputFormat', reportGenerationConfig.outputFormat);
      }
      if (reportGenerationConfig.reportType) {
        formData.append('reportType', reportGenerationConfig.reportType);
      }
      if (conversationId && conversationId !== 'new-chat') {
        formData.append('conversationId', conversationId);
      }

      apiResponse = await postReportAssistantWithFile(
        formData,
        session.accessToken,
      );
    } else {
      // Text-only flow - use JSON
      const payload: any = {
        message,
      };

      // Add config options for new chats
      if (reportGenerationConfig.outputFormat) {
        payload.outputFormat = reportGenerationConfig.outputFormat;
      }
      if (reportGenerationConfig.reportType) {
        payload.reportType = reportGenerationConfig.reportType;
      }
      // Add conversationId for continue chat flow
      if (conversationId && conversationId !== 'new-chat') {
        payload.conversationId = conversationId;
      }

      apiResponse = await postReportAssistant(payload, session.accessToken);
    }

    if (apiResponse?.success && apiResponse.data) {
      // If new conversation, redirect
      if (
        apiResponse.data.conversationId &&
        (!conversationId || conversationId === 'new-chat')
      ) {
        router.replace(`/c/${apiResponse.data.conversationId}`);
      }

      // Transform report to document format for consistent rendering
      const reportDocument = apiResponse.data.report
        ? {
            url: apiResponse.data.report.publicUrl,
            file: {
              fileName:
                apiResponse.data.report.publicUrl.split('/').pop() ||
                `${apiResponse.data.report.title}.${apiResponse.data.report.outputFormat}`,
              format: apiResponse.data.report.outputFormat.toUpperCase(),
            },
            metadata: {
              title: apiResponse.data.report.title,
              documentType: apiResponse.data.report.outputFormat.toUpperCase(),
              reportType: apiResponse.data.report.metadata?.reportType,
              generatedAt: apiResponse.data.report.metadata?.generatedAt,
            },
          }
        : undefined;

      // Add assistant response with document if available
      updateActiveConversation(
        apiResponse.data.response,
        ROLES.ASSISTANT,
        apiResponse.data.conversationId,
        reportDocument
          ? {
              document: reportDocument,
              needsMoreInfo: apiResponse.data.needsMoreInfo,
              missingParams: apiResponse.data.missingParams,
            }
          : {
              needsMoreInfo: apiResponse.data.needsMoreInfo,
              missingParams: apiResponse.data.missingParams,
            },
      );
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to process report request.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  /**
   * Handle Direct Report Generation
   * Uses config from store to generate report directly
   */
  const handleDirectReportGeneration = async (message: string) => {
    if (!session?.accessToken) return;

    const {
      title,
      content,
      reportType,
      outputFormat,
      tone,
      includeTitlePage,
      includeTableOfContents,
      includeExecutiveSummary,
      sections,
    } = reportGenerationConfig;

    // Validate required fields
    if (!title || !content || !reportType || !outputFormat) {
      updateActiveConversation(
        'Please fill in all required fields: Title, Content, Report Type, and Output Format.',
        ROLES.ASSISTANT,
      );
      return;
    }

    setLoadingResponse(true);
    updateActiveConversation(message, ROLES.USER);

    const payload = {
      content,
      title,
      reportType,
      outputFormat,
      ...(tone && { tone }),
      ...(includeTitlePage !== undefined && { includeTitlePage }),
      ...(includeTableOfContents !== undefined && { includeTableOfContents }),
      ...(includeExecutiveSummary !== undefined && { includeExecutiveSummary }),
      ...(sections && sections.length > 0 && { sections }),
    };

    const apiResponse = await generateDirectReport(
      payload,
      session.accessToken,
    );

    if (apiResponse?.success && apiResponse.data) {
      // Transform report to document format
      const reportDocument = {
        url: apiResponse.data.report.publicUrl,
        file: {
          fileName:
            apiResponse.data.report.publicUrl.split('/').pop() ||
            `${apiResponse.data.report.title}.${apiResponse.data.report.outputFormat}`,
          format: apiResponse.data.report.outputFormat.toUpperCase(),
        },
        metadata: {
          title: apiResponse.data.report.title,
          documentType: apiResponse.data.report.outputFormat.toUpperCase(),
          reportType: apiResponse.data.report.metadata?.reportType,
          generatedAt: apiResponse.data.report.metadata?.generatedAt,
        },
      };

      updateActiveConversation(
        'Report generated successfully! Click below to download.',
        ROLES.ASSISTANT,
        undefined,
        {
          document: reportDocument,
        },
      );
    } else {
      updateActiveConversation(
        apiResponse?.message || 'Failed to generate report.',
        ROLES.ASSISTANT,
      );
    }

    setLoadingResponse(false);
  };

  return {
    reportGenerationConfig,
    reportGenerationMode,
    setReportGenerationMode,
    setReportGenerationConfig,
    updateReportGenerationConfig,
    resetReportGenerationConfig,
    handleAssistantReportGeneration,
    handleDirectReportGeneration,
  };
};
