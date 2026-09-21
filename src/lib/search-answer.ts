import { isHarmfulContent, SAFETY_REFUSAL_MESSAGE } from './safety';

/**
 * Utility to extract a clean, direct, and accurate answer from Exa search results.
 * Filters out scraping hedges, meta-commentary, and repetitive source listings,
 * and converts UTC times to the user's local timezone.
 */

const HEDGE_LINE_PATTERNS = [
  /^[\*\#\-\s]*(?:summary|answer|direct answer|quick answer|overview|result|takeaway|key takeaway|response|notes)[\*\#\s]*[:\-]?\s*$/i,
  /\b(?:key\s*note|note|side\s*note|important\s*note|fun\s*fact|takeaway|key\s*takeaway|additional\s*note|fyi)\s*[:\-]/i,
  /\b(?:as an aside|worth noting that|it is worth noting|interesting fact|fun fact)\b/i,
  /^(?:the|this)\s+(?:page|website|article|site|link|document|hub|portal)\s+(?:is|serves as|provides|features|covers|contains|lists)\b/i,
  /\b(?:team hub|official home of|official site of|homepage of|landing page)\b/i,
  /\b(?:welcome to the official|visit the official)\b/i,
  /depends on the (current )?date/i,
  /which isn't provided/i,
  /not provided here/i,
  /please share/i,
  /if you('re| are) (asking|looking|wondering|referring)/i,
  /if you('d| would) like/i,
  /in the provided (page|text|document|excerpt|context|source|article)/i,
  /the provided (page|text|document|excerpt|context|source|article)/i,
  /from the provided/i,
  /based on the (provided|excerpt|page|source)/i,
  /according to the (page|website|schedule|article|provided|text|source)/i,
  /the (page|article|excerpt|website) (lists|shows|states|notes|reports|confirms|mentions)/i,
  /the final score shown is/i,
  /here's what the .+ shows:?/i,
  /the page lists/i,
  /the schedule excerpt includes/i,
  /for more details,/i,
  /please note that/i,
  /i can (parse|fetch|provide)/i,
  /i cannot (determine|find)/i,
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

const MAJOR_SPORTS_TEAMS: Record<string, { city: string; full: string }> = {
  // NFL
  bills: { city: 'Buffalo', full: 'Buffalo Bills' },
  dolphins: { city: 'Miami', full: 'Miami Dolphins' },
  patriots: { city: 'New England', full: 'New England Patriots' },
  jets: { city: 'New York', full: 'New York Jets' },
  ravens: { city: 'Baltimore', full: 'Baltimore Ravens' },
  bengals: { city: 'Cincinnati', full: 'Cincinnati Bengals' },
  browns: { city: 'Cleveland', full: 'Cleveland Browns' },
  steelers: { city: 'Pittsburgh', full: 'Pittsburgh Steelers' },
  texans: { city: 'Houston', full: 'Houston Texans' },
  colts: { city: 'Indianapolis', full: 'Indianapolis Colts' },
  jaguars: { city: 'Jacksonville', full: 'Jacksonville Jaguars' },
  titans: { city: 'Tennessee', full: 'Tennessee Titans' },
  broncos: { city: 'Denver', full: 'Denver Broncos' },
  chiefs: { city: 'Kansas City', full: 'Kansas City Chiefs' },
  raiders: { city: 'Las Vegas', full: 'Las Vegas Raiders' },
  chargers: { city: 'Los Angeles', full: 'Los Angeles Chargers' },
  cowboys: { city: 'Dallas', full: 'Dallas Cowboys' },
  giants: { city: 'New York', full: 'New York Giants' },
  eagles: { city: 'Philadelphia', full: 'Philadelphia Eagles' },
  commanders: { city: 'Washington', full: 'Washington Commanders' },
  bears: { city: 'Chicago', full: 'Chicago Bears' },
  lions: { city: 'Detroit', full: 'Detroit Lions' },
  packers: { city: 'Green Bay', full: 'Green Bay Packers' },
  vikings: { city: 'Minnesota', full: 'Minnesota Vikings' },
  falcons: { city: 'Atlanta', full: 'Atlanta Falcons' },
  panthers: { city: 'Carolina', full: 'Carolina Panthers' },
  saints: { city: 'New Orleans', full: 'New Orleans Saints' },
  buccaneers: { city: 'Tampa Bay', full: 'Tampa Bay Buccaneers' },
  bucs: { city: 'Tampa Bay', full: 'Tampa Bay Buccaneers' },
  cardinals: { city: 'Arizona', full: 'Arizona Cardinals' },
  rams: { city: 'Los Angeles', full: 'Los Angeles Rams' },
  '49ers': { city: 'San Francisco', full: 'San Francisco 49ers' },
  seahawks: { city: 'Seattle', full: 'Seattle Seahawks' },

  // NBA
  celtics: { city: 'Boston', full: 'Boston Celtics' },
  knicks: { city: 'New York', full: 'New York Knicks' },
  warriors: { city: 'Golden State', full: 'Golden State Warriors' },
  lakers: { city: 'Los Angeles', full: 'Los Angeles Lakers' },
  bulls: { city: 'Chicago', full: 'Chicago Bulls' },
  heat: { city: 'Miami', full: 'Miami Heat' },
  bucks: { city: 'Milwaukee', full: 'Milwaukee Bucks' },
  suns: { city: 'Phoenix', full: 'Phoenix Suns' },
  mavericks: { city: 'Dallas', full: 'Dallas Mavericks' },
  mavs: { city: 'Dallas', full: 'Dallas Mavericks' },
  nuggets: { city: 'Denver', full: 'Denver Nuggets' },
  clippers: { city: 'Los Angeles', full: 'Los Angeles Clippers' },
};

/**
 * Normalizes sports team nicknames to their full formal name (e.g., "The Bills beat" -> "The Buffalo Bills beat").
 */
export function normalizeSportsTeamNames(text: string): string {
  if (!text) return '';
  let res = text;
  const sportsVerbs =
    '(?:beat|beats|defeated|defeats|edged|edges|lost to|fell to|won against|won over|topped)';

  for (const [nickname, meta] of Object.entries(MAJOR_SPORTS_TEAMS)) {
    // Subject position: "The Bills beat" or "Bills beat"
    const subjectRegex = new RegExp(
      `\\b(?:The\\s+)?(?<!${meta.city}\\s+)${nickname}\\s+(${sportsVerbs})\\b`,
      'gi',
    );
    res = res.replace(subjectRegex, `The ${meta.full} $1`);

    // Object position: "beat the Lions" or "beat Lions"
    const objectRegex = new RegExp(
      `\\b(${sportsVerbs})\\s+(?:the\\s+)?(?<!${meta.city}\\s+)${nickname}\\b`,
      'gi',
    );
    res = res.replace(objectRegex, `$1 the ${meta.full}`);

    // Fall to / Lost to: "fell to (the) Bills"
    const fellToRegex = new RegExp(
      `\\b(fell to|lost to)\\s+(?:the\\s+)?(?<!${meta.city}\\s+)${nickname}\\b`,
      'gi',
    );
    res = res.replace(fellToRegex, `$1 the ${meta.full}`);
  }

  return res;
}

/**
 * Strips inline scraping artifacts, meta-commentary, and conversational filler from text.
 */
export function stripInlineFluff(text: string): string {
  if (!text) return '';
  return text
    // Strip trailing note clauses e.g. ". Key note: ...", "; note: ...", "- note: ..."
    .replace(
      /\s*(?:[\.\;\,\-]\s*)?(?:key\s*note|note|side\s*note|important\s*note|fun\s*fact|takeaway|key\s*takeaway|additional\s*note|fyi)\s*[:\-].*$/i,
      '.',
    )
    // Strip inline note statements
    .replace(
      /\b(?:key\s*note|note|side\s*note|important\s*note|fun\s*fact|takeaway|key\s*takeaway|additional\s*note|fyi)\s*[:\-][^.]*(?:\.|$)/gi,
      '',
    )
    .replace(
      /^[\*\#\-\s]*(?:summary|answer|direct answer|quick answer|overview|result|takeaway|key takeaway|response|key points)[\*\#\s]*[:\-]+[\*\#\s]*/gi,
      '',
    )
    .replace(
      /(?:^|\n)[\*\#\-\s]*(?:summary|answer|direct answer|quick answer|overview|result|takeaway|key takeaway|response|key points)[\*\#\s]*[:\-]+[\*\#\s]*/gi,
      '\n',
    )
    .replace(
      /^(?:in summary,?\s*|to summarize,?\s*|in conclusion,?\s*|overall,?\s*|essentially,?\s*|basically,?\s*|sure,?\s*|certainly,?\s*|here(?:'s| is) (?:what|the answer:?|the information:?|the details:?)|to answer your question:?|hey boss,?\s*(?:i found the answer for you:?)?|disclaimer:\s*|update:\s*|correction:\s*)\s*/gi,
      '',
    )
    .replace(
      /\s*(?:,\s*)?(?:in|from|based on|according to)\s+the\s+provided\s+(?:page|text|document|excerpt|source|link|article|data)[^.,;]*/gi,
      '',
    )
    .replace(
      /\s*(?:,\s*)?(?:for more (?:information|details)|to learn more|read more at|find out more)[^.,;]*(?:\.|$)/gi,
      '.',
    )
    .replace(
      /\s*(?:,\s*)?according to (?:the official schedule|the page|the website|sources|search results)[^.,;]*/gi,
      '',
    )
    .replace(
      /^(?:as of (?:today|now)|according to [^,]+,|the official schedule confirms that|based on (?:our|the) (?:search|results|records|data),?)\s*/gi,
      '',
    )
    .replace(
      /^if you(?:'re| are) (?:asking|looking|wondering|referring|seeking) (?:about|for|to) [^,]+,\s*/gi,
      '',
    )
    .replace(
      /^(?:the final score shown is|the score shown is|the final score is)\s*/gi,
      '',
    )
    .replace(/\s*,\s*the final score shown is\s*/gi, ', final score: ')
    .replace(
      /^(?:according to\s+(?:the\s+)?(?:game\s+recap|recap|report|story),?\s*)/gi,
      '',
    )
    .replace(
      /\s*(?:,\s*)?(?:in|from|per|during|according to|as reported in|as stated in|as seen in)\s+(?:the\s+|this\s+)?(?:game\s+recap|recap|box\s*score|game\s+summary|game\s+story|post-game\s+recap|article|news\s+report|report|story|post|coverage|press\s+release)[^.,;!?]*/gi,
      '',
    )
    .replace(
      /\s*(?:in|from|per|during)\s+(?:the\s+|this\s+)?(?:game\s+recap|recap|box\s*score|game\s+summary|game\s+story|post-game\s+recap|article|news\s+report|report|story|post)\s*(?=[.,;!?]|$)/gi,
      '',
    )
    .replace(/\b(?:game\s+recap|box\s*score|game\s+summary)\b/gi, '')
    .trim();
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
 * Cleans conversational and scraping noise from a summary text sentence-by-sentence.
 */
function cleanSummaryText(text: string): string {
  if (!text) return '';

  const paragraphs = text
    .split(/\n+/)
    .map(l => l.trim())
    .filter(Boolean);

  const cleanSentences: string[] = [];

  for (const para of paragraphs) {
    const sentences = para
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/g)
      .map(s => s.trim())
      .filter(Boolean);

    for (const sent of sentences) {
      if (isHedgeLine(sent) || isHarmfulContent(sent)) continue;
      const stripped = stripInlineFluff(sent);
      if (
        stripped &&
        !isHedgeLine(stripped) &&
        !isHarmfulContent(stripped)
      ) {
        cleanSentences.push(stripped);
      }
    }
  }

  return cleanSentences.join(' ').trim();
}

/**
 * Extracts the single most direct and accurate answer for a query, formatted to the user's local timezone.
 */
export function extractDirectSearchAnswer(
  query: string,
  results: Array<{ summary?: string; title?: string; url?: string }>,
  targetTimeZone?: string,
): string {
  if (isHarmfulContent(query)) {
    return SAFETY_REFUSAL_MESSAGE;
  }

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

  const isScoreQuery =
    /\b(score|scores|beat|won|lost|win|loss|winner|final|result|results|outcome)\b/i.test(
      query,
    );
  const isScheduleQuery =
    /\b(when|next|schedule|time|date|upcoming|kickoff|start|playing)\b/i.test(
      query,
    );
  const isPriceQuery =
    /\b(price|cost|worth|stock|valuation|market cap|quote)\b/i.test(query);
  const isPersonQuery =
    /\b(who|ceo|founder|coach|quarterback|president|player|author|leader)\b/i.test(
      query,
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

      // Boost primary authority domains (official leagues, official teams, .gov, .edu, primary news wires)
      const urlLower = (item.url || '').toLowerCase();
      if (
        /\.gov\b|\.edu\b/.test(urlLower) ||
        /official|nfl\.com|espn\.com|detroitlions\.com|mlb\.com|nba\.com|nhl\.com|cbssports\.com|foxsports\.com|theathletic\.com|si\.com|reuters\.com|bloomberg\.com|apnews\.com|wsj\.com|sec\.gov|cdc\.gov|weather\.gov/i.test(
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
        score -= 15;
      }

      // Heavily penalize page descriptions / hubs
      if (
        /^(?:the|this)\s+(?:page|website|article|site|hub|portal)\b/i.test(para) ||
        /\b(?:team hub|official home of|official site of)\b/i.test(para)
      ) {
        score -= 50;
      }

      // Query Intent: Score / Game Outcome
      if (isScoreQuery) {
        const hasScorePattern = /\b\d{1,3}\s*[-–—]\s*\d{1,3}\b/.test(para);
        const hasOutcomeVerb =
          /\b(beat|defeated|won|lost|loss|victory|edged|fell to)\b/i.test(para);

        if (hasScorePattern && hasOutcomeVerb) {
          score += 40;
        } else if (hasScorePattern || hasOutcomeVerb) {
          score += 20;
        } else {
          score -= 25;
        }
      }

      // Query Intent: Schedule / Next Game
      if (isScheduleQuery) {
        if (
          /next\s+[\w\s]+\s+game:/i.test(para) ||
          /is scheduled for/i.test(para) ||
          /will take place on/i.test(para) ||
          /will play/i.test(para) ||
          /starts at/i.test(para) ||
          /(sunday|monday|tuesday|wednesday|thursday|friday|saturday),\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(
            para,
          )
        ) {
          score += 35;
        } else {
          score -= 15;
        }
      }

      // Query Intent: Price / Stock Valuation
      if (isPriceQuery) {
        if (/\$\s*\d+(?:\.\d+)?|\b\d+(?:\.\d+)?\s*(?:usd|dollars|cents)\b/i.test(para)) {
          score += 35;
        } else {
          score -= 15;
        }
      }

      // Query Intent: Personnel / Leadership
      if (isPersonQuery) {
        if (/\b(?:is the|serves as|coached by|plays for|founded by|named)\b/i.test(para)) {
          score += 25;
        }
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

      // Concise direct answers (5 to 40 words) get preference
      const wordCount = para.split(/\s+/).length;
      if (wordCount >= 5 && wordCount <= 40) {
        score += 8;
      } else if (wordCount > 100) {
        score -= 6;
      }

      if (score > 0) {
        let directText = stripInlineFluff(para);

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

    let cleaned = stripInlineFluff(rawText)
      .replace(
        /^[\*\#\-\s]*(?:summary|answer|direct answer|quick answer|overview|result|takeaway|key takeaway|response|key points)[\*\#\s]*[:\-]+[\*\#\s]*/gi,
        '',
      )
      .replace(/^[:\-\*\#\s]+/, '')
      .trim();

    // Deduplicate and filter sentences to eliminate residual fluff, notes, and unasked-for commentary
    const validSentences = cleaned
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/g)
      .map(s => s.trim())
      .filter(Boolean)
      .filter(s => !isHedgeLine(s))
      .map(s => stripInlineFluff(s))
      .filter(s => s.trim().length > 0 && !isHedgeLine(s));

    if (validSentences.length > 0) {
      // If the primary sentence has >= 6 words, it constitutes the direct answer.
      // Strictly avoid appending secondary sentences to prevent unasked-for information, stats, or notes.
      const firstSentence = validSentences[0];
      const wordCount = firstSentence.split(/\s+/).length;

      if (wordCount >= 6) {
        cleaned = firstSentence;
      } else if (validSentences.length > 1) {
        const secondSentence = validSentences[1];
        if (
          !isHedgeLine(secondSentence) &&
          !/\b(?:note|additionally|furthermore|moreover|also|he also|they also)\b/i.test(secondSentence)
        ) {
          cleaned = `${firstSentence} ${secondSentence}`;
        } else {
          cleaned = firstSentence;
        }
      } else {
        cleaned = firstSentence;
      }
    }

    // Final clean of any residual leading label, note clause, or punctuation
    cleaned = stripInlineFluff(cleaned)
      .replace(
        /^[\*\#\-\s]*(?:summary|answer|direct answer|quick answer|overview|result|takeaway|key takeaway|response|key points)[\*\#\s]*[:\-]+[\*\#\s]*/gi,
        '',
      )
      .replace(/^[:\-\*\#\s]+/, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([,.:;!?])/g, '$1')
      .replace(/([,.:;!?])([A-Za-z])/g, '$1 $2')
      .replace(/[,;:\-\s]+$/, '')
      .trim();

    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      if (!/[.!?]$/.test(cleaned)) {
        cleaned += '.';
      }
    }

    const normalized = normalizeSportsTeamNames(cleaned);
    const localConverted = convertUtcToLocalTimezone(normalized, timeZone);
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
