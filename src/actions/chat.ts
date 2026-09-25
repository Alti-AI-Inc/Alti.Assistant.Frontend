'use server';

import { apiClient } from '@/lib/api-client';

//conversationId : search-1756433998769-erbgyce0r
export async function chatTogether(prompt: string, accessToken: string) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/chat/completions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
      }),
    },
  );
  const data = await response.json();

  return data;
}
