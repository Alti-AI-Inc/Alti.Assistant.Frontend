'use client';

import { getCurrentTenant, getTenantById, updateTenantSettings } from '@/actions/tenantActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Tenant, TenantSettings as ITenantSettings } from '@/types/tenant';

export default function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = use(params);
  const { data: session } = useSession();
  const [organization, setOrganization] = useState<Tenant | null>(null);
  const [settings, setSettings] = useState<ITenantSettings>({
    maxMembers: 10,
    allowMemberInvites: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        const response = await getTenantById(tenantId);
        console.log('Get tenant by ID response:', response);
        if (response.success && response.data) {
          setOrganization(response.data);
          if (response.data.settings) {
            setSettings(response.data.settings);
          }
        }
      } catch (error) {
        console.error('Failed to fetch organization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganization();
  }, [tenantId, session?.accessToken]);

  const handleSave = async () => {
    if (!session?.accessToken) return;

    setIsSaving(true);
    try {
      const response = await updateTenantSettings(settings);

      if (response.success) {
        toast.success('Settings updated successfully');
        setHasChanges(false);
      } else {
        toast.error(response.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('An error occurred while updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = <K extends keyof ITenantSettings>(
    key: K,
    value: ITenantSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <p className="text-center text-muted-foreground">Organization not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Link
        href={`/organizations/${tenantId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization configuration
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="size-4 mr-2 animate-spin" />}
            <Save className="size-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Basic information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input value={organization.name} disabled />
              <p className="text-xs text-muted-foreground">
                Contact support to change your organization name
              </p>
            </div>

            <div className="space-y-2">
              <Label>Subdomain</Label>
              <Input
                value={`${organization.subdomain}.alti.ai`}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Your organization subdomain cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label>Organization ID</Label>
              <Input value={organization.id} disabled />
              <p className="text-xs text-muted-foreground">
                Use this ID for API integrations
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Member Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Member Settings</CardTitle>
            <CardDescription>
              Control how members can interact with your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Member Invites</Label>
                <p className="text-sm text-muted-foreground">
                  Let members invite other people to the organization
                </p>
              </div>
              <Switch
                checked={settings.allowMemberInvites || false}
                onCheckedChange={(checked) =>
                  updateSetting('allowMemberInvites', checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxMembers">Maximum Members</Label>
              <Input
                id="maxMembers"
                type="number"
                min={1}
                value={settings.maxMembers}
                onChange={(e) =>
                  updateSetting('maxMembers', parseInt(e.target.value) || 1)
                }
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of members allowed in this organization
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for this organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Organization</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this organization and all associated data
                </p>
              </div>
              <Button variant="destructive" disabled>
                Delete Organization
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Contact support to delete your organization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
