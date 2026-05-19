'use server';

import { apiClient } from '@/lib/api-client';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

export async function PostConversation(
  apiUrl: string,
  message: string,
  accessToken: string,
  conversationId?: string,
  knowledgebaseId?: string,
): Promise<ApiResponse> {
  try {
    console.log('[conversationsAction] PostConversation payload:', {
      apiUrl,
      knowledgebaseId,
      conversationId,
      message,
    });
    const response = await apiClient(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message,
        ...(conversationId && { conversationId }),
        ...(knowledgebaseId && { knowledgebaseId }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PostConversation API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return {
        success: false,
        message:
          JSON.parse(errorText)?.message ||
          'This is not you this is an error on our side, please try again later.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[conversationsAction] PostConversation response:',
      data.data || data,
    );
    // Unwrap data if present to avoid nesting
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('PostConversation Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      debugMessage: error.message || String(error),
    };
  }
}

export async function PostConversationWithFile(
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/search/assistant_v2`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type is set automatically for FormData
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message:
          JSON.parse(errorText)?.message ||
          'An error occurred, please try again later.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('PostConversationWithFile Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      debugMessage: error.message || String(error),
    };
  }
}

import { ConversationMessage } from '@/types/conversation';

export interface Conversation {
  _id: string;
  conversationId: string;
  title: string;
  is_saved?: boolean;
  updatedAt: string;
  createdAt: string;
  messages?: ConversationMessage[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  pagination: Pagination;
}

export async function fetchConversationList(
  accessToken: string,
  page = 1,
): Promise<ApiResponse<ConversationListResponse>> {
  try {
    const res = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations?page=${page}&limit=20`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        message: 'Failed to fetch conversations.',
        debugMessage: `HTTP Error ${res.status}: ${errorText}`,
        statusCode: res.status,
      };
    }

    const data = await res.json();
    return { success: true, message: 'Success', data: data.data };
  } catch (error: any) {
    console.error('fetchConversationList Error:', error);
    return {
      success: false,
      message: 'Failed to fetch conversations.',
      debugMessage: error.message || String(error),
    };
  }
}

export async function fetchSavedConversationList(
  accessToken: string,
): Promise<ApiResponse<Conversation[]>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/saved?limit=30&page=1`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to fetch saved conversations.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data.conversations };
  } catch (error: any) {
    console.error('fetchSavedConversationList Error:', error);
    return {
      success: false,
      message: 'Failed to fetch saved conversations.',
      debugMessage: error.message || String(error),
    };
  }
}

export async function searchConversations(
  accessToken: string,
  searchTerm: string,
): Promise<ApiResponse> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/search?searchTerm=${encodeURIComponent(searchTerm)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Search failed.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data };
  } catch (error: any) {
    console.error('searchConversations Error:', error);
    return {
      success: false,
      message: 'Search failed.',
      debugMessage: error.message || String(error),
    };
  }
}

export async function loadSingleConversation(
  conversationId: string,
  accessToken: string,
): Promise<ApiResponse> {
  console.log('[conversationsAction] loadSingleConversation payload:', {
    conversationId,
  });
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to load conversation.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log(
      '[conversationsAction] loadSingleConversation response:',
      data.data || data,
    );
    // Assuming data is already the shape we want or wrapped?
    // The original code returned 'data'. Let's check if 'data' has 'success' field or if it is the payload.
    // Original: const data = await response.json(); return data;
    // Usually backend returns { success: true, data: ... } or just data.
    // I'll wrap it in standard ApiResponse structure.
    return { success: true, message: 'Success', data: data?.data || data };
  } catch (error: any) {
    console.error('loadSingleConversation Error:', error);
    return {
      success: false,
      message: 'Failed to load conversation.',
      debugMessage: error.message || String(error),
    };
  }
}

export async function loadSingleSharedConversation(
  id: string,
): Promise<ApiResponse> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/shared/${id}`,
      { skipTenantHeader: true }, // Shared conversations don't use tenant context
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to load shared conversation.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data?.data || data };
  } catch (error: any) {
    console.error('loadSingleSharedConversation Error:', error);
    return {
      success: false,
      message: 'Failed to load shared conversation.',
      debugMessage: error.message || String(error),
    };
  }
}

export const deleteConversation = async (
  token: string | null | undefined,
  conversationId: string,
): Promise<ApiResponse> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`;
  try {
    const response = await apiClient(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to delete conversation.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return {
      success: false,
      message: 'Failed to delete conversation.',
      debugMessage: error.message || String(error),
    };
  }
};

export const shareConversation = async (
  conversationId: string,
  accessToken: string,
): Promise<ApiResponse> => {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/share`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to share conversation.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('shareConversation Error:', error);
    return {
      success: false,
      message: 'Failed to share conversation.',
      debugMessage: error.message || String(error),
    };
  }
};

export async function renameConversationAction(
  conversationId: string,
  newTitle: string,
  accessToken: string,
): Promise<ApiResponse> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/rename/${conversationId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          newTitle,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to rename conversation.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('renameConversationAction Error:', error);
    return {
      success: false,
      message: 'Failed to rename conversation.',
      debugMessage: error.message || String(error),
    };
  }
}

export async function saveConversationAction(
  conversationId: string,
  is_saved = true,
  accessToken: string,
): Promise<ApiResponse> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations/save/${conversationId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          is_saved,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: 'Failed to save conversation.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('saveConversationAction Error:', error);
    return {
      success: false,
      message: 'Failed to save conversation.',
      debugMessage: error.message || String(error),
    };
  }
}
