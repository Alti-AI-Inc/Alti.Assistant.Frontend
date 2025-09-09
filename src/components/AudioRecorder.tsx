'use client';

// import { getTranscription } from '@/actions/transcription';
import { motion } from 'framer-motion';
import { ArrowUp, Mic } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

export default function AudioRecorder() {
  const { data } = useSession();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (!navigator.mediaDevices) return;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = e => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        audioChunks.current = [];

        // prepare FormData
        const formData = new FormData();
        formData.append('file', blob, 'recording.webm');
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'json'); // optional
        formData.append('temperature', '0'); // optional
        formData.append('user', data?.user.id as string); // if you want to pass user info

        console.log({ formData });
      };
    });
  }, [data?.user.id]);

  const startRecording = () => {
    if (!mediaRecorder) return;
    audioChunks.current = [];
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    mediaRecorder.stop();
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
      {!recording ? (
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
