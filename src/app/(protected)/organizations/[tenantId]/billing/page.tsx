'use client';

import { getTenantSubscription } from '@/actions/stripeActions';
import { getTenantUsage } from '@/actions/tenantActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { OrganizationPricingCards } from '@/components/organizations/OrganizationPricingCards';
import { ArrowLeft, CreditCard, TrendingUp, Users, Zap, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
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
  } | null>(null);
  const [usage, setUsage] = useState<TenantUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPricingPlans, setShowPricingPlans] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        const [subResponse, usageResponse] = await Promise.all([
          getTenantSubscription(tenantId, session.accessToken),
          getTenantUsage(),
        ]);

        if (subResponse.success && subResponse.data) {
          setSubscription(subResponse.data);
        }

        if (usageResponse.success && usageResponse.data) {
          setUsage(usageResponse.data);
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

  return (
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
                {subscription?.amount && (
                  <div className="text-sm text-muted-foreground mt-1">
                    ${subscription.amount / 100} / {subscription.interval || 'month'}
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
                    / {subscription?.seats || '∞'} seats
                  </span>
                </div>
                {subscription?.seats && (
                  <Progress
                    value={(memberCount / subscription.seats) * 100}
                    className="h-2 mt-3"
                  />
                )}
              </div>
              {subscription?.seats && memberCount >= subscription.seats && (
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
              {subscription?.seats && memberCount < subscription.seats && (
                <Button variant="outline" className="w-full">
                  <Users className="size-4 mr-2" />
                  Manage Seats
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
                onSelectPlan={(planId) => {
                  console.log('Selected plan:', planId);
                  // TODO: Implement plan upgrade/change logic
                  setShowPricingPlans(false);
                }}
                showContactSales={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
