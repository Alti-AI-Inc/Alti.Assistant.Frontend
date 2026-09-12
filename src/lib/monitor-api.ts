import { apiClientJson, type ApiResponse } from '@/lib/api-client';
import {
  type MonitorCollection,
  type MonitorDetails,
  type MonitorMutationInput,
  type MonitorRunDetails,
  type MonitorRunSummary,
  type MonitorSummary,
} from '@/types/monitor';

type RequestOptions = {
  accessToken: string;
};

const MONITOR_API_BASE_URL = 'https://api.altihq.com/api/v1';
const MONITOR_API_PROXY_BASE_PATH = '/api/v1';

const withAuth = (
  { accessToken }: RequestOptions,
  init?: RequestInit,
): RequestInit => ({
  ...init,
  headers: {
    ...(init?.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  },
});

const sanitizeObject = (value?: Record<string, unknown> | null) => {
  if (!value || Object.keys(value).length === 0) {
    return undefined;
  }

  return value;
};

const normalizeMonitorSummary = (monitor: MonitorSummary): MonitorSummary => ({
  ...monitor,
  id: monitor.id || monitor._id || '',
});

const flattenMonitorCollections = (
  collections: MonitorCollection[] | MonitorSummary[] | undefined,
) => {
  if (!Array.isArray(collections)) {
    return [];
  }

  return collections.flatMap(item => {
    if (Array.isArray((item as MonitorCollection).monitors)) {
      return ((item as MonitorCollection).monitors || []).map(
        normalizeMonitorSummary,
      );
    }

    return [normalizeMonitorSummary(item as MonitorSummary)];
  });
};

const buildMonitorApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  if (typeof window !== 'undefined') {
    return `${MONITOR_API_PROXY_BASE_PATH}/${cleanEndpoint}`;
  }

  return `${MONITOR_API_BASE_URL}/${cleanEndpoint}`;
};

export const buildMonitorPayload = (input: MonitorMutationInput) => ({
  name: input.name,
  search: {
    query: input.search.query,
    numResults: input.search.numResults,
    ...(sanitizeObject(input.search.contents)
      ? { contents: input.search.contents }
      : {}),
  },
  trigger: {
    type: 'interval' as const,
    period: input.trigger.period,
  },
  webhook: {
    url: input.webhook.url,
    events: input.webhook.events,
  },
  ...(sanitizeObject(input.outputSchema)
    ? { outputSchema: input.outputSchema }
    : {}),
  ...(sanitizeObject(input.metadata) ? { metadata: input.metadata } : {}),
});

const normalizeResult = <T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
) => {
  if (!response.success) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data as T;
};

export async function createMonitor(
  spaceId: string,
  input: MonitorMutationInput,
  options: RequestOptions,
) {
  const response = await apiClientJson<MonitorDetails>(
    buildMonitorApiUrl(`/spaces/${spaceId}/monitors/create-monitor`),
    withAuth(options, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildMonitorPayload(input)),
    }),
  );

  return normalizeResult(response, 'Failed to create monitor');
}

export async function getMonitors(spaceId: string, options: RequestOptions) {
  const response = await apiClientJson<MonitorCollection[] | MonitorSummary[]>(
    buildMonitorApiUrl(`/spaces/${spaceId}/monitors/get-all-monitors`),
    withAuth(options),
  );

  return flattenMonitorCollections(
    normalizeResult(response, 'Failed to load monitors'),
  );
}

export async function getMonitor(
  spaceId: string,
  monitorId: string,
  options: RequestOptions,
) {
  const response = await apiClientJson<MonitorDetails>(
    buildMonitorApiUrl(`/spaces/${spaceId}/monitors/${monitorId}`),
    withAuth(options),
  );

  return normalizeResult(response, 'Failed to load monitor');
}

export async function updateMonitor(
  spaceId: string,
  monitorId: string,
  input: MonitorMutationInput,
  options: RequestOptions,
) {
  const response = await apiClientJson<MonitorDetails>(
    buildMonitorApiUrl(
      `/spaces/${spaceId}/monitors/update-monitor/${monitorId}`,
    ),
    withAuth(options, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildMonitorPayload(input)),
    }),
  );

  return normalizeResult(response, 'Failed to update monitor');
}

export async function deleteMonitor(
  spaceId: string,
  monitorId: string,
  options: RequestOptions,
) {
  const response = await apiClientJson<null>(
    buildMonitorApiUrl(
      `/spaces/${spaceId}/monitors/delete-monitor/${monitorId}`,
    ),
    withAuth(options, {
      method: 'DELETE',
    }),
  );

  if (!response.success) {
    throw new Error(response.message || 'Failed to delete monitor');
  }

  return null;
}

export async function triggerMonitor(
  spaceId: string,
  monitorId: string,
  options: RequestOptions,
) {
  const response = await apiClientJson<MonitorDetails>(
    buildMonitorApiUrl(`/spaces/${spaceId}/monitors/trigger/${monitorId}`),
    withAuth(options, {
      method: 'POST',
    }),
  );

  return normalizeResult(response, 'Failed to trigger monitor');
}

export async function syncMonitor(
  spaceId: string,
  monitorId: string,
  options: RequestOptions,
) {
  const response = await apiClientJson<MonitorDetails>(
    buildMonitorApiUrl(`/spaces/${spaceId}/monitors/sync-monitor/${monitorId}`),
    withAuth(options),
  );

  return normalizeResult(response, 'Failed to sync monitor');
}

export async function getMonitorRuns(
  spaceId: string,
  monitorId: string,
  options: RequestOptions,
) {
  const response = await apiClientJson<MonitorRunSummary[]>(
    buildMonitorApiUrl(`/spaces/${spaceId}/monitors/${monitorId}/runs/get-all`),
    withAuth(options),
  );

  return normalizeResult(response, 'Failed to load monitor runs') || [];
}

export async function getMonitorRun(
  spaceId: string,
  monitorId: string,
  runId: string,
  options: RequestOptions,
) {
  const response = await apiClientJson<MonitorRunDetails>(
    buildMonitorApiUrl(
      `/spaces/${spaceId}/monitors/${monitorId}/runs/${runId}`,
    ),
    withAuth(options),
  );

  return normalizeResult(response, 'Failed to load monitor run');
}

export const monitorQueryKeys = {
  all: ['monitors'] as const,
  lists: (spaceId: string) =>
    [...monitorQueryKeys.all, 'list', spaceId] as const,
  details: (spaceId: string, monitorId: string) =>
    [...monitorQueryKeys.all, 'detail', spaceId, monitorId] as const,
  runs: (spaceId: string, monitorId: string) =>
    [...monitorQueryKeys.all, 'runs', spaceId, monitorId] as const,
  run: (spaceId: string, monitorId: string, runId: string) =>
    [...monitorQueryKeys.all, 'run', spaceId, monitorId, runId] as const,
};
