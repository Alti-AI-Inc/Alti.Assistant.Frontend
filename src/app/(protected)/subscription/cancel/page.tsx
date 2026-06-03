'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubscriptionCancelPage() {
  const router = useRouter();

  return (
    <div className="from-zinc-950 via-zinc-900 to-black min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.05),transparent_40%)] pointer-events-none" />
      <Card className="w-full max-w-lg border-zinc-800 bg-zinc-950/80 backdrop-blur-xl text-center shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="pb-4 pt-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20">
            <XCircle className="h-10 w-10 text-rose-400" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Checkout Cancelled
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm mt-2">
            Your billing transaction was not completed, and your plan limits remain unchanged.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 py-4">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 text-left text-sm text-zinc-300">
            <p>No charges have been made to your payment card. If this was an accident, you can retry checkout or select a different tier.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pb-8 pt-4 px-6">
          <Button
            onClick={() => router.push('/upgrade')}
            className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Upgrade
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full h-11 border-zinc-800 text-zinc-300 hover:bg-zinc-900 font-semibold rounded-lg transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
