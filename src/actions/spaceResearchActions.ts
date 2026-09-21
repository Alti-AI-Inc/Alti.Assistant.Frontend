'use server';

import { auth } from '@/auth';
import { HARD_LAW_SYSTEM_INSTRUCTION } from '@/lib/safety';

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

export interface SpaceResearchResult {
  id?: string;
  exaId?: string;
  title?: string;
  url?: string;
  publishedDate?: string;
  summary?: string;
  image?: string;
  favicon?: string;
  [key: string]: unknown;
}

export interface SpaceResearchTurn {
  id: string;
  _id?: string;
  searchSession?: string;
  query: string;
  searchType?: string;
  requestParams?: Record<string, unknown>;
  results?: SpaceResearchResult[];
  resultCount?: number;
  rawResponse?: Record<string, unknown> | null;
  resolvedSearchType?: string;
  requestId?: string;
  costDollars?: Record<string, unknown> | null;
  status?: string;
  isFavorite?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface SpaceResearchSession {
  id: string;
  _id?: string;
  space?: string;
  user?: string;
  searches: SpaceResearchTurn[];
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

const normalizeSession = (
  session: Partial<SpaceResearchSession> | null | undefined,
): SpaceResearchSession | null => {
  if (!session) {
    return null;
  }

  const id = session.id || session._id;
  if (!id) {
    return null;
  }

  return {
    id,
    _id: session._id || id,
    space: session.space,
    user: session.user,
    searches: Array.isArray(session.searches) ? session.searches : [],
    lastSearchAt: session.lastSearchAt,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
};

export async function createSpaceResearchAction(
  spaceId: string,
  query: string,
  searchSessionId?: string,
  tokenOverride?: string,
  userContext?: { timezone?: string; localDate?: string; localTime?: string },
): Promise<ApiResponse<SpaceResearchTurn>> {
  try {
    const authHeader = await getAuthHeader(tokenOverride);
    const response = await fetch(
      `${API_URL}/spaces/${spaceId}/deep-research/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          query,
          numResults: DEFAULT_NUM_RESULTS,
          ...(searchSessionId ? { searchSessionId } : {}),
          ...(userContext || {}),
        }),
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to run research',
        statusCode: response.status,
      };
    }
    return {
      success: true,
      message: result?.message || 'Research complete',
      data: result?.data ?? result,
    };
  } catch (error: any) {
    console.error('createSpaceResearchAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to run research',
    };
  }
}

export async function getSpaceResearchSessionsAction(
  spaceId: string,
): Promise<ApiResponse<SpaceResearchSession[]>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `${API_URL}/spaces/${spaceId}/deep-research/get-all`,
      {
        headers: authHeader,
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to fetch research sessions',
        statusCode: response.status,
      };
    }

    const sessions = Array.isArray(result?.data)
      ? result.data
          .map((session: Partial<SpaceResearchSession>) =>
            normalizeSession(session),
          )
          .filter(Boolean)
      : [];

    return {
      success: true,
      message: result?.message || 'Success',
      data: sessions as SpaceResearchSession[],
    };
  } catch (error: any) {
    console.error('getSpaceResearchSessionsAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch research sessions',
    };
  }
}

export async function getSpaceResearchSessionByIdAction(
  spaceId: string,
  sessionId: string,
): Promise<ApiResponse<SpaceResearchSession>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `${API_URL}/spaces/${spaceId}/deep-research/by-id/${sessionId}`,
      { headers: authHeader },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || 'Failed to fetch research session',
        statusCode: response.status,
      };
    }

    const session = normalizeSession(result?.data ?? result);

    if (!session) {
      return {
        success: false,
        message: 'Research session payload was empty',
      };
    }

    return {
      success: true,
      message: result?.message || 'Success',
      data: session,
    };
  } catch (error: any) {
    console.error('getSpaceResearchSessionByIdAction Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch research session',
    };
  }
}
