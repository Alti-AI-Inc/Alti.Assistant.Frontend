// Plan Generation Types

export type PlanType =
  | 'business_plan'
  | 'product_launch'
  | 'event_plan'
  | 'marketing_campaign'
  | 'project_plan';

export type PlanComplexity = 'simple' | 'moderate' | 'complex';

export type PlanDepth = 'quick' | 'standard' | 'detailed' | 'comprehensive';

export type PlanDomain = 'business' | 'marketing' | 'technical' | 'design';

export type BrainstormAspect =
  | 'swot_analysis'
  | 'market_analysis'
  | 'technical_feasibility'
  | 'financial_projections';

export type PlanStage =
  | 'idea_analysis'
  | 'brainstorm'
  | 'planning'
  | 'completed';

// Config for direct generation
export interface PlanConstraints {
  budget?: number;
  timeline?: string;
  teamSize?: number;
}

export interface PlanGenerationConfig {
  planType?: PlanType;
  complexity?: PlanComplexity;
  planDepth?: PlanDepth;
  domains?: PlanDomain[];
  constraints?: PlanConstraints;
  brainstormAspects?: BrainstormAspect[];
}

// API Request types
export interface PlanAssistantRequest {
  message: string;
  conversationId?: string;
}

export interface DirectPlanGenerationRequest {
  idea: string;
  planType: PlanType;
  complexity: PlanComplexity;
  planDepth: PlanDepth;
  domains?: PlanDomain[];
  constraints?: PlanConstraints;
  brainstormAspects?: BrainstormAspect[];
}

// Response data structures
export interface PlanAnalysis {
  clarity_score: number;
  plan_type: string;
  complexity: string;
  domains: string[];
  key_concepts: string[];
  missing_information: string[];
  clarifying_questions: string[];
  estimated_timeline: string;
  readiness_for_planning: string;
  summary: string;
}

export interface PlanBrainstorm {
  swot_analysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  resource_needs: {
    budget_estimate: string;
    key_roles: string[];
    essential_tools: string[];
  };
  timeline_estimation: {
    phases: { name: string; duration: string }[];
    total_duration: string;
  };
  key_insights: string[];
}

export interface PlanObjective {
  objective: string;
  description: string;
  priority: string;
  timeline: string;
}

export interface PlanPhase {
  phase_number: number;
  name: string;
  duration: string;
  deliverables: string[];
}

export interface PlanActionItem {
  task: string;
  priority: string;
  estimated_effort: string;
}

export interface PlanRisk {
  risk: string;
  probability: string;
  mitigation: string;
}

export interface PlanData {
  title: string;
  executive_summary: string;
  objectives: PlanObjective[];
  phases: PlanPhase[];
  action_items: PlanActionItem[];
  resources: {
    budget_estimate: string;
    team_roles: string[];
    tools: string[];
  };
  risks: PlanRisk[];
  success_metrics: {
    kpis: string[];
    milestones: string[];
  };
  timeline: {
    estimated_completion: string;
    critical_path: string[];
  };
  next_steps: string[];
}

// Assistant response (conversation mode)
export interface PlanAssistantResponseData {
  success: boolean;
  conversationId: string;
  response: string;
  planStage: PlanStage;
  hasAnalysis: boolean;
  hasBrainstorm: boolean;
  hasPlan: boolean;
}

// Direct generation response
export interface DirectPlanResponseData {
  success: boolean;
  analysis: PlanAnalysis;
  brainstorm: PlanBrainstorm;
  plan: PlanData;
  message?: string;
}

export interface PlanGenerationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: PlanAssistantResponseData | DirectPlanResponseData;
}
