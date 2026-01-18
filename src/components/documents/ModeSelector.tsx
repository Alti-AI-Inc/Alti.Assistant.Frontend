import { Bot, FileText } from 'lucide-react';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { useConversationsStore } from '@/stores/useConverstionsStore';
import { cn } from '@/lib/utils';

export function ModeSelector({
  currentMode,
  modeContext = 'draft',
}: {
  currentMode?: 'assistant' | 'direct' | 'structured' | 'select_mode' | null;
  modeContext?:
    | 'draft'
    | 'review'
    | 'rewrite'
    | 'translate'
    | 'brainstorm'
    | 'plan-generation'
    | 'contract-review'
    | 'report-generation';
}) {
  const { setDraftingMode, setReviewMode } = useDocumentStore();
  const {
    setRewriteMode,
    setTranslationMode,
    setBrainstormMode,
    setPlanGenerationMode,
    setContractReviewMode,
    setReportGenerationMode,
  } = useConversationsStore();

  const handleSetMode = (mode: 'assistant' | 'direct' | 'select_mode') => {
    if (modeContext === 'review') {
      setReviewMode(mode);
    } else if (modeContext === 'rewrite') {
      setRewriteMode(mode);
    } else if (modeContext === 'translate') {
      setTranslationMode(mode);
    } else if (modeContext === 'brainstorm') {
      setBrainstormMode(
        mode === 'direct' ? 'structured' : (mode as 'assistant' | 'structured'),
      );
    } else if (modeContext === 'plan-generation') {
      setPlanGenerationMode(mode as 'assistant' | 'direct');
    } else if (modeContext === 'contract-review') {
      setContractReviewMode(mode as 'assistant' | 'direct');
    } else if (modeContext === 'report-generation') {
      setReportGenerationMode(mode as 'assistant' | 'direct');
    } else {
      setDraftingMode(mode);
    }
  };

  const getDescriptions = (id: 'assistant' | 'direct') => {
    if (modeContext === 'translate') {
      return id === 'assistant'
        ? 'Collaborate with AI to translate text or documents.'
        : 'Instant translation or language detection.';
    }
    if (modeContext === 'rewrite') {
      return id === 'assistant'
        ? 'Collaborate with AI to rewrite your text step-by-step.'
        : 'Paste text and get an instant rewrite.';
    }
    if (modeContext === 'review') {
      return id === 'assistant'
        ? 'Collaborate with AI to review your document step-by-step.'
        : 'Upload a file and get an instant review.';
    }
    if (modeContext === 'brainstorm') {
      return id === 'assistant'
        ? 'Start a new chat or continue an existing one.'
        : 'Brainstorm with strict frameworks and parameters.';
    }
    if (modeContext === 'plan-generation') {
      return id === 'assistant'
        ? 'Collaborate with AI to develop your plan step-by-step.'
        : 'Configure parameters and generate a complete plan instantly.';
    }
    if (modeContext === 'contract-review') {
      return id === 'assistant'
        ? 'Chat with AI to review contracts interactively.'
        : 'Upload a contract and get an instant structured review.';
    }
    if (modeContext === 'report-generation') {
      return id === 'assistant'
        ? 'Chat with AI to generate reports step-by-step.'
        : 'Configure parameters and generate a report instantly.';
    }
    // draft
    return id === 'assistant'
      ? 'Collaborate with AI to draft your document step-by-step.'
      : 'Fill in the details and generate a document instantly.';
  };

  const options = [
    {
      id: 'assistant' as const,
      label: 'Conversation Assistant',
      description: getDescriptions('assistant'),
      icon: Bot,
    },
    {
      id: 'direct' as const,
      label: 'Direct Generation',
      description: getDescriptions('direct'),
      icon: FileText,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4 py-2">
      <p className="text-sm text-gray-500">
        {modeContext === 'review'
          ? 'How would you like to review your document?'
          : modeContext === 'rewrite'
            ? 'How would you like to rewrite your text?'
            : modeContext === 'translate'
              ? 'How would you like to translate your content?'
              : modeContext === 'brainstorm'
                ? 'How would you like to brainstorm?'
                : modeContext === 'plan-generation'
                  ? 'How would you like to generate your plan?'
                  : modeContext === 'contract-review'
                    ? 'How would you like to review your contract?'
                    : modeContext === 'report-generation'
                      ? 'How would you like to generate your report?'
                      : 'How would you like to draft your document?'}
      </p>
      <div className="flex w-full gap-4">
        {options.map(option => {
          let label = option.label;
          let id = option.id;

          // Override for Brainstorm Structured mode
          if (modeContext === 'brainstorm' && option.id === 'direct') {
            label = 'Structured Generation';
          }

          return (
            <button
              key={id}
              onClick={() => {
                if (currentMode === id) {
                  handleSetMode('select_mode');
                } else {
                  handleSetMode(id);
                }
              }}
              className={cn(
                'group relative flex flex-1 cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm backdrop-blur-sm transition-all',
                !currentMode &&
                  'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white hover:shadow-md',
                currentMode &&
                  (id === currentMode ||
                    (modeContext === 'brainstorm' &&
                      id === 'direct' &&
                      currentMode === 'structured'))
                  ? 'border-black bg-white opacity-100 ring-1 ring-black/5'
                  : currentMode &&
                      'border-transparent bg-white/20 opacity-40 grayscale hover:opacity-100 hover:grayscale-0',
              )}
            >
              <div
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  !currentMode &&
                    'bg-gray-100 text-black group-hover:bg-black group-hover:text-white',
                  currentMode &&
                    (id === currentMode ||
                      (modeContext === 'brainstorm' &&
                        id === 'direct' &&
                        currentMode === 'structured'))
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-500',
                )}
              >
                <option.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
