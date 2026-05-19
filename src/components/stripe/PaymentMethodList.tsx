'use client';

import { PaymentMethod } from '@/types/stripe';
import { PaymentMethodCard } from './PaymentMethodCard';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Payment Method List Component
 * Displays a list of payment methods with selection capability
 */

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId?: string;
  onSelectMethod: (paymentMethodId: string) => void;
  onAddNew: () => void;
  isLoading?: boolean;
  className?: string;
}

export function PaymentMethodList({
  paymentMethods,
  selectedMethodId,
  onSelectMethod,
  onAddNew,
  isLoading = false,
  className,
}: PaymentMethodListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="text-primary mx-auto mb-3 h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Loading payment methods...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (paymentMethods.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="border-border flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-12">
          <CreditCard className="text-muted-foreground mb-3 h-12 w-12" />
          <h3 className="mb-1 text-lg font-semibold">No payment methods</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-center text-sm">
            You don&apos;t have any saved payment methods yet. Add a card to get
            started.
          </p>
          <Button onClick={onAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </div>
    );
  }

  // Payment methods list
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Select Payment Method</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Choose a card or add a new one
          </p>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="space-y-3">
        {paymentMethods.map(method => (
          <PaymentMethodCard
            key={method.id}
            paymentMethod={method}
            isSelected={selectedMethodId === method.id}
            onSelect={onSelectMethod}
          />
        ))}
      </div>

      {/* Add New Button */}
      <Button
        variant="outline"
        onClick={onAddNew}
        className="w-full gap-2 border-dashed hover:border-solid"
      >
        <Plus className="h-4 w-4" />
        Add New Payment Method
      </Button>
    </div>
  );
}

/**
 * Compact Payment Method List
 * Displays payment methods in a more compact format
 */
interface CompactPaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId?: string;
  onSelectMethod: (paymentMethodId: string) => void;
  className?: string;
}

export function CompactPaymentMethodList({
  paymentMethods,
  selectedMethodId,
  onSelectMethod,
  className,
}: CompactPaymentMethodListProps) {
  if (paymentMethods.length === 0) {
    return (
      <div className={cn('py-8 text-center', className)}>
        <CreditCard className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          No payment methods available
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {paymentMethods.map(method => (
        <PaymentMethodCard
          key={method.id}
          paymentMethod={method}
          isSelected={selectedMethodId === method.id}
          onSelect={onSelectMethod}
          className="p-3"
        />
      ))}
    </div>
  );
}

export default PaymentMethodList;
