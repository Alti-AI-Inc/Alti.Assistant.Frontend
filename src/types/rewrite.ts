export type RewriteIntent =
  | 'formal'
  | 'simplify'
  | 'expand'
  | 'creative'
  | 'academic'
  | 'professional';

export type RewriteStyle =
  | 'formal'
  | 'conversational'
  | 'professional'
  | 'creative'
  | 'academic';

export type RewriteMode =
  | 'preserve_meaning'
  | 'improve_clarity'
  | 'expand'
  | 'simplify';

export interface DirectRewriteRequest {
  textContent: string;
  intent: RewriteIntent;
  style: RewriteStyle;
  mode: RewriteMode;
  outputFormat: 'text' | 'file' | 'both';
  targetAudience?: string;
  additionalInstructions?: string;
}

export type ConversationalRewriteRequest =
  | { message: string; textContent: string } // New Chat Text
  | { message: string; file: File } // New Chat File
  | { message: string; conversationId: string; textContent?: string }; // Continue

export interface RewriteFile {
  filename: string;
  path: string;
  localPath: string;
  size: number;
  storageType: string;
}

export interface RewriteMetadata {
  intent: RewriteIntent;
  style: RewriteStyle;
  mode: RewriteMode;
  contentLength: {
    original: number;
    rewritten: number;
  };
}

export interface RewriteResponseData {
  success: boolean;
  message?: string;
  conversationId?: string;
  rewrittenContent: string;
  originalContent?: string;
  metadata?: RewriteMetadata;
  file?: RewriteFile | null;
  outputFormat?: string;
  userId?: string;
}

export interface RewriteResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: RewriteResponseData;
}
