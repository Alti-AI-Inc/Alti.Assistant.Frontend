'use client';
import { useModalStore } from '@/stores/useModalStore';
import { useEffect } from 'react';
import { DeleteConversation } from './DeleteConversation';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { Logout } from './logout';
import RenameChat from './RenameChat';
import SearchChats from './SearchChats';
import SearchWorkflows from './SearchWorkflows';

export const ModalProvider = () => {
  const { type, isOpen } = useModalStore();

  useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
  }, [isOpen]);

  if (!type || !isOpen) return null;

  return (
    <>
      {type === 'logout' && <Logout />}
      {type === 'search-chats' && <SearchChats />}
      {type === 'rename-chat' && <RenameChat />}
      {type === 'forgot-password' && <ForgotPasswordDialog />}
      {type === 'search-workflows' && <SearchWorkflows />}
      {type === 'delete-conversation' && <DeleteConversation />}
    </>
  );
};
