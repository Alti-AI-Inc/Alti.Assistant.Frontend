'use server';

import { apiClient } from '@/lib/api-client';
import {
  StartDocConversationRequest,
  ContinueDocConversationRequest,
  BaseGenerationRequest,
  DocConversationResponse,
  DirectGenerationResponse,
  ReviewResponse,
} from '@/types/document-generation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

// --- Group 1: Conversation Assistant ---

export async function startDocumentConversation(
  payload: StartDocConversationRequest,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(`${API_BASE_URL}/documents/assistant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('[documentActions] startDocumentConversation response:', data);
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('startDocumentConversation Error:', error);
    return {
      success: false,
      message: 'Failed to start document conversation.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function continueDocumentConversation(
  payload: ContinueDocConversationRequest,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(`${API_BASE_URL}/documents/assistant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(
      '[documentActions] continueDocumentConversation response:',
      data,
    );
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('continueDocumentConversation Error:', error);
    return {
      success: false,
      message: 'Failed to continue document conversation.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

// --- Group 2: Direct Generation ---

export async function generateDocument(
  payload: BaseGenerationRequest,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(`${API_BASE_URL}/documents/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('[documentActions] generateDocument response:', data);
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('generateDocument Error:', error);
    return {
      success: false,
      message: 'Failed to generate document.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

// --- Group 3: Document Review ---

export async function uploadReviewDocumentAssistant(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(`${API_BASE_URL}/document-review/assistant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type header is set automatically with FormData
      },
      body: formData,
    });

    const data = await response.json();
    console.log(
      '[documentActions] uploadReviewDocumentAssistant response:',
      data,
    );
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('uploadReviewDocumentAssistant Error:', error);
    return {
      success: false,
      message: 'Failed to upload review document.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function submitDirectReview(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(`${API_BASE_URL}/document-review/assistant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type header is set automatically with FormData
      },
      body: formData,
    });

    const data = await response.json();
    console.log('[documentActions] submitDirectReview response:', data);
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('submitDirectReview Error:', error);
    return {
      success: false,
      message: 'Failed to submit review.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
