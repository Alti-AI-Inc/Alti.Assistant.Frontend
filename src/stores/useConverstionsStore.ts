import { create } from 'zustand';
import {
  ConversationSlice,
  createConversationSlice,
} from './slices/createConversationSlice';
import { createRewriteSlice, RewriteSlice } from './slices/createRewriteSlice';
import {
  createTranslationSlice,
  TranslationSlice,
} from './slices/createTranslationSlice';

// Re-export types for backward compatibility
export * from '@/types/conversation';
export * from '@/types/translation';

export const useConversationsStore = create<
  ConversationSlice & RewriteSlice & TranslationSlice
>()((...a) => ({
  ...createConversationSlice(...a),
  ...createRewriteSlice(...a),
  ...createTranslationSlice(...a),
}));
