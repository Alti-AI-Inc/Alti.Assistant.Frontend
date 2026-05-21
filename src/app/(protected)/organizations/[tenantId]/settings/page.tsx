'use client';

import { getTenantById, updateTenantSettings } from '@/actions/tenantActions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import type { TenantSettings as ITenantSettings, Tenant } from '@/types/tenant';
import { ArrowLeft, Loader2, Save, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    value: ITenantSettings[K],
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-8 h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground text-center">
          Organization not found
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        href={`/organizations/${tenantId}`}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center text-sm transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization configuration
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
            <Save className="mr-2 size-4" />
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
              <p className="text-muted-foreground text-xs">
                Contact support to change your organization name
              </p>
            </div>

            <div className="space-y-2">
              <Label>Subdomain</Label>
              <Input value={`${organization.subdomain}.alti.ai`} disabled />
              <p className="text-muted-foreground text-xs">
                Your organization subdomain cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label>Organization ID</Label>
              <Input value={organization.id} disabled />
              <p className="text-muted-foreground text-xs">
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
                <p className="text-muted-foreground text-sm">
                  Let members invite other people to the organization
                </p>
              </div>
              <Switch
                checked={settings.allowMemberInvites || false}
                onCheckedChange={checked =>
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
                onChange={e =>
                  updateSetting('maxMembers', parseInt(e.target.value) || 1)
                }
              />
              <p className="text-muted-foreground text-xs">
                Maximum number of members allowed in this organization
              </p>
            </div>

            <div className="pt-6 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="size-4 text-indigo-650" />
                  Manage Team Members
                </Label>
                <p className="text-muted-foreground text-sm">
                  Invite new members, update roles, and manage permissions.
                </p>
              </div>
              <Button variant="outline" className="border-indigo-100 text-indigo-650 hover:bg-indigo-50/50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/20" asChild>
                <Link href={`/organizations/${tenantId}/members`}>
                  Manage Members
                </Link>
              </Button>
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
                <p className="text-muted-foreground text-sm">
                  Permanently delete this organization and all associated data
                </p>
              </div>
              <Button variant="destructive" disabled>
                Delete Organization
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-xs">
              Contact support to delete your organization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
