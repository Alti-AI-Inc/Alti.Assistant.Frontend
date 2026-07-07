import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { APP } from '@/lib/all-apps';
import { cn } from '@/lib/utils';
import { LoaderCircle, ShieldCheck, Zap, User, Lock, Mail, Server } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import AppImage from '@/components/AppImage';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { installApp, stopApp } from '@/actions/apps';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppBlueprint {
  requiredEnv: string[];
  labels: Record<string, string>;
  placeholders: Record<string, string>;
  needsDatabaseUrl?: boolean;
}

const MCP_BLUEPRINTS: Record<string, AppBlueprint> = {
  "google-maps": {
    requiredEnv: ["MAPS_API_KEY"],
    labels: {
      "MAPS_API_KEY": "Google Maps Platform API Key"
    },
    placeholders: {
      "MAPS_API_KEY": "AIzaSy..."
    }
  },
  "slack": {
    requiredEnv: ["SLACK_BOT_TOKEN"],
    labels: {
      "SLACK_BOT_TOKEN": "Slack Bot User OAuth Token"
    },
    placeholders: {
      "SLACK_BOT_TOKEN": "xoxb-..."
    }
  },
  "linear": {
    requiredEnv: ["LINEAR_API_KEY"],
    labels: {
      "LINEAR_API_KEY": "Linear Personal Access Token"
    },
    placeholders: {
      "LINEAR_API_KEY": "lin_api_..."
    }
  },
  "gcal": {
    requiredEnv: ["GOOGLE_CALENDAR_CREDENTIALS"],
    labels: {
      "GOOGLE_CALENDAR_CREDENTIALS": "Google Calendar Credentials JSON"
    },
    placeholders: {
      "GOOGLE_CALENDAR_CREDENTIALS": "{\"installed\": {..."
    }
  },
  "katzilla": {
    requiredEnv: ["KATZILLA_API_KEY"],
    labels: {
      "KATZILLA_API_KEY": "Katzilla Platform API Key"
    },
    placeholders: {
      "KATZILLA_API_KEY": "kat_..."
    }
  },
  "postgres": {
    requiredEnv: [],
    labels: {},
    placeholders: {},
    needsDatabaseUrl: true
  },
  "postgresql": {
    requiredEnv: [],
    labels: {},
    placeholders: {},
    needsDatabaseUrl: true
  },
  "notion": {
    requiredEnv: ["NOTION_API_KEY"],
    labels: {
      "NOTION_API_KEY": "Notion API Key / Internal Integration Token"
    },
    placeholders: {
      "NOTION_API_KEY": "secret_..."
    }
  },
  "jira": {
    requiredEnv: ["JIRA_URL", "JIRA_API_TOKEN", "JIRA_EMAIL"],
    labels: {
      "JIRA_URL": "Jira Site URL",
      "JIRA_API_TOKEN": "Atlassian API Token",
      "JIRA_EMAIL": "Atlassian Account Email"
    },
    placeholders: {
      "JIRA_URL": "https://your-domain.atlassian.net",
      "JIRA_API_TOKEN": "ATATT3xF...",
      "JIRA_EMAIL": "your-email@company.com"
    }
  },
  "figma": {
    requiredEnv: ["FIGMA_PERSONAL_ACCESS_TOKEN"],
    labels: {
      "FIGMA_PERSONAL_ACCESS_TOKEN": "Figma Personal Access Token (PAT)"
    },
    placeholders: {
      "FIGMA_PERSONAL_ACCESS_TOKEN": "figd_..."
    }
  },
  "resend": {
    requiredEnv: ["RESEND_API_KEY"],
    labels: {
      "RESEND_API_KEY": "Resend API Key"
    },
    placeholders: {
      "RESEND_API_KEY": "re_..."
    }
  },
  "mongodb": {
    requiredEnv: ["MONGODB_URI"],
    labels: {
      "MONGODB_URI": "MongoDB Connection URI"
    },
    placeholders: {
      "MONGODB_URI": "mongodb+srv://username:password@cluster.mongodb.net/dbname"
    }
  },
  "airtable": {
    requiredEnv: ["AIRTABLE_API_KEY"],
    labels: {
      "AIRTABLE_API_KEY": "Airtable Personal Access Token (PAT)"
    },
    placeholders: {
      "AIRTABLE_API_KEY": "pat..."
    }
  },
  "shopify": {
    requiredEnv: ["SHOPIFY_SHOP_NAME", "SHOPIFY_API_PASSWORD"],
    labels: {
      "SHOPIFY_SHOP_NAME": "Shopify Shop Name (Subdomain)",
      "SHOPIFY_API_PASSWORD": "Shopify Admin API Access Token"
    },
    placeholders: {
      "SHOPIFY_SHOP_NAME": "my-store-name",
      "SHOPIFY_API_PASSWORD": "shpat_..."
    }
  },
  "hubspot": {
    requiredEnv: ["HUBSPOT_ACCESS_TOKEN"],
    labels: {
      "HUBSPOT_ACCESS_TOKEN": "HubSpot Private App Access Token"
    },
    placeholders: {
      "HUBSPOT_ACCESS_TOKEN": "pat-na1-..."
    }
  },
  "asana": {
    requiredEnv: ["ASANA_PAT"],
    labels: {
      "ASANA_PAT": "Asana Personal Access Token"
    },
    placeholders: {
      "ASANA_PAT": "1/123456789:..."
    }
  },
  "clickup": {
    requiredEnv: ["CLICKUP_API_TOKEN"],
    labels: {
      "CLICKUP_API_TOKEN": "ClickUp Personal API Token"
    },
    placeholders: {
      "CLICKUP_API_TOKEN": "pk_..."
    }
  },
  "zendesk": {
    requiredEnv: ["ZENDESK_SUBDOMAIN", "ZENDESK_EMAIL", "ZENDESK_API_TOKEN"],
    labels: {
      "ZENDESK_SUBDOMAIN": "Zendesk Subdomain",
      "ZENDESK_EMAIL": "Zendesk Account Email",
      "ZENDESK_API_TOKEN": "Zendesk API Token"
    },
    placeholders: {
      "ZENDESK_SUBDOMAIN": "your-company",
      "ZENDESK_EMAIL": "agent@your-company.com",
      "ZENDESK_API_TOKEN": "abc123xyz..."
    }
  },
  "mailchimp": {
    requiredEnv: ["MAILCHIMP_API_KEY"],
    labels: {
      "MAILCHIMP_API_KEY": "Mailchimp API Key"
    },
    placeholders: {
      "MAILCHIMP_API_KEY": "abc123xyz-usX"
    }
  },
  "intercom": {
    requiredEnv: ["INTERCOM_ACCESS_TOKEN"],
    labels: {
      "INTERCOM_ACCESS_TOKEN": "Intercom Access Token"
    },
    placeholders: {
      "INTERCOM_ACCESS_TOKEN": "dG9rZW46..."
    }
  },
  "pipedrive": {
    requiredEnv: ["PIPEDRIVE_API_TOKEN"],
    labels: {
      "PIPEDRIVE_API_TOKEN": "Pipedrive API Token"
    },
    placeholders: {
      "PIPEDRIVE_API_TOKEN": "abc123xyz..."
    }
  },
  "salesforce": {
    requiredEnv: ["SALESFORCE_USERNAME", "SALESFORCE_PASSWORD", "SALESFORCE_TOKEN", "SALESFORCE_CLIENT_ID", "SALESFORCE_CLIENT_SECRET"],
    labels: {
      "SALESFORCE_USERNAME": "Salesforce Username",
      "SALESFORCE_PASSWORD": "Salesforce Password",
      "SALESFORCE_TOKEN": "Salesforce Security Token",
      "SALESFORCE_CLIENT_ID": "OAuth Client ID (Consumer Key)",
      "SALESFORCE_CLIENT_SECRET": "OAuth Client Secret (Consumer Secret)"
    },
    placeholders: {
      "SALESFORCE_USERNAME": "user@company.com",
      "SALESFORCE_PASSWORD": "yourpassword",
      "SALESFORCE_TOKEN": "securitytoken...",
      "SALESFORCE_CLIENT_ID": "clientid...",
      "SALESFORCE_CLIENT_SECRET": "clientsecret..."
    }
  },
  "discord": {
    requiredEnv: ["DISCORD_BOT_TOKEN"],
    labels: {
      "DISCORD_BOT_TOKEN": "Discord Bot Token"
    },
    placeholders: {
      "DISCORD_BOT_TOKEN": "MTIzNDU..."
    }
  },
  "twilio": {
    requiredEnv: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
    labels: {
      "TWILIO_ACCOUNT_SID": "Twilio Account SID",
      "TWILIO_AUTH_TOKEN": "Twilio Auth Token"
    },
    placeholders: {
      "TWILIO_ACCOUNT_SID": "AC...",
      "TWILIO_AUTH_TOKEN": "your_auth_token"
    }
  },
  "pinecone": {
    requiredEnv: ["PINECONE_API_KEY"],
    labels: {
      "PINECONE_API_KEY": "Pinecone API Key"
    },
    placeholders: {
      "PINECONE_API_KEY": "pcsk_..."
    }
  },
  "supabase": {
    requiredEnv: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    labels: {
      "SUPABASE_URL": "Supabase Project URL",
      "SUPABASE_SERVICE_ROLE_KEY": "Supabase service_role API Key"
    },
    placeholders: {
      "SUPABASE_URL": "https://yourproject.supabase.co",
      "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGci..."
    }
  },
  "gmail": {
    requiredEnv: ["GMAIL_CREDENTIALS"],
    labels: {
      "GMAIL_CREDENTIALS": "Gmail Credentials JSON"
    },
    placeholders: {
      "GMAIL_CREDENTIALS": "{\"installed\": {..."
    }
  },
  "trello": {
    requiredEnv: ["TRELLO_API_KEY", "TRELLO_API_TOKEN"],
    labels: {
      "TRELLO_API_KEY": "Trello API Key",
      "TRELLO_API_TOKEN": "Trello OAuth Token"
    },
    placeholders: {
      "TRELLO_API_KEY": "your_api_key",
      "TRELLO_API_TOKEN": "your_oauth_token"
    }
  },
  "google-sheets": {
    requiredEnv: ["GOOGLE_SHEETS_CREDENTIALS"],
    labels: {
      "GOOGLE_SHEETS_CREDENTIALS": "Google Sheets Credentials JSON"
    },
    placeholders: {
      "GOOGLE_SHEETS_CREDENTIALS": "{\"installed\": {..."
    }
  },
  "google-docs": {
    requiredEnv: ["GOOGLE_DOCS_CREDENTIALS"],
    labels: {
      "GOOGLE_DOCS_CREDENTIALS": "Google Docs Credentials JSON"
    },
    placeholders: {
      "GOOGLE_DOCS_CREDENTIALS": "{\"installed\": {..."
    }
  },
  "mysql": {
    requiredEnv: [],
    labels: {},
    placeholders: {},
    needsDatabaseUrl: true
  },
  "aws-s3": {
    requiredEnv: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_S3_BUCKET", "AWS_REGION"],
    labels: {
      "AWS_ACCESS_KEY_ID": "AWS Access Key ID",
      "AWS_SECRET_ACCESS_KEY": "AWS Secret Access Key",
      "AWS_S3_BUCKET": "Target AWS S3 Bucket Name",
      "AWS_REGION": "AWS Region"
    },
    placeholders: {
      "AWS_ACCESS_KEY_ID": "AKIAIOSFODNN7EXAMPLE",
      "AWS_SECRET_ACCESS_KEY": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
      "AWS_S3_BUCKET": "my-alti-bucket",
      "AWS_REGION": "us-east-1"
    }
  },
  "microsoft-teams": {
    requiredEnv: ["TEAMS_CLIENT_ID", "TEAMS_CLIENT_SECRET", "TEAMS_TENANT_ID"],
    labels: {
      "TEAMS_CLIENT_ID": "Microsoft Teams OAuth Client ID",
      "TEAMS_CLIENT_SECRET": "Microsoft Teams OAuth Client Secret",
      "TEAMS_TENANT_ID": "Microsoft Teams Directory (Tenant) ID"
    },
    placeholders: {
      "TEAMS_CLIENT_ID": "00000000-0000-0000-0000-000000000000",
      "TEAMS_CLIENT_SECRET": "client_secret_xyz",
      "TEAMS_TENANT_ID": "00000000-0000-0000-0000-000000000000"
    }
  },
  "outlook": {
    requiredEnv: ["OUTLOOK_CLIENT_ID", "OUTLOOK_CLIENT_SECRET"],
    labels: {
      "OUTLOOK_CLIENT_ID": "Microsoft Outlook OAuth Client ID",
      "OUTLOOK_CLIENT_SECRET": "Microsoft Outlook OAuth Client Secret"
    },
    placeholders: {
      "OUTLOOK_CLIENT_ID": "00000000-0000-0000-0000-000000000000",
      "OUTLOOK_CLIENT_SECRET": "client_secret_xyz"
    }
  },
  "sendgrid": {
    requiredEnv: ["SENDGRID_API_KEY"],
    labels: {
      "SENDGRID_API_KEY": "SendGrid Send Token (API Key)"
    },
    placeholders: {
      "SENDGRID_API_KEY": "SG.xxxxxxxx"
    }
  },
  "firecrawl": {
    requiredEnv: ["FIRECRAWL_API_KEY"],
    labels: {
      "FIRECRAWL_API_KEY": "Firecrawl Scraper API Key"
    },
    placeholders: {
      "FIRECRAWL_API_KEY": "fc-xxxxxxxx"
    }
  },
  "tavily": {
    requiredEnv: ["TAVILY_API_KEY"],
    labels: {
      "TAVILY_API_KEY": "Tavily Search API Key"
    },
    placeholders: {
      "TAVILY_API_KEY": "tvly-xxxxxxxx"
    }
  },
  "perplexity": {
    requiredEnv: ["PERPLEXITY_API_KEY"],
    labels: {
      "PERPLEXITY_API_KEY": "Perplexity API Key"
    },
    placeholders: {
      "PERPLEXITY_API_KEY": "pplx-xxxxxxxx"
    }
  },
  "exa": {
    requiredEnv: ["EXA_API_KEY"],
    labels: {
      "EXA_API_KEY": "Exa Neural Search API Key"
    },
    placeholders: {
      "EXA_API_KEY": "exa-xxxxxxxx"
    }
  },
  "serpapi": {
    requiredEnv: ["SERPAPI_API_KEY"],
    labels: {
      "SERPAPI_API_KEY": "SerpApi Google Engine Key"
    },
    placeholders: {
      "SERPAPI_API_KEY": "serp_xxxxxxxx"
    }
  },
  "datadog": {
    requiredEnv: ["DATADOG_API_KEY", "DATADOG_APP_KEY"],
    labels: {
      "DATADOG_API_KEY": "Datadog API Key",
      "DATADOG_APP_KEY": "Datadog Client Application Key"
    },
    placeholders: {
      "DATADOG_API_KEY": "dd_api_xxxxxxxx",
      "DATADOG_APP_KEY": "dd_app_xxxxxxxx"
    }
  },
  "activecampaign": {
    requiredEnv: ["ACTIVECAMPAIGN_API_URL", "ACTIVECAMPAIGN_API_KEY"],
    labels: {
      "ACTIVECAMPAIGN_API_URL": "ActiveCampaign Dashboard API URL",
      "ACTIVECAMPAIGN_API_KEY": "ActiveCampaign Developer API Key"
    },
    placeholders: {
      "ACTIVECAMPAIGN_API_URL": "https://company.api-us1.com",
      "ACTIVECAMPAIGN_API_KEY": "ac_api_xxxxxxxx"
    }
  },
  "zoom": {
    requiredEnv: ["ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET"],
    labels: {
      "ZOOM_ACCOUNT_ID": "Zoom Server Account ID",
      "ZOOM_CLIENT_ID": "Zoom App Client ID",
      "ZOOM_CLIENT_SECRET": "Zoom App Client Secret"
    },
    placeholders: {
      "ZOOM_ACCOUNT_ID": "your_zoom_account_id",
      "ZOOM_CLIENT_ID": "your_zoom_client_id",
      "ZOOM_CLIENT_SECRET": "your_zoom_client_secret"
    }
  },
  "webflow": {
    requiredEnv: ["WEBFLOW_API_TOKEN"],
    labels: {
      "WEBFLOW_API_TOKEN": "Webflow CMS Access Token"
    },
    placeholders: {
      "WEBFLOW_API_TOKEN": "wf_xxxxxxxx"
    }
  },
  "cal": {
    requiredEnv: ["CAL_API_KEY"],
    labels: {
      "CAL_API_KEY": "Cal.com Scheduler API Key"
    },
    placeholders: {
      "CAL_API_KEY": "cal_xxxxxxxx"
    }
  },
  "openai": {
    requiredEnv: ["OPENAI_API_KEY"],
    labels: {
      "OPENAI_API_KEY": "OpenAI platform API Key"
    },
    placeholders: {
      "OPENAI_API_KEY": "sk-proj-xxxxxxxx"
    }
  },
  "netsuite": {
    requiredEnv: ["NETSUITE_ACCOUNT", "NETSUITE_CONSUMER_KEY", "NETSUITE_CONSUMER_SECRET", "NETSUITE_TOKEN_ID", "NETSUITE_TOKEN_SECRET"],
    labels: {
      "NETSUITE_ACCOUNT": "NetSuite Account ID (e.g. 1234567_SB1)",
      "NETSUITE_CONSUMER_KEY": "OAuth 1.0 Consumer Key",
      "NETSUITE_CONSUMER_SECRET": "OAuth 1.0 Consumer Secret",
      "NETSUITE_TOKEN_ID": "Token ID",
      "NETSUITE_TOKEN_SECRET": "Token Secret"
    },
    placeholders: {
      "NETSUITE_ACCOUNT": "1234567_SB1",
      "NETSUITE_CONSUMER_KEY": "ns_consumer_key_xyz",
      "NETSUITE_CONSUMER_SECRET": "ns_consumer_secret_xyz",
      "NETSUITE_TOKEN_ID": "ns_token_id_xyz",
      "NETSUITE_TOKEN_SECRET": "ns_token_secret_xyz"
    }
  },
  "workday": {
    requiredEnv: ["WORKDAY_TENANT", "WORKDAY_USERNAME", "WORKDAY_PASSWORD", "WORKDAY_CLIENT_ID", "WORKDAY_CLIENT_SECRET"],
    labels: {
      "WORKDAY_TENANT": "Workday Tenant Name",
      "WORKDAY_USERNAME": "Workday Integration Username",
      "WORKDAY_PASSWORD": "Workday Integration Password",
      "WORKDAY_CLIENT_ID": "OAuth Client ID",
      "WORKDAY_CLIENT_SECRET": "OAuth Client Secret"
    },
    placeholders: {
      "WORKDAY_TENANT": "mycompany",
      "WORKDAY_USERNAME": "isvc_alti",
      "WORKDAY_PASSWORD": "password_xyz",
      "WORKDAY_CLIENT_ID": "client_id_xyz",
      "WORKDAY_CLIENT_SECRET": "client_secret_xyz"
    }
  },
  "snowflake": {
    requiredEnv: ["SNOWFLAKE_ACCOUNT", "SNOWFLAKE_USERNAME", "SNOWFLAKE_PASSWORD", "SNOWFLAKE_DATABASE", "SNOWFLAKE_SCHEMA"],
    labels: {
      "SNOWFLAKE_ACCOUNT": "Snowflake Account Locator",
      "SNOWFLAKE_USERNAME": "Snowflake Username",
      "SNOWFLAKE_PASSWORD": "Snowflake Password",
      "SNOWFLAKE_DATABASE": "Database Name",
      "SNOWFLAKE_SCHEMA": "Schema Name"
    },
    placeholders: {
      "SNOWFLAKE_ACCOUNT": "xy12345.us-east-1",
      "SNOWFLAKE_USERNAME": "ALTI_USER",
      "SNOWFLAKE_PASSWORD": "password_xyz",
      "SNOWFLAKE_DATABASE": "ANALYTICS_DB",
      "SNOWFLAKE_SCHEMA": "PUBLIC"
    }
  },
  "google-bigquery": {
    requiredEnv: ["BIGQUERY_CREDENTIALS"],
    labels: {
      "BIGQUERY_CREDENTIALS": "BigQuery Google Service Account JSON"
    },
    placeholders: {
      "BIGQUERY_CREDENTIALS": "{\"type\": \"service_account\", ..."
    }
  },
  "quickbooks": {
    requiredEnv: ["QUICKBOOKS_CLIENT_ID", "QUICKBOOKS_CLIENT_SECRET", "QUICKBOOKS_REALM_ID"],
    labels: {
      "QUICKBOOKS_CLIENT_ID": "QuickBooks OAuth Client ID",
      "QUICKBOOKS_CLIENT_SECRET": "QuickBooks OAuth Client Secret",
      "QUICKBOOKS_REALM_ID": "QuickBooks Company Realm ID"
    },
    placeholders: {
      "QUICKBOOKS_CLIENT_ID": "qb_client_id_xyz",
      "QUICKBOOKS_CLIENT_SECRET": "qb_client_secret_xyz",
      "QUICKBOOKS_REALM_ID": "1234567890"
    }
  },
  "xero": {
    requiredEnv: ["XERO_CLIENT_ID", "XERO_CLIENT_SECRET", "XERO_TENANT_ID"],
    labels: {
      "XERO_CLIENT_ID": "Xero OAuth Client ID",
      "XERO_CLIENT_SECRET": "Xero OAuth Client Secret",
      "XERO_TENANT_ID": "Xero Active Tenant ID"
    },
    placeholders: {
      "XERO_CLIENT_ID": "xero_client_id_xyz",
      "XERO_CLIENT_SECRET": "xero_client_secret_xyz",
      "XERO_TENANT_ID": "00000000-0000-0000-0000-000000000000"
    }
  },
  "servicenow": {
    requiredEnv: ["SERVICENOW_INSTANCE", "SERVICENOW_USERNAME", "SERVICENOW_PASSWORD"],
    labels: {
      "SERVICENOW_INSTANCE": "ServiceNow Instance Name (e.g. dev12345)",
      "SERVICENOW_USERNAME": "ServiceNow Username",
      "SERVICENOW_PASSWORD": "ServiceNow Password"
    },
    placeholders: {
      "SERVICENOW_INSTANCE": "dev12345",
      "SERVICENOW_USERNAME": "admin",
      "SERVICENOW_PASSWORD": "password_xyz"
    }
  },
  "okta": {
    requiredEnv: ["OKTA_DOMAIN", "OKTA_API_TOKEN"],
    labels: {
      "OKTA_DOMAIN": "Okta Domain (e.g. company.okta.com)",
      "OKTA_API_TOKEN": "Okta API Token"
    },
    placeholders: {
      "OKTA_DOMAIN": "company.okta.com",
      "OKTA_API_TOKEN": "okta_token_xyz"
    }
  },
  "adp": {
    requiredEnv: ["ADP_CLIENT_ID", "ADP_CLIENT_SECRET"],
    labels: {
      "ADP_CLIENT_ID": "ADP Gateway Client ID",
      "ADP_CLIENT_SECRET": "ADP Gateway Client Secret"
    },
    placeholders: {
      "ADP_CLIENT_ID": "adp_client_id_xyz",
      "ADP_CLIENT_SECRET": "adp_client_secret_xyz"
    }
  },
  "rippling": {
    requiredEnv: ["RIPPLING_ACCESS_TOKEN"],
    labels: {
      "RIPPLING_ACCESS_TOKEN": "Rippling API Access Token"
    },
    placeholders: {
      "RIPPLING_ACCESS_TOKEN": "rippling_token_xyz"
    }
  },
  "gusto": {
    requiredEnv: ["GUSTO_ACCESS_TOKEN"],
    labels: {
      "GUSTO_ACCESS_TOKEN": "Gusto API Access Token"
    },
    placeholders: {
      "GUSTO_ACCESS_TOKEN": "gusto_token_xyz"
    }
  },
  "bamboohr": {
    requiredEnv: ["BAMBOOHR_SUBDOMAIN", "BAMBOOHR_API_KEY"],
    labels: {
      "BAMBOOHR_SUBDOMAIN": "BambooHR Company Subdomain",
      "BAMBOOHR_API_KEY": "BambooHR API Token"
    },
    placeholders: {
      "BAMBOOHR_SUBDOMAIN": "company",
      "BAMBOOHR_API_KEY": "bamboohr_api_key_xyz"
    }
  },
  "dynamics365": {
    requiredEnv: ["DYNAMICS_ORG_URL", "DYNAMICS_CLIENT_ID", "DYNAMICS_CLIENT_SECRET", "DYNAMICS_TENANT_ID"],
    labels: {
      "DYNAMICS_ORG_URL": "Dynamics Instance URL",
      "DYNAMICS_CLIENT_ID": "OAuth Client ID",
      "DYNAMICS_CLIENT_SECRET": "OAuth Client Secret",
      "DYNAMICS_TENANT_ID": "Entra Directory Tenant ID"
    },
    placeholders: {
      "DYNAMICS_ORG_URL": "https://company.crm.dynamics.com",
      "DYNAMICS_CLIENT_ID": "00000000-0000-0000-0000-000000000000",
      "DYNAMICS_CLIENT_SECRET": "client_secret_xyz",
      "DYNAMICS_TENANT_ID": "00000000-0000-0000-0000-000000000000"
    }
  },
  "marketo": {
    requiredEnv: ["MARKETO_ENDPOINT", "MARKETO_CLIENT_ID", "MARKETO_CLIENT_SECRET"],
    labels: {
      "MARKETO_ENDPOINT": "Marketo REST API Endpoint Base URL",
      "MARKETO_CLIENT_ID": "Marketo API Client ID",
      "MARKETO_CLIENT_SECRET": "Marketo API Client Secret"
    },
    placeholders: {
      "MARKETO_ENDPOINT": "https://123-abc-456.mktorest.com",
      "MARKETO_CLIENT_ID": "marketo_client_id_xyz",
      "MARKETO_CLIENT_SECRET": "marketo_client_secret_xyz"
    }
  },
  "klaviyo": {
    requiredEnv: ["KLAVIYO_API_KEY"],
    labels: {
      "KLAVIYO_API_KEY": "Klaviyo Private API Key"
    },
    placeholders: {
      "KLAVIYO_API_KEY": "pk_xxxxxxxx"
    }
  },
  "azure-ad": {
    requiredEnv: ["AZURE_AD_CLIENT_ID", "AZURE_AD_CLIENT_SECRET", "AZURE_AD_TENANT_ID"],
    labels: {
      "AZURE_AD_CLIENT_ID": "Azure Application (Client) ID",
      "AZURE_AD_CLIENT_SECRET": "Azure Client Secret Credentials",
      "AZURE_AD_TENANT_ID": "Azure Directory (Tenant) ID"
    },
    placeholders: {
      "AZURE_AD_CLIENT_ID": "00000000-0000-0000-0000-000000000000",
      "AZURE_AD_CLIENT_SECRET": "client_secret_xyz",
      "AZURE_AD_TENANT_ID": "00000000-0000-0000-0000-000000000000"
    }
  },
  "box": {
    requiredEnv: ["BOX_DEVELOPER_TOKEN"],
    labels: {
      "BOX_DEVELOPER_TOKEN": "Box Developer Access Token"
    },
    placeholders: {
      "BOX_DEVELOPER_TOKEN": "box_token_xyz"
    }
  },
  "dropbox": {
    requiredEnv: ["DROPBOX_ACCESS_TOKEN"],
    labels: {
      "DROPBOX_ACCESS_TOKEN": "Dropbox App OAuth Access Token"
    },
    placeholders: {
      "DROPBOX_ACCESS_TOKEN": "dbx_token_xyz"
    }
  }
};

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
  gemini: { category: 'AI & Machine Learning', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'LLM API Core', hoverBorder: 'border-cyan-500/60' },
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
  langchain_hub: { category: 'AI Registry', color: 'border-cyan-500/40 text-cyan-600 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'LangChain Hub', hoverBorder: 'border-cyan-500/60' },

  // Phase 31: Corporate Tax Compliance & VAT Operations Core (Amber Glow)
  onesource: { category: 'Corporate Tax', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Tax ERP Core', hoverBorder: 'border-amber-500/60' },
  avalara: { category: 'Corporate Tax', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Sales Tax', hoverBorder: 'border-amber-500/60' },
  vertex: { category: 'Corporate Tax', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Tax Rules ERP', hoverBorder: 'border-amber-500/60' },
  taxjar: { category: 'Corporate Tax', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'Tax Reporting', hoverBorder: 'border-amber-500/60' },
  sovos: { category: 'Corporate Tax', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20', bgGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', badge: 'VAT Compliance', hoverBorder: 'border-amber-500/60' },

  // Phase 32: Subscription Billing & Revenue Operations Core (Emerald Glow)
  zuora: { category: 'Billing & RevOps', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Subscription ERP', hoverBorder: 'border-emerald-500/60' },
  chargebee: { category: 'Billing & RevOps', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'RevOps Billing', hoverBorder: 'border-emerald-500/60' },
  recurly: { category: 'Billing & RevOps', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Billing Portal', hoverBorder: 'border-emerald-500/60' },
  stripe_billing: { category: 'Billing & RevOps', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Stripe Billing', hoverBorder: 'border-emerald-500/60' },
  paddle: { category: 'Billing & RevOps', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Merchant Billing', hoverBorder: 'border-emerald-500/60' },

  // Phase 33: Contract Management & Legally Binding e-Signatures (Violet Glow)
  docusign: { category: 'e-Sign Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'DocuSign', hoverBorder: 'border-violet-500/60' },
  dropbox_sign: { category: 'e-Sign Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Dropbox Sign', hoverBorder: 'border-violet-500/60' },
  pandadoc: { category: 'e-Sign Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'PandaDoc', hoverBorder: 'border-violet-500/60' },
  esignatures_io: { category: 'e-Sign Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'eSignatures.io', hoverBorder: 'border-violet-500/60' },
  signaturely: { category: 'e-Sign Core', color: 'border-violet-500/40 text-violet-650 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/20', bgGlow: 'shadow-[0_0_15px_rgba(139,92,246,0.15)]', badge: 'Signaturely', hoverBorder: 'border-violet-500/60' },

  // Phase 34: Digital Payments & Global Ledger Processing (Emerald Glow)
  stripe: { category: 'Digital Payments', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Stripe Core', hoverBorder: 'border-emerald-500/60' },
  braintree: { category: 'Digital Payments', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Braintree', hoverBorder: 'border-emerald-500/60' },
  square: { category: 'Digital Payments', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Square Pay', hoverBorder: 'border-emerald-500/60' },
  quickbooks: { category: 'Digital Payments', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'QuickBooks', hoverBorder: 'border-emerald-500/60' },
  xero: { category: 'Digital Payments', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Xero Ledger', hoverBorder: 'border-emerald-500/60' },

  // Phase 35: Identity & CRM Support (Cyan Glow)
  auth0: { category: 'Identity & CRM Support', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'CIAM SSO', hoverBorder: 'border-cyan-500/60' },
  jumpcloud: { category: 'Identity & CRM Support', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Cloud Identity', hoverBorder: 'border-cyan-500/60' },
  active_campaign: { category: 'Identity & CRM Support', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Growth CRM', hoverBorder: 'border-cyan-500/60' },
  intercom: { category: 'Identity & CRM Support', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Live Support', hoverBorder: 'border-cyan-500/60' },
  discord: { category: 'Identity & CRM Support', color: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20', bgGlow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', badge: 'Chat Spoke', hoverBorder: 'border-cyan-500/60' },

  // Phase 36: Modern Workspace (Rose Glow)
  figma: { category: 'Modern Workspace', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'UI Design', hoverBorder: 'border-rose-500/60' },
  airtable: { category: 'Modern Workspace', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Data Spoke', hoverBorder: 'border-rose-500/60' },
  miro: { category: 'Modern Workspace', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Whiteboard', hoverBorder: 'border-rose-500/60' },
  wrike: { category: 'Modern Workspace', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Agile PM', hoverBorder: 'border-rose-500/60' },
  loomio: { category: 'Modern Workspace', color: 'border-rose-500/40 text-rose-600 dark:text-rose-450 bg-rose-50/50 dark:bg-rose-950/20', bgGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', badge: 'Decisions', hoverBorder: 'border-rose-500/60' },

  // Phase 37: APM Telemetry & Service Mesh Spoke (Fuchsia Glow)
  grafana: { category: 'APM Telemetry & Service Mesh', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Metrics Desk', hoverBorder: 'border-fuchsia-500/60' },
  new_relic: { category: 'APM Telemetry & Service Mesh', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'APM Cloud', hoverBorder: 'border-fuchsia-500/60' },
  elasticsearch: { category: 'APM Telemetry & Service Mesh', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Log Search', hoverBorder: 'border-fuchsia-500/60' },
  sentry: { category: 'APM Telemetry & Service Mesh', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'Error Tracer', hoverBorder: 'border-fuchsia-500/60' },
  loggly: { category: 'APM Telemetry & Service Mesh', color: 'border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/50 dark:bg-fuchsia-950/20', bgGlow: 'shadow-[0_0_15px_rgba(217,70,239,0.15)]', badge: 'SIEM Log', hoverBorder: 'border-fuchsia-500/60' },

  // Phase 38: Content Delivery CDN & Secure WAF Edge (Red Glow)
  akamai: { category: 'Content Delivery & Secure Edge WAF', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'CDN Cache', hoverBorder: 'border-red-500/60' },
  fastly: { category: 'Content Delivery & Secure Edge WAF', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'Edge Spoke', hoverBorder: 'border-red-500/60' },
  imperva: { category: 'Content Delivery & Secure Edge WAF', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'WAF Gateway', hoverBorder: 'border-red-500/60' },
  f5_big_ip: { category: 'Content Delivery & Secure Edge WAF', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'Load Balancer', hoverBorder: 'border-red-500/60' },
  incapsula: { category: 'Content Delivery & Secure Edge WAF', color: 'border-red-500/40 text-red-650 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20', bgGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]', badge: 'DDoS Shield', hoverBorder: 'border-red-500/60' },

  // Phase 39: Enterprise Customer Data Platforms & Analytics (Indigo Glow)
  amplitude: { category: 'Customer Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Product Analytics', hoverBorder: 'border-indigo-500/60' },
  mixpanel: { category: 'Customer Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Funnel Analytics', hoverBorder: 'border-indigo-500/60' },
  heap: { category: 'Customer Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Auto Capture', hoverBorder: 'border-indigo-500/60' },
  fivetran: { category: 'Customer Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'Data Ingestion', hoverBorder: 'border-indigo-500/60' },
  airbyte: { category: 'Customer Data & Analytics', color: 'border-indigo-500/40 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20', bgGlow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', badge: 'ELT Pipeline', hoverBorder: 'border-indigo-500/60' },

  // Phase 40: Enterprise HRIS & Modern Payroll Spoke (Emerald Glow)
  rippling: { category: 'HRIS & Enterprise Payroll', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Workforce Platform', hoverBorder: 'border-emerald-500/60' },
  gusto: { category: 'HRIS & Enterprise Payroll', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Payroll Core', hoverBorder: 'border-emerald-500/60' },
  zenefits: { category: 'HRIS & Enterprise Payroll', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Benefits Portal', hoverBorder: 'border-emerald-500/60' },
  workable: { category: 'HRIS & Enterprise Payroll', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'ATS Recruiter', hoverBorder: 'border-emerald-500/60' },
  jazzhr: { category: 'HRIS & Enterprise Payroll', color: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20', bgGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', badge: 'Talent Sourcing', hoverBorder: 'border-emerald-500/60' }
};

const AppCard = ({
  app,
  isAlreadyConnected,
}: {
  app: APP;
  isAlreadyConnected: boolean;
}) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'oauth' | 'credentials' | 'apikey'>('oauth');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [envInputs, setEnvInputs] = useState<Record<string, string>>({});
  const [dbUrlInput, setDbUrlInput] = useState('');
  const [advancedJsonInput, setAdvancedJsonInput] = useState('');
  
  // Direct Credentials states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [hostInput, setHostInput] = useState('');
  const [portInput, setPortInput] = useState('');
  const [dbNameInput, setDbNameInput] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');

  const slug = app.app_name?.toLowerCase() || '';
  const strategicStyle = STRATEGIC_APPS_STYLE[slug];
  const blueprint = MCP_BLUEPRINTS[slug];

  const supportsOAuth = slug === 'slack' || 
    slug === 'notion' || 
    slug === 'github' || 
    slug === 'gitlab' || 
    slug === 'google-drive' || 
    slug === 'gcal' || 
    slug === 'google-calendar' || 
    slug === 'hubspot' || 
    slug === 'linear' || 
    slug === 'salesforce' || 
    slug === 'asana' || 
    slug === 'clickup' || 
    slug === 'trello' || 
    slug === 'zendesk' ||
    slug === 'google-sheets' ||
    slug === 'google-docs' ||
    slug === 'microsoft-teams' ||
    slug === 'outlook' ||
    slug === 'zoom' ||
    slug === 'quickbooks' ||
    slug === 'xero' ||
    slug === 'bamboohr' ||
    slug === 'rippling' ||
    slug === 'gusto' ||
    slug === 'box' ||
    slug === 'dropbox';

  const isDatabaseApp = blueprint?.needsDatabaseUrl || 
    slug.includes('postgres') || 
    slug.includes('postgresql') || 
    slug.includes('mysql') || 
    slug.includes('db') || 
    slug.includes('database');

  const handleOpenModal = () => {
    const initialEnv: Record<string, string> = {};
    if (blueprint) {
      blueprint.requiredEnv.forEach(key => {
        initialEnv[key] = '';
      });
    }
    setEnvInputs(initialEnv);
    setDbUrlInput('');
    setAdvancedJsonInput('');
    setEmailInput('');
    setPasswordInput('');
    setHostInput('');
    setPortInput('');
    setDbNameInput('');
    setErrorMessage('');
    setActiveTab(supportsOAuth ? 'oauth' : 'credentials');
    setIsModalOpen(true);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setErrorMessage('');

    try {
      let finalEnv: Record<string, string> = { ...envInputs };

      if (advancedJsonInput.trim()) {
        try {
          const parsed = JSON.parse(advancedJsonInput.trim());
          if (typeof parsed === 'object' && parsed !== null) {
            finalEnv = { ...finalEnv, ...parsed };
          } else {
            throw new Error('JSON must be a flat key-value object.');
          }
        } catch (err: any) {
          setErrorMessage(`Invalid JSON format: ${err.message}`);
          setIsConnecting(false);
          return;
        }
      }

      const res = await installApp(session?.accessToken, app.app_name, finalEnv, dbUrlInput || undefined);
      if (res.success) {
        toast.success(`Successfully connected ${app.title}!`);
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      } else {
        setErrorMessage(res.debugMessage || res.message || 'Failed to install application.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCredentialsConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setErrorMessage('');

    try {
      const finalEnv: Record<string, string> = {};
      let databaseUrl: string | undefined = undefined;

      if (isDatabaseApp) {
        const host = hostInput.trim() || 'localhost';
        const port = portInput.trim() || (slug.includes('postgres') ? '5432' : slug.includes('mongodb') ? '27017' : '3306');
        const dbName = dbNameInput.trim() || 'default';
        const username = emailInput.trim();
        const password = passwordInput;
        
        if (slug.includes('mongodb')) {
          databaseUrl = `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;
        } else {
          databaseUrl = `postgresql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;
        }
      } else {
        finalEnv['USERNAME'] = emailInput.trim();
        finalEnv['PASSWORD'] = passwordInput;
        finalEnv['EMAIL'] = emailInput.trim();
      }

      if (advancedJsonInput.trim()) {
        try {
          const parsed = JSON.parse(advancedJsonInput.trim());
          if (typeof parsed === 'object' && parsed !== null) {
            Object.assign(finalEnv, parsed);
          }
        } catch (err: any) {
          setErrorMessage(`Invalid JSON in advanced variables: ${err.message}`);
          setIsConnecting(false);
          return;
        }
      }

      const res = await installApp(session?.accessToken, app.app_name, finalEnv, databaseUrl);
      if (res.success) {
        toast.success(`Successfully connected ${app.title}!`);
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      } else {
        setErrorMessage(res.debugMessage || res.message || 'Failed to authenticate with credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleOAuthConnect = async () => {
    setIsConnecting(true);
    setErrorMessage('');
    
    const width = 600;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL}/mcp-toolbox/oauth/connect/${app.app_name}?token=${session?.accessToken}`;
    
    const popup = window.open(
      oauthUrl,
      `Connect ${app.title}`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );
    
    if (!popup) {
      setErrorMessage('Popup blocker enabled. Please allow popups to authenticate.');
      setIsConnecting(false);
      return;
    }
    
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin && event.origin !== process.env.NEXT_PUBLIC_API_URL) return;
      
      if (event.data === 'oauth-success') {
        toast.success(`Successfully connected ${app.title} via OAuth!`);
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['connections'] });
        window.removeEventListener('message', handleMessage);
        setIsConnecting(false);
      } else if (event.data && event.data.startsWith('oauth-error:')) {
        const error = event.data.replace('oauth-error:', '');
        setErrorMessage(`OAuth failed: ${error}`);
        window.removeEventListener('message', handleMessage);
        setIsConnecting(false);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setIsConnecting(false);
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const res = await stopApp(session?.accessToken, app.app_name);
      if (res.success) {
        toast.success(`Disconnected ${app.title}.`);
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      } else {
        toast.error(res.debugMessage || res.message || 'Failed to disconnect application.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    } finally {
      setIsDisconnecting(false);
    }
  };

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
                <AppImage
                  src={app.image}
                  alt={app.title}
                  className="size-9 object-contain"
                  fallbackSizeClass="text-lg"
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
                {app.description || `Integrate ${app.title} tools seamlessly to expand Alti Assistant's automation triggers and actions.`}
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-5 space-y-2">
            <Button
              className={cn(
                "w-full transition-all duration-300 font-medium shadow-sm border-none",
                isAlreadyConnected
                  ? "bg-red-500 hover:bg-red-650 text-white dark:bg-red-600 dark:hover:bg-red-750"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:text-white"
              )}
              variant="default"
              disabled={isConnecting || isDisconnecting}
              onClick={isAlreadyConnected ? handleDisconnect : handleOpenModal}
            >
              {isConnecting || isDisconnecting ? (
                <LoaderCircle className="size-4 animate-spin mx-auto text-white" />
              ) : isAlreadyConnected ? (
                'Disconnect Integration'
              ) : (
                'Establish Integration'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <DialogHeader className="p-0">
              <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Zap className="size-5 text-indigo-500" />
                Configure {app.title}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 pt-4 space-y-4">
            {errorMessage && (
              <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200/30">
                {errorMessage}
              </p>
            )}

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-xl bg-slate-100 dark:bg-slate-950 p-1 mb-4">
                <TabsTrigger
                  value="oauth"
                  disabled={!supportsOAuth}
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
                >
                  OAuth SSO
                </TabsTrigger>
                <TabsTrigger
                  value="credentials"
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
                >
                  Account Login
                </TabsTrigger>
                <TabsTrigger
                  value="apikey"
                  className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm"
                >
                  API Token
                </TabsTrigger>
              </TabsList>

              <TabsContent value="oauth" className="space-y-4 pt-1">
                <div className="text-center py-6 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
                  <div className="mx-auto size-12 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                    <ShieldCheck className="size-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Simple & Secure Single Sign-On</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                      Log in directly with your {app.title} credentials. Your password is never shared with us.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleOAuthConnect}
                    disabled={isConnecting}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 px-6 py-5 font-semibold text-xs flex items-center justify-center gap-2 mx-auto"
                  >
                    {isConnecting ? (
                      <LoaderCircle className="size-4 animate-spin text-white" />
                    ) : (
                      <Zap className="size-3.5 fill-current" />
                    )}
                    Log in with {app.title}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="credentials" className="space-y-4 pt-1">
                <form onSubmit={handleCredentialsConnect} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Email or Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-450" />
                      <Input
                        type="text"
                        placeholder="username@email.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-1 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-450" />
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                        className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-1 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {isDatabaseApp && (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Host / Endpoint
                        </Label>
                        <Input
                          type="text"
                          placeholder="localhost"
                          value={hostInput}
                          onChange={(e) => setHostInput(e.target.value)}
                          className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Port
                        </Label>
                        <Input
                          type="text"
                          placeholder={slug.includes('postgres') ? '5432' : '27017'}
                          value={portInput}
                          onChange={(e) => setPortInput(e.target.value)}
                          className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {isDatabaseApp && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Database / Schema Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="default"
                        value={dbNameInput}
                        onChange={(e) => setDbNameInput(e.target.value)}
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2.5">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-xl text-slate-500 dark:text-slate-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isConnecting}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 px-5 flex items-center justify-center gap-2"
                    >
                      {isConnecting && <LoaderCircle className="size-4 animate-spin text-white" />}
                      Authenticate & Save
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="apikey" className="space-y-4 pt-1">
                <form onSubmit={handleConnect} className="space-y-4">
                  {blueprint && blueprint.requiredEnv.length > 0 && (
                    <div className="space-y-4">
                      {blueprint.requiredEnv.map(key => (
                        <div key={key} className="space-y-1.5">
                          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {blueprint.labels[key] || key}
                          </Label>
                          <Input
                            type="password"
                            placeholder={blueprint.placeholders[key] || "Enter credentials..."}
                            value={envInputs[key] || ''}
                            onChange={e => setEnvInputs(prev => ({ ...prev, [key]: e.target.value }))}
                            required
                            className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-1 focus-visible:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {isDatabaseApp && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Database Connection URI
                      </Label>
                      <Input
                        type="text"
                        placeholder="postgresql://username:password@localhost:5432/dbname"
                        value={dbUrlInput}
                        onChange={e => setDbUrlInput(e.target.value)}
                        required
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus-visible:ring-1 focus-visible:ring-indigo-500"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                      <span>Advanced Custom Environment Variables (Optional JSON)</span>
                    </Label>
                    <Textarea
                      placeholder='{ "CUSTOM_API_KEY": "your_value" }'
                      value={advancedJsonInput}
                      onChange={e => setAdvancedJsonInput(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 min-h-[80px] font-mono text-xs focus-visible:ring-1 focus-visible:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-xl text-slate-500 dark:text-slate-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isConnecting}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 px-5 flex items-center justify-center gap-2"
                    >
                      {isConnecting && <LoaderCircle className="size-4 animate-spin text-white" />}
                      Connect Integration
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 justify-center text-[10px] font-semibold text-slate-450">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>AES-256 local configuration encryption & secure TLS transit active</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppCard;
