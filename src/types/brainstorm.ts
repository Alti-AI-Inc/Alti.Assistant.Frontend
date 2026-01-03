export type BrainstormTechnique =
  | 'scamper'
  | 'swot'
  | 'free_association'
  | 'mind_map'
  | 'five_whys'
  | 'six_thinking_hats'
  | 'reverse_brainstorm'
  | 'starbursting';

export type BrainstormType =
  | 'product_idea'
  | 'business_strategy'
  | 'technical_solution'
  | 'problem_solving'
  | 'creative_content';

export type BrainstormDepth = 'quick' | 'standard' | 'deep' | 'comprehensive';

export type BrainstormPerspective =
  | 'creative'
  | 'user_centric'
  | 'business'
  | 'technical'
  | 'financial'
  | 'competitive'
  | 'operational';

export type BrainstormFocusArea =
  | 'innovation'
  | 'profitability'
  | 'user_value'
  | 'uniqueness';

export interface BrainstormConstraints {
  budget?: string;
  timeline?: string;
  technology?: string | string[];
  targetAudience?: string;
}

export interface BrainstormConfig {
  technique?: BrainstormTechnique;
  brainstormType?: BrainstormType;
  depth?: BrainstormDepth;
  perspective?: BrainstormPerspective[];
  focusAreas?: BrainstormFocusArea[];
  additionalInstructions?: string;
  constraints?: BrainstormConstraints;
}

export interface BrainstormRequest {
  idea: string;
  technique?: BrainstormTechnique;
  brainstormType?: BrainstormType;
  depth?: BrainstormDepth;
  perspective?: BrainstormPerspective[];
  focusAreas?: BrainstormFocusArea[];
  additionalInstructions?: string;
  constraints?: BrainstormConstraints;
}

export interface AssistantBrainstormRequest {
  message: string;
  conversationId?: string;
}

export interface MainIdea {
  id: number;
  title: string;
  description: string;
  category: string;
  reasoning: string;
  perspective: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SubIdea {
  id: number;
  parentId: number;
  title: string;
  description: string;
}

export interface Opportunity {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Risk {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
}

export interface BrainstormData {
  mainIdeas: MainIdea[];
  subIdeas: SubIdea[];
  opportunities: Opportunity[];
  risks: Risk[];
  nextSteps: string[];
  summary: string;
}

export interface BrainstormMetadata {
  totalIdeasGenerated: number;
  mainIdeas: number;
  subIdeas: number;
  opportunities: number;
  risks: number;
  nextSteps: number;
  techniqueUsed: string;
  perspectivesAnalyzed: string[];
  depthLevel: string;
  brainstormType: string;
}

export interface IdeaAnalysis {
  brainstormType: string;
  complexity: 'simple' | 'moderate' | 'complex' | string;
  domains: string[];
  keyThemes: string[];
  implicitRequirements: string[];
  suggestedTechniques: string[];
  recommendedPerspectives: string[];
  recommendedDepth: string;
  estimatedIdeaCount: number;
  reasoning: string;
}

export interface BrainstormResponseData {
  success: boolean;
  conversationId: string;
  response: string;
  brainstormData: BrainstormData;
  metadata: BrainstormMetadata;
  needsMoreInfo?: boolean;
  ideaAnalysis?: IdeaAnalysis;
}

export interface BrainstormResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: BrainstormResponseData;
}
