import { apiClient } from '@/lib/api-client';
import { HARD_LAW_SYSTEM_INSTRUCTION } from '@/lib/safety';
import { ConversationMessage, Reference } from '@/types/conversation';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
  isStreamed?: boolean;
}

export async function PostConversation(
  apiUrl: string,
  message: string,
  accessToken: string,
  conversationId?: string,
  knowledgebaseId?: string,
  extraParams?: Record<string, unknown>,
): Promise<ApiResponse> {
  try {
    const response = await apiClient(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message,
        prompt: message,
        ...(conversationId && { conversationId }),
        ...(knowledgebaseId && { knowledgebaseId }),
        timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/New_York',
        localDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        localTime: new Date().toLocaleTimeString('en-US'),
        systemInstruction: await buildSystemInstruction(prompt),
        ...extraParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedMsg = '';
      try {
        parsedMsg = JSON.parse(errorText)?.message;
      } catch {}
      const is404 =
        response.status === 404 ||
        parsedMsg === 'Not found' ||
        parsedMsg === 'Api not found';
      return {
        success: false,
        message: is404
          ? 'Service is temporarily unavailable. Please try again shortly.'
          : parsedMsg ||
            'The Aphura Cloud backend API is currently offline. Please boot the backend services to enable real-time inference.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    // Unwrap data if present to avoid nesting
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: unknown) {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      debugMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function PostConversationStream(
  apiUrl: string,
  message: string,
  accessToken: string,
  conversationId?: string,
  knowledgebaseId?: string,
  extraParams?: Record<string, unknown>,
  onChunk?: (chunk: { type: string; content?: string; reference?: Reference[]; citations?: Reference[]; conversationId?: string }) => void,
  signal?: AbortSignal,
): Promise<ApiResponse> {
  try {
    // ── SSE fetch with retry on transient failures ──
    const MAX_RETRIES = 2;
    let lastError: Error | null = null;
    let response: Response | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        response = await apiClient(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
          },
          signal,
          body: JSON.stringify({
            message,
            prompt: message,
            stream: true,
            ...(conversationId && { conversationId }),
            ...(knowledgebaseId && { knowledgebaseId }),
            timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/New_York',
            localDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            localTime: new Date().toLocaleTimeString('en-US'),
            systemInstruction: await buildSystemInstruction(prompt),
            ...extraParams,
          }),
        });

        // Retry on gateway errors
        if (response && [502, 503, 504].includes(response.status) && attempt < MAX_RETRIES) {
          const delay = (attempt + 1) * 1500; // 1.5s, 3s
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        break; // Success or non-retryable error
      } catch (err: any) {
        lastError = err;
        if (signal?.aborted) throw err; // Don't retry aborted requests
        if (attempt < MAX_RETRIES) {
          const delay = (attempt + 1) * 1500;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }

    if (!response) {
      return {
        success: false,
        message: 'Failed to connect after retries.',
        debugMessage: lastError?.message,
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      let parsedMsg = '';
      try {
        parsedMsg = JSON.parse(errorText)?.message;
      } catch {}
      const is404 =
        response.status === 404 ||
        parsedMsg === 'Not found' ||
        parsedMsg === 'Api not found';
      return {
        success: false,
        message: is404
          ? 'Service is temporarily unavailable. Please try again shortly.'
          : parsedMsg ||
            'The Aphura Cloud backend API is currently offline. Please boot the backend services to enable real-time inference.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return {
        success: false,
        message: 'Response body is not readable.',
      };
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last partial line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('data: ')) {
          const rawData = trimmed.slice(6);
          try {
            const parsed = JSON.parse(rawData);
            if (onChunk) {
              onChunk(parsed);
            }
          } catch (err) {
          }
        }
      }
    }

    return { success: true, message: 'Success' };
  } catch (error: unknown) {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      debugMessage: error instanceof Error ? error.message : String(error),
    };
  }
}


export async function PostConversationWithFile(
  formData: FormData,
  accessToken: string,
  onChunk?: (chunk: { type: string; content?: string; reference?: Reference[]; citations?: Reference[]; conversationId?: string }) => void,
  signal?: AbortSignal,
): Promise<ApiResponse> {
  try {
    const timezone = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/New_York';
    const localDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const localTime = new Date().toLocaleTimeString('en-US');

    formData.append('timezone', timezone);
    formData.append('localDate', localDate);
    formData.append('localTime', localTime);
    formData.append('stream', 'true');

    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/search/assistant_v2`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Content-Type is set automatically for FormData
        },
        body: formData,
        signal,
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

    // Check if response is SSE streaming
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/event-stream') || contentType.includes('application/octet-stream')) {
      const reader = response.body?.getReader();
      if (!reader) {
        return { success: false, message: 'Response body is not readable.' };
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            if (onChunk) onChunk(parsed);
          } catch {}
        }
      }

      return { success: true, message: 'Success' };
    }

    // Fallback: non-streaming JSON response
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: unknown) {
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      debugMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

export interface Conversation {
  _id: string;
  conversationId: string;
  title: string;
  is_saved?: boolean;
  is_deep_search?: boolean;
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
  isDeepSearch?: boolean,
  category?: string,
): Promise<ApiResponse<ConversationListResponse>> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
    });
    if (isDeepSearch !== undefined) {
      params.set('is_deep_search', String(isDeepSearch));
    }
    if (category !== undefined) {
      params.set('category', category);
    }
    const res = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations?${params.toString()}`,
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to fetch conversations.',
      debugMessage: error instanceof Error ? error.message : String(error),
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to fetch saved conversations.',
      debugMessage: error instanceof Error ? error.message : String(error),
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Search failed.',
      debugMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function loadSingleConversation(
  conversationId: string,
  accessToken: string,
): Promise<ApiResponse> {
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
    // Assuming data is already the shape we want or wrapped?
    // The original code returned 'data'. Let's check if 'data' has 'success' field or if it is the payload.
    // Original: const data = await response.json(); return data;
    // Usually backend returns { success: true, data: ... } or just data.
    // I'll wrap it in standard ApiResponse structure.
    return { success: true, message: 'Success', data: data?.data || data };
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to load conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to load shared conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to delete conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to share conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to rename conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
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
  } catch (error: unknown) {
    return {
      success: false,
      message: 'Failed to save conversation.',
      debugMessage: error instanceof Error ? error.message : String(error),
    };
  }
}
