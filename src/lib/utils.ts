import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatArea = (area: number) => {
  return area.toLocaleString('en-US');
};

export const formatConversationTitle = (title: string) => {
  return title?.replace(/^(Search|Code|Image|Deep Research):\s*/, '');
};

export const containsYouTubeUrl = (text: string) => {
  const youtubeRegex =
    /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
  // /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;

  const result = youtubeRegex.test(text);
  return result;
};
