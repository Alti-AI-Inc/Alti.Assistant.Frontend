'use client';

import { OrganizationTenantOverview } from '@/components/organizations/OrganizationTenantOverview';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/organizations"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center text-sm transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to organizations
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground mt-1">
          Team members, invitations, and usage for this organization
        </p>
      </div>

      <OrganizationTenantOverview fixedTenantId={tenantId} />
    </div>
  );
}
