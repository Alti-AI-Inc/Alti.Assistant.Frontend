import { StateCreator } from 'zustand';
import { PlanGenerationConfig } from '@/types/plan-generation';

export interface PlanGenerationSlice {
  planGenerationConfig: PlanGenerationConfig;
  planGenerationMode: 'assistant' | 'direct' | 'select_mode' | null;

  setPlanGenerationConfig: (config: Partial<PlanGenerationConfig>) => void;
  updatePlanGenerationConfig: (config: Partial<PlanGenerationConfig>) => void;
  resetPlanGenerationConfig: () => void;
  setPlanGenerationMode: (
    mode: 'assistant' | 'direct' | 'select_mode' | null,
  ) => void;
}

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
> = set => ({
  planGenerationConfig: DEFAULT_PLAN_GENERATION_CONFIG,
  planGenerationMode: 'assistant',

  setPlanGenerationConfig: config =>
    set(state => ({
      planGenerationConfig: { ...state.planGenerationConfig, ...config },
    })),

  updatePlanGenerationConfig: config =>
    set(state => ({
      planGenerationConfig: { ...state.planGenerationConfig, ...config },
    })),

  resetPlanGenerationConfig: () =>
    set({
      planGenerationConfig: DEFAULT_PLAN_GENERATION_CONFIG,
    }),

  setPlanGenerationMode: mode => set({ planGenerationMode: mode }),
});
