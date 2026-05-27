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
const STRATEGIC_APPS_STYLE: Record<string, { category: string; color: string; bgGlow: string; badge: string; hoverBorder: string }> = {
  // AEC & Real Estate
  autodesk: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'AEC Core', hoverBorder: 'border-amber-500/60' },
  yardi: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Property ERP', hoverBorder: 'border-amber-500/60' },
  realpage: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Multifamily ERP', hoverBorder: 'border-amber-500/60' },
  costar: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Valuation ERP', hoverBorder: 'border-amber-500/60' },
  argus: { category: 'AEC & Real Estate', color: 'border-amber-500/40 text-amber-500 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'DCF Model', hoverBorder: 'border-amber-500/60' },

  // Wealth & FinTech
  addepar: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Wealth Portfolio', hoverBorder: 'border-emerald-500/60' },
  carta: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Equity ERP', hoverBorder: 'border-emerald-500/60' },
  fiserv: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Banking Core', hoverBorder: 'border-emerald-500/60' },
  factset: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Debt Valuation', hoverBorder: 'border-emerald-500/60' },
  bloomberg: { category: 'Wealth & FinTech', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Market Terminal', hoverBorder: 'border-emerald-500/60' },

  // LegalTech
  harvey: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Legal AI Core', hoverBorder: 'border-violet-500/60' },
  ironclad: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'CLM Core', hoverBorder: 'border-violet-500/60' },
  relativity: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'e-Discovery', hoverBorder: 'border-violet-500/60' },
  onetrust: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Privacy & GRC', hoverBorder: 'border-violet-500/60' },
  lexisnexis: { category: 'LegalTech & GRC', color: 'border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Case Analytics', hoverBorder: 'border-violet-500/60' },

  // Healthcare
  veevavault: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Life Sciences', hoverBorder: 'border-rose-500/60' },
  epic: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'EHR Core', hoverBorder: 'border-rose-500/60' },
  athenahealth: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'EHR Outpatient', hoverBorder: 'border-rose-500/60' },
  elationhealth: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Primary Care', hoverBorder: 'border-rose-500/60' },
  iqvia: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Market Intel', hoverBorder: 'border-rose-500/60' },
  changehealthcare: { category: 'Clinical Healthcare', color: 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Claim Proxy', hoverBorder: 'border-rose-500/60' },

  // Supply Chain
  coupa: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Spend Mgmt', hoverBorder: 'border-cyan-500/60' },
  ariba: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Sourcing ERP', hoverBorder: 'border-cyan-500/60' },
  flexport: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Freight IoT', hoverBorder: 'border-cyan-500/60' },
  samsara: { category: 'Procurement & Logistics', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Fleet IoT', hoverBorder: 'border-cyan-500/60' },

  // Workforce Capital
  adp: { category: 'Workforce Capital', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Payroll ERP', hoverBorder: 'border-violet-500/60' },
  deel: { category: 'Workforce Capital', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Global HCM', hoverBorder: 'border-violet-500/60' },
  workday: { category: 'Workforce Capital', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Workforce HCM', hoverBorder: 'border-violet-500/60' },

  // Enterprise ERP
  netsuite: { category: 'Enterprise ERP', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Cloud ERP', hoverBorder: 'border-emerald-500/60' },
  sap: { category: 'Enterprise ERP', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'ERP Ledger', hoverBorder: 'border-emerald-500/60' },

  // Customer & IT Ops
  salesforce: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'CRM Core', hoverBorder: 'border-blue-500/60' },
  servicenow: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'ITSM Core', hoverBorder: 'border-blue-500/60' },
  snowflake: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'Data Lake', hoverBorder: 'border-blue-500/60' },
  hubspot: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'Growth CRM', hoverBorder: 'border-blue-500/60' },
  zendesk: { category: 'Customer & IT Ops', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20', bgGlow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]', badge: 'Helpdesk ERP', hoverBorder: 'border-blue-500/60' },

  // DevOps & SecOps
  datadog: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'APM Metrics', hoverBorder: 'border-fuchsia-500/60' },
  pagerduty: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Incident Ops', hoverBorder: 'border-fuchsia-500/60' },
  hashicorp_vault: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Secrets Mgmt', hoverBorder: 'border-fuchsia-500/60' },
  splunk: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'SIEM Logs', hoverBorder: 'border-fuchsia-500/60' },
  dynatrace: { category: 'DevOps & SecOps', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Observability', hoverBorder: 'border-fuchsia-500/60' },

  // Data & Analytics
  databricks: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Lakehouse ML', hoverBorder: 'border-indigo-500/60' },
  tableau: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Visual Analytics', hoverBorder: 'border-indigo-500/60' },
  powerbi: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'BI Dashboard', hoverBorder: 'border-indigo-500/60' },
  googlebigquery: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Data Warehouse', hoverBorder: 'border-indigo-500/60' },
  looker: { category: 'Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Semantic Model', hoverBorder: 'border-indigo-500/60' },

  // MarTech & CX
  shopify: { category: 'MarTech & CX', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'E-Commerce ERP', hoverBorder: 'border-amber-500/60' },
  adobe_experience: { category: 'MarTech & CX', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Experience CDP', hoverBorder: 'border-amber-500/60' },
  twilio_segment: { category: 'MarTech & CX', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Data Infrastructure', hoverBorder: 'border-amber-500/60' },
  marketo: { category: 'MarTech & CX', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'B2B Automation', hoverBorder: 'border-amber-500/60' },
  exacttarget: { category: 'MarTech & CX', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Multi-Channel Ops', hoverBorder: 'border-amber-500/60' },

  // Cybersecurity & IAM
  okta: { category: 'Cybersecurity & IAM', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Identity & IAM', hoverBorder: 'border-emerald-500/60' },
  crowdstrike: { category: 'Cybersecurity & IAM', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'XDR & EDR Core', hoverBorder: 'border-emerald-500/60' },
  sentinelone: { category: 'Cybersecurity & IAM', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Endpoint Remediation', hoverBorder: 'border-emerald-500/60' },
  zscaler: { category: 'Cybersecurity & IAM', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Zero Trust SASE', hoverBorder: 'border-emerald-500/60' },
  pingidentity: { category: 'Cybersecurity & IAM', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'SSO Federation', hoverBorder: 'border-emerald-500/60' },

  // AI & Machine Learning
  openai: { category: 'AI & Machine Learning', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'LLM API Core', hoverBorder: 'border-cyan-500/60' },
  weights_biases: { category: 'AI & Machine Learning', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'ML Experimentation', hoverBorder: 'border-cyan-500/60' },
  huggingface: { category: 'AI & Machine Learning', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Model Repository', hoverBorder: 'border-cyan-500/60' },
  pinecone: { category: 'AI & Machine Learning', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Vector Database', hoverBorder: 'border-cyan-500/60' },
  sagemaker: { category: 'AI & Machine Learning', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'MLOps Engine', hoverBorder: 'border-cyan-500/60' },

  // Cohort 1: Phase 13 – Enterprise Collaboration & KM Core (Rose Glow)
  sharepoint: { category: 'Enterprise Collaboration', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Intranet Core', hoverBorder: 'border-rose-500/60' },
  confluence: { category: 'Enterprise Collaboration', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Wiki Core', hoverBorder: 'border-rose-500/60' },
  notion: { category: 'Enterprise Collaboration', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Doc Core', hoverBorder: 'border-rose-500/60' },
  box: { category: 'Enterprise Collaboration', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Box Cloud', hoverBorder: 'border-rose-500/60' },
  slack_enterprise: { category: 'Enterprise Collaboration', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Chat Core', hoverBorder: 'border-rose-500/60' },

  // Cohort 2: Phase 14 – Corporate Expense & AP Automation Core (Yellow/Gold Glow)
  concur: { category: 'Expense & AP Core', color: 'border-yellow-500/40 text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20', bgGlow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', badge: 'Concur Spend', hoverBorder: 'border-yellow-500/60' },
  expensify: { category: 'Expense & AP Core', color: 'border-yellow-500/40 text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20', bgGlow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', badge: 'AP Audit', hoverBorder: 'border-yellow-500/60' },
  bill: { category: 'Expense & AP Core', color: 'border-yellow-500/40 text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20', bgGlow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', badge: 'Bill.com Payable', hoverBorder: 'border-yellow-500/60' },
  tipalti: { category: 'Expense & AP Core', color: 'border-yellow-500/40 text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20', bgGlow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', badge: 'Global AP', hoverBorder: 'border-yellow-500/60' },
  ramp: { category: 'Expense & AP Core', color: 'border-yellow-500/40 text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20', bgGlow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', badge: 'Smart Card', hoverBorder: 'border-yellow-500/60' },

  // Cohort 3: Phase 15 – HR Tech, Talent Acquisition & Performance (Violet Glow)
  greenhouse: { category: 'HR Tech Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Recruit Core', hoverBorder: 'border-violet-500/60' },
  lever: { category: 'HR Tech Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Talent Pool', hoverBorder: 'border-violet-500/60' },
  lattice: { category: 'HR Tech Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Performance', hoverBorder: 'border-violet-500/60' },
  hirevue: { category: 'HR Tech Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Video AI', hoverBorder: 'border-violet-500/60' },
  bamboohr: { category: 'HR Tech Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'HR Directory', hoverBorder: 'border-violet-500/60' },

  // Cohort 4: Phase 16 – Supply Chain, WMS & EDI Core (Slate Glow)
  manhattan_wms: { category: 'Supply Chain Core', color: 'border-slate-500/40 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'Active WMS', hoverBorder: 'border-slate-500/60' },
  blue_yonder: { category: 'Supply Chain Core', color: 'border-slate-500/40 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'Stock Forecast', hoverBorder: 'border-slate-500/60' },
  sps_commerce: { category: 'Supply Chain Core', color: 'border-slate-500/40 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'EDI Network', hoverBorder: 'border-slate-500/60' },
  sap_ibp: { category: 'Supply Chain Core', color: 'border-slate-500/40 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'S&OP Planning', hoverBorder: 'border-slate-500/60' },
  netsuite_wms: { category: 'Supply Chain Core', color: 'border-slate-500/40 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'WMS Cloud', hoverBorder: 'border-slate-500/60' },

  // Cohort 5: Phase 17 – CCaaS & Telephony Communications (Sky Glow)
  genesys: { category: 'CCaaS & Telephony', color: 'border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'Genesys CX', hoverBorder: 'border-sky-500/60' },
  five9: { category: 'CCaaS & Telephony', color: 'border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'Dialer Core', hoverBorder: 'border-sky-500/60' },
  talkdesk: { category: 'CCaaS & Telephony', color: 'border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'VOIP Desk', hoverBorder: 'border-sky-500/60' },
  zoom_phone: { category: 'CCaaS & Telephony', color: 'border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'VoIP Portal', hoverBorder: 'border-sky-500/60' },
  twilio_flex: { category: 'CCaaS & Telephony', color: 'border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'Twilio Flex', hoverBorder: 'border-sky-500/60' },

  // Cohort 6: Phase 18 – Corporate Treasury & FX Hedging Core (Amber Glow)
  kyriba: { category: 'Treasury Core', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Kyriba Cash', hoverBorder: 'border-amber-500/60' },
  gtreasury: { category: 'Treasury Core', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Liquidity ERP', hoverBorder: 'border-amber-500/60' },
  reval: { category: 'Treasury Core', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'FX Hedge', hoverBorder: 'border-amber-500/60' },
  sap_treasury: { category: 'Treasury Core', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'SAP Treasury', hoverBorder: 'border-amber-500/60' },
  bloomberg_fx: { category: 'Treasury Core', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'FX Terminal', hoverBorder: 'border-amber-500/60' },

  // Cohort 7: Phase 19 – Enterprise Sourcing & Supplier Network (Lime Glow)
  ivalua: { category: 'Sourcing Core', color: 'border-lime-500/40 text-lime-650 dark:text-lime-400 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'Sourcing Core', hoverBorder: 'border-lime-500/60' },
  gep_smart: { category: 'Sourcing Core', color: 'border-lime-500/40 text-lime-650 dark:text-lime-400 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'Contract ERP', hoverBorder: 'border-lime-500/60' },
  jaggaer: { category: 'Sourcing Core', color: 'border-lime-500/40 text-lime-650 dark:text-lime-400 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'RFQ Portal', hoverBorder: 'border-lime-500/60' },
  zycus: { category: 'Sourcing Core', color: 'border-lime-500/40 text-lime-650 dark:text-lime-400 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'Zycus S2P', hoverBorder: 'border-lime-500/60' },
  sap_fieldglass: { category: 'Sourcing Core', color: 'border-lime-500/40 text-lime-650 dark:text-lime-400 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'Fieldglass VMS', hoverBorder: 'border-lime-500/60' },

  // Cohort 8: Phase 20 – Digital Identity & Zero Trust Core (Red/Crimson Glow)
  cyberark: { category: 'Zero Trust Core', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'Privilege Vault', hoverBorder: 'border-red-500/60' },
  sailpoint: { category: 'Zero Trust Core', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'Identity Gov', hoverBorder: 'border-red-500/60' },
  cloudflare_ent: { category: 'Zero Trust Core', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'WAF Edge', hoverBorder: 'border-red-500/60' },
  netskope: { category: 'Zero Trust Core', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'SASE Secure', hoverBorder: 'border-red-500/60' },
  entra_id: { category: 'Zero Trust Core', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'Entra ID', hoverBorder: 'border-red-500/60' },

  // Cohort 9: Phase 21 – Asset Management, Facility IoT & Maintenance (Zinc Glow)
  ibm_maximo: { category: 'Facility IoT', color: 'border-zinc-500/40 text-zinc-650 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20', bgGlow: 'shadow-[0_0_15px_rgba(113,113,122,0.15)]', badge: 'Maximo EAM', hoverBorder: 'border-zinc-500/60' },
  sap_asset_manager: { category: 'Facility IoT', color: 'border-zinc-500/40 text-zinc-650 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20', bgGlow: 'shadow-[0_0_15px_rgba(113,113,122,0.15)]', badge: 'Asset Registry', hoverBorder: 'border-zinc-500/60' },
  honeywell_forge: { category: 'Facility IoT', color: 'border-zinc-500/40 text-zinc-650 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20', bgGlow: 'shadow-[0_0_15px_rgba(113,113,122,0.15)]', badge: 'Forge IoT', hoverBorder: 'border-zinc-500/60' },
  siemens_desigo: { category: 'Facility IoT', color: 'border-zinc-500/40 text-zinc-650 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20', bgGlow: 'shadow-[0_0_15px_rgba(113,113,122,0.15)]', badge: 'Desigo Auto', hoverBorder: 'border-zinc-500/60' },
  johnson_metasys: { category: 'Facility IoT', color: 'border-zinc-500/40 text-zinc-650 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20', bgGlow: 'shadow-[0_0_15px_rgba(113,113,122,0.15)]', badge: 'Metasys BMS', hoverBorder: 'border-zinc-500/60' },

  // Cohort 10: Phase 22 – ESG & Sustainability Reporting Core (Emerald Glow)
  watershed: { category: 'ESG & Sustainability', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Carbon Analytics', hoverBorder: 'border-emerald-500/60' },
  persefoni: { category: 'ESG & Sustainability', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Emissions accounting', hoverBorder: 'border-emerald-500/60' },
  sweep: { category: 'ESG & Sustainability', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Decarbon Task', hoverBorder: 'border-emerald-500/60' },
  msci_esg: { category: 'ESG & Sustainability', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'ESG Ratings', hoverBorder: 'border-emerald-500/60' },
  net_zero_cloud: { category: 'ESG & Sustainability', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Net Zero Cloud', hoverBorder: 'border-emerald-500/60' },

  // Phase 23: Business Communication & Email Core (Sky Glow)
  gmail: { category: 'Business Comm', color: 'border-sky-500/40 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'Gmail Core', hoverBorder: 'border-sky-500/60' },
  outlook: { category: 'Business Comm', color: 'border-sky-500/40 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'Outlook Core', hoverBorder: 'border-sky-500/60' },
  zoom: { category: 'Business Comm', color: 'border-sky-500/40 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'Zoom Core', hoverBorder: 'border-sky-500/60' },
  webex: { category: 'Business Comm', color: 'border-sky-500/40 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'Webex Core', hoverBorder: 'border-sky-500/60' },
  msteams: { category: 'Business Comm', color: 'border-sky-500/40 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20', bgGlow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', badge: 'MS Teams', hoverBorder: 'border-sky-500/60' },

  // Phase 24: Cloud Databases & Data Ingestion (Indigo Glow)
  mongodb: { category: 'Cloud DB Core', color: 'border-indigo-500/40 text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'MongoDB Atlas', hoverBorder: 'border-indigo-500/60' },
  dynamodb: { category: 'Cloud DB Core', color: 'border-indigo-500/40 text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'DynamoDB', hoverBorder: 'border-indigo-500/60' },
  postgres: { category: 'Cloud DB Core', color: 'border-indigo-500/40 text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'PostgreSQL', hoverBorder: 'border-indigo-500/60' },
  mysql: { category: 'Cloud DB Core', color: 'border-indigo-500/40 text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'MySQL Core', hoverBorder: 'border-indigo-500/60' },
  redis: { category: 'Cloud DB Core', color: 'border-indigo-500/40 text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Redis Cache', hoverBorder: 'border-indigo-500/60' },

  // Phase 25: Version Control & DevOps (Fuchsia Glow)
  github: { category: 'DevOps Core', color: 'border-fuchsia-500/40 text-fuchsia-600 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'GitHub Core', hoverBorder: 'border-fuchsia-500/60' },
  gitlab: { category: 'DevOps Core', color: 'border-fuchsia-500/40 text-fuchsia-600 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'GitLab CI', hoverBorder: 'border-fuchsia-500/60' },
  bitbucket: { category: 'DevOps Core', color: 'border-fuchsia-500/40 text-fuchsia-600 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Bitbucket', hoverBorder: 'border-fuchsia-500/60' },
  circleci: { category: 'DevOps Core', color: 'border-fuchsia-500/40 text-fuchsia-600 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'CircleCI Build', hoverBorder: 'border-fuchsia-500/60' },
  jenkins: { category: 'DevOps Core', color: 'border-fuchsia-500/40 text-fuchsia-600 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Jenkins Deploy', hoverBorder: 'border-fuchsia-500/60' },

  // Phase 26: Project Management & Agile (Rose Glow)
  jira: { category: 'Agile Core', color: 'border-rose-500/40 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Jira Board', hoverBorder: 'border-rose-500/60' },
  asana: { category: 'Agile Core', color: 'border-rose-500/40 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Asana Plan', hoverBorder: 'border-rose-500/60' },
  monday: { category: 'Agile Core', color: 'border-rose-500/40 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Monday Board', hoverBorder: 'border-rose-500/60' },
  trello: { category: 'Agile Core', color: 'border-rose-500/40 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Trello Card', hoverBorder: 'border-rose-500/60' },
  clickup: { category: 'Agile Core', color: 'border-rose-500/40 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'ClickUp Sprints', hoverBorder: 'border-rose-500/60' },

  // Phase 27: Marketing & Social Platforms (Amber Glow)
  google_ads: { category: 'Marketing & Ads', color: 'border-amber-500/40 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Google Ads', hoverBorder: 'border-amber-500/60' },
  facebook_ads: { category: 'Marketing & Ads', color: 'border-amber-500/40 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Meta Ads', hoverBorder: 'border-amber-500/60' },
  linkedin_ads: { category: 'Marketing & Ads', color: 'border-amber-500/40 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'LinkedIn Ads', hoverBorder: 'border-amber-500/60' },
  twitter_x: { category: 'Marketing & Ads', color: 'border-amber-500/40 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Twitter/X', hoverBorder: 'border-amber-500/60' },
  mailchimp: { category: 'Marketing & Ads', color: 'border-amber-500/40 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Mailchimp List', hoverBorder: 'border-amber-500/60' },

  // Phase 28: Customer Feedback & Survey (Lime Glow)
  surveymonkey: { category: 'Feedback Core', color: 'border-lime-500/40 text-lime-650 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'SurveyMonkey', hoverBorder: 'border-lime-500/60' },
  typeform: { category: 'Feedback Core', color: 'border-lime-500/40 text-lime-650 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'Typeform Forms', hoverBorder: 'border-lime-500/60' },
  satismeter: { category: 'Feedback Core', color: 'border-lime-500/40 text-lime-650 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'SatisMeter NPS', hoverBorder: 'border-lime-500/60' },
  freshdesk: { category: 'Feedback Core', color: 'border-lime-500/40 text-lime-650 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'Freshdesk Help', hoverBorder: 'border-lime-500/60' },
  hubspot_feedback: { category: 'Feedback Core', color: 'border-lime-500/40 text-lime-650 bg-lime-50/50 dark:bg-lime-950/20', bgGlow: 'shadow-[0_0_15px_rgba(132,204,22,0.15)]', badge: 'HubSpot NPS', hoverBorder: 'border-lime-500/60' },

  // Phase 29: Cloud Infrastructure & Storage (Slate Glow)
  aws_s3: { category: 'Cloud Storage', color: 'border-slate-500/40 text-slate-600 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'AWS S3 Bucket', hoverBorder: 'border-slate-500/60' },
  google_storage: { category: 'Cloud Storage', color: 'border-slate-500/40 text-slate-600 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'Google Cloud GCS', hoverBorder: 'border-slate-500/60' },
  azure_blob: { category: 'Cloud Storage', color: 'border-slate-500/40 text-slate-600 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'Azure Blob', hoverBorder: 'border-slate-500/60' },
  dropbox: { category: 'Cloud Storage', color: 'border-slate-500/40 text-slate-600 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'Dropbox Folder', hoverBorder: 'border-slate-500/60' },
  google_drive: { category: 'Cloud Storage', color: 'border-slate-500/40 text-slate-600 bg-slate-50/50 dark:bg-slate-950/20', bgGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', badge: 'Google Drive', hoverBorder: 'border-slate-500/60' },

  // Phase 30: AI Services & Model Registries (Cyan Glow)
  replicate: { category: 'AI Registry', color: 'border-cyan-500/40 text-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Replicate AI', hoverBorder: 'border-cyan-500/60' },
  langsmith: { category: 'AI Registry', color: 'border-cyan-500/40 text-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'LangSmith Trace', hoverBorder: 'border-cyan-500/60' },
  mlflow: { category: 'AI Registry', color: 'border-cyan-500/40 text-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'MLflow Registry', hoverBorder: 'border-cyan-500/60' },
  cohere: { category: 'AI Registry', color: 'border-cyan-500/40 text-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Cohere API', hoverBorder: 'border-cyan-500/60' },
  langchain_hub: { category: 'AI Registry', color: 'border-cyan-500/40 text-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'LangChain Hub', hoverBorder: 'border-cyan-500/60' }
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
            strategicStyle.hoverBorder
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
