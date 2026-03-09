'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Loader2,
  Zap,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { StripeProviderWithErrorBoundary } from '@/components/stripe/StripeProvider';
import {
  getMyPersonalSubscription,
  getMyPaymentMethods,
  cancelTenantSubscription,
  type StripePaymentMethod,
} from '@/actions/stripeActions';

interface PersonalSubscription {
  subscriptionId: string;
  planName: string;
  price: number;
  interval: string;
  nextBillingDate: string | null;
  status: string;
  stripePriceId: string;
}

function BillingPageContent() {
  const { data: session } = useSession();
  const router = useRouter();

  const [subscription, setSubscription] = useState<PersonalSubscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const accessToken = session?.accessToken as string | undefined;

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      try {
        const [subRes, pmRes] = await Promise.all([
          getMyPersonalSubscription(accessToken),
          getMyPaymentMethods(accessToken),
        ]);

        if (subRes.success && subRes.data?.hasSubscription && subRes.data.subscription) {
          const stripeObj = subRes.data.subscription;
          const dbRecord = subRes.data.dbRecord;
          const priceItem = stripeObj.items.data[0]?.price;

          setSubscription({
            subscriptionId: stripeObj.id,
            planName: dbRecord?.plan_name || 'Pro',
            price: priceItem?.unit_amount ? priceItem.unit_amount / 100 : 0,
            interval: priceItem?.recurring?.interval || 'month',
            nextBillingDate: stripeObj.current_period_end
              ? new Date(stripeObj.current_period_end * 1000).toLocaleDateString()
              : null,
            status: stripeObj.status,
            stripePriceId: dbRecord?.stripePriceId || '',
          });
        }

        if (pmRes.success && pmRes.data) {
          setPaymentMethods(pmRes.data);
        }
      } catch (err) {
        console.error('[BillingPage] Failed to load data:', err);
        toast.error('Failed to load billing information');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [accessToken]);

  const handleCancelSubscription = async () => {
    if (!accessToken || !subscription?.subscriptionId) return;

    setIsCancelling(true);
    try {
      const result = await cancelTenantSubscription(
        subscription.subscriptionId,
        accessToken,
      );

      if (result.success) {
        toast.success('Subscription cancelled successfully.');
        setSubscription(null);
        router.push('/upgrade');
      } else {
        toast.error(result.message || 'Failed to cancel subscription');
      }
    } catch (err) {
      console.error('[BillingPage] Cancel failed:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal subscription and payment methods
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <CreditCard className="size-5 text-muted-foreground" />
          </CardTitle>
          <CardDescription>Your active personal subscription</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold capitalize">
                      {subscription.planName}
                    </span>
                    <Badge
                      variant={
                        subscription.status === 'active' ? 'default' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                  {subscription.price > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ${subscription.price} / {subscription.interval}
                    </div>
                  )}
                  {subscription.nextBillingDate && (
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      Next billing: {subscription.nextBillingDate}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/upgrade')}
                >
                  <Zap className="size-4 mr-2" />
                  Change Plan
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="text-destructive hover:text-destructive">
                      Cancel Subscription
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-destructive" />
                        Cancel Subscription?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Your{' '}
                        <span className="font-medium capitalize">
                          {subscription.planName}
                        </span>{' '}
                        plan will remain active until the end of the current billing
                        period. After that, you will be downgraded to the free plan.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isCancelling && (
                          <Loader2 className="size-4 mr-2 animate-spin" />
                        )}
                        Yes, Cancel
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">Free Plan</div>
                <p className="text-sm text-muted-foreground mt-1">
                  You are currently on the free plan.
                </p>
              </div>
              <Button onClick={() => router.push('/upgrade')}>
                <Zap className="size-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payment Methods</span>
            <Link href="/upgrade">
              <Button variant="outline" size="sm">
                <CreditCard className="size-4 mr-2" />
                Add via Upgrade
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>Your saved payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="size-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No payment methods saved</p>
              <p className="text-sm mt-1">
                Add a payment method when you upgrade your plan.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                    {method.card?.brand?.slice(0, 4) || 'card'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      •••• •••• •••• {method.card?.last4}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {method.card?.exp_month}/{method.card?.exp_year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BillingPage() {
  return (
    <StripeProviderWithErrorBoundary>
      <BillingPageContent />
    </StripeProviderWithErrorBoundary>
  );
}
