'use server';

import {
  StartDocConversationRequest,
  ContinueDocConversationRequest,
  BaseGenerationRequest,
  DocConversationResponse,
  DirectGenerationResponse,
  ReviewResponse,
} from '@/types/document-generation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Group 1: Conversation Assistant ---

export async function startDocumentConversation(
  payload: StartDocConversationRequest,
  accessToken: string,
): Promise<DocConversationResponse> {
  const response = await fetch(`${API_BASE_URL}/documents/assistant`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log('[documentActions] startDocumentConversation response:', data);
  return data;
}

export async function continueDocumentConversation(
  payload: ContinueDocConversationRequest,
  accessToken: string,
): Promise<DocConversationResponse> {
  const response = await fetch(`${API_BASE_URL}/documents/assistant`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log('[documentActions] continueDocumentConversation response:', data);
  return data;
}

// --- Group 2: Direct Generation ---

export async function generateDocument(
  payload: BaseGenerationRequest,
  accessToken: string,
): Promise<DirectGenerationResponse> {
  const response = await fetch(`${API_BASE_URL}/documents/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log('[documentActions] generateDocument response:', data);
  return data;
}

// --- Group 3: Document Review ---

export async function uploadReviewDocumentAssistant(
  formData: FormData,
  accessToken: string,
): Promise<ReviewResponse> {
  const response = await fetch(`${API_BASE_URL}/document-review/assistant`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // Content-Type header is set automatically with FormData
    },
    body: formData,
  });

  const data = await response.json();
  console.log(
    '[documentActions] uploadReviewDocumentAssistant response:',
    data,
  );
  return data;
}

export async function submitDirectReview(
  formData: FormData,
  accessToken: string,
): Promise<ReviewResponse> {
  const response = await fetch(`${API_BASE_URL}/document-review/review`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();
  console.log('[documentActions] submitDirectReview response:', data);
  return data;
}
