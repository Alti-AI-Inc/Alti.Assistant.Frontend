import { StateCreator } from 'zustand';
import { TranslationConfig, TranslationMode } from '@/types/translation';

export interface TranslationSlice {
  translationConfig: TranslationConfig;
  translationMode: TranslationMode;

  setTranslationConfig: (config: Partial<TranslationConfig>) => void;
  updateTranslationConfig: (config: Partial<TranslationConfig>) => void;
  resetTranslationConfig: () => void;
  setTranslationMode: (mode: TranslationMode) => void;
}

// Default to Auto Detect -> English? Or maybe just empty?
// Let's defaulted to auto source and maybe English target or empty.
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
> = set => ({
  translationConfig: DEFAULT_TRANSLATION_CONFIG,
  translationMode: 'select_mode', // Default to selection

  setTranslationConfig: config =>
    set(state => ({
      translationConfig: { ...state.translationConfig, ...config },
    })),

  updateTranslationConfig: config =>
    set(state => ({
      translationConfig: { ...state.translationConfig, ...config },
    })),

  resetTranslationConfig: () =>
    set({
      translationConfig: DEFAULT_TRANSLATION_CONFIG,
      translationMode: null,
    }),

  setTranslationMode: mode => set({ translationMode: mode }),
});
