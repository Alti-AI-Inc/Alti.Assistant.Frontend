'use server';
export const getTranscription = async (formData: FormData) => {
  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: formData,
    },
  );
  return response.json();
};
