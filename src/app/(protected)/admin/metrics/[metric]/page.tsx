import {
  AdminTenantListItem,
  AdminUser,
  getAllPayments,
  getAllSubscriptions,
  getAllUsers,
  getTenants,
  PaymentRecord,
  SubscriptionRecord,
} from '@/actions/adminActions';
import { auth } from '@/auth';
import { MetricMonthlyRevenuePaymentsTableSection } from '@/components/admin/MetricMonthlyRevenuePaymentsTableSection';
import { MetricTenantsTableSection } from '@/components/admin/MetricTenantsTableSection';
import { MetricTotalUsersTableSection } from '@/components/admin/MetricTotalUsersTableSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DUMMY_USERS, DUMMY_TENANTS } from '@/utils/dummyData';

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

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: PaymentRecord[] }).data;
  }

  return [];
}

function normalizeUsersPayload(payload: unknown): AdminUser[] {
  if (Array.isArray(payload)) {
    return payload as AdminUser[];
  }

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
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
    title: 'Total Teams',
    subtitle: 'Month-wise total teams trend for the last 6 months.',
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

  let totalUsersFromList = 0;
  let newUsersToday = 0;
  let newUsersThisWeek = 0;
  let newUsersThisMonth = 0;
  let paidUsersCount = 0;
  let freeUsersCount = 0;

  let newTeamsToday = 0;
  let newTeamsThisWeek = 0;
  let newTeamsThisMonth = 0;
  let totalTeamsCount = 0;

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
      const date = p.createdAt ? new Date(p.createdAt) : null;
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
    const tenantsList = normalizeTenantsList(tenantsRes?.data ?? tenantsRes);

    // Combine real tenants and dummy tenants, avoiding duplicate subdomains or names
    const combinedList = [...tenantsList];
    DUMMY_TENANTS.forEach(dummy => {
      if (
        !combinedList.some(
          t =>
            (t.subdomain || '').toLowerCase() === dummy.subdomain.toLowerCase() ||
            (t.name || '').toLowerCase() === dummy.name.toLowerCase()
        )
      ) {
        combinedList.push(dummy);
      }
    });

    const teamsList = combinedList.filter(
      tenant => (tenant.usage?.usersCount ?? tenant.memberCount ?? 1) >= 2,
    );
    totalTeamsCount = teamsList.length;

    const now = new Date();

    // Today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    newTeamsToday = teamsList.filter(t => {
      if (!t.createdAt) return false;
      const d = new Date(t.createdAt);
      return d >= todayStart;
    }).length;

    // This Week
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0);
    newTeamsThisWeek = teamsList.filter(t => {
      if (!t.createdAt) return false;
      const d = new Date(t.createdAt);
      return d >= sunday;
    }).length;

    // This Month
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    newTeamsThisMonth = teamsList.filter(t => {
      if (!t.createdAt) return false;
      const d = new Date(t.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    totalOrganizationsFromApi = totalTeamsCount;
    activeOrganizationsFromApi = combinedList.filter(
      tenant => (tenant.usage?.usersCount ?? tenant.memberCount ?? 1) === 1,
    ).length;

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );
    const teamCounts: Record<string, number> = {};
    monthKeys.forEach(k => (teamCounts[k] = 0));

    combinedList.forEach(tenant => {
      if (!tenant.createdAt) return;
      const isTeam = (tenant.usage?.usersCount ?? tenant.memberCount ?? 1) >= 2;
      if (!isTeam) return;

      const date = new Date(tenant.createdAt);
      const key = monthKeyFromDate(date);
      if (!(key in teamCounts)) return;
      teamCounts[key] = (teamCounts[key] || 0) + 1;
    });

    monthlyData = monthKeys.map(k => ({
      month: monthLabelFromKey(k),
      value: teamCounts[k] || 0,
    }));
  }

  if (metricKey === 'total-users') {
    const usersRes = await getAllUsers(accessToken);
    const usersList = normalizeUsersPayload(usersRes?.data ?? usersRes);

    // Combine real users and dummy users, avoiding duplicate emails
    const combinedUsers = [...usersList];
    DUMMY_USERS.forEach(dummy => {
      if (!combinedUsers.some(u => (u.email || '').toLowerCase() === dummy.email.toLowerCase())) {
        combinedUsers.push(dummy);
      }
    });

    totalUsersFromList = combinedUsers.length;

    const now = new Date();

    // Today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    newUsersToday = combinedUsers.filter(u => {
      if (!u.createdAt) return false;
      const d = new Date(u.createdAt);
      return d >= todayStart;
    }).length;

    // This Week
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    sunday.setHours(0, 0, 0, 0);
    newUsersThisWeek = combinedUsers.filter(u => {
      if (!u.createdAt) return false;
      const d = new Date(u.createdAt);
      return d >= sunday;
    }).length;

    // This Month
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    newUsersThisMonth = combinedUsers.filter(u => {
      if (!u.createdAt) return false;
      const d = new Date(u.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    paidUsersCount = combinedUsers.filter(u => u.isSubscribed).length;
    freeUsersCount = combinedUsers.filter(u => !u.isSubscribed).length;

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );

    const counts: Record<string, number> = {};
    monthKeys.forEach(k => (counts[k] = 0));

    combinedUsers.forEach(u => {
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
            title: 'Today',
            value: String(newTeamsToday),
          },
          {
            title: 'This Week',
            value: String(newTeamsThisWeek),
          },
          {
            title: 'This Month',
            value: String(newTeamsThisMonth),
          },
          {
            title: 'Total Teams',
            value: String(totalTeamsCount),
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
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-[#F5F5F7] dark:bg-gray-955">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          {config.title}
        </h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Main Workspace Body */}
      <div className={`flex-1 min-h-0 px-8 py-6 ${metricKey === 'total-users' || metricKey === 'active-organizations' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
        <div className={`mx-auto flex w-full max-w-7xl flex-col gap-6 ${metricKey === 'total-users' || metricKey === 'active-organizations' ? 'flex-1 min-h-0' : ''}`}>

        {metricKey === 'total-users' ? (
          <div className="flex flex-col gap-6 flex-none">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Today', value: String(newUsersToday) },
                { title: 'This Week', value: String(newUsersThisWeek) },
                { title: 'This Month', value: String(newUsersThisMonth) },
              ].map(card => (
                <Card key={card.title}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Free Users', value: String(freeUsersCount) },
                { title: 'Paid Users', value: String(paidUsersCount) },
                { title: 'Total Users', value: String(totalUsersFromList) },
              ].map(card => (
                <Card key={card.title}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <section
            className={`grid gap-4 flex-none ${
              summaryCards.length === 2 
                ? 'sm:grid-cols-2' 
                : summaryCards.length === 4 
                  ? 'sm:grid-cols-4' 
                  : 'sm:grid-cols-3'
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
                  className={
                    card.isGrowth ? 'flex items-center gap-2' : undefined
                  }
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
        )}

        {metricKey === 'total-users' && <MetricTotalUsersTableSection />}

        {metricKey === 'monthly-revenue' && (
          <MetricMonthlyRevenuePaymentsTableSection />
        )}
        {metricKey === 'active-organizations' && <MetricTenantsTableSection />}
      </div>
      </div>
    </div>
  );
}
