import {
  deleteConversation,
  loadConversationListAction,
  loadSingleConversation,
} from '@/actions/conversations';
import { create } from 'zustand';

// Conversation list type (sidebar)
export type Conversation = {
  _id: string;
  conversationId: string;
  userId: string;
  title: string;
  status: 'active' | 'inactive';
  metadata: {
    model: string;
    category: string;
    userType: string;
    tags: string[];
    isGuest: boolean;
  };
  messageCount: number;
  isPublic: boolean;
  is_deep_search: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
};

export enum ROLES {
  USER = 'user',
  ASSISTANT = 'assistant',
}

// Messages inside an active conversation
export type ConversationMessage = {
  role: ROLES;
  content: string;
  timestamp: string; // ISO string
  metadata?: {
    type: string;
    timestamp: string;
    model?: string;
  };
};

// Full active conversation
export type ActiveConversation = {
  _id?: string;
  conversationId?: string;
  userId?: string;
  title?: string;
  messages: ConversationMessage[];
  createdAt?: string;
  updatedAt?: string;
};

interface ConversationStore {
  conversationList: Conversation[];
  activeConversation: ActiveConversation | null;
  isLoadingConversationList: boolean;
  isLoadingActiveConversation: boolean;
  isLoadingResponse: boolean;
  error: string | null;

  setConversationList: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: ActiveConversation | null) => void;
  updateActiveConversation: (
    message: string,
    role: ROLES,
    conversationId?: string,
  ) => void;
  setLoadingConversationList: (loading: boolean) => void;
  setLoadingActiveConversation: (loading: boolean) => void;
  setLoadingResponse: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useConversationsStore = create<ConversationStore>()(set => ({
  conversationList: [],
  activeConversation: null,
  isLoadingConversationList: false,
  isLoadingActiveConversation: false,
  isLoadingResponse: false,
  error: null,

  setConversationList: conversations =>
    set({ conversationList: conversations, error: null }),
  setActiveConversation: conversation =>
    set({ activeConversation: conversation }),
  updateActiveConversation: (message, role, conversationId) =>
    set(state => {
      if (!state.activeConversation?.conversationId)
        return {
          ...state,
          activeConversation: {
            ...(conversationId && { conversationId }),
            messages: [
              {
                role: role,
                content: message,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        };

      const timestamp = new Date().toISOString();

      const newMessages = [
        ...(state.activeConversation?.messages || []),
        {
          role: role,
          content: message,
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
  setLoadingConversationList: isLoadingList =>
    set({ isLoadingConversationList: isLoadingList }),
  setLoadingActiveConversation: isLoadingActiveConversation =>
    set({ isLoadingActiveConversation }),
  setLoadingResponse: isLoadingResponse =>
    set({ isLoadingResponse: isLoadingResponse }),

  setError: error => set({ error }),
}));

// ===== Helpers (outside store) =====

export const conversationHelpers = {
  // Load sidebar conversations
  loadConversationList: async (accessToken: string) => {
    const store = useConversationsStore.getState();

    store.setLoadingConversationList(true);

    try {
      const response = await loadConversationListAction(accessToken);

      if (response.success) {
        store.setConversationList(response.data.conversations);
      } else {
        store.setError(response.message);
      }
    } catch (err) {
      store.setError('Failed to load conversations');
      console.error(err);
    } finally {
      store.setLoadingConversationList(false);
    }
  },

  loadActiveConversation: async (
    conversationId: string,
    accessToken: string,
  ) => {
    const store = useConversationsStore.getState();

    store.setLoadingActiveConversation(true);

    try {
      const response = await loadSingleConversation(
        conversationId,
        accessToken,
      );

      if (response.success) {
        store.setActiveConversation(response.data);
      } else {
        store.setError(response.message);
      }
    } catch (err) {
      store.setError('Failed to load conversation');
      console.error(err);
    } finally {
      store.setLoadingActiveConversation(false);
    }
  },
  deleteConversation: async (accessToken: string, conversationId: string) => {
    const store = useConversationsStore.getState();
    store.setConversationList(
      store.conversationList.filter(c => c.conversationId !== conversationId),
    );
    try {
      const response = await deleteConversation(accessToken, conversationId);
      console.log({ response });
      if (!response.ok) {
        const response = await loadConversationListAction(accessToken);

        if (response.success) {
          store.setConversationList(response.data.conversations);
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
