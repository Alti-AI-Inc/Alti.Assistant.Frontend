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

const makeFredRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  data?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const session = await auth();
    const accessToken = (session as any)?.accessToken;
    
    if (!accessToken) {
      return { success: false, message: 'Unauthorized', statusCode: 401 };
    }

    const options: RequestInit = {
      method,
      headers: getHeaders(accessToken),
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}/fred/${endpoint}`, options);
    
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
    console.error(`[FredAction] Error calling ${endpoint}:`, error);
    return {
      success: false,
      message: error.message || 'Internal server error',
      statusCode: 500,
    };
  }
};

export const getSeriesObservations = (data: { series_id: string; options?: any }) => 
  makeFredRequest('series/observations', 'POST', data);

export const searchSeries = (data: { search_text: string; options?: any }) => 
  makeFredRequest('series/search', 'POST', data);

export const getSeriesInfo = (data: { series_id: string }) => 
  makeFredRequest('series/info', 'POST', data);
