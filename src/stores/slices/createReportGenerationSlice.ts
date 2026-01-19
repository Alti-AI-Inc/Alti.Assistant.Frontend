import { StateCreator } from 'zustand';
import { ReportGenerationConfig } from '@/types/report-generation';

export interface ReportGenerationSlice {
  reportGenerationConfig: ReportGenerationConfig;
  reportGenerationMode: 'assistant' | 'direct' | 'select_mode' | null;

  setReportGenerationConfig: (config: Partial<ReportGenerationConfig>) => void;
  updateReportGenerationConfig: (
    config: Partial<ReportGenerationConfig>,
  ) => void;
  resetReportGenerationConfig: () => void;
  setReportGenerationMode: (
    mode: 'assistant' | 'direct' | 'select_mode' | null,
  ) => void;
}

const DEFAULT_REPORT_GENERATION_CONFIG: ReportGenerationConfig = {};

export const createReportGenerationSlice: StateCreator<
  ReportGenerationSlice,
  [],
  [],
  ReportGenerationSlice
> = set => ({
  reportGenerationConfig: DEFAULT_REPORT_GENERATION_CONFIG,
  reportGenerationMode: 'assistant',

  setReportGenerationConfig: config =>
    set(state => ({
      reportGenerationConfig: { ...state.reportGenerationConfig, ...config },
    })),

  updateReportGenerationConfig: config =>
    set(state => ({
      reportGenerationConfig: { ...state.reportGenerationConfig, ...config },
    })),

  resetReportGenerationConfig: () =>
    set({
      reportGenerationConfig: DEFAULT_REPORT_GENERATION_CONFIG,
    }),

  setReportGenerationMode: mode => set({ reportGenerationMode: mode }),
});
