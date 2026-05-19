'use client';

import { memo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import { Building2, ChevronDown, Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';

function TenantModeSwitcherInner() {
  const router = useRouter();
  const {
    mode,
    currentTenant,
    tenants,
    switchToPersonalMode,
    switchToTenantMode,
  } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleModeSwitch = async (tenantId?: string) => {
    setIsSwitching(true);
    try {
      if (tenantId) {
        await switchToTenantMode(tenantId);
      } else {
        await switchToPersonalMode();
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch mode:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleCreateOrganization = () => {
    setIsOpen(false);
    router.push('/organizations/create');
  };

  const currentModeLabel =
    mode === 'personal'
      ? 'Personal Mode'
      : currentTenant?.name || 'Organization';

  const CurrentModeIcon = mode === 'personal' ? User : Building2;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between',
            isSwitching && 'pointer-events-none opacity-50',
          )}
        >
          <div className="flex items-center gap-2">
            <CurrentModeIcon className="size-4" />
            <span className="max-w-[150px] truncate">{currentModeLabel}</span>
          </div>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Switch Mode
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => handleModeSwitch()}
          className={cn('cursor-pointer', mode === 'personal' && 'bg-accent')}
        >
          <User className="mr-2 size-4" />
          <span>Personal Mode</span>
          {mode === 'personal' && (
            <span className="text-muted-foreground ml-auto text-xs">
              Active
            </span>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Organizations
        </DropdownMenuLabel>

        {tenants && tenants.length > 0 ? (
          tenants.map(tenant => (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => handleModeSwitch(tenant.id)}
              className={cn(
                'cursor-pointer',
                mode === 'tenant' &&
                  currentTenant?.id === tenant.id &&
                  'bg-accent',
              )}
            >
              <Building2 className="mr-2 size-4" />
              <div className="min-w-0 flex-1">
                <div className="truncate">{tenant.name}</div>
                <div className="text-muted-foreground text-xs capitalize">
                  {tenant.role}
                </div>
              </div>
              {mode === 'tenant' && currentTenant?.id === tenant.id && (
                <span className="text-muted-foreground ml-auto text-xs">
                  Active
                </span>
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-muted-foreground text-sm">
            No organizations yet
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleCreateOrganization}
          className="text-primary cursor-pointer"
        >
          <Plus className="mr-2 size-4" />
          <span>Create Organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const TenantModeSwitcher = memo(TenantModeSwitcherInner);
