import { create } from 'zustand';

export type ModalType =
  | 'logout'
  | 'change-password'
  | 'search-chats'
  | 'rename-chat'
  | null;

interface ModalStore {
  isOpen: boolean;
  type: ModalType;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;

  // Actions
  onOpen: (modal: {
    type: ModalType;
    title?: string;
    message?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  type: null,
  message: undefined,
  title: undefined,
  onCancel: undefined,
  onConfirm: undefined,

  onOpen: modal =>
    set({
      isOpen: true,
      ...modal,
    }),

  onClose: () =>
    set({
      isOpen: false,
      type: null,
      title: undefined,
      message: undefined,
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
