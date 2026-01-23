'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { MoreHorizontal, XCircle, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import {
  cancelSubscription,
  type StripeSubscription,
  type StripeCustomer,
} from '@/actions/stripeActions';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface SubscriptionsTableProps {
  subscriptions: StripeSubscription[];
  customers: StripeCustomer[];
  onRefresh: () => void;
}

const statusColors: Record<
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

export function SubscriptionsTable({
  subscriptions,
  customers,
  onRefresh,
}: SubscriptionsTableProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const [cancelSubId, setCancelSubId] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || customer?.email || customerId;
  };

  const handleCancel = async () => {
    if (!cancelSubId || !accessToken) return;

    setIsCanceling(true);
    try {
      const result = await cancelSubscription(cancelSubId, accessToken);
      if (result.success) {
        onRefresh();
      } else {
        console.error('Failed to cancel subscription:', result.message);
      }
    } finally {
      setIsCanceling(false);
      setCancelSubId(null);
    }
  };

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No subscriptions yet</h3>
          <p className="text-muted-foreground text-sm">
            Subscriptions will appear here once customers subscribe to plans
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Period</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map(subscription => {
              const price = subscription.items?.data?.[0]?.price;
              return (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="font-medium">
                      {getCustomerName(subscription.customer)}
                    </div>
                    <div className="text-muted-foreground font-mono text-xs">
                      {subscription.customer}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {price?.nickname || 'Subscription Plan'}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {price?.recurring?.interval === 'month'
                        ? 'Monthly'
                        : price?.recurring?.interval === 'year'
                          ? 'Yearly'
                          : price?.recurring?.interval || '—'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {price?.unit_amount
                        ? formatCurrency(price.unit_amount)
                        : '—'}
                    </span>
                    {price?.recurring?.interval && (
                      <span className="text-muted-foreground text-sm">
                        /{price.recurring.interval}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusColors[subscription.status] || 'secondary'}
                    >
                      {subscription.status.charAt(0).toUpperCase() +
                        subscription.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-muted-foreground">
                        {formatDate(
                          new Date(subscription.current_period_start * 1000),
                        )}
                      </div>
                      <div>
                        to{' '}
                        {formatDate(
                          new Date(subscription.current_period_end * 1000),
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(new Date(subscription.created * 1000))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setCancelSubId(subscription.id)}
                          disabled={subscription.status === 'canceled'}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Subscription
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!cancelSubId}
        onOpenChange={() => setCancelSubId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this subscription? The customer
              will lose access to their subscription benefits immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>
              Keep Active
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isCanceling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
