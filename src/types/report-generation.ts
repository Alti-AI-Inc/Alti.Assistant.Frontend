// Output format and report type enums
export type ReportOutputFormat =
  | 'pdf'
  | 'docx'
  | 'doc'
  | 'xlsx'
  | 'csv'
  | 'txt'
  | 'md'
  | 'html'
  | 'json';

export type ReportType =
  | 'executive_summary'
  | 'analytical'
  | 'financial'
  | 'technical'
  | 'research'
  | 'business'
  | 'comparison';

// Assistant request types
export interface ReportAssistantRequest {
  message: string;
  outputFormat?: ReportOutputFormat;
  reportType?: ReportType;
  conversationId?: string;
}

// Direct generation request
export interface DirectReportRequest {
  content: string;
  title: string;
  reportType: ReportType;
  outputFormat: ReportOutputFormat;
  tone?: string;
  includeTitlePage?: boolean;
  includeTableOfContents?: boolean;
  includeExecutiveSummary?: boolean;
  sections?: string[];
}

// Report metadata from response
export interface ReportMetadata {
  reportType: string;
  tone: string;
  generatedAt: string;
}

// Report section for display
export interface ReportSection {
  title: string;
  content: string;
}

// Report object from response
export interface GeneratedReport {
  reportId: string;
  title: string;
  outputFormat: ReportOutputFormat;
  filePath: string;
  downloadUrl: string;
  publicUrl: string;
  gcsPath: string;
  sections?: ReportSection[];
  metadata: ReportMetadata;
}

// API Response types
export interface ReportAssistantResponse {
  conversationId: string;
  userId: string;
  success: boolean;
  needsMoreInfo: boolean;
  response: string;
  missingParams?: string[];
  report?: GeneratedReport;
}

export interface DirectReportResponse {
  success: boolean;
  userId: string;
  report: GeneratedReport;
}

// Config for store
export interface ReportGenerationConfig {
  outputFormat?: ReportOutputFormat;
  reportType?: ReportType;
  title?: string;
  content?: string;
  tone?: string;
  includeTitlePage?: boolean;
  includeTableOfContents?: boolean;
  includeExecutiveSummary?: boolean;
  sections?: string[];
}
