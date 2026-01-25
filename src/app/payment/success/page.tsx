import Link from 'next/link';
import { CheckCircle2, ArrowLeft, Receipt } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    payment_intent?: string;
    redirect_status?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;
  const status = params.redirect_status;

  const isSuccess = status === 'succeeded';

  return (
    <div className="from-background via-background to-muted/30 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isSuccess
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-destructive/10'
            }`}
          >
            <CheckCircle2
              className={`h-8 w-8 ${
                isSuccess
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-destructive'
              }`}
            />
          </div>
          <CardTitle className="text-2xl">
            {isSuccess ? 'Payment Successful!' : 'Payment Status'}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? 'Thank you for your payment. Your transaction has been completed.'
              : 'Your payment is being processed.'}
          </CardDescription>
        </CardHeader>

        {paymentIntentId && (
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                <Receipt className="h-4 w-4" />
                <span>Transaction Reference</span>
              </div>
              <code className="font-mono text-xs break-all">
                {paymentIntentId}
              </code>
            </div>
          </CardContent>
        )}

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <p className="text-muted-foreground text-xs">
            A confirmation email will be sent to your registered email address.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
