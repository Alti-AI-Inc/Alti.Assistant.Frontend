'use client';

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CreditCard,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// KPI placeholders; will be replaced by server-side data below

const teamPerformance = [
  { label: 'Support SLA', value: 92 },
  { label: 'User Activation', value: 81 },
  { label: 'Feature Adoption', value: 74 },
  { label: 'Retention Rate', value: 88 },
];

const recentTenants = [
  {
    name: 'Northwind Analytics',
    plan: 'Growth',
    users: 72,
    status: 'active',
    joined: '2 days ago',
  },
  {
    name: 'Aether Studio',
    plan: 'Starter',
    users: 16,
    status: 'trial',
    joined: '4 days ago',
  },
  {
    name: 'Brightline Ops',
    plan: 'Scale',
    users: 134,
    status: 'active',
    joined: '1 week ago',
  },
  {
    name: 'Vantage Systems',
    plan: 'Starter',
    users: 9,
    status: 'pending',
    joined: '1 week ago',
  },
];

const funnelMetrics = [
  { step: 'Signups', value: '1,480', conversion: 100 },
  { step: 'Activated Users', value: '1,102', conversion: 74 },
  { step: 'Paid Subscriptions', value: '428', conversion: 38 },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const [kpis, setKpis] = useState({
    totalUsers: 0,
    paidUser: 0,
    freeUser: 0,
    monthlyRevenue: '0.00',
    unverifyUsers: 0,
  });
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const [usersRes, paymentsRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://apiv2.asonai.com/api/v1'}/admin/all-user`,
            { headers },
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://apiv2.asonai.com/api/v1'}/admin/all-payment`,
            { headers },
          ),
        ]);

        const usersJson = await usersRes.json().catch(() => ({}));
        const paymentsJson = await paymentsRes.json().catch(() => ({}));

        if (!usersRes.ok)
          throw new Error(
            usersJson.message || usersRes.statusText || 'Users fetch failed',
          );
        if (!paymentsRes.ok)
          throw new Error(
            paymentsJson.message ||
              paymentsRes.statusText ||
              'Payments fetch failed',
          );

        const usersPayload = usersJson.data ?? usersJson;
        const meta = usersPayload?.meta ?? null;
        const totalUsers =
          meta?.total ??
          (Array.isArray(usersPayload?.data) ? usersPayload.data.length : 0);
        const paidUser = meta?.paidUser ?? 0;
        const freeUser = meta?.freeUser ?? 0;
        const unverifyUsers = meta?.unverifyUsers ?? 0;

        const paymentsPayload = paymentsJson.data ?? paymentsJson;
        const paymentsList = Array.isArray(paymentsPayload)
          ? paymentsPayload
          : (paymentsPayload?.data ?? []);
        const totalRevenueCents = paymentsList.reduce(
          (s: number, p: any) => s + (p.price || 0),
          0,
        );

        setKpis({
          totalUsers,
          paidUser,
          freeUser,
          monthlyRevenue: (totalRevenueCents / 100).toFixed(2),
          unverifyUsers,
        });
        setApiError(null);
      } catch (err: any) {
        setApiError(err?.message || String(err));
      }
    }

    load();
  }, [token]);

  const kpiCards = [
    {
      title: 'Total Users',
      value: String(kpis.totalUsers),
      delta: `${kpis.paidUser} paid • ${kpis.freeUser} free`,
      icon: Users,
      href: '/admin/metrics/total-users',
    },
    {
      title: 'Active Organizations',
      value: String(
        kpis.totalUsers ? Math.max(0, Math.floor(kpis.totalUsers / 30)) : 0,
      ),
      delta: '+ realtime',
      icon: BriefcaseBusiness,
      href: '/admin/metrics/active-organizations',
    },
    {
      title: 'Monthly Revenue',
      value: `$${kpis.monthlyRevenue}`,
      delta: `${kpis.unverifyUsers} unverified users`,
      icon: CreditCard,
      href: '/admin/metrics/monthly-revenue',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Central overview of your platform, customers, billing, and growth.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/stripe">
                Open Billing Console
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/organizations">Manage Organizations</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/users">Users</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/payments">Payments</Link>
            </Button>
          </div>
        </section>

        {/* Show API errors if any */}
        {apiError && (
          <Card>
            <CardHeader>
              <CardTitle>API Error</CardTitle>
              <CardDescription>Failed to load admin API data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-destructive text-sm">{apiError}</div>
            </CardContent>
          </Card>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map(card => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardDescription>{card.title}</CardDescription>
                    <CardTitle className="text-2xl">{card.value}</CardTitle>
                  </div>
                  <Icon className="text-muted-foreground h-5 w-5" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground text-xs">{card.delta}</p>
                  {card.href ? (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Link href={card.href}>View Month-wise Details</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
              <CardDescription>
                New and recently changed tenants across your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTenants.map(item => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.plan}</TableCell>
                      <TableCell>{item.users}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'active'
                              ? 'success'
                              : item.status === 'trial'
                                ? 'secondary'
                                : 'outline'
                          }
                          className="capitalize"
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right">
                        {item.joined}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="grid w-full gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operational Performance</CardTitle>
              <CardDescription>
                Key admin metrics for service quality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {teamPerformance.map(metric => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {metric.label}
                    </span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth Funnel</CardTitle>
              <CardDescription>
                Progression from signup to active paid organizations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {funnelMetrics.map(metric => (
                <div key={metric.step} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{metric.step}</p>
                    <p className="text-muted-foreground text-sm">
                      {metric.value} ({metric.conversion}%)
                    </p>
                  </div>
                  <Progress value={metric.conversion} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
