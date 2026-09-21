import { StateCreator } from 'zustand';
import { PlanGenerationConfig } from '@/types/plan-generation';
import { createAsyncActionSlice, FeatureSlice } from './createAsyncActionSlice';

export type PlanGenerationMode = 'assistant' | 'direct' | 'select_mode' | null;

export type PlanGenerationSlice = FeatureSlice<'planGeneration', PlanGenerationConfig, PlanGenerationMode>;

const DEFAULT_PLAN_GENERATION_CONFIG: PlanGenerationConfig = {
  planType: 'business_plan',
  complexity: 'moderate',
  planDepth: 'standard',
  domains: [],
  constraints: {},
  brainstormAspects: [],
};

export const createPlanGenerationSlice: StateCreator<
  PlanGenerationSlice,
  [],
  [],
  PlanGenerationSlice
> = createAsyncActionSlice<'planGeneration', PlanGenerationConfig, PlanGenerationMode>('planGeneration', DEFAULT_PLAN_GENERATION_CONFIG, 'assistant');
