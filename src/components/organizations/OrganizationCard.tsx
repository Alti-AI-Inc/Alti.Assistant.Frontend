'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';
import type { UserTenant } from '@/types/tenant';
import {
  Building2,
  ExternalLink,
  MoreVertical,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrganizationCardProps {
  organization: UserTenant & { memberCount?: number };
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const router = useRouter();
  const { switchToTenantMode } = useTenant();
  const [isNavigating, setIsNavigating] = useState(false);

  const userTotal = organization.usersCount ?? organization.memberCount ?? 0;
  const userLabel = userTotal === 1 ? 'member' : 'members';

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
      // Then navigate to the organization's Manage Members page
      router.push(`/organizations/${organization.id}/members`);
    } catch (error) {
      console.error('Failed to navigate to organization:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <Card
      className={cn(
        'hover:border-primary/50 group cursor-pointer transition-all',
        'hover:shadow-md',
        isNavigating && 'pointer-events-none opacity-50',
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <Building2 className="text-primary size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="group-hover:text-primary truncate font-semibold transition-colors">
              {organization.name}
            </h3>
            <p className="text-muted-foreground truncate text-sm">
              {organization.subdomain}.alti.ai
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async e => {
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
              <ExternalLink className="mr-2 size-4" />
              Open Dashboard
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async e => {
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
              <Users className="mr-2 size-4" />
              Manage Members
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="size-4" />
              <span>
                {userTotal} {userLabel}
              </span>
            </div>
            <Badge
              variant={getRoleBadgeVariant(organization.role)}
              className="capitalize"
            >
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
