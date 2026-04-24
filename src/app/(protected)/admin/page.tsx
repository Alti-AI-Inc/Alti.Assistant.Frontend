import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react';

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

const kpiCards = [
  {
    title: 'Total Users',
    value: '12,840',
    delta: '+8.4% this month',
    icon: Users,
  },
  {
    title: 'Active Organizations',
    value: '428',
    delta: '+5.1% this month',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Monthly Revenue',
    value: '$48,920',
    delta: '+11.7% this month',
    icon: CreditCard,
  },
  {
    title: 'Platform Health',
    value: '99.94%',
    delta: 'No incidents in 21 days',
    icon: ShieldCheck,
  },
];

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

const moduleWidgets = [
  {
    title: 'Chat Sessions',
    value: '3,920',
    hint: 'Active this week',
    icon: MessageSquare,
    href: '/',
  },
  {
    title: 'Knowledge Bases',
    value: '248',
    hint: 'Indexed workspaces',
    icon: BookOpen,
    href: '/knowledge',
  },
  {
    title: 'My Chatbots',
    value: '92',
    hint: 'Published assistants',
    icon: Bot,
    href: '/my-chatbots',
  },
  {
    title: 'Agent Store',
    value: '36',
    hint: 'Installed agents',
    icon: Store,
    href: '/agent-store',
  },
];

const funnelMetrics = [
  { step: 'Signups', value: '1,480', conversion: 100 },
  { step: 'Activated Users', value: '1,102', conversion: 74 },
  { step: 'Paid Subscriptions', value: '428', conversion: 38 },
];

export default function AdminDashboardPage() {
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
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <CardContent>
                  <p className="text-muted-foreground text-xs">{card.delta}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {moduleWidgets.map(widget => {
            const Icon = widget.icon;
            return (
              <Card key={widget.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardDescription>{widget.title}</CardDescription>
                  <Icon className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-semibold">{widget.value}</div>
                  <p className="text-muted-foreground text-xs">{widget.hint}</p>
                  <Button asChild size="sm" variant="outline" className="mt-1">
                    <Link href={widget.href}>Open</Link>
                  </Button>
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

        <section className="grid gap-4">
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
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4">
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
