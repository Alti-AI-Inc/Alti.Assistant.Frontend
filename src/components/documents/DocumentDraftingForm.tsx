import { useDocumentStore } from '@/stores/useDocumentStore';
import {
  DocumentType,
  DocumentTone,
  DocumentLength,
  OutputFormat,
  TemplateType,
} from '@/types/document-generation';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export function DocumentDraftingForm() {
  const { drafting, updateDraftingConfig } = useDocumentStore();
  const { config } = drafting;

  // Configuration map for pill options
  const configOptions = {
    docType: Object.values(DocumentType),
    tone: [
      'professional',
      'casual',
      'technical',
      'academic',
      'formal',
    ] as DocumentTone[],
    length: ['short', 'medium', 'long'] as DocumentLength[],
    format: ['pdf', 'docx', 'md', 'html'] as OutputFormat[], // txt excluded for brevity if desired
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
        {renderPillGroup('Type', config.docType, configOptions.docType, val =>
          updateDraftingConfig({ docType: val }),
        )}

        {renderPillGroup('Tone', config.tone, configOptions.tone, val =>
          updateDraftingConfig({ tone: val }),
        )}

        <div className="grid grid-cols-2 gap-4">
          {renderPillGroup('Length', config.length, configOptions.length, val =>
            updateDraftingConfig({ length: val }),
          )}
          {renderPillGroup('Format', config.format, configOptions.format, val =>
            updateDraftingConfig({ format: val }),
          )}
        </div>
      </div>
    </div>
  );
}
