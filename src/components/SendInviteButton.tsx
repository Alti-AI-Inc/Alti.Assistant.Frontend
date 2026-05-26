import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const SendInviteButton = ({
  content,
  className = '',
  onClose,
}: {
  content: string;
  className?: string;
  onClose: () => void;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      setIsCopied(true);

      // Reset back after 1.5 seconds
      setTimeout(() => {
        setIsCopied(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to send: ', err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      className={cn(
        'flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-all duration-200 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300',
        content && 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black',
        className,
      )}
    >
      {isCopied ? 'Sent!' : 'Send'}
    </Button>
  );
};

export default SendInviteButton;
