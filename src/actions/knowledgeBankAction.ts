'use server';

enum FileStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
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
) => {
  const response = await fetch(
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
  return data;
};

export async function fetchKnowledgeBankFolders(
  accessToken: string,
): Promise<KnowledgeBankFolder[]> {
  const response = await fetch(
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
  // console.log(data?.data);
  return data?.data?.folders;
}
export async function fetchKnowledgeBankFolderContent(
  folderId: string,
  accessToken: string,
): Promise<KnowledgeBankFolderContentResponse> {
  const response = await fetch(
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
  // console.log('folder content', data);
  return data?.data;
}

export async function createKnowledgeBankFolderAction(
  name: string,
  description: string,
  accessToken: string,
) {
  const response = await fetch(
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
  return data;
}
export async function updateKnowledgeBankFolderAction(
  name: string,
  description: string,
  folderId: string,
  accessToken: string,
) {
  const response = await fetch(
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
  return data;
}

export const uploadfileToKnowledgeBankAction = async (
  formData: FormData,
  accessToken: string,
) => {
  const response = await fetch(
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
  // console.log('upload file to knowledge bank response', data);
  return data;
};
export const processKnowledgeBankFile = async (
  fileId: string,
  accessToken: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/files/${fileId}/process`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  // console.log('process file response', data);
  return data;
};

export const deleteKnowledgeBankFolderAction = async (
  folderId: string,
  token: string | null | undefined,
) => {
  // const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${model}/delete-single-response/${objectId}`;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/folders/${folderId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

export const deleteKnowledgeBankFile = async (
  fileId: string,
  token: string | null | undefined,
) => {
  // const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${model}/delete-single-response/${objectId}`;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/knowledge-bank/files/${fileId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json(); // ✅ Read once
    console.log('file deleted', result);

    return result;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};
