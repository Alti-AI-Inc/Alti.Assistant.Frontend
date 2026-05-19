'use client';

import { PaymentMethod } from '@/types/stripe';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CreditCard, CheckCircle2 } from 'lucide-react';

/**
 * Payment Method Card Component
 * Displays a payment method (credit/debit card) with brand, last 4 digits, and expiry
 */

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  isSelected?: boolean;
  isDefault?: boolean;
  onSelect?: (paymentMethodId: string) => void;
  className?: string;
}

// Card brand colors and icons
const CARD_BRAND_CONFIG: Record<
  string,
  { color: string; displayName: string }
> = {
  visa: { color: 'text-blue-600', displayName: 'Visa' },
  mastercard: { color: 'text-orange-600', displayName: 'Mastercard' },
  amex: { color: 'text-blue-700', displayName: 'American Express' },
  discover: { color: 'text-orange-500', displayName: 'Discover' },
  diners: { color: 'text-blue-500', displayName: 'Diners Club' },
  jcb: { color: 'text-red-600', displayName: 'JCB' },
  unionpay: { color: 'text-red-700', displayName: 'UnionPay' },
  unknown: { color: 'text-gray-600', displayName: 'Card' },
};

export function PaymentMethodCard({
  paymentMethod,
  isSelected = false,
  isDefault = false,
  onSelect,
  className,
}: PaymentMethodCardProps) {
  const { card } = paymentMethod;

  if (!card) {
    return null;
  }

  const brandConfig =
    CARD_BRAND_CONFIG[card.brand] || CARD_BRAND_CONFIG.unknown;
  const isClickable = !!onSelect;

  const handleClick = () => {
    if (onSelect) {
      onSelect(paymentMethod.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect?.(paymentMethod.id);
    }
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex items-center gap-4 rounded-lg border-2 p-4 transition-all',
        isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-border bg-card hover:border-muted-foreground/30',
        isClickable && 'cursor-pointer',
        className,
      )}
    >
      {/* Selection Indicator */}
      {isClickable && (
        <div className="flex items-center">
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
              isSelected
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/50',
            )}
          >
            {isSelected && (
              <CheckCircle2 className="text-primary-foreground h-4 w-4" />
            )}
          </div>
        </div>
      )}

      {/* Card Icon */}
      <div className={cn('flex-shrink-0', brandConfig.color)}>
        <CreditCard className="h-8 w-8" />
      </div>

      {/* Card Details */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-medium">{brandConfig.displayName}</span>
          <span className="text-muted-foreground">••••</span>
          <span className="font-semibold">{card.last4}</span>
          {isDefault && (
            <Badge variant="secondary" className="ml-auto">
              Default
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground text-xs">
          Expires {String(card.exp_month).padStart(2, '0')}/{card.exp_year}
        </div>
        {card.funding && (
          <div className="text-muted-foreground mt-0.5 text-xs capitalize">
            {card.funding}
          </div>
        )}
      </div>

      {/* Selection Checkmark (Alternative position) */}
      {isSelected && !isClickable && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="text-primary h-5 w-5" />
        </div>
      )}
    </div>
  );
}

/**
 * Simple Payment Method Display (Non-interactive)
 * Use this for displaying payment method information without selection
 */
export function PaymentMethodDisplay({
  paymentMethod,
  className,
}: {
  paymentMethod: PaymentMethod;
  className?: string;
}) {
  return (
    <PaymentMethodCard
      paymentMethod={paymentMethod}
      isSelected={false}
      isDefault={false}
      className={className}
    />
  );
}

export default PaymentMethodCard;
