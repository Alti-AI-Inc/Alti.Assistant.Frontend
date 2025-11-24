import { create } from 'zustand';

export enum ROLES {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum OPTIONS {
  RESEARCH = 'deep-research',
  CODE = 'code-generation',
  TEXT = 'text-generation',
  IMAGE = 'image-generation',
  TASK = 'task-automation',
  Transcribe = 'transcribe-audio',
  Presentation = 'presentation-generation',
  COMPUTER_USE = 'computer-use',
  REVIEW_DOCUMENTS = 'review-documents',
  SUMMARIZE = 'summarize-documents',
  EXTRACT_DATA = 'extract-data',
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
    video?: {
      name: string;
    };
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
      videoName?: string;
      reference?: Reference[];
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
      if (
        !state.activeConversation?.conversationId &&
        !state.activeConversation?.knowledgebaseId
      ) {
        // brand new conversation
        return {
          ...state,
          activeConversation: {
            ...(conversationId && { conversationId }),
            messages: [
              {
                role,
                content: message,
                // ...(images && { metadata: { images } }),
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
          ...(extras?.videoName && {
            metadata: { video: { name: extras.videoName } },
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
