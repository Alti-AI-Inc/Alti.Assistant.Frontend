export const DEFAULT_MONITOR_WEBHOOK_EVENTS = [
  'monitor.run.completed',
] as const;

export type MonitorWebhookEvent =
  | (typeof DEFAULT_MONITOR_WEBHOOK_EVENTS)[number]
  | string;

export type MonitorTriggerType = 'interval';

export interface MonitorSearchConfig {
  query: string;
  numResults: number;
  contents?: Record<string, unknown> | null;
}

export interface MonitorTriggerConfig {
  type: MonitorTriggerType;
  period: string;
}

export interface MonitorWebhookConfig {
  url: string;
  events: MonitorWebhookEvent[];
}

export interface MonitorSummary {
  id: string;
  _id?: string;
  name: string;
  status?: string | null;
  search?: MonitorSearchConfig | null;
  trigger?: MonitorTriggerConfig | null;
  outputSchema?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  webhook?: MonitorWebhookConfig | null;
  nextRunAt?: string | null;
  lastRunAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface MonitorCollection {
  _id?: string;
  id?: string;
  space?: string;
  user?: string;
  monitors?: MonitorSummary[];
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface MonitorRunSummary {
  id: string;
  _id?: string;
  status?: string | null;
  failReason?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  durationMs?: number | null;
  output?: unknown;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface MonitorDetails extends MonitorSummary {
  latestRun?: MonitorRunSummary | null;
}

export interface MonitorRunDetails extends MonitorRunSummary {
  monitorId?: string;
}

export interface MonitorDraftInput {
  name: string;
  search: MonitorSearchConfig;
  trigger: MonitorTriggerConfig;
  webhook: MonitorWebhookConfig;
  outputSchema?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface MonitorMutationInput {
  name: string;
  search: MonitorSearchConfig;
  trigger: MonitorTriggerConfig;
  webhook: MonitorWebhookConfig;
  outputSchema?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
