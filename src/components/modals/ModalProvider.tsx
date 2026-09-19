'use client';
import { useModalStore } from '@/stores/useModalStore';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { AddChatbotModal } from './AddChatbotModal';
import { AddModelModal } from './AddModelModal';
import { AuthModal } from './AuthModal';
import CreateKnowledgeBankFolderModal from './CreateKnowledgeBankFolderModal';
import CreateKnowledgeBaseModal from './CreateKnowledgeBaseModal';
import { CreateOrganizationModal } from './CreateOrganizationModal';
import { DeleteChatbotModal } from './DeleteChatBotModal';
import { DeleteConversation } from './DeleteConversation';
import { DeleteKnowledgeBaseFileModal } from './DeleteKbFileModal';
import { DeleteKnowledgeBaseModal } from './DeleteKbModal';
import { DeleteKnowledgeBankFileModal } from './DeleteKnowledgeBankFileModal';
import { DeleteKnowledgeBankFolderModal } from './DeleteKnowledgeBankFolderModal';
import { EditChatbotModal } from './EditChatbotModal';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { InviteMemberModal } from './InviteMemberModal';
import { Logout } from './logout';
import RenameChat from './RenameChat';
import SearchChats from './SearchChats';
import SearchWorkflows from './SearchWorkflows';
import { ShareConversationModal } from './ShareConversationModal';

function AuthQueryWatcher() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { onOpen } = useModalStore();

  useEffect(() => {
    const auth = searchParams?.get('auth');
    if (auth === 'login' || auth === 'register') {
      onOpen({ type: 'auth-modal', actionId: auth });
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', pathname);
      }
    }
  }, [searchParams, pathname, onOpen]);

  return null;
}

export const ModalProvider = () => {
  const pathname = usePathname();
  const { type, isOpen, onClose } = useModalStore();

  useEffect(() => {
    // Close modal and restore body settings when route changes
    onClose();
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
  }, [pathname, onClose]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
  }, [isOpen]);

  return (
    <>
      <Suspense fallback={null}>
        <AuthQueryWatcher />
      </Suspense>
      {type === 'logout' && <Logout />}
      {type === 'search-chats' && <SearchChats />}
      {type === 'rename-chat' && <RenameChat />}
      {type === 'forgot-password' && <ForgotPasswordDialog />}
      {type === 'search-workflows' && <SearchWorkflows />}
      {type === 'delete-conversation' && <DeleteConversation />}
      {type === 'add-chatbot' && <AddChatbotModal />}
      {type === 'add-model' && <AddModelModal />}
      {type === 'edit-chatbot' && <EditChatbotModal />}
      {type === 'delete-chatbot' && <DeleteChatbotModal />}
      {type === 'share-conversation' && <ShareConversationModal />}
      {type === 'create-knowledge-base' && <CreateKnowledgeBaseModal />}
      {type === 'delete-knowledge-base-file' && (
        <DeleteKnowledgeBaseFileModal />
      )}
      {type === 'delete-knowledge-bank-file' && (
        <DeleteKnowledgeBankFileModal />
      )}
      {type === 'create-knowledge-bank-folder' && (
        <CreateKnowledgeBankFolderModal />
      )}
      {type === 'delete-knowledge-bank-folder' && (
        <DeleteKnowledgeBankFolderModal />
      )}
      {type === 'delete-knowledge-base' && <DeleteKnowledgeBaseModal />}
      {type === 'invite-member' && <InviteMemberModal />}
      {type === 'create-organization' && <CreateOrganizationModal />}
      {type === 'auth-modal' && <AuthModal />}
    </>
  );
};
