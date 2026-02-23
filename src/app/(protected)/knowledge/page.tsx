'use client';
import BanksList from './_components/BanksList';
import { useTenant } from '@/contexts/TenantContext';
import { UserMode } from '@/types/tenant';
import { Badge } from '@/components/ui/badge';
import { Building2, User } from 'lucide-react';

const pageNow = () => {
  const { mode, currentTenant } = useTenant();

  return (
    <div className='pt-6'>
      {/* Context Mode Indicator */}
      <div className="px-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            {mode === UserMode.TENANT && currentTenant ? (
              <Badge variant="outline" className="flex items-center gap-1">
                <Building2 className="size-3" />
                {currentTenant.name}
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="size-3" />
                Personal
              </Badge>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {mode === UserMode.TENANT && currentTenant
            ? `Knowledge bases in this section are shared with ${currentTenant.name} organization members.`
            : 'Personal knowledge bases are private to your account.'}
        </p>
        {/* Note: Actual tenant filtering will be implemented in Phase 6 with backend API changes */}
      </div>
      
      <BanksList />
    </div>
  );
};

export default pageNow;
