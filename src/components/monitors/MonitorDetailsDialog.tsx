'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useMonitorQuery, useMonitorRunsQuery } from '@/hooks/useMonitors';
import {
  formatDuration,
  formatMonitorDate,
  getMonitorRunId,
  getStatusBadgeClassName,
} from '@/components/monitors/monitor-utils';

interface MonitorDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  monitorId?: string | null;
  accessToken?: string;
}

const JsonBlock = ({ value }: { value?: unknown }) => {
  if (
    !value ||
    typeof value !== 'object' ||
    Object.keys(value as object).length === 0
  ) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Not configured</p>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

export default function MonitorDetailsDialog({
  open,
  onOpenChange,
  spaceId,
  monitorId,
  accessToken,
}: MonitorDetailsDialogProps) {
  const { data, isLoading, error } = useMonitorQuery(
    spaceId,
    monitorId || undefined,
    accessToken,
  );
  const { data: runs = [] } = useMonitorRunsQuery(
    open ? spaceId : undefined,
    open ? monitorId || undefined : undefined,
    accessToken,
  );

  const latestRun = data?.latestRun || runs[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle>Monitor details</DialogTitle>
          <DialogDescription>
            Inspect the latest backend state for this monitor.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            {error instanceof Error
              ? error.message
              : 'Failed to load monitor details.'}
          </div>
        ) : data ? (
          <div className="grid gap-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 shadow-xs md:flex-row md:items-start md:justify-between dark:border-white/10 dark:bg-zinc-900">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">
                    {data.name || 'Untitled monitor'}
                  </h3>
                  <Badge
                    className={getStatusBadgeClassName(data.status)}
                    variant="outline"
                  >
                    {data.status || 'Unknown'}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {data.search?.query || 'No search query configured.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm md:min-w-[280px]">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">Next run</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatMonitorDate(data.nextRunAt)}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400">Updated</p>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatMonitorDate(data.updatedAt || data.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-zinc-900">
                <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Search
                </h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Query</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100">
                      {data.search?.query || 'Not available'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Results
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100">
                      {data.search?.numResults ?? 'Not available'}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-1 text-zinc-500 dark:text-zinc-400">
                      Contents
                    </dt>
                    <dd>
                      <JsonBlock value={data.search?.contents} />
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-zinc-900">
                <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Trigger
                </h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Type</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100">
                      {data.trigger?.type || 'interval'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Period</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100">
                      {data.trigger?.period || 'Not available'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Created
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100">
                      {formatMonitorDate(data.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-zinc-900">
                <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Webhook
                </h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">URL</dt>
                    <dd className="break-all text-zinc-900 dark:text-zinc-100">
                      {data.webhook?.url || 'Not available'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Events</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100">
                      {data.webhook?.events?.join(', ') || 'Not available'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-zinc-900">
                <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Output schema
                </h4>
                <JsonBlock value={data.outputSchema} />
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-zinc-900">
                <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                  Metadata
                </h4>
                <JsonBlock value={data.metadata} />
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-zinc-900">
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
                Latest known run
              </h4>
              {latestRun ? (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                      Run ID
                    </p>
                    <p className="text-sm break-all text-zinc-900 dark:text-zinc-100">
                      {getMonitorRunId(latestRun)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                      Status
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {latestRun.status || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                      Started
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {formatMonitorDate(latestRun.startedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                      Duration
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      {formatDuration(latestRun.durationMs)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No runs have been recorded yet.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
