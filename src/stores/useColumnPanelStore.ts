import { create } from 'zustand';

interface PanelState {
  isVisible: boolean;
  width: number; // in pixels
}

interface ColumnPanelStore {
  panels: {
    panel1: PanelState;
    panel2: PanelState;
    panel3: PanelState;
  };

  // Panel visibility
  togglePanel: (panelId: 'panel1' | 'panel2' | 'panel3') => void;
  setPanelVisibility: (
    panelId: 'panel1' | 'panel2' | 'panel3',
    isVisible: boolean,
  ) => void;

  // Panel width resize
  setPanelWidth: (
    panelId: 'panel1' | 'panel2' | 'panel3',
    width: number,
  ) => void;
  resetPanelWidth: (panelId: 'panel1' | 'panel2' | 'panel3') => void;

  // Bulk operations
  showAllPanels: () => void;
  hideAllPanels: () => void;
  resetAllPanels: () => void;
}

const DEFAULT_PANEL_WIDTH = 350; // 350px default width

export const useColumnPanelStore = create<ColumnPanelStore>(set => ({
  panels: {
    panel1: {
      isVisible: true,
      width: DEFAULT_PANEL_WIDTH,
    },
    panel2: {
      isVisible: true,
      width: DEFAULT_PANEL_WIDTH,
    },
    panel3: {
      isVisible: true,
      width: DEFAULT_PANEL_WIDTH,
    },
  },

  togglePanel: (panelId: 'panel1' | 'panel2' | 'panel3') =>
    set(state => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          isVisible: !state.panels[panelId].isVisible,
        },
      },
    })),

  setPanelVisibility: (
    panelId: 'panel1' | 'panel2' | 'panel3',
    isVisible: boolean,
  ) =>
    set(state => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          isVisible,
        },
      },
    })),

  setPanelWidth: (panelId: 'panel1' | 'panel2' | 'panel3', width: number) =>
    set(state => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          width: Math.max(250, Math.min(width, 600)), // min 250px, max 600px
        },
      },
    })),

  resetPanelWidth: (panelId: 'panel1' | 'panel2' | 'panel3') =>
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
        panel3: { ...state.panels.panel3, isVisible: true },
      },
    })),

  hideAllPanels: () =>
    set(state => ({
      panels: {
        panel1: { ...state.panels.panel1, isVisible: false },
        panel2: { ...state.panels.panel2, isVisible: false },
        panel3: { ...state.panels.panel3, isVisible: false },
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
        panel3: {
          isVisible: true,
          width: DEFAULT_PANEL_WIDTH,
        },
      },
    }),
}));
