'use client';

import { getTranscription } from '@/actions/transcription';
// import { getTranscription } from '@/actions/transcription';
import { motion } from 'framer-motion';
import { ArrowUp, LoaderCircle, Mic } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';

export default function AudioRecorder({
  setMessage,
}: {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data } = useSession();
  const [recording, setRecording] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (!navigator.mediaDevices) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunks.current = [];

    recorder.ondataavailable = e => {
      audioChunks.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      audioChunks.current = [];

      // release mic
      stream.getTracks().forEach(track => track.stop());

      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'json');
      formData.append('temperature', '0');
      formData.append('user', data?.user.id as string);

      console.log({ formData });

      // send to API
      try {
        const res = await getTranscription(formData);

        console.log({ res });
        if (!res.text) throw new Error('Upload failed');
        setMessage(res?.text);
        // setMessage('lorem')
      } catch (err) {
        setLoadingText(false);
        console.error('❌ Error uploading:', err);
      } finally {
        setLoadingText(false);
      }
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    setLoadingText(true);
    setRecording(false);
  };

  return (
    <div className="flex gap-4">
      <div className="flex h-6 w-60 items-end gap-1">
        {recording &&
          [...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded bg-neutral-800"
              animate={{
                height: recording ? [8, Math.random() * 6 + 16, 12] : 2,
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 0.7,
                delay: i * 0.09,
              }}
            />
          ))}
      </div>
      {loadingText && !recording ? (
        <LoaderCircle className="size-6 flex-none animate-spin cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white" />
      ) : !recording && !loadingText ? (
        <Mic
          onClick={startRecording}
          className="size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
        />
      ) : (
        <ArrowUp
          onClick={stopRecording}
          className="size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
        />
      )}
    </div>
  );
}
