'use client';

import {
  verifyInvitationToken,
  acceptInvitation,
} from '@/actions/memberActions';
import { switchTenant } from '@/actions/tenantActions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { VerifyInvitationResponse } from '@/types/tenant';

export default function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string[] }>;
}) {
  // [...token] catch-all route — param is an array of path segments
  const { token: tokenSegments } = use(params);
  const token = Array.isArray(tokenSegments)
    ? tokenSegments.join('/')
    : tokenSegments;
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [invitation, setInvitation] = useState<VerifyInvitationResponse | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — verify the token
  useEffect(() => {
    const verifyToken = async () => {
      setIsVerifying(true);
      setError(null);

      try {
        const response = await verifyInvitationToken(token);

        if (response.success && response.data) {
          setInvitation(response.data);
        } else {
          setError(response.message || 'Invalid or expired invitation');
        }
      } catch (err) {
        console.error('Failed to verify invitation:', err);
        setError('Failed to verify invitation');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  // Step 2 — once both invitation and auth status are known, redirect unauthenticated users
  useEffect(() => {
    if (!invitation || status === 'loading' || status === 'authenticated')
      return;

    // Unauthenticated — send to register or login based on whether account exists
    setIsRedirecting(true);
    const params = new URLSearchParams({
      invitationToken: token,
      email: invitation.email,
      tenantName: invitation.tenantName,
    });

    const destination = invitation.isUserExistWithEmail
      ? `/login?${params.toString()}`
      : `/register?${params.toString()}`;

    router.push(destination);
  }, [invitation, status, token, router]);

  // Authenticated — accept the invitation via API
  const handleAccept = async () => {
    if (!session?.accessToken || !invitation) return;

    const inviteId = invitation._id ?? invitation.id;
    if (!invitation.tenantId?.trim() || !inviteId?.trim()) {
      toast.error(
        'This invitation is missing organization or invitation details. Please use the link from your email or ask for a new invite.',
      );
      return;
    }

    setIsAccepting(true);
    try {
      const response = await acceptInvitation(invitation.tenantId, inviteId);

      if (response.success) {
        const tenantId = response.data?.tenantId ?? invitation?.tenantId;

        // Switch to the new tenant to get a JWT with tenant context embedded
        if (tenantId) {
          try {
            const switchResponse = await switchTenant(tenantId);
            if (switchResponse.success && switchResponse.data?.accessToken) {
              await update({ accessToken: switchResponse.data.accessToken });
            }
          } catch (switchErr) {
            console.warn(
              'Failed to switch tenant context after accept:',
              switchErr,
            );
          }
        }

        toast.success('Invitation accepted! Welcome to the organization.');
        router.push(tenantId ? `/organizations/${tenantId}` : '/organizations');
      } else {
        toast.error(response.message || 'Failed to accept invitation');
      }
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      toast.error(
        err instanceof Error
          ? err.message
          : 'An error occurred while accepting the invitation',
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = () => {
    setIsRejecting(true);
    toast.info('Invitation declined');
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  // Loading/verifying state
  if (isVerifying || status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="container max-w-md">
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="container max-w-md">
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <XCircle className="text-destructive size-6" />
                </div>
                <div>
                  <CardTitle>Invalid Invitation</CardTitle>
                  <CardDescription>
                    {error || 'This invitation link is not valid'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                The invitation may have expired or been cancelled. Please
                contact the organization owner for a new invitation.
              </p>
              <Button onClick={() => router.push('/')} className="w-full">
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Unauthenticated — show brief redirect interstitial
  if (isRedirecting || status === 'unauthenticated') {
    const message = invitation.isUserExistWithEmail
      ? 'Redirecting to sign in...'
      : 'Setting up your account...';

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="container max-w-md">
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Building2 className="text-primary size-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {invitation.tenantName}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    You&apos;ve been invited as{' '}
                    <span className="font-medium capitalize">
                      {invitation.role}
                    </span>
                  </p>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Loader2 className="size-4 animate-spin" />
                  {message}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated — show accept/decline card
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="container max-w-md">
        <Card>
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Building2 className="text-primary size-6" />
              </div>
              <div className="flex-1">
                <CardTitle>Organization Invitation</CardTitle>
                <CardDescription>
                  You&apos;ve been invited to join an organization
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted space-y-3 rounded-lg p-4">
              <div>
                <div className="text-muted-foreground mb-1 text-sm">
                  Organization
                </div>
                <div className="text-lg font-semibold">
                  {invitation.tenantName}
                </div>
              </div>

              <div>
                <div className="text-muted-foreground mb-1 text-sm">
                  Your Email
                </div>
                <div className="font-medium">{invitation.email}</div>
              </div>

              <div>
                <div className="text-muted-foreground mb-1 text-sm">Role</div>
                <Badge variant="secondary" className="capitalize">
                  {invitation.role}
                </Badge>
              </div>

              {invitation.inviterName && (
                <div>
                  <div className="text-muted-foreground mb-1 text-sm">
                    Invited by
                  </div>
                  <div className="text-sm">{invitation.inviterName}</div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAccept}
                disabled={isAccepting || isRejecting}
                className="w-full"
              >
                {isAccepting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 size-4" />
                )}
                {isAccepting ? 'Accepting...' : 'Accept Invitation'}
              </Button>

              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isAccepting || isRejecting}
                className="w-full"
              >
                {isRejecting ? 'Declining...' : 'Decline'}
              </Button>
            </div>

            <p className="text-muted-foreground text-center text-xs">
              Accepting this invitation will give you access to{' '}
              <span className="font-medium">{invitation.tenantName}</span> and
              its resources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
