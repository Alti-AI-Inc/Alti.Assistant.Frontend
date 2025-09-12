'use server';

// "data": {
//         "responseMessage": {
//             "answer":string,
//         },
//         "conversationId":string,
//         "messageCount": number,
//     }

export async function PostConversation(
  message: string,
  accessToken: string,
  conversationId?: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/search/assistant`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message,
        ...(conversationId && { conversationId }),
      }),
    },
  );
  const data = await response.json();

  return data;
}


export async function loadConversationListAction(accessToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      next: { revalidate: 60 },
    },
  );
  const data = await response.json();
  return data;
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
