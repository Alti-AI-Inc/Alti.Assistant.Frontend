'use server';

import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_NUM_RESULTS = parseInt(
  process.env.SPACE_SEARCH_NUM_RESULTS ||
    process.env.NEXT_PUBLIC_SPACE_SEARCH_NUM_RESULTS ||
    '5',
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

async function getAuthHeader(): Promise<Record<string, string>> {
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
): Promise<ApiResponse<SpaceSearchTurn>> {
  try {
    const authHeader = await getAuthHeader();
    const response = await fetch(
      `${API_URL}/spaces/${spaceId}/searches/create-search`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({
          query,
          numResults: DEFAULT_NUM_RESULTS,
          ...(searchSessionId ? { searchSessionId } : {}),
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
