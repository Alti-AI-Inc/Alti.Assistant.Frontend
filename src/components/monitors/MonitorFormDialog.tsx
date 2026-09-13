'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  MONITOR_PERIOD_OPTIONS,
  getDefaultMonitorWebhookUrl,
  safeJsonStringify,
} from '@/components/monitors/monitor-utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  DEFAULT_MONITOR_WEBHOOK_EVENTS,
  type MonitorDetails,
  type MonitorDraftInput,
  type MonitorMutationInput,
} from '@/types/monitor';

const monitorFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  query: z.string().trim().min(1, 'Search query is required'),
  numResults: z.coerce
    .number({ error: 'Number of results is required' })
    .int('Number of results must be a whole number')
    .min(1, 'Number of results must be at least 1')
    .max(100, 'Number of results must be 100 or less'),
  contentsText: z.string().default(''),
  period: z.string().trim().min(1, 'Trigger period is required'),
  outputSchemaText: z.string().default(''),
  metadataText: z.string().default(''),
  webhookEventsText: z.string().trim().min(1, 'Webhook events are required'),
});

type MonitorFormValues = z.infer<typeof monitorFormSchema>;

const parseOptionalJson = (
  value: string,
  label: string,
): Record<string, unknown> | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object`);
  }

  if (Object.keys(parsed as Record<string, unknown>).length === 0) {
    return undefined;
  }

  return parsed as Record<string, unknown>;
};

const toFormValues = (
  initialValue?: MonitorDraftInput | MonitorDetails | null,
): MonitorFormValues => ({
  name: initialValue?.name || '',
  query: initialValue?.search?.query || '',
  numResults: initialValue?.search?.numResults || 10,
  contentsText: safeJsonStringify(initialValue?.search?.contents),
  period: initialValue?.trigger?.period || '1h',
  outputSchemaText: safeJsonStringify(initialValue?.outputSchema),
  metadataText: safeJsonStringify(initialValue?.metadata),
  webhookEventsText:
    initialValue?.webhook?.events?.join(', ') ||
    DEFAULT_MONITOR_WEBHOOK_EVENTS.join(', '),
});

interface MonitorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialValue?: MonitorDraftInput | MonitorDetails | null;
  isSubmitting?: boolean;
  onSubmit: (value: MonitorMutationInput) => Promise<void> | void;
}

export default function MonitorFormDialog({
  open,
  onOpenChange,
  mode,
  initialValue,
  isSubmitting = false,
  onSubmit,
}: MonitorFormDialogProps) {
  const isCreateMode = mode === 'create';

  const form = useForm({
    resolver: zodResolver(monitorFormSchema),
    defaultValues: toFormValues(initialValue),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(toFormValues(initialValue));
  }, [form, initialValue, open]);

  const handleSubmit = form.handleSubmit(async values => {
    let contents: Record<string, unknown> | undefined;
    let outputSchema: Record<string, unknown> | undefined;
    let metadata: Record<string, unknown> | undefined;
    const webhookUrl =
      initialValue?.webhook?.url || getDefaultMonitorWebhookUrl();

    if (!isCreateMode) {
      try {
        contents = parseOptionalJson(values.contentsText, 'Search contents');
      } catch (error) {
        form.setError('contentsText', {
          type: 'validate',
          message: error instanceof Error ? error.message : 'Invalid JSON',
        });
        return;
      }

      try {
        outputSchema = parseOptionalJson(
          values.outputSchemaText,
          'Output schema',
        );
      } catch (error) {
        form.setError('outputSchemaText', {
          type: 'validate',
          message: error instanceof Error ? error.message : 'Invalid JSON',
        });
        return;
      }

      try {
        metadata = parseOptionalJson(values.metadataText, 'Metadata');
      } catch (error) {
        form.setError('metadataText', {
          type: 'validate',
          message: error instanceof Error ? error.message : 'Invalid JSON',
        });
        return;
      }
    }

    const events = isCreateMode
      ? [...DEFAULT_MONITOR_WEBHOOK_EVENTS]
      : values.webhookEventsText
          .split(',')
          .map(entry => entry.trim())
          .filter(Boolean);

    if (!isCreateMode && events.length === 0) {
      form.setError('webhookEventsText', {
        type: 'validate',
        message: 'At least one webhook event is required',
      });
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      search: {
        query: values.query.trim(),
        numResults: values.numResults,
        ...(contents ? { contents } : {}),
      },
      trigger: {
        type: 'interval',
        period: values.period,
      },
      webhook: {
        url: webhookUrl,
        events,
      },
      ...(outputSchema ? { outputSchema } : {}),
      ...(metadata ? { metadata } : {}),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create monitor' : 'Edit monitor'}
          </DialogTitle>
          <DialogDescription>
            Configure a space-scoped ExaMonitor with search, schedule, and
            webhook delivery.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Monitor Artificial Intelligence"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of results</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        value={field.value as number | string | undefined}
                        onChange={event => {
                          const raw = event.target.value;
                          const parsed = raw === '' ? undefined : Number(raw);
                          field.onChange(parsed);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="query"
              // disabled={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search query</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[88px]"
                      placeholder="Latest news on artificial intelligence"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger period</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-white dark:bg-zinc-900">
                          <SelectValue placeholder="Select a period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MONITOR_PERIOD_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isCreateMode && (
              <>
                <FormField
                  control={form.control}
                  name="webhookEventsText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webhook events</FormLabel>
                      <FormControl>
                        <Input placeholder="monitor.run.completed" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of events.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="contentsText"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Optional contents JSON</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className={cn('min-h-[160px] font-mono text-xs')}
                            placeholder='{"text": true}'
                          />
                        </FormControl>
                        <FormDescription>
                          Leave empty to omit it from the request.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="outputSchemaText"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Optional output schema JSON</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[160px] font-mono text-xs"
                            placeholder='{"type": "object"}'
                          />
                        </FormControl>
                        <FormDescription>
                          Empty values are omitted. An empty object is never
                          sent.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metadataText"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>Optional metadata JSON</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[160px] font-mono text-xs"
                            placeholder='{"team": "research"}'
                          />
                        </FormControl>
                        <FormDescription>
                          Use a JSON object only when needed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {mode === 'create' ? 'Create monitor' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
