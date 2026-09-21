'use server';

import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_NUM_RESULTS = parseInt(
  process.env.SPACE_SEARCH_NUM_RESULTS ||
    process.env.NEXT_PUBLIC_SPACE_SEARCH_NUM_RESULTS ||
    '8',
  10,
);

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

export interface SpaceSearchResult {
  exaId?: string;
  title?: string;
  url?: string;
  publishedDate?: string;
  summary?: string;
  image?: string;
  favicon?: string;
  [key: string]: unknown;
}

// A single query/results turn within a search session
export interface SpaceSearchTurn {
  id: string;
  _id?: string;
  searchSession?: string;
  query: string;
  numResults?: number;
  results?: SpaceSearchResult[];
  resultCount?: number;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

// A search session groups one or more turns (get-all-searches returns these)
export interface SpaceSearchSession {
  id: string;
  _id?: string;
  space?: string;
  user?: string;
  searches: SpaceSearchTurn[];
  lastSearchAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

async function getAuthHeader(
  tokenOverride?: string,
): Promise<Record<string, string>> {
  if (tokenOverride) {
    return { Authorization: `Bearer ${tokenOverride}` };
  }
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Unauthorized');
  }
  return { Authorization: `Bearer ${session.accessToken}` };
}

export async function createSpaceSearchAction(
  spaceId: string,
  query: string,
  searchSessionId?: string,
  tokenOverride?: string,
  userContext?: { timezone?: string; localDate?: string; localTime?: string },
): Promise<ApiResponse<SpaceSearchTurn>> {
  try {
    const authHeader = await getAuthHeader(tokenOverride);
    const response = await fetch(
      `${API_URL}/spaces/${spaceId}/searches/create-search`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          query,
          numResults: DEFAULT_NUM_RESULTS,
          systemInstruction:
            'HARD LAW: 1) TRUTH: Never guess, hallucinate, or assume. Deliver exclusively factual, truthful information grounded strictly in verified evidence. Zero bias, 100% truth. 2) PROPER AMERICAN ENGLISH: Write in impeccable, standard American English with flawless grammar, syntax, and punctuation, embodying the standards of an American English professor. 3) DIRECTNESS: State the answer directly with zero pleasantries, no conversational fluff, no hedging, and no label prefixes (never write "Summary:", "Answer:", etc.). 4) ONLY WHAT WAS ASKED: Answer ONLY the specific question asked and nothing else. Output exclusively the direct factual answer. Do not include unasked-for information, secondary details, player statistics, notes, or commentary (never write "Key note:", "Note:", etc.). Stop immediately once the exact question is answered. 5) SOURCES: Always ground your findings in authoritative, verifiable sources.',
          ...(searchSessionId ? { searchSessionId } : {}),
          ...(userContext || {}),
        }),
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to run search',
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || 'Search complete',
      data: result?.data ?? result,
    };
  } catch (error: any) {
    console.error('createSpaceSearchAction Error:', error);
    return { success: false, message: error.message || 'Failed to run search' };
  }
}

export async function getSpaceSearchesAction(
  spaceId: string,
): Promise<ApiResponse<SpaceSearchSession[]>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `${API_URL}/spaces/${spaceId}/searches/get-all-searches`,
      { headers: authHeader },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to fetch searches',
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || 'Success',
      data: result?.data ?? [],
    };
  } catch (error: any) {
    console.error('getSpaceSearchesAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch searches',
    };
  }
}
