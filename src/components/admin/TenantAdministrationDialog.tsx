'use client';

import {
  extendTenantTrial,
  getTenantById,
  updateTenantStatus,
  type AdminTenantDetail,
  type TenantLifecycleStatus,
} from '@/actions/adminActions';
import {
  isTenantLifecycleStatus,
  TenantStatusBadge,
} from '@/components/admin/TenantStatusBadge';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { type ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TenantAdministrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string | null;
  tenantLabel: string;
  accessToken: string | undefined;
  onSuccess?: () => void;
}

export function TenantAdministrationDialog({
  open,
  onOpenChange,
  tenantId,
  tenantLabel,
  accessToken,
  onSuccess,
}: TenantAdministrationDialogProps) {
  const [detail, setDetail] = useState<AdminTenantDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const [selectedStatus, setSelectedStatus] =
    useState<TenantLifecycleStatus>('active');
  const [statusBaseline, setStatusBaseline] = useState<
    TenantLifecycleStatus | null
  >(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [trialDays, setTrialDays] = useState('30');
  const [trialSaving, setTrialSaving] = useState(false);

  useEffect(() => {
    setTrialDays('30');
  }, [tenantId]);

  useEffect(() => {
    if (!open || !tenantId || !accessToken) {
      setDetail(null);
      setLoadError(null);
      setStatusBaseline(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    void (async () => {
      const res = await getTenantById(tenantId, accessToken);
      if (cancelled) return;
      setLoading(false);
      if (res.success && res.data) {
        setDetail(res.data);
        const s = (res.data.status || '').toLowerCase();
        if (isTenantLifecycleStatus(s)) {
          setStatusBaseline(s);
          setSelectedStatus(s);
        } else {
          setStatusBaseline(null);
          setSelectedStatus('active');
        }
      } else {
        setDetail(null);
        setLoadError(res.message || 'Could not load tenant');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, tenantId, accessToken, refreshTick]);

  const bump = () => {
    setRefreshTick(t => t + 1);
    onSuccess?.();
  };

  const statusDirty =
    !!detail &&
    (statusBaseline !== null
      ? selectedStatus !== statusBaseline
      : true);

  const handleSaveStatus = async () => {
    if (!tenantId || !accessToken || !detail) return;
    setStatusSaving(true);
    try {
      const res = await updateTenantStatus(
        tenantId,
        selectedStatus,
        accessToken,
      );
      if (res.success) {
        toast.success('Tenant status updated.');
        bump();
      } else {
        toast.error(res.message || 'Update failed');
      }
    } finally {
      setStatusSaving(false);
    }
  };

  const handleExtendTrial = async () => {
    if (!tenantId || !accessToken) return;
    const trimmed = trialDays.trim();
    if (!trimmed || Number(trimmed) <= 0) {
      toast.error('Enter a positive number of days.');
      return;
    }
    setTrialSaving(true);
    try {
      const res = await extendTenantTrial(tenantId, trimmed, accessToken);
      if (res.success) {
        toast.success('Trial extension applied.');
        bump();
      } else {
        toast.error(res.message || 'Request failed');
      }
    } finally {
      setTrialSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b px-6 pt-6 pb-4 pr-12">
          <DialogTitle>Administration</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {tenantLabel}
            {detail?.name && detail.name !== tenantLabel
              ? ` · ${detail.name}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70vh,560px)] overflow-y-auto px-6 py-4">
          {loading && !detail && (
            <div className="flex justify-center py-10">
              <Spinner className="h-8 w-8" />
            </div>
          )}
          {loadError && !detail && (
            <p className="text-destructive text-sm">{loadError}</p>
          )}
          {detail && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <TenantStatusBadge status={detail.status} />
                <Badge variant="secondary" className="capitalize">
                  {detail.plan}
                </Badge>
              </div>

              <AdminBlock title="Lifecycle status">
                <div className="flex flex-col gap-3">
                  <Select
                    value={selectedStatus}
                    onValueChange={v =>
                      setSelectedStatus(v as TenantLifecycleStatus)
                    }
                  >
                    <SelectTrigger id="admin-tenant-status" className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={statusSaving || !statusDirty || !accessToken}
                    onClick={() => void handleSaveStatus()}
                  >
                    {statusSaving ? 'Saving…' : 'Update status'}
                  </Button>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    <code className="text-xs">PATCH</code>{' '}
                    <code className="text-xs">/admin/tenants/:id/status</code>{' '}
                    with body{' '}
                    <code className="text-xs">{`{ "status" }`}</code>.
                  </p>
                </div>
              </AdminBlock>

              <AdminBlock title="Extend trial">
                <div className="flex flex-col gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="admin-trial-days">Days to add</Label>
                    <Input
                      id="admin-trial-days"
                      inputMode="numeric"
                      value={trialDays}
                      onChange={e => setTrialDays(e.target.value)}
                      placeholder="e.g. 120"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={trialSaving || !accessToken}
                    onClick={() => void handleExtendTrial()}
                  >
                    {trialSaving ? 'Applying…' : 'Extend trial'}
                  </Button>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    <code className="text-xs">POST</code>{' '}
                    <code className="text-xs">
                      /admin/tenants/:id/extend-trial
                    </code>{' '}
                    with{' '}
                    <code className="text-xs">{`{ "days": "…" }`}</code>.
                  </p>
                </div>
              </AdminBlock>
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}
