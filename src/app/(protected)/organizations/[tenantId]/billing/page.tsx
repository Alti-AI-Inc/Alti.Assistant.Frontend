'use client';

import {
  getPaymentMethods,
  type StripePaymentMethod,
} from '@/actions/stripeActions';
import { getCurrentTenant, getTenantUsage } from '@/actions/tenantActions';
import {
  OrganizationPricingCards,
  type OrganizationPlan,
} from '@/components/organizations/OrganizationPricingCards';
import { PaymentConfirmationModal } from '@/components/stripe/PaymentConfirmationModal';
import { StripeProviderWithErrorBoundary } from '@/components/stripe/StripeProvider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { TenantUsage } from '@/types/tenant';
import {
  ArrowLeft,
  CreditCard,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function OrganizationBillingPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<{
    id: string;
    status: string;
    plan: string;
    amount?: number;
    interval?: string;
    nextBillingDate?: string;
    seats: number;
    usedSeats: number;
    billingCycle: string;
    unlimitedSeats?: boolean;
  } | null>(null);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<OrganizationPlan | null>(
    null,
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        const [tenantResponse, usageResponse, paymentMethodsResponse] =
          await Promise.all([
            getCurrentTenant(),
            getTenantUsage(),
            getPaymentMethods(session.accessToken),
          ]);

        console.log('[Billing Page] Tenant Response:', tenantResponse);
        console.log('[Billing Page] Tenant Data:', tenantResponse.data);
        console.log(
          '[Billing Page] Payment Methods:',
          paymentMethodsResponse.data,
        );

        if (tenantResponse.success && tenantResponse.data) {
          const tenant = tenantResponse.data;

          // Extract subscription data from tenant response
          const unlimitedSeats =
            tenant.subscription?.price?.features?.unlimitedSeats || false;
          const subscriptionData = {
            id: tenant.subscription?._id || '',
            status: tenant.status || 'trial',
            plan: tenant.subscription?.price?.plan || tenant.plan || 'free',
            amount: tenant.subscription?.price?.price || 0,
            interval: tenant.subscription?.price?.interval || 'month',
            nextBillingDate: undefined, // Not available in this response
            seats: unlimitedSeats
              ? 999999
              : tenant.settings?.maxMembers || tenant.limits?.maxUsers || 1,
            usedSeats: tenant.usage?.usersCount || 0,
            billingCycle: tenant.subscription?.price?.interval || 'month',
            unlimitedSeats: unlimitedSeats,
          };

          console.log(
            '[Billing Page] Transformed subscription data:',
            subscriptionData,
          );
          setSubscription(subscriptionData);
        }

        if (usageResponse.success && usageResponse.data) {
          setUsage(usageResponse.data);
        }
        console.log('[Payment Methods] Response:', paymentMethodsResponse);
        if (paymentMethodsResponse.success && paymentMethodsResponse.data) {
          setPaymentMethods(paymentMethodsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch billing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tenantId, session?.accessToken]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-8 h-8 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  const planName = subscription?.plan || 'Free';
  const memberCount = usage?.memberCount || 0;

  const handleSelectPlan = (plan: OrganizationPlan) => {
    // Skip payment for free plan
    if (plan.id === 'free' || !plan.priceId) {
      toast.info('Free plan selected');
      setShowPricingPlans(false);
      return;
    }

    // For paid plans, open payment modal
    setSelectedPlan(plan);
    setShowPricingPlans(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);

    // Show success message
    toast.success('Payment successful! Your subscription has been updated.');

    // Refresh subscription and payment methods data
    if (session?.accessToken) {
      try {
        const [tenantResponse, paymentMethodsResponse] = await Promise.all([
          getCurrentTenant(),
          getPaymentMethods(session.accessToken),
        ]);

        if (tenantResponse.success && tenantResponse.data) {
          const tenant = tenantResponse.data;
          const unlimitedSeats =
            tenant.subscription?.price?.features?.unlimitedSeats || false;
          const subscriptionData = {
            id: tenant.subscription?._id || '',
            status: tenant.status || 'trial',
            plan: tenant.subscription?.price?.plan || tenant.plan || 'free',
            amount: tenant.subscription?.price?.price || 0,
            interval: tenant.subscription?.price?.interval || 'month',
            nextBillingDate: undefined,
            seats: unlimitedSeats
              ? 999999
              : tenant.settings?.maxMembers || tenant.limits?.maxUsers || 1,
            usedSeats: tenant.usage?.usersCount || 0,
            billingCycle: tenant.subscription?.price?.interval || 'month',
            unlimitedSeats: unlimitedSeats,
          };
          setSubscription(subscriptionData);
        }

        if (paymentMethodsResponse.success && paymentMethodsResponse.data) {
          setPaymentMethods(paymentMethodsResponse.data);
        }
      } catch (error) {
        console.error('Failed to refresh data:', error);
      }
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  return (
    <StripeProviderWithErrorBoundary>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link
          href={`/organizations/${tenantId}`}
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center text-sm transition-colors"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Billing & Usage</h1>
            <p className="text-muted-foreground mt-1">
              Manage your subscription and view usage statistics
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                <CreditCard className="text-muted-foreground size-5" />
              </CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold capitalize">
                    {planName}
                  </div>
                  {subscription?.amount !== undefined &&
                    subscription?.amount !== null && (
                      <div className="text-muted-foreground mt-1 text-sm">
                        ${subscription.amount} /{' '}
                        {subscription.interval || 'month'}
                      </div>
                    )}
                </div>
                {planName.toLowerCase() === 'free' ? (
                  <Button
                    className="w-full"
                    onClick={() => setShowPricingPlans(true)}
                  >
                    <Zap className="mr-2 size-4" />
                    Upgrade Plan
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowPricingPlans(true)}
                    >
                      Change Plan
                    </Button>
                    {subscription?.nextBillingDate && (
                      <p className="text-muted-foreground text-center text-xs">
                        Next billing:{' '}
                        {new Date(
                          subscription.nextBillingDate,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Members</span>
                <Users className="text-muted-foreground size-5" />
              </CardTitle>
              <CardDescription>Seat usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{memberCount}</span>
                    <span className="text-muted-foreground">
                      /{' '}
                      {subscription?.unlimitedSeats
                        ? 'Unlimited'
                        : subscription?.seats}{' '}
                      seats
                    </span>
                  </div>
                  {subscription?.unlimitedSeats ? (
                    <p className="text-muted-foreground mt-3 text-sm">
                      You can invite unlimited team members with this plan
                    </p>
                  ) : (
                    subscription?.seats && (
                      <Progress
                        value={(memberCount / subscription.seats) * 100}
                        className="mt-3 h-2"
                      />
                    )
                  )}
                </div>
                {!subscription?.unlimitedSeats &&
                  subscription?.seats &&
                  memberCount >= subscription.seats && (
                    <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-950/20">
                      <TrendingUp className="mt-0.5 size-4 shrink-0 text-yellow-600" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-900 dark:text-yellow-100">
                          Seat limit reached
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">
                          Add more seats to invite additional members
                        </p>
                      </div>
                    </div>
                  )}
                {subscription?.unlimitedSeats ? (
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 size-4" />
                    Invite Team Members
                  </Button>
                ) : (
                  subscription?.seats &&
                  memberCount < subscription.seats && (
                    <Button variant="outline" className="w-full">
                      <Users className="mr-2 size-4" />
                      Manage Seats
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Methods</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // TODO: Add payment method modal
                  toast.info('Add payment method functionality coming soon');
                }}
              >
                <CreditCard className="mr-2 size-4" />
                Add Payment Method
              </Button>
            </CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethods.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <CreditCard className="mx-auto mb-3 size-12 opacity-50" />
                <p>No payment methods added</p>
                <p className="mt-1 text-sm">
                  Add a payment method to enable billing
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className="hover:bg-accent/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white uppercase">
                        {method.card?.brand || 'card'}
                      </div>
                      <div>
                        <div className="font-medium">
                          •••• •••• •••• {method.card?.last4}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Expires {method.card?.exp_month}/
                          {method.card?.exp_year}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        // TODO: Implement delete payment method
                        toast.info(
                          'Delete payment method functionality coming soon',
                        );
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>
              Your organization&apos;s resource usage this billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  API Calls
                </div>
                <div className="text-2xl font-bold">
                  {usage?.apiCalls?.toLocaleString() || '0'}
                </div>
                <Progress value={0} className="h-1.5" />
                <div className="text-muted-foreground text-xs">Unlimited</div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Storage Used
                </div>
                <div className="text-2xl font-bold">
                  {usage?.storageUsed
                    ? `${(usage.storageUsed / 1024 / 1024).toFixed(2)} MB`
                    : '0 MB'}
                </div>
                <Progress value={0} className="h-1.5" />
                <div className="text-muted-foreground text-xs">Unlimited</div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Active Members
                </div>
                <div className="text-2xl font-bold">{memberCount}</div>
                {subscription?.seats && (
                  <>
                    <Progress
                      value={(memberCount / subscription.seats) * 100}
                      className="h-1.5"
                    />
                    <div className="text-muted-foreground text-xs">
                      {memberCount} / {subscription.seats} seats
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Your past invoices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground py-8 text-center">
              No billing history available
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans Modal */}
        {showPricingPlans && (
          <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-background relative max-h-[90vh] w-full max-w-7xl overflow-auto rounded-lg shadow-lg">
              <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b p-4">
                <div>
                  <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Select the perfect plan for your organization
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPricingPlans(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div className="p-6">
                <OrganizationPricingCards
                  currentPlanId={subscription?.plan?.toLowerCase()}
                  onSelectPlan={handleSelectPlan}
                  showContactSales={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Confirmation Modal */}
        {selectedPlan && (
          <PaymentConfirmationModal
            isOpen={showPaymentModal}
            onClose={handlePaymentCancel}
            onSuccess={handlePaymentSuccess}
            plan={{
              id: selectedPlan.id,
              name: selectedPlan.name,
              price: selectedPlan.price,
              priceId: selectedPlan.priceId!,
              interval: 'month',
            }}
          />
        )}
      </div>
    </StripeProviderWithErrorBoundary>
  );
}
