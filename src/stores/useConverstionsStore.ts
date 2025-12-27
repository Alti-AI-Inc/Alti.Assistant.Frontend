import { create } from 'zustand';
import {
  createConversationSlice,
  ConversationSlice,
} from './slices/createConversationSlice';
import { createRewriteSlice, RewriteSlice } from './slices/createRewriteSlice';

// Re-export types for backward compatibility
export * from '@/types/conversation';

export const useConversationsStore = create<ConversationSlice & RewriteSlice>()(
  (...a) => ({
    ...createConversationSlice(...a),
    ...createRewriteSlice(...a),
  }),
);
