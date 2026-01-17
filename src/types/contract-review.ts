// Contract Review Types

export type ReviewType =
  | 'general_review'
  | 'risk_assessment'
  | 'clause_analysis'
  | 'compliance_check'
  | 'fairness_evaluation';

export type ReviewDepth = 'standard' | 'detailed' | 'comprehensive';

export type ContractType =
  | 'employment'
  | 'nda'
  | 'service_agreement'
  | 'lease'
  | 'general';

export type ReviewAspect =
  | 'confidentiality'
  | 'liabilities'
  | 'termination'
  | 'obligations'
  | 'payment_terms'
  | 'intellectual_property';

export type OutputFormat = 'text' | 'markdown' | 'json';

// Config for direct review
export interface ContractReviewConfig {
  reviewType?: ReviewType;
  reviewDepth?: ReviewDepth;
  contractType?: ContractType;
  aspects?: ReviewAspect[];
  outputFormat?: OutputFormat;
  additionalInstructions?: string;
}

// API Request types
export interface ContractAssistantRequest {
  message: string;
  conversationId?: string;
}

// Contract info from response
export interface ContractInfo {
  filename: string;
  size: number;
  contentLength: number;
  publicUrl?: string;
  contractId?: string;
}

// Review params from response
export interface ReviewParams {
  reviewDepth: ReviewDepth;
  contractType: ContractType;
  aspects: string[];
  reviewType?: ReviewType;
  outputFormat?: OutputFormat;
  contractText?: string | null;
}

// Assistant response
export interface ContractAssistantResponseData {
  success: boolean;
  conversationId: string;
  response: string;
  contractInfo?: ContractInfo;
  reviewParams?: ReviewParams;
  outputFormat?: OutputFormat;
  needsContract?: boolean;
  needsMoreInfo?: boolean;
}

// Direct review response
export interface DirectContractReviewResponseData {
  success: boolean;
  review: string;
  contractInfo?: ContractInfo;
  reviewParams?: ReviewParams;
  outputFormat?: OutputFormat;
}

export interface ContractReviewResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ContractAssistantResponseData | DirectContractReviewResponseData;
}
