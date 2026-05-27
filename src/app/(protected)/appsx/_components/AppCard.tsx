import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  useInitiateConnectionMutation,
  useWaitForConnectionMutation,
} from '@/hooks/useConnectApps';
import { APP } from '@/lib/all-apps';
import { cn } from '@/lib/utils';
import { LoaderCircle, ShieldCheck, Zap } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

// Premium high-stakes app configuration mapping
const STRATEGIC_APPS_STYLE: Record<string, { category: string; color: string; bgGlow: string; badge: string }> = {
  // AEC & Real Estate
  autodesk: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'AEC Core' },
  yardi: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Property ERP' },
  realpage: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Multifamily ERP' },
  costar: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Valuation ERP' },
  argus: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'DCF Model' },

  // Wealth & FinTech
  addepar: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Wealth Portfolio' },
  carta: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Equity ERP' },
  fiserv: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Banking Core' },
  factset: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Debt Valuation' },
  bloomberg: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Market Terminal' },

  // LegalTech
  harvey: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Legal AI Core' },
  ironclad: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'CLM Core' },
  relativity: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'e-Discovery' },
  onetrust: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Privacy & GRC' },
  lexisnexis: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Case Analytics' },

  // Healthcare
  veevavault: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Life Sciences' },
  epic: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'EHR Core' },
  athenahealth: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'EHR Outpatient' },
  elationhealth: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Primary Care' },
  iqvia: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Market Intel' },
  changehealthcare: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Claim Proxy' },

  // Supply Chain
  coupa: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Spend Mgmt' },
  ariba: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Sourcing ERP' },
  flexport: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Freight IoT' },
  samsara: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Fleet IoT' },

  // Workforce Capital
  adp: { category: 'Workforce Capital', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Payroll ERP' },
  deel: { category: 'Workforce Capital', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Global HCM' },
  workday: { category: 'Workforce Capital', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Workforce HCM' },

  // Enterprise ERP
  netsuite: { category: 'Enterprise ERP', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Cloud ERP' },
  sap: { category: 'Enterprise ERP', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'ERP Ledger' },

  // Customer & IT Ops
  salesforce: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'CRM Core' },
  servicenow: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'ITSM Core' },
  snowflake: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'Data Lake' },
  hubspot: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'Growth CRM' },
  zendesk: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'Helpdesk ERP' },

  // DevOps & SecOps
  datadog: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'APM Metrics' },
  pagerduty: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Incident Ops' },
  hashicorp_vault: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Secrets Mgmt' },
  splunk: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'SIEM Logs' },
  dynatrace: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Observability' },

  // Data & Analytics
  databricks: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Lakehouse ML' },
  tableau: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Visual Analytics' },
  powerbi: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'BI Dashboard' },
  googlebigquery: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Data Warehouse' },
  looker: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Semantic Model' }
};

const AppCard = ({
  app,
  isAlreadyConnected,
}: {
  app: APP;
  isAlreadyConnected: boolean;
}) => {
  const { data: session } = useSession();
  const { mutate: initiateConnection, isPending } =
    useInitiateConnectionMutation();

  const { mutate: waitForConnection, isPending: isWaiting } =
    useWaitForConnectionMutation();

  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = () => {
    setErrorMessage('');
    initiateConnection(
      {
        app_name: app.app_name,
        user_id: session?.user?.id ?? '',
        accessToken: session?.accessToken ?? '',
      },
      {
        onSuccess: response => {
          if (!response || response.error) {
            setErrorMessage(response?.error || 'An unexpected error occurred');
            return;
          }
          const redirectUrl = response.authConfig.authConfig.redirectUrl;
          const connectedAccountId = response.authConfig.authConfig.id;

          window.open(redirectUrl, '_blank');

          if (connectedAccountId) {
            waitForConnection(connectedAccountId, {
              onSuccess: result => {
                console.log('✅ Connection established:', result);
              },
              onError: err => {
                console.error('❌ Error while waiting:', err);
              },
            });
          }
        },
        onError: error => {
          console.error('❌ Error initiating connection:', error);
        },
      },
    );
  };

  const slug = app.app_name?.toLowerCase() || '';
  const strategicStyle = STRATEGIC_APPS_STYLE[slug];

  return (
    <div className="h-full group">
      <Card
        className={cn(
          "h-full border bg-white/75 dark:bg-slate-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 p-0 relative overflow-hidden",
          strategicStyle 
            ? cn("border-slate-200/80 dark:border-slate-800/80 hover:border-transparent dark:hover:border-transparent", strategicStyle.bgGlow)
            : "border-slate-200/60 dark:border-slate-800/40 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700"
        )}
      >
        {/* Glow effect borders for strategic enterprise apps */}
        {strategicStyle && (
          <div className={cn(
            "absolute inset-0 border-[1.5px] rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            slug.includes('yardi') || slug.includes('autodesk') || slug.includes('realpage') || slug.includes('costar') || slug.includes('argus') ? 'border-amber-500/60' :
            slug.includes('addepar') || slug.includes('carta') || slug.includes('fiserv') || slug.includes('factset') || slug.includes('bloomberg') || slug.includes('sap') || slug.includes('netsuite') ? 'border-emerald-500/60' :
            slug.includes('harvey') || slug.includes('ironclad') || slug.includes('relativity') || slug.includes('onetrust') || slug.includes('lexisnexis') || slug.includes('workday') || slug.includes('adp') || slug.includes('deel') ? 'border-violet-500/60' :
            slug.includes('veevavault') || slug.includes('epic') || slug.includes('athenahealth') || slug.includes('elationhealth') || slug.includes('iqvia') || slug.includes('changehealthcare') ? 'border-rose-500/60' :
            slug.includes('salesforce') || slug.includes('servicenow') || slug.includes('snowflake') || slug.includes('hubspot') || slug.includes('zendesk') ? 'border-blue-500/60' :
            slug.includes('datadog') || slug.includes('pagerduty') || slug.includes('hashicorp_vault') || slug.includes('splunk') || slug.includes('dynatrace') ? 'border-fuchsia-500/60' :
            slug.includes('databricks') || slug.includes('tableau') || slug.includes('powerbi') || slug.includes('googlebigquery') || slug.includes('looker') ? 'border-indigo-500/60' :
            'border-cyan-500/60'
          )} />
        )}

        <CardContent className="flex flex-col h-full p-5 justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              {/* Premium Logo Container */}
              <div className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2 shadow-sm transition-all duration-300 group-hover:scale-105",
                strategicStyle && "border-slate-200/60 dark:border-slate-800"
              )}>
                <Image
                  src={app.image}
                  alt={app.title}
                  width={50}
                  height={50}
                  className="size-9 object-contain"
                />
              </div>

              {/* Status & Category Badges */}
              <div className="flex flex-col items-end space-y-1.5">
                {strategicStyle && (
                  <span className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                    strategicStyle.color
                  )}>
                    <Zap className="size-3" />
                    {strategicStyle.badge}
                  </span>
                )}
                
                {isAlreadyConnected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/50">
                    <ShieldCheck className="size-3" />
                    Connected
                  </span>
                )}
              </div>
            </div>

            {/* App Meta */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-250">
                {app.title}
              </h3>
              
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {app.description || `Integrate ${app.title} tools seamlessly to expand Alti's automation triggers and actions.`}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-5 space-y-2">
            {errorMessage && (
              <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-950/20 p-2 rounded-md border border-red-200/30">
                {errorMessage}
              </p>
            )}
            
            <Button
              className={cn(
                "w-full transition-all duration-300 font-medium shadow-sm",
                isAlreadyConnected
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-500 cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 border-none"
                  : strategicStyle
                    ? "bg-slate-900 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              )}
              variant={isAlreadyConnected ? "ghost" : "default"}
              disabled={isAlreadyConnected || isPending || isWaiting}
              onClick={handleClick}
            >
              {(isPending || isWaiting) && (
                <LoaderCircle className="mr-2 animate-spin size-4" />
              )}
              {isAlreadyConnected
                ? 'Authorized & Ready'
                : isPending || isWaiting
                  ? 'Connecting account...'
                  : 'Establish Integration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppCard;

