import { create } from 'zustand';

interface SidebarStore {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  // Multi-sidebar states for Spaces page (left side)
  isLeftSidebar2Open: boolean;
  isLeftSidebar3Open: boolean;
  // Right sidebar variant for Activity & Alerts
  isRightSidebar2Open: boolean;
  // Settings sidebar state
  isSettingsSidebarOpen: boolean;
  // Global Inbox panel state
  isGlobalInboxOpen: boolean;

  setRightSidebarOpen: (isOpen: boolean) => void;
  setLeftSidebarOpen: (isOpen: boolean) => void;
  toggleRightSidebar: () => void;
  toggleLeftSidebar: () => void;
  // Multi-sidebar methods for left sidebars
  setLeftSidebar2Open: (isOpen: boolean) => void;
  setLeftSidebar3Open: (isOpen: boolean) => void;
  toggleLeftSidebar2: () => void;
  toggleLeftSidebar3: () => void;
  // Right sidebar variant methods
  setRightSidebar2Open: (isOpen: boolean) => void;
  toggleRightSidebar2: () => void;
  // Settings sidebar methods
  setSettingsSidebarOpen: (isOpen: boolean) => void;
  toggleSettingsSidebar: () => void;
  // Global Inbox methods
  setGlobalInboxOpen: (isOpen: boolean) => void;
  toggleGlobalInbox: () => void;
}

export const useSidebarStore = create<SidebarStore>(set => ({
  isLeftSidebarOpen: true,
  isRightSidebarOpen: true,
  isLeftSidebar2Open: true,
  isLeftSidebar3Open: true,
  isRightSidebar2Open: true,
  isSettingsSidebarOpen: true,
  isGlobalInboxOpen: false,

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

  setRightSidebar2Open: (isOpen: boolean) =>
    set({
      isRightSidebar2Open: isOpen,
    }),

  toggleRightSidebar2: () =>
    set(state => ({
      isRightSidebar2Open: !state.isRightSidebar2Open,
    })),

  setSettingsSidebarOpen: (isOpen: boolean) =>
    set({
      isSettingsSidebarOpen: isOpen,
    }),

  toggleSettingsSidebar: () =>
    set(state => ({
      isSettingsSidebarOpen: !state.isSettingsSidebarOpen,
    })),

  setGlobalInboxOpen: (isOpen: boolean) =>
    set({
      isGlobalInboxOpen: isOpen,
    }),

  toggleGlobalInbox: () =>
    set(state => ({
      isGlobalInboxOpen: !state.isGlobalInboxOpen,
    })),
}));
