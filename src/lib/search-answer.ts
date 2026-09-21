/**
 * Utility to extract a clean, direct, and accurate answer from Exa search results.
 * Filters out scraping hedges, meta-commentary, and repetitive source listings,
 * returning solely the direct answer text.
 */

const HEDGE_LINE_PATTERNS = [
  /depends on the (current )?date/i,
  /which isn't provided/i,
  /not provided here/i,
  /please share/i,
  /if you('d| would) like/i,
  /i can (parse|fetch|provide)/i,
  /i cannot (determine|find)/i,
  /here's what the .+ shows:?/i,
  /the page lists/i,
  /the schedule excerpt includes/i,
  /according to the (page|website|schedule|article)/i,
  /for more details,/i,
];

/**
 * Checks if a block of text is conversational filler or scraping hedge.
 */
function isHedgeLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  return HEDGE_LINE_PATTERNS.some(pattern => pattern.test(trimmed));
}

/**
 * Cleans conversational and scraping noise from a summary text.
 */
function cleanSummaryText(text: string): string {
  if (!text) return '';

  // Split into lines or bullet points
  const lines = text
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean);

  const cleanLines = lines.filter(line => !isHedgeLine(line));

  return cleanLines.join('\n').trim();
}

/**
 * Extracts the single most direct and accurate answer for a query.
 */
export function extractDirectSearchAnswer(
  query: string,
  results: Array<{ summary?: string; title?: string; url?: string }>,
): string {
  if (!results || results.length === 0) {
    return 'No results found.';
  }

  // Tokenize query words for relevance ranking
  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['when', 'what', 'where', 'which', 'who', 'how', 'the', 'is', 'are', 'was', 'for'].includes(w));

  interface ScoredCandidate {
    text: string;
    score: number;
  }

  const scoredCandidates: ScoredCandidate[] = [];

  for (const item of results) {
    if (!item.summary) continue;

    // First check paragraphs or sentences within the summary
    const cleaned = cleanSummaryText(item.summary);
    if (!cleaned) continue;

    const paragraphs = cleaned.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    for (const para of paragraphs) {
      if (isHedgeLine(para)) continue;

      const lowerPara = para.toLowerCase();

      let score = 0;

      // Query term matches
      for (const term of queryTerms) {
        if (lowerPara.includes(term)) {
          score += 5;
        }
      }

      // Bonus for direct answer phrasing matching query intent
      if (
        /next\s+[\w\s]+\s+game:/i.test(para) ||
        /is scheduled for/i.test(para) ||
        /will take place on/i.test(para) ||
        /starts at/i.test(para) ||
        /(sunday|monday|tuesday|wednesday|thursday|friday|saturday),\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(para)
      ) {
        score += 15;
      }

      // Heavily penalize bullet dumps or lists of all weeks
      if ((para.match(/\n/g) || []).length > 3) {
        score -= 5;
      }
      if (/week 1:[\s\S]+week 2:/i.test(para) || /preseason:[\s\S]+regular/i.test(para)) {
        score -= 10;
      }

      // Concise direct answers (10 to 60 words) get preference over long articles
      const wordCount = para.split(/\s+/).length;
      if (wordCount >= 5 && wordCount <= 40) {
        score += 8;
      } else if (wordCount > 100) {
        score -= 4;
      }

      if (score > 0) {
        // Strip leading redundant introductory phrases
        let directText = para
          .replace(/^(as of (today|now)|according to [^,]+,|the official schedule confirms that)\s*/i, '')
          .trim();

        // Capitalize first letter
        if (directText.length > 0) {
          directText = directText.charAt(0).toUpperCase() + directText.slice(1);
        }

        scoredCandidates.push({ text: directText, score });
      }
    }
  }

  // Sort by highest score first
  scoredCandidates.sort((a, b) => b.score - a.score);

  if (scoredCandidates.length > 0) {
    return scoredCandidates[0].text;
  }

  // Fallback: pick first cleaned summary without hedging
  for (const item of results) {
    if (item.summary) {
      const cleaned = cleanSummaryText(item.summary);
      if (cleaned) {
        return cleaned;
      }
    }
  }

  return results[0]?.summary || 'No direct answer found for this query.';
}
