import {
  loadConversationsAction,
  loadSingleConversation,
} from '@/actions/conversations';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// Messages inside an active conversation
export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string
  metadata: {
    type: string;
    timestamp: string;
    model?: string;
  };
};

// Full active conversation
export type ActiveConversation = {
  _id: string;
  conversationId: string;
  userId: string;
  title: string;
  messages: ConversationMessage[];
  createdAt?: string;
  updatedAt?: string;
};

interface ConversationStore {
  conversations: Conversation[];
  activeConversation: ActiveConversation | null;
  isLoadingList: boolean;
  isLoadingActiveConversation: boolean;
  error: string | null;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: ActiveConversation | null) => void;
  setLoadingList: (loading: boolean) => void;
  setLoadingActiveConversation: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useConversationsStore = create<ConversationStore>()(
  persist(
    set => ({
      conversations: [],
      activeConversation: null,
      isLoadingList: false,
      isLoadingActiveConversation: false,
      error: null,

      setConversations: conversations => set({ conversations, error: null }),
      setActiveConversation: conversation =>
        set({ activeConversation: conversation }),
      setLoadingList: isLoadingList => set({ isLoadingList }),
      setLoadingActiveConversation: isLoadingActiveConversation =>
        set({ isLoadingActiveConversation }),
      setError: error => set({ error }),
    }),
    {
      name: 'conversation-storage',
      partialize: state => ({
        conversations: state.conversations,
        activeConversation: state.activeConversation,
      }),
    },
  ),
);
// ===== Helpers (outside store) =====

export const conversationHelpers = {
  // Load sidebar conversations
  loadConversations: async (accessToken: string, force = false) => {
    const store = useConversationsStore.getState();

    if (!force && store.conversations.length > 0) {
      return;
    }

    store.setLoadingList(true);

    try {
      const response = await loadConversationsAction(accessToken);

      if (response.success) {
        store.setConversations(response.data.conversations);
      } else {
        store.setError(response.message);
      }
    } catch (err) {
      store.setError('Failed to load conversations');
      console.error(err);
    } finally {
      store.setLoadingList(false);
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

  reloadConversations: async (accessToken: string) => {
    return conversationHelpers.loadConversations(accessToken, true);
  },
};
