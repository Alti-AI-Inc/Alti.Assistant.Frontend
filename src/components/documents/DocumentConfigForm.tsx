import { useDocumentStore } from '@/stores/useDocumentStore';
import {
  DocumentType,
  DocumentTone,
  DocumentLength,
  OutputFormat,
  TemplateType,
  ReviewType,
  ReviewDepth,
} from '@/types/document-generation';
import { cn } from '@/lib/utils'; // Keep import
import { ChevronDown } from 'lucide-react'; // Keep import

export function DocumentDraftingForm() {
  const { drafting, updateDraftingConfig, review, updateReviewConfig } =
    useDocumentStore();

  const isReviewMode = review.isActive;
  const config = isReviewMode ? review.config : drafting.config;

  // Options for Drafting
  const draftOptions = {
    docType: Object.values(DocumentType),
    tone: [
      'professional',
      'casual',
      'technical',
      'academic',
      'formal',
    ] as DocumentTone[],
    length: ['short', 'medium', 'long'] as DocumentLength[],
    format: ['pdf', 'docx', 'md', 'html'] as OutputFormat[],
  };

  // Options for Review
  const reviewOptions = {
    reviewType: [
      'general_review',
      'content_analysis',
      'grammar_check',
      'tone_analysis',
    ] as ReviewType[],
    reviewDepth: ['standard', 'comprehensive', 'detailed'] as ReviewDepth[],
    documentType: [...Object.values(DocumentType), 'general'] as (
      | DocumentType
      | 'general'
    )[],
  };

  const renderPillGroup = <T extends string>(
    label: string,
    value: T,
    options: T[],
    onChange: (val: T) => void,
  ) => (
    <div className="flex flex-col gap-2">
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
          {renderPillGroup(
            'Review Type',
            (config as any).reviewType,
            reviewOptions.reviewType,
            val => updateReviewConfig({ reviewType: val }),
          )}
          {renderPillGroup(
            'Depth',
            (config as any).reviewDepth,
            reviewOptions.reviewDepth,
            val => updateReviewConfig({ reviewDepth: val }),
          )}
          {renderPillGroup(
            'Document Type',
            (config as any).documentType,
            reviewOptions.documentType,
            val => updateReviewConfig({ documentType: val }),
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
        {renderPillGroup(
          'Type',
          (config as any).docType,
          draftOptions.docType,
          val => updateDraftingConfig({ docType: val }),
        )}

        {renderPillGroup('Tone', (config as any).tone, draftOptions.tone, val =>
          updateDraftingConfig({ tone: val }),
        )}

        <div className="grid grid-cols-2 gap-4">
          {renderPillGroup(
            'Length',
            (config as any).length,
            draftOptions.length,
            val => updateDraftingConfig({ length: val }),
          )}
          {renderPillGroup(
            'Format',
            (config as any).format,
            draftOptions.format,
            val => updateDraftingConfig({ format: val }),
          )}
        </div>
      </div>
    </div>
  );
}
