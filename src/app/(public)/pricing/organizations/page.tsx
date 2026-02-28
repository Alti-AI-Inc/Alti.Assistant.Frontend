'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationPricingCards } from '@/components/organizations/OrganizationPricingCards';
import type { OrganizationPlan } from '@/components/organizations/OrganizationPricingCards';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrganizationPricingPage() {
  const router = useRouter();

  const handleSelectPlan = (plan: OrganizationPlan) => {
    // Redirect to organization creation with selected plan
    router.push(`/organizations/create?plan=${plan.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Organization Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your team. Scale as you grow with our flexible pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <OrganizationPricingCards
          onSelectPlan={handleSelectPlan}
          showContactSales={true}
        />

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Need a custom solution?</CardTitle>
              <CardDescription>
                Contact our sales team for enterprise pricing and custom features tailored to your organization&apos;s needs.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I exceed my daily request limit?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Requests beyond your daily limit may be queued or require an upgrade to a higher plan. Contact support to discuss your needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a discount for annual billing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Save 20% when you choose annual billing. Contact our sales team for more details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
