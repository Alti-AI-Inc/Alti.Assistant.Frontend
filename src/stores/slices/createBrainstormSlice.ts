import { StateCreator } from 'zustand';
import { BrainstormConfig } from '@/types/brainstorm';
import { createAsyncActionSlice, FeatureSlice } from './createAsyncActionSlice';

export type BrainstormMode = 'assistant' | 'structured' | 'select_mode' | null;

export type BrainstormSlice = FeatureSlice<'brainstorm', BrainstormConfig, BrainstormMode>;

const DEFAULT_BRAINSTORM_CONFIG: BrainstormConfig = {};

export const createBrainstormSlice: StateCreator<
  BrainstormSlice,
  [],
  [],
  BrainstormSlice
> = createAsyncActionSlice<'brainstorm', BrainstormConfig, BrainstormMode>('brainstorm', DEFAULT_BRAINSTORM_CONFIG, 'assistant');
