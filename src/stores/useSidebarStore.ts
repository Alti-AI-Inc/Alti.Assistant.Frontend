import { create } from 'zustand';

interface SidebarStore {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;

  setRightSidebarOpen: (isOpen: boolean) => void;
  setLeftSidebarOpen: (isOpen: boolean) => void;
  toggleRightSidebar: () => void;
  toggleLeftSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>(set => ({
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,

  setRightSidebarOpen: (isOpen: boolean) =>
    set({
      isRightSidebarOpen: isOpen,
    }),

  setLeftSidebarOpen: isOpen =>
    set({
      isLeftSidebarOpen: isOpen,
    }),

  toggleRightSidebar: () =>
    set(state => ({
      isRightSidebarOpen: !state.isRightSidebarOpen,
    })),

  toggleLeftSidebar: () =>
    set(state => ({
      isLeftSidebarOpen: !state.isLeftSidebarOpen,
    })),
}));
