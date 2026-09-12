'use client';

import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { marked } from 'marked';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import CopyButton from '@/components/CopyButton';
import MonitorDetailsDialog from '@/components/monitors/MonitorDetailsDialog';
import MonitorFormDialog from '@/components/monitors/MonitorFormDialog';
import MonitorRunsDialog from '@/components/monitors/MonitorRunsDialog';
import {
  formatDuration,
  formatMonitorDate,
  getMonitorId,
  getMonitorRunId,
  getStatusBadgeClassName,
} from '@/components/monitors/monitor-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCreateMonitorMutation,
  useDeleteMonitorMutation,
  useMonitorRunsQuery,
  useMonitorsQuery,
  useSyncMonitorMutation,
  useTriggerMonitorMutation,
  useUpdateMonitorMutation,
} from '@/hooks/useMonitors';
import { cn } from '@/lib/utils';
import {
  type MonitorDetails,
  type MonitorDraftInput,
  type MonitorRunSummary,
  type MonitorSummary,
} from '@/types/monitor';

interface SpaceMonitorPanelProps {
  spaceId: string;
  accessToken?: string;
}

type FormState =
  | { mode: 'create'; monitor?: MonitorDraftInput | null }
  | { mode: 'edit'; monitor: MonitorDetails | MonitorSummary };

const prettifyLabel = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, character => character.toUpperCase());

const formatPrimitive = (value: unknown) => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value === null || value === undefined) {
    return 'Not available';
  }

  return JSON.stringify(value, null, 2);
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getMarkdownHtml = (value: string) => {
  const escapedValue = escapeHtml(value);
  return marked.parse(escapedValue, {
    async: false,
    breaks: true,
    gfm: true,
  });
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isUrlString = (value: unknown): value is string =>
  typeof value === 'string' && /^https?:\/\//i.test(value);

const isImageUrlString = (value: unknown): value is string =>
  isUrlString(value) && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(value);

const isLikelyImageField = (key: string, value: unknown) =>
  typeof value === 'string' &&
  (key.toLowerCase().includes('image') ||
    key.toLowerCase().includes('thumbnail'));

const renderValueContent = (key: string, value: unknown) => {
  if (
    isLikelyImageField(key, value) &&
    (isImageUrlString(value) || isUrlString(value))
  ) {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="block">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900">
          <Image
            src={value}
            alt={prettifyLabel(key)}
            width={1200}
            height={630}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-52 w-full object-cover"
            unoptimized
          />
        </div>
      </a>
    );
  }

  if (isUrlString(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="inline-flex max-w-full items-center text-sm leading-6 font-medium break-all text-sky-700 underline underline-offset-4 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-300"
      >
        {value}
      </a>
    );
  }

  if (Array.isArray(value) || isRecord(value)) {
    return <StructuredValue value={value} />;
  }

  return (
    <p className="text-sm leading-6 break-words whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">
      {formatPrimitive(value)}
    </p>
  );
};

const renderObjectCard = (value: Record<string, unknown>, index?: number) => {
  const entries = Object.entries(value);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">No fields.</p>
    );
  }

  const titleEntry = entries.find(([key, entryValue]) => {
    const normalizedKey = key.toLowerCase();
    return (
      typeof entryValue === 'string' &&
      ['title', 'name', 'headline'].includes(normalizedKey)
    );
  });
  const imageEntry = entries.find(
    ([key, entryValue]) =>
      isLikelyImageField(key, entryValue) &&
      (isImageUrlString(entryValue) || isUrlString(entryValue)),
  );
  const publishedDateEntry = entries.find(([key]) =>
    [
      'publisheddate',
      'published_at',
      'publishedat',
      'date',
      'createdat',
    ].includes(key.toLowerCase()),
  );
  const authorEntry = entries.find(([key, entryValue]) => {
    const normalizedKey = key.toLowerCase();
    return (
      typeof entryValue === 'string' &&
      ['author', 'authors', 'byline', 'source'].includes(normalizedKey)
    );
  });
  const contentEntry = entries.find(([key]) => {
    const normalizedKey = key.toLowerCase();
    return ['content', 'description', 'summary', 'body', 'snippet'].includes(
      normalizedKey,
    );
  });
  const primaryLinkEntry = entries.find(([key, entryValue]) => {
    if (!isUrlString(entryValue)) {
      return false;
    }

    const normalizedKey = key.toLowerCase();
    return (
      normalizedKey === 'url' ||
      normalizedKey === 'link' ||
      normalizedKey === 'id'
    );
  });

  const hiddenKeys = new Set<string>([
    titleEntry?.[0] ?? '',
    imageEntry?.[0] ?? '',
    publishedDateEntry?.[0] ?? '',
    authorEntry?.[0] ?? '',
    contentEntry?.[0] ?? '',
    primaryLinkEntry?.[0] ?? '',
    'favicon',
    'id',
    'grounding',
    'url',
  ]);

  const contentValue = contentEntry?.[1];
  const imageHref = primaryLinkEntry
    ? String(primaryLinkEntry[1])
    : String(imageEntry?.[1] ?? '');

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
      {imageEntry ? (
        <a
          href={imageHref}
          target="_blank"
          rel="noreferrer"
          className="block border-b border-black/10 bg-zinc-100 dark:border-white/10 dark:bg-zinc-950"
        >
          <Image
            src={String(imageEntry[1])}
            alt={String(titleEntry?.[1] || `Result ${index ? index + 1 : ''}`)}
            width={1200}
            height={630}
            sizes="(max-width: 768px) 100vw, 80vw"
            className="h-56 w-full object-cover"
            unoptimized
          />
        </a>
      ) : null}

      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                Result {typeof index === 'number' ? index + 1 : ''}
              </p>
              {titleEntry ? (
                <div className="space-y-1">
                  <h3 className="line-clamp-2 max-w-3xl text-lg leading-7 font-semibold text-zinc-950 dark:text-white">
                    {String(titleEntry[1])}
                  </h3>
                  {authorEntry ? (
                    <p className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {String(authorEntry[1])}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {primaryLinkEntry ? (
              <a
                href={String(primaryLinkEntry[1])}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/15"
              >
                Open source
              </a>
            ) : null}
          </div>

          {publishedDateEntry ? (
            <div className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {prettifyLabel(publishedDateEntry[0])}:{' '}
              {String(publishedDateEntry[1])}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          {entries
            .filter(([key]) => !hiddenKeys.has(key))
            .map(([key, entryValue]) => (
              <div
                key={key}
                className="rounded-2xl border border-black/5 bg-zinc-50/90 p-4 dark:border-white/10 dark:bg-zinc-950/80"
              >
                <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
                  {prettifyLabel(key)}
                </p>
                {renderValueContent(key, entryValue)}
              </div>
            ))}
        </div>

        {contentEntry ? (
          <div className="mt-auto rounded-2xl border border-black/5 bg-zinc-50/90 p-5 dark:border-white/10 dark:bg-zinc-950/80">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">
              {prettifyLabel(contentEntry[0])}
            </p>
            {typeof contentValue === 'string' ? (
              <div
                className="prose prose-sm prose-headings:font-semibold prose-headings:text-zinc-950 prose-p:text-zinc-700 prose-li:text-zinc-700 prose-strong:text-zinc-950 prose-code:rounded prose-code:bg-black/5 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em] prose-pre:rounded-2xl prose-pre:border prose-pre:border-black/10 prose-pre:bg-white prose-pre:p-4 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-zinc-200 dark:prose-li:text-zinc-200 dark:prose-strong:text-white dark:prose-code:bg-white/10 dark:prose-pre:border-white/10 dark:prose-pre:bg-zinc-900 max-h-48 max-w-none overflow-y-auto text-sm leading-7 whitespace-pre-wrap text-zinc-800"
                dangerouslySetInnerHTML={{
                  __html: getMarkdownHtml(contentValue),
                }}
              />
            ) : (
              renderValueContent(contentEntry[0], contentValue)
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

const StructuredValue = ({ value }: { value: unknown }) => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No items.</p>
      );
    }

    const allPrimitive = value.every(
      item => !Array.isArray(item) && !isRecord(item),
    );

    if (allPrimitive) {
      return (
        <ul className="space-y-2">
          {value.map((item, index) => (
            <li
              key={`${formatPrimitive(item)}-${index}`}
              className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm leading-6 text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {formatPrimitive(item)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="grid auto-rows-fr gap-4 xl:grid-cols-2">
        {value.map((item, index) =>
          isRecord(item) ? (
            <div key={index} className="h-full">
              {renderObjectCard(item, index)}
            </div>
          ) : (
            <div
              key={index}
              className="rounded-2xl border border-black/5 bg-white/80 p-4 dark:border-white/10 dark:bg-zinc-900/80"
            >
              <StructuredValue value={item} />
            </div>
          ),
        )}
      </div>
    );
  }

  if (isRecord(value)) {
    return renderObjectCard(value);
  }

  return (
    <p className="text-sm leading-6 whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">
      {formatPrimitive(value)}
    </p>
  );
};

const AssistantOutput = ({ value }: { value?: unknown }) => {
  if (value === null || value === undefined || value === '') {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No output available.
      </p>
    );
  }

  if (typeof value === 'string') {
    const html = getMarkdownHtml(value);

    return (
      <div className="rounded-[24px] border border-black/10 bg-zinc-50/80 p-5 dark:border-white/10 dark:bg-zinc-950/80">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white dark:bg-white dark:text-black">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                Monitor Response
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Formatted output from the latest monitor run.
              </p>
            </div>
          </div>
          <CopyButton
            content={value}
            className="ml-0 h-9 w-9 rounded-xl border border-black/10 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          />
        </div>

        <div
          className="prose prose-sm prose-headings:font-semibold prose-headings:text-zinc-950 prose-p:text-zinc-700 prose-li:text-zinc-700 prose-strong:text-zinc-950 prose-code:rounded prose-code:bg-black/5 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em] prose-pre:rounded-2xl prose-pre:border prose-pre:border-black/10 prose-pre:bg-white prose-pre:p-4 prose-blockquote:border-l-2 prose-blockquote:border-zinc-300 prose-blockquote:text-zinc-600 dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-zinc-200 dark:prose-li:text-zinc-200 dark:prose-strong:text-white dark:prose-code:bg-white/10 dark:prose-pre:border-white/10 dark:prose-pre:bg-zinc-900 dark:prose-blockquote:border-zinc-700 dark:prose-blockquote:text-zinc-300 max-w-none text-sm leading-7 whitespace-pre-wrap text-zinc-800"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-black/10 bg-zinc-50/80 p-5 dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white dark:bg-white dark:text-black">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-950 dark:text-white">
              Structured Output
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Parsed monitor payload rendered as readable sections.
            </p>
          </div>
        </div>
        <CopyButton
          content={JSON.stringify(value, null, 2)}
          className="ml-0 h-9 w-9 rounded-xl border border-black/10 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        />
      </div>

      <StructuredValue value={value} />
    </div>
  );
};

const sortRuns = (runs: MonitorRunSummary[]) =>
  [...runs].sort((left, right) => {
    const leftDate = new Date(left.startedAt || left.createdAt || 0).getTime();
    const rightDate = new Date(
      right.startedAt || right.createdAt || 0,
    ).getTime();

    return rightDate - leftDate;
  });

const isTerminalMonitorRun = (run?: MonitorRunSummary | null) => {
  if (!run) {
    return false;
  }

  if (run.completedAt || run.failedAt) {
    return true;
  }

  const normalizedStatus = run.status?.toLowerCase().trim();

  if (!normalizedStatus) {
    return false;
  }

  return ['completed', 'failed', 'error', 'cancelled', 'canceled'].some(
    status => normalizedStatus.includes(status),
  );
};

export default function SpaceMonitorPanel({
  spaceId,
  accessToken,
}: SpaceMonitorPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    data: monitors = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useMonitorsQuery(spaceId, accessToken);
  const createMutation = useCreateMonitorMutation(spaceId, accessToken);
  const updateMutation = useUpdateMonitorMutation(spaceId, accessToken);
  const deleteMutation = useDeleteMonitorMutation(spaceId, accessToken);
  const triggerMutation = useTriggerMonitorMutation(spaceId, accessToken);
  const syncMutation = useSyncMonitorMutation(spaceId, accessToken);

  const [formState, setFormState] = useState<FormState | null>(null);
  const [detailsMonitorId, setDetailsMonitorId] = useState<string | null>(null);
  const [runsTarget, setRunsTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MonitorSummary | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [selectedMonitorId, setSelectedMonitorId] = useState<string | null>(
    null,
  );
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [pendingResultMonitorId, setPendingResultMonitorId] = useState<
    string | null
  >(null);
  const selectedMonitorParam = searchParams?.get('monitor') || null;
  const shouldOpenCreateMonitor = searchParams?.get('createMonitor') === '1';

  const selectedMonitor = useMemo(
    () =>
      monitors.find(monitor => getMonitorId(monitor) === selectedMonitorId) ||
      null,
    [monitors, selectedMonitorId],
  );

  const shouldPollSelectedMonitorRuns =
    !!selectedMonitorId && selectedMonitorId === pendingResultMonitorId;

  const {
    data: selectedMonitorRuns = [],
    isLoading: isLoadingSelectedMonitorRuns,
    error: selectedMonitorRunsError,
  } = useMonitorRunsQuery(
    spaceId,
    selectedMonitorId || undefined,
    accessToken,
    {
      enabled: !!selectedMonitorId,
      refetchInterval: shouldPollSelectedMonitorRuns ? 5000 : false,
    },
  );

  const sortedSelectedMonitorRuns = useMemo(
    () => sortRuns(selectedMonitorRuns),
    [selectedMonitorRuns],
  );
  const latestSelectedMonitorRun = sortedSelectedMonitorRuns[0] || null;
  const selectedRun = useMemo(() => {
    if (sortedSelectedMonitorRuns.length === 0) {
      return null;
    }

    return (
      sortedSelectedMonitorRuns.find(
        run => getMonitorRunId(run) === selectedRunId,
      ) || latestSelectedMonitorRun
    );
  }, [latestSelectedMonitorRun, selectedRunId, sortedSelectedMonitorRuns]);

  const updateMonitorParams = (options?: {
    monitorId?: string | null;
    createMonitor?: boolean;
  }) => {
    const nextParams = new URLSearchParams(searchParams?.toString() || '');
    nextParams.set('bot', spaceId);
    nextParams.set('section', 'monitor');

    if (options?.monitorId) {
      nextParams.set('monitor', options.monitorId);
    } else {
      nextParams.delete('monitor');
    }

    if (options?.createMonitor) {
      nextParams.set('createMonitor', '1');
    } else {
      nextParams.delete('createMonitor');
    }

    router.replace(`/spaces?${nextParams.toString()}`);
  };

  useEffect(() => {
    if (!shouldOpenCreateMonitor) {
      return;
    }

    setFormState(current => current || { mode: 'create', monitor: null });

    const nextParams = new URLSearchParams(searchParams?.toString() || '');
    nextParams.set('bot', spaceId);
    nextParams.set('section', 'monitor');

    if (selectedMonitorParam || selectedMonitorId) {
      nextParams.set(
        'monitor',
        selectedMonitorParam || selectedMonitorId || '',
      );
    } else {
      nextParams.delete('monitor');
    }

    nextParams.delete('createMonitor');
    router.replace(`/spaces?${nextParams.toString()}`);
  }, [
    selectedMonitorId,
    selectedMonitorParam,
    shouldOpenCreateMonitor,
    router,
    searchParams,
    spaceId,
  ]);

  useEffect(() => {
    if (monitors.length === 0) {
      setSelectedMonitorId(null);
      return;
    }

    if (selectedMonitorParam) {
      const hasParamMonitor = monitors.some(
        monitor => getMonitorId(monitor) === selectedMonitorParam,
      );

      if (hasParamMonitor && selectedMonitorId !== selectedMonitorParam) {
        setSelectedMonitorId(selectedMonitorParam);
        return;
      }
    }

    const hasSelectedMonitor = monitors.some(
      monitor => getMonitorId(monitor) === selectedMonitorId,
    );

    if (!selectedMonitorId || !hasSelectedMonitor) {
      setSelectedMonitorId(getMonitorId(monitors[0]));
    }
  }, [monitors, selectedMonitorId, selectedMonitorParam]);

  useEffect(() => {
    if (
      pendingResultMonitorId &&
      selectedMonitorId === pendingResultMonitorId &&
      isTerminalMonitorRun(latestSelectedMonitorRun)
    ) {
      setPendingResultMonitorId(null);
    }
  }, [latestSelectedMonitorRun, pendingResultMonitorId, selectedMonitorId]);

  useEffect(() => {
    if (sortedSelectedMonitorRuns.length === 0) {
      setSelectedRunId(null);
      return;
    }

    const hasSelectedRun = sortedSelectedMonitorRuns.some(
      run => getMonitorRunId(run) === selectedRunId,
    );

    if (!selectedRunId || !hasSelectedRun) {
      setSelectedRunId(getMonitorRunId(sortedSelectedMonitorRuns[0]));
    }
  }, [selectedMonitorId, selectedRunId, sortedSelectedMonitorRuns]);

  const handleCreate = async (value: MonitorDraftInput) => {
    try {
      const createdMonitor = await createMutation.mutateAsync(value);
      const monitorId = getMonitorId(createdMonitor);

      setSelectedMonitorId(monitorId);
      setPendingResultMonitorId(monitorId);
      updateMonitorParams({ monitorId });
      toast.success('Monitor created successfully.');
      setFormState(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create monitor.',
      );
    }
  };

  const handleEdit = async (monitorId: string, value: MonitorDraftInput) => {
    try {
      await updateMutation.mutateAsync({ monitorId, input: value });
      toast.success('Monitor updated successfully.');
      setFormState(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update monitor.',
      );
    }
  };

  const handleTrigger = async (monitorId: string) => {
    try {
      setPendingActionId(monitorId);
      await triggerMutation.mutateAsync(monitorId);
      toast.success(
        'Monitor triggered. Use Sync now if the latest state is not visible yet.',
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to trigger monitor.',
      );
    } finally {
      setPendingActionId(current => (current === monitorId ? null : current));
    }
  };

  const handleSync = async (monitorId: string) => {
    try {
      setPendingActionId(monitorId);
      await syncMutation.mutateAsync(monitorId);
      toast.success('Monitor synced successfully.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to sync monitor.',
      );
    } finally {
      setPendingActionId(current => (current === monitorId ? null : current));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(getMonitorId(deleteTarget));
      toast.success('Monitor deleted successfully.');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete monitor.',
      );
    }
  };

  const renderLoadingState = () => (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-black/10 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-zinc-900"
        >
          <Skeleton className="mb-3 h-5 w-48" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );

  const renderRunHistory = () => {
    if (!selectedMonitorId || !selectedMonitor) {
      return (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-sm text-zinc-500 shadow-xs dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400">
          Select a monitor to inspect its run history.
        </div>
      );
    }

    if (isLoadingSelectedMonitorRuns) {
      return (
        <div className="grid gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      );
    }

    if (selectedMonitorRunsError) {
      return (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
          {selectedMonitorRunsError instanceof Error
            ? selectedMonitorRunsError.message
            : 'Failed to load monitor results.'}
        </div>
      );
    }

    if (
      shouldPollSelectedMonitorRuns &&
      sortedSelectedMonitorRuns.length === 0
    ) {
      return (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-zinc-900">
          <Loader2 className="mb-4 size-8 animate-spin text-zinc-500 dark:text-zinc-300" />
          <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
            Waiting for monitor results
          </h3>
          <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-300">
            {selectedMonitor.name || 'This monitor'} was created successfully.
            We are polling its run history and will show the result here as soon
            as the backend returns it.
          </p>
        </div>
      );
    }

    if (sortedSelectedMonitorRuns.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-zinc-900">
          <h3 className="text-base font-semibold text-zinc-950 dark:text-white">
            No results yet
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Trigger or sync this monitor later to fetch its run output.
          </p>
        </div>
      );
    }

    const [latestRun, ...olderRuns] = sortedSelectedMonitorRuns;
    const activeRun = selectedRun || latestRun;
    const isShowingLatestRun =
      getMonitorRunId(activeRun) === getMonitorRunId(latestRun);

    return (
      <div className="grid gap-5">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-zinc-900">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                {isShowingLatestRun ? 'Latest Output' : 'Selected Output'}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={getStatusBadgeClassName(activeRun.status)}
                  variant="outline"
                >
                  {activeRun.status || 'Unknown'}
                </Badge>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatMonitorDate(
                    activeRun.completedAt ||
                      activeRun.failedAt ||
                      activeRun.startedAt,
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw
                  className={cn('size-4', isRefetching && 'animate-spin')}
                />
                Refresh
              </Button>
              {renderActions(selectedMonitor)}
            </div>
          </div>

          <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                Started
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatMonitorDate(activeRun.startedAt)}
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                Finished
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatMonitorDate(activeRun.completedAt || activeRun.failedAt)}
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                Duration
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {formatDuration(activeRun.durationMs)}
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950">
              <p className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                Run ID
              </p>
              <p className="mt-2 text-sm font-medium break-all text-zinc-900 dark:text-zinc-100">
                {getMonitorRunId(activeRun)}
              </p>
            </div>
          </div>

          {activeRun.failReason ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
              {activeRun.failReason}
            </div>
          ) : null}

          <div>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
              Output Payload
            </p>
            <AssistantOutput value={activeRun.output} />
          </div>
        </div>

        {olderRuns.length > 0 ? (
          <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-zinc-900">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
              Previous Runs
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Earlier executions for this monitor.
            </p>

            <div className="mt-4 grid gap-3">
              {olderRuns.map(run => {
                const runId = getMonitorRunId(run);
                const isSelected = runId === getMonitorRunId(activeRun);

                return (
                  <button
                    key={runId}
                    type="button"
                    onClick={() => setSelectedRunId(runId)}
                    className={cn(
                      'rounded-2xl border bg-zinc-50 p-4 text-left transition-colors dark:bg-zinc-950',
                      isSelected
                        ? 'border-sky-400 bg-sky-50/70 dark:border-sky-500 dark:bg-sky-500/10'
                        : 'border-black/10 hover:border-sky-300 dark:border-white/10 dark:hover:border-sky-600/70',
                    )}
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            className={getStatusBadgeClassName(run.status)}
                            variant="outline"
                          >
                            {run.status || 'Unknown'}
                          </Badge>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {formatMonitorDate(
                              run.completedAt || run.failedAt || run.startedAt,
                            )}
                          </span>
                        </div>
                        <p className="text-xs font-medium break-all text-zinc-900 dark:text-zinc-100">
                          {runId}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-3 lg:min-w-[360px]">
                        <div>
                          <p className="text-zinc-500 dark:text-zinc-400">
                            Started
                          </p>
                          <p className="text-zinc-900 dark:text-zinc-100">
                            {formatMonitorDate(run.startedAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 dark:text-zinc-400">
                            Duration
                          </p>
                          <p className="text-zinc-900 dark:text-zinc-100">
                            {formatDuration(run.durationMs)}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 dark:text-zinc-400">
                            Fail reason
                          </p>
                          <p className="text-zinc-900 dark:text-zinc-100">
                            {run.failReason || 'None'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderActions = (monitor: MonitorSummary) => {
    const monitorId = getMonitorId(monitor);
    const isPending = pendingActionId === monitorId;

    return (
      <div className="flex flex-wrap items-center gap-2">
        {/* <Button
          size="sm"
          variant="outline"
          onClick={() => setDetailsMonitorId(monitorId)}
        >
          View
        </Button> */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFormState({ mode: 'edit', monitor })}
        >
          Edit
        </Button>
        {/* <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => handleTrigger(monitorId)}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Trigger
        </Button> */}
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => handleSync(monitorId)}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Sync
        </Button>
        {/* <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setRunsTarget({
              id: monitorId,
              name: monitor.name || 'Monitor',
            })
          }
        >
          View runs
        </Button> */}
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700"
          onClick={() => setDeleteTarget(monitor)}
        >
          Delete
        </Button>
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#e1e1e1] dark:bg-zinc-950">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : 'Failed to load monitors.'}
            </div>
          ) : isLoading ? (
            renderLoadingState()
          ) : monitors.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/15 bg-white p-10 text-center shadow-xs dark:border-white/10 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                No monitors yet
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Use the plus button in the left sidebar to create your first
                monitor.
              </p>
            </div>
          ) : (
            renderRunHistory()
          )}
        </div>
      </div>

      <MonitorFormDialog
        open={!!formState}
        onOpenChange={open => {
          if (!open) {
            setFormState(null);
          }
        }}
        mode={formState?.mode || 'create'}
        initialValue={formState?.monitor || null}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={value => {
          if (!formState) {
            return Promise.resolve();
          }

          if (formState.mode === 'edit') {
            return handleEdit(getMonitorId(formState.monitor), value);
          }

          return handleCreate(value);
        }}
      />

      <MonitorDetailsDialog
        open={!!detailsMonitorId}
        onOpenChange={open => {
          if (!open) {
            setDetailsMonitorId(null);
          }
        }}
        spaceId={spaceId}
        monitorId={detailsMonitorId}
        accessToken={accessToken}
      />

      <MonitorRunsDialog
        open={!!runsTarget}
        onOpenChange={open => {
          if (!open) {
            setRunsTarget(null);
          }
        }}
        spaceId={spaceId}
        monitorId={runsTarget?.id}
        monitorName={runsTarget?.name}
        accessToken={accessToken}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete monitor</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{' '}
              {deleteTarget?.name || 'this monitor'} and its configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
