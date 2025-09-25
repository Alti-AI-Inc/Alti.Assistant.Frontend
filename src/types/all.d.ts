type ModalType =
  | 'logout'
  | 'change-password'
  | 'search-chats'
  | 'rename-chat'
  | 'forgot-password'
  | 'search-workflows'
  | 'delete-conversation'
  | 'add-chatbot'
  | 'delete-chatbot'
  | 'edit-chatbot'

  | null;

enum APP_STATUS {
  ACTIVE = 'ACTIVE',
  PENDING = 'pending',
}
