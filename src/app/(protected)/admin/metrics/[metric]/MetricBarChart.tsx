'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipProps } from 'recharts';

type MonthlyPoint = {
  month: string;
  value: number;
};

type MetricBarChartProps = {
  data: MonthlyPoint[];
  unit: 'count' | 'currency';
};

function formatValue(value: number, unit: MetricBarChartProps['unit']) {
  if (unit === 'currency') {
    return `$${value.toLocaleString()}`;
  }
  return value.toLocaleString();
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: MetricBarChartProps['unit'] }) {
  if (!active || !payload?.length) return null;

  const rawValue = Number(payload[0]?.value ?? 0);

  return (
    <div className="rounded-md border bg-background px-3 py-2 shadow-md">
      <p className="text-foreground text-xs font-semibold">{label}</p>
      <p className="text-foreground text-sm font-medium">
        {formatValue(rawValue, unit)}
      </p>
    </div>
  );
}

export function MetricBarChart({ data, unit }: MetricBarChartProps) {
  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, left: 12, bottom: 0 }}
          barCategoryGap={22}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={value => formatValue(Number(value), unit)}
            width={80}
          />
          <Tooltip
            cursor={false}
            allowEscapeViewBox={{ x: true, y: true }}
            wrapperStyle={{ zIndex: 20 }}
            offset={16}
            content={<CustomTooltip unit={unit} />}
          />
          <Bar
            dataKey="value"
            fill="hsl(var(--primary))"
            barSize={42}
            maxBarSize={56}
            shape={<Rectangle radius={[8, 8, 0, 0]} />}
            activeBar={<Rectangle radius={[8, 8, 0, 0]} />}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
