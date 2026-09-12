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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useMemo, useState } from 'react';

import { useMonitorRunQuery, useMonitorRunsQuery } from '@/hooks/useMonitors';
import {
  formatDuration,
  formatMonitorDate,
  getMonitorRunId,
  getStatusBadgeClassName,
} from '@/components/monitors/monitor-utils';

interface MonitorRunsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  monitorId?: string | null;
  monitorName?: string;
  accessToken?: string;
}

const JsonOutput = ({ value }: { value?: unknown }) => {
  if (value === null || value === undefined || value === '') {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No output available.
      </p>
    );
  }

  if (typeof value === 'string') {
    return (
      <pre className="overflow-x-auto rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs whitespace-pre-wrap text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
        {value}
      </pre>
    );
  }

  return (
    <pre className="overflow-x-auto rounded-lg border border-black/10 bg-zinc-50 p-3 text-xs text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

export default function MonitorRunsDialog({
  open,
  onOpenChange,
  spaceId,
  monitorId,
  monitorName,
  accessToken,
}: MonitorRunsDialogProps) {
  const {
    data: runs = [],
    isLoading,
    error,
  } = useMonitorRunsQuery(
    open ? spaceId : undefined,
    open ? monitorId || undefined : undefined,
    accessToken,
  );

  const sortedRuns = useMemo(
    () =>
      [...runs].sort((left, right) => {
        const leftDate = new Date(
          left.startedAt || left.createdAt || 0,
        ).getTime();
        const rightDate = new Date(
          right.startedAt || right.createdAt || 0,
        ).getTime();
        return rightDate - leftDate;
      }),
    [runs],
  );

  const [selectedRunId, setSelectedRunId] = useState<string | undefined>();

  useEffect(() => {
    if (!open) {
      setSelectedRunId(undefined);
      return;
    }

    if (!selectedRunId && sortedRuns[0]) {
      setSelectedRunId(getMonitorRunId(sortedRuns[0]));
    }
  }, [open, selectedRunId, sortedRuns]);

  const {
    data: selectedRun,
    isLoading: isLoadingRun,
    error: runError,
  } = useMonitorRunQuery(
    open ? spaceId : undefined,
    open ? monitorId || undefined : undefined,
    open ? selectedRunId : undefined,
    accessToken,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle>Monitor runs</DialogTitle>
          <DialogDescription>
            {monitorName
              ? `Run history for ${monitorName}.`
              : 'Inspect run history and run output.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
            {error instanceof Error
              ? error.message
              : 'Failed to load monitor runs.'}
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xs dark:border-white/10 dark:bg-zinc-900">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fail reason</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRuns.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                        colSpan={7}
                      >
                        No run history yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedRuns.map(run => {
                      const runId = getMonitorRunId(run);
                      const isFailed = (run.status || '')
                        .toLowerCase()
                        .includes('fail');

                      return (
                        <TableRow
                          key={runId}
                          className={
                            isFailed ? 'bg-red-50/50 dark:bg-red-950/10' : ''
                          }
                          onClick={() => setSelectedRunId(runId)}
                        >
                          <TableCell className="max-w-[220px] truncate font-medium">
                            {runId}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusBadgeClassName(run.status)}
                              variant="outline"
                            >
                              {run.status || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate">
                            {run.failReason || 'None'}
                          </TableCell>
                          <TableCell>
                            {formatMonitorDate(run.startedAt)}
                          </TableCell>
                          <TableCell>
                            {formatMonitorDate(run.completedAt)}
                          </TableCell>
                          <TableCell>
                            {formatMonitorDate(run.failedAt)}
                          </TableCell>
                          <TableCell>
                            {formatDuration(run.durationMs)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-zinc-900">
              {!selectedRunId ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Select a run to view details.
                </p>
              ) : isLoadingRun ? (
                <div className="grid gap-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-28 w-full" />
                </div>
              ) : runError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
                  {runError instanceof Error
                    ? runError.message
                    : 'Failed to load run details.'}
                </div>
              ) : selectedRun ? (
                <div className="grid gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                        Run ID
                      </p>
                      <h4 className="text-sm font-semibold break-all text-zinc-900 dark:text-zinc-100">
                        {getMonitorRunId(selectedRun)}
                      </h4>
                    </div>
                    <Badge
                      className={getStatusBadgeClassName(selectedRun.status)}
                      variant="outline"
                    >
                      {selectedRun.status || 'Unknown'}
                    </Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                        Started
                      </p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-100">
                        {formatMonitorDate(selectedRun.startedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                        Completed
                      </p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-100">
                        {formatMonitorDate(
                          selectedRun.completedAt || selectedRun.failedAt,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                        Duration
                      </p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-100">
                        {formatDuration(selectedRun.durationMs)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                        Fail reason
                      </p>
                      <p className="text-sm text-zinc-900 dark:text-zinc-100">
                        {selectedRun.failReason || 'None'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                      Output
                    </p>
                    <JsonOutput value={selectedRun.output} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
