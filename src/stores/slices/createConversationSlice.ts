import { StateCreator } from 'zustand';
import {
  ActiveConversation,
  OPTIONS,
  ROLES,
  Reference,
  GeneratedDocument,
  PresentationTask,
} from '@/types/conversation';
import {
  BrainstormData,
  BrainstormMetadata,
  IdeaAnalysis,
} from '@/types/brainstorm';
import {
  PlanAnalysis,
  PlanBrainstorm,
  PlanData,
  PlanStage,
} from '@/types/plan-generation';
import { ContractInfo, ReviewParams } from '@/types/contract-review';
import { GeneratedReport, ReportSection } from '@/types/report-generation';

export interface ConversationSlice {
  userMessage: string;
  setUserMessage: (message: string) => void;
  showStartLastMessage: boolean;
  setShowStartLastMessage: (show: boolean) => void;
  activeConversation: ActiveConversation | null;
  isLoadingActiveConversation: boolean;
  isLoadingResponse: boolean;
  error: string | null;
  selectedOption: OPTIONS | null;
  setSelectedOption: (opt: OPTIONS | null) => void;

  setActiveConversation: (conversation: ActiveConversation | null) => void;
  updateActiveConversation: (
    message: string,
    role: ROLES,
    conversationId?: string,
    extras?: {
      images?: string;
      imageUrl?: string;
      videoName?: string;
      reference?: Reference[];
      document?: GeneratedDocument;
      brainstormData?: BrainstormData;
      metadata?: BrainstormMetadata;
      ideaAnalysis?: IdeaAnalysis;
      // Plan generation extras
      planStage?: PlanStage;
      hasAnalysis?: boolean;
      hasBrainstorm?: boolean;
      hasPlan?: boolean;
      planAnalysis?: PlanAnalysis;
      planBrainstorm?: PlanBrainstorm;
      planData?: PlanData;
      // Contract review extras
      contractInfo?: ContractInfo;
      reviewParams?: ReviewParams;
      // Report generation extras
      report?: GeneratedReport;
      reportSections?: ReportSection[];
      needsMoreInfo?: boolean;
      missingParams?: string[];
      // New interactive widget extras
      tableData?: any;
      chartData?: any;
      formData?: any;
      reportData?: any;
    },
  ) => void;
  setLoadingActiveConversation: (loading: boolean) => void;
  setLoadingResponse: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Presentation polling
  presentationTask: PresentationTask | null;
  setPresentationTask: (task: PresentationTask | null) => void;
  // Context switching
  clearConversationData: () => void;
}

export const createConversationSlice: StateCreator<
  ConversationSlice,
  [],
  [],
  ConversationSlice
> = set => ({
  activeConversation: null,
  showStartLastMessage: false,
  userMessage: '',
  isLoadingActiveConversation: false,
  isLoadingResponse: false,
  error: null,
  selectedOption: null,
  setUserMessage(message) {
    set({ userMessage: message });
  },
  setShowStartLastMessage: show => set({ showStartLastMessage: show }),

  setSelectedOption: opt => set({ selectedOption: opt }),

  setActiveConversation: conversation =>
    set({ activeConversation: conversation }),

  updateActiveConversation: (message, role, conversationId, extras) =>
    set(state => {
      const compileMetadata = () => {
        if (!extras) return undefined;
        const meta: Record<string, any> = {
          ...(extras.images && { images: extras.images }),
          ...(extras.imageUrl && { imageUrl: extras.imageUrl }),
          ...(extras.videoName && { video: { name: extras.videoName } }),
          ...(extras.reference && { reference: extras.reference }),
          ...(extras.document && { document: extras.document }),
          ...(extras.brainstormData && {
            brainstormData: extras.brainstormData,
            brainstormMetadata: extras.metadata,
            ideaAnalysis: extras.ideaAnalysis,
          }),
          ...(extras.planStage && {
            planStage: extras.planStage,
            hasAnalysis: extras.hasAnalysis,
            hasBrainstorm: extras.hasBrainstorm,
            hasPlan: extras.hasPlan,
          }),
          ...(extras.planData && {
            planAnalysis: extras.planAnalysis,
            planBrainstorm: extras.planBrainstorm,
            planData: extras.planData,
          }),
          ...(extras.contractInfo && {
            contractInfo: extras.contractInfo,
            reviewParams: extras.reviewParams,
          }),
          ...(extras.report && {
            report: extras.report,
            reportSections: extras.reportSections,
            needsMoreInfo: extras.needsMoreInfo,
            missingParams: extras.missingParams,
          }),
          ...(extras.tableData && { tableData: extras.tableData }),
          ...(extras.chartData && { chartData: extras.chartData }),
          ...(extras.formData && { formData: extras.formData }),
          ...(extras.reportData && { reportData: extras.reportData }),
        };
        return Object.keys(meta).length > 0 ? meta : undefined;
      };

      const meta = compileMetadata();

      if (!state.activeConversation) {
        // brand new conversation
        return {
          ...state,
          activeConversation: {
            ...(conversationId && { conversationId }),
            messages: [
              {
                role,
                content: message,
                ...(meta && { metadata: meta }),
                timestamp: new Date().toISOString(),
              },
            ],
          },
        };
      }

      const timestamp = new Date().toISOString();

      const newMessages = [
        ...(state.activeConversation?.messages || []),
        {
          role,
          content: message,
          ...(meta && { metadata: meta }),
          timestamp,
        },
      ];

      return {
        ...state,
        activeConversation: {
          ...state.activeConversation,
          ...(conversationId && { conversationId }), // Allow updating ID
          messages: newMessages,
          updatedAt: timestamp,
        },
      };
    }),

  setLoadingActiveConversation: isLoadingActiveConversation =>
    set({ isLoadingActiveConversation }),

  setLoadingResponse: isLoadingResponse => set({ isLoadingResponse }),

  setError: error => set({ error }),

  // Presentation polling
  presentationTask: null,
  setPresentationTask: task => set({ presentationTask: task }),

  // Context switching - clear all conversation data when switching contexts
  clearConversationData: () =>
    set({
      activeConversation: null,
      userMessage: '',
      showStartLastMessage: false,
      isLoadingActiveConversation: false,
      isLoadingResponse: false,
      error: null,
      selectedOption: null,
      presentationTask: null,
    }),
});
