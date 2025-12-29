'use server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

export async function getVideoUrl(
  operationId: string,
): Promise<ApiResponse<string | null>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/video/operations`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          operationId: operationId,
        }),
      },
    );

    const data = await response.json();
    const videoUrl = data?.data?.response?.videoUrl || null;
    return { success: true, message: 'Success', data: videoUrl };
  } catch (error: any) {
    console.error('getVideoUrl Error:', error);
    return {
      success: false,
      message: 'Failed to get video URL.',
      debugMessage: error.message || String(error),
      statusCode: 500,
    };
  }
}
