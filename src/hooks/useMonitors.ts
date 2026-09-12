'use client';

import {
  createMonitor,
  deleteMonitor,
  getMonitor,
  getMonitorRun,
  getMonitorRuns,
  getMonitors,
  monitorQueryKeys,
  syncMonitor,
  triggerMonitor,
  updateMonitor,
} from '@/lib/monitor-api';
import {
  type MonitorMutationInput,
  type MonitorRunDetails,
  type MonitorRunSummary,
  type MonitorSummary,
} from '@/types/monitor';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type MonitorQueryOptions = {
  enabled?: boolean;
  refetchInterval?: number | false;
};

export function useMonitorsQuery(spaceId?: string, accessToken?: string) {
  return useQuery<MonitorSummary[]>({
    queryKey: spaceId
      ? monitorQueryKeys.lists(spaceId)
      : ['monitors', 'list', 'missing-space'],
    queryFn: () => getMonitors(spaceId!, { accessToken: accessToken! }),
    enabled: !!spaceId && !!accessToken,
    staleTime: 30_000,
  });
}

export function useMonitorQuery(
  spaceId?: string,
  monitorId?: string,
  accessToken?: string,
) {
  return useQuery({
    queryKey:
      spaceId && monitorId
        ? monitorQueryKeys.details(spaceId, monitorId)
        : ['monitors', 'detail', 'missing'],
    queryFn: () =>
      getMonitor(spaceId!, monitorId!, { accessToken: accessToken! }),
    enabled: !!spaceId && !!monitorId && !!accessToken,
  });
}

export function useMonitorRunsQuery(
  spaceId?: string,
  monitorId?: string,
  accessToken?: string,
  options?: MonitorQueryOptions,
) {
  return useQuery<MonitorRunSummary[]>({
    queryKey:
      spaceId && monitorId
        ? monitorQueryKeys.runs(spaceId, monitorId)
        : ['monitors', 'runs', 'missing'],
    queryFn: () =>
      getMonitorRuns(spaceId!, monitorId!, { accessToken: accessToken! }),
    enabled:
      (options?.enabled ?? true) && !!spaceId && !!monitorId && !!accessToken,
    staleTime: 15_000,
    refetchInterval: options?.refetchInterval,
  });
}

export function useMonitorRunQuery(
  spaceId?: string,
  monitorId?: string,
  runId?: string,
  accessToken?: string,
) {
  return useQuery<MonitorRunDetails>({
    queryKey:
      spaceId && monitorId && runId
        ? monitorQueryKeys.run(spaceId, monitorId, runId)
        : ['monitors', 'run', 'missing'],
    queryFn: () =>
      getMonitorRun(spaceId!, monitorId!, runId!, {
        accessToken: accessToken!,
      }),
    enabled: !!spaceId && !!monitorId && !!runId && !!accessToken,
  });
}

export function useCreateMonitorMutation(
  spaceId?: string,
  accessToken?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: MonitorMutationInput) =>
      createMonitor(spaceId!, input, { accessToken: accessToken! }),
    onSuccess: () => {
      if (!spaceId) return;
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.lists(spaceId),
      });
    },
  });
}

export function useUpdateMonitorMutation(
  spaceId?: string,
  accessToken?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      monitorId,
      input,
    }: {
      monitorId: string;
      input: MonitorMutationInput;
    }) =>
      updateMonitor(spaceId!, monitorId, input, { accessToken: accessToken! }),
    onSuccess: (_, { monitorId }) => {
      if (!spaceId) return;
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.lists(spaceId),
      });
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.details(spaceId, monitorId),
      });
    },
  });
}

export function useDeleteMonitorMutation(
  spaceId?: string,
  accessToken?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (monitorId: string) =>
      deleteMonitor(spaceId!, monitorId, { accessToken: accessToken! }),
    onSuccess: () => {
      if (!spaceId) return;
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.lists(spaceId),
      });
    },
  });
}

export function useTriggerMonitorMutation(
  spaceId?: string,
  accessToken?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (monitorId: string) =>
      triggerMonitor(spaceId!, monitorId, { accessToken: accessToken! }),
    onSuccess: (_, monitorId) => {
      if (!spaceId) return;
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.lists(spaceId),
      });
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.details(spaceId, monitorId),
      });
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.runs(spaceId, monitorId),
      });
    },
  });
}

export function useSyncMonitorMutation(spaceId?: string, accessToken?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (monitorId: string) =>
      syncMonitor(spaceId!, monitorId, { accessToken: accessToken! }),
    onSuccess: (_, monitorId) => {
      if (!spaceId) return;
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.lists(spaceId),
      });
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.details(spaceId, monitorId),
      });
      queryClient.invalidateQueries({
        queryKey: monitorQueryKeys.runs(spaceId, monitorId),
      });
    },
  });
}
