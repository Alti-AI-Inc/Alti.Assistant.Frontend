'use client';

import { getTranscription } from '@/actions/transcription';
// import { getTranscription } from '@/actions/transcription';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowUp, LoaderCircle, Mic, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';

export default function AudioRecorder({
  setMessage,
  setIsRecording,
}: {
  setMessage: (message: string) => void;
  setIsRecording?: (recording: boolean) => void;
}) {
  const { data } = useSession();
  const [recording, setRecording] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const audioChunks = useRef<Blob[]>([]);
  const cancelRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  const startMediaRecorderFallback = async () => {
    if (!navigator.mediaDevices) {
      console.error('navigator.mediaDevices not supported');
      if (setIsRecording) setIsRecording(false);
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = e => {
        audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
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
          setLoadingText(true);
          const res = await getTranscription(formData);
          console.log({ res });

          if (!res.success) {
            console.error('Transcription failed:', res.debugMessage);
          } else if (res.data && res.data.transcription) {
            setMessage(res.data.transcription);
          }
        } catch (err) {
          console.error('❌ Error uploading:', err);
        } finally {
          setLoadingText(false);
          if (setIsRecording) setIsRecording(false);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Failed to get media devices for backup recording:', err);
      if (setIsRecording) setIsRecording(false);
      setRecording(false);
    }
  };

  const startRecording = async () => {
    cancelRef.current = false;
    audioChunks.current = [];
    if (setIsRecording) setIsRecording(true);

    // 1. Check secure context first to prevent silent failures on HTTP staging environments
    const isSecureContext =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isSecureContext) {
      const isIPAddress = /^[0-9.]+$/.test(window.location.hostname);
      if (isIPAddress) {
        toast.error('Microphone access requires HTTPS on IP addresses. Please test on http://localhost:3000 instead.');
      } else {
        toast.error('Speech to Text requires a secure HTTPS connection or localhost.');
      }
      if (setIsRecording) setIsRecording(false);
      setRecording(false);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Microphone access is not supported by your browser.');
      if (setIsRecording) setIsRecording(false);
      setRecording(false);
      return;
    }

    // 2. Check if microphone permission is already granted via Permissions API
    let permissionGranted = false;
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as any });
        if (permissionStatus.state === 'granted') {
          permissionGranted = true;
        }
      }
    } catch (e) {
      console.warn('Permissions API query failed:', e);
    }

    if (!permissionGranted) {
      // Explicitly request microphone permission first to avoid race conditions with SpeechRecognition
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release microphone temporarily so that SpeechRecognition can capture it
        stream.getTracks().forEach(track => track.stop());
        // Wait 300ms to allow browser audio hardware to release cleanly
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (permissionErr) {
        console.warn('Microphone permission denied:', permissionErr);
        toast.error('Microphone permission denied. Please allow microphone access.');
        if (setIsRecording) setIsRecording(false);
        setRecording(false);
        return;
      }
    }

    // 3. Microphone is authorized. Now instantiate SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const text = finalTranscript + interimTranscript;
          if (text.trim() && !cancelRef.current) {
            setMessage(text);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'no-speech') {
            if (setIsRecording) setIsRecording(false);
            setRecording(false);
          }
        };

        recognition.onend = () => {
          console.log('Speech recognition ended');
          if (setIsRecording) setIsRecording(false);
          setRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setRecording(true);
      } catch (err) {
        console.warn('Failed to start SpeechRecognition, trying backup:', err);
        await startMediaRecorderFallback();
      }
    } else {
      await startMediaRecorderFallback();
    }
  };

  const stopRecording = () => {
    if (setIsRecording) setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      recognitionRef.current = null;
    }

    if (mediaRecorder) {
      try {
        mediaRecorder.stop();
      } catch (err) {
        console.error('Error stopping media recorder:', err);
      }
    }

    setRecording(false);
  };

  const handleCancelRecording = () => {
    cancelRef.current = true;
    if (setIsRecording) setIsRecording(false);
    setMessage(''); // Clear the prompt text on cancel!

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        console.error('Error aborting recognition:', err);
      }
      recognitionRef.current = null;
    }

    if (mediaRecorder) {
      try {
        mediaRecorder.stop();
      } catch (err) {
        console.error('Error stopping media recorder on cancel:', err);
      }
    }

    setRecording(false);
    setLoadingText(false);
  };

  return (
    <div className="flex items-center gap-2">
      {recording && (
        <div className="flex h-7 w-20 items-end gap-1">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded bg-neutral-800"
              animate={{
                height: [8, Math.random() * 6 + 16, 12],
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
      )}
      {loadingText && !recording ? (
        <LoaderCircle className="size-7 flex-none animate-spin cursor-pointer rounded-lg border-2 border-gray-300 bg-black p-1 text-white" />
      ) : !recording && !loadingText ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Mic
              onClick={startRecording}
              className="size-7 flex-none cursor-pointer rounded-lg border-2 border-gray-300 bg-black p-1 text-white"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Speech to Text</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex space-x-2">
          <X
            onClick={handleCancelRecording}
            className="size-7 flex-none cursor-pointer rounded-lg p-1 text-neutral-600"
          />
          <ArrowUp
            onClick={stopRecording}
            className="size-7 flex-none cursor-pointer rounded-lg border-2 border-gray-300 bg-black p-1 text-white"
          />
        </div>
      )}
    </div>
  );
}
