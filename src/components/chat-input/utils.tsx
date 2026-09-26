import { File, FileSpreadsheet, FileText, FileType, Image as ImageIcon, Presentation } from 'lucide-react';
import { useImageGeneration } from '@/hooks/useImageGeneration';

export interface ChatInputProps {
  conversationId?: string;
  imageGenHook?: ReturnType<typeof useImageGeneration>;
  selectedFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  isStudio?: boolean;
  isConversationLoading?: boolean;
  showAsNewChat?: boolean;
}

export const isNewChatId = (id?: string) => {
  return (
    !id ||
    id === 'new-chat' ||
    id === 'new-search' ||
    id === 'new-research' ||
    id === 'new-monitor' ||
    id === 'new-workflow'
  );
};

export const extractDomainFromUrl = (urlStr?: string): string => {
  if (!urlStr) return '';
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};

export const deduplicateReferences = <T extends { url?: string; domain?: string; title?: string }>(
  refs: T[],
): T[] => {
  if (!Array.isArray(refs) || refs.length === 0) return [];
  const seenKeys = new Set<string>();
  const deduplicated: T[] = [];

  for (const ref of refs) {
    if (!ref) continue;
    const url = (ref.url || '').toLowerCase();
    const domain = (ref.domain || extractDomainFromUrl(ref.url)).toLowerCase();

    if (domain.includes('exa.ai') || url.includes('exa.ai')) {
      continue;
    }

    const key =
      domain && domain !== 'web'
        ? domain
        : (ref.title || ref.url || '').toLowerCase();
    if (!key) continue;

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      deduplicated.push(ref);
    }
  }

  return deduplicated;
};

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <FileText className="size-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileType className="size-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet className="size-5 text-green-600" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <ImageIcon className="size-5 text-purple-500" />;
    case 'ppt':
    case 'pptx':
      return <Presentation className="size-5 text-orange-500" />;
    default:
      return <File className="size-5 text-gray-500" />;
  }
};

export const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE';
};
