'use server';

import {
  AssistantTranslateRequest,
  DetectLanguageRequest,
  DirectTranslateRequest,
} from '@/types/translation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

// 1. Direct Translation
export async function submitDirectTranslate(
  payload: DirectTranslateRequest,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/translation/translate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: unknown) {
    console.error('submitDirectTranslate Error:', error);
    return {
      success: false,
      message: 'Failed to translate text.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}

// 2. Language Detection
export async function submitDetectLanguage(
  payload: DetectLanguageRequest,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/translation/detect`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return {
      success: data.success ?? true,
      message: data.message || 'Success',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: unknown) {
    console.error('submitDetectLanguage Error:', error);
    return {
      success: false,
      message: 'Failed to detect language.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}

// 3. Conversational Assistant
export async function handleTranslationAssistant(
  payload: FormData | AssistantTranslateRequest,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    let body: BodyInit;
    let headers: HeadersInit = {
      Authorization: `Bearer ${accessToken}`,
    };

    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = JSON.stringify(payload);
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/translation/assistant`, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();
    return {
      success: data.success ?? true,
      message: data.message || 'Request processed',
      data: data.data || data,
      statusCode: data.statusCode,
    };
  } catch (error: unknown) {
    console.error('handleTranslationAssistant Error:', error);
    return {
      success: false,
      message: 'Failed to process translation request.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}
