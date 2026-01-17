import { StateCreator } from 'zustand';
import { ContractReviewConfig } from '@/types/contract-review';

export interface ContractReviewSlice {
  contractReviewConfig: ContractReviewConfig;
  contractReviewMode: 'assistant' | 'direct' | 'select_mode' | null;

  setContractReviewConfig: (config: Partial<ContractReviewConfig>) => void;
  updateContractReviewConfig: (config: Partial<ContractReviewConfig>) => void;
  resetContractReviewConfig: () => void;
  setContractReviewMode: (
    mode: 'assistant' | 'direct' | 'select_mode' | null,
  ) => void;
}

const DEFAULT_CONTRACT_REVIEW_CONFIG: ContractReviewConfig = {
  reviewType: 'general_review',
  reviewDepth: 'standard',
  contractType: 'general',
  aspects: [],
  outputFormat: 'markdown',
  additionalInstructions: '',
};

export const createContractReviewSlice: StateCreator<
  ContractReviewSlice,
  [],
  [],
  ContractReviewSlice
> = set => ({
  contractReviewConfig: DEFAULT_CONTRACT_REVIEW_CONFIG,
  contractReviewMode: 'assistant',

  setContractReviewConfig: config =>
    set(state => ({
      contractReviewConfig: { ...state.contractReviewConfig, ...config },
    })),

  updateContractReviewConfig: config =>
    set(state => ({
      contractReviewConfig: { ...state.contractReviewConfig, ...config },
    })),

  resetContractReviewConfig: () =>
    set({
      contractReviewConfig: DEFAULT_CONTRACT_REVIEW_CONFIG,
    }),

  setContractReviewMode: mode => set({ contractReviewMode: mode }),
});
