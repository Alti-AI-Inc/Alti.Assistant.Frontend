/**
 * Utility to extract a clean, direct, and accurate answer from Exa search results.
 * Filters out scraping hedges, meta-commentary, and repetitive source listings,
 * and converts UTC times to the user's local timezone.
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
  /\b(it is believed|it is assumed|it might be|could potentially|rumored that|unverified claim|pure speculation)\b/i,
];

const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

function parseHoursMinutes(
  timeStr: string,
): { hours: number; minutes: number } | null {
  const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const ampm = match[3] ? match[3].toUpperCase() : null;
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
}

/**
 * Converts any UTC/GMT timestamps and date-times in the text into the user's local timezone.
 */
export function convertUtcToLocalTimezone(
  text: string,
  targetTimeZone: string,
): string {
  if (!text) return '';

  // 1. Full date + time + UTC/GMT: e.g. "Sunday, September 27, 5:00 PM UTC"
  const datePattern =
    /(?:(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s+)?(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,\s*(\d{4}))?(?:,\s*|\s+at\s+)(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*(?:UTC|GMT)\b/gi;

  let result = text.replace(
    datePattern,
    (match, weekday, monthName, day, year, timePart) => {
      try {
        const mIdx = MONTHS[monthName.toLowerCase()];
        const dNum = parseInt(day, 10);
        const yNum = year ? parseInt(year, 10) : new Date().getFullYear();
        const parsedTime = parseHoursMinutes(timePart);
        if (!parsedTime) return match;

        const d = new Date(
          Date.UTC(yNum, mIdx, dNum, parsedTime.hours, parsedTime.minutes),
        );
        if (isNaN(d.getTime())) return match;

        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: targetTimeZone,
          weekday: weekday ? 'long' : undefined,
          month: 'long',
          day: 'numeric',
          year: year ? 'numeric' : undefined,
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        });

        return formatter.format(d);
      } catch {
        return match;
      }
    },
  );

  // 2. Standalone time in UTC/GMT: e.g. "5:00 PM UTC", "17:00 UTC", "5 PM UTC"
  const standaloneTimePattern =
    /\b(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*(?:UTC|GMT)\b/gi;
  result = result.replace(standaloneTimePattern, (match, timeStr) => {
    try {
      const parsedTime = parseHoursMinutes(timeStr);
      if (!parsedTime) return match;

      const now = new Date();
      const d = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          parsedTime.hours,
          parsedTime.minutes,
        ),
      );
      if (isNaN(d.getTime())) return match;

      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: targetTimeZone,
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      return formatter.format(d);
    } catch {
      return match;
    }
  });

  return result;
}

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

  const lines = text
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean);

  const cleanLines = lines.filter(line => !isHedgeLine(line));

  return cleanLines.join('\n').trim();
}

/**
 * Extracts the single most direct and accurate answer for a query, formatted to the user's local timezone.
 */
export function extractDirectSearchAnswer(
  query: string,
  results: Array<{ summary?: string; title?: string; url?: string }>,
  targetTimeZone?: string,
): string {
  if (!results || results.length === 0) {
    return 'No results found.';
  }

  const timeZone =
    targetTimeZone ||
    (typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'America/New_York');

  // Tokenize query words for relevance ranking
  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(
      w =>
        w.length > 2 &&
        ![
          'when',
          'what',
          'where',
          'which',
          'who',
          'how',
          'the',
          'is',
          'are',
          'was',
          'for',
        ].includes(w),
    );

  interface ScoredCandidate {
    text: string;
    score: number;
  }

  const scoredCandidates: ScoredCandidate[] = [];

  for (const item of results) {
    if (!item.summary) continue;

    const cleaned = cleanSummaryText(item.summary);
    if (!cleaned) continue;

    const paragraphs = cleaned
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean);

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

      // Boost primary authority domains (official leagues, .gov, .edu, primary news wires)
      const urlLower = (item.url || '').toLowerCase();
      if (
        /\.gov\b|\.edu\b/.test(urlLower) ||
        /official|nfl\.com|mlb\.com|nba\.com|nhl\.com|reuters\.com|bloomberg\.com|apnews\.com|wsj\.com|sec\.gov|cdc\.gov|weather\.gov/i.test(
          urlLower,
        )
      ) {
        score += 10;
      }

      // Factual certainty bonus vs speculation penalty
      if (/\b(official|confirmed|scheduled|announced|record|verified)\b/i.test(para)) {
        score += 6;
      }
      if (/\b(rumor|rumored|might be|could possibly|unconfirmed|speculation|guess)\b/i.test(para)) {
        score -= 12;
      }

      // Bonus for direct answer phrasing matching query intent
      if (
        /next\s+[\w\s]+\s+game:/i.test(para) ||
        /is scheduled for/i.test(para) ||
        /will take place on/i.test(para) ||
        /starts at/i.test(para) ||
        /(sunday|monday|tuesday|wednesday|thursday|friday|saturday),\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(
          para,
        )
      ) {
        score += 15;
      }

      // Heavily penalize bullet dumps or lists of all weeks
      if ((para.match(/\n/g) || []).length > 3) {
        score -= 5;
      }
      if (
        /week 1:[\s\S]+week 2:/i.test(para) ||
        /preseason:[\s\S]+regular/i.test(para)
      ) {
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
        let directText = para
          .replace(
            /^(as of (today|now)|according to [^,]+,|the official schedule confirms that)\s*/i,
            '',
          )
          .trim();

        if (directText.length > 0) {
          directText = directText.charAt(0).toUpperCase() + directText.slice(1);
        }

        scoredCandidates.push({ text: directText, score });
      }
    }
  }

  // Sort by highest score first
  scoredCandidates.sort((a, b) => b.score - a.score);

  const formatDirectAnswer = (rawText: string): string => {
    if (!rawText || rawText.trim().length === 0) {
      return 'No direct record found for this query.';
    }

    let cleaned = rawText
      .replace(
        /^(hey boss,?\s*(i found the answer for you:?)?|here('s| is) (what|the answer:?)|to answer your question:?)\s*/i,
        '',
      )
      .replace(/^[:\-\s]+/, '')
      .trim();

    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    const localConverted = convertUtcToLocalTimezone(cleaned, timeZone);
    return localConverted || 'No direct record found for this query.';
  };

  // HARD LAW: Deliver only verified factual records. Never guess or hallucinate.
  if (scoredCandidates.length > 0 && scoredCandidates[0].score >= 5) {
    return formatDirectAnswer(scoredCandidates[0].text);
  }

  // Fallback: pick first verified clean summary without hedging
  for (const item of results) {
    if (item.summary) {
      const cleaned = cleanSummaryText(item.summary);
      if (cleaned && !isHedgeLine(cleaned)) {
        return formatDirectAnswer(cleaned);
      }
    }
  }

  return 'No verified factual record found for this query.';
}
