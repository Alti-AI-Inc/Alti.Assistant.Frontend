'use client';
import { useModalStore } from '@/stores/useModalStore';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { Logout } from './logout';
import RenameChat from './RenameChat';
import SearchChats from './SearchChats';
import SearchWorkflows from './SearchWorkflows';

export const ModalProvider = () => {
  const { type, isOpen } = useModalStore();

  if (!type || !isOpen) return null;

  return (
    <>
      {type === 'logout' && <Logout />}
      {type === 'search-chats' && <SearchChats />}
      {type === 'rename-chat' && <RenameChat />}
      {type === 'forgot-password' && <ForgotPasswordDialog />}
      {type === 'search-workflows' && <SearchWorkflows />}
    </>
  );
};
