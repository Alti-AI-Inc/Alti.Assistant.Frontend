'use client';
import { useModalStore } from '@/stores/useModalStore';
import { useEffect } from 'react';
import { AddChatbotModal } from './AddChatbotModal';
import CreateKnowledgeBankFolderModal from './CreateKnowledgeBankFolderModal';
import CreateKnowledgeBaseModal from './CreateKnowledgeBaseModal';
import { DeleteChatbotModal } from './DeleteChatBotModal';
import { DeleteConversation } from './DeleteConversation';
import { DeleteKnowledgeBaseFileModal } from './DeleteKbFileModal';
import { DeleteKnowledgeBaseModal } from './DeleteKbModal';
import { DeleteKnowledgeBankFileModal } from './DeleteKnowledgeBankFileModal';
import { DeleteKnowledgeBankFolderModal } from './DeleteKnowledgeBankFolderModal';
import { EditChatbotModal } from './EditChatbotModal';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { InviteFriends } from './InviteFriends';
import { Logout } from './logout';
import RenameChat from './RenameChat';
import SearchChats from './SearchChats';
import SearchWorkflows from './SearchWorkflows';
import { ShareConversationModal } from './ShareConversationModal';
import { InviteMemberModal } from './InviteMemberModal';
import { CreateOrganizationModal } from './CreateOrganizationModal';

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
      {type === 'invite' && <InviteFriends />}
      {type === 'search-chats' && <SearchChats />}
      {type === 'rename-chat' && <RenameChat />}
      {type === 'forgot-password' && <ForgotPasswordDialog />}
      {type === 'search-workflows' && <SearchWorkflows />}
      {type === 'delete-conversation' && <DeleteConversation />}
      {type === 'add-chatbot' && <AddChatbotModal />}
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
      {
        type === 'delete-knowledge-bank-folder' && (
          <DeleteKnowledgeBankFolderModal />
        )
      }
      {type === 'delete-knowledge-base' && <DeleteKnowledgeBaseModal />}
      {type === 'invite-member' && <InviteMemberModal />}
      {type === 'create-organization' && <CreateOrganizationModal />}
    </>
  );
};
