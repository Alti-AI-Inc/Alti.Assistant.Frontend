import { getAllPayments, getAllUsers, type AdminUser } from '@/actions/adminActions';
import { MetricMonthlyRevenuePaymentsTableSection } from '@/components/admin/MetricMonthlyRevenuePaymentsTableSection';
import { MetricTotalUsersTableSection } from '@/components/admin/MetricTotalUsersTableSection';
import { UsersTable } from '@/components/admin/UsersTable';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MetricBarChart } from './MetricBarChart';

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
  const { metric } = await params;
  const metricKey = metric as MetricKey;
  const config = metricConfigs[metricKey];

  if (!config) {
    notFound();
  }

  let monthlyData = config.monthlyData;

  if (metricKey === 'monthly-revenue') {
    const paymentsRes = await getAllPayments();
    const paymentsPayload: any = paymentsRes?.data ?? paymentsRes ?? [];
    const paymentsList = Array.isArray(paymentsPayload)
      ? paymentsPayload
      : (paymentsPayload?.data ?? []);

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );

    const sums: Record<string, number> = {};
    monthKeys.forEach(k => (sums[k] = 0));

    paymentsList.forEach((p: any) => {
      const date = p.createdAt
        ? new Date(p.createdAt)
        : p.createdAtMillis
          ? new Date(p.createdAtMillis)
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
    const usersRes = await getAllUsers();
    const usersPayload: any = usersRes?.data ?? usersRes ?? [];
    const usersList = Array.isArray(usersPayload)
      ? usersPayload
      : (usersPayload?.data ?? []);

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );
    const uniquePerMonth: Record<string, Set<string>> = {};
    monthKeys.forEach(k => (uniquePerMonth[k] = new Set()));

    usersList.forEach((u: any) => {
      if (!u.createdAt) return;
      const date = new Date(u.createdAt);
      const key = monthKeyFromDate(date);
      if (!(key in uniquePerMonth)) return;
      if (u.tenantId) uniquePerMonth[key].add(String(u.tenantId));
      else uniquePerMonth[key].add(String(u._id));
    });

    monthlyData = monthKeys.map(k => ({
      month: monthLabelFromKey(k),
      value: uniquePerMonth[k]?.size || 0,
    }));
  }

  if (metricKey === 'total-users') {
    const usersRes = await getAllUsers();
    const usersPayload: any = usersRes?.data ?? usersRes ?? [];
    const usersList = Array.isArray(usersPayload)
      ? usersPayload
      : (usersPayload?.data ?? []);

    const months = getLastNMonths(6);
    const monthKeys = months.map(
      m =>
        `${m.year}-${String(new Date(`${m.month} 1`).getMonth() + 1).padStart(2, '0')}`,
    );

    const counts: Record<string, number> = {};
    monthKeys.forEach(k => (counts[k] = 0));

    usersList.forEach((u: any) => {
      const date = u.createdAt
        ? new Date(u.createdAt)
        : u.createdAtMillis
          ? new Date(u.createdAtMillis)
          : null;
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

        <section className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Latest Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(latest, config.unit)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Month-over-Month Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div className="text-2xl font-bold text-emerald-600">
                +{growth}%
              </div>
            </CardContent>
          </Card>
        </section>

        

        {metricKey === 'total-users' && <MetricTotalUsersTableSection />}

        {metricKey === 'monthly-revenue' && (
          <MetricMonthlyRevenuePaymentsTableSection />
        )}
        {metricKey === 'active-organizations' && <OrganizationMetricsSection />}
      </div>
    </div>
  );
}

async function OrganizationMetricsSection() {
  const usersRes = await getAllUsers();
  const usersPayload: any = usersRes?.data ?? usersRes ?? [];
  const usersList: AdminUser[] = Array.isArray(usersPayload)
    ? usersPayload
    : (usersPayload?.data ?? []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users / Organizations</CardTitle>
        <CardDescription>
          Complete list of all users with their organization details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersTable users={usersList} onRefresh={() => {}} />
      </CardContent>
    </Card>
  );
}
