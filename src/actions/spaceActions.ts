'use server';

import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

export interface Space {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  owner?: string;
  isPrivate?: boolean;
  status?: string;
  searchCount?: number;
  searches?: string[];
  monitors?: string[];
  members?: string[];
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpaceInput {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Unauthorized');
  }
  return { Authorization: `Bearer ${session.accessToken}` };
}

export async function createSpaceAction(
  data: SpaceInput,
): Promise<ApiResponse<Space>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_URL}/spaces/create-space`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to create space',
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || 'Space created',
      data: result?.data ?? result,
    };
  } catch (error: any) {
    console.error('createSpaceAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to create space',
    };
  }
}

export async function getSpacesAction(): Promise<ApiResponse<Space[]>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_URL}/spaces/get-all`, {
      headers: authHeader,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to fetch spaces',
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || 'Success',
      data: result?.data ?? [],
    };
  } catch (error: any) {
    console.error('getSpacesAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch spaces',
    };
  }
}

export async function getSpaceAction(id: string): Promise<ApiResponse<Space>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_URL}/spaces/${id}`, {
      headers: authHeader,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to fetch space',
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || 'Success',
      data: result?.data ?? result,
    };
  } catch (error: any) {
    console.error('getSpaceAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch space',
    };
  }
}

export async function updateSpaceAction(
  id: string,
  data: Partial<SpaceInput>,
): Promise<ApiResponse<Space>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_URL}/spaces/update-space/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to update space',
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || 'Space updated',
      data: result?.data ?? result,
    };
  } catch (error: any) {
    console.error('updateSpaceAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to update space',
    };
  }
}

export async function deleteSpaceAction(
  id: string,
): Promise<ApiResponse<null>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(`${API_URL}/spaces/delete-space/${id}`, {
      method: 'DELETE',
      headers: authHeader,
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      return {
        success: false,
        message: result?.message || 'Failed to delete space',
        statusCode: response.status,
      };
    }
    return { success: true, message: 'Space deleted' };
  } catch (error: any) {
    console.error('deleteSpaceAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete space',
    };
  }
}
