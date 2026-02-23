'use client';

import { verifyInvitationToken, acceptInvitation } from '@/actions/memberActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Loader2, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { VerifyInvitationResponse } from '@/types/tenant';

export default function AcceptInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [invitation, setInvitation] = useState<VerifyInvitationResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleAccept = async () => {
    if (!session?.accessToken) {
      // Redirect to login with return URL
      router.push(`/login?callbackUrl=/accept-invite/${token}`);
      return;
    }

    setIsAccepting(true);
    try {
      const response = await acceptInvitation(token);

      if (response.success) {
        toast.success('Invitation accepted! Welcome to the organization.');
        router.push(`/organizations/${invitation?.tenantId}`);
      } else {
        toast.error(response.message || 'Failed to accept invitation');
      }
    } catch (err) {
      console.error('Failed to accept invitation:', err);
      toast.error('An error occurred while accepting the invitation');
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

  // Loading state
  if (isVerifying || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="container max-w-md">
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="container max-w-md">
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="size-6 text-destructive" />
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
              <p className="text-sm text-muted-foreground mb-4">
                The invitation may have expired or been cancelled. Please contact the
                organization owner for a new invitation.
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

  // Success state - show invitation details
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="size-6 text-primary" />
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
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Organization
                  </div>
                  <div className="font-semibold text-lg">
                    {invitation.tenantName}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Your Email
                  </div>
                  <div className="font-medium">{invitation.email}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Role</div>
                  <Badge variant="secondary" className="capitalize">
                    {invitation.role}
                  </Badge>
                </div>

                {invitation.invitedBy && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Invited by
                    </div>
                    <div className="text-sm">{invitation.invitedBy}</div>
                  </div>
                )}
              </div>

              {!session ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    You need to be logged in to accept this invitation. You&apos;ll be
                    redirected to the login page.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAccept}
                disabled={isAccepting || isRejecting}
                className="w-full"
              >
                {isAccepting && <Loader2 className="size-4 mr-2 animate-spin" />}
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

            {session && (
              <p className="text-xs text-center text-muted-foreground">
                Accepting this invitation will give you access to{' '}
                <span className="font-medium">{invitation.tenantName}</span> and its
                resources.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
