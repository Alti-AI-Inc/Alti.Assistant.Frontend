'use server';

import { apiClient } from '@/lib/api-client';

//conversationId : search-1756433998769-erbgyce0r
export async function chatOpenAI(prompt: string, accessToken: string) {
  const response = await apiClient(
    `${process.env.NEXT_PUBLIC_API_URL}/openai/4nano/get-response`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    },
  );
  const data = await response.json();

  return data;
}
