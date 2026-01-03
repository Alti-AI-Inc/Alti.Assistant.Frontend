'use server';

import {
  AssistantBrainstormRequest,
  BrainstormConfig,
  BrainstormRequest,
  BrainstormResponse,
} from '@/types/brainstorm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postBrainstormAssistant(
  payload: AssistantBrainstormRequest,
  accessToken: string,
): Promise<BrainstormResponse | null> {
  const apiUrl = `${API_BASE_URL}/brainstorm/assistant`;
  console.log('[brainstormActions] postBrainstormAssistant payload:', payload);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        'postBrainstormAssistant failed:',
        response.status,
        response.statusText,
      );
      // Try to parse error body if JSON
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        // ignore
      }
      return null;
    }

    const data = await response.json();
    console.log('[brainstormActions] postBrainstormAssistant data:', data);
    return data;
  } catch (error) {
    console.error('postBrainstormAssistant error:', error);
    return null;
  }
}

export async function generateStructuredBrainstorm(
  idea: string,
  config: BrainstormConfig,
  accessToken: string,
): Promise<BrainstormResponse | null> {
  const apiUrl = `${API_BASE_URL}/brainstorm/generate`;

  // Filter out undefined/null values from config to ensure clean payload as per request
  const cleanConfig = Object.entries(config).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Also filter empty arrays if any
      if (Array.isArray(value) && value.length === 0) {
        return acc;
      }
      // @ts-ignore
      acc[key] = value;
    }
    return acc;
  }, {} as Partial<BrainstormConfig>);

  // Ensure technology is formatted as string[] for API
  const constraints = { ...cleanConfig.constraints };
  if (constraints && typeof constraints.technology === 'string') {
    constraints.technology = constraints.technology
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  const payload: BrainstormRequest = {
    idea,
    ...cleanConfig,
    ...(constraints && { constraints }),
  };
  console.log(
    '[brainstormActions] generateStructuredBrainstorm payload:',
    payload,
  );

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        'generateStructuredBrainstorm failed:',
        response.status,
        response.statusText,
      );
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        // ignore
      }
      return null;
    }

    const data = await response.json();
    console.log('[brainstormActions] generateStructuredBrainstorm data:', data);
    return data;
  } catch (error) {
    console.error('generateStructuredBrainstorm error:', error);
    return null;
  }
}
