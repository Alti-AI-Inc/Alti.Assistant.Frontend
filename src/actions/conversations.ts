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
  console.log('response in post conversation', data.data.responseMessage);

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
    console.log('delete response in server', { response });
    return response.json();
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Failed to delete the session');
    // }

    console.log('Session deleted successfully');
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};
