'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import {
  getStripePrices,
  createSubscription,
  type StripePrice,
  type StripeCustomer,
} from '@/actions/stripeActions';
import { formatCurrency } from '@/utils/formatters';

interface CreateSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: StripeCustomer;
  onSuccess: () => void;
}

export function CreateSubscriptionDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: CreateSubscriptionDialogProps) {
  const { data: session } = useSession();
  const accessToken = session?.accessToken as string;

  const [prices, setPrices] = useState<StripePrice[]>([]);
  const [selectedPriceId, setSelectedPriceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && accessToken) {
      loadPrices();
    }
  }, [open, accessToken]);

  const loadPrices = async () => {
    setIsLoadingPrices(true);
    try {
      const result = await getStripePrices(accessToken);
      if (result.success && result.data) {
        setPrices(result.data.filter(p => p.active));
      }
    } catch (err) {
      console.error('Failed to load prices:', err);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPriceId || !accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await createSubscription(
        customer.id,
        selectedPriceId,
        accessToken,
      );

      if (result.success) {
        onSuccess();
        onOpenChange(false);
        setSelectedPriceId('');
      } else {
        setError(result.message || 'Failed to create subscription');
      }
    } catch (err) {
      console.error('Subscription creation error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPrice = prices.find(p => p.id === selectedPriceId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Subscription</DialogTitle>
          <DialogDescription>
            Assign a subscription plan to {customer.name || customer.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer Info */}
          <div className="bg-muted/30 rounded-lg border p-3">
            <div className="text-sm font-medium">
              {customer.name || 'Customer'}
            </div>
            <div className="text-muted-foreground text-xs">
              {customer.email || customer.id}
            </div>
          </div>

          {/* Price Selection */}
          <div className="space-y-2">
            <Label>Select Plan</Label>
            {isLoadingPrices ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : prices.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No pricing plans available. Please initialize products first.
              </p>
            ) : (
              <Select
                value={selectedPriceId}
                onValueChange={setSelectedPriceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plan..." />
                </SelectTrigger>
                <SelectContent>
                  {prices.map(price => (
                    <SelectItem key={price.id} value={price.id}>
                      <div className="flex items-center gap-2">
                        <span>{price.nickname || 'Plan'}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(price.unit_amount)}
                          {price.recurring?.interval &&
                            `/${price.recurring.interval}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Selected Plan Summary */}
          {selectedPrice && (
            <div className="bg-primary/5 rounded-lg border p-3">
              <div className="text-sm font-medium">
                {selectedPrice.nickname || 'Subscription Plan'}
              </div>
              <div className="text-primary text-lg font-bold">
                {formatCurrency(selectedPrice.unit_amount)}
                <span className="text-muted-foreground text-sm font-normal">
                  /{selectedPrice.recurring?.interval || 'month'}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedPriceId}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Subscription'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
