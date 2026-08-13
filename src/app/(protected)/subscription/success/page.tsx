'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Loader2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionSuccessPage() {
  const { update } = useSession();
  const router = useRouter();
  const [isActivating, setIsActivating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function activate() {
      try {
        // Let webhook process on backend first
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!active) return;
        
        // Refresh session to pull latest role: 'admin' and subscription
        await update();
      } catch (err) {
        console.error('Failed to update session:', err);
        setError('Your subscription is active, but we had trouble refreshing your browser session. Please try logging out and logging back in if you do not see your updated dashboard.');
      } finally {
        if (active) {
          setIsActivating(false);
        }
      }
    }

    activate();
    return () => {
      active = false;
    };
  }, [update]);

  return (
    <div className="from-zinc-950 via-zinc-900 to-black min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.1),transparent_40%)] pointer-events-none" />
      <Card className="w-full max-w-lg border-zinc-800 bg-zinc-950/80 backdrop-blur-xl text-center shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <CardHeader className="pb-4 pt-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 relative">
            {isActivating ? (
              <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-in zoom-in duration-300" />
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-emerald-300 animate-pulse" />
              </>
            )}
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            {isActivating ? 'Activating Pro Access' : 'Welcome to Alti Pro!'}
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm mt-2">
            {isActivating
              ? 'Securing and configuring your premium workspace limits...'
              : 'Thank you for upgrading. Your billing is verified and your admin role is active.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4">
          {error ? (
            <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-4 text-left text-sm text-amber-300">
              {error}
            </div>
          ) : (
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 text-left space-y-4">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activated Benefits</h3>
              <div className="grid grid-cols-1 gap-3 text-sm text-zinc-300">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span><strong>Workspace Admin role</strong> active on this account</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Uncapped Web Search & Deep Research metrics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Access to **Admin & Manager settings panels**</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-8 pt-4 px-6">
          <Button
            onClick={() => router.push('/')}
            disabled={isActivating}
            className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isActivating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finalizing Setup...
              </>
            ) : (
              <>
                Launch Alti Workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-zinc-500 text-xs mt-1">
            Redirecting or closing this page will not interrupt the setup process.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
