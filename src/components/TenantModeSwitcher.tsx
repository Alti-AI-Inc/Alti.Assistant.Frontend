'use client';

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

export function TenantModeSwitcher() {
  const router = useRouter();
  const { mode, currentTenant, tenants, switchToPersonalMode, switchToTenantMode } = useTenant();
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

  const currentModeLabel = mode === 'personal' 
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
            isSwitching && 'opacity-50 pointer-events-none'
          )}
        >
          <div className="flex items-center gap-2">
            <CurrentModeIcon className="size-4" />
            <span className="truncate max-w-[150px]">{currentModeLabel}</span>
          </div>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Mode
        </DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => handleModeSwitch()}
          className={cn(
            'cursor-pointer',
            mode === 'personal' && 'bg-accent'
          )}
        >
          <User className="size-4 mr-2" />
          <span>Personal Mode</span>
          {mode === 'personal' && (
            <span className="ml-auto text-xs text-muted-foreground">Active</span>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>

        {tenants && tenants.length > 0 ? (
          tenants.map((tenant) => (
            <DropdownMenuItem
              key={tenant.id}
              onClick={() => handleModeSwitch(tenant.id)}
              className={cn(
                'cursor-pointer',
                mode === 'tenant' && currentTenant?.id === tenant.id && 'bg-accent'
              )}
            >
              <Building2 className="size-4 mr-2" />
              <div className="flex-1 min-w-0">
                <div className="truncate">{tenant.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{tenant.role}</div>
              </div>
              {mode === 'tenant' && currentTenant?.id === tenant.id && (
                <span className="ml-auto text-xs text-muted-foreground">Active</span>
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
          className="cursor-pointer text-primary"
        >
          <Plus className="size-4 mr-2" />
          <span>Create Organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
