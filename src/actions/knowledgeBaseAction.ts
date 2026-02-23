'use server';

import { apiClient } from '@/lib/api-client';
import { KnowledgeBankFile } from './knowledgeBankAction';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

export const uploadfileToKnowledgeBaseAction = async (
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('uploadfileToKnowledgeBaseAction Error:', error);
    return {
      success: false,
      message: 'Failed to upload file.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

export async function fetchKnowledgeBaseList(
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/list`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        cache: 'no-store',
      },
    );
    const data = await response.json();
    return {
      success: true,
      message: 'Success',
      data: data?.data?.knowledgeBases ?? [],
    };
  } catch (error: any) {
    console.error('fetchKnowledgeBaseList Error:', error);
    return {
      success: false,
      message: 'Failed to fetch knowledge base list.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function fetchKnowledgeBaseConversations(
  baseId: string,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/${baseId}/conversations`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        cache: 'no-store',
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('fetchKnowledgeBaseConversations Error:', error);
    return {
      success: false,
      message: 'Failed to fetch conversations.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function createKnowledgeBaseAction(
  name: string,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/create`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('createKnowledgeBaseAction Error:', error);
    return {
      success: false,
      message: 'Failed to create knowledge base.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function PostKnowledgeConversation(
  apiUrl: string,
  message: string,
  accessToken: string,
  knowledgebaseId: string,
  conversationId?: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message,
        knowledgebaseId,
        ...(conversationId && { conversationId }),
      }),
    });
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('PostKnowledgeConversation Error:', error);
    return {
      success: false,
      message: 'Failed to post message.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function loadSingleBaseConversation(
  conversationId: string,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/conversations/${conversationId}/messages`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('loadSingleBaseConversation Error:', error);
    return {
      success: false,
      message: 'Failed to load conversation.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export interface KnowledgeBaseFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  formattedFileSize: string;
  gcsUrl: string;
  documentId: string;
  knowledgebotId: string;
  title: string;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseFilesResponse {
  files: KnowledgeBaseFile[];
  totalCount: number;
  knowledgebotId: string;
}

export async function getKnowledgeBaseFiles(
  knowledgebotId: string,
  accessToken: string,
): Promise<ApiResponse<KnowledgeBaseFilesResponse>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/files?knowledgebotId=${knowledgebotId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data?.data };
  } catch (error: any) {
    console.error('getKnowledgeBaseFiles Error:', error);
    return {
      success: false,
      message: 'Failed to fetch files.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function getFileBlob(file: KnowledgeBaseFile | KnowledgeBankFile) {
  try {
    const response = await apiClient(file.gcsUrl, { skipTenantHeader: true });
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.log(error);
  }
}
export const deleteKnowledgeBaseFile = async (
  fileId: string,
  token: string | null | undefined,
): Promise<ApiResponse<any>> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/files/${fileId}`;
  try {
    const response = await apiClient(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('deleteKnowledgeBaseFile Error:', error);
    return {
      success: false,
      message: 'Failed to delete file.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};
export const deleteKnowledgeBase = async (
  baseId: string,
  token: string | null | undefined,
): Promise<ApiResponse<any>> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/knowledgebase/${baseId}`;
  try {
    const response = await apiClient(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('deleteKnowledgeBase Error:', error);
    return {
      success: false,
      message: 'Failed to delete knowledge base.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};
