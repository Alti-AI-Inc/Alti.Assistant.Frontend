'use client';
import ChangePassword from '@/components/ChangePassword';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState, useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { UserMode } from '@/types/tenant';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CreditCard, User as UserIcon, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { getMyPersonalSubscription } from '@/actions/stripeActions';

const optionsList = [
  // {
  //   id: 1,
  //   title: 'Theme',
  //   value: 'theme',
  // },
  {
    id: 3,
    title: 'Subscription',
    value: 'subscription',
  },
  {
    id: 1,
    title: 'Memory',
    value: 'memory',
  },
  {
    id: 2,
    title: 'Password',
    value: 'password',
  },
];
const Page = () => {
  const [selectedOption, setSelectedOption] = useState(1);
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
              To configure organization settings, visit the organization settings page.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push(`/organizations/${currentTenant.id}/settings`)}>
                Go to Organization Settings
              </Button>
              <Button variant="outline" onClick={() => router.push('/organizations')}>
                View All Organizations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-40 pl-20">
      {/* Personal Mode Indicator */}
      <div className="mb-6 flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <UserIcon className="size-3" />
          Personal Settings
        </Badge>
      </div>

      <div className="flex space-x-6">
        <div className="flex w-40 flex-col space-y-2">
          {optionsList.map(item => (
            <Button
              key={item.id}
              variant={selectedOption === item.id ? 'default' : 'outline'}
              onClick={() => setSelectedOption(item.id)}
            >
              {item.title}
            </Button>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-start ml-10">
          {/* {selectedOption === 1 && <SwitchThem />} */}
          {selectedOption === 3 && <Subscription />}
          {selectedOption === 1 && <Memory />}
          {selectedOption === 2 && <ChangePassword />}
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
        if (res.success && res.data?.hasSubscription && res.data.dbRecord?.plan_name) {
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
      <p className="my-4 text-muted-foreground">
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
              <CreditCard className="size-4 mr-2" />
              Manage Billing
            </Button>
            {planName?.toLowerCase() === 'free' && (
              <Button variant="outline" onClick={() => router.push('/upgrade')}>
                <Zap className="size-4 mr-2" />
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
      <p className="my-4">
        Select the length of time for the alti assistant to remember your
        conversations.
      </p>
      <div className="mt-10 rounded-2xl border p-6 bg-gray-100">
        <RadioGroup defaultValue="1-month" className="">
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="off" id="r1" />
            <Label className="text-base" htmlFor="r1">
              Off
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="1-month" id="r2" />
            <Label className="text-base" htmlFor="r2">
              1 Month
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="3-month" id="r3" />
            <Label className="text-base" htmlFor="r3">
              3 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="6-month" id="r4" />
            <Label className="text-base" htmlFor="r4">
              6 Months
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem className='border-black' value="12-month" id="r5" />
            <Label className="text-base" htmlFor="r5">
              12 Months
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Page;
