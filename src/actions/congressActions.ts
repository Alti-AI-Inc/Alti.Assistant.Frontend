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

export const getBill = async (data: { congress: string; billType: string; billNumber: string }) => {
  try {
    const session = await auth();
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return { success: false, message: 'Unauthorized', statusCode: 401 };

    const response = await fetch(`${API_URL}/congress/bill/detail`, {
      method: 'POST',
      headers: getHeaders(accessToken),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) return { success: false, message: result?.message || 'Request failed', statusCode: response.status };
    return { success: true, message: result?.message || 'Success', data: result?.data };
  } catch (error: any) {
    return { success: false, message: error.message || 'Internal server error', statusCode: 500 };
  }
};

export const getRecentBills = async (data: { options?: any } = {}) => {
  try {
    const session = await auth();
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return { success: false, message: 'Unauthorized', statusCode: 401 };

    const response = await fetch(`${API_URL}/congress/bill/recent`, {
      method: 'POST',
      headers: getHeaders(accessToken),
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) return { success: false, message: result?.message || 'Request failed', statusCode: response.status };
    return { success: true, message: result?.message || 'Success', data: result?.data };
  } catch (error: any) {
    return { success: false, message: error.message || 'Internal server error', statusCode: 500 };
  }
};
