'use client';
import React from 'react';
import InlineCitation from './InlineCitation';

interface Reference {
  title?: string;
  url?: string;
  snippet?: string;
  source?: string;
}

/**
 * Post-processes markdown content to inject InlineCitation components
 * for patterns like [1], [2], etc. at the END of sentences.
 * Returns an array of React nodes.
 */
export function renderContentWithCitations(
  content: string,
  references: Reference[]
): React.ReactNode[] {
  if (!references?.length || !content) return [content];

  // Match citation patterns like [1], [2], [1,2], [1][2]
  const citationRegex = /\[(\d+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = citationRegex.exec(content)) !== null) {
    const idx = parseInt(match[1], 10);
    const ref = references[idx - 1]; // citations are 1-indexed

    // Push text before this citation
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    // Push the citation badge
    if (ref) {
      parts.push(
        <InlineCitation
          key={`cite-${match.index}-${idx}`}
          index={idx}
          title={ref.title}
          url={ref.url}
          snippet={ref.snippet}
          source={ref.source}
        />
      );
    } else {
      // No matching reference, render as plain text
      parts.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}
