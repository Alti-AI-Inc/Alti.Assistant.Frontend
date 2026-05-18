// MetricMonthlyRevenuePaymentsTableSection.tsx
'use client';

import {
  getAllSubscriptions,
  type PaymentRecord,
} from '@/actions/adminActions';
import {
  paginationLabel,
  type SortOrder,
} from '@/components/admin/AdminPaginatedDatasetHelpers';
import { PaymentsTable } from '@/components/admin/PaymentsTable';
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

export function MetricMonthlyRevenuePaymentsTableSection() {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [meta, setMeta] = useState<{
    total?: number;
    page?: number;
    limit?: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  const loadPayments = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const res = await getAllSubscriptions(accessToken, {
        page,
        limit: PAGE_SIZE,
        searchTerm: searchTerm.trim() || undefined,
        sortBy,
        sortOrder,
      });

      if (res.success && res.data !== undefined && res.data !== null) {
        const subs: any[] = Array.isArray(res.data)
          ? res.data
          : (res.data?.data ?? []);

        const list: PaymentRecord[] = subs.map((s) => {
          // userId is populated: { _id, email }
          const userEmail =
            typeof s.userId === 'object' && s.userId !== null
              ? (s.userId.email ?? '—')
              : '—';

          // productId is populated: { _id, plan, name, price }
          // s.price is a Stripe price ID string — NOT a number, ignore it for amount
          const productObj =
            typeof s.productId === 'object' && s.productId !== null
              ? s.productId
              : null;

          const planName =
            productObj?.name ??
            productObj?.plan ??
            s.plan_name ??
            '—';

          // productObj.price is in dollars (e.g. 50) → convert to cents
          const priceCents =
            productObj?.price != null && !isNaN(Number(productObj.price))
              ? Math.round(Number(productObj.price) * 100)
              : 0;

          return {
            _id: s._id,
            price: priceCents,        // e.g. 5000  (= $50.00)
            planName,                  // e.g. "Execute"
            userEmail,                 // e.g. "anik561460@gmail.com"
            createdAt: s.createdAt ?? s.currentPeriodStart,
          };
        });

        const m = (res as any).data?.meta ?? {
          total: list.length,
          page,
          limit: PAGE_SIZE,
        };

        setPayments(list);
        setMeta(m);
      } else {
        setPayments([]);
        setMeta(undefined);
      }
    } catch (e) {
      console.error(e);
      setPayments([]);
      setMeta(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, page, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

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

  const pagination = paginationLabel(meta, payments.length, PAGE_SIZE);
  const totalPages =
    pagination.total <= 0
      ? 1
      : Math.max(1, Math.ceil(pagination.total / pagination.limit));

  if (!accessToken) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>Sign in to load payments.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>All Payments</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] md:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search (e.g. plan name, email...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => void loadPayments()}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
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
            <PaymentsTable
              payments={payments}
              sortable={{
                sortBy,
                sortOrder,
                onSort: handleSortField,
              }}
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
                    isLoading || page >= totalPages || pagination.total === 0
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
  );
}