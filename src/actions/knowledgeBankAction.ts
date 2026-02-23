'use server';

import { apiClient } from '@/lib/api-client';

enum FileStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

export type KnowledgeBankFile = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  formattedFileSize: string;
  gcsUrl: string;
  isProcessed: boolean;
  processingStatus: FileStatus;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeBankFolder = {
  id: string;
  name: string;
  parentFolderId: string | null;
  path: string;
  description: string;
  color: string;
  icon: string;
  tags: string[];
  fileCount: number;
  subfolderCount: number;
  totalSize: number;
  formattedTotalSize: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeBankFolderDetail = {
  id: string;
  name: string;
  parentFolderId: string | null;
  path: string;
  description: string;
  color: string;
  icon: string;
  tags: string[];
  fileCount: number;
  subfolderCount: number;
  totalSize: number;
  formattedTotalSize: string;
  depth: number;
  breadcrumb: {
    id: string;
    name: string;
  }[];
  ancestors: string[]; // or KnowledgeBankFolderDetail[] if full objects are included later
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeBankFolderContentResponse = {
  folder: KnowledgeBankFolderDetail;
  subfolders: KnowledgeBankFolderDetail[];
  files: KnowledgeBankFile[];
};

export const fileUploadAction = async (
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
    console.error('fileUploadAction Error:', error);
    return {
      success: false,
      message: 'Failed to upload file.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

export async function fetchKnowledgeBankFolders(
  accessToken: string,
): Promise<ApiResponse<KnowledgeBankFolder[]>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/folders`,
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
      data: data?.data?.folders ?? [],
    };
  } catch (error: any) {
    console.error('fetchKnowledgeBankFolders Error:', error);
    return {
      success: false,
      message: 'Failed to fetch folders.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function fetchKnowledgeBankFolderContent(
  folderId: string,
  accessToken: string,
): Promise<ApiResponse<KnowledgeBankFolderContentResponse>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/folders/${folderId}/contents`,
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
    return { success: true, message: 'Success', data: data?.data };
  } catch (error: any) {
    console.error('fetchKnowledgeBankFolderContent Error:', error);
    return {
      success: false,
      message: 'Failed to fetch folder content.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function createKnowledgeBankFolderAction(
  name: string,
  description: string,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/folders`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('createKnowledgeBankFolderAction Error:', error);
    return {
      success: false,
      message: 'Failed to create folder.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export async function updateKnowledgeBankFolderAction(
  name: string,
  description: string,
  folderId: string,
  accessToken: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/folders/${folderId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('updateKnowledgeBankFolderAction Error:', error);
    return {
      success: false,
      message: 'Failed to update folder.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}

export const uploadfileToKnowledgeBankAction = async (
  formData: FormData,
  accessToken: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/upload`,
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
    console.error('uploadfileToKnowledgeBankAction Error:', error);
    return {
      success: false,
      message: 'Failed to upload file to knowledge bank.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

export const processKnowledgeBankFile = async (
  fileId: string,
  accessToken: string,
): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient(
      `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/files/${fileId}/process`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('processKnowledgeBankFile Error:', error);
    return {
      success: false,
      message: 'Failed to process file.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

export const deleteKnowledgeBankFolderAction = async (
  folderId: string,
  token: string | null | undefined,
): Promise<ApiResponse<any>> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/folders/${folderId}`;
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
    console.error('deleteKnowledgeBankFolderAction Error:', error);
    return {
      success: false,
      message: 'Failed to delete folder.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};

export const deleteKnowledgeBankFile = async (
  fileId: string,
  token: string | null | undefined,
): Promise<ApiResponse<any>> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/files/${fileId}`;
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
    console.error('deleteKnowledgeBankFile Error:', error);
    return {
      success: false,
      message: 'Failed to delete file.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
};
