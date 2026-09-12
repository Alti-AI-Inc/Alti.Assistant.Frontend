import {
  DEFAULT_MONITOR_WEBHOOK_EVENTS,
  type MonitorDetails,
  type MonitorDraftInput,
  type MonitorRunSummary,
} from '@/types/monitor';

export const PENDING_MONITOR_DRAFT_KEY = 'pending-monitor-draft';

export const MONITOR_PERIOD_OPTIONS = [
  { value: '1h', label: 'Every 1 hour' },
  { value: '6h', label: 'Every 6 hours' },
  { value: '1d', label: 'Every 1 day' },
  { value: '7d', label: 'Every 7 days' },
] as const;

export const getMonitorId = (
  monitor?: Pick<MonitorDetails, 'id' | '_id'> | null,
) => monitor?.id || monitor?._id || '';

export const getMonitorRunId = (
  run?: Pick<MonitorRunSummary, 'id' | '_id'> | null,
) => run?.id || run?._id || '';

export const formatMonitorDate = (value?: string | null) => {
  if (!value) {
    return 'Not available';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export const formatDuration = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'Not available';
  }

  if (value < 1000) {
    return `${value} ms`;
  }

  const seconds = value / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(seconds >= 10 ? 0 : 1)} s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export const getStatusBadgeClassName = (status?: string | null) => {
  const normalized = (status || 'unknown').toLowerCase();

  if (normalized.includes('complete') || normalized.includes('success')) {
    return 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300';
  }

  if (normalized.includes('fail') || normalized.includes('error')) {
    return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300';
  }

  if (
    normalized.includes('run') ||
    normalized.includes('sync') ||
    normalized.includes('pending')
  ) {
    return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300';
  }

  return 'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300';
};

export const getDefaultMonitorWebhookUrl = () =>
  process.env.NEXT_PUBLIC_EXA_MONITOR_WEBHOOK_URL ||
  process.env.NEXT_PUBLIC_MONITOR_WEBHOOK_URL ||
  'https://api.altihq.com/api/v1/webhooks/exa';

const PERIOD_PATTERNS: Array<{ pattern: RegExp; period: string }> = [
  { pattern: /\b(hourly|every\s+1\s*(hour|hr)|every\s+hour)\b/i, period: '1h' },
  { pattern: /\b(every\s+6\s*hours?|every\s+six\s*hours?)\b/i, period: '6h' },
  { pattern: /\b(daily|every\s+day|every\s+1\s*day)\b/i, period: '1d' },
  { pattern: /\b(weekly|every\s+week|every\s+7\s*days?)\b/i, period: '7d' },
];

const trimPromptForQuery = (prompt: string) =>
  prompt
    .replace(
      /\b(track|monitor|watch|follow|alert me on|notify me about)\b/gi,
      '',
    )
    .replace(
      /\b(hourly|daily|weekly|every\s+\d+\s*(hour|hours|hr|hrs|day|days|week|weeks))\b/gi,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[,.-]+|[,.-]+$/g, '');

const toTitleCase = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const createMonitorDraftFromPrompt = (
  prompt: string,
  defaultWebhookUrl = getDefaultMonitorWebhookUrl(),
): MonitorDraftInput => {
  const period =
    PERIOD_PATTERNS.find(entry => entry.pattern.test(prompt))?.period || '1h';
  const query = trimPromptForQuery(prompt) || prompt.trim();
  const nameBase = query || 'New monitor';

  return {
    name: `Monitor ${toTitleCase(nameBase)}`,
    search: {
      query,
      numResults: 10,
    },
    trigger: {
      type: 'interval',
      period,
    },
    webhook: {
      url: defaultWebhookUrl,
      events: [...DEFAULT_MONITOR_WEBHOOK_EVENTS],
    },
  };
};

export const safeJsonStringify = (value?: unknown) => {
  if (
    !value ||
    typeof value !== 'object' ||
    Object.keys(value as object).length === 0
  ) {
    return '';
  }

  return JSON.stringify(value, null, 2);
};
