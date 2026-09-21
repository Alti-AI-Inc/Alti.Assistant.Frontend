'use server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  debugMessage?: string;
  statusCode?: number;
}

export const getTranscription = async (
  formData: FormData,
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wishper/whisper-transcribe`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await response.json();
    return { success: true, message: 'Success', data }; // data probably contains { transcription: string }
  } catch (error: unknown) {
    console.error('getTranscription Error:', error);
    return {
      success: false,
      message: 'Failed to transcribe audio.',
      debugMessage: error instanceof Error ? error.message : String(error),
      statusCode: 500,
    };
  }
};
