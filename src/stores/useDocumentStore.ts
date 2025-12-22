import { create } from 'zustand';
import {
  DocumentLength,
  DocumentTone,
  DocumentType,
  OutputFormat,
  TemplateType,
} from '@/types/document-generation';

export type DraftMode = 'select_mode' | 'assistant' | 'direct' | null;

interface DraftDocumentState {
  isActive: boolean;
  mode: DraftMode;
  config: {
    docType: DocumentType;
    tone: DocumentTone;
    length: DocumentLength;
    format: OutputFormat;
    template?: TemplateType;
  };
}

interface DocumentStore {
  drafting: DraftDocumentState;

  // Actions
  setDraftingMode: (mode: DraftMode) => void;
  updateDraftingConfig: (
    updates: Partial<DraftDocumentState['config']>,
  ) => void;
  resetDrafting: () => void;
  startDrafting: () => void;
}

const DEFAULT_CONFIG = {
  docType: DocumentType.PROPOSAL,
  tone: 'professional' as DocumentTone,
  length: 'medium' as DocumentLength,
  format: 'pdf' as OutputFormat,
};

export const useDocumentStore = create<DocumentStore>(set => ({
  drafting: {
    isActive: false,
    mode: null,
    config: DEFAULT_CONFIG,
  },

  setDraftingMode: mode =>
    set(state => ({
      drafting: { ...state.drafting, mode },
    })),

  updateDraftingConfig: updates =>
    set(state => ({
      drafting: {
        ...state.drafting,
        config: { ...state.drafting.config, ...updates },
      },
    })),

  startDrafting: () =>
    set(state => ({
      drafting: {
        ...state.drafting,
        isActive: true,
        mode: 'select_mode',
      },
    })),

  resetDrafting: () =>
    set(state => ({
      drafting: {
        isActive: false,
        mode: null,
        config: DEFAULT_CONFIG,
      },
    })),
}));
