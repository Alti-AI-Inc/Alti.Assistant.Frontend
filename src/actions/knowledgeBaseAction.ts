'use server';

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
  console.log({ data });
  return data;
};

export async function fetchKnowledgeBaseList(accessToken: string) {
  const response = await fetch(
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
  console.log({ data });
  return data.data.knowledgeBases;
}

export async function fetchKnowledgeBaseConversations(
  baseId: string,
  accessToken: string,
) {
  const response = await fetch(
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
  console.log({ data });
  return data.data;
}
// id: '68e21338c5a42f0c0fd0b14d',
// name: 'My knowledgebase',
// userId: '6830a57675ab371485a0be3a',
// description: '',
// isActive: true,
// documentsCount: 0,
// totalFileSize: 0,
// formattedFileSize: '0 Bytes',
// createdAt: '2025-10-05T06:42:00.126Z',
// updatedAt: '2025-10-05T06:42:00.126Z'
export async function createKnowledgeBaseAction(
  name: string,
  accessToken: string,
) {
  const response = await fetch(
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
  console.log({ data });
  return data;
}

export async function PostKnowledgeConversation(
  apiUrl: string,
  message: string,
  accessToken: string,
  knowledgebaseId: string,
  conversationId?: string,
) {
  const response = await fetch(apiUrl, {
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
  return data;
}

export async function loadSingleBaseConversation(
  conversationId: string,
  accessToken: string,
) {
  const response = await fetch(
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
  return data;
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
): Promise<KnowledgeBaseFilesResponse> {
  const response = await fetch(
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
  console.log('files response', data?.data);
  return data?.data;
}

export async function getFileBlog(file: KnowledgeBaseFile) {
  try {
    const response = await fetch(file.gcsUrl);
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.log(error);
  }
}
