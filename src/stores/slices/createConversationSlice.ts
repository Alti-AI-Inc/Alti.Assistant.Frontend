import { StateCreator } from 'zustand';
import {
  ActiveConversation,
  OPTIONS,
  ROLES,
  Reference,
  GeneratedDocument,
} from '@/types/conversation';

export interface ConversationSlice {
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
      imageUrl?: string;
      videoName?: string;
      reference?: Reference[];
      document?: GeneratedDocument;
    },
  ) => void;
  setLoadingActiveConversation: (loading: boolean) => void;
  setLoadingResponse: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const createConversationSlice: StateCreator<
  ConversationSlice,
  [],
  [],
  ConversationSlice
> = set => ({
  activeConversation: null,
  showStartLastMessage: false,
  userMessage: '',
  isLoadingActiveConversation: false,
  isLoadingResponse: false,
  error: null,
  selectedOption: null,
  setUserMessage(message) {
    set({ userMessage: message });
  },
  setShowStartLastMessage: show => set({ showStartLastMessage: show }),

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
});
