'use client';

import {
  getTenants,
  updateTenantStatus,
  type AdminTenantListItem,
  type TenantLifecycleStatus,
} from '@/actions/adminActions';
import {
  paginationLabel,
  parseAdminListPayload,
  type SortOrder,
} from '@/components/admin/AdminPaginatedDatasetHelpers';
import { TenantAdministrationDialog } from '@/components/admin/TenantAdministrationDialog';
import { TenantDetailDialog } from '@/components/admin/TenantDetailDialog';
import { TenantsTable } from '@/components/admin/TenantsTable';
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
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { RefreshCw, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

type StatusConfirm = {
  tenantId: string;
  tenantName: string;
  status: TenantLifecycleStatus;
};

export function MetricTenantsTableSection() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  const [tenants, setTenants] = useState<AdminTenantListItem[]>([]);
  const [meta, setMeta] = useState<{
    total?: number;
    page?: number;
    limit?: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [detailTenantId, setDetailTenantId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [adminTenantId, setAdminTenantId] = useState<string | null>(null);
  const [adminTenantLabel, setAdminTenantLabel] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);

  const [statusConfirm, setStatusConfirm] = useState<StatusConfirm | null>(
    null,
  );
  const [statusConfirmBusy, setStatusConfirmBusy] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const loadTenants = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const res = await getTenants(accessToken, {
        page,
        limit: PAGE_SIZE,
        searchTerm: searchTerm.trim() || undefined,
        sortBy,
        sortOrder,
      });
      if (res.success && res.data !== undefined && res.data !== null) {
        const { list, meta: m } =
          parseAdminListPayload<AdminTenantListItem>(res.data);
        setTenants(list);
        setMeta(m);
      } else {
        setTenants([]);
        setMeta(undefined);
      }
    } catch (e) {
      console.error(e);
      setTenants([]);
      setMeta(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, page, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const handleSortField = useCallback((field: string) => {
    setSortBy(prev => {
      if (prev === field) {
        setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortOrder('asc');
      return field;
    });
  }, []);

  const openDetail = useCallback((tenantId: string) => {
    setDetailTenantId(tenantId);
    setDetailOpen(true);
  }, []);

  const openAdministration = useCallback(
    (args: { tenantId: string; tenantName: string }) => {
      setAdminTenantId(args.tenantId);
      setAdminTenantLabel(args.tenantName);
      setAdminOpen(true);
    },
    [],
  );

  const applyTenantStatus = useCallback(
    async (tenantId: string, status: TenantLifecycleStatus) => {
      if (!accessToken) return;
      const res = await updateTenantStatus(tenantId, status, accessToken);
      if (res.success) {
        toast.success(
          `Tenant status set to ${status.charAt(0).toUpperCase()}${status.slice(1)}.`,
        );
        await loadTenants();
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    },
    [accessToken, loadTenants],
  );

  const handleTenantStatusIntent = useCallback(
    (args: {
      tenantId: string;
      tenantName: string;
      status: TenantLifecycleStatus;
    }) => {
      if (!accessToken) return;
      if (args.status === 'active') {
        void (async () => {
          await applyTenantStatus(args.tenantId, 'active');
        })();
        return;
      }
      setStatusConfirm({
        tenantId: args.tenantId,
        tenantName: args.tenantName,
        status: args.status,
      });
    },
    [accessToken, applyTenantStatus],
  );

  const confirmStatusDescription = (s: TenantLifecycleStatus) => {
    if (s === 'suspended') {
      return 'Suspended tenants keep data but should lose access until reactivated.';
    }
    return 'Cancelled is typically irreversible for billing and access. Confirm only if you intend to close this organization.';
  };

  const pagination = paginationLabel(meta, tenants.length, PAGE_SIZE);
  const totalPages =
    pagination.total <= 0
      ? 1
      : Math.max(1, Math.ceil(pagination.total / pagination.limit));

  if (!accessToken) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>All tenants</CardTitle>
          <CardDescription>Sign in to load organizations.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-4">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle>All tenants</CardTitle>
            <CardDescription>
              From <code className="text-xs">/admin/tenants</code>. Click a row
              for read-only details. Use the row menu → Administration for
              status and trial, or use quick status shortcuts.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] md:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search name or subdomain…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => void loadTenants()}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              <TenantsTable
                tenants={tenants}
                sortable={{
                  sortBy,
                  sortOrder,
                  onSort: handleSortField,
                }}
                onRowClick={openDetail}
                onTenantStatusIntent={handleTenantStatusIntent}
                onOpenAdministration={openAdministration}
              />
              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-sm">
                  {pagination.total === 0
                    ? 'No rows'
                    : `Showing ${pagination.from}–${pagination.to} of ${pagination.total}`}{' '}
                  (page {pagination.page} / {totalPages})
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      isLoading ||
                      page >= totalPages ||
                      pagination.total === 0
                    }
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <TenantDetailDialog
        open={detailOpen}
        onOpenChange={open => {
          setDetailOpen(open);
          if (!open) setDetailTenantId(null);
        }}
        tenantId={detailTenantId}
        accessToken={accessToken}
      />

      <TenantAdministrationDialog
        open={adminOpen}
        onOpenChange={open => {
          setAdminOpen(open);
          if (!open) {
            setAdminTenantId(null);
            setAdminTenantLabel('');
          }
        }}
        tenantId={adminTenantId}
        tenantLabel={adminTenantLabel}
        accessToken={accessToken}
        onSuccess={() => void loadTenants()}
      />

      <AlertDialog
        open={!!statusConfirm}
        onOpenChange={open => {
          if (!open && !statusConfirmBusy) setStatusConfirm(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Set “{statusConfirm?.tenantName}” to{' '}
              <span className="capitalize">{statusConfirm?.status}</span>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusConfirm
                ? confirmStatusDescription(statusConfirm.status)
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={statusConfirmBusy}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                statusConfirm?.status === 'cancelled'
                  ? 'bg-rose-600 text-white hover:bg-rose-600/90 dark:bg-rose-600 dark:hover:bg-rose-600/90'
                  : statusConfirm?.status === 'suspended'
                    ? 'bg-amber-700 text-white hover:bg-amber-700/90 dark:bg-amber-700 dark:hover:bg-amber-700/90'
                    : undefined
              }
              disabled={statusConfirmBusy}
              onClick={e => {
                e.preventDefault();
                if (!statusConfirm) return;
                setStatusConfirmBusy(true);
                void (async () => {
                  try {
                    await applyTenantStatus(
                      statusConfirm.tenantId,
                      statusConfirm.status,
                    );
                    setStatusConfirm(null);
                  } finally {
                    setStatusConfirmBusy(false);
                  }
                })();
              }}
            >
              {statusConfirmBusy ? 'Updating…' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
