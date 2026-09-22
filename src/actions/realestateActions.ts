'use server';

import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

const getHeaders = (accessToken: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${accessToken}`,
});

const makeRealEstateRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' = 'POST',
  data?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const session = await auth();
    const accessToken = (session as any)?.accessToken;
    
    if (!accessToken) {
      return { success: false, message: 'Unauthorized', statusCode: 401 };
    }

    const options: RequestInit = {
      method,
      headers: getHeaders(accessToken),
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}/realestateapi/${endpoint}`, options);
    
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || result?.error || 'Request failed',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result?.message || 'Success',
      data: result?.data,
    };
  } catch (error: any) {
    console.error(`[RealEstateAction] Error calling ${endpoint}:`, error);
    return {
      success: false,
      message: error.message || 'Internal server error',
      statusCode: 500,
    };
  }
};

// V2 Endpoints
export const propertySearch = (data: any) => makeRealEstateRequest('property-search', 'POST', data);
export const propertyDetail = (data: any) => makeRealEstateRequest('property-detail', 'POST', data);
export const propertyDetailBulk = (data: any) => makeRealEstateRequest('property-detail-bulk', 'POST', data);
export const propertyAvmBulk = (data: any) => makeRealEstateRequest('property-avm-bulk', 'POST', data);
export const mlsSearch = (data: any) => makeRealEstateRequest('mls-search', 'POST', data);
export const mlsDetail = (data: any) => makeRealEstateRequest('mls-detail', 'POST', data);
export const propertyAvm = (data: any) => makeRealEstateRequest('property-avm', 'POST', data);
export const propertyComps = (data: any) => makeRealEstateRequest('property-comps', 'POST', data);
export const skipTrace = (data: any) => makeRealEstateRequest('skip-trace', 'POST', data);
export const skipTraceBatch = (data: any) => makeRealEstateRequest('skip-trace-batch', 'POST', data);
export const skipTraceBatchAwait = (data: any) => makeRealEstateRequest('skip-trace-batch-await', 'POST', data);
export const involuntaryLien = (data: any) => makeRealEstateRequest('involuntary-lien', 'POST', data);
export const propertyLiens = (data: any) => makeRealEstateRequest('property-liens', 'POST', data);
export const demographics = (data: any) => makeRealEstateRequest('demographics', 'POST', data);
export const autocomplete = (data: any) => makeRealEstateRequest('autocomplete', 'POST', data);
export const addressVerification = (data: any) => makeRealEstateRequest('address-verification', 'POST', data);
export const csvBuilder = (data: any) => makeRealEstateRequest('csv-builder', 'POST', data);
export const changeFiles = (data: any) => makeRealEstateRequest('change-files', 'POST', data);
export const mlsPropertyMappingV2 = (data: any) => makeRealEstateRequest('mls-property-mapping', 'POST', data);
export const keyInfo = () => makeRealEstateRequest('key-info', 'GET');

// V3 Endpoints
export const mlsSearchV3 = (data: any) => makeRealEstateRequest('v3/mls-search', 'POST', data);
export const mlsDetailV3 = (data: any) => makeRealEstateRequest('v3/mls-detail', 'POST', data);
export const mlsDetailBulkV3 = (data: any) => makeRealEstateRequest('v3/mls-detail-bulk', 'POST', data);
export const mlsAutocompleteV3 = (data: any) => makeRealEstateRequest('v3/mls-autocomplete', 'POST', data);
export const propertyCompsV3 = (data: any) => makeRealEstateRequest('v3/property-comps', 'POST', data);
export const mlsBoardCoverage = (data: any) => makeRealEstateRequest('v3/mls-board-coverage', 'POST', data);
export const mlsPropertyMappingV3 = (data: any) => makeRealEstateRequest('v3/mls-property-mapping', 'POST', data);

// V1 / Portfolio Endpoints
export const propertyParcel = (data: any) => makeRealEstateRequest('v1/property-parcel', 'POST', data);
export const savedSearchCreate = (data: any) => makeRealEstateRequest('v1/saved-search/create', 'POST', data);
export const savedSearchRetrieve = (data: any) => makeRealEstateRequest('v1/saved-search/retrieve', 'POST', data);
export const savedSearchList = (data: any) => makeRealEstateRequest('v1/saved-search/list', 'POST', data);
export const savedSearchUpdate = (data: any) => makeRealEstateRequest('v1/saved-search/update', 'POST', data);
export const savedSearchDelete = (data: any) => makeRealEstateRequest('v1/saved-search/delete', 'POST', data);
