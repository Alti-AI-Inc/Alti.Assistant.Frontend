import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

  const latest = config.monthlyData[config.monthlyData.length - 1]?.value ?? 0;
  const previous = config.monthlyData[config.monthlyData.length - 2]?.value ?? 0;
  const growth =
    previous > 0 ? (((latest - previous) / previous) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
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
              <CardTitle className="text-sm font-medium">Latest Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatValue(latest, config.unit)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Month-over-Month Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <div className="text-2xl font-bold text-emerald-600">+{growth}%</div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Month-wise Bar Chart</CardTitle>
            <CardDescription>
              Visual trend for {config.title.toLowerCase()} over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MetricBarChart data={config.monthlyData} unit={config.unit} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
