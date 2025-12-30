export type TranslationMode =
  | 'assistant'
  | 'direct'
  | 'detect'
  | 'select_mode'
  | 'chat'
  | null;

export interface TranslationConfig {
  sourceLanguage: string;
  targetLanguage: string;
  isDetectMode?: boolean; // Internal flag for UI to switch between Translate/Detect in Direct mode
}

export type SupportedLanguage = {
  code: string;
  name: string;
};

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'el', name: 'Greek' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'fil', name: 'Filipino' },
  { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Persian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'sw', name: 'Swahili' },
];

export interface DirectTranslateRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface DetectLanguageRequest {
  text: string;
}

export interface AssistantTranslateRequest {
  message: string;
  conversationId?: string;
  file?: File;
}

export interface TranslationResponseData {
  success: boolean;
  originalText?: string;
  translatedText?: string;
  sourceLanguage?: string;
  sourceLanguageName?: string;
  targetLanguage?: string;
  targetLanguageName?: string;
  characterCount?: number;
  method?: string;
  // For detection
  languageCode?: string;
  languageName?: string;
  confidence?: number;
  isSupported?: boolean;
}
