'use server';

export async function PostConversation(
  apiUrl: string,
  message: string,
  accessToken: string,
  conversationId?: string,
  knowledgebaseId?: string,
) {
  console.log({ apiUrl, knowledgebaseId });
  const response = await fetch(apiUrl, {
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
  const data = await response.json();
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // const data = { data: { responseMessage: { answer: 'test' } } };
  return data;
}

export interface Conversation {
  _id: string;
  conversationId: string;
  title: string;
  updatedAt: string;
  createdAt: string;
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
): Promise<ConversationListResponse> {
  const res = await fetch(
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
    throw new Error(`Failed to fetch conversations: ${res.statusText}`);
  }

  const data = await res.json();
  return data.data as ConversationListResponse;
}

export async function fetchSavedConversationList(accessToken: string) {
  const response = await fetch(
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
  const data = await response.json();
  return data.data.conversations;
}

export async function searchConversations(
  accessToken: string,
  searchTerm: string,
) {
  const response = await fetch(
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
  const data = await response.json();
  return data.data;
}

export async function loadSingleConversation(
  conversationId: string,
  accessToken: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`,
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
export async function loadSingleSharedConversation(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations/shared/${id}`,
  );
  const data = await response.json();
  return data;
}

export const deleteConversation = async (
  token: string | null | undefined,
  conversationId: string,
) => {
  // const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${model}/delete-single-response/${objectId}`;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`;
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

export const shareConversation = async (
  conversationId: string,
  accessToken: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/share`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
    },
  );
  const data = await response.json();
  return data;
};

export async function renameConversationAction(
  conversationId: string,
  newTitle: string,
  accessToken: string,
) {
  const response = await fetch(
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
  const data = await response.json();

  return data;
}

export async function saveConversationAction(
  conversationId: string,
  is_saved = true,
  accessToken: string,
) {
  const response = await fetch(
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
  const data = await response.json();

  return data;
}
