'use client';

import {
  assignUserSubscription,
  getAdminSubscriptionPackages,
  getAdminTenantMembers,
  getTenantById,
  updateTenantStatus,
  type AdminSubscriptionPackage,
  type AdminTenantDetail,
  type AdminTenantMember,
  type TenantLifecycleStatus,
} from '@/actions/adminActions';
import { resolveAssignableTenantMembers } from '@/utils/adminTenantMembers';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Check, Sparkles } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
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
  const [statusBaseline, setStatusBaseline] =
    useState<TenantLifecycleStatus | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [members, setMembers] = useState<AdminTenantMember[]>([]);
  const [packages, setPackages] = useState<AdminSubscriptionPackage[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('month');
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [membersLoadError, setMembersLoadError] = useState<string | null>(null);
  const [packagesLoadError, setPackagesLoadError] = useState<string | null>(
    null,
  );

  // FIX: Reset only non-loading-dependent fields when tenantId changes.
  // Do NOT reset selectedUserId/selectedPackageId here — they are set
  // correctly after the async fetch completes in the effect below.
  useEffect(() => {
    setAssignmentError(null);
    setMembersLoadError(null);
    setPackagesLoadError(null);
  }, [tenantId]);

  useEffect(() => {
    if (!open || !tenantId || !accessToken) {
      setDetail(null);
      setLoadError(null);
      setStatusBaseline(null);
      setMembers([]);
      setPackages([]);
      // FIX: Also reset selection state when dialog closes
      setSelectedUserId('');
      setSelectedPackageId('');
      setSelectedDuration('month');
      return;
    }

    let cancelled = false;
    const softRefresh = refreshTick > 0 && detail !== null;

    if (!softRefresh) {
      setSelectedUserId('');
      setSelectedPackageId('');
      setSelectedDuration('month');
      setLoading(true);
      setLoadError(null);
      setMembersLoading(true);
      setPackagesLoading(true);
      setAssignmentError(null);
      setMembersLoadError(null);
      setPackagesLoadError(null);
    }

    void (async () => {
      const [detailRes, membersRes, packagesRes] = await Promise.all([
        getTenantById(tenantId, accessToken),
        getAdminTenantMembers(tenantId, accessToken),
        getAdminSubscriptionPackages(accessToken),
      ]);

      if (cancelled) return;

      // FIX: Always clear loading flags together, unconditionally
      setLoading(false);
      setMembersLoading(false);
      setPackagesLoading(false);

      if (detailRes.success && detailRes.data) {
        setDetail(detailRes.data);
        const s = (detailRes.data.status || '').toLowerCase();
        if (isTenantLifecycleStatus(s)) {
          setStatusBaseline(s);
          setSelectedStatus(s);
        } else {
          setStatusBaseline(null);
          setSelectedStatus('active');
        }
      } else {
        setDetail(null);
        setLoadError(detailRes.message || 'Could not load tenant');
      }

      const tenantDetail =
        detailRes.success && detailRes.data ? detailRes.data : null;

      const assignableMembers = resolveAssignableTenantMembers(
        membersRes.success && Array.isArray(membersRes.data)
          ? membersRes.data
          : [],
        tenantDetail,
        tenantId,
      );

      setMembers(assignableMembers);
      setSelectedUserId(assignableMembers[0]?.userId._id ?? '');

      if (!membersRes.success) {
        setMembersLoadError(
          membersRes.message || 'Could not load users for this tenant.',
        );
      } else if (assignableMembers.length === 0) {
        setMembersLoadError(
          'No users were returned for this tenant. Add a member to the organization first.',
        );
      } else {
        setMembersLoadError(null);
      }

      const orderedPackages =
        packagesRes.success && Array.isArray(packagesRes.data)
          ? [...packagesRes.data].sort(
              (left, right) => left.price - right.price,
            )
          : [];

      setPackages(orderedPackages);

      const freePackage = orderedPackages.find(
        pkg =>
          pkg.plan === 'free' ||
          pkg.name.toLowerCase().includes('free') ||
          pkg.price === 0,
      );
      const fallbackPackage = freePackage ?? orderedPackages[0] ?? null;

      setSelectedPackageId(fallbackPackage?._id ?? '');
      setSelectedDuration(fallbackPackage?.interval ?? 'month');

      if (!packagesRes.success) {
        setPackagesLoadError(
          packagesRes.message || 'Could not load subscription packages.',
        );
      } else if (orderedPackages.length === 0) {
        setPackagesLoadError(
          'No subscription packages were returned. Check GET /admin/subscription-packages.',
        );
      } else {
        setPackagesLoadError(null);
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
    (statusBaseline !== null ? selectedStatus !== statusBaseline : true);

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

  const selectedPackage = packages.find(pkg => pkg._id === selectedPackageId);

  const handleAssignSubscription = async () => {
    // FIX: Remove the redundant guard that was showing "Select user" error
    // even when a user was already selected. The button's own `disabled`
    // prop already prevents reaching here without valid selections.
    if (!accessToken || !selectedUserId || !selectedPackageId) {
      setAssignmentError('Select both a user and a package before saving.');
      return;
    }

    setAssignSaving(true);
    setAssignmentError(null);
    try {
      const res = await assignUserSubscription(
        selectedUserId,
        {
          productId: selectedPackageId,
          duration: selectedDuration,
        },
        accessToken,
      );

      if (res.success) {
        const planLabel =
          selectedPackage?.displayName ||
          selectedPackage?.name ||
          'subscription';
        toast.success(
          selectedPackage?.plan === 'free' || selectedPackage?.price === 0
            ? `Free plan (${planLabel}) assigned successfully.`
            : `${planLabel} assigned successfully.`,
        );
        bump();
      } else {
        setAssignmentError(res.message || 'Failed to assign subscription.');
        toast.error(res.message || 'Failed to assign subscription.');
      }
    } finally {
      setAssignSaving(false);
    }
  };

  const canAssign =
    !assignSaving &&
    !membersLoading &&
    !packagesLoading &&
    members.length > 0 &&
    !!selectedUserId &&
    !!selectedPackageId;

  const isFreeSelection =
    selectedPackage?.plan === 'free' || selectedPackage?.price === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="space-y-1 border-b px-5 pt-5 pr-12 pb-4">
          <DialogTitle className="text-base">Administration</DialogTitle>
          <DialogDescription className="line-clamp-2 text-xs">
            {tenantLabel}
            {detail?.name && detail.name !== tenantLabel
              ? ` · ${detail.name}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(70vh,520px)] overflow-y-auto px-5 py-4">
          {loading && !detail && (
            <div className="flex justify-center py-10">
              <Spinner className="h-8 w-8" />
            </div>
          )}
          {loadError && !detail && (
            <p className="text-destructive text-sm">{loadError}</p>
          )}
          {detail && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <TenantStatusBadge status={detail.status} />
                <Badge variant="secondary" className="text-xs capitalize">
                  {detail.plan}
                </Badge>
              </div>

              <div className="space-y-4">
                <AdminBlock title="Lifecycle status">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Select
                      value={selectedStatus}
                      onValueChange={v =>
                        setSelectedStatus(v as TenantLifecycleStatus)
                      }
                    >
                      <SelectTrigger
                        id="admin-tenant-status"
                        className="h-9 w-full sm:flex-1"
                      >
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
                      className="h-9 shrink-0 sm:px-4"
                      disabled={statusSaving || !statusDirty || !accessToken}
                      onClick={() => void handleSaveStatus()}
                    >
                      {statusSaving ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </AdminBlock>

                <AdminBlock title="Subscription assignment">
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="admin-subscription-user"
                          className="text-xs"
                        >
                          Member
                        </Label>
                        {membersLoading ? (
                          <div className="text-muted-foreground flex h-9 items-center gap-2 text-sm">
                            <Spinner className="h-4 w-4" />
                            Loading members…
                          </div>
                        ) : (
                          <Select
                            value={selectedUserId}
                            onValueChange={setSelectedUserId}
                            disabled={members.length === 0}
                          >
                            <SelectTrigger
                              id="admin-subscription-user"
                              className="h-9"
                            >
                              <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                              {members.map(member => (
                                <SelectItem
                                  key={member.userId._id}
                                  value={member.userId._id}
                                >
                                  {member.userId.email || member.userId._id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="admin-subscription-duration"
                          className="text-xs"
                        >
                          Duration
                        </Label>
                        <Select
                          value={selectedDuration}
                          onValueChange={setSelectedDuration}
                          disabled={!selectedPackage}
                        >
                          <SelectTrigger
                            id="admin-subscription-duration"
                            className="h-9"
                          >
                            <SelectValue placeholder="Duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {!membersLoading && members.length === 0 && (
                      <div className="text-muted-foreground bg-muted/30 rounded-md border border-dashed px-3 py-2.5 text-xs">
                        {membersLoadError ||
                          'No tenant users available for subscription assignment.'}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs">Package</Label>
                      {packagesLoading ? (
                        <div className="flex justify-center rounded-md border border-dashed py-6">
                          <Spinner className="h-5 w-5" />
                        </div>
                      ) : packages.length === 0 ? (
                        <p className="text-muted-foreground bg-muted/30 rounded-md border border-dashed px-3 py-2.5 text-xs">
                          {packagesLoadError ||
                            'No subscription packages available.'}
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {packages.map(pkg => {
                            const selected = pkg._id === selectedPackageId;
                            const isFree =
                              pkg.plan === 'free' || pkg.price === 0;
                            return (
                              <button
                                key={pkg._id}
                                type="button"
                                onClick={() => {
                                  setSelectedPackageId(pkg._id);
                                  setSelectedDuration(pkg.interval || 'month');
                                }}
                                className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
                                  selected
                                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                                    : 'border-border hover:bg-muted/50'
                                }`}
                              >
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                    selected
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-muted-foreground/40'
                                  }`}
                                >
                                  {selected && (
                                    <Check className="h-2.5 w-2.5" />
                                  )}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-1.5">
                                    <span className="truncate text-sm font-medium">
                                      {pkg.displayName || pkg.name}
                                    </span>
                                    {isFree && (
                                      <Badge
                                        variant="outline"
                                        className="h-5 shrink-0 px-1.5 text-[10px]"
                                      >
                                        <Sparkles className="mr-0.5 h-2.5 w-2.5" />
                                        Free
                                      </Badge>
                                    )}
                                  </span>
                                  <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                                    {pkg.features?.dailyRequestLimit ?? 0}{' '}
                                    req/day ·{' '}
                                    {formatStorage(
                                      pkg.features?.storagePerUser,
                                    )}
                                  </span>
                                </span>
                                <span className="shrink-0 text-right text-sm font-medium tabular-nums">
                                  {pkg.price === 0 ? '$0' : `$${pkg.price}`}
                                  <span className="text-muted-foreground block text-[10px] font-normal">
                                    /{pkg.interval}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {assignmentError && (
                      <p className="text-destructive text-xs">
                        {assignmentError}
                      </p>
                    )}
                  </div>
                </AdminBlock>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 border-t px-5 py-3 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!canAssign}
            onClick={() => void handleAssignSubscription()}
          >
            {assignSaving
              ? 'Assigning…'
              : isFreeSelection
                ? 'Assign free plan'
                : 'Assign plan'}
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
    <section className="space-y-3">
      <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function formatStorage(value?: number) {
  if (!value || value <= 0) return '0 GB';
  const gb = value / 1024 / 1024 / 1024;
  return `${gb % 1 === 0 ? gb.toFixed(0) : gb.toFixed(1)} GB`;
}
