import { StateCreator } from 'zustand';
import { BrainstormConfig } from '@/types/brainstorm';

export interface BrainstormSlice {
  brainstormConfig: BrainstormConfig;
  brainstormMode: 'assistant' | 'structured' | 'select_mode' | null;

  setBrainstormConfig: (config: Partial<BrainstormConfig>) => void;
  updateBrainstormConfig: (config: Partial<BrainstormConfig>) => void;
  resetBrainstormConfig: () => void;
  setBrainstormMode: (
    mode: 'assistant' | 'structured' | 'select_mode' | null,
  ) => void;
}

const DEFAULT_BRAINSTORM_CONFIG: BrainstormConfig = {};

export const createBrainstormSlice: StateCreator<
  BrainstormSlice,
  [],
  [],
  BrainstormSlice
> = set => ({
  brainstormConfig: DEFAULT_BRAINSTORM_CONFIG,
  brainstormMode: 'assistant',

  setBrainstormConfig: config =>
    set(state => ({
      brainstormConfig: { ...state.brainstormConfig, ...config },
    })),

  updateBrainstormConfig: config =>
    set(state => ({
      brainstormConfig: { ...state.brainstormConfig, ...config },
    })),

  resetBrainstormConfig: () =>
    set({
      brainstormConfig: DEFAULT_BRAINSTORM_CONFIG,
      // brainstormMode: null,
    }),

  setBrainstormMode: mode => set({ brainstormMode: mode }),
});
