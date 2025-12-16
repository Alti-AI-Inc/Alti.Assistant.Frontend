'use client';

import { useImageGenStore } from '@/stores/useImageGenStore';
import { Lightbulb } from 'lucide-react';

/**
 * Displays AI suggestions/questions for improving the prompt.
 * Shows suggestions stored in imageGenStore (NOT in main chat).
 * Suggestions are cleared when user submits new input.
 */
export function ImageGenSuggestions() {
  // Read directly from store
  const suggestions = useImageGenStore(state => state.suggestions);
  const missingElements = useImageGenStore(state => state.missingElements);
  const promptScore = useImageGenStore(state => state.promptScore);
  const workflow = useImageGenStore(state => state.workflow);

  // Only show if we have suggestions and are in collecting/confirming phase
  if (
    suggestions.length === 0 ||
    (workflow !== 'collecting' && workflow !== 'confirming')
  ) {
    return null;
  }

  return (
    <div className="mx-auto mb-4 w-full max-w-[750px] rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
          <Lightbulb className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            Understand better (Score: {promptScore}/100)
          </p>
          <p className="text-xs text-gray-500">
            Add more details to your prompt to get a better image.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-gray-700"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-medium text-amber-800">
              {index + 1}
            </span>
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>

      {/* {missingElements.length > 0 && (
        <div className="mt-3 border-t border-amber-200 pt-3">
          <p className="mb-1 text-xs font-medium text-gray-600">
            Missing elements:
          </p>
          <div className="flex flex-wrap gap-1">
            {missingElements.slice(0, 5).map((element, index) => (
              <span
                key={index}
                className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
              >
                {element}
              </span>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
