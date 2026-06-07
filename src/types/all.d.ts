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
  | 'add-model'
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
  | 'auth-modal'
  | 'memory'
  | 'platform-instructions'
  | 'platform-guardrails'
  | null;

enum APP_STATUS {
  ACTIVE = 'ACTIVE',
  PENDING = 'pending',
}

// CSS module declarations
declare module '*.css';
