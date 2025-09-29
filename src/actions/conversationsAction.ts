'use server';

export async function PostConversation(
  apiUrl: string,
  message: string,
  accessToken: string,
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
      ...(conversationId && { conversationId }),
    }),
  });
  const data = await response.json();
  return data;
}

export async function fetchConversationList(accessToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
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
