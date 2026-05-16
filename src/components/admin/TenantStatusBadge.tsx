'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const LIFECYCLE = new Set(['active', 'suspended', 'cancelled']);

export function tenantStatusBadgeClass(status: string | null | undefined) {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'active':
      return 'border-emerald-500/40 bg-emerald-500/[0.12] text-emerald-950 shadow-none dark:border-emerald-400/35 dark:bg-emerald-500/15 dark:text-emerald-50';
    case 'trial':
      return 'border-sky-500/40 bg-sky-500/[0.11] text-sky-950 shadow-none dark:border-sky-400/35 dark:bg-sky-500/14 dark:text-sky-50';
    case 'suspended':
      return 'border-amber-600/45 bg-amber-500/[0.14] text-amber-950 shadow-none dark:border-amber-500/40 dark:bg-amber-500/16 dark:text-amber-50';
    case 'cancelled':
    case 'canceled':
      return 'border-rose-700/40 bg-rose-600/[0.12] text-rose-950 shadow-none dark:border-rose-500/38 dark:bg-rose-500/14 dark:text-rose-50';
    default:
      return 'text-muted-foreground';
  }
}

export function isTenantLifecycleStatus(
  s: string,
): s is 'active' | 'suspended' | 'cancelled' {
  return LIFECYCLE.has(s.toLowerCase());
}

export function TenantStatusBadge({
  status,
  className,
}: {
  status?: string | null;
  className?: string;
}) {
  const label = status?.trim() || '—';
  const tone = tenantStatusBadgeClass(status);
  return (
    <Badge
      variant="outline"
      className={cn('border capitalize shadow-none', tone, className)}
    >
      {label}
    </Badge>
  );
}
