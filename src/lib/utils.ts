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
