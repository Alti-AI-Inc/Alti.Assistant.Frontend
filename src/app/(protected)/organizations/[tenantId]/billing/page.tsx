'use client';

import { getTenantUsage, getCurrentTenant } from '@/actions/tenantActions';
import { getPaymentMethods, type StripePaymentMethod } from '@/actions/stripeActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { OrganizationPricingCards, type OrganizationPlan } from '@/components/organizations/OrganizationPricingCards';
import { StripeProviderWithErrorBoundary } from '@/components/stripe/StripeProvider';
import { PaymentConfirmationModal } from '@/components/stripe/PaymentConfirmationModal';
import { ArrowLeft, CreditCard, TrendingUp, Users, Zap, X, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { TenantUsage } from '@/types/tenant';

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
  const [selectedPlan, setSelectedPlan] = useState<OrganizationPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<StripePaymentMethod[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        const [tenantResponse, usageResponse, paymentMethodsResponse] = await Promise.all([
          getCurrentTenant(),
          getTenantUsage(),
          getPaymentMethods(session.accessToken),
        ]);

        console.log('[Billing Page] Tenant Response:', tenantResponse);
        console.log('[Billing Page] Tenant Data:', tenantResponse.data);
        console.log('[Billing Page] Payment Methods:', paymentMethodsResponse.data);

        if (tenantResponse.success && tenantResponse.data) {
          const tenant = tenantResponse.data;
          
          // Extract subscription data from tenant response
          const unlimitedSeats = tenant.subscription?.price?.features?.unlimitedSeats || false;
          const subscriptionData = {
            id: tenant.subscription?._id || '',
            status: tenant.status || 'trial',
            plan: tenant.subscription?.price?.plan || tenant.plan || 'free',
            amount: tenant.subscription?.price?.price || 0,
            interval: tenant.subscription?.price?.interval || 'month',
            nextBillingDate: undefined, // Not available in this response
            seats: unlimitedSeats ? 999999 : (tenant.settings?.maxMembers || tenant.limits?.maxUsers || 1),
            usedSeats: tenant.usage?.usersCount || 0,
            billingCycle: tenant.subscription?.price?.interval || 'month',
            unlimitedSeats: unlimitedSeats,
          };
          
          console.log('[Billing Page] Transformed subscription data:', subscriptionData);
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
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
          const unlimitedSeats = tenant.subscription?.price?.features?.unlimitedSeats || false;
          const subscriptionData = {
            id: tenant.subscription?._id || '',
            status: tenant.status || 'trial',
            plan: tenant.subscription?.price?.plan || tenant.plan || 'free',
            amount: tenant.subscription?.price?.price || 0,
            interval: tenant.subscription?.price?.interval || 'month',
            nextBillingDate: undefined,
            seats: unlimitedSeats ? 999999 : (tenant.settings?.maxMembers || tenant.limits?.maxUsers || 1),
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
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <Link
          href={`/organizations/${tenantId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Dashboard
        </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Billing & Usage</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and view usage statistics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Plan</span>
              <CreditCard className="size-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold capitalize">{planName}</div>
                {subscription?.amount !== undefined && subscription?.amount !== null && (
                  <div className="text-sm text-muted-foreground mt-1">
                    ${subscription.amount} / {subscription.interval || 'month'}
                  </div>
                )}
              </div>
              {planName.toLowerCase() === 'free' ? (
                <Button 
                  className="w-full"
                  onClick={() => setShowPricingPlans(true)}
                >
                  <Zap className="size-4 mr-2" />
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
                    <p className="text-xs text-muted-foreground text-center">
                      Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
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
              <Users className="size-5 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Seat usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{memberCount}</span>
                  <span className="text-muted-foreground">
                    / {subscription?.unlimitedSeats ? 'Unlimited' : subscription?.seats} seats
                  </span>
                </div>
                {subscription?.unlimitedSeats ? (
                  <p className="text-sm text-muted-foreground mt-3">
                    You can invite unlimited team members with this plan
                  </p>
                ) : subscription?.seats && (
                  <Progress
                    value={(memberCount / subscription.seats) * 100}
                    className="h-2 mt-3"
                  />
                )}
              </div>
              {!subscription?.unlimitedSeats && subscription?.seats && memberCount >= subscription.seats && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-md">
                  <TrendingUp className="size-4 text-yellow-600 mt-0.5 shrink-0" />
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
                  <Users className="size-4 mr-2" />
                  Invite Team Members
                </Button>
              ) : subscription?.seats && memberCount < subscription.seats && (
                <Button variant="outline" className="w-full">
                  <Users className="size-4 mr-2" />
                  Manage Seats
                </Button>
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
              <CreditCard className="size-4 mr-2" />
              Add Payment Method
            </Button>
          </CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="size-12 mx-auto mb-3 opacity-50" />
              <p>No payment methods added</p>
              <p className="text-sm mt-1">Add a payment method to enable billing</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {method.card?.brand || 'card'}
                    </div>
                    <div>
                      <div className="font-medium">
                        •••• •••• •••• {method.card?.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {method.card?.exp_month}/{method.card?.exp_year}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      // TODO: Implement delete payment method
                      toast.info('Delete payment method functionality coming soon');
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                API Calls
              </div>
              <div className="text-2xl font-bold">
                {usage?.apiCalls?.toLocaleString() || '0'}
              </div>
              <Progress value={0} className="h-1.5" />
              <div className="text-xs text-muted-foreground">
                Unlimited
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Storage Used
              </div>
              <div className="text-2xl font-bold">
                {usage?.storageUsed ? `${(usage.storageUsed / 1024 / 1024).toFixed(2)} MB` : '0 MB'}
              </div>
              <Progress value={0} className="h-1.5" />
              <div className="text-xs text-muted-foreground">
                Unlimited
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Active Members
              </div>
              <div className="text-2xl font-bold">
                {memberCount}
              </div>
              {subscription?.seats && (
                <>
                  <Progress
                    value={(memberCount / subscription.seats) * 100}
                    className="h-1.5"
                  />
                  <div className="text-xs text-muted-foreground">
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
          <CardDescription>
            Your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No billing history available
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans Modal */}
      {showPricingPlans && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-7xl w-full max-h-[90vh] overflow-auto relative">
            <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                <p className="text-sm text-muted-foreground mt-1">
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
