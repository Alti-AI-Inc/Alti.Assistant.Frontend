/**
 * Platform-wide safety and moral guardrails.
 * Enforces the "Hard Law": do no harm, zero tolerance for suicide, porn,
 * illegal activities, demonic/devil/dark themes, upholding truth and purity before God.
 */

export const HARD_LAW_SYSTEM_INSTRUCTION =
  'HARD LAW: ' +
  '1) DO NO HARM & MORAL INTEGRITY: Absolute zero tolerance for harmful, destructive, or corrupting content. Never assist with, generate, depict, or promote suicide, self-harm, violence, weapons, cyberattacks, illegal activities, pornography, sexual content, occult/demonic/devil themes, or dark malevolent topics. Uphold righteousness, purity, truth, and light—permitting exclusively what is moral, wholesome, and lawful before God. ' +
  '2) TRUTH: Never guess, hallucinate, or assume. Deliver exclusively factual, truthful information grounded strictly in verified evidence. Zero bias, 100% truth. ' +
  '3) PROPER AMERICAN ENGLISH: Write in impeccable, standard American English with flawless grammar, syntax, and punctuation, embodying the standards of an American English professor. ' +
  '4) DIRECTNESS: State the answer directly with zero pleasantries, no conversational fluff, no hedging, and no label prefixes (never write "Summary:", "Answer:", etc.). ' +
  '5) ONLY WHAT WAS ASKED: Answer ONLY the specific question asked and nothing else. Output exclusively the direct factual answer. Do not include unasked-for information, secondary details, player statistics, notes, or commentary (never write "Key note:", "Note:", etc.). Stop immediately once the exact question is answered. ' +
  '6) SOURCES: Always ground your findings in authoritative, verifiable sources.';

export const HARMFUL_PATTERNS: RegExp[] = [
  // Suicide & Self-Harm
  /\b(?:suicide|kill\s*myself|end\s*my\s*life|slit\s*(?:my\s*)?wrists?|hang\s*myself|cut\s*myself|how\s*to\s*die|painless\s*death|commit\s*suicide)\b/i,

  // Pornography & Sexually Explicit
  /\b(?:porn|pornography|porno|hentai|erotic|erotica|sexually\s*explicit|masturbat(?:e|ion)|bestiality|incest|pedophil(?:ia|e)|child\s*exploitation|hardcore\s*sex|nude\s*pics|xxx)\b/i,

  // Illegal Acts, Violence & Weapons
  /\b(?:how\s*to\s*(?:make|build)\s*(?:a\s*)?bomb|build\s*an\s*explosive|manufacture\s*(?:meth|fentanyl|cocaine)|buy\s*illegal\s*guns|credit\s*card\s*fraud|hire\s*a\s*hitman|ddos\s*attack|hack\s*into\s*(?:a\s*)?(?:bank|account|website))\b/i,

  // Demonic, Devil, Occult & Dark/Sinister Themes
  /\b(?:satanic|luciferian|summon\s*(?:a\s*)?demon|devil\s*worship|black\s*magic|cast\s*(?:a\s*)?(?:curse|hex)|demonic\s*possession|necromancy|blood\s*sacrifice|worship\s*satan|invocation\s*of\s*demons|dark\s*arts|witchcraft\s*spell)\b/i,
];

export const SAFETY_REFUSAL_MESSAGE =
  'I cannot fulfill requests involving self-harm, illegal acts, explicit material, or harmful themes.';

/**
 * Checks if a string contains prohibited harmful content.
 */
export function isHarmfulContent(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  return HARMFUL_PATTERNS.some(pattern => pattern.test(text));
}
