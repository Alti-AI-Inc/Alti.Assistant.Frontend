'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useInboxQuery, useArchiveInboxItemMutation, InboxItem } from '@/hooks/useInbox';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  Copy, 
  Trash2, 
  Archive, 
  ArrowLeft,
  Calendar,
  Sparkles,
  Zap,
  Check,
  Building2,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { UserMode } from '@/types/tenant';

function InboxClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mode, currentTenant } = useTenant();
  const accessToken = session?.accessToken;
  const userId = session?.user?.id || (session as any)?.userId;

  const activeId = searchParams?.get('id');

  // Fetch all active inbox items
  const { data: inboxItems = [], isLoading } = useInboxQuery(
    userId,
    undefined,
    false, // isArchived: false
    accessToken
  );

  const activeItem = inboxItems.find(item => item._id === activeId);

  // Invalidate read status / mark as read on selection
  useEffect(() => {
    if (activeItem && !activeItem.isRead && accessToken) {
      // Mark as read asynchronously in the background
      const url = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/notification/update/${activeItem._id}`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ isRead: true })
      }).catch(err => console.error('Failed to mark notification as read:', err));
    }
  }, [activeItem, accessToken]);

  const archiveMutation = useArchiveInboxItemMutation();
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleArchive = async (id: string) => {
    if (!accessToken) return;
    try {
      await archiveMutation.mutateAsync({
        notificationId: id,
        archived: true,
        accessToken
      });
      // Redirect back to overview screen
      router.push('/inbox');
    } catch (err) {
      console.error('Failed to archive inbox item:', err);
    }
  };

  // Metrics calculations
  const totalRuns = inboxItems.length;
  const successfulRuns = inboxItems.filter(item => item.payload?.status === 'success').length;
  const failedRuns = inboxItems.filter(item => item.payload?.status === 'failed').length;
  const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 100;
  
  // Calculate simulated time saved (45 mins per success run)
  const timeSavedMinutes = successfulRuns * 45;
  const hoursSaved = Math.floor(timeSavedMinutes / 60);
  const remainingMinutes = timeSavedMinutes % 60;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#e1e1e1] dark:bg-zinc-950 relative">

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            Loading Inbox Feed...
          </div>
        </div>
      ) : activeItem ? (
        /* Selected State: Output Viewer Workspace */
        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          {/* Reader Body */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
            {/* Mobile Back Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 rounded-lg text-xs md:hidden self-start px-2 -ml-2 text-zinc-500 hover:text-zinc-800"
              onClick={() => router.push('/inbox')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Inbox
            </Button>
            {/* Status overview metadata card */}
            <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  {activeItem.payload?.status === 'success' ? (
                    <Badge className="bg-emerald-500/10 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md font-semibold px-2 py-0.5 text-xs flex gap-1 items-center select-none">
                      <CheckCircle2 className="h-3 w-3" /> Success
                    </Badge>
                  ) : activeItem.payload?.status === 'failed' ? (
                    <Badge className="bg-rose-500/10 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-md font-semibold px-2 py-0.5 text-xs flex gap-1 items-center select-none">
                      <XCircle className="h-3 w-3" /> Failed
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-md font-semibold px-2 py-0.5 text-xs flex gap-1 items-center select-none">
                      <AlertTriangle className="h-3 w-3" /> Warning
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
                    Run ID: {activeItem.payload?.executionId?.slice(0, 8) || activeItem._id.slice(0, 8)}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 mt-1 select-none">
                  {activeItem.description}
                </h3>
              </div>

              <div className="flex items-center gap-5 text-xs text-gray-500 dark:text-zinc-400 select-none">
                {activeItem.payload?.duration !== undefined && (
                  <div className="flex items-center gap-1.5 border-r border-black/10 dark:border-white/10 pr-5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Took</p>
                      <p className="font-semibold text-gray-800 dark:text-zinc-200 text-xs">
                        {(activeItem.payload.duration / 1000).toFixed(1)}s
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-1.5 border-r border-black/10 dark:border-white/10 pr-5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Executed</p>
                    <p className="font-semibold text-gray-800 dark:text-zinc-200 text-xs">
                      {new Date(activeItem.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900"
                    onClick={() => handleCopy(activeItem.payload?.summary || activeItem.description)}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:bg-rose-500/20"
                    onClick={() => handleArchive(activeItem._id)}
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                  </Button>
                </div>
              </div>
            </div>

            {/* Expandable step-by-step nested trace logs */}
            {activeItem.payload?.results && activeItem.payload.results.length > 0 && (
              <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/30 p-5 space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider select-none">
                  Step-by-Step Execution Trace
                </h4>
                
                <div className="space-y-2">
                  {activeItem.payload.results.map((step: any, index: number) => {
                    const stepSuccess = step.success;
                    return (
                      <div 
                        key={step.stepId || index} 
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border text-xs bg-white dark:bg-zinc-900 transition-all select-none",
                          stepSuccess 
                            ? "border-emerald-500/15 dark:border-emerald-500/10" 
                            : "border-rose-500/15 dark:border-rose-500/10"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate min-w-0">
                          {stepSuccess ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                          )}
                          <span className="font-semibold text-gray-800 dark:text-zinc-200 truncate">
                            {step.stepId || `Step ${index + 1}`}
                          </span>
                          {step.error && (
                            <span className="text-[10px] text-rose-500 truncate italic">
                              - {step.error}
                            </span>
                          )}
                        </div>

                        {step.duration !== undefined && (
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {(step.duration / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rich Markdown Output Body */}
            <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 p-6 space-y-4">
              <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-black/5 dark:border-white/5 pb-2 select-none">
                Intelligence Output Report
              </h4>
              
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed text-gray-800 dark:text-zinc-200 whitespace-pre-wrap">
                {activeItem.payload?.summary || activeItem.description}
              </div>
            </div>
          </div>
        </div>
      ) : totalRuns === 0 ? (
        /* Empty State: Only the Centered Inbox is Empty Box, No Navbar, No Welcome Text, No Cards */
        <div className="flex-1 flex items-center justify-center p-8 relative z-10 select-none">
          <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/30 p-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md">
            <div className="h-16 w-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Inbox className="h-8 w-8 text-zinc-400" />
            </div>
            <div className="space-y-1.5 select-none">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                Inbox is empty
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Once you trigger an autonomous background task or run an automation workflow, the completed reports will arrive here.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Default State: Summary Dashboard Landing when totalRuns > 0 but no item selected */
        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          {/* Dashboard Panel */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-5xl mx-auto w-full">
            <div className="space-y-1.5 select-none">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome to your Command Feed
              </h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                A secure repository of completed autonomous task outputs, research records, and scheduled pipeline digests.
              </p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 select-none">
              {/* Success Rate Card */}
              <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Automation success rate</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{successRate}%</p>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {successfulRuns} of {totalRuns} runs complete
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              {/* Time Saved Card */}
              <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Simulated time saved</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {hoursSaved > 0 ? `${hoursSaved}h ` : ''}{remainingMinutes}m
                  </p>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    @ 45 mins saved per run
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              {/* Total runs Card */}
              <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Total completed runs</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalRuns}</p>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {failedRuns} runs returned errors
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-zinc-500/10 text-zinc-500 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Main Central Empty State Display */}
            <div className="rounded-xl border border-black/10 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/30 p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                <Inbox className="h-8 w-8 text-zinc-400" />
              </div>
              <div className="space-y-1.5 max-w-md select-none">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                  Select an output to view report
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Click any completed automation run or task execution in the sidebar to review its rich logs and compiled summaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InboxClient;
