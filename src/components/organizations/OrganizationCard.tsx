'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Building2, MoreVertical, Settings, Users, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserTenant } from '@/types/tenant';
import { cn } from '@/lib/utils';
import { useTenant } from '@/contexts/TenantContext';
import { useState } from 'react';

interface OrganizationCardProps {
  organization: UserTenant & { memberCount?: number };
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const router = useRouter();
  const { switchToTenantMode } = useTenant();
  const [isNavigating, setIsNavigating] = useState(false);

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'owner':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleCardClick = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    try {
      // First switch to tenant mode
      await switchToTenantMode(organization.id);
      // Then navigate to the organization dashboard
      router.push(`/organizations/${organization.id}`);
    } catch (error) {
      console.error('Failed to navigate to organization:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <Card
      className={cn(
        'hover:border-primary/50 transition-all cursor-pointer group',
        'hover:shadow-md',
        isNavigating && 'opacity-50 pointer-events-none'
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
              {organization.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {organization.subdomain}.alti.ai
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async (e) => {
                e.stopPropagation();
                setIsNavigating(true);
                try {
                  await switchToTenantMode(organization.id);
                  router.push(`/organizations/${organization.id}`);
                } catch (error) {
                  console.error('Failed to navigate:', error);
                } finally {
                  setIsNavigating(false);
                }
              }}
            >
              <ExternalLink className="size-4 mr-2" />
              Open Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async (e) => {
                e.stopPropagation();
                setIsNavigating(true);
                try {
                  await switchToTenantMode(organization.id);
                  router.push(`/organizations/${organization.id}/settings`);
                } catch (error) {
                  console.error('Failed to navigate:', error);
                } finally {
                  setIsNavigating(false);
                }
              }}
            >
              <Settings className="size-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async (e) => {
                e.stopPropagation();
                setIsNavigating(true);
                try {
                  await switchToTenantMode(organization.id);
                  router.push(`/organizations/${organization.id}/members`);
                } catch (error) {
                  console.error('Failed to navigate:', error);
                } finally {
                  setIsNavigating(false);
                }
              }}
            >
              <Users className="size-4 mr-2" />
              Manage Members
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="size-4" />
              <span>{organization.memberCount || 0} members</span>
            </div>
            <Badge variant={getRoleBadgeVariant(organization.role)} className="capitalize">
              {organization.role || 'member'}
            </Badge>
          </div>
          <Badge variant="outline" className="capitalize">
            {organization.plan || 'free'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
