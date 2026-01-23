/**
 * Utility functions for formatting data
 */

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date with time
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format amount in cents to currency string
 */
export function formatCurrency(
  amountInCents: number,
  currency: string = 'usd',
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

/**
 * Format subscription status to readable string
 */
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get badge variant color for subscription status
 */
export function getStatusColor(
  status: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const colorMap: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    active: 'default',
    trialing: 'secondary',
    past_due: 'destructive',
    canceled: 'outline',
    incomplete: 'outline',
    unpaid: 'destructive',
  };
  return colorMap[status] || 'secondary';
}
