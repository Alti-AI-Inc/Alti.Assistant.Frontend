'use client';

import { MetricBarChart } from '@/app/(protected)/admin/metrics/[metric]/MetricBarChart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';

type MonthlyPoint = { month: string; value: number };

const PAGE_LIMIT = 500;

function monthKeyFromDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function parseRecordDate(raw: unknown): Date | null {
  if (raw == null) return null;
  if (typeof raw === 'number') {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof raw === 'string') {
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** Every calendar month from start through end (inclusive), by month start. */
function enumerateMonthKeys(start: Date, end: Date): string[] {
  const keys: string[] = [];
  const y = start.getFullYear();
  const m = start.getMonth();
  const endY = end.getFullYear();
  const endM = end.getMonth();
  let cy = y;
  let cm = m;
  while (cy < endY || (cy === endY && cm <= endM)) {
    keys.push(
      `${cy}-${String(cm + 1).padStart(2, '0')}`,
    );
    cm++;
    if (cm > 11) {
      cm = 0;
      cy++;
    }
  }
  return keys;
}

function labelFromMonthKey(key: string) {
  const [ys, ms] = key.split('-').map(Number);
  const d = new Date(ys, ms - 1, 1);
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

function unwrapListAndMeta(payload: unknown): {
  list: Record<string, unknown>[];
  total?: number;
} {
  if (payload === null || payload === undefined) {
    return { list: [] };
  }

  if (Array.isArray(payload)) {
    return { list: payload as Record<string, unknown>[] };
  }

  if (typeof payload !== 'object') {
    return { list: [] };
  }

  const root = payload as {
    meta?: { total?: number };
    data?: unknown;
  };

  // Typical: { meta: { total }, data: [...] }
  if (Array.isArray(root.data)) {
    return {
      list: root.data as Record<string, unknown>[],
      total: root.meta?.total,
    };
  }

  // Sometimes API nests again
  const inner = root.data as { meta?: { total?: number }; data?: unknown } | undefined;
  if (
    inner &&
    typeof inner === 'object' &&
    Array.isArray(inner.data)
  ) {
    return {
      list: inner.data as Record<string, unknown>[],
      total: inner.meta?.total ?? root.meta?.total,
    };
  }

  return { list: [] };
}

async function fetchAllAdminUsers(
  baseUrl: string,
  headers: Record<string, string>,
): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let page = 1;
  let total: number | undefined;

  for (;;) {
    const url = `${baseUrl}/admin/all-user?page=${page}&limit=${PAGE_LIMIT}`;
    const res = await fetch(url, { headers });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        typeof body.message === 'string'
          ? body.message
          : res.statusText || 'Users fetch failed',
      );
    }

    const { list, total: metaTotal } = unwrapListAndMeta(
      body.data ?? body ?? {},
    );
    if (metaTotal !== undefined) total = metaTotal;
    all.push(...list);

    if (!list.length) break;
    if (total !== undefined && all.length >= total) break;
    if (list.length < PAGE_LIMIT) break;
    page++;
  }

  return all;
}

async function fetchAllAdminPayments(
  baseUrl: string,
  headers: Record<string, string>,
): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let page = 1;
  let total: number | undefined;

  for (;;) {
    const url = `${baseUrl}/admin/all-payment?page=${page}&limit=${PAGE_LIMIT}`;
    const res = await fetch(url, { headers });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        typeof body.message === 'string'
          ? body.message
          : res.statusText || 'Payments fetch failed',
      );
    }

    const { list, total: metaTotal } = unwrapListAndMeta(
      body.data ?? body ?? {},
    );
    if (metaTotal !== undefined) total = metaTotal;
    all.push(...list);

    if (!list.length) break;
    if (total !== undefined && all.length >= total) break;
    if (list.length < PAGE_LIMIT) break;
    page++;
  }

  return all;
}

function buildMonthlyUserCounts(users: Record<string, unknown>[]) {
  const counts: Record<string, number> = {};
  let earliest: Date | null = null;
  let latest: Date | null = null;

  for (const u of users) {
    const d =
      parseRecordDate(u.createdAt) ||
      parseRecordDate(
        typeof u.createdAtMillis === 'number' ? u.createdAtMillis : null,
      );
    if (!d) continue;

    const k = monthKeyFromDate(d);
    counts[k] = (counts[k] || 0) + 1;
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    if (!earliest || monthStart < earliest) earliest = monthStart;
    if (!latest || monthStart > latest) latest = monthStart;
  }

  return { counts, earliest, latest };
}

function buildMonthlyPaymentTotals(payments: Record<string, unknown>[]) {
  const sums: Record<string, number> = {};
  let earliest: Date | null = null;
  let latest: Date | null = null;

  for (const p of payments) {
    const d =
      parseRecordDate(p.createdAt) ||
      parseRecordDate(
        typeof p.createdAtMillis === 'number' ? p.createdAtMillis : null,
      );
    if (!d) continue;

    const k = monthKeyFromDate(d);
    const cents = typeof p.price === 'number' ? p.price : 0;
    sums[k] = (sums[k] || 0) + cents;

    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    if (!earliest || monthStart < earliest) earliest = monthStart;
    if (!latest || monthStart > latest) latest = monthStart;
  }

  return { sumsCents: sums, earliest, latest };
}

function defaultYearRange(now: Date) {
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start, end };
}

type Props = {
  accessToken: string | undefined;
};

export function AdminDashboardMonthCharts({ accessToken }: Props) {
  const [userPoints, setUserPoints] = useState<MonthlyPoint[]>([]);
  const [paymentPoints, setPaymentPoints] = useState<MonthlyPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'https://apiv2.asonai.com/api/v1';

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };

        const [users, payments] = await Promise.all([
          fetchAllAdminUsers(baseUrl, headers),
          fetchAllAdminPayments(baseUrl, headers),
        ]);

        const now = new Date();
        const u = buildMonthlyUserCounts(users);
        const pmt = buildMonthlyPaymentTotals(payments);

        let rangeStart: Date;
        let rangeEnd: Date;

        if (!u.earliest && !pmt.earliest) {
          const d = defaultYearRange(now);
          rangeStart = d.start;
          rangeEnd = d.end;
        } else {
          const candidates = [u.earliest, pmt.earliest].filter(
            Boolean,
          ) as Date[];
          const floor = new Date(
            Math.min(...candidates.map(d => d.getTime())),
          );
          rangeStart = new Date(floor.getFullYear(), floor.getMonth(), 1);

          const endCandidates = [
            u.latest,
            pmt.latest,
            new Date(now.getFullYear(), now.getMonth(), 1),
          ].filter(Boolean) as Date[];
          const rangeEndTs = Math.max(...endCandidates.map(d => d.getTime()));
          const latest = new Date(rangeEndTs);
          rangeEnd = new Date(latest.getFullYear(), latest.getMonth(), 1);
        }

        const monthKeys = enumerateMonthKeys(rangeStart, rangeEnd);

        setUserPoints(
          monthKeys.map(key => ({
            month: labelFromMonthKey(key),
            value: u.counts[key] || 0,
          })),
        );

        setPaymentPoints(
          monthKeys.map(key => ({
            month: labelFromMonthKey(key),
            value: Math.round((pmt.sumsCents[key] || 0) / 100),
          })),
        );
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [accessToken]);

  if (!accessToken) return null;

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Charts</CardTitle>
          <CardDescription>Could not load month-wise data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Month-wise Charts</CardTitle>
          <CardDescription>Loading aggregated data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-[200px] items-center justify-center text-sm">
            Loading charts…
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Month-wise Bar Chart — Users</CardTitle>
          <CardDescription>
            New user registrations by monthly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetricBarChart data={userPoints} unit="count" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Month-wise Bar Chart — Payments</CardTitle>
          <CardDescription>
          Total payment revenue by monthly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetricBarChart data={paymentPoints} unit="currency" />
        </CardContent>
      </Card>
    </section>
  );
}
