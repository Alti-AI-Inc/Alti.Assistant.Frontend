'use client';

import { getTranscription } from '@/actions/transcription';
// import { getTranscription } from '@/actions/transcription';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowUp, LoaderCircle, Mic, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function AudioRecorder({
  setMessage,
}: {
  setMessage: (message: string) => void;
}) {
  const { data } = useSession();
  const [recording, setRecording] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const audioChunks = useRef<Blob[]>([]);
  const cancelRef = useRef(false);

  const startRecording = async () => {
    if (!navigator.mediaDevices) return;

    cancelRef.current = false;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunks.current = [];

    recorder.ondataavailable = e => {
      audioChunks.current.push(e.data);
    };

    recorder.onstop = async () => {
      // release mic
      stream.getTracks().forEach(track => track.stop());
      if (cancelRef.current) {
        audioChunks.current = [];
        return;
      }
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      audioChunks.current = [];

      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      formData.append('user', data?.user.id as string);

      try {
        const res = await getTranscription(formData);
        console.log({ res });

        if (!res.success) {
          console.error('Transcription failed:', res.debugMessage);
          // throw new Error(res.message);
        } else if (res.data && res.data.transcription) {
          setMessage(res.data.transcription);
        }
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

  const handleCancelRecording = () => {
    if (!mediaRecorder) return;
    cancelRef.current = true;
    mediaRecorder.stop();
    setRecording(false);
    setLoadingText(false);
  };

  return (
    <div className="flex gap-4">
      <div className={cn('flex h-6 w-20 items-end gap-1', recording && 'w-10')}>
        {recording &&
          [...Array(10)].map((_, i) => (
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
        <Tooltip>
          <TooltipTrigger>
            <Mic
              onClick={startRecording}
              className="size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Speech-to-Text</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex space-x-2">
          <X
            onClick={handleCancelRecording}
            className="size-6 flex-none cursor-pointer rounded-full p-0.5 text-neutral-600"
          />
          <ArrowUp
            onClick={stopRecording}
            className="size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-black p-0.5 text-white"
          />
        </div>
      )}
    </div>
  );
}
