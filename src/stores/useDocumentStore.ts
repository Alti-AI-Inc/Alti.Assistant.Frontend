import { create } from 'zustand';
import {
  DocumentLength,
  DocumentTone,
  DocumentType,
  OutputFormat,
  TemplateType,
  ReviewType,
  ReviewDepth,
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

interface ReviewDocumentState {
  isActive: boolean;
  mode: DraftMode; // Re-using DraftMode as it has same logic (assistant vs direct)
  config: {
    reviewType: ReviewType;
    reviewDepth: ReviewDepth;
    documentType: DocumentType | 'general';
    additionalInstructions?: string;
  };
}

interface DocumentStore {
  drafting: DraftDocumentState;
  review: ReviewDocumentState;

  // Actions
  setDraftingMode: (mode: DraftMode) => void;
  updateDraftingConfig: (
    updates: Partial<DraftDocumentState['config']>,
  ) => void;
  resetDrafting: () => void;
  startDrafting: () => void;

  // Review Actions
  setReviewMode: (mode: DraftMode) => void;
  updateReviewConfig: (updates: Partial<ReviewDocumentState['config']>) => void;
  resetReview: () => void;
  startReview: () => void;
}

const DEFAULT_CONFIG = {
  docType: DocumentType.PROPOSAL,
  tone: 'professional' as DocumentTone,
  length: 'medium' as DocumentLength,
  format: 'pdf' as OutputFormat,
};

const DEFAULT_REVIEW_CONFIG = {
  reviewType: 'general_review' as ReviewType,
  reviewDepth: 'standard' as ReviewDepth,
  documentType: 'general' as DocumentType | 'general',
};

export const useDocumentStore = create<DocumentStore>(set => ({
  drafting: {
    isActive: false,
    mode: null,
    config: DEFAULT_CONFIG,
  },
  review: {
    isActive: false,
    mode: null,
    config: DEFAULT_REVIEW_CONFIG,
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

  // Review Actions
  setReviewMode: mode =>
    set(state => ({
      review: { ...state.review, mode },
    })),

  updateReviewConfig: updates =>
    set(state => ({
      review: {
        ...state.review,
        config: { ...state.review.config, ...updates },
      },
    })),

  resetReview: () =>
    set(state => ({
      review: {
        isActive: false,
        mode: null,
        config: DEFAULT_REVIEW_CONFIG,
      },
    })),

  startReview: () =>
    set(state => ({
      review: {
        ...state.review,
        isActive: true,
        mode: 'select_mode',
      },
    })),
}));
