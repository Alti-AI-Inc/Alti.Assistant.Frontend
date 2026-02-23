type ModalType =
  | 'logout'
  | 'invite'
  | 'change-password'
  | 'search-chats'
  | 'rename-chat'
  | 'forgot-password'
  | 'search-workflows'
  | 'delete-conversation'
  | 'add-chatbot'
  | 'delete-chatbot'
  | 'edit-chatbot'
  | 'share-conversation'
  | 'create-knowledge-base'
  | 'delete-knowledge-base-file'
  | 'delete-knowledge-base'
  | 'create-knowledge-bank-folder'
  | 'delete-knowledge-bank-folder'
  | 'delete-knowledge-bank-file'
  | 'invite-member'
  | 'create-organization'
  | null;

enum APP_STATUS {
  ACTIVE = 'ACTIVE',
  PENDING = 'pending',
}

// CSS module declarations
declare module '*.css';
