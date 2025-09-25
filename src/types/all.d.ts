type ModalType =
  | 'logout'
  | 'change-password'
  | 'search-chats'
  | 'rename-chat'
  | 'forgot-password'
  | 'search-workflows'
  | 'delete-conversation'
  | null;

enum APP_STATUS {
  ACTIVE = 'ACTIVE',
  PENDING = 'pending',
}
