'use client';

import {
  getTenantById,
  type AdminTenantDetail,
  type AdminTenantOwnerRef,
} from '@/actions/adminActions';
import { TenantStatusBadge } from '@/components/admin/TenantStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { formatDateTime } from '@/utils/formatters';
import { type ReactNode, useEffect, useState } from 'react';

function formatBytes(n: number) {
  if (!Number.isFinite(n) || n < 0) return '—';
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

function tenantSubdomain(d: AdminTenantDetail) {
  return d.subdomain ?? d.subDomain ?? '—';
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-3 gap-y-1 text-sm sm:grid-cols-[140px_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words font-medium">{value}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
      <dl className="bg-muted/40 space-y-2 rounded-md border p-3">{children}</dl>
    </div>
  );
}

function ownerLabel(ownerId: AdminTenantDetail['ownerId']) {
  if (!ownerId) return '—';
  if (typeof ownerId === 'string') return ownerId;
  const o = ownerId as AdminTenantOwnerRef;
  return o.email ? `${o.email} (${o._id})` : o._id;
}

interface TenantDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string | null;
  accessToken: string | undefined;
}

export function TenantDetailDialog({
  open,
  onOpenChange,
  tenantId,
  accessToken,
}: TenantDetailDialogProps) {
  const [detail, setDetail] = useState<AdminTenantDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !tenantId || !accessToken) {
      setDetail(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      const res = await getTenantById(tenantId, accessToken);
      if (cancelled) return;
      setLoading(false);
      if (res.success && res.data) {
        setDetail(res.data);
      } else {
        setDetail(null);
        setError(res.message || 'Could not load tenant');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, tenantId, accessToken]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(85vh,800px)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-4 pr-12">
          <DialogTitle>Tenant details</DialogTitle>
          <DialogDescription>
            {detail?.name ?? (loading ? 'Loading…' : 'Workspace and usage')}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {loading && !detail && (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          )}
          {!loading && error && !detail && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          {detail && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <TenantStatusBadge status={detail.status} />
                <Badge variant="secondary" className="capitalize">
                  {detail.plan}
                </Badge>
                {detail.memberCount != null && (
                  <span className="text-muted-foreground text-xs">
                    {detail.memberCount} members
                  </span>
                )}
              </div>

              <Section title="Workspace">
                <DetailRow label="ID" value={detail._id} />
                <DetailRow label="Name" value={detail.name} />
                <DetailRow label="Subdomain" value={tenantSubdomain(detail)} />
                <DetailRow label="Owner" value={ownerLabel(detail.ownerId)} />
                <DetailRow
                  label="Created"
                  value={
                    detail.createdAt
                      ? formatDateTime(new Date(detail.createdAt))
                      : '—'
                  }
                />
              </Section>

              {detail.settings && (
                <Section title="Settings">
                  <DetailRow
                    label="Allow member invites"
                    value={detail.settings.allowMemberInvites ? 'Yes' : 'No'}
                  />
                  <DetailRow
                    label="Require approval"
                    value={detail.settings.requireApproval ? 'Yes' : 'No'}
                  />
                  <DetailRow
                    label="Max members"
                    value={detail.settings.maxMembers ?? '—'}
                  />
                </Section>
              )}

              {detail.limits && (
                <Section title="Limits">
                  <DetailRow
                    label="Max API calls"
                    value={detail.limits.maxApiCalls?.toLocaleString() ?? '—'}
                  />
                  <DetailRow
                    label="Max storage"
                    value={
                      detail.limits.maxStorage != null
                        ? formatBytes(detail.limits.maxStorage)
                        : '—'
                    }
                  />
                  <DetailRow
                    label="Max users"
                    value={detail.limits.maxUsers ?? '—'}
                  />
                </Section>
              )}

              {detail.usage && (
                <Section title="Usage">
                  <DetailRow
                    label="API calls used"
                    value={detail.usage.apiCallsUsed?.toLocaleString() ?? '—'}
                  />
                  <DetailRow
                    label="Storage used"
                    value={
                      detail.usage.storageUsed != null
                        ? formatBytes(detail.usage.storageUsed)
                        : '—'
                    }
                  />
                  <DetailRow
                    label="Users count"
                    value={detail.usage.usersCount?.toLocaleString() ?? '—'}
                  />
                  <DetailRow
                    label="Last reset"
                    value={
                      detail.usage.lastResetAt
                        ? formatDateTime(new Date(detail.usage.lastResetAt))
                        : '—'
                    }
                  />
                </Section>
              )}

              {detail.subscription && (
                <Section title="Subscription">
                  <DetailRow
                    label="Stripe customer"
                    value={
                      detail.subscription.stripeCustomerId ? (
                        <code className="text-xs">
                          {detail.subscription.stripeCustomerId}
                        </code>
                      ) : (
                        '—'
                      )
                    }
                  />
                </Section>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0 border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
