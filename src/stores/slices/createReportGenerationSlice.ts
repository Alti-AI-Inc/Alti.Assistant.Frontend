import { StateCreator } from 'zustand';
import { ReportGenerationConfig } from '@/types/report-generation';
import { createAsyncActionSlice, FeatureSlice } from './createAsyncActionSlice';

export type ReportGenerationMode = 'assistant' | 'direct' | 'select_mode' | null;

export type ReportGenerationSlice = FeatureSlice<'reportGeneration', ReportGenerationConfig, ReportGenerationMode>;

const DEFAULT_REPORT_GENERATION_CONFIG: ReportGenerationConfig = {};

export const createReportGenerationSlice: StateCreator<
  ReportGenerationSlice,
  [],
  [],
  ReportGenerationSlice
> = createAsyncActionSlice<'reportGeneration', ReportGenerationConfig, ReportGenerationMode>('reportGeneration', DEFAULT_REPORT_GENERATION_CONFIG, 'assistant');
