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

export interface ApiResponse<T = unknown> {
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
): Promise<ApiResponse<DocConversationResponse['data']>> {
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
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: unknown) {
    console.error('startDocumentConversation Error:', error);
    return {
      success: false,
      message: 'Failed to start document conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}

export async function continueDocumentConversation(
  payload: ContinueDocConversationRequest,
  accessToken: string,
): Promise<ApiResponse<DocConversationResponse['data']>> {
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
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: unknown) {
    console.error('continueDocumentConversation Error:', error);
    return {
      success: false,
      message: 'Failed to continue document conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}

// --- Group 2: Direct Generation ---

export async function generateDocument(
  payload: BaseGenerationRequest,
  accessToken: string,
): Promise<ApiResponse<DirectGenerationResponse['data']>> {
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
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: unknown) {
    console.error('generateDocument Error:', error);
    return {
      success: false,
      message: 'Failed to generate document.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}

// --- Group 3: Document Review ---

export async function uploadReviewDocumentAssistant(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<ReviewResponse['data']>> {
  try {
    const response = await apiClient(
      `${API_BASE_URL}/document-review/assistant`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type header is set automatically with FormData
        },
        body: formData,
      },
    );

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: unknown) {
    console.error('uploadReviewDocumentAssistant Error:', error);
    return {
      success: false,
      message: 'Failed to upload review document.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}

export async function submitDirectReview(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<ReviewResponse['data']>> {
  try {
    const response = await apiClient(
      `${API_BASE_URL}/document-review/assistant`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type header is set automatically with FormData
        },
        body: formData,
      },
    );

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: unknown) {
    console.error('submitDirectReview Error:', error);
    return {
      success: false,
      message: 'Failed to submit review.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
}
