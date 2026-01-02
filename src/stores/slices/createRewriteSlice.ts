import { StateCreator } from 'zustand';
import { RewriteIntent, RewriteMode, RewriteStyle } from '@/types/rewrite';

export interface RewriteConfig {
  intent: RewriteIntent;
  style: RewriteStyle;
  mode: RewriteMode;
  outputFormat: 'text' | 'file' | 'both';
  targetAudience?: string;
  additionalInstructions?: string;
  textContent?: string;
}

export interface RewriteSlice {
  rewriteConfig: RewriteConfig;
  rewriteMode: 'assistant' | 'direct' | 'select_mode' | 'chat' | null;

  setRewriteConfig: (config: Partial<RewriteConfig>) => void;
  updateRewriteConfig: (config: Partial<RewriteConfig>) => void;
  resetRewriteConfig: () => void;
  setRewriteMode: (
    mode: 'assistant' | 'direct' | 'select_mode' | 'chat' | null,
  ) => void;
}

const DEFAULT_REWRITE_CONFIG: RewriteConfig = {
  intent: 'professional',
  style: 'formal',
  mode: 'preserve_meaning',
  outputFormat: 'text',
};

export const createRewriteSlice: StateCreator<
  RewriteSlice,
  [],
  [],
  RewriteSlice
> = set => ({
  rewriteConfig: DEFAULT_REWRITE_CONFIG,
  rewriteMode: 'assistant',

  setRewriteConfig: config =>
    set(state => ({
      rewriteConfig: { ...state.rewriteConfig, ...config },
    })),

  updateRewriteConfig: config =>
    set(state => ({
      rewriteConfig: { ...state.rewriteConfig, ...config },
    })),

  resetRewriteConfig: () =>
    set({
      rewriteConfig: DEFAULT_REWRITE_CONFIG,
      rewriteMode: null,
    }),

  setRewriteMode: mode => set({ rewriteMode: mode }),
});
