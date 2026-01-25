import CheckoutForm from '@/components/stripe/checkout';
import { auth } from '@/auth';
import { createPaymentIntent } from '@/actions/stripeActions';
import { AlertCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Test configuration
const TEST_CONFIG = {
  amount: 9900, // $99.00 in cents
  currency: 'usd',
  customerId: 'cus_TqolRr7s2T5sPh',
};

interface IntentPageProps {
  // Add any props if needed (e.g., from searchParams or params)
}

export default async function IntentPage({}: IntentPageProps) {
  const session = await auth();
  const accessToken = session?.accessToken;
  console.log('sessionData', session);

  if (!accessToken) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-destructive/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-6 w-6" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You must be signed in to access the payment page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  try {
    // Create PaymentIntent via Backend API
    const response = await createPaymentIntent(
      TEST_CONFIG.amount,
      TEST_CONFIG.currency,
      TEST_CONFIG.customerId,
      accessToken,
    );

    console.log('[stripe-test] createPaymentIntent response:', response);

    // Handle both snake_case and camelCase from backend
    const clientSecret =
      response.data?.client_secret ||
      (response.data as unknown as { clientSecret?: string })?.clientSecret;

    if (!response.success || !clientSecret) {
      throw new Error(
        response.message ||
          'Failed to create payment intent: No client secret returned',
      );
    }

    return (
      <div className="from-background via-background to-muted/30 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground mt-1">
              Complete your payment securely
            </p>
          </div>
          <CheckoutForm
            clientSecret={clientSecret}
            amount={TEST_CONFIG.amount}
            currency={TEST_CONFIG.currency}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);

    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-destructive/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <AlertCircle className="text-destructive h-6 w-6" />
            </div>
            <CardTitle>Unable to Initialize Payment</CardTitle>
            <CardDescription>
              There was an error setting up your payment. Please try again
              later.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground text-xs">
              If the problem persists, please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}
