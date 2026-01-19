'use server';

import {
  ReportAssistantRequest,
  DirectReportRequest,
  ReportAssistantResponse,
  DirectReportResponse,
  ReportGenerationConfig,
} from '@/types/report-generation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

/**
 * POST /reports/assistant (Text-only request)
 * For conversational assistant mode without file upload
 */
export async function postReportAssistant(
  payload: ReportAssistantRequest,
  accessToken: string,
): Promise<ApiResponse<ReportAssistantResponse>> {
  const apiUrl = `${API_BASE_URL}/reports/assistant`;
  console.log('[reportActions] postReportAssistant payload:', payload);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        '[reportActions] postReportAssistant error response:',
        errorData,
      );
      return {
        success: false,
        message: errorData.message || 'Failed to process report request.',
        debugMessage: `HTTP ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log('[reportActions] postReportAssistant response:', data);
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('postReportAssistant error:', error);
    return {
      success: false,
      message: 'Failed to process report assistant request. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

/**
 * POST /reports/assistant (With File Upload)
 * For conversational assistant mode with file attachment
 */
export async function postReportAssistantWithFile(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<ReportAssistantResponse>> {
  const apiUrl = `${API_BASE_URL}/reports/assistant`;
  console.log(
    '[reportActions] postReportAssistantWithFile formData:',
    formData,
  );

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type is set automatically for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        '[reportActions] postReportAssistantWithFile error response:',
        errorData,
      );
      return {
        success: false,
        message:
          errorData.message || 'Failed to process report request with file.',
        debugMessage: `HTTP ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log('[reportActions] postReportAssistantWithFile response:', data);
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('postReportAssistantWithFile error:', error);
    return {
      success: false,
      message: 'Failed to process report request with file. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

/**
 * POST /reports/generate (Direct Generation)
 * For structured direct report generation
 */
export async function generateDirectReport(
  payload: DirectReportRequest,
  accessToken: string,
): Promise<ApiResponse<DirectReportResponse>> {
  const apiUrl = `${API_BASE_URL}/reports/generate`;
  console.log('[reportActions] generateDirectReport payload:', payload);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        '[reportActions] generateDirectReport error response:',
        errorData,
      );
      return {
        success: false,
        message: errorData.message || 'Failed to generate report.',
        debugMessage: `HTTP ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log('[reportActions] generateDirectReport response:', data);
    return {
      success: data.success ?? true,
      message: data.message || 'Report generated successfully',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('generateDirectReport error:', error);
    return {
      success: false,
      message: 'Failed to generate report. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

/**
 * Unified handler for report assistant requests
 * Handles both JSON and FormData payloads
 */
export async function handleReportRequest(
  payload:
    | FormData
    | {
        message: string;
        outputFormat?: string;
        reportType?: string;
        conversationId?: string;
      },
  accessToken: string,
): Promise<ApiResponse<ReportAssistantResponse>> {
  if (payload instanceof FormData) {
    return postReportAssistantWithFile(payload, accessToken);
  } else {
    return postReportAssistant(payload as ReportAssistantRequest, accessToken);
  }
}
