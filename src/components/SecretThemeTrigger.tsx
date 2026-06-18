'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function SecretThemeTrigger() {
  const { theme, setTheme } = useTheme();
  const inputSequence = useRef<string[]>([]);
  const targetSequence = 'hotdog';
  const prevTheme = useRef(theme);

  useEffect(() => {
    if (theme === 'hotdog' && prevTheme.current !== 'hotdog') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('hotdog');
        window.speechSynthesis.speak(utterance);
      }
      for (let i = 0; i < 500; i++) {
        console.log('HOTDOG');
      }
    }
    prevTheme.current = theme;
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      
      if (key.length === 1 && key >= 'a' && key <= 'z') {
        inputSequence.current.push(key);
        
        if (inputSequence.current.length > targetSequence.length) {
          inputSequence.current.shift();
        }

        const typed = inputSequence.current.join('');
        if (typed === targetSequence) {
          if (theme === 'hotdog') {
            setTheme('light');
            toast.success('🌭 Hot Dog Stand theme deactivated.');
          } else {
            setTheme('hotdog');
            toast.success('🌭 Hot Dog Stand theme activated! Vintage mode enabled.');
          }
          inputSequence.current = [];
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [theme, setTheme]);

  return null;
}
