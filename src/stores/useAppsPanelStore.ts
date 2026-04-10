import { create } from 'zustand';

interface PanelState {
  isVisible: boolean;
  width: number; // in pixels
}

interface AppsPanelStore {
  panels: {
    panel1: PanelState;
    panel2: PanelState;
  };

  // Panel visibility
  togglePanel: (panelId: 'panel1' | 'panel2') => void;
  setPanelVisibility: (
    panelId: 'panel1' | 'panel2',
    isVisible: boolean,
  ) => void;

  // Panel width resize
  setPanelWidth: (panelId: 'panel1' | 'panel2', width: number) => void;
  resetPanelWidth: (panelId: 'panel1' | 'panel2') => void;

  // Bulk operations
  showAllPanels: () => void;
  hideAllPanels: () => void;
  resetAllPanels: () => void;
}

const DEFAULT_PANEL_WIDTH = 280; // Bigger width for better app display

export const useAppsPanelStore = create<AppsPanelStore>(set => ({
  panels: {
    panel1: {
      isVisible: true,
      width: DEFAULT_PANEL_WIDTH,
    },
    panel2: {
      isVisible: true,
      width: DEFAULT_PANEL_WIDTH,
    },
  },

  togglePanel: (panelId: 'panel1' | 'panel2') =>
    set(state => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          isVisible: !state.panels[panelId].isVisible,
        },
      },
    })),

  setPanelVisibility: (panelId: 'panel1' | 'panel2', isVisible: boolean) =>
    set(state => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          isVisible,
        },
      },
    })),

  setPanelWidth: (panelId: 'panel1' | 'panel2', width: number) =>
    set(state => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          width: Math.max(250, Math.min(width, 600)), // min 250px, max 600px
        },
      },
    })),

  resetPanelWidth: (panelId: 'panel1' | 'panel2') =>
    set(state => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          width: DEFAULT_PANEL_WIDTH,
        },
      },
    })),

  showAllPanels: () =>
    set(state => ({
      panels: {
        panel1: { ...state.panels.panel1, isVisible: true },
        panel2: { ...state.panels.panel2, isVisible: true },
      },
    })),

  hideAllPanels: () =>
    set(state => ({
      panels: {
        panel1: { ...state.panels.panel1, isVisible: false },
        panel2: { ...state.panels.panel2, isVisible: false },
      },
    })),

  resetAllPanels: () =>
    set({
      panels: {
        panel1: {
          isVisible: true,
          width: DEFAULT_PANEL_WIDTH,
        },
        panel2: {
          isVisible: true,
          width: DEFAULT_PANEL_WIDTH,
        },
      },
    }),
}));
