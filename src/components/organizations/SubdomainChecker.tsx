'use client';

import { checkSubdomainAvailability } from '@/actions/tenantActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SubdomainCheckerProps {
  value: string;
  onChange: (value: string) => void;
  onAvailabilityChange?: (available: boolean) => void;
  disabled?: boolean;
}

export function SubdomainChecker({
  value,
  onChange,
  onAvailabilityChange,
  disabled,
}: SubdomainCheckerProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean;
    message: string;
  } | null>(null);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  // Check availability
  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedValue || debouncedValue.length < 3) {
        setAvailability(null);
        onAvailabilityChange?.(false);
        return;
      }

      // Validate subdomain format
      const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
      if (!subdomainRegex.test(debouncedValue)) {
        setAvailability({
          available: false,
          message: 'Subdomain can only contain lowercase letters, numbers, and hyphens',
        });
        onAvailabilityChange?.(false);
        return;
      }

      setIsChecking(true);
      try {
        const response = await checkSubdomainAvailability(
          debouncedValue
        );

        console.log('Subdomain availability response:', response);

        if (response.success && response.data) {
          const isAvailable = response.data.available;
          setAvailability({
            available: isAvailable,
            message: isAvailable
              ? 'Subdomain is available'
              : 'Subdomain is already taken',
          });
          onAvailabilityChange?.(isAvailable);
        } else {
          setAvailability({
            available: false,
            message: response.message || 'Failed to check availability',
          });
          onAvailabilityChange?.(false);
        }
      } catch (error) {
        console.error('Failed to check subdomain:', error);
        setAvailability({
          available: false,
          message: 'Failed to check availability',
        });
        onAvailabilityChange?.(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedValue, onAvailabilityChange]);

  const showStatus = value.length >= 3 && (isChecking || availability);

  return (
    <div className="space-y-2">
      <Label htmlFor="subdomain">Subdomain</Label>
      <div className="relative">
        <Input
          id="subdomain"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase())}
          placeholder="my-organization"
          disabled={disabled}
          className={cn(
            'pr-10',
            availability?.available && 'border-green-500 focus-visible:ring-green-500',
            availability && !availability.available && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {showStatus && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isChecking ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : availability?.available ? (
              <Check className="size-4 text-green-500" />
            ) : (
              <X className="size-4 text-destructive" />
            )}
          </div>
        )}
      </div>
      {availability && (
        <p
          className={cn(
            'text-sm',
            availability.available ? 'text-green-600 dark:text-green-500' : 'text-destructive'
          )}
        >
          {availability.message}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Your organization will be available at <span className="font-medium">{value || 'subdomain'}.alti.ai</span>
      </p>
    </div>
  );
}
