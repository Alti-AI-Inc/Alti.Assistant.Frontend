import { BrainstormData, BrainstormMetadata, IdeaAnalysis } from './brainstorm';
import { ContractInfo, ReviewParams } from './contract-review';
import {
  PlanAnalysis,
  PlanBrainstorm,
  PlanData,
  PlanStage,
} from './plan-generation';
export enum ROLES {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type ResearchTier = 'bachelors' | 'masters' | 'phd';

export enum OPTIONS {
  RESEARCH = 'deep-research',
  CODE = 'code-generation',
  // TEXT = 'text-generation',
  DRAFT_DOCUMENT = 'draft-document',
  IMAGE = 'image-generation',
  EDIT_IMAGE = 'edit-generation',
  TASK = 'task-automation',
  Transcribe = 'transcribe-audio',
  PRESENTATION = 'presentation-generation',
  REVIEW_DOCUMENTS = 'review-documents',
  SUMMARIZE = 'summarize-documents',
  EXTRACT_DATA = 'extract-data',
  TRANSLATE_DOCUMENTS = 'translate-documents',
  GENERATE_REPORT = 'generate-report',
  GENERATE_SPREADSHEET = 'generate-spreadsheet',
  GENERATE_CHART = 'generate-chart',
  GENERATE_MINDMAP = 'generate-mindmap',
  GENERATE_DIAGRAM = 'generate-diagram',
  GENERATE_TIMELINE = 'generate-timeline',
  GENERATE_FLAYER = 'generate-flayer',
  GENERATE_PLAN = 'generate-plan',
  DRAFT_EMAIL = 'draft-email',
  DEBUG_CODE = 'debug-code',
  REWRITE = 'rewrite',
  BRAINSTORM = 'brainstorm',
  ARTICLE = 'article',
  WRITE_CONTRACT = 'write-contract',
  REVIEW_CONTRACT = 'contract-review',
  CREATIVE_WRITING = 'creative-writing',
  STOCK_INTELLIGENCE = 'stock-intelligence',

  AUDIO = 'audio-generation',
  VIDEO = 'video-generation',

  INSTRUCTIONS = 'instructions',
  GUARDRAILS = 'guardrails',
  KNOWLEDGE = 'knowledge',
}

export interface Reference {
  title: string;
  url: string;
  source: string;
  snippet: string;
  relevanceScore: number;
  searchQuery: string;
  domain?: string;
}

export interface GeneratedDocument {
  content?: string;
  format?: string;
  file?: {
    filePath?: string;
    fileName: string;
    format: string;
    size?: number;
  };
  url: string;
  metadata?: {
    title?: string;
    documentType?: string;
    [key: string]: any;
  };
}

// Messages inside an active conversation
export type ConversationMessage = {
  role: ROLES;
  content: string;

  timestamp: string; // ISO string
  metadata?: {
    type?: string;
    timestamp?: string;
    model?: string;
    reference?: Reference[];
    sources?: any[];
    citations?: any[];
    images?: null | string;
    imageUrl?: string; // New property to align with backend
    audioUrl?: string;
    video?: {
      name: string;
    };
    document?: GeneratedDocument;
    brainstormData?: BrainstormData;
    brainstormMetadata?: BrainstormMetadata;
    ideaAnalysis?: IdeaAnalysis;
    // Plan generation metadata
    planStage?: PlanStage;
    hasAnalysis?: boolean;
    hasBrainstorm?: boolean;
    hasPlan?: boolean;
    planAnalysis?: PlanAnalysis;
    planBrainstorm?: PlanBrainstorm;
    planData?: PlanData;
    // Contract review metadata
    contractInfo?: ContractInfo;
    reviewParams?: ReviewParams;
    // Report generation metadata
    report?: import('./report-generation').GeneratedReport;
    reportSections?: import('./report-generation').ReportSection[];
    needsMoreInfo?: boolean;
    missingParams?: string[];
    financialTicker?: {
      symbol: string;
      type: 'stock' | 'crypto' | 'forex';
    };
    tableData?: any;
    chartData?: any;
    formData?: any;
    reportData?: any;
  };
};

// Full active conversation
export type ActiveConversation = {
  _id?: string;
  conversationId?: string;
  userId?: string;
  title?: string;
  knowledgebaseId?: string;
  messages: ConversationMessage[];
  createdAt?: string;
  updatedAt?: string;
  is_deep_search?: boolean;
  option?: OPTIONS;
};

// Presentation task for async generation with polling
export interface PresentationTask {
  taskId: string;
  conversationId: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  publicUrl?: string;
}
