export type DocumentTone =
  | 'professional'
  | 'technical'
  | 'casual'
  | 'academic'
  | 'formal';

export type DocumentLength = 'short' | 'medium' | 'long';
export type OutputFormat = 'pdf' | 'html' | 'md' | 'docx' | 'txt';
export type DocumentLanguage = 'en' | 'es' | 'fr'; // Extend as needed

export enum DocumentType {
  PROPOSAL = 'proposal',
  COVER_LETTER = 'cover_letter',
  TECHNICAL_DOC = 'technical_doc',
  BLOG_POST = 'blog_post',
  RESEARCH_PAPER = 'research_paper',
  BUSINESS_LETTER = 'letter',
  MEMO = 'memo',
}

export type TemplateType =
  | 'technical_documentation'
  | 'academic_paper'
  | 'business_letter';

// Common Metadata for generated files
export interface DocumentMetadata {
  title?: string;
  documentType: DocumentType;
  includeDate: boolean;
  includeTitle: boolean;
}

export interface GeneratedFile {
  filePath: string;
  fileName: string;
  format: OutputFormat;
  size: number;
}

// --- Group 1: Conversation Assistant ---

export interface StartDocConversationRequest {
  message: string;
}

export interface ContinueDocConversationRequest {
  conversationId: string;
  message: string;
}

export interface DocConversationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    conversationId: string;
    userId: string;
    success: boolean;
    needsMoreInfo: boolean;
    isDraft: boolean;
    message: string;
    document?: {
      content: string;
      format: OutputFormat;
      file: GeneratedFile;
      url: string;
      metadata: DocumentMetadata;
    };
    improvementQuestions?: string[];
    collectedParams?: {
      content: string;
      documentType: DocumentType;
      outputFormat: OutputFormat;
      tone: DocumentTone;
      length: DocumentLength;
      wordCount?: number | null;
      title?: string;
      includeTitle: boolean;
      includeDate: boolean;
      language: DocumentLanguage;
      additionalInstructions?: string | null;
    };
  };
}

// --- Group 2: Direct Generation ---

export interface BaseGenerationRequest {
  content: string;
  documentType: DocumentType;
  outputFormat: OutputFormat;
  tone: DocumentTone;
  length: DocumentLength;
  includeTitle: boolean;
  includeDate: boolean;
  language?: DocumentLanguage;
  wordCount?: number;
  additionalInstructions?: string;
  template?: TemplateType;
}

export interface DirectGenerationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    success: boolean;
    document: {
      content: string;
      format: OutputFormat;
      file: GeneratedFile;
      url: string;
      metadata: DocumentMetadata;
    };
  };
}

// --- Group 3: Document Review ---

export type ReviewType =
  | 'general_review'
  | 'content_analysis'
  | 'grammar_check'
  | 'tone_analysis';

export type ReviewDepth = 'standard' | 'comprehensive' | 'detailed';

export interface DocumentReviewConfig {
  reviewType: ReviewType;
  reviewDepth: ReviewDepth;
  documentType: DocumentType | 'general';
  additionalInstructions?: string;
}

// 1.1 Upload and Review Document (Assistant)
export interface UploadReviewDocumentRequest {
  message?: string;
  // file is handled via FormData
}

// 2. Direct Review Request
// Fields sent as FormData: file (required), reviewType, reviewDepth, documentType, additionalInstructions

export interface ReviewResponseData {
  success: boolean;
  conversationId?: string; // For assistant flows
  response?: string; // For assistant flows (chat message)
  review?: string; // For direct generation (the review content)
  documentInfo: {
    filename: string;
    size: number;
    contentLength: number;
  };
  reviewParams: {
    reviewDepth: ReviewDepth;
    documentType: string;
    reviewType: ReviewType;
    aspects?: string[];
    additionalInstructions?: string;
  };
  needsFile?: boolean;
  needsMoreInfo?: boolean;
}

export interface ReviewResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ReviewResponseData;
}
