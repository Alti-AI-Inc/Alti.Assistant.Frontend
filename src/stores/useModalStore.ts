import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  type: ModalType;
  title?: string;
  actionId?: string;
  actionId2?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;

  // Actions
  onOpen: (modal: {
    type: ModalType;
    title?: string;
    actionId?: string;
    actionId2?: string;
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
      actionId: undefined,
      actionId2: undefined,
      title: undefined,
      message: undefined,
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
