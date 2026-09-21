import { StateCreator } from 'zustand';
import { RewriteIntent, RewriteMode as RewriteModeType, RewriteStyle } from '@/types/rewrite';
import { createAsyncActionSlice, FeatureSlice } from './createAsyncActionSlice';

export interface RewriteConfig {
  intent: RewriteIntent;
  style: RewriteStyle;
  mode: RewriteModeType;
  outputFormat: 'text' | 'file' | 'both';
  targetAudience?: string;
  additionalInstructions?: string;
  textContent?: string;
}

export type RewriteMode = 'assistant' | 'direct' | 'select_mode' | 'chat' | null;

export type RewriteSlice = FeatureSlice<'rewrite', RewriteConfig, RewriteMode>;

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
> = createAsyncActionSlice<'rewrite', RewriteConfig, RewriteMode>('rewrite', DEFAULT_REWRITE_CONFIG, 'assistant', null);
