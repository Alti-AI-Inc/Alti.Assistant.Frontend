export type APP = {
  title: string;
  description: string;
  image: string;
  app_name: string;
  isAvailable: boolean;
  isMcp?: boolean;
};

export const allApps: APP[] = [
  {
    "title": "Notion",
    "description": "Read, query, write, and manage pages and databases inside Notion workspaces programmatically.",
    "image": "https://logos.composio.dev/api/notion",
    "app_name": "notion",
    "isAvailable": true
  },
  {
    "title": "Jira",
    "description": "Query, create, update, and manage Jira issues, sprints, and project tickets programmatically.",
    "image": "https://logos.composio.dev/api/jira",
    "app_name": "jira",
    "isAvailable": true
  },
  {
    "title": "Slack",
    "description": "Access, search, post messages, and manage channels inside Slack workspaces programmatically.",
    "image": "https://logos.composio.dev/api/slack",
    "app_name": "slack",
    "isAvailable": true
  },
  {
    "title": "Google Calendar",
    "description": "Access, schedule, and sync events inside Google Calendar accounts securely.",
    "image": "https://logos.composio.dev/api/googlecalendar",
    "app_name": "gcal",
    "isAvailable": true
  },
  {
    "title": "Google Drive",
    "description": "File access and search capabilities for Google Drive.",
    "image": "https://logos.composio.dev/api/googledrive",
    "app_name": "google-drive",
    "isAvailable": true
  },
  {
    "title": "Google Maps",
    "description": "Integrates Google Maps API to search places, compute transit routes, calculate travel times, and view geocoding data.",
    "image": "https://logos.composio.dev/api/google_maps",
    "app_name": "google-maps",
    "isAvailable": true
  },
  {
    "title": "GitHub",
    "description": "Repository management, file operations, and GitHub API integration.",
    "image": "https://logos.composio.dev/api/github",
    "app_name": "github",
    "isAvailable": true
  },
  {
    "title": "GitLab",
    "description": "GitLab API, enabling project management and Git repository actions.",
    "image": "https://logos.composio.dev/api/gitlab",
    "app_name": "gitlab",
    "isAvailable": true
  },
  {
    "title": "Figma",
    "description": "Access Figma files, nodes, images, and comments programmatically.",
    "image": "https://logos.composio.dev/api/figma",
    "app_name": "figma",
    "isAvailable": true
  },
  {
    "title": "Linear",
    "description": "Query, create, and update issues, projects, and cycles inside Linear workspace trackers.",
    "image": "https://logos.composio.dev/api/linear",
    "app_name": "linear",
    "isAvailable": true
  },
  {
    "title": "Asana",
    "description": "Query, create, update, and manage tasks, projects, and portfolios inside Asana trackers.",
    "image": "https://logos.composio.dev/api/asana",
    "app_name": "asana",
    "isAvailable": true
  },
  {
    "title": "ClickUp",
    "description": "Read, query, write, and manage spaces, folders, lists, and tasks in ClickUp workspaces.",
    "image": "https://logos.composio.dev/api/clickup",
    "app_name": "clickup",
    "isAvailable": true
  },
  {
    "title": "Airtable",
    "description": "Read, query, write, and manage bases, tables, and records in Airtable workspaces.",
    "image": "https://logos.composio.dev/api/airtable",
    "app_name": "airtable",
    "isAvailable": true
  },
  {
    "title": "HubSpot",
    "description": "Access, search, and manage contacts, companies, deals, and engagement history inside HubSpot accounts.",
    "image": "https://logos.composio.dev/api/hubspot",
    "app_name": "hubspot",
    "isAvailable": true
  },
  {
    "title": "Salesforce",
    "description": "Access, search, and manage leads, accounts, contacts, and opportunities inside Salesforce orgs.",
    "image": "https://logos.composio.dev/api/salesforce",
    "app_name": "salesforce",
    "isAvailable": true
  },
  {
    "title": "Zendesk",
    "description": "Access, query, create, and manage support tickets, customers, and replies inside Zendesk tickets.",
    "image": "https://logos.composio.dev/api/zendesk",
    "app_name": "zendesk",
    "isAvailable": true
  },
  {
    "title": "Intercom",
    "description": "Access, search, and manage customer conversations, users, and leads in Intercom accounts.",
    "image": "https://logos.composio.dev/api/intercom",
    "app_name": "intercom",
    "isAvailable": true
  },
  {
    "title": "Mailchimp",
    "description": "Access, search, and manage email campaigns, marketing lists, and subscribers in Mailchimp.",
    "image": "https://logos.composio.dev/api/mailchimp",
    "app_name": "mailchimp",
    "isAvailable": true
  },
  {
    "title": "Shopify",
    "description": "Access, search, and manage products, orders, collections, and customer details programmatically inside Shopify stores.",
    "image": "https://logos.composio.dev/api/shopify",
    "app_name": "shopify",
    "isAvailable": true
  },
  {
    "title": "Discord",
    "description": "Send channel messages, read histories, and manage guild channels programmatically inside Discord guilds.",
    "image": "https://logos.composio.dev/api/discord",
    "app_name": "discord",
    "isAvailable": true
  },
  {
    "title": "Twilio",
    "description": "Send SMS messages, make phone calls, and check messaging statuses via Twilio API.",
    "image": "https://logos.composio.dev/api/twilio",
    "app_name": "twilio",
    "isAvailable": true
  },
  {
    "title": "Resend",
    "description": "Send high-deliverability transactional emails, manage domains, and track email stats via Resend API.",
    "image": "https://logos.composio.dev/api/resend",
    "app_name": "resend",
    "isAvailable": true
  },
  {
    "title": "Pipedrive",
    "description": "Access, search, and manage deals, organizations, persons, and activities in Pipedrive accounts.",
    "image": "https://logos.composio.dev/api/pipedrive",
    "app_name": "pipedrive",
    "isAvailable": true
  },
  {
    "title": "MongoDB",
    "description": "Query, map, insert, and update documents inside MongoDB collections natively.",
    "image": "https://logos.composio.dev/api/mongodb",
    "app_name": "mongodb",
    "isAvailable": true
  },
  {
    "title": "PostgreSQL",
    "description": "Read-only database access with schema inspection and SQL scripting capabilities.",
    "image": "https://logos.composio.dev/api/postgres",
    "app_name": "postgres",
    "isAvailable": true
  },
  {
    "title": "SQLite",
    "description": "Database interaction and business intelligence capabilities for local databases.",
    "image": "https://logos.composio.dev/api/sqlite",
    "app_name": "sqlite",
    "isAvailable": true
  },
  {
    "title": "Redis",
    "description": "Interact with Redis key-value stores, sets, and pub/sub channels programmatically.",
    "image": "https://logos.composio.dev/api/redis",
    "app_name": "redis",
    "isAvailable": true
  },
  {
    "title": "Pinecone",
    "description": "Upsert, query, and search high-dimensional vector embeddings inside Pinecone indexes.",
    "image": "https://logos.composio.dev/api/pinecone",
    "app_name": "pinecone",
    "isAvailable": true
  },
  {
    "title": "Supabase",
    "description": "Read, query, write, and manage database tables and storage buckets inside Supabase projects.",
    "image": "https://logos.composio.dev/api/supabase",
    "app_name": "supabase",
    "isAvailable": true
  },
  {
    "title": "Kubernetes",
    "description": "Query, inspect, and deploy services, pods, and logs inside Kubernetes clusters.",
    "image": "https://logos.composio.dev/api/kubernetes",
    "app_name": "kubernetes",
    "isAvailable": true
  },
  {
    "title": "Trello",
    "description": "Access, search, and manage boards, lists, and cards programmatically in Trello.",
    "image": "https://logos.composio.dev/api/trello",
    "app_name": "trello",
    "isAvailable": true
  },
  {
    "title": "Gmail",
    "description": "Access, search, read, send, and draft emails inside Gmail inboxes programmatically.",
    "image": "https://logos.composio.dev/api/gmail",
    "app_name": "gmail",
    "isAvailable": true
  },
  {
    "title": "Google Sheets",
    "description": "Read, query, write, and manage sheets and spreadsheets inside Google Drive programmatically.",
    "image": "https://logos.composio.dev/api/googlesheets",
    "app_name": "google-sheets",
    "isAvailable": true
  },
  {
    "title": "Google Docs",
    "description": "Access, read, write, and format documents inside Google Docs programmatically.",
    "image": "https://logos.composio.dev/api/googledocs",
    "app_name": "google-docs",
    "isAvailable": true
  },
  {
    "title": "MySQL",
    "description": "Read, query, write, and inspect schemas inside MySQL database engines.",
    "image": "https://logos.composio.dev/api/mysql",
    "app_name": "mysql",
    "isAvailable": true
  },
  {
    "title": "AWS S3",
    "description": "Securely list, read, upload, and manage files inside AWS S3 buckets programmatically.",
    "image": "https://logos.composio.dev/api/aws",
    "app_name": "aws-s3",
    "isAvailable": true
  },
  {
    "title": "Microsoft Teams",
    "description": "Send channel messages, query chats, and post hooks inside Microsoft Teams workspaces programmatically.",
    "image": "https://logos.composio.dev/api/microsoft_teams",
    "app_name": "microsoft-teams",
    "isAvailable": true
  },
  {
    "title": "Outlook",
    "description": "Access, search, read, send, and draft emails inside Outlook email accounts securely.",
    "image": "https://logos.composio.dev/api/outlook",
    "app_name": "outlook",
    "isAvailable": true
  },
  {
    "title": "SendGrid",
    "description": "Send transactional emails, manage contacts, and track delivery stats via SendGrid API.",
    "image": "https://logos.composio.dev/api/sendgrid",
    "app_name": "sendgrid",
    "isAvailable": true
  },
  {
    "title": "Firecrawl",
    "description": "Crawl entire websites, convert pages to clean markdown, and extract structured data via Firecrawl.",
    "image": "https://logos.composio.dev/api/firecrawl",
    "app_name": "firecrawl",
    "isAvailable": true
  },
  {
    "title": "Tavily",
    "description": "Conduct deep web search, extract real-time facts, and crawl web content optimized for LLM agents.",
    "image": "https://logos.composio.dev/api/tavily",
    "app_name": "tavily",
    "isAvailable": true
  },
  {
    "title": "Perplexity AI",
    "description": "Query Perplexity's citation-backed web search engine to gather real-time factual knowledge.",
    "image": "https://logos.composio.dev/api/perplexityai",
    "app_name": "perplexity",
    "isAvailable": true
  },
  {
    "title": "Exa",
    "description": "Perform semantic, neural web searches, resolve page contents, and retrieve similar URLs.",
    "image": "https://logos.composio.dev/api/exa",
    "app_name": "exa",
    "isAvailable": true
  },
  {
    "title": "SerpApi",
    "description": "Scrape structured search engine results (SERP) from Google, Bing, Yahoo, and Baidu.",
    "image": "https://logos.composio.dev/api/serpapi",
    "app_name": "serpapi",
    "isAvailable": true
  },
  {
    "title": "Datadog",
    "description": "Retrieve metrics, logs, traces, and monitor alerts inside Datadog APM consoles.",
    "image": "https://logos.composio.dev/api/datadog",
    "app_name": "datadog",
    "isAvailable": true
  },
  {
    "title": "ActiveCampaign",
    "description": "Access, search, and manage email campaigns, marketing lists, deals, and contacts in ActiveCampaign.",
    "image": "https://logos.composio.dev/api/active_campaign",
    "app_name": "activecampaign",
    "isAvailable": true
  },
  {
    "title": "Zoom",
    "description": "Schedule, update, manage, and sync meetings and webinars programmatically inside Zoom.",
    "image": "https://logos.composio.dev/api/zoom",
    "app_name": "zoom",
    "isAvailable": true
  },
  {
    "title": "Webflow",
    "description": "Read, query, write, and publish CMS collections, pages, and store items inside Webflow domains.",
    "image": "https://logos.composio.dev/api/webflow",
    "app_name": "webflow",
    "isAvailable": true
  },
  {
    "title": "Cal.com",
    "description": "Manage, check bookings, and schedule appointments programmatically inside Cal.com.",
    "image": "https://logos.composio.dev/api/cal",
    "app_name": "cal",
    "isAvailable": true
  },
  {
    "title": "OpenAI",
    "description": "Interact with OpenAI assistants, manage file stores, fine-tune models, and track token usage.",
    "image": "https://logos.composio.dev/api/openai",
    "app_name": "openai",
    "isAvailable": true
  },
  {
    "title": "Oracle NetSuite",
    "description": "Access, query, and synchronize financial ledgers, customer directories, invoices, and corporate entities in NetSuite ERP.",
    "image": "https://logos.composio.dev/api/netsuite",
    "app_name": "netsuite",
    "isAvailable": true
  },
  {
    "title": "Workday",
    "description": "Read, query, and manage employee directories, organizational charts, recruiting data, and benefit reports inside Workday.",
    "image": "https://logos.composio.dev/api/workday",
    "app_name": "workday",
    "isAvailable": true
  },
  {
    "title": "Snowflake",
    "description": "Execute high-performance analytical queries, map tables, and inspect schemas inside Snowflake warehouses.",
    "image": "https://logos.composio.dev/api/snowflake",
    "app_name": "snowflake",
    "isAvailable": true
  },
  {
    "title": "Google BigQuery",
    "description": "Query Google BigQuery databases, list datasets, map table columns, and extract structural facts.",
    "image": "https://logos.composio.dev/api/bigquery",
    "app_name": "google-bigquery",
    "isAvailable": true
  },
  {
    "title": "QuickBooks Online",
    "description": "Query, synchronize, and report bookkeeping accounts, invoices, payments, and vendor ledger databases inside QuickBooks.",
    "image": "https://logos.composio.dev/api/quickbooks",
    "app_name": "quickbooks",
    "isAvailable": true
  },
  {
    "title": "Xero",
    "description": "Read, query, write, and manage corporate banking ledger accounts, invoices, and bank statements inside Xero.",
    "image": "https://logos.composio.dev/api/xero",
    "app_name": "xero",
    "isAvailable": true
  },
  {
    "title": "ServiceNow",
    "description": "Create, query, update, and route corporate service tickets, incident requests, and hardware assets inside ServiceNow.",
    "image": "https://logos.composio.dev/api/servicenow",
    "app_name": "servicenow",
    "isAvailable": true
  },
  {
    "title": "Okta",
    "description": "Inspect user directory logins, manage application groups, revoke access policies, and audit authentication logs in Okta.",
    "image": "https://logos.composio.dev/api/okta",
    "app_name": "okta",
    "isAvailable": true
  },
  {
    "title": "ADP",
    "description": "Access, query, and synchronize corporate payroll profiles, benefit schedules, and tax reports inside ADP directories.",
    "image": "https://logos.composio.dev/api/adp",
    "app_name": "adp",
    "isAvailable": true
  },
  {
    "title": "Rippling",
    "description": "Read, synchronize, and update corporate payroll profiles, hardware inventory, and employee benefits inside Rippling.",
    "image": "https://logos.composio.dev/api/rippling",
    "app_name": "rippling",
    "isAvailable": true
  },
  {
    "title": "Gusto",
    "description": "Access payroll profiles, calculate tax withholding, and schedule employee payroll payouts inside Gusto.",
    "image": "https://logos.composio.dev/api/gusto",
    "app_name": "gusto",
    "isAvailable": true
  },
  {
    "title": "BambooHR",
    "description": "Read employee directories, approve time-off bookings, and sync organizational files inside BambooHR.",
    "image": "https://logos.composio.dev/api/bamboohr",
    "app_name": "bamboohr",
    "isAvailable": true
  },
  {
    "title": "Microsoft Dynamics 365",
    "description": "Access, search, and manage leads, accounts, contacts, and custom CRM objects inside Microsoft Dynamics 365.",
    "image": "https://logos.composio.dev/api/dynamics365",
    "app_name": "dynamics365",
    "isAvailable": true
  },
  {
    "title": "Marketo",
    "description": "Query, synchronize, and update marketing campaigns, leads databases, and newsletter subscribers inside Marketo.",
    "image": "https://logos.composio.dev/api/marketo",
    "app_name": "marketo",
    "isAvailable": true
  },
  {
    "title": "Klaviyo",
    "description": "Create and track email segments, query newsletter subscribers, and trigger marketing flows inside Klaviyo.",
    "image": "https://logos.composio.dev/api/klaviyo",
    "app_name": "klaviyo",
    "isAvailable": true
  },
  {
    "title": "Azure AD (Entra ID)",
    "description": "Access, query, and manage Microsoft Entra ID (Azure Active Directory) users, groups, and security roles.",
    "image": "https://logos.composio.dev/api/azure",
    "app_name": "azure-ad",
    "isAvailable": true
  },
  {
    "title": "Box",
    "description": "Securely list, read, upload, and format directories and documents programmatically inside Box storage.",
    "image": "https://logos.composio.dev/api/box",
    "app_name": "box",
    "isAvailable": true
  },
  {
    "title": "Dropbox",
    "description": "Access, search, download, and manage folders and documents programmatically inside Dropbox.",
    "image": "https://logos.composio.dev/api/dropbox",
    "app_name": "dropbox",
    "isAvailable": true
  }
];

export const toolsNeedsToAdd = [];
