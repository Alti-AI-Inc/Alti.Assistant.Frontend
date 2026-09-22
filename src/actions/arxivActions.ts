'use server';

import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

const getHeaders = (accessToken: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${accessToken}`,
});

export const searchPapers = async (data: { query: string; options?: any }) => {
  try {
    const session = await auth();
    const accessToken = (session as any)?.accessToken;
    
    if (!accessToken) {
      return { success: false, message: 'Unauthorized', statusCode: 401 };
    }

    const response = await fetch(`${API_URL}/arxiv/query`, {
      method: 'POST',
      headers: getHeaders(accessToken),
      body: JSON.stringify(data),
    });
    
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || result?.error || 'Request failed',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || 'Success',
      data: result?.data,
    };
  } catch (error: any) {
    console.error(`[ArxivAction] Error calling query:`, error);
    return {
      success: false,
      message: error.message || 'Internal server error',
      statusCode: 500,
    };
  }
};
