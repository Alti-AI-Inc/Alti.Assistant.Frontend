import { useDocumentStore } from '@/stores/useDocumentStore';
import { useConversationsStore, OPTIONS } from '@/stores/useConverstionsStore';
import { DocumentType } from '@/types/document-generation';
import { cn } from '@/lib/utils';

export function DocumentDraftingForm() {
  const { drafting, updateDraftingConfig, review, updateReviewConfig } =
    useDocumentStore();
  const { selectedOption, rewriteConfig, updateRewriteConfig, rewriteMode } =
    useConversationsStore();

  const isReviewMode = review.isActive;
  const isRewriteMode = selectedOption === OPTIONS.REWRITE;
  const config = isReviewMode ? review.config : drafting.config;

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

  if (isRewriteMode) {
    return (
      <div className="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-gray-900">Rewrite Configuration</h3>
          <p className="text-xs text-gray-500">
            Customize how you want to rewrite your content.
          </p>
        </div>
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
      <div className="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
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
    <div className="flex w-full flex-col gap-6 rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
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
