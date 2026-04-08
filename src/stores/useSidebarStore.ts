import { create } from 'zustand';

interface SidebarStore {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  // Multi-sidebar states for Spaces page (left side)
  isLeftSidebar2Open: boolean;
  isLeftSidebar3Open: boolean;

  setRightSidebarOpen: (isOpen: boolean) => void;
  setLeftSidebarOpen: (isOpen: boolean) => void;
  toggleRightSidebar: () => void;
  toggleLeftSidebar: () => void;
  // Multi-sidebar methods for left sidebars
  setLeftSidebar2Open: (isOpen: boolean) => void;
  setLeftSidebar3Open: (isOpen: boolean) => void;
  toggleLeftSidebar2: () => void;
  toggleLeftSidebar3: () => void;
}

export const useSidebarStore = create<SidebarStore>(set => ({
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
  isLeftSidebar2Open: true,
  isLeftSidebar3Open: true,

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

  setLeftSidebar2Open: (isOpen: boolean) =>
    set({
      isLeftSidebar2Open: isOpen,
    }),

  setLeftSidebar3Open: (isOpen: boolean) =>
    set({
      isLeftSidebar3Open: isOpen,
    }),

  toggleLeftSidebar2: () =>
    set(state => ({
      isLeftSidebar2Open: !state.isLeftSidebar2Open,
    })),

  toggleLeftSidebar3: () =>
    set(state => ({
      isLeftSidebar3Open: !state.isLeftSidebar3Open,
    })),
}));
