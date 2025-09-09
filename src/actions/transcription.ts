'use server';
export const getTranscription = async (formData: FormData) => {
  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY!}`,
      },
      body: formData,
    },
  );
  return response.json();
};

 // send to API
        // try {
        //   const res = await getTranscription(formData);

        //   console.log({ res });
        //   if (!res.ok) throw new Error('Upload failed');
        //   console.log('✅ Uploaded successfully');
        // } catch (err) {
        //   console.error('❌ Error uploading:', err);
        // }