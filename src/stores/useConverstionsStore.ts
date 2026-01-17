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
import {
  BrainstormSlice,
  createBrainstormSlice,
} from './slices/createBrainstormSlice';
import {
  createPlanGenerationSlice,
  PlanGenerationSlice,
} from './slices/createPlanGenerationSlice';

// Re-export types for backward compatibility
export * from '@/types/conversation';
export * from '@/types/translation';
export * from '@/types/brainstorm';
export * from '@/types/plan-generation';

export const useConversationsStore = create<
  ConversationSlice &
    RewriteSlice &
    TranslationSlice &
    BrainstormSlice &
    PlanGenerationSlice
>()((...a) => ({
  ...createConversationSlice(...a),
  ...createRewriteSlice(...a),
  ...createTranslationSlice(...a),
  ...createBrainstormSlice(...a),
  ...createPlanGenerationSlice(...a),
}));
