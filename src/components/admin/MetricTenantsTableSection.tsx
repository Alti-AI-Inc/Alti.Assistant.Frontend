'use client';

import {
  getTenants,
  updateTenantStatus,
  type AdminTenantListItem,
  type TenantLifecycleStatus,
} from '@/actions/adminActions';
import {
  parseAdminListPayload,
} from '@/components/admin/AdminPaginatedDatasetHelpers';
import { TenantStatusBadge } from '@/components/admin/TenantStatusBadge';
import { TenantAdministrationDialog } from '@/components/admin/TenantAdministrationDialog';
import { TenantDetailDialog } from '@/components/admin/TenantDetailDialog';
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
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Building2, Mail, MoreHorizontal, Search, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DUMMY_TENANTS } from '@/utils/dummyData';
import { toast } from 'sonner';

type StatusConfirm = {
  tenantId: string;
  tenantName: string;
  status: TenantLifecycleStatus;
};

export function MetricTenantsTableSection() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  const [tenants, setTenants] = useState<AdminTenantListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const pendingTableRefreshRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailTenantId, setDetailTenantId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [adminTenantId, setAdminTenantId] = useState<string | null>(null);
  const [adminTenantLabel, setAdminTenantLabel] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);

  const [statusConfirm, setStatusConfirm] = useState<StatusConfirm | null>(
    null,
  );
  const [statusConfirmBusy, setStatusConfirmBusy] = useState(false);

  const loadTenants = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const res = await getTenants(accessToken, {
        page: 1,
        limit: 5000,
        sortBy: 'name',
        sortOrder: 'asc',
      });
      if (res.success && res.data !== undefined && res.data !== null) {
        const { list } = parseAdminListPayload<AdminTenantListItem>(
          res.data,
        );
        setTenants(list);
      } else {
        setTenants([]);
      }
    } catch (e) {
      console.error(e);
      setTenants([]);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [accessToken]);

  const scheduleTableRefresh = useCallback(() => {
    if (adminOpen) {
      pendingTableRefreshRef.current = true;
      return;
    }
    void loadTenants();
  }, [adminOpen, loadTenants]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

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
        scheduleTableRefresh();
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    },
    [accessToken, scheduleTableRefresh],
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
    return 'Cancelled is typically irreversible for billing and access. Confirm only if you intend to close this team.';
  };

  // Combine real tenants and dummy tenants, avoiding duplicate subdomains or names
  const combinedTenants = [...tenants];
  DUMMY_TENANTS.forEach(dummy => {
    if (
      !combinedTenants.some(
        t =>
          (t.subdomain || '').toLowerCase() === dummy.subdomain.toLowerCase() ||
          (t.name || '').toLowerCase() === dummy.name.toLowerCase()
      )
    ) {
      combinedTenants.push(dummy);
    }
  });

  const filteredTenants = combinedTenants
    .filter(t => {
      const term = searchTerm.toLowerCase().trim();
      const ownerEmail =
        typeof t.ownerId === 'object' && t.ownerId !== null ? t.ownerId.email : '';
      return (
        (t.name || '').toLowerCase().includes(term) ||
        (t.subdomain || '').toLowerCase().includes(term) ||
        ownerEmail.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  if (!accessToken) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center text-muted-foreground">
          Sign in to load teams.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-4">
      {/* Full-width Search Bar */}
      <div className="relative w-full flex-none">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
        <Input
          placeholder="Search team creator email addresses..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 h-12 w-full text-base rounded-lg border-black/10 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* Structured Teams Grid List */}
      {isLoading && tenants.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {filteredTenants.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm bg-white dark:bg-gray-900">
              No matching teams found
            </div>
          ) : (
            <div className="flex flex-col gap-2 pb-4">
              {filteredTenants.map(t => {
                const ownerEmail =
                  typeof t.ownerId === 'object' && t.ownerId !== null
                    ? t.ownerId.email
                    : '—';
                return (
                  <div
                    key={t._id}
                    className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-white/90 dark:bg-gray-900/90 border border-black/5 dark:border-white/5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 items-center cursor-pointer"
                    onClick={() => openDetail(t._id)}
                  >
                    <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate select-all">
                        {ownerEmail}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-center" onClick={e => e.stopPropagation()}>
                      <TenantStatusBadge status={t.status} />
                    </div>
                    <div className="col-span-2 text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize text-right truncate">
                      {t.plan || '—'}
                    </div>
                    <div className="col-span-2 flex items-center justify-end" onClick={e => e.stopPropagation()}>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                            aria-label="Open tenant actions"
                          >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                          <DropdownMenuItem
                            onClick={() =>
                              openAdministration({
                                tenantId: t._id,
                                tenantName: t.name || t.subdomain || t._id,
                              })
                            }
                          >
                            <Shield className="mr-2 h-4 w-4 opacity-70 text-black" />
                            Administration
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDetail(t._id)}>
                            View details…
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-amber-600 focus:text-amber-600"
                            onClick={() =>
                              handleTenantStatusIntent({
                                tenantId: t._id,
                                tenantName: t.name || t.subdomain || t._id,
                                status: 'suspended',
                              })
                            }
                          >
                            Suspend Team
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() =>
                              handleTenantStatusIntent({
                                tenantId: t._id,
                                tenantName: t.name || t.subdomain || t._id,
                                status: 'cancelled',
                              })
                            }
                          >
                            Cancel Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
            if (pendingTableRefreshRef.current) {
              pendingTableRefreshRef.current = false;
              void loadTenants();
            }
          }
        }}
        tenantId={adminTenantId}
        tenantLabel={adminTenantLabel}
        accessToken={accessToken}
        onSuccess={scheduleTableRefresh}
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
    </div>
  );
}
