import { create } from 'zustand';

export type ImageWorkflow =
  | 'idle'
  | 'analyzing'
  | 'evaluating'
  | 'collecting'
  | 'confirming'
  | 'finalizing'
  | 'generating'
  | 'editing'
  | 'complete'
  | 'error';

export type ImageIntent = 'generate' | 'edit' | null;

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3';

export interface GeneratedImageData {
  url: string;
  filename: string;
  service: string;
  reasoning?: string;
}

interface ImageGenStore {
  // Workflow state
  workflow: ImageWorkflow;
  intent: ImageIntent;
  isEditable: boolean;

  // Prompt evaluation state
  promptScore: number;
  suggestions: string[];
  missingElements: string[];
  isComplete: boolean;

  // Conversation tracking
  conversationId: string | null;
  userId: string | null;
  conversationHistory: string[];
  messageCount: number;

  // Final output
  enhancedPrompt: string | null;
  generatedImage: GeneratedImageData | null;

  // Configuration
  aspectRatio: AspectRatio;
  negativePrompt: string;

  // Edit mode - Full data URL (e.g., 'data:image/jpeg;base64,/9j/4AAQ...')
  imageBase64: string | null;

  // Error handling
  error: string | null;

  // Actions
  setWorkflow: (workflow: ImageWorkflow) => void;
  setIntent: (intent: ImageIntent) => void;
  setIsEditable: (isEditable: boolean) => void;
  setPromptScore: (score: number) => void;
  setSuggestions: (suggestions: string[]) => void;
  setMissingElements: (elements: string[]) => void;
  setIsComplete: (isComplete: boolean) => void;
  setConversationId: (id: string | null) => void;
  setUserId: (id: string | null) => void;
  setConversationHistory: (history: string[]) => void;
  setMessageCount: (count: number) => void;
  setEnhancedPrompt: (prompt: string | null) => void;
  setGeneratedImage: (image: GeneratedImageData | null) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setNegativePrompt: (prompt: string) => void;
  setImageBase64: (base64: string | null) => void;
  setError: (error: string | null) => void;

  // Bulk update for evaluation response
  updateFromEvaluation: (evaluation: {
    isComplete: boolean;
    score: number;
    missingElements: string[];
    suggestions: string[];
  }) => void;

  // Workflow helpers
  startImageGeneration: () => void;
  startImageEditing: (imageBase64: string) => void;
  proceedToGenerate: () => void;
  prepareForAnalysis: () => void;
  reset: () => void;
}

const initialState = {
  workflow: 'idle' as ImageWorkflow,
  intent: null as ImageIntent,
  isEditable: false,
  promptScore: 0,
  suggestions: [],
  missingElements: [],
  isComplete: false,
  conversationId: null,
  userId: null,
  conversationHistory: [],
  messageCount: 0,
  enhancedPrompt: null,
  generatedImage: null,
  aspectRatio: '1:1' as AspectRatio,
  negativePrompt: '',
  imageBase64: null,
  error: null,
};

export const useImageGenStore = create<ImageGenStore>()(set => ({
  ...initialState,

  // Individual setters
  setWorkflow: workflow => set({ workflow }),
  setIntent: intent => set({ intent }),
  setIsEditable: isEditable => set({ isEditable }),
  setPromptScore: promptScore => set({ promptScore }),
  setSuggestions: suggestions => set({ suggestions }),
  setMissingElements: missingElements => set({ missingElements }),
  setIsComplete: isComplete => set({ isComplete }),
  setConversationId: conversationId => set({ conversationId }),
  setUserId: userId => set({ userId }),
  setConversationHistory: conversationHistory => set({ conversationHistory }),
  setMessageCount: messageCount => set({ messageCount }),
  setEnhancedPrompt: enhancedPrompt => set({ enhancedPrompt }),
  setGeneratedImage: generatedImage => set({ generatedImage }),
  setAspectRatio: aspectRatio => set({ aspectRatio }),
  setNegativePrompt: negativePrompt => set({ negativePrompt }),
  setImageBase64: imageBase64 => set({ imageBase64 }),
  setError: error => set({ error, workflow: error ? 'error' : 'idle' }),

  // Bulk update for evaluation - workflow is set by hook, not here
  updateFromEvaluation: evaluation =>
    set({
      promptScore: evaluation.score,
      suggestions: evaluation.suggestions,
      missingElements: evaluation.missingElements,
      isComplete: evaluation.isComplete,
    }),

  // Workflow helpers - preserve conversationId/userId, only reset workflow state
  startImageGeneration: () =>
    set(state => {
      // Only do full reset if switching from edit mode to generate mode
      if (state.intent === 'edit') {
        return {
          ...initialState,
          workflow: 'analyzing',
          intent: 'generate',
        };
      }
      // Otherwise just reset workflow-specific state, preserve conversation
      return {
        workflow: 'analyzing',
        intent: 'generate',
        isEditable: false,
        promptScore: 0,
        suggestions: [],
        missingElements: [],
        isComplete: false,
        enhancedPrompt: null,
        generatedImage: null,
        error: null,
        // Preserve: conversationId, userId, conversationHistory, messageCount, aspectRatio, negativePrompt
      };
    }),

  startImageEditing: imageBase64 =>
    set(state => {
      // Only do full reset if switching from generate mode to edit mode
      if (state.intent === 'generate') {
        return {
          ...initialState,
          workflow: 'analyzing',
          intent: 'edit',
          isEditable: true,
          imageBase64,
        };
      }
      // Otherwise just reset workflow-specific state, preserve conversation
      return {
        workflow: 'analyzing',
        intent: 'edit',
        isEditable: true,
        imageBase64,
        promptScore: 0,
        suggestions: [],
        missingElements: [],
        isComplete: false,
        enhancedPrompt: null,
        generatedImage: null,
        error: null,
        // Preserve: conversationId, userId, conversationHistory, messageCount, aspectRatio, negativePrompt
      };
    }),

  proceedToGenerate: () =>
    set({
      workflow: 'finalizing',
    }),

  prepareForAnalysis: () =>
    set({
      workflow: 'analyzing',
      promptScore: 0,
      suggestions: [],
      missingElements: [],
      isComplete: false,
      enhancedPrompt: null,
      generatedImage: null,
      error: null,
    }),

  reset: () => set(initialState),
}));
