import { Bot, FileText } from 'lucide-react';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { cn } from '@/lib/utils';

export function DocumentModeSelector({
  currentMode,
}: {
  currentMode?: 'assistant' | 'direct' | null;
}) {
  const { setDraftingMode } = useDocumentStore();

  const options = [
    {
      id: 'assistant' as const,
      label: 'Conversation Assistant',
      description: 'Collaborate with AI to draft your document step-by-step.',
      icon: Bot,
    },
    {
      id: 'direct' as const,
      label: 'Direct Generation',
      description: 'Fill in the details and generate a document instantly.',
      icon: FileText,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4 py-2">
      <p className="text-sm text-gray-500">
        How would you like to draft your document?
      </p>
      <div className="flex w-full gap-4">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => {
              if (currentMode === option.id) {
                setDraftingMode('select_mode');
              } else {
                setDraftingMode(option.id);
              }
            }}
            // disabled={!!currentMode}
            className={cn(
              'group relative flex flex-1 cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm backdrop-blur-sm transition-all',
              !currentMode &&
                'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white hover:shadow-md',
              currentMode && option.id === currentMode
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
                currentMode && option.id === currentMode
                  ? 'bg-black text-white'
                  : 'bg-gray-50 text-gray-500',
              )}
            >
              <option.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{option.label}</h3>
              <p className="text-xs text-gray-500">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
