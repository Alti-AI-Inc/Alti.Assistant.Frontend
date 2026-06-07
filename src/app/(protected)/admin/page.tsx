'use client';

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CreditCard,
  User,
  UserCheck,
  UsersRound,
  TrendingUp,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  const { data: session, status } = useSession();
  const token = session?.accessToken as string | undefined;
  const isSuperAdmin = session?.user?.role === 'super_admin';

  const [kpis, setKpis] = useState({
    totalUsers: 0,
    paidUser: 0,
    freeUser: 0,
    monthlyRevenue: '0.00',
    unverifyUsers: 0,
    totalTeams: 0,
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !isSuperAdmin) {
      router.replace('/admin/platform-admin');
    }
  }, [status, isSuperAdmin, router]);

  if (status !== 'loading' && !isSuperAdmin) {
    return null; // The useEffect will redirect
  }

  useEffect(() => {
    async function load() {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const base =
          process.env.NEXT_PUBLIC_API_URL || 'https://altihq.com/api/v1';
        const [usersRes, paymentsRes, subsRes, tenantsRes] = await Promise.all([
          fetch(`${base}/admin/all-user`, { headers }),
          fetch(`${base}/admin/all-payment`, { headers }),
          fetch(`${base}/subscription/admin/all`, { headers }),
          fetch(`${base}/admin/tenants?page=1&limit=5000`, { headers }),
        ]);

        const usersJson = await usersRes.json().catch(() => ({}));
        const paymentsJson = await paymentsRes.json().catch(() => ({}));
        const subscriptionsJson = await subsRes.json().catch(() => ({}));
        const tenantsJson = await tenantsRes.json().catch(() => ({}));

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
        // compute totalRevenueCentsFromPayments robustly, handling string price ids
        const totalRevenueCentsFromPayments = paymentsList.reduce(
          (s: number, p: any) => {
            // p.price may be cents (number), dollars (number), or a stripe price id string
            if (p == null) return s;
            if (typeof p.price === 'number') {
              // Heuristic: if > 1000 assume cents, else treat as dollars
              return (
                s +
                (p.price > 1000
                  ? Math.round(p.price)
                  : Math.round(p.price * 100))
              );
            }
            if (typeof p.price === 'string') {
              const parsed = parseFloat(p.price);
              if (!Number.isNaN(parsed)) {
                return (
                  s +
                  (parsed > 1000
                    ? Math.round(parsed)
                    : Math.round(parsed * 100))
                );
              }
            }
            // fallback: try productId.price in dollars
            const prod = p.productId ?? p.product ?? null;
            if (prod && typeof prod.price === 'number')
              return s + Math.round(prod.price * 100);
            return s;
          },
          0,
        );

        // Subscriptions payload (preferred source for active orgs and product info)
        const subsPayload = subsRes.ok
          ? (subscriptionsJson.data ?? subscriptionsJson)
          : [];
        // subsPayload may be { subscriptions: [...], totalRevenue, totalSubscriptions }
        const subsList = Array.isArray(subsPayload)
          ? subsPayload
          : Array.isArray(subsPayload.subscriptions)
            ? subsPayload.subscriptions
            : Array.isArray(subsPayload.data)
              ? subsPayload.data
              : [];

        // If API provides totalRevenue directly (in dollars), prefer it
        const totalRevenueFromApi =
          subsPayload && typeof subsPayload.totalRevenue === 'number'
            ? Number(subsPayload.totalRevenue)
            : undefined;

        // total teams: tenants with 2 or more members
        const tenantsPayload = tenantsRes.ok
          ? (tenantsJson.data ?? tenantsJson)
          : [];
        const tenantsList = Array.isArray(tenantsPayload)
          ? tenantsPayload
          : Array.isArray(tenantsPayload?.data)
            ? tenantsPayload.data
            : [];
        const totalTeams = tenantsList.filter(
          (t: { usage?: { usersCount?: number }; memberCount?: number }) =>
            (t.usage?.usersCount ?? t.memberCount ?? 1) >= 2,
        ).length;

        // total revenue from subscriptions: try productId.price (assumed dollars) or fallback to payments
        let totalRevenueCentsFromSubs = 0;
        if (typeof totalRevenueFromApi === 'number') {
          totalRevenueCentsFromSubs = Math.round(totalRevenueFromApi * 100);
        } else {
          totalRevenueCentsFromSubs = subsList.reduce((acc: number, s: any) => {
            const product = s.productId ?? s.product ?? null;
            if (product && typeof product.price === 'number')
              return acc + Math.round(product.price * 100);
            // try s.price if numeric
            if (typeof s.price === 'number') {
              return (
                acc +
                (s.price > 1000
                  ? Math.round(s.price)
                  : Math.round(s.price * 100))
              );
            }
            if (typeof s.price === 'string') {
              const parsed = parseFloat(s.price);
              if (!Number.isNaN(parsed))
                return (
                  acc +
                  (parsed > 1000
                    ? Math.round(parsed)
                    : Math.round(parsed * 100))
                );
            }
            return acc;
          }, 0);
        }

        const totalRevenueCents =
          totalRevenueCentsFromSubs > 0
            ? totalRevenueCentsFromSubs
            : totalRevenueCentsFromPayments;

        setKpis({
          totalUsers,
          paidUser,
          freeUser,
          monthlyRevenue: (totalRevenueCents / 100).toFixed(2),
          unverifyUsers,
          totalTeams,
        });
        setApiError(null);
      } catch (err: any) {
        setApiError(err?.message || String(err));
      }
    }

    load();
  }, [token]);

  const userAndTeamCards = [
    {
      title: 'Total Free Users',
      value: String(kpis.freeUser ?? 0),
      delta: '',
      icon: User,
      href: '/admin/metrics/total-users?plan=free',
      linkLabel: 'view all of the free users',
    },
    {
      title: 'Total Paid Users',
      value: String(kpis.paidUser ?? 0),
      delta: '',
      icon: UserCheck,
      href: '/admin/metrics/total-users?plan=paid',
      linkLabel: 'view all of the paid users',
    },
    {
      title: 'Total Team Plans',
      value: String(kpis.totalTeams ?? 0),
      delta: '',
      icon: UsersRound,
      href: '/admin/metrics/active-organizations',
      linkLabel: 'view all of the team plans',
    },
  ];

  const revenueCards: {
    title: string;
    value: string;
    delta: string;
    icon: any;
    href?: string;
    linkLabel?: string;
  }[] = [
    {
      title: 'Monthly Recurring Revenues',
      value: `$${Math.round(parseFloat(kpis.monthlyRevenue)).toLocaleString()}`,
      delta: '',
      icon: CreditCard,
    },
    {
      title: 'Annual Recurring Revenues',
      value: `$${Math.round(parseFloat(kpis.monthlyRevenue) * 12).toLocaleString()}`,
      delta: '',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#F5F5F7] dark:bg-gray-955 overflow-hidden">
      {/* Dynamic Header */}
      <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-white dark:bg-gray-950">
        <h1 className="text-base font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/stripe">
              Open Billing Console
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">



        {/* First Row of 3 boxes */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {userAndTeamCards.map(card => {
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
                  {card.delta ? (
                    <p className="text-muted-foreground text-xs">{card.delta}</p>
                  ) : null}
                  {card.href ? (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Link href={card.href}>{card.linkLabel}</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Second Row of 2 boxes */}
        <section className="grid gap-4 sm:grid-cols-2">
          {revenueCards.map(card => {
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
                  {card.delta ? (
                    <p className="text-muted-foreground text-xs">{card.delta}</p>
                  ) : null}
                  {card.href ? (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Link href={card.href}>{card.linkLabel}</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
      </div>
    </div>
  );
}
