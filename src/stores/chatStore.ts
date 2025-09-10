import { create } from 'zustand';

type ModalResponse = {
  prompt: string;
  reply: string;
};

interface ChatStore {
  userMessage: string;
  setUserMessage: (message: string) => void;
  // chatsList:
  modalResponses: ModalResponse[];
  onModalResponse: (response: { prompt: string; reply: string }) => void;
  resetChat: () => void;
}

export const useUserChatStore = create<ChatStore>(set => ({
  userMessage: '',
  modalResponses: [],
  setUserMessage: message =>
    set(() => ({
      userMessage: message,
    })),
  onModalResponse: response =>
    set(state => ({
      modalResponses: [...state.modalResponses, response],
    })),
  resetChat: () =>
    set(() => ({
      userMessage: '',
      modalResponses: [],
    })),
}));
