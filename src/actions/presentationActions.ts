'use server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

export interface PresentationStatusData {
  message: string;
  status: 'pending' | 'completed' | 'failed';
  id: string;
  created_at: string;
  data?: {
    presentation_id: string;
    path: string;
    edit_path: string;
  } | null;
  error: string | null;
  updated_at: string;
  publicUrl: string | null;
  uploadResult?: object | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get the status of an async presentation generation task.
// Poll this endpoint until status is 'completed' or 'failed'.
export async function getPresentationStatus(
  taskId: string,
  conversationId: string,
  accessToken: string,
  userId?: string,
): Promise<ApiResponse<PresentationStatusData>> {
  try {
    const params = new URLSearchParams({
      conversationId,
      ...(userId && { userId }),
    });

    const response = await fetch(
      `${API_BASE_URL}/presentation/status/${taskId}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        '[presentationActions] getPresentationStatus error:',
        errorText,
      );
      return {
        success: false,
        message: 'Failed to get presentation status.',
        debugMessage: `HTTP Error ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    console.log('[presentationActions] getPresentationStatus response:', data);
    return { success: true, message: 'Success', data: data.data || data };
  } catch (error: any) {
    console.error('getPresentationStatus Error:', error);
    return {
      success: false,
      message: 'Failed to get presentation status.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
