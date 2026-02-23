'use client';

import { createTenant } from '@/actions/tenantActions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubdomainChecker } from '@/components/organizations/SubdomainChecker';
import { useModalStore } from '@/stores/useModalStore';
import { Building2, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function CreateOrganizationModal() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { isOpen, type, onClose, onConfirm } = useModalStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subdomain: '',
  });

  const isModalOpen = isOpen && type === 'create-organization';

  const handleClose = () => {
    setFormData({ name: '', slug: '', subdomain: '' });
    setIsSubdomainAvailable(false);
    onClose();
  };

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

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      toast.error('You must be logged in to create an organization');
      return;
    }

    if (!formData.name.trim() || !formData.subdomain.trim()) {
      toast.error('Please fill in all required fields');
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
        
        toast.success('Organization created successfully!');
        handleClose();
        onConfirm?.();
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
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Set up a new organization for your team
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name *</Label>
            <Input
              id="org-name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Acme Inc."
              disabled={isCreating}
              autoFocus
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
            <Label htmlFor="org-slug">Slug *</Label>
            <Input
              id="org-slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase(),
                }))
              }
              placeholder="acme-inc"
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs and for organization identification
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {isCreating && <Loader2 className="size-4 mr-2 animate-spin" />}
            {isCreating ? 'Creating...' : 'Create Organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
