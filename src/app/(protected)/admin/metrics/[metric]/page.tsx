import { auth } from '@/auth';
import {
  AdminTenantListItem,
  AdminUser,
  getAllPayments,
  getAllSubscriptions,
  getTenants,
  getAllUsers,
  PaymentRecord,
  SubscriptionRecord,
} from '@/actions/adminActions';
import { MetricMonthlyRevenuePaymentsTableSection } from '@/components/admin/MetricMonthlyRevenuePaymentsTableSection';
import { MetricTenantsTableSection } from '@/components/admin/MetricTenantsTableSection';
import { MetricTotalUsersTableSection } from '@/components/admin/MetricTotalUsersTableSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type MetricKey = 'total-users' | 'active-organizations' | 'monthly-revenue';

type MonthlyPoint = {
  month: string;
  value: number;
};

type MetricConfig = {
  title: string;
  subtitle: string;
  unit: 'count' | 'currency';
  monthlyData: MonthlyPoint[];
};

type TenantsPayload = {
  data?: AdminTenantListItem[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

type SubscriptionTotalsPayload = {
  totalSubscriptions?: number;
  totalRevenue?: number;
  subscriptions?: SubscriptionRecord[];
  data?: SubscriptionRecord[];
};

function normalizeTenantsPayload(payload: unknown): TenantsPayload {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  return payload as TenantsPayload;
}

function normalizeSubscriptionTotalsPayload(
  payload: unknown,
): SubscriptionTotalsPayload {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  return payload as SubscriptionTotalsPayload;
}

function normalizePaymentsPayload(payload: unknown): PaymentRecord[] {
  if (Array.isArray(payload)) {
    return payload as PaymentRecord[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: PaymentRecord[] }).data;
  }

  return [];
}

function normalizeUsersPayload(payload: unknown): AdminUser[] {
  if (Array.isArray(payload)) {
    return payload as AdminUser[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: AdminUser[] }).data;
  }

  return [];
}

function normalizeTenantsList(payload: unknown): AdminTenantListItem[] {
  if (Array.isArray(payload)) {
    return payload as AdminTenantListItem[];
  }

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: AdminTenantListItem[] }).data;
  }

  return [];
}

const metricConfigs: Record<MetricKey, MetricConfig> = {
  'total-users': {
    title: 'Total Users',
    subtitle: 'Month-wise total users trend for the last 6 months.',
    unit: 'count',
    monthlyData: [
      { month: 'Jan', value: 10620 },
      { month: 'Feb', value: 11180 },
      { month: 'Mar', value: 11790 },
      { month: 'Apr', value: 12110 },
      { month: 'May', value: 12530 },
      { month: 'Jun', value: 12840 },
    ],
  },
  'active-organizations': {
    title: 'Active Organizations',
    subtitle: 'Month-wise active organization count for the last 6 months.',
    unit: 'count',
    monthlyData: [
      { month: 'Jan', value: 341 },
      { month: 'Feb', value: 356 },
      { month: 'Mar', value: 378 },
      { month: 'Apr', value: 395 },
      { month: 'May', value: 410 },
      { month: 'Jun', value: 428 },
    ],
  },
  'monthly-revenue': {
    title: 'Monthly Revenue',
    subtitle: 'Month-wise revenue trend for the last 6 months.',
    unit: 'currency',
    monthlyData: [
      { month: 'Jan', value: 35200 },
      { month: 'Feb', value: 37850 },
      { month: 'Mar', value: 40560 },
      { month: 'Apr', value: 42940 },
      { month: 'May', value: 45680 },
      { month: 'Jun', value: 48920 },
    ],
  },
};

function getLastNMonths(n: number) {
  const res: { month: string; year: number }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toLocaleString('en-US', { month: 'short' });
    res.push({ month, year: d.getFullYear() });
  }
  return res;
}

function monthKeyFromDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabelFromKey(key: string) {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString('en-US', { month: 'short' });
}

function formatValue(value: number, unit: MetricConfig['unit']) {
  if (unit === 'currency') {
    return `$${value.toLocaleString()}`;
  }
  return value.toLocaleString();
}

export default async function MetricDetailsPage({
  params,
}: {
  params: Promise<{ metric: string }>;
}) {
  const session = await auth();
  const accessToken = session?.accessToken;
  const { metric } = await params;
  const metricKey = metric as MetricKey;
  const config = metricConfigs[metricKey];

  if (!config) {
    notFound();
  }

  let monthlyData = config.monthlyData;

  let totalOrganizationsFromApi = 0;
  let activeOrganizationsFromApi = 0;
  let totalSubscriptionsFromApi = 0;
  let totalRevenueFromApi = 0;

  if (metricKey === 'monthly-revenue') {
    try {
      const subsRes = await getAllSubscriptions(accessToken);
      const subsPayload = normalizeSubscriptionTotalsPayload(
        subsRes?.data ?? subsRes,
      );

      totalSubscriptionsFromApi = Number(subsPayload.totalSubscriptions ?? 0);
      totalRevenueFromApi = Number(subsPayload.totalRevenue ?? 0);
    } catch {
      totalSubscriptionsFromApi = 0;
      totalRevenueFromApi = 0;
    }
  }

  if (metricKey === 'monthly-revenue') {
    // fetch payments for monthly trend
    const paymentsRes = await getAllPayments(accessToken);
    const paymentsList = normalizePaymentsPayload(
      paymentsRes?.data ?? paymentsRes,
    );

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );

    const sums: Record<string, number> = {};
    monthKeys.forEach(k => (sums[k] = 0));

    paymentsList.forEach(p => {
      const date = p.createdAt
        ? new Date(p.createdAt)
        : null;
      if (!date) return;
      const key = monthKeyFromDate(date);
      if (key in sums) {
        sums[key] = (sums[key] || 0) + (p.price || 0);
      }
    });

    monthlyData = monthKeys.map(k => ({
      month: monthLabelFromKey(k),
      value: Math.round((sums[k] || 0) / 100),
    }));
  }

  if (metricKey === 'active-organizations') {
    const tenantsRes = await getTenants(accessToken, { page: 1, limit: 5000 });
    const tenantsPayload = normalizeTenantsPayload(
      tenantsRes?.data ?? tenantsRes,
    );
    const tenantsList = normalizeTenantsList(tenantsRes?.data ?? tenantsRes);

    totalOrganizationsFromApi = Number(
      tenantsPayload.meta?.total ?? tenantsList.length,
    );
    activeOrganizationsFromApi = tenantsList.filter(
      tenant => tenant.status?.toLowerCase() === 'active',
    ).length;

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );
    const activeCounts: Record<string, number> = {};
    monthKeys.forEach(k => (activeCounts[k] = 0));

    tenantsList.forEach(tenant => {
      if (!tenant.createdAt || tenant.status?.toLowerCase() !== 'active') return;
      const date = new Date(tenant.createdAt);
      const key = monthKeyFromDate(date);
      if (!(key in activeCounts)) return;
      activeCounts[key] = (activeCounts[key] || 0) + 1;
    });

    monthlyData = monthKeys.map(k => ({
      month: monthLabelFromKey(k),
      value: activeCounts[k] || 0,
    }));
  }

  if (metricKey === 'total-users') {
    const usersRes = await getAllUsers(accessToken);
    const usersList = normalizeUsersPayload(usersRes?.data ?? usersRes);

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );

    const counts: Record<string, number> = {};
    monthKeys.forEach(k => (counts[k] = 0));

    usersList.forEach(u => {
      const date = u.createdAt ? new Date(u.createdAt) : null;
      if (!date) return;
      const key = monthKeyFromDate(date);
      if (key in counts) {
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    monthlyData = monthKeys.map(k => ({
      month: monthLabelFromKey(k),
      value: counts[k] || 0,
    }));
  }

  const latest = monthlyData[monthlyData.length - 1]?.value ?? 0;
  const previous = monthlyData[monthlyData.length - 2]?.value ?? 0;
  const growth =
    previous > 0 ? (((latest - previous) / previous) * 100).toFixed(1) : '0.0';

  const summaryCards =
    metricKey === 'active-organizations'
      ? [
          {
            title: 'Total Organizations',
            value: String(totalOrganizationsFromApi),
          },
          {
            title: 'Active Organizations',
            value: String(activeOrganizationsFromApi),
          },
        ]
      : metricKey === 'monthly-revenue'
        ? [
            {
              title: 'Total Subscriptions',
              value: String(totalSubscriptionsFromApi),
            },
            {
              title: 'Total Revenue',
              value: formatValue(totalRevenueFromApi, 'currency'),
            },
            {
              title: 'Month-over-Month Growth',
              value: `+${growth}%`,
              isGrowth: true,
            },
          ]
      : [
          {
            title: 'Month-over-Month Growth',
            value: `+${growth}%`,
            isGrowth: true,
          },
        ];

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              {config.title}
            </h1>
            <p className="text-muted-foreground">{config.subtitle}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <section
          className={`grid gap-4 ${
            summaryCards.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
          }`}
        >
          {summaryCards.map(card => (
            <Card key={card.title}>
              <CardHeader className={card.isGrowth ? undefined : 'pb-2'}>
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent
                className={card.isGrowth ? 'flex items-center gap-2' : undefined}
              >
                {card.isGrowth && (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                )}
                <div
                  className={`text-2xl font-bold ${
                    card.isGrowth ? 'text-emerald-600' : ''
                  }`}
                >
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {metricKey === 'total-users' && <MetricTotalUsersTableSection />}

        {metricKey === 'monthly-revenue' && (
          <MetricMonthlyRevenuePaymentsTableSection />
        )}
        {metricKey === 'active-organizations' && <MetricTenantsTableSection />}
      </div>
    </div>
  );
}
