import { create } from 'zustand';

export enum ROLES {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum OPTIONS {
  RESEARCH = 'deep-research',
  CODE = 'code-generation',
  // TEXT = 'text-generation',
  DRAFT_DOCUMENT = 'draft-document',
  IMAGE = 'image-generation',
  EDIT_IMAGE = 'edit-generation',
  TASK = 'task-automation',
  Transcribe = 'transcribe-audio',
  PRESENTATION = 'presentation-generation',
  REVIEW_DOCUMENTS = 'review-documents',
  SUMMARIZE = 'summarize-documents',
  EXTRACT_DATA = 'extract-data',
  TRANSLATE_DOCUMENTS = 'translate-documents',
  GENERATE_REPORT = 'generate-report',
  GENERATE_SPREADSHEET = 'generate-spreadsheet',
  GENERATE_CHART = 'generate-chart',
  GENERATE_MINDMAP = 'generate-mindmap',
  GENERATE_DIAGRAM = 'generate-diagram',
  GENERATE_TIMELINE = 'generate-timeline',
  GENERATE_FLAYER = 'generate-flayer',
  GENERATE_PLAN = 'generate-plan',
  DRAFT_EMAIL = 'draft-email',
  DEBUG_CODE = 'debug-code',
  REWRITE = 'rewrite',
  BRAINSTORM = 'brainstorm',
  ARTICLE = 'article',
  WRITE_CONTRACT = 'write-contract',
  REVIEW_CONTRACT = 'review-contract',

  // VIDEO = 'video-generation',
}

export interface Reference {
  title: string;
  url: string;
  source: string;
  snippet: string;
  relevanceScore: number;
  searchQuery: string;
}

export interface GeneratedDocument {
  content?: string;
  format?: string;
  file?: {
    filePath?: string;
    fileName: string;
    format: string;
    size?: number;
  };
  url: string;
  metadata?: {
    title?: string;
    documentType?: string;
    [key: string]: any;
  };
}

// Messages inside an active conversation
export type ConversationMessage = {
  role: ROLES;
  content: string;

  timestamp: string; // ISO string
  metadata?: {
    type?: string;
    timestamp?: string;
    model?: string;
    reference?: Reference[];
    images?: null | string;
    imageUrl?: string; // New property to align with backend
    video?: {
      name: string;
    };
    document?: GeneratedDocument;
  };
};

// Full active conversation
export type ActiveConversation = {
  _id?: string;
  conversationId?: string;
  userId?: string;
  title?: string;
  knowledgebaseId?: string;
  messages: ConversationMessage[];
  createdAt?: string;
  updatedAt?: string;
};

interface ConversationStore {
  userMessage: string;
  setUserMessage: (message: string) => void;
  showStartLastMessage: boolean;
  setShowStartLastMessage: (show: boolean) => void;
  activeConversation: ActiveConversation | null;
  isLoadingActiveConversation: boolean;
  isLoadingResponse: boolean;
  error: string | null;
  selectedOption: OPTIONS | null;
  setSelectedOption: (opt: OPTIONS | null) => void;

  setActiveConversation: (conversation: ActiveConversation | null) => void;
  updateActiveConversation: (
    message: string,
    role: ROLES,
    conversationId?: string,
    extras?: {
      images?: string;
      imageUrl?: string; // New property to align with backend
      videoName?: string;
      reference?: Reference[];
      document?: GeneratedDocument;
    },
  ) => void;
  setLoadingActiveConversation: (loading: boolean) => void;
  setLoadingResponse: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useConversationsStore = create<ConversationStore>()(set => ({
  activeConversation: null,
  showStartLastMessage: false,
  userMessage: '',
  setUserMessage(message) {
    set({ userMessage: message });
  },
  setShowStartLastMessage: show => set({ showStartLastMessage: show }),
  isLoadingActiveConversation: false,
  isLoadingResponse: false,
  error: null,
  selectedOption: null,
  setSelectedOption: opt => set({ selectedOption: opt }),

  setActiveConversation: conversation =>
    set({ activeConversation: conversation }),

  updateActiveConversation: (message, role, conversationId, extras) =>
    set(state => {
      if (!state.activeConversation) {
        // brand new conversation
        return {
          ...state,
          activeConversation: {
            ...(conversationId && { conversationId }),
            messages: [
              {
                role,
                content: message,
                ...(extras?.images && { metadata: { images: extras.images } }),
                ...(extras?.imageUrl && {
                  metadata: { imageUrl: extras.imageUrl },
                }),
                ...(extras?.videoName && {
                  metadata: { video: { name: extras.videoName } },
                }),
                ...(extras?.reference && {
                  metadata: { reference: extras.reference },
                }),
                ...(extras?.document && {
                  metadata: { document: extras.document },
                }),
                timestamp: new Date().toISOString(),
              },
            ],
          },
        };
      }

      const timestamp = new Date().toISOString();

      const newMessages = [
        ...(state.activeConversation?.messages || []),
        {
          role,
          content: message,
          ...(extras?.images && { metadata: { images: extras.images } }),
          ...(extras?.imageUrl && { metadata: { imageUrl: extras.imageUrl } }),
          ...(extras?.videoName && {
            metadata: { video: { name: extras.videoName } },
          }),
          ...(extras?.document && {
            metadata: { document: extras.document },
          }),
          ...(extras?.reference && {
            metadata: { reference: extras.reference },
          }),
          timestamp,
        },
      ];

      return {
        ...state,
        activeConversation: {
          ...state.activeConversation,
          ...(conversationId && { conversationId }), // Allow updating ID
          messages: newMessages,
          updatedAt: timestamp,
        },
      };
    }),

  setLoadingActiveConversation: isLoadingActiveConversation =>
    set({ isLoadingActiveConversation }),

  setLoadingResponse: isLoadingResponse => set({ isLoadingResponse }),

  setError: error => set({ error }),
}));
