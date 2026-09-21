import { StateCreator } from 'zustand';
import { TranslationConfig, TranslationMode } from '@/types/translation';
import { createAsyncActionSlice, FeatureSlice } from './createAsyncActionSlice';

export type TranslationSlice = FeatureSlice<'translation', TranslationConfig, TranslationMode | null>;

const DEFAULT_TRANSLATION_CONFIG: TranslationConfig = {
  sourceLanguage: 'auto',
  targetLanguage: '',
  isDetectMode: false,
};

export const createTranslationSlice: StateCreator<
  TranslationSlice,
  [],
  [],
  TranslationSlice
> = createAsyncActionSlice<'translation', TranslationConfig, TranslationMode | null>('translation', DEFAULT_TRANSLATION_CONFIG, 'select_mode', null);
