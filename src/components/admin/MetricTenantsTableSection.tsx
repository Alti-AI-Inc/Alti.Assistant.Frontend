'use client';

import { getTenants, type AdminTenantListItem } from '@/actions/adminActions';
import {
  paginationLabel,
  parseAdminListPayload,
  type SortOrder,
} from '@/components/admin/AdminPaginatedDatasetHelpers';
import { TenantDetailDialog } from '@/components/admin/TenantDetailDialog';
import { TenantsTable } from '@/components/admin/TenantsTable';
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

const PAGE_SIZE = 10;

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
              for full details (
              <code className="text-xs">/admin/tenants/:id</code>).
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
    </>
  );
}
