'use client';

import { CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { type StripePaymentMethod } from '@/actions/stripeActions';

interface PaymentMethodsListProps {
  paymentMethods: StripePaymentMethod[];
  onRefresh: () => void;
  customerId: string;
}

const cardBrandIcons: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
  default: '💳',
};

export function PaymentMethodsList({
  paymentMethods,
}: PaymentMethodsListProps) {
  if (paymentMethods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CreditCard className="text-muted-foreground mb-3 h-10 w-10" />
        <p className="text-muted-foreground text-sm">
          No payment methods attached yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map(pm => (
        <div
          key={pm.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg text-2xl">
              {cardBrandIcons[pm.card?.brand || 'default']}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">
                  {pm.card?.brand || 'Card'}
                </span>
                <span className="text-muted-foreground">
                  •••• {pm.card?.last4}
                </span>
              </div>
              <div className="text-muted-foreground text-sm">
                Expires {pm.card?.exp_month}/{pm.card?.exp_year}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {pm.id}
          </Badge>
        </div>
      ))}
    </div>
  );
}
