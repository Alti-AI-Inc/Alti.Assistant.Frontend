import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { marked } from 'marked'; // Or any markdown-to-html parser

import { Button } from './ui/button';

const CopyButton = ({
  content,
  className = '',
}: {
  content: string;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const htmlContent = await marked.parse(content);
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([content], { type: 'text/plain' });

      // 2. Create a Blob for the HTML and Plain Text versions
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        })
      ]);
      setIsCopied(true);

      // Reset back to copy icon after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      className={`size-8 -ml-2 transition-all duration-200 hover:opacity-70 ${className}`}
      title={isCopied ? 'Copied!' : 'Copy to clipboard'}
    >
      {isCopied ? (
        <Check className="mt-2 size-4 text-slate-400 transition-all duration-200" />
      ) : (
        <Copy className="mt-2 size-4 text-slate-400 transition-all duration-200" />
      )}
    </Button>
  );
};

export default CopyButton;
