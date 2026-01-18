'use server';

import {
  PlanAssistantRequest,
  DirectPlanGenerationRequest,
  PlanGenerationConfig,
  PlanAssistantResponseData,
  DirectPlanResponseData,
} from '@/types/plan-generation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

/**
 * POST /plan-generator/assistant
 * Conversational assistant for plan generation (JSON body - new chat or continue)
 */
export async function postPlanAssistant(
  payload: PlanAssistantRequest,
  accessToken: string,
): Promise<ApiResponse<PlanAssistantResponseData>> {
  const apiUrl = `${API_BASE_URL}/plan-generator/assistant`;
  console.log('[planGenerationActions] postPlanAssistant payload:', payload);

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
    console.log('[planGenerationActions] postPlanAssistant response:', data);
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('postPlanAssistant error:', error);
    return {
      success: false,
      message: 'Failed to process plan assistant request. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

/**
 * POST /plan-generator/assistant
 * Conversational assistant with file upload (FormData)
 */
export async function postPlanAssistantWithFile(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<PlanAssistantResponseData>> {
  const apiUrl = `${API_BASE_URL}/plan-generator/assistant`;
  console.log(
    '[planGenerationActions] postPlanAssistantWithFile formData keys:',
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
      '[planGenerationActions] postPlanAssistantWithFile response:',
      data,
    );
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('postPlanAssistantWithFile error:', error);
    return {
      success: false,
      message: 'Failed to process plan assistant with file. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

/**
 * POST /plan-generator/generate
 * Direct plan generation with structured config (no file upload)
 */
export async function generateDirectPlan(
  idea: string,
  config: PlanGenerationConfig,
  accessToken: string,
): Promise<ApiResponse<DirectPlanResponseData>> {
  const apiUrl = `${API_BASE_URL}/plan-generator/generate`;

  // Filter out undefined/null/empty values from config
  const cleanConfig = Object.entries(config).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Also filter empty arrays
      if (Array.isArray(value) && value.length === 0) {
        return acc;
      }
      // @ts-ignore
      acc[key] = value;
    }
    return acc;
  }, {} as Partial<PlanGenerationConfig>);

  const payload: DirectPlanGenerationRequest = {
    idea,
    planType: cleanConfig.planType || 'business_plan',
    complexity: cleanConfig.complexity || 'moderate',
    planDepth: cleanConfig.planDepth || 'standard',
    ...(cleanConfig.domains && { domains: cleanConfig.domains }),
    ...(cleanConfig.constraints && { constraints: cleanConfig.constraints }),
    ...(cleanConfig.brainstormAspects && {
      brainstormAspects: cleanConfig.brainstormAspects,
    }),
  };

  console.log('[planGenerationActions] generateDirectPlan payload:', payload);

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
    console.log('[planGenerationActions] generateDirectPlan response:', data);
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: any) {
    console.error('generateDirectPlan error:', error);
    return {
      success: false,
      message: 'Failed to generate direct plan. Try again.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
