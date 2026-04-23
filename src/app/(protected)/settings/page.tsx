'use client';
import { getMyPersonalSubscription } from '@/actions/stripeActions';
import ChangePassword from '@/components/ChangePassword';
import { SettingsSidebar } from '@/components/sidebars/SettingsSidebar';
import { Badge } from '@/components/ui/badge';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useTenant } from '@/contexts/TenantContext';
import { UserMode } from '@/types/tenant';
import {
  Building2,
  CreditCard,
  UserCircle,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Page = () => {
  const [selectedOption, setSelectedOption] = useState('personal');
  const { mode, currentTenant } = useTenant();
  const router = useRouter();

  // Redirect to organization settings if in tenant mode
  useEffect(() => {
    if (mode === UserMode.TENANT && currentTenant) {
      router.push(`/organizations/${currentTenant.id}/settings`);
    }
  }, [mode, currentTenant, router]);

  // Show organization settings redirect message if in tenant mode
  if (mode === UserMode.TENANT && currentTenant) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              Organization Mode Active
            </CardTitle>
            <CardDescription>
              You&apos;re currently in {currentTenant.name} organization mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              To configure organization settings, visit the organization
              settings page.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() =>
                  router.push(`/organizations/${currentTenant.id}/settings`)
                }
              >
                Go to Organization Settings
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/organizations')}
              >
                View All Organizations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Settings Sidebar */}
      <div className="relative">
        <SettingsSidebar
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl p-8">
          {/* Personal Mode Indicator */}
          <div className="mb-6 flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <UserIcon className="size-3" />
              Personal Settings
            </Badge>
          </div>

          {/* Content based on selected option */}
          <div className="mt-8">
            {selectedOption === 'personal' && <PersonalSettings />}
            {selectedOption === 'subscription' && <Subscription />}
            {selectedOption === 'memory' && <Memory />}
            {selectedOption === 'password' && <ChangePassword />}
          </div>
        </div>
      </div>
    </div>
  );
};

const Subscription = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [planName, setPlanName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const accessToken = session?.accessToken as string | undefined;
      if (!accessToken) return;
      setIsLoading(true);
      try {
        const res = await getMyPersonalSubscription(accessToken);
        if (
          res.success &&
          res.data?.hasSubscription &&
          res.data.dbRecord?.plan_name
        ) {
          setPlanName(res.data.dbRecord.plan_name);
        } else {
          setPlanName('Free');
        }
      } catch {
        setPlanName('Free');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [session?.accessToken]);

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-semibold">Subscription</h1>
      <p className="text-muted-foreground my-4">
        Your current personal plan and billing details.
      </p>

      {isLoading ? (
        <Skeleton className="h-28 w-full rounded-xl" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Current Plan
              </span>
              <Badge className="capitalize">{planName}</Badge>
            </CardTitle>
            <CardDescription>
              Manage your subscription and payment methods.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => router.push('/billing')}>
              <CreditCard className="mr-2 size-4" />
              Manage Billing
            </Button>
            {planName?.toLowerCase() === 'free' && (
              <Button variant="outline" onClick={() => router.push('/upgrade')}>
                <Zap className="mr-2 size-4" />
                Upgrade Plan
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Memory = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Long Term Memory</h1>
      <p className="text-muted-foreground my-4">
        Select the length of time for the alti assistant to remember your
        conversations.
      </p>
      <div className="mt-6 rounded-xl border bg-white p-6 dark:bg-gray-800">
        <RadioGroup defaultValue="1-month" className="space-y-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem className="border-gray-400" value="off" id="r1" />
            <Label className="cursor-pointer text-base" htmlFor="r1">
              Off
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              className="border-gray-400"
              value="1-month"
              id="r2"
            />
            <Label className="cursor-pointer text-base" htmlFor="r2">
              1 Month
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              className="border-gray-400"
              value="3-month"
              id="r3"
            />
            <Label className="cursor-pointer text-base" htmlFor="r3">
              3 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              className="border-gray-400"
              value="6-month"
              id="r4"
            />
            <Label className="cursor-pointer text-base" htmlFor="r4">
              6 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              className="border-gray-400"
              value="12-month"
              id="r5"
            />
            <Label className="cursor-pointer text-base" htmlFor="r5">
              12 Months
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

const PersonalSettings = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Personal Settings</h1>
      <p className="text-muted-foreground my-4">
        Update your personal information and preferences.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="size-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your personal account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              defaultValue={session?.user?.name || ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              defaultValue={session?.user?.email || ''}
              disabled
            />
            <p className="text-muted-foreground text-xs">
              Email cannot be changed
            </p>
          </div>
          <div className="pt-4">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
