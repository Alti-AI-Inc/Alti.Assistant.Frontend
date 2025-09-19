'use server';
export const getTranscription = async (formData: FormData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wishper/whisper-transcribe`,
    {
      method: 'POST',
      body: formData,
    },
  );

  return response.json();
};
