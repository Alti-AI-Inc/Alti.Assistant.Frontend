'use client';

import { createTenant } from '@/actions/tenantActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubdomainChecker } from '@/components/organizations/SubdomainChecker';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';

export default function CreateOrganizationPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { refreshTenants } = useTenant();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subdomain: '',
  });

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
      subdomain: name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.accessToken) {
      toast.error('You must be logged in to create an organization');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Organization name is required');
      return;
    }

    if (!formData.subdomain.trim() || formData.subdomain.length < 3) {
      toast.error('Subdomain must be at least 3 characters');
      return;
    }

    if (!isSubdomainAvailable) {
      toast.error('Please choose an available subdomain');
      return;
    }

    setIsCreating(true);
    try {
      const response = await createTenant({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        subdomain: formData.subdomain.trim(),
      });

      if (response.success && response.data) {
        // Update session with new access token if provided
        if (response.data.accessToken && update) {
          await update({ accessToken: response.data.accessToken });
        }
        
        // Refresh the tenant list to sync the switcher
        await refreshTenants();
        
        toast.success('Organization created successfully!');
        router.push(`/organizations/${response.data.id}`);
      } else {
        toast.error(response.message || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
      toast.error('An error occurred while creating the organization');
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.subdomain.trim().length >= 3 &&
    isSubdomainAvailable &&
    !isCreating;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Link
        href="/organizations"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Organizations
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle>Create Organization</CardTitle>
              <CardDescription>
                Set up a new organization to collaborate with your team
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Acme Inc."
                disabled={isCreating}
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground">
                This is the display name for your organization
              </p>
            </div>

            <SubdomainChecker
              value={formData.subdomain}
              onChange={(subdomain) =>
                setFormData((prev) => ({ ...prev, subdomain }))
              }
              onAvailabilityChange={setIsSubdomainAvailable}
              disabled={isCreating}
            />

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))
                }
                placeholder="acme-inc"
                disabled={isCreating}
                required
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs and for organization identification
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isCreating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="flex-1"
              >
                {isCreating && <Loader2 className="size-4 mr-2 animate-spin" />}
                {isCreating ? 'Creating...' : 'Create Organization'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
