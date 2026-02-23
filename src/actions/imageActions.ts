'use server';

import { apiClient } from '@/lib/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ============ Types ============

export interface ImageIntentResponse {
  isEditable: boolean;
  intent: 'generate' | 'edit';
  editType: string | null;
  reasoning: string;
  needsMoreInfo: boolean;
  questions: string[];
  conversationId: string;
  userType: string;
  userId: string;
}

export interface PromptEvaluation {
  isComplete: boolean;
  score: number;
  missingElements: string[];
  suggestions: string[];
}

export interface EvaluatePromptResponse {
  evaluation: PromptEvaluation;
  conversationId: string;
  userType: string;
}

export interface AddDetailResponse {
  evaluation: PromptEvaluation;
  conversationHistory: string[];
  messageCount: number;
  conversationId: string;
}

export interface FinalizePromptResponse {
  enhancedPrompt: string;
  conversationHistory: string[];
  conversationId: string;
}

export interface ImageMetadata {
  imageUrl: string;
  filename: string;
  service: string;
  reasoning: string;
  confidence: number;
  aspectRatio?: string;
  negativePrompt?: string;
  timestamp: string;
}

export interface GeneratedImage {
  filename: string;
  url: string;
  service: string;
  reasoning: string;
  confidence: number;
}

export interface GenerateImageResponse {
  responseMessage: {
    answer: string;
    image: GeneratedImage;
    prompt: string;
    metadata: ImageMetadata;
  };
  conversationId: string;
  messageCount: number;
  userType: string;
  userId: string;
}

export interface EditedImage {
  filename: string;
  url: {
    url: string;
    filename: string;
    service: string;
    reasoning: string;
  };
  service: string;
}

export interface EditImageResponse {
  responseMessage: {
    answer: string;
    image: EditedImage;
    prompt: string;
    metadata: {
      imageUrl: {
        url: string;
        filename: string;
        service: string;
        reasoning: string;
      };
      filename: string;
      service: string;
      aspectRatio?: string;
      timestamp: string;
    };
  };
  conversationId: string;
  messageCount: number;
  userType: string;
  userId: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
}

// ============ Server Actions ============

/**
 * Step 1: Analyze user intent - determine if request is for generation or editing
 */
export async function analyzeImageIntent(
  request: string,
  hasImage: boolean,
  conversationId: string | undefined,
  accessToken: string,
): Promise<ApiResponse<ImageIntentResponse>> {
  try {
    console.log(
      '[imageActions] analyzeImageIntent payload:',
      JSON.stringify(
        {
          request,
          hasImage,
          conversationId,
        },
        null,
        2,
      ),
    );
    const response = await apiClient(
      `${API_URL}/enhanced-image/analyze-image-intent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request,
          hasImage,
          ...(conversationId && { conversationId }),
        }),
      },
    );

    const data = await response.json();
    console.log(
      '[imageActions] analyzeImageIntent response:',
      JSON.stringify(data, null, 2),
    );
    return data;
  } catch (error: any) {
    console.error('analyzeImageIntent Error:', error);
    return {
      statusCode: 500,
      success: false,
      message: 'Failed to analyze image intent.',
      debugMessage: error.message || String(error),
    };
  }
}

/**
 * Step 2 (Generation Flow): Evaluate prompt score
 */
export async function evaluatePrompt(
  prompt: string,
  conversationId: string,
  conversationHistory: string,
  accessToken: string,
): Promise<ApiResponse<EvaluatePromptResponse>> {
  try {
    console.log(
      '[imageActions] evaluatePrompt payload:',
      JSON.stringify(
        {
          prompt,
          conversationId,
          conversationHistory,
        },
        null,
        2,
      ),
    );

    const finalPrompt = conversationHistory
      ? `Conversation History:\n${conversationHistory}\n\nCurrent Request: ${prompt}`
      : prompt;

    const response = await apiClient(`${API_URL}/enhanced-image/evaluate-prompt`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        conversationId,
      }),
    });

    const data = await response.json();
    console.log(
      '[imageActions] evaluatePrompt response:',
      JSON.stringify(data, null, 2),
    );
    return data;
  } catch (error: any) {
    console.error('evaluatePrompt Error:', error);
    return {
      statusCode: 500,
      success: false,
      message: 'Failed to evaluate prompt.',
      debugMessage: error.message || String(error),
    };
  }
}

/**
 * Step 3 (Generation Flow): Add detail to improve prompt score
 */
export async function addDetail(
  conversationId: string,
  userId: string,
  detail: string,
  accessToken: string,
): Promise<ApiResponse<AddDetailResponse>> {
  try {
    console.log(
      '[imageActions] addDetail payload:',
      JSON.stringify(
        {
          conversationId,
          userId,
          detail,
        },
        null,
        2,
      ),
    );

    const response = await apiClient(`${API_URL}/enhanced-image/add-detail`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        userId,
        detail,
      }),
    });

    const data = await response.json();
    console.log(
      '[imageActions] addDetail response:',
      JSON.stringify(data, null, 2),
    );
    return data;
  } catch (error: any) {
    console.error('addDetail Error:', error);
    return {
      statusCode: 500,
      success: false,
      message: 'Failed to add detail.',
      debugMessage: error.message || String(error),
    };
  }
}

/**
 * Step 4 (Generation Flow): Finalize and get enhanced prompt
 */
export async function finalizePrompt(
  conversationId: string,
  userId: string,
  accessToken: string,
): Promise<ApiResponse<FinalizePromptResponse>> {
  try {
    console.log(
      '[imageActions] finalizePrompt payload:',
      JSON.stringify(
        {
          conversationId,
          userId,
        },
        null,
        2,
      ),
    );

    const response = await apiClient(`${API_URL}/enhanced-image/finalize-prompt`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        userId,
      }),
    });

    const data = await response.json();
    console.log(
      '[imageActions] finalizePrompt response:',
      JSON.stringify(data, null, 2),
    );
    return data;
  } catch (error: any) {
    console.error('finalizePrompt Error:', error);
    return {
      statusCode: 500,
      success: false,
      message: 'Failed to finalize prompt.',
      debugMessage: error.message || String(error),
    };
  }
}

/**
 * Step 5 (Generation Flow): Generate the final image
 */
export async function generateImage(
  prompt: string,
  accessToken: string,
  aspectRatio?: string,
  negativePrompt?: string,
  conversationId?: string,
  userId?: string,
): Promise<ApiResponse<GenerateImageResponse>> {
  try {
    console.log(
      '[imageActions] generateImage payload:',
      JSON.stringify(
        {
          prompt,
          aspectRatio,
          negativePrompt,
          conversationId,
          userId,
        },
        null,
        2,
      ),
    );

    const response = await apiClient(`${API_URL}/enhanced-image/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        ...(aspectRatio && { aspectRatio }),
        ...(negativePrompt && { negativePrompt }),
        ...(conversationId && { conversationId }),
        ...(userId && { userId }),
      }),
    });

    const data = await response.json();
    console.log(
      '[imageActions] generateImage response:',
      JSON.stringify(data, null, 2),
    );
    return data;
  } catch (error: any) {
    console.error('generateImage Error:', error);
    return {
      statusCode: 500,
      success: false,
      message: 'Failed to generate image.',
      debugMessage: error.message || String(error),
    };
  }
}

/**
 * Edit Flow: Edit an existing image
 * @param imageBase64 - Full data URL including prefix (e.g., 'data:image/jpeg;base64,/9j/4AAQ...')
 */
export async function editImage(
  prompt: string,
  imageBase64: string,
  conversationId: string,
  userId: string,
  accessToken: string,
  aspectRatio?: string,
): Promise<ApiResponse<EditImageResponse>> {
  try {
    console.log(
      '[imageActions] editImage payload:',
      JSON.stringify(
        {
          prompt,
          imageBase64: imageBase64
            ? `${imageBase64.slice(0, 50)}...`
            : undefined,
          conversationId,
          userId,
          aspectRatio,
        },
        null,
        2,
      ),
    );

    const response = await apiClient(`${API_URL}/enhanced-image/edit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        imageBase64,
        conversationId,
        userId,
        ...(aspectRatio && { aspectRatio }),
      }),
    });

    const data = await response.json();
    console.log(
      '[imageActions] editImage response:',
      JSON.stringify(data, null, 2),
    );
    return data;
  } catch (error: any) {
    console.error('editImage Error:', error);
    return {
      statusCode: 500,
      success: false,
      message: 'Failed to edit image.',
      debugMessage: error.message || String(error),
    };
  }
}
