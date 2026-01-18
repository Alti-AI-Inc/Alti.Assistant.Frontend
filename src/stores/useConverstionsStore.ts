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
import {
  createContractReviewSlice,
  ContractReviewSlice,
} from './slices/createContractReviewSlice';

// Re-export types for backward compatibility
export * from '@/types/conversation';
export * from '@/types/translation';
export * from '@/types/brainstorm';
export * from '@/types/plan-generation';
export * from '@/types/contract-review';

export const useConversationsStore = create<
  ConversationSlice &
    RewriteSlice &
    TranslationSlice &
    BrainstormSlice &
    PlanGenerationSlice &
    ContractReviewSlice
>()((...a) => ({
  ...createConversationSlice(...a),
  ...createRewriteSlice(...a),
  ...createTranslationSlice(...a),
  ...createBrainstormSlice(...a),
  ...createPlanGenerationSlice(...a),
  ...createContractReviewSlice(...a),
}));

export { OPTIONS, ROLES } from '@/types/conversation';
