import { useDocumentStore } from '@/stores/useDocumentStore';
import { useConversationsStore, OPTIONS } from '@/stores/useConverstionsStore';
import { DocumentType } from '@/types/document-generation';
import { cn } from '@/lib/utils';
import { BrainstormConfig } from '@/types/brainstorm';

export function ConfigForm() {
  const { drafting, updateDraftingConfig, review, updateReviewConfig } =
    useDocumentStore();
  const { selectedOption, rewriteConfig, updateRewriteConfig, rewriteMode } =
    useConversationsStore();

  const isReviewMode = review.isActive;
  const isTranslateMode = selectedOption === OPTIONS.TRANSLATE_DOCUMENTS;
  const isRewriteMode = selectedOption === OPTIONS.REWRITE;
  const isBrainstormMode = selectedOption === OPTIONS.BRAINSTORM;
  const isPlanGenerationMode = selectedOption === OPTIONS.GENERATE_PLAN;
  const isContractReviewMode = selectedOption === OPTIONS.REVIEW_CONTRACT;
  const config = isReviewMode ? review.config : drafting.config;
  const { translationConfig, updateTranslationConfig, translationMode } =
    useConversationsStore();

  const { brainstormConfig, updateBrainstormConfig } = useConversationsStore();
  const { planGenerationConfig, updatePlanGenerationConfig } =
    useConversationsStore();
  const { contractReviewConfig, updateContractReviewConfig } =
    useConversationsStore();

  const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'da', name: 'Danish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'el', name: 'Greek' },
    { code: 'cs', name: 'Czech' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'ro', name: 'Romanian' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'fil', name: 'Filipino' },
    { code: 'he', name: 'Hebrew' },
    { code: 'fa', name: 'Persian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'sw', name: 'Swahili' },
  ];

  // Configuration Definitions
  const REWRITE_CONFIGS = [
    {
      label: 'Intent',
      key: 'intent',
      options: [
        'formal',
        'simplify',
        'expand',
        'creative',
        'academic',
        'professional',
      ],
    },
    {
      label: 'Style',
      key: 'style',
      options: [
        'conversational',
        'formal',
        'professional',
        'creative',
        'academic',
      ],
    },
    {
      label: 'Mode',
      key: 'mode',
      options: ['preserve_meaning', 'improve_clarity', 'expand', 'simplify'],
    },
    {
      label: 'Output Format',
      key: 'outputFormat',
      options: ['text', 'file', 'both'],
    },
  ];

  const REVIEW_CONFIGS = [
    {
      label: 'Review Type',
      key: 'reviewType',
      options: [
        'general_review',
        'content_analysis',
        'grammar_check',
        'tone_analysis',
      ],
    },
    {
      label: 'Depth',
      key: 'reviewDepth',
      options: ['standard', 'comprehensive', 'detailed'],
    },
    {
      label: 'Document Type',
      key: 'documentType',
      options: [...Object.values(DocumentType), 'general'],
    },
    {
      label: 'Document Type',
      key: 'documentType',
      options: [...Object.values(DocumentType), 'general'],
    },
  ];

  const DRAFTING_CONFIGS = [
    {
      label: 'Type',
      key: 'docType',
      options: Object.values(DocumentType),
    },
    {
      label: 'Tone',
      key: 'tone',
      options: ['professional', 'casual', 'technical', 'academic', 'formal'],
    },
    {
      label: 'Length',
      key: 'length',
      options: ['short', 'medium', 'long'],
    },
    {
      label: 'Format',
      key: 'format',
      options: ['pdf', 'docx', 'md', 'html'],
    },
  ];

  const renderPillGroup = (
    label: string,
    value: string,
    options: string[],
    onChange: (val: string) => void,
  ) => (
    <div className="flex flex-col gap-2" key={label}>
      <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              value === opt
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
            )}
          >
            {opt.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMultiSelectPillGroup = (
    label: string,
    values: string[] = [],
    options: string[],
    onChange: (vals: string[]) => void,
  ) => (
    <div className="flex flex-col gap-2" key={label}>
      <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isSelected = values.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => {
                if (isSelected) {
                  onChange(values.filter(v => v !== opt));
                } else {
                  onChange([...values, opt]);
                }
              }}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50',
              )}
            >
              {opt.replace(/_/g, ' ')}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderTextInput = (
    label: string,
    value: string | undefined,
    placeholder: string,
    onChange: (val: string) => void,
    multiline: boolean = false,
  ) => (
    <div className="flex flex-col gap-2" key={label}>
      <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="max-h-[150px] min-h-[100px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none md:max-h-[250px]"
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
        />
      )}
    </div>
  );

  const renderSelect = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    options: { code: string; name: string }[],
  ) => (
    <div className="flex flex-col gap-2" key={label}>
      <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {label}
      </span>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map(opt => (
          <option key={opt.code} value={opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );

  const isReportGenerationMode = selectedOption === OPTIONS.GENERATE_REPORT;
  const {
    reportGenerationConfig,
    updateReportGenerationConfig,
    reportGenerationMode,
  } = useConversationsStore();
  const { activeConversation } = useConversationsStore();

  // Check if we're in an existing conversation
  const isExistingReportConversation =
    activeConversation?.conversationId &&
    activeConversation?.conversationId !== 'new-chat';

  // Report Generation Configuration Form
  if (isReportGenerationMode) {
    // For assistant mode in existing conversation, don't show config
    if (reportGenerationMode === 'assistant' && isExistingReportConversation) {
      return null;
    }

    // For assistant mode (new chat) - show only reportType and outputFormat
    if (reportGenerationMode === 'assistant') {
      return (
        <div className="flex max-h-[40vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-900">Report Settings</h3>
            <p className="text-xs text-gray-500">
              Configure your report type and format before starting the
              conversation.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {renderSelect(
              'Report Type',
              reportGenerationConfig.reportType || '',
              val => updateReportGenerationConfig({ reportType: val as any }),
              [
                { code: 'executive_summary', name: 'Executive Summary' },
                { code: 'analytical', name: 'Analytical' },
                { code: 'financial', name: 'Financial' },
                { code: 'technical', name: 'Technical' },
                { code: 'research', name: 'Research' },
                { code: 'business', name: 'Business' },
                { code: 'comparison', name: 'Comparison' },
              ],
            )}

            {renderPillGroup(
              'Output Format',
              reportGenerationConfig.outputFormat || '',
              ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'md', 'html', 'json'],
              val => updateReportGenerationConfig({ outputFormat: val as any }),
            )}
          </div>
        </div>
      );
    }

    // Direct mode - show full configuration form
    return (
      <div className="flex max-h-[40vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">Report Configuration</h3>
          <p className="text-xs text-gray-500">
            Configure all report parameters for direct generation.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            {renderSelect(
              'Report Type',
              reportGenerationConfig.reportType || '',
              val => updateReportGenerationConfig({ reportType: val as any }),
              [
                { code: 'executive_summary', name: 'Executive Summary' },
                { code: 'analytical', name: 'Analytical' },
                { code: 'financial', name: 'Financial' },
                { code: 'technical', name: 'Technical' },
                { code: 'research', name: 'Research' },
                { code: 'business', name: 'Business' },
                { code: 'comparison', name: 'Comparison' },
              ],
            )}
          </div>

          {renderPillGroup(
            'Output Format',
            reportGenerationConfig.outputFormat || '',
            ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'md', 'html', 'json'],
            val => updateReportGenerationConfig({ outputFormat: val as any }),
          )}

          {renderPillGroup(
            'Tone',
            reportGenerationConfig.tone || '',
            [
              'professional',
              'formal',
              'technical',
              'casual',
              'academic',
              'persuasive',
            ],
            val => updateReportGenerationConfig({ tone: val }),
          )}

          {renderTextInput(
            'Report Title',
            reportGenerationConfig.title || '',
            'Enter the report title...',
            val => updateReportGenerationConfig({ title: val }),
          )}

          {renderTextInput(
            'Report Content',
            reportGenerationConfig.content || '',
            'Enter the raw data or text content for the report...',
            val => updateReportGenerationConfig({ content: val }),
            true, // multiline
          )}

          {/* Toggle options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={reportGenerationConfig.includeTitlePage ?? false}
                onChange={e =>
                  updateReportGenerationConfig({
                    includeTitlePage: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Include Title Page
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={reportGenerationConfig.includeTableOfContents ?? false}
                onChange={e =>
                  updateReportGenerationConfig({
                    includeTableOfContents: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Include Table of Contents
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  reportGenerationConfig.includeExecutiveSummary ?? false
                }
                onChange={e =>
                  updateReportGenerationConfig({
                    includeExecutiveSummary: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              Include Executive Summary
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Contract Review Configuration Form
  if (isContractReviewMode) {
    return (
      <div className="flex max-h-[40vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">
            Contract Review Configuration
          </h3>
          <p className="text-xs text-gray-500">
            Configure your contract review parameters. A contract file is
            required.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          {/* Review Type */}
          {renderSelect(
            'Review Type',
            contractReviewConfig.reviewType || 'general_review',
            (value: string) =>
              updateContractReviewConfig({
                reviewType: value as
                  | 'general_review'
                  | 'risk_assessment'
                  | 'clause_analysis'
                  | 'compliance_check'
                  | 'fairness_evaluation',
              }),
            [
              { code: 'general_review', name: 'General Review' },
              { code: 'risk_assessment', name: 'Risk Assessment' },
              { code: 'clause_analysis', name: 'Clause Analysis' },
              { code: 'compliance_check', name: 'Compliance Check' },
              { code: 'fairness_evaluation', name: 'Fairness Evaluation' },
            ],
          )}
          {/* Review Depth */}
          {renderPillGroup(
            'Review Depth',
            contractReviewConfig.reviewDepth || 'standard',
            ['standard', 'detailed', 'comprehensive'],
            (value: string) =>
              updateContractReviewConfig({
                reviewDepth: value as 'standard' | 'detailed' | 'comprehensive',
              }),
          )}
          {/* Contract Type */}
          {renderSelect(
            'Contract Type',
            contractReviewConfig.contractType || 'general',
            (value: string) =>
              updateContractReviewConfig({
                contractType: value as
                  | 'general'
                  | 'employment'
                  | 'nda'
                  | 'service_agreement'
                  | 'lease',
              }),
            [
              { code: 'general', name: 'General' },
              { code: 'employment', name: 'Employment' },
              { code: 'nda', name: 'NDA' },
              { code: 'service_agreement', name: 'Service Agreement' },
              { code: 'lease', name: 'Lease' },
            ],
          )}
          {/* Output Format */}
          {renderPillGroup(
            'Output Format',
            contractReviewConfig.outputFormat || 'markdown',
            ['text', 'markdown', 'json'],
            (value: string) =>
              updateContractReviewConfig({
                outputFormat: value as 'text' | 'markdown' | 'json',
              }),
          )}
          {/* Aspects to Review */}
          {renderMultiSelectPillGroup(
            'Aspects to Review',
            contractReviewConfig.aspects || [],
            [
              'confidentiality',
              'liabilities',
              'termination',
              'obligations',
              'payment_terms',
              'intellectual_property',
            ],
            (values: string[]) =>
              updateContractReviewConfig({
                aspects: values as (
                  | 'confidentiality'
                  | 'liabilities'
                  | 'termination'
                  | 'obligations'
                  | 'payment_terms'
                  | 'intellectual_property'
                )[],
              }),
          )}
          {/* Additional Instructions */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Additional Instructions
            </span>
            <textarea
              placeholder="Any specific areas to focus on or questions about the contract..."
              value={contractReviewConfig.additionalInstructions || ''}
              onChange={e =>
                updateContractReviewConfig({
                  additionalInstructions: e.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isPlanGenerationMode) {
    return (
      <div className="flex max-h-[40vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">Plan Configuration</h3>
          <p className="text-xs text-gray-500">
            Configure your plan generation parameters.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            {renderSelect(
              'Plan Type',
              planGenerationConfig.planType || '',
              val =>
                updatePlanGenerationConfig({
                  planType: val as any,
                }),
              [
                { code: 'business_plan', name: 'Business Plan' },
                { code: 'product_launch', name: 'Product Launch' },
                { code: 'event_plan', name: 'Event Plan' },
                { code: 'marketing_campaign', name: 'Marketing Campaign' },
                { code: 'project_plan', name: 'Project Plan' },
              ],
            )}
          </div>

          {renderPillGroup(
            'Complexity',
            planGenerationConfig.complexity || '',
            ['simple', 'moderate', 'complex'],
            val => updatePlanGenerationConfig({ complexity: val as any }),
          )}

          {renderPillGroup(
            'Plan Depth',
            planGenerationConfig.planDepth || '',
            ['quick', 'standard', 'detailed', 'comprehensive'],
            val => updatePlanGenerationConfig({ planDepth: val as any }),
          )}

          {renderMultiSelectPillGroup(
            'Domains',
            planGenerationConfig.domains,
            ['business', 'marketing', 'technical', 'design'],
            vals => updatePlanGenerationConfig({ domains: vals as any }),
          )}

          {renderMultiSelectPillGroup(
            'Brainstorm Aspects',
            planGenerationConfig.brainstormAspects,
            [
              'swot_analysis',
              'market_analysis',
              'technical_feasibility',
              'financial_projections',
            ],
            vals =>
              updatePlanGenerationConfig({ brainstormAspects: vals as any }),
          )}

          <div className="grid grid-cols-3 gap-4">
            {renderTextInput(
              'Budget',
              planGenerationConfig.constraints?.budget?.toString() || '',
              'e.g. 50000',
              val =>
                updatePlanGenerationConfig({
                  constraints: {
                    ...planGenerationConfig.constraints,
                    budget: val ? parseInt(val, 10) : undefined,
                  },
                }),
            )}
            {renderTextInput(
              'Timeline',
              planGenerationConfig.constraints?.timeline || '',
              'e.g. 6 months',
              val =>
                updatePlanGenerationConfig({
                  constraints: {
                    ...planGenerationConfig.constraints,
                    timeline: val,
                  },
                }),
            )}
            {renderTextInput(
              'Team Size',
              planGenerationConfig.constraints?.teamSize?.toString() || '',
              'e.g. 5',
              val =>
                updatePlanGenerationConfig({
                  constraints: {
                    ...planGenerationConfig.constraints,
                    teamSize: val ? parseInt(val, 10) : undefined,
                  },
                }),
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isBrainstormMode) {
    return (
      <div className="flex max-h-[40vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">Brainstorm Details</h3>
          <p className="text-xs text-gray-500">
            Define your brainstorming parameters. All fields are optional.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            {renderSelect(
              'Brainstorm Type',
              brainstormConfig.brainstormType || '',
              val => updateBrainstormConfig({ brainstormType: val as any }),
              [
                { code: 'product_idea', name: 'Product Idea' },
                { code: 'business_strategy', name: 'Business Strategy' },
                { code: 'technical_solution', name: 'Technical Solution' },
                { code: 'problem_solving', name: 'Problem Solving' },
                { code: 'creative_content', name: 'Creative Content' },
              ],
            )}

            {renderSelect(
              'Technique',
              brainstormConfig.technique || '',
              val => updateBrainstormConfig({ technique: val as any }),
              [
                { code: 'scamper', name: 'SCAMPER' },
                { code: 'swot', name: 'SWOT Analysis' },
                { code: 'free_association', name: 'Free Association' },
                { code: 'mind_map', name: 'Mind Mapping' },
                { code: 'five_whys', name: 'Five Whys' },
                { code: 'six_thinking_hats', name: 'Six Thinking Hats' },
                { code: 'reverse_brainstorm', name: 'Reverse Brainstorming' },
                { code: 'starbursting', name: 'Starbursting' },
              ],
            )}
          </div>

          {renderPillGroup(
            'Depth',
            brainstormConfig.depth || '',
            ['quick', 'standard', 'deep', 'comprehensive'],
            val => updateBrainstormConfig({ depth: val as any }),
          )}

          {renderMultiSelectPillGroup(
            'Perspectives',
            brainstormConfig.perspective,
            [
              'creative',
              'user_centric',
              'business',
              'technical',
              'financial',
              'competitive',
              'operational',
            ],
            vals => updateBrainstormConfig({ perspective: vals as any }),
          )}

          {renderMultiSelectPillGroup(
            'Focus Areas',
            brainstormConfig.focusAreas,
            ['innovation', 'profitability', 'user_value', 'uniqueness'],
            vals => updateBrainstormConfig({ focusAreas: vals as any }),
          )}

          {renderTextInput(
            'Additional Instructions',
            brainstormConfig.additionalInstructions,
            'Any specific goals or context...',
            val => updateBrainstormConfig({ additionalInstructions: val }),
          )}

          <div className="grid grid-cols-2 gap-4">
            {renderTextInput(
              'Budget Constraint',
              brainstormConfig.constraints?.budget,
              'e.g. $5000',
              val =>
                updateBrainstormConfig({
                  constraints: { ...brainstormConfig.constraints, budget: val },
                }),
            )}
            {renderTextInput(
              'Timeline Constraint',
              brainstormConfig.constraints?.timeline,
              'e.g. 2 weeks',
              val =>
                updateBrainstormConfig({
                  constraints: {
                    ...brainstormConfig.constraints,
                    timeline: val,
                  },
                }),
            )}
          </div>
          {renderTextInput(
            'Technology Constraint',
            Array.isArray(brainstormConfig.constraints?.technology)
              ? brainstormConfig.constraints.technology.join(', ')
              : brainstormConfig.constraints?.technology || '',
            'e.g. React, Node.js (comma separated)',
            val =>
              updateBrainstormConfig({
                constraints: {
                  ...brainstormConfig.constraints,
                  technology: val,
                },
              }),
          )}
          {renderTextInput(
            'Target Audience Constraint',
            brainstormConfig.constraints?.targetAudience,
            'e.g. Millennials',
            val =>
              updateBrainstormConfig({
                constraints: {
                  ...brainstormConfig.constraints,
                  targetAudience: val,
                },
              }),
          )}
        </div>
      </div>
    );
  }

  if (isTranslateMode) {
    if (translationMode === 'assistant') {
      return null;
    }

    // Direct Mode Configuration
    const isDetectMode = translationConfig.isDetectMode;

    return (
      <div className="flex max-h-[55vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-5">
          {/* Action Type Toggle */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
              Action
            </span>
            <div className="flex gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => updateTranslationConfig({ isDetectMode: false })}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                  !isDetectMode
                    ? 'border-b-2 border-gray-300 bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-900',
                )}
              >
                Translate
              </button>
              <button
                onClick={() => updateTranslationConfig({ isDetectMode: true })}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                  isDetectMode
                    ? 'border-b-2 border-gray-300 bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-gray-900',
                )}
              >
                Detect Language
              </button>
            </div>
          </div>

          {!isDetectMode && (
            <div className="grid grid-cols-2 gap-4">
              {renderSelect(
                'Source Language',
                translationConfig.sourceLanguage,
                val => updateTranslationConfig({ sourceLanguage: val }),
                [{ code: 'auto', name: 'Auto Detect' }, ...SUPPORTED_LANGUAGES],
              )}
              {renderSelect(
                'Target Language',
                translationConfig.targetLanguage,
                val => updateTranslationConfig({ targetLanguage: val }),
                SUPPORTED_LANGUAGES,
              )}
            </div>
          )}

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-2 flex items-center gap-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Type text in the field below.
            </span>
            <div className="grow border-t border-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isRewriteMode) {
    return (
      <div className="flex max-h-[55vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        {/* <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">Rewrite Configuration</h3>
          <p className="text-xs text-gray-500">
            Customize how you want to rewrite your content.
          </p>
        </div> */}
        <div className="flex flex-col gap-5">
          {/* Text Content Input for Assistant/General usage */}
          {rewriteMode === 'assistant' &&
            renderTextInput(
              'Content to Rewrite',
              rewriteConfig.textContent,
              'Paste the text you want to rewrite here...',
              val => updateRewriteConfig({ textContent: val }),
              true, // multiline
            )}

          {rewriteMode !== 'assistant' && (
            <>
              {REWRITE_CONFIGS.map(conf =>
                renderPillGroup(
                  conf.label,
                  (rewriteConfig as any)[conf.key],
                  conf.options,
                  val => updateRewriteConfig({ [conf.key]: val }),
                ),
              )}

              {renderTextInput(
                'Target Audience',
                rewriteConfig.targetAudience,
                'e.g. Beginners, C-Level Execs...',
                val => updateRewriteConfig({ targetAudience: val }),
              )}

              {renderTextInput(
                'Additional Instructions',
                rewriteConfig.additionalInstructions,
                'Any specific requirements...',
                val => updateRewriteConfig({ additionalInstructions: val }),
              )}
            </>
          )}

          {/* OR Upload a file to rewrite */}
          <div className="relative flex items-center py-2">
            <div className="grow border-t border-gray-200"></div>
            <span className="mx-2 flex items-center gap-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
              OR Upload a file to rewrite
            </span>
            <div className="grow border-t border-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isReviewMode) {
    return (
      <div className="flex max-h-[55vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">Review Configuration</h3>
          <p className="text-xs text-gray-500">
            Select how you want your document reviewed.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          {REVIEW_CONFIGS.map(conf =>
            renderPillGroup(
              conf.label,
              (config as any)[conf.key],
              conf.options,
              val => updateReviewConfig({ [conf.key]: val } as any),
            ),
          )}
        </div>
      </div>
    );
  }

  // Default Drafting View
  return (
    <div className="flex max-h-[55vh] w-full flex-col gap-6 overflow-y-auto rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-gray-900">Configuration</h3>
        <p className="text-xs text-gray-500">
          Select your preferences below and describe the content in the chat
          input.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {DRAFTING_CONFIGS.map(conf =>
          renderPillGroup(
            conf.label,
            (config as any)[conf.key],
            conf.options,
            val => updateDraftingConfig({ [conf.key]: val } as any),
          ),
        )}
      </div>
    </div>
  );
}
