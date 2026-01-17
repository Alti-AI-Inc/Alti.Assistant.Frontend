'use server';

import {
  ContractAssistantRequest,
  ContractReviewConfig,
  ContractAssistantResponseData,
  DirectContractReviewResponseData,
} from '@/types/contract-review';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

/**
 * POST /legal-contract-review/assistant
 * Conversational assistant for contract review (JSON body - text only)
 */
export async function postContractAssistant(
  payload: ContractAssistantRequest,
  accessToken: string,
): Promise<ApiResponse<ContractAssistantResponseData>> {
  const apiUrl = `${API_BASE_URL}/legal-contract-review/assistant`;
  console.log(
    '[contractReviewActions] postContractAssistant payload:',
    payload,
  );

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
      return {
        success: false,
        message: errorData.message || `HTTP error! status: ${response.status}`,
        debugMessage: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[contractReviewActions] postContractAssistant response:',
      data,
    );
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('postContractAssistant error:', error);
    return {
      success: false,
      message: 'Failed to process contract review request. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

/**
 * POST /legal-contract-review/assistant
 * Conversational assistant with file upload (FormData)
 */
export async function postContractAssistantWithFile(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<ContractAssistantResponseData>> {
  const apiUrl = `${API_BASE_URL}/legal-contract-review/assistant`;
  console.log(
    '[contractReviewActions] postContractAssistantWithFile formData keys:',
    Array.from(formData.keys()),
  );

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type is automatically set for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `HTTP error! status: ${response.status}`,
        debugMessage: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[contractReviewActions] postContractAssistantWithFile response:',
      data,
    );
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('postContractAssistantWithFile error:', error);
    return {
      success: false,
      message: 'Failed to process contract review with file. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

/**
 * POST /legal-contract-review/review
 * Direct contract review with file upload (FormData) - file is REQUIRED
 */
export async function submitDirectContractReview(
  file: File,
  config: ContractReviewConfig,
  accessToken: string,
): Promise<ApiResponse<DirectContractReviewResponseData>> {
  const apiUrl = `${API_BASE_URL}/legal-contract-review/review`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('reviewType', config.reviewType || 'general_review');
  formData.append('reviewDepth', config.reviewDepth || 'standard');
  formData.append('contractType', config.contractType || 'general');
  formData.append('outputFormat', config.outputFormat || 'markdown');

  // Append aspects array
  if (config.aspects && config.aspects.length > 0) {
    config.aspects.forEach(aspect => {
      formData.append('aspects[]', aspect);
    });
  }

  // Append additional instructions if provided
  if (config.additionalInstructions) {
    formData.append('additionalInstructions', config.additionalInstructions);
  }

  console.log(
    '[contractReviewActions] submitDirectContractReview formData keys:',
    Array.from(formData.keys()),
  );

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `HTTP error! status: ${response.status}`,
        debugMessage: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[contractReviewActions] submitDirectContractReview response:',
      data,
    );
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('submitDirectContractReview error:', error);
    return {
      success: false,
      message: 'Failed to submit direct contract review. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
