'use server';

import { DirectRewriteRequest, RewriteResponse } from '@/types/rewrite';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

// --- Direct Rewrite ---

export async function submitDirectRewrite(
  payload: DirectRewriteRequest,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/rewrite/rewrite`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('[rewriteActions] submitDirectRewrite response:', data);
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('submitDirectRewrite Error:', error);
    return {
      success: false,
      message: 'Failed to submit rewrite.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

// --- Conversational Assistant (Unified) ---

export async function handleRewriteRequest(
  payload:
    | FormData
    | {
        textContent?: string;
        message: string;
        conversationId?: string;
      },
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    let body: BodyInit;
    let headers: HeadersInit = {
      Authorization: `Bearer ${accessToken}`,
    };

    if (payload instanceof FormData) {
      // File upload flow
      body = payload;
      // Content-Type is automatic with FormData
    } else {
      // Text flow
      body = JSON.stringify(payload);
      headers['Content-Type'] = 'application/json';
    }
    console.log('[rewriteActions] handleRewriteRequest payload:', payload);
    const response = await fetch(`${API_BASE_URL}/rewrite/assistant`, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();
    console.log('[rewriteActions] handleRewriteRequest response:', data);
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('handleRewriteRequest Error:', error);
    return {
      success: false,
      message: 'Failed to handle rewrite request.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
