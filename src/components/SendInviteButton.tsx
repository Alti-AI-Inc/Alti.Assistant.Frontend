import { ArrowRight, Check } from 'lucide-react';
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

      // Reset back to copy icon after 2 seconds
      setTimeout(() => {
        // setIsCopied(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      className={cn('size-8 -ml-2 bg-gray-300 flex items-center justify-center transition-all duration-200 hover:bg-gray-400',
        content && 'bg-black hover:bg-black',
        className)}
    // title={isCopied ? 'Copied!' : 'Copy to clipboard'}
    >
      {isCopied ? (
        <Check className="size-4 text-green-600 transition-all duration-200" />
      ) : (
        <ArrowRight className="size-4 text-white transition-all duration-200" />
      )}
    </Button>
  );
};

export default SendInviteButton;
