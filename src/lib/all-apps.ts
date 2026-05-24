export type APP = {
  title: string;
  description: string;
  image: string;
  app_name: string;
  isAvailable: boolean;
};

export const allApps: APP[] = [
  {
    "title": "Gmail",
    "description": "Gmail is Google’s email service, featuring spam protection, search functions, and seamless integration with other G Suite apps for productivity.",
    "image": "/assets/apps-logos/gmail.svg",
    "app_name": "gmail",
    "isAvailable": true
  },
  {
    "title": "GitHub",
    "description": "GitHub is a code hosting platform for version control and collaboration, offering Git-based repository management, issue tracking, and continuous integration features.",
    "image": "/assets/apps-logos/github.png",
    "app_name": "github",
    "isAvailable": true
  },
  {
    "title": "Google Calendar",
    "description": "Google Calendar is a time management tool providing scheduling features, event reminders, and integration with email and other apps for streamlined organization.",
    "image": "/assets/apps-logos/google-calendar.svg",
    "app_name": "googlecalendar",
    "isAvailable": true
  },
  {
    "title": "Notion",
    "description": "Notion centralizes notes, docs, wikis, and tasks in a unified workspace, letting teams build custom workflows for collaboration and knowledge management.",
    "image": "/assets/apps-logos/notion.svg",
    "app_name": "notion",
    "isAvailable": true
  },
  {
    "title": "Google Sheets",
    "description": "Google Sheets is a cloud-based spreadsheet tool enabling real-time collaboration, data analysis, and integration with other Google Workspace apps.",
    "image": "/assets/apps-logos/google-sheets.svg",
    "app_name": "googlesheets",
    "isAvailable": true
  },
  {
    "title": "Slack",
    "description": "Slack is a channel-based messaging platform. With Slack, people can work together more effectively, connect all their software tools and services, and find the information they need to do their best work — all within a secure, enterprise-grade environment.",
    "image": "/assets/apps-logos/slack.svg",
    "app_name": "slack",
    "isAvailable": true
  },
  {
    "title": "Linear",
    "description": "Linear is a streamlined issue tracking and project planning tool for modern teams, featuring fast workflows, keyboard shortcuts, and GitHub integrations.",
    "image": "/assets/apps-logos/linear.png",
    "app_name": "linear",
    "isAvailable": true
  },
  {
    "title": "Trello",
    "description": "A web-based, kanban-style, list-making application.",
    "image": "/assets/apps-logos/trello.svg",
    "app_name": "trello",
    "isAvailable": true
  },
  {
    "title": "Supabase",
    "description": "Supabase is an open-source backend-as-a-service providing a Postgres database, authentication, storage, and real-time subscription APIs for building modern applications.",
    "image": "/assets/apps-logos/supabase.jpeg",
    "app_name": "supabase",
    "isAvailable": true
  },
  {
    "title": "Bitbucket",
    "description": "Bitbucket is a Git-based code hosting and collaboration platform supporting private and public repositories, enabling teams to manage and review code through pull requests and integrations.",
    "image": "/assets/apps-logos/bitbucket.svg",
    "app_name": "bitbucket",
    "isAvailable": true
  },
  {
    "title": "Sentry",
    "description": "Integrate Sentry to manage your error tracking and monitoring.",
    "image": "/assets/apps-logos/sentry.svg",
    "app_name": "sentry",
    "isAvailable": true
  },
  {
    "title": "Neon",
    "description": "Postgres, on a serverless platform designed to help you build reliable and scalable applications faster.",
    "image": "/assets/apps-logos/neon.png",
    "app_name": "neon",
    "isAvailable": true
  },
  {
    "title": "ZenRows",
    "description": "ZenRows is a web scraping API allowing developers to bypass CAPTCHAs and blocks, gather structured data from dynamic websites, and quickly integrate results into applications.",
    "image": "/assets/apps-logos/zenrows.jpeg",
    "app_name": "zenrows",
    "isAvailable": true
  },
  {
    "title": "Pagerduty",
    "description": "Integrate PagerDuty to manage incidents, schedules, and alerts directly from your application.",
    "image": "/assets/apps-logos/pagerduty.png",
    "app_name": "pagerduty",
    "isAvailable": true
  },
  {
    "title": "Contentful",
    "description": "Contentful is a headless CMS allowing developers to create, manage, and distribute content across multiple channels and devices with an API-first approach.",
    "image": "/assets/apps-logos/contentful-logo.png",
    "app_name": "contentful",
    "isAvailable": true
  },
  {
    "title": "Ably",
    "description": "Ably is a real-time messaging platform helping developers build live features, including chat and data synchronization, with global scalability and robust reliability for modern applications.",
    "image": "/assets/apps-logos/ably.svg",
    "app_name": "ably",
    "isAvailable": true
  },
  {
    "title": "Ngrok",
    "description": "Ngrok creates secure tunnels to locally hosted applications, enabling developers to share and test webhooks or services without configuring complex network settings.",
    "image": "/assets/apps-logos/ngrok-logo.jpeg",
    "app_name": "ngrok",
    "isAvailable": true
  },
  {
    "title": "Baserow",
    "description": "Baserow is an open-source database tool that lets teams build no-code data applications, collaborate on records, and integrate with other services for data management.",
    "image": "/assets/apps-logos/baserow-logo.jpeg",
    "app_name": "baserow",
    "isAvailable": true
  },
  {
    "title": "Datadog",
    "description": "Datadog offers monitoring, observability, and security for cloud-scale applications, unifying metrics, logs, and traces to help teams detect issues and optimize performance.",
    "image": "/assets/apps-logos/datadog-logo.png",
    "app_name": "datadog",
    "isAvailable": true
  },
  {
    "title": "Outlook",
    "description": "Outlook is Microsoft’s email and calendaring platform integrating contacts, tasks, and scheduling, enabling users to manage communications and events in a unified workspace.",
    "image": "/assets/apps-logos/Outlook.svg",
    "app_name": "outlook",
    "isAvailable": true
  },
  {
    "title": "Slack Bot",
    "description": "Slack Bot automates responses and reminders within Slack, assisting with tasks like onboarding, FAQs, and notifications to streamline team productivity.",
    "image": "/assets/apps-logos/slack.svg",
    "app_name": "slackbot",
    "isAvailable": true
  },
  {
    "title": "Microsoft Teams",
    "description": "Microsoft Teams integrates chat, video meetings, and file storage within Microsoft 365, providing virtual collaboration and communication for distributed teams.",
    "image": "/assets/apps-logos/microsoft-teams-logo.jpeg",
    "app_name": "microsoft_teams",
    "isAvailable": true
  },
  {
    "title": "Discord Bot",
    "description": "Discord Bot refers to automated programs on Discord servers, performing tasks like moderation, music playback, and user engagement to enhance community interactions.",
    "image": "/assets/apps-logos/discord.svg",
    "app_name": "discordbot",
    "isAvailable": true
  },
  {
    "title": "Google Meet",
    "description": "Google Meet is a secure video conferencing platform that integrates with Google Workspace, facilitating remote meetings, screen sharing, and chat.",
    "image": "/assets/apps-logos/google-meet.webp",
    "app_name": "googlemeet",
    "isAvailable": true
  },
  {
    "title": "Zoom",
    "description": "Zoom is a video conferencing and online meeting platform featuring breakout rooms, screen sharing, and integrations with various enterprise tools.",
    "image": "/assets/apps-logos/zoom.svg",
    "app_name": "zoom",
    "isAvailable": true
  },
  {
    "title": "RetellAI",
    "description": "RetellAI captures calls and transcripts, enabling businesses to analyze conversations, extract insights, and enhance customer interactions in one centralized platform.",
    "image": "/assets/apps-logos/retellai.jpeg",
    "app_name": "retellai",
    "isAvailable": true
  },
  {
    "title": "SharePoint",
    "description": "SharePoint is a Microsoft platform for document management and intranets, enabling teams to collaborate, store, and organize content securely and effectively.",
    "image": "/assets/apps-logos/sharepoint-icon.svg",
    "app_name": "share_point",
    "isAvailable": true
  },
  {
    "title": "Webex",
    "description": "Webex is a Cisco-powered video conferencing and collaboration platform offering online meetings, webinars, screen sharing, and team messaging.",
    "image": "/assets/apps-logos/webex.png",
    "app_name": "webex",
    "isAvailable": true
  },
  {
    "title": "Daily Bot",
    "description": "Daily Bot simplifies team collaboration and tasks with chat-based standups, reminders, polls, and integrations, streamlining workflow automation in popular messaging platforms.",
    "image": "/assets/apps-logos/dailybot.jpg",
    "app_name": "dailybot",
    "isAvailable": true
  },
  {
    "title": "Chatwork",
    "description": "Chatwork is a team communication platform featuring group chats, file sharing, and task management, aiming to enhance collaboration and productivity for businesses.",
    "image": "/assets/apps-logos/chatwork-logo.jpg",
    "app_name": "chatwork",
    "isAvailable": true
  },
  {
    "title": "Dialpad",
    "description": "Dialpad is a cloud-based business phone system and contact center platform that enables voice, video, messages and meetings across your existing devices.",
    "image": "/assets/apps-logos/dialpad.png",
    "app_name": "dialpad",
    "isAvailable": true
  },
  {
    "title": "Stack Exchange",
    "description": "Stack Exchange is a network of Q&A communities where users ask questions, share knowledge, and collaborate on topics like coding, math, and more.",
    "image": "/assets/apps-logos/stackexchange.png",
    "app_name": "stack_exchange",
    "isAvailable": true
  },
  {
    "title": "EchtPost",
    "description": "EchtPost facilitates secure digital communication, encryption, and data privacy, providing a reliable channel for sending confidential documents and messages.",
    "image": "/assets/apps-logos/echtpost.svg",
    "app_name": "echtpost",
    "isAvailable": true
  },
  {
    "title": "Perplexity AI",
    "description": "Perplexity AI provides conversational AI models for generating human-like text responses.",
    "image": "/assets/apps-logos/perplexity.jpeg",
    "app_name": "perplexityai",
    "isAvailable": true
  },
  {
    "title": "Mem0",
    "description": "Mem0 assists with AI-driven note-taking, knowledge recall, and productivity tools, allowing users to organize, search, and generate content from stored information.",
    "image": "/assets/apps-logos/mem0.png",
    "app_name": "mem0",
    "isAvailable": true
  },
  {
    "title": "Semantic Scholar",
    "description": "Semantic Scholar is an AI-powered academic search engine that helps researchers discover and understand scientific literature.",
    "image": "/assets/apps-logos/semanticscholar.png",
    "app_name": "semanticscholar",
    "isAvailable": true
  },
  {
    "title": "Lmnt",
    "description": "LMNT focuses on voice and audio manipulation, possibly leveraging AI to generate or transform sound for various creative and technical use cases.",
    "image": "/assets/apps-logos/lmnt_logo.jpeg",
    "app_name": "lmnt",
    "isAvailable": true
  },
  {
    "title": "Typefully",
    "description": "Typefully is a platform for creating and managing AI-powered content.",
    "image": "/assets/apps-logos/typefully.png",
    "app_name": "typefully",
    "isAvailable": true
  },
  {
    "title": "Humanloop",
    "description": "Humanloop helps developers build and refine AI applications, offering user feedback loops, model training, and data annotation to iterate on language model performance.",
    "image": "/assets/apps-logos/humanloop.jpeg",
    "app_name": "humanloop",
    "isAvailable": true
  },
  {
    "title": "TextRazor",
    "description": "TextRazor is a natural language processing API that extracts meaning, entities, and relationships from text, powering advanced content analysis and sentiment detection.",
    "image": "/assets/apps-logos/textrazor.svg",
    "app_name": "textrazor",
    "isAvailable": true
  },
  {
    "title": "Google Drive",
    "description": "Google Drive is a cloud storage solution for uploading, sharing, and collaborating on files across devices, with robust search and offline access.",
    "image": "/assets/apps-logos/google-drive.svg",
    "app_name": "googledrive",
    "isAvailable": true
  },
  {
    "title": "One drive",
    "description": "OneDrive is Microsoft’s cloud storage solution enabling users to store, sync, and share files across devices, offering offline access, real-time collaboration, and enterprise-grade security.",
    "image": "/assets/apps-logos/one-drive.svg",
    "app_name": "one_drive",
    "isAvailable": true
  },
  {
    "title": "DocuSign",
    "description": "DocuSign provides eSignature and digital agreement solutions, enabling businesses to send, sign, track, and manage documents electronically.",
    "image": "/assets/apps-logos/docusign.svg",
    "app_name": "docusign",
    "isAvailable": true
  },
  {
    "title": "Dropbox",
    "description": "Dropbox is a cloud storage service offering file syncing, sharing, and collaboration across devices with version control and robust integrations.",
    "image": "/assets/apps-logos/dropbox.svg",
    "app_name": "dropbox",
    "isAvailable": true
  },
  {
    "title": "Google Photos",
    "description": "Google Photos is a cloud-based photo storage and organization service offering automatic backups, AI-assisted search, and shared albums for personal and collaborative media management.",
    "image": "/assets/apps-logos/Google_Photos.png",
    "app_name": "googlephotos",
    "isAvailable": true
  },
  {
    "title": "Google Super",
    "description": "Google Super App combines all Google services including Drive, Calendar, Gmail, Sheets, Analytics, Ads, and more, providing a unified platform for seamless integration and management of your digital life.",
    "image": "/assets/apps-logos/google.svg",
    "app_name": "googlesuper",
    "isAvailable": true
  },
  {
    "title": "Pandadoc",
    "description": "PandaDoc offers document creation, e-signatures, and workflow automation, helping sales teams and businesses streamline proposals, contracts, and agreement processes.",
    "image": "/assets/apps-logos/pandadoc.svg",
    "app_name": "pandadoc",
    "isAvailable": true
  },
  {
    "title": "Google Docs",
    "description": "Google Docs is a cloud-based word processor with real-time collaboration, version history, and integration with other Google Workspace apps.",
    "image": "/assets/apps-logos/google-docs.svg",
    "app_name": "googledocs",
    "isAvailable": true
  },
  {
    "title": "Airtable",
    "description": "Airtable merges spreadsheet functionality with database power, enabling teams to organize projects, track tasks, and collaborate through customizable views, automation, and integrations for data management.",
    "image": "/assets/apps-logos/airtable.svg",
    "app_name": "airtable",
    "isAvailable": true
  },
  {
    "title": "Google Tasks",
    "description": "Google Tasks provides a simple to-do list and task management system integrated into Gmail and Google Calendar for quick and easy tracking.",
    "image": "/assets/apps-logos/google-tasks.png",
    "app_name": "googletasks",
    "isAvailable": true
  },
  {
    "title": "Wrike",
    "description": "Wrike is a project management and collaboration tool offering customizable workflows, Gantt charts, reporting, and resource management to boost team productivity.",
    "image": "/assets/apps-logos/wrike.png",
    "app_name": "wrike",
    "isAvailable": true
  },
  {
    "title": "ClickUp",
    "description": "ClickUp unifies tasks, docs, goals, and chat in a single platform, allowing teams to plan, organize, and collaborate across projects with customizable workflows.",
    "image": "/assets/apps-logos/clickup.png",
    "app_name": "clickup",
    "isAvailable": true
  },
  {
    "title": "Shortcut",
    "description": "Shortcut aligns product development work with company objectives so teams can execute with a shared purpose.",
    "image": "/assets/apps-logos/shortcut.svg",
    "app_name": "shortcut",
    "isAvailable": true
  },
  {
    "title": "Coda",
    "description": "Collaborative workspace platform that transforms documents into powerful tools for team productivity and project management.",
    "image": "/assets/apps-logos/coda.png",
    "app_name": "coda",
    "isAvailable": true
  },
  {
    "title": "Monday",
    "description": "Monday.com is a customizable work management platform for project planning, collaboration, and automation, supporting agile, sales, marketing, and more.",
    "image": "/assets/apps-logos/monday.png",
    "app_name": "monday",
    "isAvailable": true
  },
  {
    "title": "Onepage",
    "description": "API for enriching user and company data, providing endpoints for token validation and generic search.",
    "image": "/assets/apps-logos/onepage.svg",
    "app_name": "onepage",
    "isAvailable": true
  },
  {
    "title": "LinkHut",
    "description": "LinkHut manages bookmarked links in a minimalistic, shareable interface, helping teams organize URLs and track references in one place.",
    "image": "/assets/apps-logos/linkhut.svg",
    "app_name": "linkhut",
    "isAvailable": true
  },
  {
    "title": "Timely",
    "description": "Timely is an automatic time-tracking platform capturing activity across applications, calendars, and devices, creating detailed timesheets for billing or productivity insights.",
    "image": "/assets/apps-logos/timely.png",
    "app_name": "timely",
    "isAvailable": true
  },
  {
    "title": "Todoist",
    "description": "Todoist is a task management tool allowing users to create to-do lists, set deadlines, and collaborate on projects with reminders and cross-platform syncing.",
    "image": "/assets/apps-logos/todoist.svg",
    "app_name": "todoist",
    "isAvailable": true
  },
  {
    "title": "Harvest",
    "description": "Harvest is a time-tracking and invoicing tool designed for teams and freelancers, helping them log billable hours, manage projects, and streamline payments.",
    "image": "/assets/apps-logos/harvest.png",
    "app_name": "harvest",
    "isAvailable": true
  },
  {
    "title": "Google Slides",
    "description": "Google Slides is a cloud-based presentation editor with real-time collaboration, template gallery, and integration with other Google Workspace apps.",
    "image": "/assets/apps-logos/google-slides.svg",
    "app_name": "googleslides",
    "isAvailable": true
  },
  {
    "title": "Hubspot",
    "description": "HubSpot is an inbound marketing, sales, and customer service platform integrating CRM, email automation, and analytics to facilitate lead nurturing and seamless customer experiences.",
    "image": "/assets/apps-logos/hubspot.webp",
    "app_name": "hubspot",
    "isAvailable": true
  },
  {
    "title": "Salesforce",
    "description": "Salesforce is a leading CRM platform integrating sales, service, marketing, and analytics to build customer relationships and drive business growth.",
    "image": "/assets/apps-logos/salesforce.svg",
    "app_name": "salesforce",
    "isAvailable": true
  },
  {
    "title": "Apollo",
    "description": "Apollo provides CRM and lead generation capabilities, helping businesses discover contacts, manage outreach, and track sales pipelines for consistent customer relationship development.",
    "image": "/assets/apps-logos/apollo.jpg",
    "app_name": "apollo",
    "isAvailable": true
  },
  {
    "title": "Attio",
    "description": "Attio is a fully customizable workspace for your team's relationships and workflows.",
    "image": "/assets/apps-logos/attio.webp",
    "app_name": "attio",
    "isAvailable": true
  },
  {
    "title": "Zoho",
    "description": "Zoho is a suite of cloud applications including CRM, email marketing, and collaboration tools, enabling businesses to automate and scale operations.",
    "image": "/assets/apps-logos/zoho.png",
    "app_name": "zoho",
    "isAvailable": true
  },
  {
    "title": "Freshdesk",
    "description": "Freshdesk provides customer support software with ticketing, knowledge base, and automation features for efficient helpdesk operations and better customer experiences.",
    "image": "/assets/apps-logos/freshdesk.svg",
    "app_name": "freshdesk",
    "isAvailable": true
  },
  {
    "title": "AccuLynx",
    "description": "Using the AccuLynx API, data can be seamlessly exchanged between AccuLynx and other applications for greater efficiency and productivity.",
    "image": "/assets/apps-logos/acculynx.jpeg",
    "app_name": "acculynx",
    "isAvailable": true
  },
  {
    "title": "Affinity",
    "description": "Affinity helps private capital investors to find, manage, and close more deals.",
    "image": "/assets/apps-logos/affinity.jpeg",
    "app_name": "affinity",
    "isAvailable": true
  },
  {
    "title": "AgencyZoom",
    "description": "AgencyZoom is for the P&C insurance agent that's looking to increase sales, boost retention and analyze agency & producer performance.",
    "image": "/assets/apps-logos/agencyzoom_logo.jpeg",
    "app_name": "agencyzoom",
    "isAvailable": true
  },
  {
    "title": "Pipedrive",
    "description": "Pipedrive is a sales management tool built around pipeline visualization, lead tracking, activity reminders, and automation to keep deals progressing.",
    "image": "/assets/apps-logos/pipedrive.svg",
    "app_name": "pipedrive",
    "isAvailable": true
  },
  {
    "title": "Dynamics365",
    "description": "Dynamics 365 from Microsoft combines CRM, ERP, and productivity apps to streamline sales, marketing, customer service, and operations in one integrated platform.",
    "image": "/assets/apps-logos/Dynamics365.svg",
    "app_name": "dynamics365",
    "isAvailable": true
  },
  {
    "title": "Zendesk",
    "description": "Zendesk provides customer support software with ticketing, live chat, and knowledge base features, enabling efficient helpdesk operations and customer engagement.",
    "image": "/assets/apps-logos/zendesk.svg",
    "app_name": "zendesk",
    "isAvailable": true
  },
  {
    "title": "Close",
    "description": "Close is a CRM platform designed to help businesses manage and streamline their sales processes, including calling, email automation, and predictive dialers.",
    "image": "/assets/apps-logos/close-logo.jpeg",
    "app_name": "close",
    "isAvailable": true
  },
  {
    "title": "Simplesat",
    "description": "Simplesat captures customer feedback and CSAT scores through surveys, integrating directly with helpdesk systems for real-time performance insights.",
    "image": "/assets/apps-logos/simplesat.jpeg",
    "app_name": "simplesat",
    "isAvailable": true
  },
  {
    "title": "Zoho Bigin",
    "description": "Zoho Bigin is a simplified CRM solution from Zoho tailored for small businesses, focusing on pipeline tracking and relationship management.",
    "image": "/assets/apps-logos/zoho.png",
    "app_name": "zoho_bigin",
    "isAvailable": true
  },
  {
    "title": "Gorgias",
    "description": "Gorgias is a helpdesk and live chat platform specializing in e-commerce, offering automated support, order management, and unified customer communication.",
    "image": "/assets/apps-logos/gorgias.png",
    "app_name": "gorgias",
    "isAvailable": true
  },
  {
    "title": "Kommo",
    "description": "Kommo CRM (formerly amoCRM) integration tool for managing customer relationships, sales pipelines, and business processes.",
    "image": "/assets/apps-logos/kommo.png",
    "app_name": "kommo",
    "isAvailable": true
  },
  {
    "title": "Zoominfo",
    "description": "AgencyZoom is for the P&C insurance agent that's looking to increase sales, boost retention and analyze agency & producer performance.",
    "image": "/assets/apps-logos/zoominfo.ico",
    "app_name": "zoominfo",
    "isAvailable": true
  },
  {
    "title": "Intercom",
    "description": "Intercom provides live chat, messaging, and customer engagement tools, enabling businesses to drive conversions, handle support, and personalize communication at scale.",
    "image": "/assets/apps-logos/intercom.svg",
    "app_name": "intercom",
    "isAvailable": true
  },
  {
    "title": "Capsule CRM",
    "description": "Capsule CRM is a simple yet powerful CRM platform designed to help businesses manage customer relationships, sales pipelines, and tasks efficiently.",
    "image": "/assets/apps-logos/capsule_crm-logo.png",
    "app_name": "capsule_crm",
    "isAvailable": true
  },
  {
    "title": "Fireberry",
    "description": "Fireberry is a CRM platform that offers integrations with various tools and applications to streamline business processes.",
    "image": "/assets/apps-logos/fireberry-logo.png",
    "app_name": "fireberry",
    "isAvailable": true
  },
  {
    "title": "Folk",
    "description": "folk is a next-generation CRM designed for teams to manage and nurture their relationships efficiently.",
    "image": "/assets/apps-logos/folk_round3_20250722.png",
    "app_name": "folk",
    "isAvailable": true
  },
  {
    "title": "JobNimbus",
    "description": "JobNimbus is a CRM and project management software designed for contractors, helping streamline scheduling, estimates, invoicing, and job tracking.",
    "image": "/assets/apps-logos/jobnimbus-logo.jpeg",
    "app_name": "jobnimbus",
    "isAvailable": true
  },
  {
    "title": "noCRM.io",
    "description": "noCRM.io is a lead management software designed to help sales teams track and close deals efficiently.",
    "image": "/assets/apps-logos/nocrm_io_round2_20250722.png",
    "app_name": "nocrm_io",
    "isAvailable": true
  },
  {
    "title": "Salesmate",
    "description": "Salesmate is an AI-powered CRM platform designed to help businesses engage leads, close deals faster, nurture relationships, and provide seamless support through a unified, intuitive interface.",
    "image": "/assets/apps-logos/salesmate-logo.jpeg",
    "app_name": "salesmate",
    "isAvailable": true
  },
  {
    "title": "SerpApi",
    "description": "SerpApi provides a real-time API for structured search engine results, allowing developers to scrape, parse, and analyze SERP data for SEO and research.",
    "image": "/assets/apps-logos/serpapi.png",
    "app_name": "serpapi",
    "isAvailable": true
  },
  {
    "title": "Firecrawl",
    "description": "Firecrawl automates web crawling and data extraction, enabling organizations to gather content, index sites, and gain insights from online sources at scale.",
    "image": "/assets/apps-logos/firecrawl.jpeg",
    "app_name": "firecrawl",
    "isAvailable": true
  },
  {
    "title": "Tavily",
    "description": "Tavily offers search and data retrieval solutions, helping teams quickly locate and filter relevant information from documents, databases, or web sources.",
    "image": "/assets/apps-logos/tavily.svg",
    "app_name": "tavily",
    "isAvailable": true
  },
  {
    "title": "Exa",
    "description": "Exa focuses on data extraction and search, helping teams gather, analyze, and visualize information from websites, APIs, or internal databases.",
    "image": "/assets/apps-logos/exa.png",
    "app_name": "exa",
    "isAvailable": true
  },
  {
    "title": "Snowflake",
    "description": "Snowflake is a cloud-based data warehouse offering elastic scaling, secure data sharing, and SQL analytics across multiple cloud environments.",
    "image": "/assets/apps-logos/snowflake.svg",
    "app_name": "snowflake",
    "isAvailable": true
  },
  {
    "title": "PeopleDataLabs",
    "description": "PeopleDataLabs provides B2B data enrichment and identity resolution, empowering organizations to build enriched user profiles and validate customer information.",
    "image": "/assets/apps-logos/pdl.png",
    "app_name": "peopledatalabs",
    "isAvailable": true
  },
  {
    "title": "PostHog",
    "description": "PostHog is an open-source product analytics platform tracking user interactions and behaviors to help teams refine features, improve funnels, and reduce churn.",
    "image": "/assets/apps-logos/posthog.svg",
    "app_name": "posthog",
    "isAvailable": true
  },
  {
    "title": "Fireflies",
    "description": "Fireflies.ai helps your team transcribe, summarize, search, and analyze voice conversations.",
    "image": "/assets/apps-logos/fireflies.jpg",
    "app_name": "fireflies",
    "isAvailable": true
  },
  {
    "title": "Mixpanel",
    "description": "Mixpanel is a product analytics platform tracking user interactions and engagement, providing cohort analysis, funnels, and A/B testing to improve user experiences.",
    "image": "/assets/apps-logos/mixpanel.svg",
    "app_name": "mixpanel",
    "isAvailable": true
  },
  {
    "title": "Amplitude",
    "description": "Amplitude Inc. is an American publicly trading company that develops digital analytics software.",
    "image": "/assets/apps-logos/amplitude.svg",
    "app_name": "amplitude",
    "isAvailable": true
  },
  {
    "title": "Google BigQuery",
    "description": "Google BigQuery is a fully managed data warehouse for large-scale data analytics, offering fast SQL queries and machine learning capabilities on massive datasets.",
    "image": "/assets/apps-logos/googl-bigquery.svg",
    "app_name": "googlebigquery",
    "isAvailable": true
  },
  {
    "title": "Microsoft Clarity",
    "description": "Microsoft Clarity is a free user behavior analytics tool that captures heatmaps, session recordings, and engagement metrics to help improve website experiences.",
    "image": "/assets/apps-logos/microsoft-clarity-logo.jpeg",
    "app_name": "microsoft_clarity",
    "isAvailable": true
  },
  {
    "title": "Servicenow",
    "description": "Servicenow provides IT Service Management Transform service management to boost productivity and maximize ROI.",
    "image": "/assets/apps-logos/servicenow.png",
    "app_name": "servicenow",
    "isAvailable": true
  },
  {
    "title": "Google Analytics",
    "description": "Google Analytics tracks and reports website traffic, user behavior, and conversion data, enabling marketers to optimize online performance and customer journeys.",
    "image": "/assets/apps-logos/googleanalytics.png",
    "app_name": "google_analytics",
    "isAvailable": true
  },
  {
    "title": "BrowseAI",
    "description": "Browse.ai allows you to turn any website into an API using its advanced web automation and data extraction tools, enabling easy monitoring and data retrieval from websites.",
    "image": "/assets/apps-logos/browseai.svg",
    "app_name": "browseai",
    "isAvailable": true
  },
  {
    "title": "Placekey",
    "description": "Placekey standardizes location data by assigning unique IDs to physical addresses, simplifying address matching and enabling data sharing across platforms.",
    "image": "/assets/apps-logos/placekey.png",
    "app_name": "placekey",
    "isAvailable": true
  },
  {
    "title": "Kibana",
    "description": "Kibana is a visualization and analytics platform for Elasticsearch, offering dashboards, data exploration, and monitoring capabilities for gaining insights from data.",
    "image": "/assets/apps-logos/kibana.svg",
    "app_name": "kibana",
    "isAvailable": true
  },
  {
    "title": "Jira",
    "description": "A tool for bug tracking, issue tracking, and agile project management.",
    "image": "/assets/apps-logos/jira.svg",
    "app_name": "jira",
    "isAvailable": true
  },
  {
    "title": "Asana",
    "description": "Tool to help teams organize, track, and manage their work.",
    "image": "/assets/apps-logos/asana.png",
    "app_name": "asana",
    "isAvailable": true
  },
  {
    "title": "Bolna",
    "description": "Create conversational voice agents using Bolna AI to enhance interactions, streamline operations and automate support.",
    "image": "/assets/apps-logos/bolna-logo.png",
    "app_name": "bolna",
    "isAvailable": true
  },
  {
    "title": "Calendar Hero",
    "description": "Calendar Hero is a versatile scheduling tool designed to streamline and simplify your calendar management. It integrates seamlessly with your existing calendars, allowing you to efficiently schedule, reschedule, and manage meetings with ease.",
    "image": "/assets/apps-logos/calendarhero_fixed_20250722.png",
    "app_name": "calendarhero",
    "isAvailable": true
  },
  {
    "title": "Google Admin",
    "description": "Google Admin Console for managing Google Workspace users, groups, and organizational units.",
    "image": "/assets/apps-logos/google-admin.svg",
    "app_name": "google_admin",
    "isAvailable": true
  },
  {
    "title": "Pushbullet",
    "description": "Pushbullet enables seamless sharing of notifications and files across devices.",
    "image": "/assets/apps-logos/pushbullet_round3_20250722.png",
    "app_name": "pushbullet",
    "isAvailable": true
  },
  {
    "title": "TickTick",
    "description": "TickTick is a cross-platform task management and to-do list application designed to help users organize their tasks and schedules efficiently.",
    "image": "/assets/apps-logos/ticktick.ico",
    "app_name": "ticktick",
    "isAvailable": true
  },
  {
    "title": "YouTube",
    "description": "YouTube is a video-sharing platform with user-generated content, live streaming, and monetization opportunities, widely used for marketing, education, and entertainment.",
    "image": "/assets/apps-logos/youtube.svg",
    "app_name": "youtube",
    "isAvailable": true
  },
  {
    "title": "Spotify",
    "description": "Spotify is a digital music and podcast streaming service with millions of tracks, personalized playlists, and social sharing features.",
    "image": "/assets/apps-logos/spotify-icon.svg",
    "app_name": "spotify",
    "isAvailable": true
  },
  {
    "title": "Canvas",
    "description": "Canvas is a learning management system supporting online courses, assignments, grading, and collaboration, widely used by schools and universities for virtual classrooms.",
    "image": "/assets/apps-logos/canvas.jpeg",
    "app_name": "canvas",
    "isAvailable": true
  },
  {
    "title": "D2L Brightspace",
    "description": "D2L Brightspace is a learning management system that provides a comprehensive suite of tools for educators to create, manage, and deliver online courses and learning experiences.",
    "image": "/assets/apps-logos/d2lbrightspace.png",
    "app_name": "d2lbrightspace",
    "isAvailable": true
  },
  {
    "title": "Figma",
    "description": "A collaborative interface design tool.",
    "image": "/assets/apps-logos/figma.svg",
    "app_name": "figma",
    "isAvailable": true
  },
  {
    "title": "Miro",
    "description": "Miro is a collaborative online whiteboard enabling teams to brainstorm ideas, design wireframes, plan workflows, and manage projects visually.",
    "image": "/assets/apps-logos/miro.svg",
    "app_name": "miro",
    "isAvailable": true
  },
  {
    "title": "Canva",
    "description": "Canva offers a drag-and-drop design suite for creating social media graphics, presentations, and marketing materials with prebuilt templates and a vast element library.",
    "image": "/assets/apps-logos/canva.jpeg",
    "app_name": "canva",
    "isAvailable": true
  },
  {
    "title": "Webflow",
    "description": "Webflow is a no-code website design and hosting platform, letting users build responsive sites, launch online stores, and maintain content without coding.",
    "image": "/assets/apps-logos/webflow.jpeg",
    "app_name": "webflow",
    "isAvailable": true
  },
  {
    "title": "Mural",
    "description": "Mural is a digital whiteboard platform enabling distributed teams to visually brainstorm, map ideas, and collaborate in real time with sticky notes and diagrams.",
    "image": "/assets/apps-logos/mural.svg",
    "app_name": "mural",
    "isAvailable": true
  },
  {
    "title": "Reddit",
    "description": "Reddit is a social news platform with user-driven communities (subreddits), offering content sharing, discussions, and viral marketing opportunities for brands.",
    "image": "/assets/apps-logos/reddit.svg",
    "app_name": "reddit",
    "isAvailable": true
  },
  {
    "title": "Linkedin",
    "description": "LinkedIn is a professional networking platform enabling job seekers, companies, and thought leaders to connect, share content, and discover business opportunities.",
    "image": "/assets/apps-logos/linkedin.svg",
    "app_name": "linkedin",
    "isAvailable": true
  },
  {
    "title": "Twitter Media",
    "description": "Twitter Media focuses on multimedia tools and features within Twitter, allowing brands to leverage rich content for marketing campaigns.",
    "image": "/assets/apps-logos/twitter.png",
    "app_name": "twitter_media",
    "isAvailable": false
  },
  {
    "title": "Klaviyo",
    "description": "Klaviyo is a data-driven email and SMS marketing platform that allows e-commerce brands to deliver targeted messages, track conversions, and scale customer relationships.",
    "image": "/assets/apps-logos/klaviyo.png",
    "app_name": "klaviyo",
    "isAvailable": true
  },
  {
    "title": "Mailchimp",
    "description": "Mailchimp is an email marketing and automation platform providing campaign templates, audience segmentation, and performance analytics to drive engagement and conversions.",
    "image": "/assets/apps-logos/mailchimp.svg",
    "app_name": "mailchimp",
    "isAvailable": true
  },
  {
    "title": "Ahrefs",
    "description": "Ahrefs is an SEO and marketing platform offering site audits, keyword research, content analysis, and competitive insights to improve search rankings and drive organic traffic.",
    "image": "/assets/apps-logos/ahrefs.png",
    "app_name": "ahrefs",
    "isAvailable": true
  },
  {
    "title": "SendGrid",
    "description": "SendGrid is a cloud-based email delivery platform providing transactional and marketing email services, with APIs for integration, analytics, and scalability.",
    "image": "/assets/apps-logos/sendgrid.png",
    "app_name": "sendgrid",
    "isAvailable": true
  },
  {
    "title": "Facebook",
    "description": "Facebook is a social media and advertising platform used by individuals and businesses to connect, share content, and promote products or services.",
    "image": "/assets/apps-logos/facebook.svg",
    "app_name": "facebook",
    "isAvailable": true
  },
  {
    "title": "CrustData",
    "description": "CrustData is an AI-powered data intelligence platform that provides real-time company and people data via APIs and webhooks, empowering B2B sales teams, AI SDRs, and investors to act on live signals.",
    "image": "/assets/apps-logos/crustdata.png",
    "app_name": "crustdata",
    "isAvailable": true
  },
  {
    "title": "Brandfetch",
    "description": "Brandfetch offers an API that retrieves company logos, brand colors, and other visual assets, helping marketers and developers maintain consistent branding across apps.",
    "image": "/assets/apps-logos/brandfetch-logo.png",
    "app_name": "brandfetch",
    "isAvailable": true
  },
  {
    "title": "AMCards",
    "description": "AMCards enables users to create personalized greeting cards, automate mailing campaigns, strengthen customer relationships using a convenient online platform for individualized connections.",
    "image": "/assets/apps-logos/amcards.svg",
    "app_name": "amcards",
    "isAvailable": true
  },
  {
    "title": "ActiveCampaign",
    "description": "ActiveCampaign is a marketing automation and CRM platform enabling businesses to manage email campaigns, sales pipelines, and customer segmentation to boost engagement and drive growth.",
    "image": "/assets/apps-logos/activecampaign.png",
    "app_name": "active_campaign",
    "isAvailable": true
  },
  {
    "title": "Eventbrite",
    "description": "Eventbrite enables organizers to plan, promote, and manage events, selling tickets and providing attendee tools for conferences, concerts, and gatherings.",
    "image": "/assets/apps-logos/eventbrite.svg",
    "app_name": "eventbrite",
    "isAvailable": true
  },
  {
    "title": "Cal",
    "description": "Cal simplifies meeting coordination by providing shareable booking pages, calendar syncing, and availability management to streamline the scheduling process.",
    "image": "/assets/apps-logos/cal-logo.png",
    "app_name": "cal",
    "isAvailable": true
  },
  {
    "title": "Calendly",
    "description": "Calendly is an appointment scheduling tool that automates meeting invitations, availability checks, and reminders, helping individuals and teams avoid email back-and-forth.",
    "image": "/assets/apps-logos/calendly.svg",
    "app_name": "calendly",
    "isAvailable": true
  },
  {
    "title": "Apaleo",
    "description": "Apaleo is a cloud-based property management platform handling reservations, billing, and daily operations for hospitality businesses.",
    "image": "/assets/apps-logos/apaleo.png",
    "app_name": "apaleo",
    "isAvailable": true
  },
  {
    "title": "Shopify",
    "description": "Shopify is an e-commerce platform enabling merchants to create online stores, manage products, and process payments with themes, apps, and integrated marketing tools.",
    "image": "/assets/apps-logos/shopify.svg",
    "app_name": "shopify",
    "isAvailable": true
  },
  {
    "title": "Jungle Scout",
    "description": "Jungle Scout assists Amazon sellers with product research, sales estimates, and competitive insights to optimize inventory, pricing, and listing strategies.",
    "image": "/assets/apps-logos/junglescout.jpeg",
    "app_name": "junglescout",
    "isAvailable": true
  },
  {
    "title": "Gumroad",
    "description": "Gumroad simplifies selling digital goods, physical products, and memberships by offering a streamlined checkout, marketing tools, and direct payout options.",
    "image": "/assets/apps-logos/gumroad.svg",
    "app_name": "gumroad",
    "isAvailable": true
  },
  {
    "title": "ASIN Data API",
    "description": "ASIN Data API provides detailed product data from Amazon, including price, rank, reviews, and more, enabling real-time insights for e-commerce professionals, marketers, and data analysts.",
    "image": "/assets/apps-logos/asin-data-api.jpeg",
    "app_name": "asin_data_api",
    "isAvailable": true
  },
  {
    "title": "BaseLinker",
    "description": "BaseLinker is a comprehensive e-commerce management platform that integrates with various marketplaces, online stores, carriers, and accounting systems to streamline order processing, inventory management, and sales automation.",
    "image": "/assets/apps-logos/baselinker-logo.png",
    "app_name": "baselinker",
    "isAvailable": true
  },
  {
    "title": "Cloud Cart",
    "description": "Cloud Cart is an e-commerce platform that enables businesses to create and manage online stores efficiently.",
    "image": "/assets/apps-logos/cloudcart.png",
    "app_name": "cloudcart",
    "isAvailable": true
  },
  {
    "title": "Lemon Squeezy",
    "description": "Lemon Squeezy is a platform designed to simplify payments, taxes, and subscriptions for software companies, offering a powerful API and webhooks for seamless integration.",
    "image": "/assets/apps-logos/lemonsqueezy-logo.jpeg",
    "app_name": "lemon_squeezy",
    "isAvailable": true
  },
  {
    "title": "Payhip",
    "description": "Payhip is an e-commerce platform that enables individuals and businesses to sell digital products, memberships, and physical goods directly to their audience.",
    "image": "/assets/apps-logos/payhip-logo.jpeg",
    "app_name": "payhip",
    "isAvailable": true
  },
  {
    "title": "Google Maps",
    "description": "Integrate Google Maps to access location data, geocoding, directions, and mapping services in your application.",
    "image": "/assets/apps-logos/google_maps.jpeg",
    "app_name": "google_maps",
    "isAvailable": true
  },
  {
    "title": "You Search",
    "description": "You Search is a search engine or search tool that enables users to find relevant information, possibly with enhanced filtering or privacy-focused features.",
    "image": "/assets/apps-logos/you.webp",
    "app_name": "yousearch",
    "isAvailable": true
  },
  {
    "title": "Linkup",
    "description": "Search the Web for Relevant Results (RAG Use Case).",
    "image": "/assets/apps-logos/linkup.jpeg",
    "app_name": "linkup",
    "isAvailable": true
  },
  {
    "title": "More Trees",
    "description": "More Trees is a sustainability-focused platform planting trees on behalf of individuals or businesses aiming to offset carbon footprints and support reforestation.",
    "image": "/assets/apps-logos/more-trees.jpg",
    "app_name": "more_trees",
    "isAvailable": true
  },
  {
    "title": "Yandex",
    "description": "Yandex is a Russian internet services provider offering search, email, navigation, and other web-based solutions, often referred to as “Russia’s Google”.",
    "image": "/assets/apps-logos/yandex.svg",
    "app_name": "yandex",
    "isAvailable": true
  },
  {
    "title": "Tiny URL",
    "description": "Tiny URL shortens lengthy URLs, generating concise links for easier sharing and managing, often used in social media and marketing campaigns.",
    "image": "/assets/apps-logos/tinyurl-logo.png",
    "app_name": "tinyurl",
    "isAvailable": true
  },
  {
    "title": "Foursquare",
    "description": "Search for places and place recommendations from the Foursquare Places database.",
    "image": "/assets/apps-logos/foursquare.png",
    "app_name": "foursquare",
    "isAvailable": true
  },
  {
    "title": "Stripe",
    "description": "Stripe offers online payment infrastructure, fraud prevention, and APIs enabling businesses to accept and manage payments globally.",
    "image": "/assets/apps-logos/stripe.jpeg",
    "app_name": "stripe",
    "isAvailable": true
  },
  {
    "title": "RecallAI",
    "description": "The universal API for meeting bots & conversation data.",
    "image": "/assets/apps-logos/recall.svg",
    "app_name": "recallai",
    "isAvailable": true
  },
  {
    "title": "Xero",
    "description": "Xero is a cloud-based accounting software for small businesses, providing invoicing, bank reconciliation, bookkeeping, and financial reporting in real time.",
    "image": "/assets/apps-logos/xero.svg",
    "app_name": "xero",
    "isAvailable": true
  },
  {
    "title": "Brex",
    "description": "Brex provides corporate credit cards, spend management, and financial tools tailored for startups and tech businesses to optimize cash flow, accounting, and growth.",
    "image": "/assets/apps-logos/brex-staging-logo.png",
    "app_name": "brex",
    "isAvailable": true
  },
  {
    "title": "Zoho Invoice",
    "description": "Zoho Invoice simplifies billing, recurring payments, and expense management, helping freelancers and small businesses send professional invoices.",
    "image": "/assets/apps-logos/zoho.png",
    "app_name": "zoho_invoice",
    "isAvailable": true
  },
  {
    "title": "Quickbooks",
    "description": "Quickbooks is a cloud-based accounting software that helps you manage your finances, track your income and expenses, and get insights into your business.",
    "image": "/assets/apps-logos/quickbooks.jpg",
    "app_name": "quickbooks",
    "isAvailable": true
  },
  {
    "title": "Ramp",
    "description": "Ramp is a platform that helps you manage your finances, track your income and expenses, and get insights into your business.",
    "image": "/assets/apps-logos/ramp.svg",
    "app_name": "ramp",
    "isAvailable": true
  },
  {
    "title": "Borneo",
    "description": "Borneo is a data security and privacy platform designed for sensitive data discovery and remediation.",
    "image": "/assets/apps-logos/borneo.jpeg",
    "app_name": "borneo",
    "isAvailable": true
  },
  {
    "title": "Heygen",
    "description": "HeyGen is an innovative video platform that harnesses the power of generative AI to streamline your video creation process.",
    "image": "/assets/apps-logos/heygen.jpg",
    "app_name": "heygen",
    "isAvailable": true
  },
  {
    "title": "Coinbase",
    "description": "Coinbase is a platform for buying, selling, transferring, and storing cryptocurrency.",
    "image": "/assets/apps-logos/coinbase.svg",
    "app_name": "coinbase",
    "isAvailable": true
  },
  {
    "title": "Coinranking",
    "description": "Coinranking provides a comprehensive API for accessing cryptocurrency market data, including coin prices, market caps, and historical data.",
    "image": "/assets/apps-logos/Coinranking.ico",
    "app_name": "coinranking",
    "isAvailable": true
  },
  {
    "title": "Bannerbear",
    "description": "Bannerbear offers an automated image and video generation API, allowing businesses to create graphics, social media visuals, and marketing collateral with customizable templates at scale.",
    "image": "/assets/apps-logos/bannerbear-logo.jpg",
    "app_name": "bannerbear",
    "isAvailable": true
  },
  {
    "title": "Process Street",
    "description": "Process Street supports creating and running checklists, SOPs, and workflows, helping teams automate recurring processes and track compliance.",
    "image": "/assets/apps-logos/process-street-logo.png",
    "app_name": "process_street",
    "isAvailable": true
  },
  {
    "title": "Workiom",
    "description": "Workiom allows businesses to create custom workflows, integrate apps, and automate processes, reducing manual overhead and streamlining operations.",
    "image": "/assets/apps-logos/workiom.jpeg",
    "app_name": "workiom",
    "isAvailable": true
  },
  {
    "title": "Formsite",
    "description": "Formsite helps users create online forms and surveys with drag-and-drop tools, secure data capture, and integrations to simplify workflows.",
    "image": "/assets/apps-logos/formsite.png",
    "app_name": "formsite",
    "isAvailable": true
  },
  {
    "title": "ServiceM8",
    "description": "ServiceM8 helps field service businesses schedule jobs, send quotes, and manage invoices, offering staff mobile apps and real-time job status tracking.",
    "image": "/assets/apps-logos/servicem8.svg",
    "app_name": "servicem8",
    "isAvailable": true
  },
  {
    "title": " 21risk",
    "description": "Integrate  21risk to seamlessly execute automated workflows, synchronize data, and orchestrate  21risk actions directly within Alti.",
    "image": "/assets/apps-logos/_21risk.svg",
    "app_name": "_21risk",
    "isAvailable": true
  },
  {
    "title": " 2chat",
    "description": "Integrate  2chat to seamlessly execute automated workflows, synchronize data, and orchestrate  2chat actions directly within Alti.",
    "image": "/assets/apps-logos/_2chat.svg",
    "app_name": "_2chat",
    "isAvailable": true
  },
  {
    "title": "Abstract",
    "description": "Integrate Abstract to seamlessly execute automated workflows, synchronize data, and orchestrate Abstract actions directly within Alti.",
    "image": "/assets/apps-logos/abstract.svg",
    "app_name": "abstract",
    "isAvailable": true
  },
  {
    "title": "Abuselpdb",
    "description": "Integrate Abuselpdb to seamlessly execute automated workflows, synchronize data, and orchestrate Abuselpdb actions directly within Alti.",
    "image": "/assets/apps-logos/abuselpdb.svg",
    "app_name": "abuselpdb",
    "isAvailable": true
  },
  {
    "title": "Abyssale",
    "description": "Integrate Abyssale to seamlessly execute automated workflows, synchronize data, and orchestrate Abyssale actions directly within Alti.",
    "image": "/assets/apps-logos/abyssale.svg",
    "app_name": "abyssale",
    "isAvailable": true
  },
  {
    "title": "Accelo",
    "description": "Integrate Accelo to seamlessly execute automated workflows, synchronize data, and orchestrate Accelo actions directly within Alti.",
    "image": "/assets/apps-logos/accelo.svg",
    "app_name": "accelo",
    "isAvailable": true
  },
  {
    "title": "Accredible Certificates",
    "description": "Integrate Accredible Certificates to seamlessly execute automated workflows, synchronize data, and orchestrate Accredible Certificates actions directly within Alti.",
    "image": "/assets/apps-logos/accredible_certificates.svg",
    "app_name": "accredible_certificates",
    "isAvailable": true
  },
  {
    "title": "Addresszen",
    "description": "Integrate Addresszen to seamlessly execute automated workflows, synchronize data, and orchestrate Addresszen actions directly within Alti.",
    "image": "/assets/apps-logos/addresszen.svg",
    "app_name": "addresszen",
    "isAvailable": true
  },
  {
    "title": "Adobe",
    "description": "Integrate Adobe to seamlessly execute automated workflows, synchronize data, and orchestrate Adobe actions directly within Alti.",
    "image": "/assets/apps-logos/adobe.svg",
    "app_name": "adobe",
    "isAvailable": true
  },
  {
    "title": "Adrapid",
    "description": "Integrate Adrapid to seamlessly execute automated workflows, synchronize data, and orchestrate Adrapid actions directly within Alti.",
    "image": "/assets/apps-logos/adrapid.svg",
    "app_name": "adrapid",
    "isAvailable": true
  },
  {
    "title": "Adyntel",
    "description": "Integrate Adyntel to seamlessly execute automated workflows, synchronize data, and orchestrate Adyntel actions directly within Alti.",
    "image": "/assets/apps-logos/adyntel.svg",
    "app_name": "adyntel",
    "isAvailable": true
  },
  {
    "title": "Aero Workflow",
    "description": "Integrate Aero Workflow to seamlessly execute automated workflows, synchronize data, and orchestrate Aero Workflow actions directly within Alti.",
    "image": "/assets/apps-logos/aero_workflow.svg",
    "app_name": "aero_workflow",
    "isAvailable": true
  },
  {
    "title": "Aeroleads",
    "description": "Integrate Aeroleads to seamlessly execute automated workflows, synchronize data, and orchestrate Aeroleads actions directly within Alti.",
    "image": "/assets/apps-logos/aeroleads.svg",
    "app_name": "aeroleads",
    "isAvailable": true
  },
  {
    "title": "Affinda",
    "description": "Integrate Affinda to seamlessly execute automated workflows, synchronize data, and orchestrate Affinda actions directly within Alti.",
    "image": "/assets/apps-logos/affinda.svg",
    "app_name": "affinda",
    "isAvailable": true
  },
  {
    "title": "Agent Mail",
    "description": "Integrate Agent Mail to seamlessly execute automated workflows, synchronize data, and orchestrate Agent Mail actions directly within Alti.",
    "image": "/assets/apps-logos/agent_mail.svg",
    "app_name": "agent_mail",
    "isAvailable": true
  },
  {
    "title": "Agentql",
    "description": "Integrate Agentql to seamlessly execute automated workflows, synchronize data, and orchestrate Agentql actions directly within Alti.",
    "image": "/assets/apps-logos/agentql.svg",
    "app_name": "agentql",
    "isAvailable": true
  },
  {
    "title": "Agenty",
    "description": "Integrate Agenty to seamlessly execute automated workflows, synchronize data, and orchestrate Agenty actions directly within Alti.",
    "image": "/assets/apps-logos/agenty.svg",
    "app_name": "agenty",
    "isAvailable": true
  },
  {
    "title": "Agiled",
    "description": "Integrate Agiled to seamlessly execute automated workflows, synchronize data, and orchestrate Agiled actions directly within Alti.",
    "image": "/assets/apps-logos/agiled.svg",
    "app_name": "agiled",
    "isAvailable": true
  },
  {
    "title": "Agility CMS",
    "description": "Integrate Agility CMS to seamlessly execute automated workflows, synchronize data, and orchestrate Agility CMS actions directly within Alti.",
    "image": "/assets/apps-logos/agility_cms.svg",
    "app_name": "agility_cms",
    "isAvailable": true
  },
  {
    "title": "AI Ml API",
    "description": "Integrate AI Ml API to seamlessly execute automated workflows, synchronize data, and orchestrate AI Ml API actions directly within Alti.",
    "image": "/assets/apps-logos/ai_ml_api.svg",
    "app_name": "ai_ml_api",
    "isAvailable": true
  },
  {
    "title": "Aivoov",
    "description": "Integrate Aivoov to seamlessly execute automated workflows, synchronize data, and orchestrate Aivoov actions directly within Alti.",
    "image": "/assets/apps-logos/aivoov.svg",
    "app_name": "aivoov",
    "isAvailable": true
  },
  {
    "title": "Alchemy",
    "description": "Integrate Alchemy to seamlessly execute automated workflows, synchronize data, and orchestrate Alchemy actions directly within Alti.",
    "image": "/assets/apps-logos/alchemy.svg",
    "app_name": "alchemy",
    "isAvailable": true
  },
  {
    "title": "Algodocs",
    "description": "Integrate Algodocs to seamlessly execute automated workflows, synchronize data, and orchestrate Algodocs actions directly within Alti.",
    "image": "/assets/apps-logos/algodocs.svg",
    "app_name": "algodocs",
    "isAvailable": true
  },
  {
    "title": "Algolia",
    "description": "Integrate Algolia to seamlessly execute automated workflows, synchronize data, and orchestrate Algolia actions directly within Alti.",
    "image": "/assets/apps-logos/algolia.svg",
    "app_name": "algolia",
    "isAvailable": true
  },
  {
    "title": "All Images AI",
    "description": "Integrate All Images AI to seamlessly execute automated workflows, synchronize data, and orchestrate All Images AI actions directly within Alti.",
    "image": "/assets/apps-logos/all_images_ai.svg",
    "app_name": "all_images_ai",
    "isAvailable": true
  },
  {
    "title": "Alpha Vantage",
    "description": "Integrate Alpha Vantage to seamlessly execute automated workflows, synchronize data, and orchestrate Alpha Vantage actions directly within Alti.",
    "image": "/assets/apps-logos/alpha_vantage.svg",
    "app_name": "alpha_vantage",
    "isAvailable": true
  },
  {
    "title": "Altoviz",
    "description": "Integrate Altoviz to seamlessly execute automated workflows, synchronize data, and orchestrate Altoviz actions directly within Alti.",
    "image": "/assets/apps-logos/altoviz.svg",
    "app_name": "altoviz",
    "isAvailable": true
  },
  {
    "title": "Alttext AI",
    "description": "Integrate Alttext AI to seamlessly execute automated workflows, synchronize data, and orchestrate Alttext AI actions directly within Alti.",
    "image": "/assets/apps-logos/alttext_ai.svg",
    "app_name": "alttext_ai",
    "isAvailable": true
  },
  {
    "title": "Amara",
    "description": "Integrate Amara to seamlessly execute automated workflows, synchronize data, and orchestrate Amara actions directly within Alti.",
    "image": "/assets/apps-logos/amara.svg",
    "app_name": "amara",
    "isAvailable": true
  },
  {
    "title": "Amazon",
    "description": "Integrate Amazon to seamlessly execute automated workflows, synchronize data, and orchestrate Amazon actions directly within Alti.",
    "image": "/assets/apps-logos/amazon.svg",
    "app_name": "amazon",
    "isAvailable": true
  },
  {
    "title": "Ambee",
    "description": "Integrate Ambee to seamlessly execute automated workflows, synchronize data, and orchestrate Ambee actions directly within Alti.",
    "image": "/assets/apps-logos/ambee.svg",
    "app_name": "ambee",
    "isAvailable": true
  },
  {
    "title": "Ambient Weather",
    "description": "Integrate Ambient Weather to seamlessly execute automated workflows, synchronize data, and orchestrate Ambient Weather actions directly within Alti.",
    "image": "/assets/apps-logos/ambient_weather.svg",
    "app_name": "ambient_weather",
    "isAvailable": true
  },
  {
    "title": "Anchor Browser",
    "description": "Integrate Anchor Browser to seamlessly execute automated workflows, synchronize data, and orchestrate Anchor Browser actions directly within Alti.",
    "image": "/assets/apps-logos/anchor_browser.svg",
    "app_name": "anchor_browser",
    "isAvailable": true
  },
  {
    "title": "Anonyflow",
    "description": "Integrate Anonyflow to seamlessly execute automated workflows, synchronize data, and orchestrate Anonyflow actions directly within Alti.",
    "image": "/assets/apps-logos/anonyflow.svg",
    "app_name": "anonyflow",
    "isAvailable": true
  },
  {
    "title": "Anthropic Administrator",
    "description": "Integrate Anthropic Administrator to seamlessly execute automated workflows, synchronize data, and orchestrate Anthropic Administrator actions directly within Alti.",
    "image": "/assets/apps-logos/anthropic_administrator.svg",
    "app_name": "anthropic_administrator",
    "isAvailable": true
  },
  {
    "title": "Apex27",
    "description": "Integrate Apex27 to seamlessly execute automated workflows, synchronize data, and orchestrate Apex27 actions directly within Alti.",
    "image": "/assets/apps-logos/apex27.svg",
    "app_name": "apex27",
    "isAvailable": true
  },
  {
    "title": "API Bible",
    "description": "Integrate API Bible to seamlessly execute automated workflows, synchronize data, and orchestrate API Bible actions directly within Alti.",
    "image": "/assets/apps-logos/api_bible.svg",
    "app_name": "api_bible",
    "isAvailable": true
  },
  {
    "title": "API Labz",
    "description": "Integrate API Labz to seamlessly execute automated workflows, synchronize data, and orchestrate API Labz actions directly within Alti.",
    "image": "/assets/apps-logos/api_labz.svg",
    "app_name": "api_labz",
    "isAvailable": true
  },
  {
    "title": "API Ninjas",
    "description": "Integrate API Ninjas to seamlessly execute automated workflows, synchronize data, and orchestrate API Ninjas actions directly within Alti.",
    "image": "/assets/apps-logos/api_ninjas.svg",
    "app_name": "api_ninjas",
    "isAvailable": true
  },
  {
    "title": "API Sports",
    "description": "Integrate API Sports to seamlessly execute automated workflows, synchronize data, and orchestrate API Sports actions directly within Alti.",
    "image": "/assets/apps-logos/api_sports.svg",
    "app_name": "api_sports",
    "isAvailable": true
  },
  {
    "title": "Api2pdf",
    "description": "Integrate Api2pdf to seamlessly execute automated workflows, synchronize data, and orchestrate Api2pdf actions directly within Alti.",
    "image": "/assets/apps-logos/api2pdf.svg",
    "app_name": "api2pdf",
    "isAvailable": true
  },
  {
    "title": "Apiflash",
    "description": "Integrate Apiflash to seamlessly execute automated workflows, synchronize data, and orchestrate Apiflash actions directly within Alti.",
    "image": "/assets/apps-logos/apiflash.svg",
    "app_name": "apiflash",
    "isAvailable": true
  },
  {
    "title": "Apify",
    "description": "Integrate Apify to seamlessly execute automated workflows, synchronize data, and orchestrate Apify actions directly within Alti.",
    "image": "/assets/apps-logos/apify.svg",
    "app_name": "apify",
    "isAvailable": true
  },
  {
    "title": "Apilio",
    "description": "Integrate Apilio to seamlessly execute automated workflows, synchronize data, and orchestrate Apilio actions directly within Alti.",
    "image": "/assets/apps-logos/apilio.svg",
    "app_name": "apilio",
    "isAvailable": true
  },
  {
    "title": "Apipie AI",
    "description": "Integrate Apipie AI to seamlessly execute automated workflows, synchronize data, and orchestrate Apipie AI actions directly within Alti.",
    "image": "/assets/apps-logos/apipie_ai.svg",
    "app_name": "apipie_ai",
    "isAvailable": true
  },
  {
    "title": "Apitemplate Io",
    "description": "Integrate Apitemplate Io to seamlessly execute automated workflows, synchronize data, and orchestrate Apitemplate Io actions directly within Alti.",
    "image": "/assets/apps-logos/apitemplate_io.svg",
    "app_name": "apitemplate_io",
    "isAvailable": true
  },
  {
    "title": "Apiverve",
    "description": "Integrate Apiverve to seamlessly execute automated workflows, synchronize data, and orchestrate Apiverve actions directly within Alti.",
    "image": "/assets/apps-logos/apiverve.svg",
    "app_name": "apiverve",
    "isAvailable": true
  },
  {
    "title": "Appcircle",
    "description": "Integrate Appcircle to seamlessly execute automated workflows, synchronize data, and orchestrate Appcircle actions directly within Alti.",
    "image": "/assets/apps-logos/appcircle.svg",
    "app_name": "appcircle",
    "isAvailable": true
  },
  {
    "title": "Appdrag",
    "description": "Integrate Appdrag to seamlessly execute automated workflows, synchronize data, and orchestrate Appdrag actions directly within Alti.",
    "image": "/assets/apps-logos/appdrag.svg",
    "app_name": "appdrag",
    "isAvailable": true
  },
  {
    "title": "Appointo",
    "description": "Integrate Appointo to seamlessly execute automated workflows, synchronize data, and orchestrate Appointo actions directly within Alti.",
    "image": "/assets/apps-logos/appointo.svg",
    "app_name": "appointo",
    "isAvailable": true
  },
  {
    "title": "Appsflyer",
    "description": "Integrate Appsflyer to seamlessly execute automated workflows, synchronize data, and orchestrate Appsflyer actions directly within Alti.",
    "image": "/assets/apps-logos/appsflyer.svg",
    "app_name": "appsflyer",
    "isAvailable": true
  },
  {
    "title": "Appveyor",
    "description": "Integrate Appveyor to seamlessly execute automated workflows, synchronize data, and orchestrate Appveyor actions directly within Alti.",
    "image": "/assets/apps-logos/appveyor.svg",
    "app_name": "appveyor",
    "isAvailable": true
  },
  {
    "title": "Aryn",
    "description": "Integrate Aryn to seamlessly execute automated workflows, synchronize data, and orchestrate Aryn actions directly within Alti.",
    "image": "/assets/apps-logos/aryn.svg",
    "app_name": "aryn",
    "isAvailable": true
  },
  {
    "title": "Ascora",
    "description": "Integrate Ascora to seamlessly execute automated workflows, synchronize data, and orchestrate Ascora actions directly within Alti.",
    "image": "/assets/apps-logos/ascora.svg",
    "app_name": "ascora",
    "isAvailable": true
  },
  {
    "title": "Ashby",
    "description": "Integrate Ashby to seamlessly execute automated workflows, synchronize data, and orchestrate Ashby actions directly within Alti.",
    "image": "/assets/apps-logos/ashby.svg",
    "app_name": "ashby",
    "isAvailable": true
  },
  {
    "title": "Astica AI",
    "description": "Integrate Astica AI to seamlessly execute automated workflows, synchronize data, and orchestrate Astica AI actions directly within Alti.",
    "image": "/assets/apps-logos/astica_ai.svg",
    "app_name": "astica_ai",
    "isAvailable": true
  },
  {
    "title": "Async Interview",
    "description": "Integrate Async Interview to seamlessly execute automated workflows, synchronize data, and orchestrate Async Interview actions directly within Alti.",
    "image": "/assets/apps-logos/async_interview.svg",
    "app_name": "async_interview",
    "isAvailable": true
  },
  {
    "title": "Atlassian",
    "description": "Integrate Atlassian to seamlessly execute automated workflows, synchronize data, and orchestrate Atlassian actions directly within Alti.",
    "image": "/assets/apps-logos/atlassian.svg",
    "app_name": "atlassian",
    "isAvailable": true
  },
  {
    "title": "Auth0",
    "description": "Integrate Auth0 to seamlessly execute automated workflows, synchronize data, and orchestrate Auth0 actions directly within Alti.",
    "image": "/assets/apps-logos/auth0.svg",
    "app_name": "auth0",
    "isAvailable": true
  },
  {
    "title": "Autobound",
    "description": "Integrate Autobound to seamlessly execute automated workflows, synchronize data, and orchestrate Autobound actions directly within Alti.",
    "image": "/assets/apps-logos/autobound.svg",
    "app_name": "autobound",
    "isAvailable": true
  },
  {
    "title": "Autom",
    "description": "Integrate Autom to seamlessly execute automated workflows, synchronize data, and orchestrate Autom actions directly within Alti.",
    "image": "/assets/apps-logos/autom.svg",
    "app_name": "autom",
    "isAvailable": true
  },
  {
    "title": "Axonaut",
    "description": "Integrate Axonaut to seamlessly execute automated workflows, synchronize data, and orchestrate Axonaut actions directly within Alti.",
    "image": "/assets/apps-logos/axonaut.svg",
    "app_name": "axonaut",
    "isAvailable": true
  },
  {
    "title": "Ayrshare",
    "description": "Integrate Ayrshare to seamlessly execute automated workflows, synchronize data, and orchestrate Ayrshare actions directly within Alti.",
    "image": "/assets/apps-logos/ayrshare.svg",
    "app_name": "ayrshare",
    "isAvailable": true
  },
  {
    "title": "Backendless",
    "description": "Integrate Backendless to seamlessly execute automated workflows, synchronize data, and orchestrate Backendless actions directly within Alti.",
    "image": "/assets/apps-logos/backendless.svg",
    "app_name": "backendless",
    "isAvailable": true
  },
  {
    "title": "Bamboohr",
    "description": "Integrate Bamboohr to seamlessly execute automated workflows, synchronize data, and orchestrate Bamboohr actions directly within Alti.",
    "image": "/assets/apps-logos/bamboohr.svg",
    "app_name": "bamboohr",
    "isAvailable": true
  },
  {
    "title": "Bart",
    "description": "Integrate Bart to seamlessly execute automated workflows, synchronize data, and orchestrate Bart actions directly within Alti.",
    "image": "/assets/apps-logos/bart.svg",
    "app_name": "bart",
    "isAvailable": true
  },
  {
    "title": "Basin",
    "description": "Integrate Basin to seamlessly execute automated workflows, synchronize data, and orchestrate Basin actions directly within Alti.",
    "image": "/assets/apps-logos/basin.svg",
    "app_name": "basin",
    "isAvailable": true
  },
  {
    "title": "Battlenet",
    "description": "Integrate Battlenet to seamlessly execute automated workflows, synchronize data, and orchestrate Battlenet actions directly within Alti.",
    "image": "/assets/apps-logos/battlenet.svg",
    "app_name": "battlenet",
    "isAvailable": true
  },
  {
    "title": "Beaconchain",
    "description": "Integrate Beaconchain to seamlessly execute automated workflows, synchronize data, and orchestrate Beaconchain actions directly within Alti.",
    "image": "/assets/apps-logos/beaconchain.svg",
    "app_name": "beaconchain",
    "isAvailable": true
  },
  {
    "title": "Beaconstac",
    "description": "Integrate Beaconstac to seamlessly execute automated workflows, synchronize data, and orchestrate Beaconstac actions directly within Alti.",
    "image": "/assets/apps-logos/beaconstac.svg",
    "app_name": "beaconstac",
    "isAvailable": true
  },
  {
    "title": "Beamer",
    "description": "Integrate Beamer to seamlessly execute automated workflows, synchronize data, and orchestrate Beamer actions directly within Alti.",
    "image": "/assets/apps-logos/beamer.svg",
    "app_name": "beamer",
    "isAvailable": true
  },
  {
    "title": "Beeminder",
    "description": "Integrate Beeminder to seamlessly execute automated workflows, synchronize data, and orchestrate Beeminder actions directly within Alti.",
    "image": "/assets/apps-logos/beeminder.svg",
    "app_name": "beeminder",
    "isAvailable": true
  },
  {
    "title": "Bench",
    "description": "Integrate Bench to seamlessly execute automated workflows, synchronize data, and orchestrate Bench actions directly within Alti.",
    "image": "/assets/apps-logos/bench.svg",
    "app_name": "bench",
    "isAvailable": true
  },
  {
    "title": "Benchmark Email",
    "description": "Integrate Benchmark Email to seamlessly execute automated workflows, synchronize data, and orchestrate Benchmark Email actions directly within Alti.",
    "image": "/assets/apps-logos/benchmark_email.svg",
    "app_name": "benchmark_email",
    "isAvailable": true
  },
  {
    "title": "Benzinga",
    "description": "Integrate Benzinga to seamlessly execute automated workflows, synchronize data, and orchestrate Benzinga actions directly within Alti.",
    "image": "/assets/apps-logos/benzinga.svg",
    "app_name": "benzinga",
    "isAvailable": true
  },
  {
    "title": "Bestbuy",
    "description": "Integrate Bestbuy to seamlessly execute automated workflows, synchronize data, and orchestrate Bestbuy actions directly within Alti.",
    "image": "/assets/apps-logos/bestbuy.svg",
    "app_name": "bestbuy",
    "isAvailable": true
  },
  {
    "title": "Better Proposals",
    "description": "Integrate Better Proposals to seamlessly execute automated workflows, synchronize data, and orchestrate Better Proposals actions directly within Alti.",
    "image": "/assets/apps-logos/better_proposals.svg",
    "app_name": "better_proposals",
    "isAvailable": true
  },
  {
    "title": "Better Stack",
    "description": "Integrate Better Stack to seamlessly execute automated workflows, synchronize data, and orchestrate Better Stack actions directly within Alti.",
    "image": "/assets/apps-logos/better_stack.svg",
    "app_name": "better_stack",
    "isAvailable": true
  },
  {
    "title": "Bidsketch",
    "description": "Integrate Bidsketch to seamlessly execute automated workflows, synchronize data, and orchestrate Bidsketch actions directly within Alti.",
    "image": "/assets/apps-logos/bidsketch.svg",
    "app_name": "bidsketch",
    "isAvailable": true
  },
  {
    "title": "Big Data Cloud",
    "description": "Integrate Big Data Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Big Data Cloud actions directly within Alti.",
    "image": "/assets/apps-logos/big_data_cloud.svg",
    "app_name": "big_data_cloud",
    "isAvailable": true
  },
  {
    "title": "Bigmailer",
    "description": "Integrate Bigmailer to seamlessly execute automated workflows, synchronize data, and orchestrate Bigmailer actions directly within Alti.",
    "image": "/assets/apps-logos/bigmailer.svg",
    "app_name": "bigmailer",
    "isAvailable": true
  },
  {
    "title": "Bigml",
    "description": "Integrate Bigml to seamlessly execute automated workflows, synchronize data, and orchestrate Bigml actions directly within Alti.",
    "image": "/assets/apps-logos/bigml.svg",
    "app_name": "bigml",
    "isAvailable": true
  },
  {
    "title": "Bigpicture Io",
    "description": "Integrate Bigpicture Io to seamlessly execute automated workflows, synchronize data, and orchestrate Bigpicture Io actions directly within Alti.",
    "image": "/assets/apps-logos/bigpicture_io.svg",
    "app_name": "bigpicture_io",
    "isAvailable": true
  },
  {
    "title": "Bill",
    "description": "Integrate Bill to seamlessly execute automated workflows, synchronize data, and orchestrate Bill actions directly within Alti.",
    "image": "/assets/apps-logos/bill.svg",
    "app_name": "bill",
    "isAvailable": true
  },
  {
    "title": "Bitquery",
    "description": "Integrate Bitquery to seamlessly execute automated workflows, synchronize data, and orchestrate Bitquery actions directly within Alti.",
    "image": "/assets/apps-logos/bitquery.svg",
    "app_name": "bitquery",
    "isAvailable": true
  },
  {
    "title": "Bitwarden",
    "description": "Integrate Bitwarden to seamlessly execute automated workflows, synchronize data, and orchestrate Bitwarden actions directly within Alti.",
    "image": "/assets/apps-logos/bitwarden.svg",
    "app_name": "bitwarden",
    "isAvailable": true
  },
  {
    "title": "Blackbaud",
    "description": "Integrate Blackbaud to seamlessly execute automated workflows, synchronize data, and orchestrate Blackbaud actions directly within Alti.",
    "image": "/assets/apps-logos/blackbaud.svg",
    "app_name": "blackbaud",
    "isAvailable": true
  },
  {
    "title": "Blackboard",
    "description": "Integrate Blackboard to seamlessly execute automated workflows, synchronize data, and orchestrate Blackboard actions directly within Alti.",
    "image": "/assets/apps-logos/blackboard.svg",
    "app_name": "blackboard",
    "isAvailable": true
  },
  {
    "title": "Blazemeter",
    "description": "Integrate Blazemeter to seamlessly execute automated workflows, synchronize data, and orchestrate Blazemeter actions directly within Alti.",
    "image": "/assets/apps-logos/blazemeter.svg",
    "app_name": "blazemeter",
    "isAvailable": true
  },
  {
    "title": "Blocknative",
    "description": "Integrate Blocknative to seamlessly execute automated workflows, synchronize data, and orchestrate Blocknative actions directly within Alti.",
    "image": "/assets/apps-logos/blocknative.svg",
    "app_name": "blocknative",
    "isAvailable": true
  },
  {
    "title": "Boldsign",
    "description": "Integrate Boldsign to seamlessly execute automated workflows, synchronize data, and orchestrate Boldsign actions directly within Alti.",
    "image": "/assets/apps-logos/boldsign.svg",
    "app_name": "boldsign",
    "isAvailable": true
  },
  {
    "title": "Boloforms",
    "description": "Integrate Boloforms to seamlessly execute automated workflows, synchronize data, and orchestrate Boloforms actions directly within Alti.",
    "image": "/assets/apps-logos/boloforms.svg",
    "app_name": "boloforms",
    "isAvailable": true
  },
  {
    "title": "Bolt IoT",
    "description": "Integrate Bolt IoT to seamlessly execute automated workflows, synchronize data, and orchestrate Bolt IoT actions directly within Alti.",
    "image": "/assets/apps-logos/bolt_iot.svg",
    "app_name": "bolt_iot",
    "isAvailable": true
  },
  {
    "title": "Bonsai",
    "description": "Integrate Bonsai to seamlessly execute automated workflows, synchronize data, and orchestrate Bonsai actions directly within Alti.",
    "image": "/assets/apps-logos/bonsai.svg",
    "app_name": "bonsai",
    "isAvailable": true
  },
  {
    "title": "Bookingmood",
    "description": "Integrate Bookingmood to seamlessly execute automated workflows, synchronize data, and orchestrate Bookingmood actions directly within Alti.",
    "image": "/assets/apps-logos/bookingmood.svg",
    "app_name": "bookingmood",
    "isAvailable": true
  },
  {
    "title": "Booqable",
    "description": "Integrate Booqable to seamlessly execute automated workflows, synchronize data, and orchestrate Booqable actions directly within Alti.",
    "image": "/assets/apps-logos/booqable.svg",
    "app_name": "booqable",
    "isAvailable": true
  },
  {
    "title": "Botbaba",
    "description": "Integrate Botbaba to seamlessly execute automated workflows, synchronize data, and orchestrate Botbaba actions directly within Alti.",
    "image": "/assets/apps-logos/botbaba.svg",
    "app_name": "botbaba",
    "isAvailable": true
  },
  {
    "title": "Botpress",
    "description": "Integrate Botpress to seamlessly execute automated workflows, synchronize data, and orchestrate Botpress actions directly within Alti.",
    "image": "/assets/apps-logos/botpress.svg",
    "app_name": "botpress",
    "isAvailable": true
  },
  {
    "title": "Botsonic",
    "description": "Integrate Botsonic to seamlessly execute automated workflows, synchronize data, and orchestrate Botsonic actions directly within Alti.",
    "image": "/assets/apps-logos/botsonic.svg",
    "app_name": "botsonic",
    "isAvailable": true
  },
  {
    "title": "Botstar",
    "description": "Integrate Botstar to seamlessly execute automated workflows, synchronize data, and orchestrate Botstar actions directly within Alti.",
    "image": "/assets/apps-logos/botstar.svg",
    "app_name": "botstar",
    "isAvailable": true
  },
  {
    "title": "Bouncer",
    "description": "Integrate Bouncer to seamlessly execute automated workflows, synchronize data, and orchestrate Bouncer actions directly within Alti.",
    "image": "/assets/apps-logos/bouncer.svg",
    "app_name": "bouncer",
    "isAvailable": true
  },
  {
    "title": "Box",
    "description": "Integrate Box to seamlessly execute automated workflows, synchronize data, and orchestrate Box actions directly within Alti.",
    "image": "/assets/apps-logos/box.svg",
    "app_name": "box",
    "isAvailable": true
  },
  {
    "title": "Boxhero",
    "description": "Integrate Boxhero to seamlessly execute automated workflows, synchronize data, and orchestrate Boxhero actions directly within Alti.",
    "image": "/assets/apps-logos/boxhero.svg",
    "app_name": "boxhero",
    "isAvailable": true
  },
  {
    "title": "Braintree",
    "description": "Integrate Braintree to seamlessly execute automated workflows, synchronize data, and orchestrate Braintree actions directly within Alti.",
    "image": "/assets/apps-logos/braintree.svg",
    "app_name": "braintree",
    "isAvailable": true
  },
  {
    "title": "Breeze",
    "description": "Integrate Breeze to seamlessly execute automated workflows, synchronize data, and orchestrate Breeze actions directly within Alti.",
    "image": "/assets/apps-logos/breeze.svg",
    "app_name": "breeze",
    "isAvailable": true
  },
  {
    "title": "Breezy HR",
    "description": "Integrate Breezy HR to seamlessly execute automated workflows, synchronize data, and orchestrate Breezy HR actions directly within Alti.",
    "image": "/assets/apps-logos/breezy_hr.svg",
    "app_name": "breezy_hr",
    "isAvailable": true
  },
  {
    "title": "Brevo",
    "description": "Integrate Brevo to seamlessly execute automated workflows, synchronize data, and orchestrate Brevo actions directly within Alti.",
    "image": "/assets/apps-logos/brevo.svg",
    "app_name": "brevo",
    "isAvailable": true
  },
  {
    "title": "Brex Staging",
    "description": "Integrate Brex Staging to seamlessly execute automated workflows, synchronize data, and orchestrate Brex Staging actions directly within Alti.",
    "image": "/assets/apps-logos/brex_staging.svg",
    "app_name": "brex_staging",
    "isAvailable": true
  },
  {
    "title": "Brightdata",
    "description": "Integrate Brightdata to seamlessly execute automated workflows, synchronize data, and orchestrate Brightdata actions directly within Alti.",
    "image": "/assets/apps-logos/brightdata.svg",
    "app_name": "brightdata",
    "isAvailable": true
  },
  {
    "title": "Brightpearl",
    "description": "Integrate Brightpearl to seamlessly execute automated workflows, synchronize data, and orchestrate Brightpearl actions directly within Alti.",
    "image": "/assets/apps-logos/brightpearl.svg",
    "app_name": "brightpearl",
    "isAvailable": true
  },
  {
    "title": "Brilliant Directories",
    "description": "Integrate Brilliant Directories to seamlessly execute automated workflows, synchronize data, and orchestrate Brilliant Directories actions directly within Alti.",
    "image": "/assets/apps-logos/brilliant_directories.svg",
    "app_name": "brilliant_directories",
    "isAvailable": true
  },
  {
    "title": "Browser Tool",
    "description": "Integrate Browser Tool to seamlessly execute automated workflows, synchronize data, and orchestrate Browser Tool actions directly within Alti.",
    "image": "/assets/apps-logos/browser_tool.svg",
    "app_name": "browser_tool",
    "isAvailable": true
  },
  {
    "title": "Browserbase Tool",
    "description": "Integrate Browserbase Tool to seamlessly execute automated workflows, synchronize data, and orchestrate Browserbase Tool actions directly within Alti.",
    "image": "/assets/apps-logos/browserbase_tool.svg",
    "app_name": "browserbase_tool",
    "isAvailable": true
  },
  {
    "title": "Browserhub",
    "description": "Integrate Browserhub to seamlessly execute automated workflows, synchronize data, and orchestrate Browserhub actions directly within Alti.",
    "image": "/assets/apps-logos/browserhub.svg",
    "app_name": "browserhub",
    "isAvailable": true
  },
  {
    "title": "Browserless",
    "description": "Integrate Browserless to seamlessly execute automated workflows, synchronize data, and orchestrate Browserless actions directly within Alti.",
    "image": "/assets/apps-logos/browserless.svg",
    "app_name": "browserless",
    "isAvailable": true
  },
  {
    "title": "Btcpay Server",
    "description": "Integrate Btcpay Server to seamlessly execute automated workflows, synchronize data, and orchestrate Btcpay Server actions directly within Alti.",
    "image": "/assets/apps-logos/btcpay_server.svg",
    "app_name": "btcpay_server",
    "isAvailable": true
  },
  {
    "title": "Bubble",
    "description": "Integrate Bubble to seamlessly execute automated workflows, synchronize data, and orchestrate Bubble actions directly within Alti.",
    "image": "/assets/apps-logos/bubble.svg",
    "app_name": "bubble",
    "isAvailable": true
  },
  {
    "title": "Bugbug",
    "description": "Integrate Bugbug to seamlessly execute automated workflows, synchronize data, and orchestrate Bugbug actions directly within Alti.",
    "image": "/assets/apps-logos/bugbug.svg",
    "app_name": "bugbug",
    "isAvailable": true
  },
  {
    "title": "Bugherd",
    "description": "Integrate Bugherd to seamlessly execute automated workflows, synchronize data, and orchestrate Bugherd actions directly within Alti.",
    "image": "/assets/apps-logos/bugherd.svg",
    "app_name": "bugherd",
    "isAvailable": true
  },
  {
    "title": "Bugsnag",
    "description": "Integrate Bugsnag to seamlessly execute automated workflows, synchronize data, and orchestrate Bugsnag actions directly within Alti.",
    "image": "/assets/apps-logos/bugsnag.svg",
    "app_name": "bugsnag",
    "isAvailable": true
  },
  {
    "title": "Buildkite",
    "description": "Integrate Buildkite to seamlessly execute automated workflows, synchronize data, and orchestrate Buildkite actions directly within Alti.",
    "image": "/assets/apps-logos/buildkite.svg",
    "app_name": "buildkite",
    "isAvailable": true
  },
  {
    "title": "Builtwith",
    "description": "Integrate Builtwith to seamlessly execute automated workflows, synchronize data, and orchestrate Builtwith actions directly within Alti.",
    "image": "/assets/apps-logos/builtwith.svg",
    "app_name": "builtwith",
    "isAvailable": true
  },
  {
    "title": "Bunnycdn",
    "description": "Integrate Bunnycdn to seamlessly execute automated workflows, synchronize data, and orchestrate Bunnycdn actions directly within Alti.",
    "image": "/assets/apps-logos/bunnycdn.svg",
    "app_name": "bunnycdn",
    "isAvailable": true
  },
  {
    "title": "Byteforms",
    "description": "Integrate Byteforms to seamlessly execute automated workflows, synchronize data, and orchestrate Byteforms actions directly within Alti.",
    "image": "/assets/apps-logos/byteforms.svg",
    "app_name": "byteforms",
    "isAvailable": true
  },
  {
    "title": "Cabinpanda",
    "description": "Integrate Cabinpanda to seamlessly execute automated workflows, synchronize data, and orchestrate Cabinpanda actions directly within Alti.",
    "image": "/assets/apps-logos/cabinpanda.svg",
    "app_name": "cabinpanda",
    "isAvailable": true
  },
  {
    "title": "Callerapi",
    "description": "Integrate Callerapi to seamlessly execute automated workflows, synchronize data, and orchestrate Callerapi actions directly within Alti.",
    "image": "/assets/apps-logos/callerapi.svg",
    "app_name": "callerapi",
    "isAvailable": true
  },
  {
    "title": "Callingly",
    "description": "Integrate Callingly to seamlessly execute automated workflows, synchronize data, and orchestrate Callingly actions directly within Alti.",
    "image": "/assets/apps-logos/callingly.svg",
    "app_name": "callingly",
    "isAvailable": true
  },
  {
    "title": "Callpage",
    "description": "Integrate Callpage to seamlessly execute automated workflows, synchronize data, and orchestrate Callpage actions directly within Alti.",
    "image": "/assets/apps-logos/callpage.svg",
    "app_name": "callpage",
    "isAvailable": true
  },
  {
    "title": "Campaign Cleaner",
    "description": "Integrate Campaign Cleaner to seamlessly execute automated workflows, synchronize data, and orchestrate Campaign Cleaner actions directly within Alti.",
    "image": "/assets/apps-logos/campaign_cleaner.svg",
    "app_name": "campaign_cleaner",
    "isAvailable": true
  },
  {
    "title": "Campayn",
    "description": "Integrate Campayn to seamlessly execute automated workflows, synchronize data, and orchestrate Campayn actions directly within Alti.",
    "image": "/assets/apps-logos/campayn.svg",
    "app_name": "campayn",
    "isAvailable": true
  },
  {
    "title": "Canny",
    "description": "Integrate Canny to seamlessly execute automated workflows, synchronize data, and orchestrate Canny actions directly within Alti.",
    "image": "/assets/apps-logos/canny.svg",
    "app_name": "canny",
    "isAvailable": true
  },
  {
    "title": "Carbone",
    "description": "Integrate Carbone to seamlessly execute automated workflows, synchronize data, and orchestrate Carbone actions directly within Alti.",
    "image": "/assets/apps-logos/carbone.svg",
    "app_name": "carbone",
    "isAvailable": true
  },
  {
    "title": "Cardly",
    "description": "Integrate Cardly to seamlessly execute automated workflows, synchronize data, and orchestrate Cardly actions directly within Alti.",
    "image": "/assets/apps-logos/cardly.svg",
    "app_name": "cardly",
    "isAvailable": true
  },
  {
    "title": "Castingwords",
    "description": "Integrate Castingwords to seamlessly execute automated workflows, synchronize data, and orchestrate Castingwords actions directly within Alti.",
    "image": "/assets/apps-logos/castingwords.svg",
    "app_name": "castingwords",
    "isAvailable": true
  },
  {
    "title": "Cats",
    "description": "Integrate Cats to seamlessly execute automated workflows, synchronize data, and orchestrate Cats actions directly within Alti.",
    "image": "/assets/apps-logos/cats.svg",
    "app_name": "cats",
    "isAvailable": true
  },
  {
    "title": "Cdr Platform",
    "description": "Integrate Cdr Platform to seamlessly execute automated workflows, synchronize data, and orchestrate Cdr Platform actions directly within Alti.",
    "image": "/assets/apps-logos/cdr_platform.svg",
    "app_name": "cdr_platform",
    "isAvailable": true
  },
  {
    "title": "Census Bureau",
    "description": "Integrate Census Bureau to seamlessly execute automated workflows, synchronize data, and orchestrate Census Bureau actions directly within Alti.",
    "image": "/assets/apps-logos/census_bureau.svg",
    "app_name": "census_bureau",
    "isAvailable": true
  },
  {
    "title": "Centralstationcrm",
    "description": "Integrate Centralstationcrm to seamlessly execute automated workflows, synchronize data, and orchestrate Centralstationcrm actions directly within Alti.",
    "image": "/assets/apps-logos/centralstationcrm.svg",
    "app_name": "centralstationcrm",
    "isAvailable": true
  },
  {
    "title": "Certifier",
    "description": "Integrate Certifier to seamlessly execute automated workflows, synchronize data, and orchestrate Certifier actions directly within Alti.",
    "image": "/assets/apps-logos/certifier.svg",
    "app_name": "certifier",
    "isAvailable": true
  },
  {
    "title": "Chaser",
    "description": "Integrate Chaser to seamlessly execute automated workflows, synchronize data, and orchestrate Chaser actions directly within Alti.",
    "image": "/assets/apps-logos/chaser.svg",
    "app_name": "chaser",
    "isAvailable": true
  },
  {
    "title": "Chatbotkit",
    "description": "Integrate Chatbotkit to seamlessly execute automated workflows, synchronize data, and orchestrate Chatbotkit actions directly within Alti.",
    "image": "/assets/apps-logos/chatbotkit.svg",
    "app_name": "chatbotkit",
    "isAvailable": true
  },
  {
    "title": "Chatfai",
    "description": "Integrate Chatfai to seamlessly execute automated workflows, synchronize data, and orchestrate Chatfai actions directly within Alti.",
    "image": "/assets/apps-logos/chatfai.svg",
    "app_name": "chatfai",
    "isAvailable": true
  },
  {
    "title": "Chmeetings",
    "description": "Integrate Chmeetings to seamlessly execute automated workflows, synchronize data, and orchestrate Chmeetings actions directly within Alti.",
    "image": "/assets/apps-logos/chmeetings.svg",
    "app_name": "chmeetings",
    "isAvailable": true
  },
  {
    "title": "Cincopa",
    "description": "Integrate Cincopa to seamlessly execute automated workflows, synchronize data, and orchestrate Cincopa actions directly within Alti.",
    "image": "/assets/apps-logos/cincopa.svg",
    "app_name": "cincopa",
    "isAvailable": true
  },
  {
    "title": "Circleci",
    "description": "Integrate Circleci to seamlessly execute automated workflows, synchronize data, and orchestrate Circleci actions directly within Alti.",
    "image": "/assets/apps-logos/circleci.svg",
    "app_name": "circleci",
    "isAvailable": true
  },
  {
    "title": "Claid AI",
    "description": "Integrate Claid AI to seamlessly execute automated workflows, synchronize data, and orchestrate Claid AI actions directly within Alti.",
    "image": "/assets/apps-logos/claid_ai.svg",
    "app_name": "claid_ai",
    "isAvailable": true
  },
  {
    "title": "Classmarker",
    "description": "Integrate Classmarker to seamlessly execute automated workflows, synchronize data, and orchestrate Classmarker actions directly within Alti.",
    "image": "/assets/apps-logos/classmarker.svg",
    "app_name": "classmarker",
    "isAvailable": true
  },
  {
    "title": "Clearout",
    "description": "Integrate Clearout to seamlessly execute automated workflows, synchronize data, and orchestrate Clearout actions directly within Alti.",
    "image": "/assets/apps-logos/clearout.svg",
    "app_name": "clearout",
    "isAvailable": true
  },
  {
    "title": "Clickhouse",
    "description": "Integrate Clickhouse to seamlessly execute automated workflows, synchronize data, and orchestrate Clickhouse actions directly within Alti.",
    "image": "/assets/apps-logos/clickhouse.svg",
    "app_name": "clickhouse",
    "isAvailable": true
  },
  {
    "title": "Clickmeeting",
    "description": "Integrate Clickmeeting to seamlessly execute automated workflows, synchronize data, and orchestrate Clickmeeting actions directly within Alti.",
    "image": "/assets/apps-logos/clickmeeting.svg",
    "app_name": "clickmeeting",
    "isAvailable": true
  },
  {
    "title": "Clockify",
    "description": "Integrate Clockify to seamlessly execute automated workflows, synchronize data, and orchestrate Clockify actions directly within Alti.",
    "image": "/assets/apps-logos/clockify.svg",
    "app_name": "clockify",
    "isAvailable": true
  },
  {
    "title": "Cloudconvert",
    "description": "Integrate Cloudconvert to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudconvert actions directly within Alti.",
    "image": "/assets/apps-logos/cloudconvert.svg",
    "app_name": "cloudconvert",
    "isAvailable": true
  },
  {
    "title": "Cloudflare",
    "description": "Integrate Cloudflare to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudflare actions directly within Alti.",
    "image": "/assets/apps-logos/cloudflare.svg",
    "app_name": "cloudflare",
    "isAvailable": true
  },
  {
    "title": "Cloudflare API Key",
    "description": "Integrate Cloudflare API Key to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudflare API Key actions directly within Alti.",
    "image": "/assets/apps-logos/cloudflare_api_key.svg",
    "app_name": "cloudflare_api_key",
    "isAvailable": true
  },
  {
    "title": "Cloudflare Browser Rendering",
    "description": "Integrate Cloudflare Browser Rendering to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudflare Browser Rendering actions directly within Alti.",
    "image": "/assets/apps-logos/cloudflare_browser_rendering.svg",
    "app_name": "cloudflare_browser_rendering",
    "isAvailable": true
  },
  {
    "title": "Cloudinary",
    "description": "Integrate Cloudinary to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudinary actions directly within Alti.",
    "image": "/assets/apps-logos/cloudinary.svg",
    "app_name": "cloudinary",
    "isAvailable": true
  },
  {
    "title": "Cloudlayer",
    "description": "Integrate Cloudlayer to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudlayer actions directly within Alti.",
    "image": "/assets/apps-logos/cloudlayer.svg",
    "app_name": "cloudlayer",
    "isAvailable": true
  },
  {
    "title": "Cloudpress",
    "description": "Integrate Cloudpress to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudpress actions directly within Alti.",
    "image": "/assets/apps-logos/cloudpress.svg",
    "app_name": "cloudpress",
    "isAvailable": true
  },
  {
    "title": "Coassemble",
    "description": "Integrate Coassemble to seamlessly execute automated workflows, synchronize data, and orchestrate Coassemble actions directly within Alti.",
    "image": "/assets/apps-logos/coassemble.svg",
    "app_name": "coassemble",
    "isAvailable": true
  },
  {
    "title": "Codacy",
    "description": "Integrate Codacy to seamlessly execute automated workflows, synchronize data, and orchestrate Codacy actions directly within Alti.",
    "image": "/assets/apps-logos/codacy.svg",
    "app_name": "codacy",
    "isAvailable": true
  },
  {
    "title": "Codeinterpreter",
    "description": "Integrate Codeinterpreter to seamlessly execute automated workflows, synchronize data, and orchestrate Codeinterpreter actions directly within Alti.",
    "image": "/assets/apps-logos/codeinterpreter.svg",
    "app_name": "codeinterpreter",
    "isAvailable": true
  },
  {
    "title": "Codereadr",
    "description": "Integrate Codereadr to seamlessly execute automated workflows, synchronize data, and orchestrate Codereadr actions directly within Alti.",
    "image": "/assets/apps-logos/codereadr.svg",
    "app_name": "codereadr",
    "isAvailable": true
  },
  {
    "title": "Coinmarketcal",
    "description": "Integrate Coinmarketcal to seamlessly execute automated workflows, synchronize data, and orchestrate Coinmarketcal actions directly within Alti.",
    "image": "/assets/apps-logos/coinmarketcal.svg",
    "app_name": "coinmarketcal",
    "isAvailable": true
  },
  {
    "title": "Coinmarketcap",
    "description": "Integrate Coinmarketcap to seamlessly execute automated workflows, synchronize data, and orchestrate Coinmarketcap actions directly within Alti.",
    "image": "/assets/apps-logos/coinmarketcap.svg",
    "app_name": "coinmarketcap",
    "isAvailable": true
  },
  {
    "title": "College Football Data",
    "description": "Integrate College Football Data to seamlessly execute automated workflows, synchronize data, and orchestrate College Football Data actions directly within Alti.",
    "image": "/assets/apps-logos/college_football_data.svg",
    "app_name": "college_football_data",
    "isAvailable": true
  },
  {
    "title": "Composio",
    "description": "Integrate Composio to seamlessly execute automated workflows, synchronize data, and orchestrate Composio actions directly within Alti.",
    "image": "/assets/apps-logos/composio.svg",
    "app_name": "composio",
    "isAvailable": true
  },
  {
    "title": "Composio Search",
    "description": "Integrate Composio Search to seamlessly execute automated workflows, synchronize data, and orchestrate Composio Search actions directly within Alti.",
    "image": "/assets/apps-logos/composio_search.svg",
    "app_name": "composio_search",
    "isAvailable": true
  },
  {
    "title": "Confluence",
    "description": "Integrate Confluence to seamlessly execute automated workflows, synchronize data, and orchestrate Confluence actions directly within Alti.",
    "image": "/assets/apps-logos/confluence.svg",
    "app_name": "confluence",
    "isAvailable": true
  },
  {
    "title": "Connecteam",
    "description": "Integrate Connecteam to seamlessly execute automated workflows, synchronize data, and orchestrate Connecteam actions directly within Alti.",
    "image": "/assets/apps-logos/connecteam.svg",
    "app_name": "connecteam",
    "isAvailable": true
  },
  {
    "title": "Contentful Graphql",
    "description": "Integrate Contentful Graphql to seamlessly execute automated workflows, synchronize data, and orchestrate Contentful Graphql actions directly within Alti.",
    "image": "/assets/apps-logos/contentful_graphql.svg",
    "app_name": "contentful_graphql",
    "isAvailable": true
  },
  {
    "title": "Control D",
    "description": "Integrate Control D to seamlessly execute automated workflows, synchronize data, and orchestrate Control D actions directly within Alti.",
    "image": "/assets/apps-logos/control_d.svg",
    "app_name": "control_d",
    "isAvailable": true
  },
  {
    "title": "Conversion Tools",
    "description": "Integrate Conversion Tools to seamlessly execute automated workflows, synchronize data, and orchestrate Conversion Tools actions directly within Alti.",
    "image": "/assets/apps-logos/conversion_tools.svg",
    "app_name": "conversion_tools",
    "isAvailable": true
  },
  {
    "title": "Convertapi",
    "description": "Integrate Convertapi to seamlessly execute automated workflows, synchronize data, and orchestrate Convertapi actions directly within Alti.",
    "image": "/assets/apps-logos/convertapi.svg",
    "app_name": "convertapi",
    "isAvailable": true
  },
  {
    "title": "Conveyor",
    "description": "Integrate Conveyor to seamlessly execute automated workflows, synchronize data, and orchestrate Conveyor actions directly within Alti.",
    "image": "/assets/apps-logos/conveyor.svg",
    "app_name": "conveyor",
    "isAvailable": true
  },
  {
    "title": "Convolo AI",
    "description": "Integrate Convolo AI to seamlessly execute automated workflows, synchronize data, and orchestrate Convolo AI actions directly within Alti.",
    "image": "/assets/apps-logos/convolo_ai.svg",
    "app_name": "convolo_ai",
    "isAvailable": true
  },
  {
    "title": "Corrently",
    "description": "Integrate Corrently to seamlessly execute automated workflows, synchronize data, and orchestrate Corrently actions directly within Alti.",
    "image": "/assets/apps-logos/corrently.svg",
    "app_name": "corrently",
    "isAvailable": true
  },
  {
    "title": "Countdown API",
    "description": "Integrate Countdown API to seamlessly execute automated workflows, synchronize data, and orchestrate Countdown API actions directly within Alti.",
    "image": "/assets/apps-logos/countdown_api.svg",
    "app_name": "countdown_api",
    "isAvailable": true
  },
  {
    "title": "Coupa",
    "description": "Integrate Coupa to seamlessly execute automated workflows, synchronize data, and orchestrate Coupa actions directly within Alti.",
    "image": "/assets/apps-logos/coupa.svg",
    "app_name": "coupa",
    "isAvailable": true
  },
  {
    "title": "Craftmypdf",
    "description": "Integrate Craftmypdf to seamlessly execute automated workflows, synchronize data, and orchestrate Craftmypdf actions directly within Alti.",
    "image": "/assets/apps-logos/craftmypdf.svg",
    "app_name": "craftmypdf",
    "isAvailable": true
  },
  {
    "title": "Crowdin",
    "description": "Integrate Crowdin to seamlessly execute automated workflows, synchronize data, and orchestrate Crowdin actions directly within Alti.",
    "image": "/assets/apps-logos/crowdin.svg",
    "app_name": "crowdin",
    "isAvailable": true
  },
  {
    "title": "Cults",
    "description": "Integrate Cults to seamlessly execute automated workflows, synchronize data, and orchestrate Cults actions directly within Alti.",
    "image": "/assets/apps-logos/cults.svg",
    "app_name": "cults",
    "isAvailable": true
  },
  {
    "title": "Curated",
    "description": "Integrate Curated to seamlessly execute automated workflows, synchronize data, and orchestrate Curated actions directly within Alti.",
    "image": "/assets/apps-logos/curated.svg",
    "app_name": "curated",
    "isAvailable": true
  },
  {
    "title": "Currents API",
    "description": "Integrate Currents API to seamlessly execute automated workflows, synchronize data, and orchestrate Currents API actions directly within Alti.",
    "image": "/assets/apps-logos/currents_api.svg",
    "app_name": "currents_api",
    "isAvailable": true
  },
  {
    "title": "Customer Io",
    "description": "Integrate Customer Io to seamlessly execute automated workflows, synchronize data, and orchestrate Customer Io actions directly within Alti.",
    "image": "/assets/apps-logos/customer_io.svg",
    "app_name": "customer_io",
    "isAvailable": true
  },
  {
    "title": "Customgpt",
    "description": "Integrate Customgpt to seamlessly execute automated workflows, synchronize data, and orchestrate Customgpt actions directly within Alti.",
    "image": "/assets/apps-logos/customgpt.svg",
    "app_name": "customgpt",
    "isAvailable": true
  },
  {
    "title": "Customjs",
    "description": "Integrate Customjs to seamlessly execute automated workflows, synchronize data, and orchestrate Customjs actions directly within Alti.",
    "image": "/assets/apps-logos/customjs.svg",
    "app_name": "customjs",
    "isAvailable": true
  },
  {
    "title": "Cutt Ly",
    "description": "Integrate Cutt Ly to seamlessly execute automated workflows, synchronize data, and orchestrate Cutt Ly actions directly within Alti.",
    "image": "/assets/apps-logos/cutt_ly.svg",
    "app_name": "cutt_ly",
    "isAvailable": true
  },
  {
    "title": "Dadata Ru",
    "description": "Integrate Dadata Ru to seamlessly execute automated workflows, synchronize data, and orchestrate Dadata Ru actions directly within Alti.",
    "image": "/assets/apps-logos/dadata_ru.svg",
    "app_name": "dadata_ru",
    "isAvailable": true
  },
  {
    "title": "Daffy",
    "description": "Integrate Daffy to seamlessly execute automated workflows, synchronize data, and orchestrate Daffy actions directly within Alti.",
    "image": "/assets/apps-logos/daffy.svg",
    "app_name": "daffy",
    "isAvailable": true
  },
  {
    "title": "Datagma",
    "description": "Integrate Datagma to seamlessly execute automated workflows, synchronize data, and orchestrate Datagma actions directly within Alti.",
    "image": "/assets/apps-logos/datagma.svg",
    "app_name": "datagma",
    "isAvailable": true
  },
  {
    "title": "Datarobot",
    "description": "Integrate Datarobot to seamlessly execute automated workflows, synchronize data, and orchestrate Datarobot actions directly within Alti.",
    "image": "/assets/apps-logos/datarobot.svg",
    "app_name": "datarobot",
    "isAvailable": true
  },
  {
    "title": "Deadline Funnel",
    "description": "Integrate Deadline Funnel to seamlessly execute automated workflows, synchronize data, and orchestrate Deadline Funnel actions directly within Alti.",
    "image": "/assets/apps-logos/deadline_funnel.svg",
    "app_name": "deadline_funnel",
    "isAvailable": true
  },
  {
    "title": "Deel",
    "description": "Integrate Deel to seamlessly execute automated workflows, synchronize data, and orchestrate Deel actions directly within Alti.",
    "image": "/assets/apps-logos/deel.svg",
    "app_name": "deel",
    "isAvailable": true
  },
  {
    "title": "Deepgram",
    "description": "Integrate Deepgram to seamlessly execute automated workflows, synchronize data, and orchestrate Deepgram actions directly within Alti.",
    "image": "/assets/apps-logos/deepgram.svg",
    "app_name": "deepgram",
    "isAvailable": true
  },
  {
    "title": "Demio",
    "description": "Integrate Demio to seamlessly execute automated workflows, synchronize data, and orchestrate Demio actions directly within Alti.",
    "image": "/assets/apps-logos/demio.svg",
    "app_name": "demio",
    "isAvailable": true
  },
  {
    "title": "Desktime",
    "description": "Integrate Desktime to seamlessly execute automated workflows, synchronize data, and orchestrate Desktime actions directly within Alti.",
    "image": "/assets/apps-logos/desktime.svg",
    "app_name": "desktime",
    "isAvailable": true
  },
  {
    "title": "Detrack",
    "description": "Integrate Detrack to seamlessly execute automated workflows, synchronize data, and orchestrate Detrack actions directly within Alti.",
    "image": "/assets/apps-logos/detrack.svg",
    "app_name": "detrack",
    "isAvailable": true
  },
  {
    "title": "Dialmycalls",
    "description": "Integrate Dialmycalls to seamlessly execute automated workflows, synchronize data, and orchestrate Dialmycalls actions directly within Alti.",
    "image": "/assets/apps-logos/dialmycalls.svg",
    "app_name": "dialmycalls",
    "isAvailable": true
  },
  {
    "title": "Dictionary API",
    "description": "Integrate Dictionary API to seamlessly execute automated workflows, synchronize data, and orchestrate Dictionary API actions directly within Alti.",
    "image": "/assets/apps-logos/dictionary_api.svg",
    "app_name": "dictionary_api",
    "isAvailable": true
  },
  {
    "title": "Diffbot",
    "description": "Integrate Diffbot to seamlessly execute automated workflows, synchronize data, and orchestrate Diffbot actions directly within Alti.",
    "image": "/assets/apps-logos/diffbot.svg",
    "app_name": "diffbot",
    "isAvailable": true
  },
  {
    "title": "Digicert",
    "description": "Integrate Digicert to seamlessly execute automated workflows, synchronize data, and orchestrate Digicert actions directly within Alti.",
    "image": "/assets/apps-logos/digicert.svg",
    "app_name": "digicert",
    "isAvailable": true
  },
  {
    "title": "Digital Ocean",
    "description": "Integrate Digital Ocean to seamlessly execute automated workflows, synchronize data, and orchestrate Digital Ocean actions directly within Alti.",
    "image": "/assets/apps-logos/digital_ocean.svg",
    "app_name": "digital_ocean",
    "isAvailable": true
  },
  {
    "title": "Discord",
    "description": "Integrate Discord to seamlessly execute automated workflows, synchronize data, and orchestrate Discord actions directly within Alti.",
    "image": "/assets/apps-logos/discord.svg",
    "app_name": "discord",
    "isAvailable": true
  },
  {
    "title": "Dnsfilter",
    "description": "Integrate Dnsfilter to seamlessly execute automated workflows, synchronize data, and orchestrate Dnsfilter actions directly within Alti.",
    "image": "/assets/apps-logos/dnsfilter.svg",
    "app_name": "dnsfilter",
    "isAvailable": true
  },
  {
    "title": "Dock Certs",
    "description": "Integrate Dock Certs to seamlessly execute automated workflows, synchronize data, and orchestrate Dock Certs actions directly within Alti.",
    "image": "/assets/apps-logos/dock_certs.svg",
    "app_name": "dock_certs",
    "isAvailable": true
  },
  {
    "title": "Docker Hub",
    "description": "Integrate Docker Hub to seamlessly execute automated workflows, synchronize data, and orchestrate Docker Hub actions directly within Alti.",
    "image": "/assets/apps-logos/docker_hub.svg",
    "app_name": "docker_hub",
    "isAvailable": true
  },
  {
    "title": "Docmosis",
    "description": "Integrate Docmosis to seamlessly execute automated workflows, synchronize data, and orchestrate Docmosis actions directly within Alti.",
    "image": "/assets/apps-logos/docmosis.svg",
    "app_name": "docmosis",
    "isAvailable": true
  },
  {
    "title": "Docnify",
    "description": "Integrate Docnify to seamlessly execute automated workflows, synchronize data, and orchestrate Docnify actions directly within Alti.",
    "image": "/assets/apps-logos/docnify.svg",
    "app_name": "docnify",
    "isAvailable": true
  },
  {
    "title": "Docsbot AI",
    "description": "Integrate Docsbot AI to seamlessly execute automated workflows, synchronize data, and orchestrate Docsbot AI actions directly within Alti.",
    "image": "/assets/apps-logos/docsbot_ai.svg",
    "app_name": "docsbot_ai",
    "isAvailable": true
  },
  {
    "title": "Docsumo",
    "description": "Integrate Docsumo to seamlessly execute automated workflows, synchronize data, and orchestrate Docsumo actions directly within Alti.",
    "image": "/assets/apps-logos/docsumo.svg",
    "app_name": "docsumo",
    "isAvailable": true
  },
  {
    "title": "Docugenerate",
    "description": "Integrate Docugenerate to seamlessly execute automated workflows, synchronize data, and orchestrate Docugenerate actions directly within Alti.",
    "image": "/assets/apps-logos/docugenerate.svg",
    "app_name": "docugenerate",
    "isAvailable": true
  },
  {
    "title": "Documenso",
    "description": "Integrate Documenso to seamlessly execute automated workflows, synchronize data, and orchestrate Documenso actions directly within Alti.",
    "image": "/assets/apps-logos/documenso.svg",
    "app_name": "documenso",
    "isAvailable": true
  },
  {
    "title": "Documint",
    "description": "Integrate Documint to seamlessly execute automated workflows, synchronize data, and orchestrate Documint actions directly within Alti.",
    "image": "/assets/apps-logos/documint.svg",
    "app_name": "documint",
    "isAvailable": true
  },
  {
    "title": "Docupilot",
    "description": "Integrate Docupilot to seamlessly execute automated workflows, synchronize data, and orchestrate Docupilot actions directly within Alti.",
    "image": "/assets/apps-logos/docupilot.svg",
    "app_name": "docupilot",
    "isAvailable": true
  },
  {
    "title": "Docupost",
    "description": "Integrate Docupost to seamlessly execute automated workflows, synchronize data, and orchestrate Docupost actions directly within Alti.",
    "image": "/assets/apps-logos/docupost.svg",
    "app_name": "docupost",
    "isAvailable": true
  },
  {
    "title": "Docuseal",
    "description": "Integrate Docuseal to seamlessly execute automated workflows, synchronize data, and orchestrate Docuseal actions directly within Alti.",
    "image": "/assets/apps-logos/docuseal.svg",
    "app_name": "docuseal",
    "isAvailable": true
  },
  {
    "title": "Doppler Marketing Automation",
    "description": "Integrate Doppler Marketing Automation to seamlessly execute automated workflows, synchronize data, and orchestrate Doppler Marketing Automation actions directly within Alti.",
    "image": "/assets/apps-logos/doppler_marketing_automation.svg",
    "app_name": "doppler_marketing_automation",
    "isAvailable": true
  },
  {
    "title": "Doppler Secretops",
    "description": "Integrate Doppler Secretops to seamlessly execute automated workflows, synchronize data, and orchestrate Doppler Secretops actions directly within Alti.",
    "image": "/assets/apps-logos/doppler_secretops.svg",
    "app_name": "doppler_secretops",
    "isAvailable": true
  },
  {
    "title": "Dotsimple",
    "description": "Integrate Dotsimple to seamlessly execute automated workflows, synchronize data, and orchestrate Dotsimple actions directly within Alti.",
    "image": "/assets/apps-logos/dotsimple.svg",
    "app_name": "dotsimple",
    "isAvailable": true
  },
  {
    "title": "Dovetail",
    "description": "Integrate Dovetail to seamlessly execute automated workflows, synchronize data, and orchestrate Dovetail actions directly within Alti.",
    "image": "/assets/apps-logos/dovetail.svg",
    "app_name": "dovetail",
    "isAvailable": true
  },
  {
    "title": "Dpd2",
    "description": "Integrate Dpd2 to seamlessly execute automated workflows, synchronize data, and orchestrate Dpd2 actions directly within Alti.",
    "image": "/assets/apps-logos/dpd2.svg",
    "app_name": "dpd2",
    "isAvailable": true
  },
  {
    "title": "Draftable",
    "description": "Integrate Draftable to seamlessly execute automated workflows, synchronize data, and orchestrate Draftable actions directly within Alti.",
    "image": "/assets/apps-logos/draftable.svg",
    "app_name": "draftable",
    "isAvailable": true
  },
  {
    "title": "Dreamstudio",
    "description": "Integrate Dreamstudio to seamlessly execute automated workflows, synchronize data, and orchestrate Dreamstudio actions directly within Alti.",
    "image": "/assets/apps-logos/dreamstudio.svg",
    "app_name": "dreamstudio",
    "isAvailable": true
  },
  {
    "title": "Drip Jobs",
    "description": "Integrate Drip Jobs to seamlessly execute automated workflows, synchronize data, and orchestrate Drip Jobs actions directly within Alti.",
    "image": "/assets/apps-logos/drip_jobs.svg",
    "app_name": "drip_jobs",
    "isAvailable": true
  },
  {
    "title": "Dripcel",
    "description": "Integrate Dripcel to seamlessly execute automated workflows, synchronize data, and orchestrate Dripcel actions directly within Alti.",
    "image": "/assets/apps-logos/dripcel.svg",
    "app_name": "dripcel",
    "isAvailable": true
  },
  {
    "title": "Dromo",
    "description": "Integrate Dromo to seamlessly execute automated workflows, synchronize data, and orchestrate Dromo actions directly within Alti.",
    "image": "/assets/apps-logos/dromo.svg",
    "app_name": "dromo",
    "isAvailable": true
  },
  {
    "title": "Dropbox Sign",
    "description": "Integrate Dropbox Sign to seamlessly execute automated workflows, synchronize data, and orchestrate Dropbox Sign actions directly within Alti.",
    "image": "/assets/apps-logos/dropbox_sign.svg",
    "app_name": "dropbox_sign",
    "isAvailable": true
  },
  {
    "title": "Dropcontact",
    "description": "Integrate Dropcontact to seamlessly execute automated workflows, synchronize data, and orchestrate Dropcontact actions directly within Alti.",
    "image": "/assets/apps-logos/dropcontact.svg",
    "app_name": "dropcontact",
    "isAvailable": true
  },
  {
    "title": "Dungeon Fighter Online",
    "description": "Integrate Dungeon Fighter Online to seamlessly execute automated workflows, synchronize data, and orchestrate Dungeon Fighter Online actions directly within Alti.",
    "image": "/assets/apps-logos/dungeon_fighter_online.svg",
    "app_name": "dungeon_fighter_online",
    "isAvailable": true
  },
  {
    "title": "Elasticsearch",
    "description": "Integrate Elasticsearch to seamlessly execute automated workflows, synchronize data, and orchestrate Elasticsearch actions directly within Alti.",
    "image": "/assets/apps-logos/elasticsearch.svg",
    "app_name": "elasticsearch",
    "isAvailable": true
  },
  {
    "title": "Elevenlabs",
    "description": "Integrate Elevenlabs to seamlessly execute automated workflows, synchronize data, and orchestrate Elevenlabs actions directly within Alti.",
    "image": "/assets/apps-logos/elevenlabs.svg",
    "app_name": "elevenlabs",
    "isAvailable": true
  },
  {
    "title": "Elorus",
    "description": "Integrate Elorus to seamlessly execute automated workflows, synchronize data, and orchestrate Elorus actions directly within Alti.",
    "image": "/assets/apps-logos/elorus.svg",
    "app_name": "elorus",
    "isAvailable": true
  },
  {
    "title": "Emailable",
    "description": "Integrate Emailable to seamlessly execute automated workflows, synchronize data, and orchestrate Emailable actions directly within Alti.",
    "image": "/assets/apps-logos/emailable.svg",
    "app_name": "emailable",
    "isAvailable": true
  },
  {
    "title": "Emaillistverify",
    "description": "Integrate Emaillistverify to seamlessly execute automated workflows, synchronize data, and orchestrate Emaillistverify actions directly within Alti.",
    "image": "/assets/apps-logos/emaillistverify.svg",
    "app_name": "emaillistverify",
    "isAvailable": true
  },
  {
    "title": "Emailoctopus",
    "description": "Integrate Emailoctopus to seamlessly execute automated workflows, synchronize data, and orchestrate Emailoctopus actions directly within Alti.",
    "image": "/assets/apps-logos/emailoctopus.svg",
    "app_name": "emailoctopus",
    "isAvailable": true
  },
  {
    "title": "Emelia",
    "description": "Integrate Emelia to seamlessly execute automated workflows, synchronize data, and orchestrate Emelia actions directly within Alti.",
    "image": "/assets/apps-logos/emelia.svg",
    "app_name": "emelia",
    "isAvailable": true
  },
  {
    "title": "Encodian",
    "description": "Integrate Encodian to seamlessly execute automated workflows, synchronize data, and orchestrate Encodian actions directly within Alti.",
    "image": "/assets/apps-logos/encodian.svg",
    "app_name": "encodian",
    "isAvailable": true
  },
  {
    "title": "Endorsal",
    "description": "Integrate Endorsal to seamlessly execute automated workflows, synchronize data, and orchestrate Endorsal actions directly within Alti.",
    "image": "/assets/apps-logos/endorsal.svg",
    "app_name": "endorsal",
    "isAvailable": true
  },
  {
    "title": "Enginemailer",
    "description": "Integrate Enginemailer to seamlessly execute automated workflows, synchronize data, and orchestrate Enginemailer actions directly within Alti.",
    "image": "/assets/apps-logos/enginemailer.svg",
    "app_name": "enginemailer",
    "isAvailable": true
  },
  {
    "title": "Enigma",
    "description": "Integrate Enigma to seamlessly execute automated workflows, synchronize data, and orchestrate Enigma actions directly within Alti.",
    "image": "/assets/apps-logos/enigma.svg",
    "app_name": "enigma",
    "isAvailable": true
  },
  {
    "title": "Entelligence",
    "description": "Integrate Entelligence to seamlessly execute automated workflows, synchronize data, and orchestrate Entelligence actions directly within Alti.",
    "image": "/assets/apps-logos/entelligence.svg",
    "app_name": "entelligence",
    "isAvailable": true
  },
  {
    "title": "Eodhd Apis",
    "description": "Integrate Eodhd Apis to seamlessly execute automated workflows, synchronize data, and orchestrate Eodhd Apis actions directly within Alti.",
    "image": "/assets/apps-logos/eodhd_apis.svg",
    "app_name": "eodhd_apis",
    "isAvailable": true
  },
  {
    "title": "Epic Games",
    "description": "Integrate Epic Games to seamlessly execute automated workflows, synchronize data, and orchestrate Epic Games actions directly within Alti.",
    "image": "/assets/apps-logos/epic_games.svg",
    "app_name": "epic_games",
    "isAvailable": true
  },
  {
    "title": "Esignatures Io",
    "description": "Integrate Esignatures Io to seamlessly execute automated workflows, synchronize data, and orchestrate Esignatures Io actions directly within Alti.",
    "image": "/assets/apps-logos/esignatures_io.svg",
    "app_name": "esignatures_io",
    "isAvailable": true
  },
  {
    "title": "Espocrm",
    "description": "Integrate Espocrm to seamlessly execute automated workflows, synchronize data, and orchestrate Espocrm actions directly within Alti.",
    "image": "/assets/apps-logos/espocrm.svg",
    "app_name": "espocrm",
    "isAvailable": true
  },
  {
    "title": "Esputnik",
    "description": "Integrate Esputnik to seamlessly execute automated workflows, synchronize data, and orchestrate Esputnik actions directly within Alti.",
    "image": "/assets/apps-logos/esputnik.svg",
    "app_name": "esputnik",
    "isAvailable": true
  },
  {
    "title": "Etermin",
    "description": "Integrate Etermin to seamlessly execute automated workflows, synchronize data, and orchestrate Etermin actions directly within Alti.",
    "image": "/assets/apps-logos/etermin.svg",
    "app_name": "etermin",
    "isAvailable": true
  },
  {
    "title": "Evenium",
    "description": "Integrate Evenium to seamlessly execute automated workflows, synchronize data, and orchestrate Evenium actions directly within Alti.",
    "image": "/assets/apps-logos/evenium.svg",
    "app_name": "evenium",
    "isAvailable": true
  },
  {
    "title": "Eventee",
    "description": "Integrate Eventee to seamlessly execute automated workflows, synchronize data, and orchestrate Eventee actions directly within Alti.",
    "image": "/assets/apps-logos/eventee.svg",
    "app_name": "eventee",
    "isAvailable": true
  },
  {
    "title": "Eventzilla",
    "description": "Integrate Eventzilla to seamlessly execute automated workflows, synchronize data, and orchestrate Eventzilla actions directly within Alti.",
    "image": "/assets/apps-logos/eventzilla.svg",
    "app_name": "eventzilla",
    "isAvailable": true
  },
  {
    "title": "Everhour",
    "description": "Integrate Everhour to seamlessly execute automated workflows, synchronize data, and orchestrate Everhour actions directly within Alti.",
    "image": "/assets/apps-logos/everhour.svg",
    "app_name": "everhour",
    "isAvailable": true
  },
  {
    "title": "Eversign",
    "description": "Integrate Eversign to seamlessly execute automated workflows, synchronize data, and orchestrate Eversign actions directly within Alti.",
    "image": "/assets/apps-logos/eversign.svg",
    "app_name": "eversign",
    "isAvailable": true
  },
  {
    "title": "Excel",
    "description": "Integrate Excel to seamlessly execute automated workflows, synchronize data, and orchestrate Excel actions directly within Alti.",
    "image": "/assets/apps-logos/excel.svg",
    "app_name": "excel",
    "isAvailable": true
  },
  {
    "title": "Exist",
    "description": "Integrate Exist to seamlessly execute automated workflows, synchronize data, and orchestrate Exist actions directly within Alti.",
    "image": "/assets/apps-logos/exist.svg",
    "app_name": "exist",
    "isAvailable": true
  },
  {
    "title": "Expofp",
    "description": "Integrate Expofp to seamlessly execute automated workflows, synchronize data, and orchestrate Expofp actions directly within Alti.",
    "image": "/assets/apps-logos/expofp.svg",
    "app_name": "expofp",
    "isAvailable": true
  },
  {
    "title": "Extracta AI",
    "description": "Integrate Extracta AI to seamlessly execute automated workflows, synchronize data, and orchestrate Extracta AI actions directly within Alti.",
    "image": "/assets/apps-logos/extracta_ai.svg",
    "app_name": "extracta_ai",
    "isAvailable": true
  },
  {
    "title": "Faceup",
    "description": "Integrate Faceup to seamlessly execute automated workflows, synchronize data, and orchestrate Faceup actions directly within Alti.",
    "image": "/assets/apps-logos/faceup.svg",
    "app_name": "faceup",
    "isAvailable": true
  },
  {
    "title": "Factorial",
    "description": "Integrate Factorial to seamlessly execute automated workflows, synchronize data, and orchestrate Factorial actions directly within Alti.",
    "image": "/assets/apps-logos/factorial.svg",
    "app_name": "factorial",
    "isAvailable": true
  },
  {
    "title": "Feathery",
    "description": "Integrate Feathery to seamlessly execute automated workflows, synchronize data, and orchestrate Feathery actions directly within Alti.",
    "image": "/assets/apps-logos/feathery.svg",
    "app_name": "feathery",
    "isAvailable": true
  },
  {
    "title": "Felt",
    "description": "Integrate Felt to seamlessly execute automated workflows, synchronize data, and orchestrate Felt actions directly within Alti.",
    "image": "/assets/apps-logos/felt.svg",
    "app_name": "felt",
    "isAvailable": true
  },
  {
    "title": "Fibery",
    "description": "Integrate Fibery to seamlessly execute automated workflows, synchronize data, and orchestrate Fibery actions directly within Alti.",
    "image": "/assets/apps-logos/fibery.svg",
    "app_name": "fibery",
    "isAvailable": true
  },
  {
    "title": "Fidel API",
    "description": "Integrate Fidel API to seamlessly execute automated workflows, synchronize data, and orchestrate Fidel API actions directly within Alti.",
    "image": "/assets/apps-logos/fidel_api.svg",
    "app_name": "fidel_api",
    "isAvailable": true
  },
  {
    "title": "Files Com",
    "description": "Integrate Files Com to seamlessly execute automated workflows, synchronize data, and orchestrate Files Com actions directly within Alti.",
    "image": "/assets/apps-logos/files_com.svg",
    "app_name": "files_com",
    "isAvailable": true
  },
  {
    "title": "Fillout Forms",
    "description": "Integrate Fillout Forms to seamlessly execute automated workflows, synchronize data, and orchestrate Fillout Forms actions directly within Alti.",
    "image": "/assets/apps-logos/fillout_forms.svg",
    "app_name": "fillout_forms",
    "isAvailable": true
  },
  {
    "title": "Finage",
    "description": "Integrate Finage to seamlessly execute automated workflows, synchronize data, and orchestrate Finage actions directly within Alti.",
    "image": "/assets/apps-logos/finage.svg",
    "app_name": "finage",
    "isAvailable": true
  },
  {
    "title": "Findymail",
    "description": "Integrate Findymail to seamlessly execute automated workflows, synchronize data, and orchestrate Findymail actions directly within Alti.",
    "image": "/assets/apps-logos/findymail.svg",
    "app_name": "findymail",
    "isAvailable": true
  },
  {
    "title": "Finerworks",
    "description": "Integrate Finerworks to seamlessly execute automated workflows, synchronize data, and orchestrate Finerworks actions directly within Alti.",
    "image": "/assets/apps-logos/finerworks.svg",
    "app_name": "finerworks",
    "isAvailable": true
  },
  {
    "title": "Fingertip",
    "description": "Integrate Fingertip to seamlessly execute automated workflows, synchronize data, and orchestrate Fingertip actions directly within Alti.",
    "image": "/assets/apps-logos/fingertip.svg",
    "app_name": "fingertip",
    "isAvailable": true
  },
  {
    "title": "Finmei",
    "description": "Integrate Finmei to seamlessly execute automated workflows, synchronize data, and orchestrate Finmei actions directly within Alti.",
    "image": "/assets/apps-logos/finmei.svg",
    "app_name": "finmei",
    "isAvailable": true
  },
  {
    "title": "Firmao",
    "description": "Integrate Firmao to seamlessly execute automated workflows, synchronize data, and orchestrate Firmao actions directly within Alti.",
    "image": "/assets/apps-logos/firmao.svg",
    "app_name": "firmao",
    "isAvailable": true
  },
  {
    "title": "Fitbit",
    "description": "Integrate Fitbit to seamlessly execute automated workflows, synchronize data, and orchestrate Fitbit actions directly within Alti.",
    "image": "/assets/apps-logos/fitbit.svg",
    "app_name": "fitbit",
    "isAvailable": true
  },
  {
    "title": "Fixer",
    "description": "Integrate Fixer to seamlessly execute automated workflows, synchronize data, and orchestrate Fixer actions directly within Alti.",
    "image": "/assets/apps-logos/fixer.svg",
    "app_name": "fixer",
    "isAvailable": true
  },
  {
    "title": "Fixer Io",
    "description": "Integrate Fixer Io to seamlessly execute automated workflows, synchronize data, and orchestrate Fixer Io actions directly within Alti.",
    "image": "/assets/apps-logos/fixer_io.svg",
    "app_name": "fixer_io",
    "isAvailable": true
  },
  {
    "title": "Flexisign",
    "description": "Integrate Flexisign to seamlessly execute automated workflows, synchronize data, and orchestrate Flexisign actions directly within Alti.",
    "image": "/assets/apps-logos/flexisign.svg",
    "app_name": "flexisign",
    "isAvailable": true
  },
  {
    "title": "Flowiseai",
    "description": "Integrate Flowiseai to seamlessly execute automated workflows, synchronize data, and orchestrate Flowiseai actions directly within Alti.",
    "image": "/assets/apps-logos/flowiseai.svg",
    "app_name": "flowiseai",
    "isAvailable": true
  },
  {
    "title": "Flutterwave",
    "description": "Integrate Flutterwave to seamlessly execute automated workflows, synchronize data, and orchestrate Flutterwave actions directly within Alti.",
    "image": "/assets/apps-logos/flutterwave.svg",
    "app_name": "flutterwave",
    "isAvailable": true
  },
  {
    "title": "Fluxguard",
    "description": "Integrate Fluxguard to seamlessly execute automated workflows, synchronize data, and orchestrate Fluxguard actions directly within Alti.",
    "image": "/assets/apps-logos/fluxguard.svg",
    "app_name": "fluxguard",
    "isAvailable": true
  },
  {
    "title": "Fomo",
    "description": "Integrate Fomo to seamlessly execute automated workflows, synchronize data, and orchestrate Fomo actions directly within Alti.",
    "image": "/assets/apps-logos/fomo.svg",
    "app_name": "fomo",
    "isAvailable": true
  },
  {
    "title": "Forcemanager",
    "description": "Integrate Forcemanager to seamlessly execute automated workflows, synchronize data, and orchestrate Forcemanager actions directly within Alti.",
    "image": "/assets/apps-logos/forcemanager.svg",
    "app_name": "forcemanager",
    "isAvailable": true
  },
  {
    "title": "Formbricks",
    "description": "Integrate Formbricks to seamlessly execute automated workflows, synchronize data, and orchestrate Formbricks actions directly within Alti.",
    "image": "/assets/apps-logos/formbricks.svg",
    "app_name": "formbricks",
    "isAvailable": true
  },
  {
    "title": "Formcarry",
    "description": "Integrate Formcarry to seamlessly execute automated workflows, synchronize data, and orchestrate Formcarry actions directly within Alti.",
    "image": "/assets/apps-logos/formcarry.svg",
    "app_name": "formcarry",
    "isAvailable": true
  },
  {
    "title": "Formdesk",
    "description": "Integrate Formdesk to seamlessly execute automated workflows, synchronize data, and orchestrate Formdesk actions directly within Alti.",
    "image": "/assets/apps-logos/formdesk.svg",
    "app_name": "formdesk",
    "isAvailable": true
  },
  {
    "title": "Fraudlabs Pro",
    "description": "Integrate Fraudlabs Pro to seamlessly execute automated workflows, synchronize data, and orchestrate Fraudlabs Pro actions directly within Alti.",
    "image": "/assets/apps-logos/fraudlabs_pro.svg",
    "app_name": "fraudlabs_pro",
    "isAvailable": true
  },
  {
    "title": "Freshbooks",
    "description": "Integrate Freshbooks to seamlessly execute automated workflows, synchronize data, and orchestrate Freshbooks actions directly within Alti.",
    "image": "/assets/apps-logos/freshbooks.svg",
    "app_name": "freshbooks",
    "isAvailable": true
  },
  {
    "title": "Freshservice",
    "description": "Integrate Freshservice to seamlessly execute automated workflows, synchronize data, and orchestrate Freshservice actions directly within Alti.",
    "image": "/assets/apps-logos/freshservice.svg",
    "app_name": "freshservice",
    "isAvailable": true
  },
  {
    "title": "Front",
    "description": "Integrate Front to seamlessly execute automated workflows, synchronize data, and orchestrate Front actions directly within Alti.",
    "image": "/assets/apps-logos/front.svg",
    "app_name": "front",
    "isAvailable": true
  },
  {
    "title": "Fullenrich",
    "description": "Integrate Fullenrich to seamlessly execute automated workflows, synchronize data, and orchestrate Fullenrich actions directly within Alti.",
    "image": "/assets/apps-logos/fullenrich.svg",
    "app_name": "fullenrich",
    "isAvailable": true
  },
  {
    "title": "Gagelist",
    "description": "Integrate Gagelist to seamlessly execute automated workflows, synchronize data, and orchestrate Gagelist actions directly within Alti.",
    "image": "/assets/apps-logos/gagelist.svg",
    "app_name": "gagelist",
    "isAvailable": true
  },
  {
    "title": "Gamma",
    "description": "Integrate Gamma to seamlessly execute automated workflows, synchronize data, and orchestrate Gamma actions directly within Alti.",
    "image": "/assets/apps-logos/gamma.svg",
    "app_name": "gamma",
    "isAvailable": true
  },
  {
    "title": "Gan AI",
    "description": "Integrate Gan AI to seamlessly execute automated workflows, synchronize data, and orchestrate Gan AI actions directly within Alti.",
    "image": "/assets/apps-logos/gan_ai.svg",
    "app_name": "gan_ai",
    "isAvailable": true
  },
  {
    "title": "Gatherup",
    "description": "Integrate Gatherup to seamlessly execute automated workflows, synchronize data, and orchestrate Gatherup actions directly within Alti.",
    "image": "/assets/apps-logos/gatherup.svg",
    "app_name": "gatherup",
    "isAvailable": true
  },
  {
    "title": "Gemini",
    "description": "Integrate Gemini to seamlessly execute automated workflows, synchronize data, and orchestrate Gemini actions directly within Alti.",
    "image": "/assets/apps-logos/gemini.svg",
    "app_name": "gemini",
    "isAvailable": true
  },
  {
    "title": "Gender API",
    "description": "Integrate Gender API to seamlessly execute automated workflows, synchronize data, and orchestrate Gender API actions directly within Alti.",
    "image": "/assets/apps-logos/gender_api.svg",
    "app_name": "gender_api",
    "isAvailable": true
  },
  {
    "title": "Genderapi Io",
    "description": "Integrate Genderapi Io to seamlessly execute automated workflows, synchronize data, and orchestrate Genderapi Io actions directly within Alti.",
    "image": "/assets/apps-logos/genderapi_io.svg",
    "app_name": "genderapi_io",
    "isAvailable": true
  },
  {
    "title": "Genderize",
    "description": "Integrate Genderize to seamlessly execute automated workflows, synchronize data, and orchestrate Genderize actions directly within Alti.",
    "image": "/assets/apps-logos/genderize.svg",
    "app_name": "genderize",
    "isAvailable": true
  },
  {
    "title": "Geoapify",
    "description": "Integrate Geoapify to seamlessly execute automated workflows, synchronize data, and orchestrate Geoapify actions directly within Alti.",
    "image": "/assets/apps-logos/geoapify.svg",
    "app_name": "geoapify",
    "isAvailable": true
  },
  {
    "title": "Geocodio",
    "description": "Integrate Geocodio to seamlessly execute automated workflows, synchronize data, and orchestrate Geocodio actions directly within Alti.",
    "image": "/assets/apps-logos/geocodio.svg",
    "app_name": "geocodio",
    "isAvailable": true
  },
  {
    "title": "Geokeo",
    "description": "Integrate Geokeo to seamlessly execute automated workflows, synchronize data, and orchestrate Geokeo actions directly within Alti.",
    "image": "/assets/apps-logos/geokeo.svg",
    "app_name": "geokeo",
    "isAvailable": true
  },
  {
    "title": "Getform",
    "description": "Integrate Getform to seamlessly execute automated workflows, synchronize data, and orchestrate Getform actions directly within Alti.",
    "image": "/assets/apps-logos/getform.svg",
    "app_name": "getform",
    "isAvailable": true
  },
  {
    "title": "Gift Up",
    "description": "Integrate Gift Up to seamlessly execute automated workflows, synchronize data, and orchestrate Gift Up actions directly within Alti.",
    "image": "/assets/apps-logos/gift_up.svg",
    "app_name": "gift_up",
    "isAvailable": true
  },
  {
    "title": "Gigasheet",
    "description": "Integrate Gigasheet to seamlessly execute automated workflows, synchronize data, and orchestrate Gigasheet actions directly within Alti.",
    "image": "/assets/apps-logos/gigasheet.svg",
    "app_name": "gigasheet",
    "isAvailable": true
  },
  {
    "title": "Giphy",
    "description": "Integrate Giphy to seamlessly execute automated workflows, synchronize data, and orchestrate Giphy actions directly within Alti.",
    "image": "/assets/apps-logos/giphy.svg",
    "app_name": "giphy",
    "isAvailable": true
  },
  {
    "title": "Gist",
    "description": "Integrate Gist to seamlessly execute automated workflows, synchronize data, and orchestrate Gist actions directly within Alti.",
    "image": "/assets/apps-logos/gist.svg",
    "app_name": "gist",
    "isAvailable": true
  },
  {
    "title": "GitLab",
    "description": "Integrate GitLab to seamlessly execute automated workflows, synchronize data, and orchestrate GitLab actions directly within Alti.",
    "image": "/assets/apps-logos/gitlab.svg",
    "app_name": "gitlab",
    "isAvailable": true
  },
  {
    "title": "Givebutter",
    "description": "Integrate Givebutter to seamlessly execute automated workflows, synchronize data, and orchestrate Givebutter actions directly within Alti.",
    "image": "/assets/apps-logos/givebutter.svg",
    "app_name": "givebutter",
    "isAvailable": true
  },
  {
    "title": "Gladia",
    "description": "Integrate Gladia to seamlessly execute automated workflows, synchronize data, and orchestrate Gladia actions directly within Alti.",
    "image": "/assets/apps-logos/gladia.svg",
    "app_name": "gladia",
    "isAvailable": true
  },
  {
    "title": "Gleap",
    "description": "Integrate Gleap to seamlessly execute automated workflows, synchronize data, and orchestrate Gleap actions directly within Alti.",
    "image": "/assets/apps-logos/gleap.svg",
    "app_name": "gleap",
    "isAvailable": true
  },
  {
    "title": "Globalping",
    "description": "Integrate Globalping to seamlessly execute automated workflows, synchronize data, and orchestrate Globalping actions directly within Alti.",
    "image": "/assets/apps-logos/globalping.svg",
    "app_name": "globalping",
    "isAvailable": true
  },
  {
    "title": "Go To Webinar",
    "description": "Integrate Go To Webinar to seamlessly execute automated workflows, synchronize data, and orchestrate Go To Webinar actions directly within Alti.",
    "image": "/assets/apps-logos/go_to_webinar.svg",
    "app_name": "go_to_webinar",
    "isAvailable": true
  },
  {
    "title": "Godial",
    "description": "Integrate Godial to seamlessly execute automated workflows, synchronize data, and orchestrate Godial actions directly within Alti.",
    "image": "/assets/apps-logos/godial.svg",
    "app_name": "godial",
    "isAvailable": true
  },
  {
    "title": "Gong",
    "description": "Integrate Gong to seamlessly execute automated workflows, synchronize data, and orchestrate Gong actions directly within Alti.",
    "image": "/assets/apps-logos/gong.svg",
    "app_name": "gong",
    "isAvailable": true
  },
  {
    "title": "Goodbits",
    "description": "Integrate Goodbits to seamlessly execute automated workflows, synchronize data, and orchestrate Goodbits actions directly within Alti.",
    "image": "/assets/apps-logos/goodbits.svg",
    "app_name": "goodbits",
    "isAvailable": true
  },
  {
    "title": "Goody",
    "description": "Integrate Goody to seamlessly execute automated workflows, synchronize data, and orchestrate Goody actions directly within Alti.",
    "image": "/assets/apps-logos/goody.svg",
    "app_name": "goody",
    "isAvailable": true
  },
  {
    "title": "Google Address Validation",
    "description": "Integrate Google Address Validation to seamlessly execute automated workflows, synchronize data, and orchestrate Google Address Validation actions directly within Alti.",
    "image": "/assets/apps-logos/google_address_validation.svg",
    "app_name": "google_address_validation",
    "isAvailable": true
  },
  {
    "title": "Google Classroom",
    "description": "Integrate Google Classroom to seamlessly execute automated workflows, synchronize data, and orchestrate Google Classroom actions directly within Alti.",
    "image": "/assets/apps-logos/google_classroom.svg",
    "app_name": "google_classroom",
    "isAvailable": true
  },
  {
    "title": "Google Cloud Vision",
    "description": "Integrate Google Cloud Vision to seamlessly execute automated workflows, synchronize data, and orchestrate Google Cloud Vision actions directly within Alti.",
    "image": "/assets/apps-logos/google_cloud_vision.svg",
    "app_name": "google_cloud_vision",
    "isAvailable": true
  },
  {
    "title": "Google Search Console",
    "description": "Integrate Google Search Console to seamlessly execute automated workflows, synchronize data, and orchestrate Google Search Console actions directly within Alti.",
    "image": "/assets/apps-logos/google_search_console.svg",
    "app_name": "google_search_console",
    "isAvailable": true
  },
  {
    "title": "Google Ads",
    "description": "Integrate Google Ads to seamlessly execute automated workflows, synchronize data, and orchestrate Google Ads actions directly within Alti.",
    "image": "/assets/apps-logos/googleads.svg",
    "app_name": "googleads",
    "isAvailable": true
  },
  {
    "title": "Gosquared",
    "description": "Integrate Gosquared to seamlessly execute automated workflows, synchronize data, and orchestrate Gosquared actions directly within Alti.",
    "image": "/assets/apps-logos/gosquared.svg",
    "app_name": "gosquared",
    "isAvailable": true
  },
  {
    "title": "Grafbase",
    "description": "Integrate Grafbase to seamlessly execute automated workflows, synchronize data, and orchestrate Grafbase actions directly within Alti.",
    "image": "/assets/apps-logos/grafbase.svg",
    "app_name": "grafbase",
    "isAvailable": true
  },
  {
    "title": "Graphhopper",
    "description": "Integrate Graphhopper to seamlessly execute automated workflows, synchronize data, and orchestrate Graphhopper actions directly within Alti.",
    "image": "/assets/apps-logos/graphhopper.svg",
    "app_name": "graphhopper",
    "isAvailable": true
  },
  {
    "title": "Griptape",
    "description": "Integrate Griptape to seamlessly execute automated workflows, synchronize data, and orchestrate Griptape actions directly within Alti.",
    "image": "/assets/apps-logos/griptape.svg",
    "app_name": "griptape",
    "isAvailable": true
  },
  {
    "title": "Grist",
    "description": "Integrate Grist to seamlessly execute automated workflows, synchronize data, and orchestrate Grist actions directly within Alti.",
    "image": "/assets/apps-logos/grist.svg",
    "app_name": "grist",
    "isAvailable": true
  },
  {
    "title": "Groqcloud",
    "description": "Integrate Groqcloud to seamlessly execute automated workflows, synchronize data, and orchestrate Groqcloud actions directly within Alti.",
    "image": "/assets/apps-logos/groqcloud.svg",
    "app_name": "groqcloud",
    "isAvailable": true
  },
  {
    "title": "Guru",
    "description": "Integrate Guru to seamlessly execute automated workflows, synchronize data, and orchestrate Guru actions directly within Alti.",
    "image": "/assets/apps-logos/guru.svg",
    "app_name": "guru",
    "isAvailable": true
  },
  {
    "title": "Habitica",
    "description": "Integrate Habitica to seamlessly execute automated workflows, synchronize data, and orchestrate Habitica actions directly within Alti.",
    "image": "/assets/apps-logos/habitica.svg",
    "app_name": "habitica",
    "isAvailable": true
  },
  {
    "title": "Hackernews",
    "description": "Integrate Hackernews to seamlessly execute automated workflows, synchronize data, and orchestrate Hackernews actions directly within Alti.",
    "image": "/assets/apps-logos/hackernews.svg",
    "app_name": "hackernews",
    "isAvailable": true
  },
  {
    "title": "Hackerrank Work",
    "description": "Integrate Hackerrank Work to seamlessly execute automated workflows, synchronize data, and orchestrate Hackerrank Work actions directly within Alti.",
    "image": "/assets/apps-logos/hackerrank_work.svg",
    "app_name": "hackerrank_work",
    "isAvailable": true
  },
  {
    "title": "Happy Scribe",
    "description": "Integrate Happy Scribe to seamlessly execute automated workflows, synchronize data, and orchestrate Happy Scribe actions directly within Alti.",
    "image": "/assets/apps-logos/happy_scribe.svg",
    "app_name": "happy_scribe",
    "isAvailable": true
  },
  {
    "title": "Hashnode",
    "description": "Integrate Hashnode to seamlessly execute automated workflows, synchronize data, and orchestrate Hashnode actions directly within Alti.",
    "image": "/assets/apps-logos/hashnode.svg",
    "app_name": "hashnode",
    "isAvailable": true
  },
  {
    "title": "Helcim",
    "description": "Integrate Helcim to seamlessly execute automated workflows, synchronize data, and orchestrate Helcim actions directly within Alti.",
    "image": "/assets/apps-logos/helcim.svg",
    "app_name": "helcim",
    "isAvailable": true
  },
  {
    "title": "Helloleads",
    "description": "Integrate Helloleads to seamlessly execute automated workflows, synchronize data, and orchestrate Helloleads actions directly within Alti.",
    "image": "/assets/apps-logos/helloleads.svg",
    "app_name": "helloleads",
    "isAvailable": true
  },
  {
    "title": "Helpdesk",
    "description": "Integrate Helpdesk to seamlessly execute automated workflows, synchronize data, and orchestrate Helpdesk actions directly within Alti.",
    "image": "/assets/apps-logos/helpdesk.svg",
    "app_name": "helpdesk",
    "isAvailable": true
  },
  {
    "title": "Helpwise",
    "description": "Integrate Helpwise to seamlessly execute automated workflows, synchronize data, and orchestrate Helpwise actions directly within Alti.",
    "image": "/assets/apps-logos/helpwise.svg",
    "app_name": "helpwise",
    "isAvailable": true
  },
  {
    "title": "Here",
    "description": "Integrate Here to seamlessly execute automated workflows, synchronize data, and orchestrate Here actions directly within Alti.",
    "image": "/assets/apps-logos/here.svg",
    "app_name": "here",
    "isAvailable": true
  },
  {
    "title": "Heyreach",
    "description": "Integrate Heyreach to seamlessly execute automated workflows, synchronize data, and orchestrate Heyreach actions directly within Alti.",
    "image": "/assets/apps-logos/heyreach.svg",
    "app_name": "heyreach",
    "isAvailable": true
  },
  {
    "title": "Heyzine",
    "description": "Integrate Heyzine to seamlessly execute automated workflows, synchronize data, and orchestrate Heyzine actions directly within Alti.",
    "image": "/assets/apps-logos/heyzine.svg",
    "app_name": "heyzine",
    "isAvailable": true
  },
  {
    "title": "Highergov",
    "description": "Integrate Highergov to seamlessly execute automated workflows, synchronize data, and orchestrate Highergov actions directly within Alti.",
    "image": "/assets/apps-logos/highergov.svg",
    "app_name": "highergov",
    "isAvailable": true
  },
  {
    "title": "Highlevel",
    "description": "Integrate Highlevel to seamlessly execute automated workflows, synchronize data, and orchestrate Highlevel actions directly within Alti.",
    "image": "/assets/apps-logos/highlevel.svg",
    "app_name": "highlevel",
    "isAvailable": true
  },
  {
    "title": "Honeybadger",
    "description": "Integrate Honeybadger to seamlessly execute automated workflows, synchronize data, and orchestrate Honeybadger actions directly within Alti.",
    "image": "/assets/apps-logos/honeybadger.svg",
    "app_name": "honeybadger",
    "isAvailable": true
  },
  {
    "title": "Honeyhive",
    "description": "Integrate Honeyhive to seamlessly execute automated workflows, synchronize data, and orchestrate Honeyhive actions directly within Alti.",
    "image": "/assets/apps-logos/honeyhive.svg",
    "app_name": "honeyhive",
    "isAvailable": true
  },
  {
    "title": "Hookdeck",
    "description": "Integrate Hookdeck to seamlessly execute automated workflows, synchronize data, and orchestrate Hookdeck actions directly within Alti.",
    "image": "/assets/apps-logos/hookdeck.svg",
    "app_name": "hookdeck",
    "isAvailable": true
  },
  {
    "title": "Hotspotsystem",
    "description": "Integrate Hotspotsystem to seamlessly execute automated workflows, synchronize data, and orchestrate Hotspotsystem actions directly within Alti.",
    "image": "/assets/apps-logos/hotspotsystem.svg",
    "app_name": "hotspotsystem",
    "isAvailable": true
  },
  {
    "title": "Html To Image",
    "description": "Integrate Html To Image to seamlessly execute automated workflows, synchronize data, and orchestrate Html To Image actions directly within Alti.",
    "image": "/assets/apps-logos/html_to_image.svg",
    "app_name": "html_to_image",
    "isAvailable": true
  },
  {
    "title": "Humanitix",
    "description": "Integrate Humanitix to seamlessly execute automated workflows, synchronize data, and orchestrate Humanitix actions directly within Alti.",
    "image": "/assets/apps-logos/humanitix.svg",
    "app_name": "humanitix",
    "isAvailable": true
  },
  {
    "title": "Hunter",
    "description": "Integrate Hunter to seamlessly execute automated workflows, synchronize data, and orchestrate Hunter actions directly within Alti.",
    "image": "/assets/apps-logos/hunter.svg",
    "app_name": "hunter",
    "isAvailable": true
  },
  {
    "title": "Hypeauditor",
    "description": "Integrate Hypeauditor to seamlessly execute automated workflows, synchronize data, and orchestrate Hypeauditor actions directly within Alti.",
    "image": "/assets/apps-logos/hypeauditor.svg",
    "app_name": "hypeauditor",
    "isAvailable": true
  },
  {
    "title": "Hyperbrowser",
    "description": "Integrate Hyperbrowser to seamlessly execute automated workflows, synchronize data, and orchestrate Hyperbrowser actions directly within Alti.",
    "image": "/assets/apps-logos/hyperbrowser.svg",
    "app_name": "hyperbrowser",
    "isAvailable": true
  },
  {
    "title": "Hyperise",
    "description": "Integrate Hyperise to seamlessly execute automated workflows, synchronize data, and orchestrate Hyperise actions directly within Alti.",
    "image": "/assets/apps-logos/hyperise.svg",
    "app_name": "hyperise",
    "isAvailable": true
  },
  {
    "title": "Hystruct",
    "description": "Integrate Hystruct to seamlessly execute automated workflows, synchronize data, and orchestrate Hystruct actions directly within Alti.",
    "image": "/assets/apps-logos/hystruct.svg",
    "app_name": "hystruct",
    "isAvailable": true
  },
  {
    "title": "Icims Talent Cloud",
    "description": "Integrate Icims Talent Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Icims Talent Cloud actions directly within Alti.",
    "image": "/assets/apps-logos/icims_talent_cloud.svg",
    "app_name": "icims_talent_cloud",
    "isAvailable": true
  },
  {
    "title": "Icypeas",
    "description": "Integrate Icypeas to seamlessly execute automated workflows, synchronize data, and orchestrate Icypeas actions directly within Alti.",
    "image": "/assets/apps-logos/icypeas.svg",
    "app_name": "icypeas",
    "isAvailable": true
  },
  {
    "title": "Idea Scale",
    "description": "Integrate Idea Scale to seamlessly execute automated workflows, synchronize data, and orchestrate Idea Scale actions directly within Alti.",
    "image": "/assets/apps-logos/idea_scale.svg",
    "app_name": "idea_scale",
    "isAvailable": true
  },
  {
    "title": "Identitycheck",
    "description": "Integrate Identitycheck to seamlessly execute automated workflows, synchronize data, and orchestrate Identitycheck actions directly within Alti.",
    "image": "/assets/apps-logos/identitycheck.svg",
    "app_name": "identitycheck",
    "isAvailable": true
  },
  {
    "title": "Ignisign",
    "description": "Integrate Ignisign to seamlessly execute automated workflows, synchronize data, and orchestrate Ignisign actions directly within Alti.",
    "image": "/assets/apps-logos/ignisign.svg",
    "app_name": "ignisign",
    "isAvailable": true
  },
  {
    "title": "Imagekit Io",
    "description": "Integrate Imagekit Io to seamlessly execute automated workflows, synchronize data, and orchestrate Imagekit Io actions directly within Alti.",
    "image": "/assets/apps-logos/imagekit_io.svg",
    "app_name": "imagekit_io",
    "isAvailable": true
  },
  {
    "title": "Imagior",
    "description": "Integrate Imagior to seamlessly execute automated workflows, synchronize data, and orchestrate Imagior actions directly within Alti.",
    "image": "/assets/apps-logos/imagior.svg",
    "app_name": "imagior",
    "isAvailable": true
  },
  {
    "title": "Imejis Io",
    "description": "Integrate Imejis Io to seamlessly execute automated workflows, synchronize data, and orchestrate Imejis Io actions directly within Alti.",
    "image": "/assets/apps-logos/imejis_io.svg",
    "app_name": "imejis_io",
    "isAvailable": true
  },
  {
    "title": "Imgbb",
    "description": "Integrate Imgbb to seamlessly execute automated workflows, synchronize data, and orchestrate Imgbb actions directly within Alti.",
    "image": "/assets/apps-logos/imgbb.svg",
    "app_name": "imgbb",
    "isAvailable": true
  },
  {
    "title": "Imgix",
    "description": "Integrate Imgix to seamlessly execute automated workflows, synchronize data, and orchestrate Imgix actions directly within Alti.",
    "image": "/assets/apps-logos/imgix.svg",
    "app_name": "imgix",
    "isAvailable": true
  },
  {
    "title": "Influxdb Cloud",
    "description": "Integrate Influxdb Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Influxdb Cloud actions directly within Alti.",
    "image": "/assets/apps-logos/influxdb_cloud.svg",
    "app_name": "influxdb_cloud",
    "isAvailable": true
  },
  {
    "title": "Insighto AI",
    "description": "Integrate Insighto AI to seamlessly execute automated workflows, synchronize data, and orchestrate Insighto AI actions directly within Alti.",
    "image": "/assets/apps-logos/insighto_ai.svg",
    "app_name": "insighto_ai",
    "isAvailable": true
  },
  {
    "title": "Instacart",
    "description": "Integrate Instacart to seamlessly execute automated workflows, synchronize data, and orchestrate Instacart actions directly within Alti.",
    "image": "/assets/apps-logos/instacart.svg",
    "app_name": "instacart",
    "isAvailable": true
  },
  {
    "title": "Instagram",
    "description": "Integrate Instagram to seamlessly execute automated workflows, synchronize data, and orchestrate Instagram actions directly within Alti.",
    "image": "/assets/apps-logos/instagram.svg",
    "app_name": "instagram",
    "isAvailable": true
  },
  {
    "title": "Instantly",
    "description": "Integrate Instantly to seamlessly execute automated workflows, synchronize data, and orchestrate Instantly actions directly within Alti.",
    "image": "/assets/apps-logos/instantly.svg",
    "app_name": "instantly",
    "isAvailable": true
  },
  {
    "title": "Intelliprint",
    "description": "Integrate Intelliprint to seamlessly execute automated workflows, synchronize data, and orchestrate Intelliprint actions directly within Alti.",
    "image": "/assets/apps-logos/intelliprint.svg",
    "app_name": "intelliprint",
    "isAvailable": true
  },
  {
    "title": "Interzoid",
    "description": "Integrate Interzoid to seamlessly execute automated workflows, synchronize data, and orchestrate Interzoid actions directly within Alti.",
    "image": "/assets/apps-logos/interzoid.svg",
    "app_name": "interzoid",
    "isAvailable": true
  },
  {
    "title": "Ip2location",
    "description": "Integrate Ip2location to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2location actions directly within Alti.",
    "image": "/assets/apps-logos/ip2location.svg",
    "app_name": "ip2location",
    "isAvailable": true
  },
  {
    "title": "Ip2location Io",
    "description": "Integrate Ip2location Io to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2location Io actions directly within Alti.",
    "image": "/assets/apps-logos/ip2location_io.svg",
    "app_name": "ip2location_io",
    "isAvailable": true
  },
  {
    "title": "Ip2proxy",
    "description": "Integrate Ip2proxy to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2proxy actions directly within Alti.",
    "image": "/assets/apps-logos/ip2proxy.svg",
    "app_name": "ip2proxy",
    "isAvailable": true
  },
  {
    "title": "Ip2whois",
    "description": "Integrate Ip2whois to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2whois actions directly within Alti.",
    "image": "/assets/apps-logos/ip2whois.svg",
    "app_name": "ip2whois",
    "isAvailable": true
  },
  {
    "title": "Ipdata Co",
    "description": "Integrate Ipdata Co to seamlessly execute automated workflows, synchronize data, and orchestrate Ipdata Co actions directly within Alti.",
    "image": "/assets/apps-logos/ipdata_co.svg",
    "app_name": "ipdata_co",
    "isAvailable": true
  },
  {
    "title": "Ipinfo Io",
    "description": "Integrate Ipinfo Io to seamlessly execute automated workflows, synchronize data, and orchestrate Ipinfo Io actions directly within Alti.",
    "image": "/assets/apps-logos/ipinfo_io.svg",
    "app_name": "ipinfo_io",
    "isAvailable": true
  },
  {
    "title": "Iqair Airvisual",
    "description": "Integrate Iqair Airvisual to seamlessly execute automated workflows, synchronize data, and orchestrate Iqair Airvisual actions directly within Alti.",
    "image": "/assets/apps-logos/iqair_airvisual.svg",
    "app_name": "iqair_airvisual",
    "isAvailable": true
  },
  {
    "title": "Jigsawstack",
    "description": "Integrate Jigsawstack to seamlessly execute automated workflows, synchronize data, and orchestrate Jigsawstack actions directly within Alti.",
    "image": "/assets/apps-logos/jigsawstack.svg",
    "app_name": "jigsawstack",
    "isAvailable": true
  },
  {
    "title": "Jotform",
    "description": "Integrate Jotform to seamlessly execute automated workflows, synchronize data, and orchestrate Jotform actions directly within Alti.",
    "image": "/assets/apps-logos/jotform.svg",
    "app_name": "jotform",
    "isAvailable": true
  },
  {
    "title": "Jumpcloud",
    "description": "Integrate Jumpcloud to seamlessly execute automated workflows, synchronize data, and orchestrate Jumpcloud actions directly within Alti.",
    "image": "/assets/apps-logos/jumpcloud.svg",
    "app_name": "jumpcloud",
    "isAvailable": true
  },
  {
    "title": "Kadoa",
    "description": "Integrate Kadoa to seamlessly execute automated workflows, synchronize data, and orchestrate Kadoa actions directly within Alti.",
    "image": "/assets/apps-logos/kadoa.svg",
    "app_name": "kadoa",
    "isAvailable": true
  },
  {
    "title": "Kaggle",
    "description": "Integrate Kaggle to seamlessly execute automated workflows, synchronize data, and orchestrate Kaggle actions directly within Alti.",
    "image": "/assets/apps-logos/kaggle.svg",
    "app_name": "kaggle",
    "isAvailable": true
  },
  {
    "title": "Kaleido",
    "description": "Integrate Kaleido to seamlessly execute automated workflows, synchronize data, and orchestrate Kaleido actions directly within Alti.",
    "image": "/assets/apps-logos/kaleido.svg",
    "app_name": "kaleido",
    "isAvailable": true
  },
  {
    "title": "Keap",
    "description": "Integrate Keap to seamlessly execute automated workflows, synchronize data, and orchestrate Keap actions directly within Alti.",
    "image": "/assets/apps-logos/keap.svg",
    "app_name": "keap",
    "isAvailable": true
  },
  {
    "title": "Keen Io",
    "description": "Integrate Keen Io to seamlessly execute automated workflows, synchronize data, and orchestrate Keen Io actions directly within Alti.",
    "image": "/assets/apps-logos/keen_io.svg",
    "app_name": "keen_io",
    "isAvailable": true
  },
  {
    "title": "Kickbox",
    "description": "Integrate Kickbox to seamlessly execute automated workflows, synchronize data, and orchestrate Kickbox actions directly within Alti.",
    "image": "/assets/apps-logos/kickbox.svg",
    "app_name": "kickbox",
    "isAvailable": true
  },
  {
    "title": "Kit",
    "description": "Integrate Kit to seamlessly execute automated workflows, synchronize data, and orchestrate Kit actions directly within Alti.",
    "image": "/assets/apps-logos/kit.svg",
    "app_name": "kit",
    "isAvailable": true
  },
  {
    "title": "Klipfolio",
    "description": "Integrate Klipfolio to seamlessly execute automated workflows, synchronize data, and orchestrate Klipfolio actions directly within Alti.",
    "image": "/assets/apps-logos/klipfolio.svg",
    "app_name": "klipfolio",
    "isAvailable": true
  },
  {
    "title": "Ko Fi",
    "description": "Integrate Ko Fi to seamlessly execute automated workflows, synchronize data, and orchestrate Ko Fi actions directly within Alti.",
    "image": "/assets/apps-logos/ko_fi.svg",
    "app_name": "ko_fi",
    "isAvailable": true
  },
  {
    "title": "Kontent AI",
    "description": "Integrate Kontent AI to seamlessly execute automated workflows, synchronize data, and orchestrate Kontent AI actions directly within Alti.",
    "image": "/assets/apps-logos/kontent_ai.svg",
    "app_name": "kontent_ai",
    "isAvailable": true
  },
  {
    "title": "Kraken Io",
    "description": "Integrate Kraken Io to seamlessly execute automated workflows, synchronize data, and orchestrate Kraken Io actions directly within Alti.",
    "image": "/assets/apps-logos/kraken_io.svg",
    "app_name": "kraken_io",
    "isAvailable": true
  },
  {
    "title": "L2s",
    "description": "Integrate L2s to seamlessly execute automated workflows, synchronize data, and orchestrate L2s actions directly within Alti.",
    "image": "/assets/apps-logos/l2s.svg",
    "app_name": "l2s",
    "isAvailable": true
  },
  {
    "title": "Labs64 Netlicensing",
    "description": "Integrate Labs64 Netlicensing to seamlessly execute automated workflows, synchronize data, and orchestrate Labs64 Netlicensing actions directly within Alti.",
    "image": "/assets/apps-logos/labs64_netlicensing.svg",
    "app_name": "labs64_netlicensing",
    "isAvailable": true
  },
  {
    "title": "Landbot",
    "description": "Integrate Landbot to seamlessly execute automated workflows, synchronize data, and orchestrate Landbot actions directly within Alti.",
    "image": "/assets/apps-logos/landbot.svg",
    "app_name": "landbot",
    "isAvailable": true
  },
  {
    "title": "Langbase",
    "description": "Integrate Langbase to seamlessly execute automated workflows, synchronize data, and orchestrate Langbase actions directly within Alti.",
    "image": "/assets/apps-logos/langbase.svg",
    "app_name": "langbase",
    "isAvailable": true
  },
  {
    "title": "Lastpass",
    "description": "Integrate Lastpass to seamlessly execute automated workflows, synchronize data, and orchestrate Lastpass actions directly within Alti.",
    "image": "/assets/apps-logos/lastpass.svg",
    "app_name": "lastpass",
    "isAvailable": true
  },
  {
    "title": "Launch Darkly",
    "description": "Integrate Launch Darkly to seamlessly execute automated workflows, synchronize data, and orchestrate Launch Darkly actions directly within Alti.",
    "image": "/assets/apps-logos/launch_darkly.svg",
    "app_name": "launch_darkly",
    "isAvailable": true
  },
  {
    "title": "Leadfeeder",
    "description": "Integrate Leadfeeder to seamlessly execute automated workflows, synchronize data, and orchestrate Leadfeeder actions directly within Alti.",
    "image": "/assets/apps-logos/leadfeeder.svg",
    "app_name": "leadfeeder",
    "isAvailable": true
  },
  {
    "title": "Leadoku",
    "description": "Integrate Leadoku to seamlessly execute automated workflows, synchronize data, and orchestrate Leadoku actions directly within Alti.",
    "image": "/assets/apps-logos/leadoku.svg",
    "app_name": "leadoku",
    "isAvailable": true
  },
  {
    "title": "Leiga",
    "description": "Integrate Leiga to seamlessly execute automated workflows, synchronize data, and orchestrate Leiga actions directly within Alti.",
    "image": "/assets/apps-logos/leiga.svg",
    "app_name": "leiga",
    "isAvailable": true
  },
  {
    "title": "Lemlist",
    "description": "Integrate Lemlist to seamlessly execute automated workflows, synchronize data, and orchestrate Lemlist actions directly within Alti.",
    "image": "/assets/apps-logos/lemlist.svg",
    "app_name": "lemlist",
    "isAvailable": true
  },
  {
    "title": "Lessonspace",
    "description": "Integrate Lessonspace to seamlessly execute automated workflows, synchronize data, and orchestrate Lessonspace actions directly within Alti.",
    "image": "/assets/apps-logos/lessonspace.svg",
    "app_name": "lessonspace",
    "isAvailable": true
  },
  {
    "title": "Lever",
    "description": "Integrate Lever to seamlessly execute automated workflows, synchronize data, and orchestrate Lever actions directly within Alti.",
    "image": "/assets/apps-logos/lever.svg",
    "app_name": "lever",
    "isAvailable": true
  },
  {
    "title": "Lever Sandbox",
    "description": "Integrate Lever Sandbox to seamlessly execute automated workflows, synchronize data, and orchestrate Lever Sandbox actions directly within Alti.",
    "image": "/assets/apps-logos/lever_sandbox.svg",
    "app_name": "lever_sandbox",
    "isAvailable": true
  },
  {
    "title": "Leverly",
    "description": "Integrate Leverly to seamlessly execute automated workflows, synchronize data, and orchestrate Leverly actions directly within Alti.",
    "image": "/assets/apps-logos/leverly.svg",
    "app_name": "leverly",
    "isAvailable": true
  },
  {
    "title": "Lexoffice",
    "description": "Integrate Lexoffice to seamlessly execute automated workflows, synchronize data, and orchestrate Lexoffice actions directly within Alti.",
    "image": "/assets/apps-logos/lexoffice.svg",
    "app_name": "lexoffice",
    "isAvailable": true
  },
  {
    "title": "Linguapop",
    "description": "Integrate Linguapop to seamlessly execute automated workflows, synchronize data, and orchestrate Linguapop actions directly within Alti.",
    "image": "/assets/apps-logos/linguapop.svg",
    "app_name": "linguapop",
    "isAvailable": true
  },
  {
    "title": "Listclean",
    "description": "Integrate Listclean to seamlessly execute automated workflows, synchronize data, and orchestrate Listclean actions directly within Alti.",
    "image": "/assets/apps-logos/listclean.svg",
    "app_name": "listclean",
    "isAvailable": true
  },
  {
    "title": "Listennotes",
    "description": "Integrate Listennotes to seamlessly execute automated workflows, synchronize data, and orchestrate Listennotes actions directly within Alti.",
    "image": "/assets/apps-logos/listennotes.svg",
    "app_name": "listennotes",
    "isAvailable": true
  },
  {
    "title": "Livesession",
    "description": "Integrate Livesession to seamlessly execute automated workflows, synchronize data, and orchestrate Livesession actions directly within Alti.",
    "image": "/assets/apps-logos/livesession.svg",
    "app_name": "livesession",
    "isAvailable": true
  },
  {
    "title": "Lodgify",
    "description": "Integrate Lodgify to seamlessly execute automated workflows, synchronize data, and orchestrate Lodgify actions directly within Alti.",
    "image": "/assets/apps-logos/lodgify.svg",
    "app_name": "lodgify",
    "isAvailable": true
  },
  {
    "title": "Logo Dev",
    "description": "Integrate Logo Dev to seamlessly execute automated workflows, synchronize data, and orchestrate Logo Dev actions directly within Alti.",
    "image": "/assets/apps-logos/logo_dev.svg",
    "app_name": "logo_dev",
    "isAvailable": true
  },
  {
    "title": "Loomio",
    "description": "Integrate Loomio to seamlessly execute automated workflows, synchronize data, and orchestrate Loomio actions directly within Alti.",
    "image": "/assets/apps-logos/loomio.svg",
    "app_name": "loomio",
    "isAvailable": true
  },
  {
    "title": "Loyverse",
    "description": "Integrate Loyverse to seamlessly execute automated workflows, synchronize data, and orchestrate Loyverse actions directly within Alti.",
    "image": "/assets/apps-logos/loyverse.svg",
    "app_name": "loyverse",
    "isAvailable": true
  },
  {
    "title": "Magnetic",
    "description": "Integrate Magnetic to seamlessly execute automated workflows, synchronize data, and orchestrate Magnetic actions directly within Alti.",
    "image": "/assets/apps-logos/magnetic.svg",
    "app_name": "magnetic",
    "isAvailable": true
  },
  {
    "title": "Mailbluster",
    "description": "Integrate Mailbluster to seamlessly execute automated workflows, synchronize data, and orchestrate Mailbluster actions directly within Alti.",
    "image": "/assets/apps-logos/mailbluster.svg",
    "app_name": "mailbluster",
    "isAvailable": true
  },
  {
    "title": "Mailboxlayer",
    "description": "Integrate Mailboxlayer to seamlessly execute automated workflows, synchronize data, and orchestrate Mailboxlayer actions directly within Alti.",
    "image": "/assets/apps-logos/mailboxlayer.svg",
    "app_name": "mailboxlayer",
    "isAvailable": true
  },
  {
    "title": "Mailcheck",
    "description": "Integrate Mailcheck to seamlessly execute automated workflows, synchronize data, and orchestrate Mailcheck actions directly within Alti.",
    "image": "/assets/apps-logos/mailcheck.svg",
    "app_name": "mailcheck",
    "isAvailable": true
  },
  {
    "title": "Mailcoach",
    "description": "Integrate Mailcoach to seamlessly execute automated workflows, synchronize data, and orchestrate Mailcoach actions directly within Alti.",
    "image": "/assets/apps-logos/mailcoach.svg",
    "app_name": "mailcoach",
    "isAvailable": true
  },
  {
    "title": "Mailerlite",
    "description": "Integrate Mailerlite to seamlessly execute automated workflows, synchronize data, and orchestrate Mailerlite actions directly within Alti.",
    "image": "/assets/apps-logos/mailerlite.svg",
    "app_name": "mailerlite",
    "isAvailable": true
  },
  {
    "title": "Mailersend",
    "description": "Integrate Mailersend to seamlessly execute automated workflows, synchronize data, and orchestrate Mailersend actions directly within Alti.",
    "image": "/assets/apps-logos/mailersend.svg",
    "app_name": "mailersend",
    "isAvailable": true
  },
  {
    "title": "Mails So",
    "description": "Integrate Mails So to seamlessly execute automated workflows, synchronize data, and orchestrate Mails So actions directly within Alti.",
    "image": "/assets/apps-logos/mails_so.svg",
    "app_name": "mails_so",
    "isAvailable": true
  },
  {
    "title": "Mailsoftly",
    "description": "Integrate Mailsoftly to seamlessly execute automated workflows, synchronize data, and orchestrate Mailsoftly actions directly within Alti.",
    "image": "/assets/apps-logos/mailsoftly.svg",
    "app_name": "mailsoftly",
    "isAvailable": true
  },
  {
    "title": "Maintainx",
    "description": "Integrate Maintainx to seamlessly execute automated workflows, synchronize data, and orchestrate Maintainx actions directly within Alti.",
    "image": "/assets/apps-logos/maintainx.svg",
    "app_name": "maintainx",
    "isAvailable": true
  },
  {
    "title": "Make",
    "description": "Integrate Make to seamlessly execute automated workflows, synchronize data, and orchestrate Make actions directly within Alti.",
    "image": "/assets/apps-logos/make.svg",
    "app_name": "make",
    "isAvailable": true
  },
  {
    "title": "Many Chat",
    "description": "Integrate Many Chat to seamlessly execute automated workflows, synchronize data, and orchestrate Many Chat actions directly within Alti.",
    "image": "/assets/apps-logos/many_chat.svg",
    "app_name": "many_chat",
    "isAvailable": true
  },
  {
    "title": "Mapbox",
    "description": "Integrate Mapbox to seamlessly execute automated workflows, synchronize data, and orchestrate Mapbox actions directly within Alti.",
    "image": "/assets/apps-logos/mapbox.svg",
    "app_name": "mapbox",
    "isAvailable": true
  },
  {
    "title": "Mapulus",
    "description": "Integrate Mapulus to seamlessly execute automated workflows, synchronize data, and orchestrate Mapulus actions directly within Alti.",
    "image": "/assets/apps-logos/mapulus.svg",
    "app_name": "mapulus",
    "isAvailable": true
  },
  {
    "title": "Mboum",
    "description": "Integrate Mboum to seamlessly execute automated workflows, synchronize data, and orchestrate Mboum actions directly within Alti.",
    "image": "/assets/apps-logos/mboum.svg",
    "app_name": "mboum",
    "isAvailable": true
  },
  {
    "title": "Melo",
    "description": "Integrate Melo to seamlessly execute automated workflows, synchronize data, and orchestrate Melo actions directly within Alti.",
    "image": "/assets/apps-logos/melo.svg",
    "app_name": "melo",
    "isAvailable": true
  },
  {
    "title": "Mem",
    "description": "Integrate Mem to seamlessly execute automated workflows, synchronize data, and orchestrate Mem actions directly within Alti.",
    "image": "/assets/apps-logos/mem.svg",
    "app_name": "mem",
    "isAvailable": true
  },
  {
    "title": "Memberspot",
    "description": "Integrate Memberspot to seamlessly execute automated workflows, synchronize data, and orchestrate Memberspot actions directly within Alti.",
    "image": "/assets/apps-logos/memberspot.svg",
    "app_name": "memberspot",
    "isAvailable": true
  },
  {
    "title": "Memberstack",
    "description": "Integrate Memberstack to seamlessly execute automated workflows, synchronize data, and orchestrate Memberstack actions directly within Alti.",
    "image": "/assets/apps-logos/memberstack.svg",
    "app_name": "memberstack",
    "isAvailable": true
  },
  {
    "title": "Membervault",
    "description": "Integrate Membervault to seamlessly execute automated workflows, synchronize data, and orchestrate Membervault actions directly within Alti.",
    "image": "/assets/apps-logos/membervault.svg",
    "app_name": "membervault",
    "isAvailable": true
  },
  {
    "title": "Metaads",
    "description": "Integrate Metaads to seamlessly execute automated workflows, synchronize data, and orchestrate Metaads actions directly within Alti.",
    "image": "/assets/apps-logos/metaads.svg",
    "app_name": "metaads",
    "isAvailable": true
  },
  {
    "title": "Metaphor",
    "description": "Integrate Metaphor to seamlessly execute automated workflows, synchronize data, and orchestrate Metaphor actions directly within Alti.",
    "image": "/assets/apps-logos/metaphor.svg",
    "app_name": "metaphor",
    "isAvailable": true
  },
  {
    "title": "Metatextai",
    "description": "Integrate Metatextai to seamlessly execute automated workflows, synchronize data, and orchestrate Metatextai actions directly within Alti.",
    "image": "/assets/apps-logos/metatextai.svg",
    "app_name": "metatextai",
    "isAvailable": true
  },
  {
    "title": "Mezmo",
    "description": "Integrate Mezmo to seamlessly execute automated workflows, synchronize data, and orchestrate Mezmo actions directly within Alti.",
    "image": "/assets/apps-logos/mezmo.svg",
    "app_name": "mezmo",
    "isAvailable": true
  },
  {
    "title": "Microsoft Tenant",
    "description": "Integrate Microsoft Tenant to seamlessly execute automated workflows, synchronize data, and orchestrate Microsoft Tenant actions directly within Alti.",
    "image": "/assets/apps-logos/microsoft_tenant.svg",
    "app_name": "microsoft_tenant",
    "isAvailable": true
  },
  {
    "title": "Minerstat",
    "description": "Integrate Minerstat to seamlessly execute automated workflows, synchronize data, and orchestrate Minerstat actions directly within Alti.",
    "image": "/assets/apps-logos/minerstat.svg",
    "app_name": "minerstat",
    "isAvailable": true
  },
  {
    "title": "Missive",
    "description": "Integrate Missive to seamlessly execute automated workflows, synchronize data, and orchestrate Missive actions directly within Alti.",
    "image": "/assets/apps-logos/missive.svg",
    "app_name": "missive",
    "isAvailable": true
  },
  {
    "title": "Mistral AI",
    "description": "Integrate Mistral AI to seamlessly execute automated workflows, synchronize data, and orchestrate Mistral AI actions directly within Alti.",
    "image": "/assets/apps-logos/mistral_ai.svg",
    "app_name": "mistral_ai",
    "isAvailable": true
  },
  {
    "title": "Mocean",
    "description": "Integrate Mocean to seamlessly execute automated workflows, synchronize data, and orchestrate Mocean actions directly within Alti.",
    "image": "/assets/apps-logos/mocean.svg",
    "app_name": "mocean",
    "isAvailable": true
  },
  {
    "title": "Moco",
    "description": "Integrate Moco to seamlessly execute automated workflows, synchronize data, and orchestrate Moco actions directly within Alti.",
    "image": "/assets/apps-logos/moco.svg",
    "app_name": "moco",
    "isAvailable": true
  },
  {
    "title": "Modelry",
    "description": "Integrate Modelry to seamlessly execute automated workflows, synchronize data, and orchestrate Modelry actions directly within Alti.",
    "image": "/assets/apps-logos/modelry.svg",
    "app_name": "modelry",
    "isAvailable": true
  },
  {
    "title": "Moneybird",
    "description": "Integrate Moneybird to seamlessly execute automated workflows, synchronize data, and orchestrate Moneybird actions directly within Alti.",
    "image": "/assets/apps-logos/moneybird.svg",
    "app_name": "moneybird",
    "isAvailable": true
  },
  {
    "title": "Moonclerk",
    "description": "Integrate Moonclerk to seamlessly execute automated workflows, synchronize data, and orchestrate Moonclerk actions directly within Alti.",
    "image": "/assets/apps-logos/moonclerk.svg",
    "app_name": "moonclerk",
    "isAvailable": true
  },
  {
    "title": "Moosend",
    "description": "Integrate Moosend to seamlessly execute automated workflows, synchronize data, and orchestrate Moosend actions directly within Alti.",
    "image": "/assets/apps-logos/moosend.svg",
    "app_name": "moosend",
    "isAvailable": true
  },
  {
    "title": "Mopinion",
    "description": "Integrate Mopinion to seamlessly execute automated workflows, synchronize data, and orchestrate Mopinion actions directly within Alti.",
    "image": "/assets/apps-logos/mopinion.svg",
    "app_name": "mopinion",
    "isAvailable": true
  },
  {
    "title": "Moxie",
    "description": "Integrate Moxie to seamlessly execute automated workflows, synchronize data, and orchestrate Moxie actions directly within Alti.",
    "image": "/assets/apps-logos/moxie.svg",
    "app_name": "moxie",
    "isAvailable": true
  },
  {
    "title": "Moz",
    "description": "Integrate Moz to seamlessly execute automated workflows, synchronize data, and orchestrate Moz actions directly within Alti.",
    "image": "/assets/apps-logos/moz.svg",
    "app_name": "moz",
    "isAvailable": true
  },
  {
    "title": "Msg91",
    "description": "Integrate Msg91 to seamlessly execute automated workflows, synchronize data, and orchestrate Msg91 actions directly within Alti.",
    "image": "/assets/apps-logos/msg91.svg",
    "app_name": "msg91",
    "isAvailable": true
  },
  {
    "title": "Mx Technologies",
    "description": "Integrate Mx Technologies to seamlessly execute automated workflows, synchronize data, and orchestrate Mx Technologies actions directly within Alti.",
    "image": "/assets/apps-logos/mx_technologies.svg",
    "app_name": "mx_technologies",
    "isAvailable": true
  },
  {
    "title": "Mx Toolbox",
    "description": "Integrate Mx Toolbox to seamlessly execute automated workflows, synchronize data, and orchestrate Mx Toolbox actions directly within Alti.",
    "image": "/assets/apps-logos/mx_toolbox.svg",
    "app_name": "mx_toolbox",
    "isAvailable": true
  },
  {
    "title": "Nango",
    "description": "Integrate Nango to seamlessly execute automated workflows, synchronize data, and orchestrate Nango actions directly within Alti.",
    "image": "/assets/apps-logos/nango.svg",
    "app_name": "nango",
    "isAvailable": true
  },
  {
    "title": "Nano Nets",
    "description": "Integrate Nano Nets to seamlessly execute automated workflows, synchronize data, and orchestrate Nano Nets actions directly within Alti.",
    "image": "/assets/apps-logos/nano_nets.svg",
    "app_name": "nano_nets",
    "isAvailable": true
  },
  {
    "title": "Nasa",
    "description": "Integrate Nasa to seamlessly execute automated workflows, synchronize data, and orchestrate Nasa actions directly within Alti.",
    "image": "/assets/apps-logos/nasa.svg",
    "app_name": "nasa",
    "isAvailable": true
  },
  {
    "title": "Nasdaq",
    "description": "Integrate Nasdaq to seamlessly execute automated workflows, synchronize data, and orchestrate Nasdaq actions directly within Alti.",
    "image": "/assets/apps-logos/nasdaq.svg",
    "app_name": "nasdaq",
    "isAvailable": true
  },
  {
    "title": "Ncscale",
    "description": "Integrate Ncscale to seamlessly execute automated workflows, synchronize data, and orchestrate Ncscale actions directly within Alti.",
    "image": "/assets/apps-logos/ncscale.svg",
    "app_name": "ncscale",
    "isAvailable": true
  },
  {
    "title": "Needle",
    "description": "Integrate Needle to seamlessly execute automated workflows, synchronize data, and orchestrate Needle actions directly within Alti.",
    "image": "/assets/apps-logos/needle.svg",
    "app_name": "needle",
    "isAvailable": true
  },
  {
    "title": "Netsuite",
    "description": "Integrate Netsuite to seamlessly execute automated workflows, synchronize data, and orchestrate Netsuite actions directly within Alti.",
    "image": "/assets/apps-logos/netsuite.svg",
    "app_name": "netsuite",
    "isAvailable": true
  },
  {
    "title": "Neuronwriter",
    "description": "Integrate Neuronwriter to seamlessly execute automated workflows, synchronize data, and orchestrate Neuronwriter actions directly within Alti.",
    "image": "/assets/apps-logos/neuronwriter.svg",
    "app_name": "neuronwriter",
    "isAvailable": true
  },
  {
    "title": "Neutrino",
    "description": "Integrate Neutrino to seamlessly execute automated workflows, synchronize data, and orchestrate Neutrino actions directly within Alti.",
    "image": "/assets/apps-logos/neutrino.svg",
    "app_name": "neutrino",
    "isAvailable": true
  },
  {
    "title": "Neverbounce",
    "description": "Integrate Neverbounce to seamlessly execute automated workflows, synchronize data, and orchestrate Neverbounce actions directly within Alti.",
    "image": "/assets/apps-logos/neverbounce.svg",
    "app_name": "neverbounce",
    "isAvailable": true
  },
  {
    "title": "New Relic",
    "description": "Integrate New Relic to seamlessly execute automated workflows, synchronize data, and orchestrate New Relic actions directly within Alti.",
    "image": "/assets/apps-logos/new_relic.svg",
    "app_name": "new_relic",
    "isAvailable": true
  },
  {
    "title": "News API",
    "description": "Integrate News API to seamlessly execute automated workflows, synchronize data, and orchestrate News API actions directly within Alti.",
    "image": "/assets/apps-logos/news_api.svg",
    "app_name": "news_api",
    "isAvailable": true
  },
  {
    "title": "Nextdns",
    "description": "Integrate Nextdns to seamlessly execute automated workflows, synchronize data, and orchestrate Nextdns actions directly within Alti.",
    "image": "/assets/apps-logos/nextdns.svg",
    "app_name": "nextdns",
    "isAvailable": true
  },
  {
    "title": "Ninox",
    "description": "Integrate Ninox to seamlessly execute automated workflows, synchronize data, and orchestrate Ninox actions directly within Alti.",
    "image": "/assets/apps-logos/ninox.svg",
    "app_name": "ninox",
    "isAvailable": true
  },
  {
    "title": "Npm",
    "description": "Integrate Npm to seamlessly execute automated workflows, synchronize data, and orchestrate Npm actions directly within Alti.",
    "image": "/assets/apps-logos/npm.svg",
    "app_name": "npm",
    "isAvailable": true
  },
  {
    "title": "Ocr Web Service",
    "description": "Integrate Ocr Web Service to seamlessly execute automated workflows, synchronize data, and orchestrate Ocr Web Service actions directly within Alti.",
    "image": "/assets/apps-logos/ocr_web_service.svg",
    "app_name": "ocr_web_service",
    "isAvailable": true
  },
  {
    "title": "Ocrspace",
    "description": "Integrate Ocrspace to seamlessly execute automated workflows, synchronize data, and orchestrate Ocrspace actions directly within Alti.",
    "image": "/assets/apps-logos/ocrspace.svg",
    "app_name": "ocrspace",
    "isAvailable": true
  },
  {
    "title": "Omnisend",
    "description": "Integrate Omnisend to seamlessly execute automated workflows, synchronize data, and orchestrate Omnisend actions directly within Alti.",
    "image": "/assets/apps-logos/omnisend.svg",
    "app_name": "omnisend",
    "isAvailable": true
  },
  {
    "title": "Oncehub",
    "description": "Integrate Oncehub to seamlessly execute automated workflows, synchronize data, and orchestrate Oncehub actions directly within Alti.",
    "image": "/assets/apps-logos/oncehub.svg",
    "app_name": "oncehub",
    "isAvailable": true
  },
  {
    "title": "Onedesk",
    "description": "Integrate Onedesk to seamlessly execute automated workflows, synchronize data, and orchestrate Onedesk actions directly within Alti.",
    "image": "/assets/apps-logos/onedesk.svg",
    "app_name": "onedesk",
    "isAvailable": true
  },
  {
    "title": "Onesignal Rest API",
    "description": "Integrate Onesignal Rest API to seamlessly execute automated workflows, synchronize data, and orchestrate Onesignal Rest API actions directly within Alti.",
    "image": "/assets/apps-logos/onesignal_rest_api.svg",
    "app_name": "onesignal_rest_api",
    "isAvailable": true
  },
  {
    "title": "Onesignal User Auth",
    "description": "Integrate Onesignal User Auth to seamlessly execute automated workflows, synchronize data, and orchestrate Onesignal User Auth actions directly within Alti.",
    "image": "/assets/apps-logos/onesignal_user_auth.svg",
    "app_name": "onesignal_user_auth",
    "isAvailable": true
  },
  {
    "title": "Open Sea",
    "description": "Integrate Open Sea to seamlessly execute automated workflows, synchronize data, and orchestrate Open Sea actions directly within Alti.",
    "image": "/assets/apps-logos/open_sea.svg",
    "app_name": "open_sea",
    "isAvailable": true
  },
  {
    "title": "Openai",
    "description": "Integrate Openai to seamlessly execute automated workflows, synchronize data, and orchestrate Openai actions directly within Alti.",
    "image": "/assets/apps-logos/openai.svg",
    "app_name": "openai",
    "isAvailable": true
  },
  {
    "title": "Opencage",
    "description": "Integrate Opencage to seamlessly execute automated workflows, synchronize data, and orchestrate Opencage actions directly within Alti.",
    "image": "/assets/apps-logos/opencage.svg",
    "app_name": "opencage",
    "isAvailable": true
  },
  {
    "title": "Opengraph Io",
    "description": "Integrate Opengraph Io to seamlessly execute automated workflows, synchronize data, and orchestrate Opengraph Io actions directly within Alti.",
    "image": "/assets/apps-logos/opengraph_io.svg",
    "app_name": "opengraph_io",
    "isAvailable": true
  },
  {
    "title": "Openperplex",
    "description": "Integrate Openperplex to seamlessly execute automated workflows, synchronize data, and orchestrate Openperplex actions directly within Alti.",
    "image": "/assets/apps-logos/openperplex.svg",
    "app_name": "openperplex",
    "isAvailable": true
  },
  {
    "title": "Openrouter",
    "description": "Integrate Openrouter to seamlessly execute automated workflows, synchronize data, and orchestrate Openrouter actions directly within Alti.",
    "image": "/assets/apps-logos/openrouter.svg",
    "app_name": "openrouter",
    "isAvailable": true
  },
  {
    "title": "Openweather API",
    "description": "Integrate Openweather API to seamlessly execute automated workflows, synchronize data, and orchestrate Openweather API actions directly within Alti.",
    "image": "/assets/apps-logos/openweather_api.svg",
    "app_name": "openweather_api",
    "isAvailable": true
  },
  {
    "title": "Optimoroute",
    "description": "Integrate Optimoroute to seamlessly execute automated workflows, synchronize data, and orchestrate Optimoroute actions directly within Alti.",
    "image": "/assets/apps-logos/optimoroute.svg",
    "app_name": "optimoroute",
    "isAvailable": true
  },
  {
    "title": "Owl Protocol",
    "description": "Integrate Owl Protocol to seamlessly execute automated workflows, synchronize data, and orchestrate Owl Protocol actions directly within Alti.",
    "image": "/assets/apps-logos/owl_protocol.svg",
    "app_name": "owl_protocol",
    "isAvailable": true
  },
  {
    "title": "Page X",
    "description": "Integrate Page X to seamlessly execute automated workflows, synchronize data, and orchestrate Page X actions directly within Alti.",
    "image": "/assets/apps-logos/page_x.svg",
    "app_name": "page_x",
    "isAvailable": true
  },
  {
    "title": "Paradym",
    "description": "Integrate Paradym to seamlessly execute automated workflows, synchronize data, and orchestrate Paradym actions directly within Alti.",
    "image": "/assets/apps-logos/paradym.svg",
    "app_name": "paradym",
    "isAvailable": true
  },
  {
    "title": "Parallel",
    "description": "Integrate Parallel to seamlessly execute automated workflows, synchronize data, and orchestrate Parallel actions directly within Alti.",
    "image": "/assets/apps-logos/parallel.svg",
    "app_name": "parallel",
    "isAvailable": true
  },
  {
    "title": "Parma",
    "description": "Integrate Parma to seamlessly execute automated workflows, synchronize data, and orchestrate Parma actions directly within Alti.",
    "image": "/assets/apps-logos/parma.svg",
    "app_name": "parma",
    "isAvailable": true
  },
  {
    "title": "Parsehub",
    "description": "Integrate Parsehub to seamlessly execute automated workflows, synchronize data, and orchestrate Parsehub actions directly within Alti.",
    "image": "/assets/apps-logos/parsehub.svg",
    "app_name": "parsehub",
    "isAvailable": true
  },
  {
    "title": "Parsera",
    "description": "Integrate Parsera to seamlessly execute automated workflows, synchronize data, and orchestrate Parsera actions directly within Alti.",
    "image": "/assets/apps-logos/parsera.svg",
    "app_name": "parsera",
    "isAvailable": true
  },
  {
    "title": "Parseur",
    "description": "Integrate Parseur to seamlessly execute automated workflows, synchronize data, and orchestrate Parseur actions directly within Alti.",
    "image": "/assets/apps-logos/parseur.svg",
    "app_name": "parseur",
    "isAvailable": true
  },
  {
    "title": "Passcreator",
    "description": "Integrate Passcreator to seamlessly execute automated workflows, synchronize data, and orchestrate Passcreator actions directly within Alti.",
    "image": "/assets/apps-logos/passcreator.svg",
    "app_name": "passcreator",
    "isAvailable": true
  },
  {
    "title": "Passslot",
    "description": "Integrate Passslot to seamlessly execute automated workflows, synchronize data, and orchestrate Passslot actions directly within Alti.",
    "image": "/assets/apps-logos/passslot.svg",
    "app_name": "passslot",
    "isAvailable": true
  },
  {
    "title": "PDF API Io",
    "description": "Integrate PDF API Io to seamlessly execute automated workflows, synchronize data, and orchestrate PDF API Io actions directly within Alti.",
    "image": "/assets/apps-logos/pdf_api_io.svg",
    "app_name": "pdf_api_io",
    "isAvailable": true
  },
  {
    "title": "PDF Co",
    "description": "Integrate PDF Co to seamlessly execute automated workflows, synchronize data, and orchestrate PDF Co actions directly within Alti.",
    "image": "/assets/apps-logos/pdf_co.svg",
    "app_name": "pdf_co",
    "isAvailable": true
  },
  {
    "title": "Pdf4me",
    "description": "Integrate Pdf4me to seamlessly execute automated workflows, synchronize data, and orchestrate Pdf4me actions directly within Alti.",
    "image": "/assets/apps-logos/pdf4me.svg",
    "app_name": "pdf4me",
    "isAvailable": true
  },
  {
    "title": "Pdfless",
    "description": "Integrate Pdfless to seamlessly execute automated workflows, synchronize data, and orchestrate Pdfless actions directly within Alti.",
    "image": "/assets/apps-logos/pdfless.svg",
    "app_name": "pdfless",
    "isAvailable": true
  },
  {
    "title": "Pdfmonkey",
    "description": "Integrate Pdfmonkey to seamlessly execute automated workflows, synchronize data, and orchestrate Pdfmonkey actions directly within Alti.",
    "image": "/assets/apps-logos/pdfmonkey.svg",
    "app_name": "pdfmonkey",
    "isAvailable": true
  },
  {
    "title": "Perigon",
    "description": "Integrate Perigon to seamlessly execute automated workflows, synchronize data, and orchestrate Perigon actions directly within Alti.",
    "image": "/assets/apps-logos/perigon.svg",
    "app_name": "perigon",
    "isAvailable": true
  },
  {
    "title": "Persistiq",
    "description": "Integrate Persistiq to seamlessly execute automated workflows, synchronize data, and orchestrate Persistiq actions directly within Alti.",
    "image": "/assets/apps-logos/persistiq.svg",
    "app_name": "persistiq",
    "isAvailable": true
  },
  {
    "title": "Pexels",
    "description": "Integrate Pexels to seamlessly execute automated workflows, synchronize data, and orchestrate Pexels actions directly within Alti.",
    "image": "/assets/apps-logos/pexels.svg",
    "app_name": "pexels",
    "isAvailable": true
  },
  {
    "title": "Phantombuster",
    "description": "Integrate Phantombuster to seamlessly execute automated workflows, synchronize data, and orchestrate Phantombuster actions directly within Alti.",
    "image": "/assets/apps-logos/phantombuster.svg",
    "app_name": "phantombuster",
    "isAvailable": true
  },
  {
    "title": "Piggy",
    "description": "Integrate Piggy to seamlessly execute automated workflows, synchronize data, and orchestrate Piggy actions directly within Alti.",
    "image": "/assets/apps-logos/piggy.svg",
    "app_name": "piggy",
    "isAvailable": true
  },
  {
    "title": "Piloterr",
    "description": "Integrate Piloterr to seamlessly execute automated workflows, synchronize data, and orchestrate Piloterr actions directly within Alti.",
    "image": "/assets/apps-logos/piloterr.svg",
    "app_name": "piloterr",
    "isAvailable": true
  },
  {
    "title": "Pilvio",
    "description": "Integrate Pilvio to seamlessly execute automated workflows, synchronize data, and orchestrate Pilvio actions directly within Alti.",
    "image": "/assets/apps-logos/pilvio.svg",
    "app_name": "pilvio",
    "isAvailable": true
  },
  {
    "title": "Pingdom",
    "description": "Integrate Pingdom to seamlessly execute automated workflows, synchronize data, and orchestrate Pingdom actions directly within Alti.",
    "image": "/assets/apps-logos/pingdom.svg",
    "app_name": "pingdom",
    "isAvailable": true
  },
  {
    "title": "Pipeline CRM",
    "description": "Integrate Pipeline CRM to seamlessly execute automated workflows, synchronize data, and orchestrate Pipeline CRM actions directly within Alti.",
    "image": "/assets/apps-logos/pipeline_crm.svg",
    "app_name": "pipeline_crm",
    "isAvailable": true
  },
  {
    "title": "Placid",
    "description": "Integrate Placid to seamlessly execute automated workflows, synchronize data, and orchestrate Placid actions directly within Alti.",
    "image": "/assets/apps-logos/placid.svg",
    "app_name": "placid",
    "isAvailable": true
  },
  {
    "title": "Plain",
    "description": "Integrate Plain to seamlessly execute automated workflows, synchronize data, and orchestrate Plain actions directly within Alti.",
    "image": "/assets/apps-logos/plain.svg",
    "app_name": "plain",
    "isAvailable": true
  },
  {
    "title": "Plasmic",
    "description": "Integrate Plasmic to seamlessly execute automated workflows, synchronize data, and orchestrate Plasmic actions directly within Alti.",
    "image": "/assets/apps-logos/plasmic.svg",
    "app_name": "plasmic",
    "isAvailable": true
  },
  {
    "title": "Platerecognizer",
    "description": "Integrate Platerecognizer to seamlessly execute automated workflows, synchronize data, and orchestrate Platerecognizer actions directly within Alti.",
    "image": "/assets/apps-logos/platerecognizer.svg",
    "app_name": "platerecognizer",
    "isAvailable": true
  },
  {
    "title": "Plisio",
    "description": "Integrate Plisio to seamlessly execute automated workflows, synchronize data, and orchestrate Plisio actions directly within Alti.",
    "image": "/assets/apps-logos/plisio.svg",
    "app_name": "plisio",
    "isAvailable": true
  },
  {
    "title": "Polygon",
    "description": "Integrate Polygon to seamlessly execute automated workflows, synchronize data, and orchestrate Polygon actions directly within Alti.",
    "image": "/assets/apps-logos/polygon.svg",
    "app_name": "polygon",
    "isAvailable": true
  },
  {
    "title": "Polygon Io",
    "description": "Integrate Polygon Io to seamlessly execute automated workflows, synchronize data, and orchestrate Polygon Io actions directly within Alti.",
    "image": "/assets/apps-logos/polygon_io.svg",
    "app_name": "polygon_io",
    "isAvailable": true
  },
  {
    "title": "Poptin",
    "description": "Integrate Poptin to seamlessly execute automated workflows, synchronize data, and orchestrate Poptin actions directly within Alti.",
    "image": "/assets/apps-logos/poptin.svg",
    "app_name": "poptin",
    "isAvailable": true
  },
  {
    "title": "Postgrid",
    "description": "Integrate Postgrid to seamlessly execute automated workflows, synchronize data, and orchestrate Postgrid actions directly within Alti.",
    "image": "/assets/apps-logos/postgrid.svg",
    "app_name": "postgrid",
    "isAvailable": true
  },
  {
    "title": "Postgrid Verify",
    "description": "Integrate Postgrid Verify to seamlessly execute automated workflows, synchronize data, and orchestrate Postgrid Verify actions directly within Alti.",
    "image": "/assets/apps-logos/postgrid_verify.svg",
    "app_name": "postgrid_verify",
    "isAvailable": true
  },
  {
    "title": "Postmark",
    "description": "Integrate Postmark to seamlessly execute automated workflows, synchronize data, and orchestrate Postmark actions directly within Alti.",
    "image": "/assets/apps-logos/postmark.svg",
    "app_name": "postmark",
    "isAvailable": true
  },
  {
    "title": "Precoro",
    "description": "Integrate Precoro to seamlessly execute automated workflows, synchronize data, and orchestrate Precoro actions directly within Alti.",
    "image": "/assets/apps-logos/precoro.svg",
    "app_name": "precoro",
    "isAvailable": true
  },
  {
    "title": "Prerender",
    "description": "Integrate Prerender to seamlessly execute automated workflows, synchronize data, and orchestrate Prerender actions directly within Alti.",
    "image": "/assets/apps-logos/prerender.svg",
    "app_name": "prerender",
    "isAvailable": true
  },
  {
    "title": "Printautopilot",
    "description": "Integrate Printautopilot to seamlessly execute automated workflows, synchronize data, and orchestrate Printautopilot actions directly within Alti.",
    "image": "/assets/apps-logos/printautopilot.svg",
    "app_name": "printautopilot",
    "isAvailable": true
  },
  {
    "title": "Printnode",
    "description": "Integrate Printnode to seamlessly execute automated workflows, synchronize data, and orchestrate Printnode actions directly within Alti.",
    "image": "/assets/apps-logos/printnode.svg",
    "app_name": "printnode",
    "isAvailable": true
  },
  {
    "title": "Prisma",
    "description": "Integrate Prisma to seamlessly execute automated workflows, synchronize data, and orchestrate Prisma actions directly within Alti.",
    "image": "/assets/apps-logos/prisma.svg",
    "app_name": "prisma",
    "isAvailable": true
  },
  {
    "title": "Prismic",
    "description": "Integrate Prismic to seamlessly execute automated workflows, synchronize data, and orchestrate Prismic actions directly within Alti.",
    "image": "/assets/apps-logos/prismic.svg",
    "app_name": "prismic",
    "isAvailable": true
  },
  {
    "title": "Procfu",
    "description": "Integrate Procfu to seamlessly execute automated workflows, synchronize data, and orchestrate Procfu actions directly within Alti.",
    "image": "/assets/apps-logos/procfu.svg",
    "app_name": "procfu",
    "isAvailable": true
  },
  {
    "title": "Productboard",
    "description": "Integrate Productboard to seamlessly execute automated workflows, synchronize data, and orchestrate Productboard actions directly within Alti.",
    "image": "/assets/apps-logos/productboard.svg",
    "app_name": "productboard",
    "isAvailable": true
  },
  {
    "title": "Productlane",
    "description": "Integrate Productlane to seamlessly execute automated workflows, synchronize data, and orchestrate Productlane actions directly within Alti.",
    "image": "/assets/apps-logos/productlane.svg",
    "app_name": "productlane",
    "isAvailable": true
  },
  {
    "title": "Project Bubble",
    "description": "Integrate Project Bubble to seamlessly execute automated workflows, synchronize data, and orchestrate Project Bubble actions directly within Alti.",
    "image": "/assets/apps-logos/project_bubble.svg",
    "app_name": "project_bubble",
    "isAvailable": true
  },
  {
    "title": "Promptmate Io",
    "description": "Integrate Promptmate Io to seamlessly execute automated workflows, synchronize data, and orchestrate Promptmate Io actions directly within Alti.",
    "image": "/assets/apps-logos/promptmate_io.svg",
    "app_name": "promptmate_io",
    "isAvailable": true
  },
  {
    "title": "Proofly",
    "description": "Integrate Proofly to seamlessly execute automated workflows, synchronize data, and orchestrate Proofly actions directly within Alti.",
    "image": "/assets/apps-logos/proofly.svg",
    "app_name": "proofly",
    "isAvailable": true
  },
  {
    "title": "Proxiedmail",
    "description": "Integrate Proxiedmail to seamlessly execute automated workflows, synchronize data, and orchestrate Proxiedmail actions directly within Alti.",
    "image": "/assets/apps-logos/proxiedmail.svg",
    "app_name": "proxiedmail",
    "isAvailable": true
  },
  {
    "title": "Pushover",
    "description": "Integrate Pushover to seamlessly execute automated workflows, synchronize data, and orchestrate Pushover actions directly within Alti.",
    "image": "/assets/apps-logos/pushover.svg",
    "app_name": "pushover",
    "isAvailable": true
  },
  {
    "title": "Quaderno",
    "description": "Integrate Quaderno to seamlessly execute automated workflows, synchronize data, and orchestrate Quaderno actions directly within Alti.",
    "image": "/assets/apps-logos/quaderno.svg",
    "app_name": "quaderno",
    "isAvailable": true
  },
  {
    "title": "Qualaroo",
    "description": "Integrate Qualaroo to seamlessly execute automated workflows, synchronize data, and orchestrate Qualaroo actions directly within Alti.",
    "image": "/assets/apps-logos/qualaroo.svg",
    "app_name": "qualaroo",
    "isAvailable": true
  },
  {
    "title": "Radar",
    "description": "Integrate Radar to seamlessly execute automated workflows, synchronize data, and orchestrate Radar actions directly within Alti.",
    "image": "/assets/apps-logos/radar.svg",
    "app_name": "radar",
    "isAvailable": true
  },
  {
    "title": "Rafflys",
    "description": "Integrate Rafflys to seamlessly execute automated workflows, synchronize data, and orchestrate Rafflys actions directly within Alti.",
    "image": "/assets/apps-logos/rafflys.svg",
    "app_name": "rafflys",
    "isAvailable": true
  },
  {
    "title": "Ragic",
    "description": "Integrate Ragic to seamlessly execute automated workflows, synchronize data, and orchestrate Ragic actions directly within Alti.",
    "image": "/assets/apps-logos/ragic.svg",
    "app_name": "ragic",
    "isAvailable": true
  },
  {
    "title": "Raisely",
    "description": "Integrate Raisely to seamlessly execute automated workflows, synchronize data, and orchestrate Raisely actions directly within Alti.",
    "image": "/assets/apps-logos/raisely.svg",
    "app_name": "raisely",
    "isAvailable": true
  },
  {
    "title": "Ravenseotools",
    "description": "Integrate Ravenseotools to seamlessly execute automated workflows, synchronize data, and orchestrate Ravenseotools actions directly within Alti.",
    "image": "/assets/apps-logos/ravenseotools.svg",
    "app_name": "ravenseotools",
    "isAvailable": true
  },
  {
    "title": "Re Amaze",
    "description": "Integrate Re Amaze to seamlessly execute automated workflows, synchronize data, and orchestrate Re Amaze actions directly within Alti.",
    "image": "/assets/apps-logos/re_amaze.svg",
    "app_name": "re_amaze",
    "isAvailable": true
  },
  {
    "title": "Realphonevalidation",
    "description": "Integrate Realphonevalidation to seamlessly execute automated workflows, synchronize data, and orchestrate Realphonevalidation actions directly within Alti.",
    "image": "/assets/apps-logos/realphonevalidation.svg",
    "app_name": "realphonevalidation",
    "isAvailable": true
  },
  {
    "title": "Recruitee",
    "description": "Integrate Recruitee to seamlessly execute automated workflows, synchronize data, and orchestrate Recruitee actions directly within Alti.",
    "image": "/assets/apps-logos/recruitee.svg",
    "app_name": "recruitee",
    "isAvailable": true
  },
  {
    "title": "Refiner",
    "description": "Integrate Refiner to seamlessly execute automated workflows, synchronize data, and orchestrate Refiner actions directly within Alti.",
    "image": "/assets/apps-logos/refiner.svg",
    "app_name": "refiner",
    "isAvailable": true
  },
  {
    "title": "Remarkety",
    "description": "Integrate Remarkety to seamlessly execute automated workflows, synchronize data, and orchestrate Remarkety actions directly within Alti.",
    "image": "/assets/apps-logos/remarkety.svg",
    "app_name": "remarkety",
    "isAvailable": true
  },
  {
    "title": "Remote Retrieval",
    "description": "Integrate Remote Retrieval to seamlessly execute automated workflows, synchronize data, and orchestrate Remote Retrieval actions directly within Alti.",
    "image": "/assets/apps-logos/remote_retrieval.svg",
    "app_name": "remote_retrieval",
    "isAvailable": true
  },
  {
    "title": "Remove Bg",
    "description": "Integrate Remove Bg to seamlessly execute automated workflows, synchronize data, and orchestrate Remove Bg actions directly within Alti.",
    "image": "/assets/apps-logos/remove_bg.svg",
    "app_name": "remove_bg",
    "isAvailable": true
  },
  {
    "title": "Render",
    "description": "Integrate Render to seamlessly execute automated workflows, synchronize data, and orchestrate Render actions directly within Alti.",
    "image": "/assets/apps-logos/render.svg",
    "app_name": "render",
    "isAvailable": true
  },
  {
    "title": "Renderform",
    "description": "Integrate Renderform to seamlessly execute automated workflows, synchronize data, and orchestrate Renderform actions directly within Alti.",
    "image": "/assets/apps-logos/renderform.svg",
    "app_name": "renderform",
    "isAvailable": true
  },
  {
    "title": "Repairshopr",
    "description": "Integrate Repairshopr to seamlessly execute automated workflows, synchronize data, and orchestrate Repairshopr actions directly within Alti.",
    "image": "/assets/apps-logos/repairshopr.svg",
    "app_name": "repairshopr",
    "isAvailable": true
  },
  {
    "title": "Replicate",
    "description": "Integrate Replicate to seamlessly execute automated workflows, synchronize data, and orchestrate Replicate actions directly within Alti.",
    "image": "/assets/apps-logos/replicate.svg",
    "app_name": "replicate",
    "isAvailable": true
  },
  {
    "title": "Reply",
    "description": "Integrate Reply to seamlessly execute automated workflows, synchronize data, and orchestrate Reply actions directly within Alti.",
    "image": "/assets/apps-logos/reply.svg",
    "app_name": "reply",
    "isAvailable": true
  },
  {
    "title": "Reply Io",
    "description": "Integrate Reply Io to seamlessly execute automated workflows, synchronize data, and orchestrate Reply Io actions directly within Alti.",
    "image": "/assets/apps-logos/reply_io.svg",
    "app_name": "reply_io",
    "isAvailable": true
  },
  {
    "title": "Resend",
    "description": "Integrate Resend to seamlessly execute automated workflows, synchronize data, and orchestrate Resend actions directly within Alti.",
    "image": "/assets/apps-logos/resend.svg",
    "app_name": "resend",
    "isAvailable": true
  },
  {
    "title": "Respond Io",
    "description": "Integrate Respond Io to seamlessly execute automated workflows, synchronize data, and orchestrate Respond Io actions directly within Alti.",
    "image": "/assets/apps-logos/respond_io.svg",
    "app_name": "respond_io",
    "isAvailable": true
  },
  {
    "title": "Retailed",
    "description": "Integrate Retailed to seamlessly execute automated workflows, synchronize data, and orchestrate Retailed actions directly within Alti.",
    "image": "/assets/apps-logos/retailed.svg",
    "app_name": "retailed",
    "isAvailable": true
  },
  {
    "title": "Retently",
    "description": "Integrate Retently to seamlessly execute automated workflows, synchronize data, and orchestrate Retently actions directly within Alti.",
    "image": "/assets/apps-logos/retently.svg",
    "app_name": "retently",
    "isAvailable": true
  },
  {
    "title": "Rev AI",
    "description": "Integrate Rev AI to seamlessly execute automated workflows, synchronize data, and orchestrate Rev AI actions directly within Alti.",
    "image": "/assets/apps-logos/rev_ai.svg",
    "app_name": "rev_ai",
    "isAvailable": true
  },
  {
    "title": "Revolt",
    "description": "Integrate Revolt to seamlessly execute automated workflows, synchronize data, and orchestrate Revolt actions directly within Alti.",
    "image": "/assets/apps-logos/revolt.svg",
    "app_name": "revolt",
    "isAvailable": true
  },
  {
    "title": "Ring Central",
    "description": "Integrate Ring Central to seamlessly execute automated workflows, synchronize data, and orchestrate Ring Central actions directly within Alti.",
    "image": "/assets/apps-logos/ring_central.svg",
    "app_name": "ring_central",
    "isAvailable": true
  },
  {
    "title": "Rippling",
    "description": "Integrate Rippling to seamlessly execute automated workflows, synchronize data, and orchestrate Rippling actions directly within Alti.",
    "image": "/assets/apps-logos/rippling.svg",
    "app_name": "rippling",
    "isAvailable": true
  },
  {
    "title": "Ritekit",
    "description": "Integrate Ritekit to seamlessly execute automated workflows, synchronize data, and orchestrate Ritekit actions directly within Alti.",
    "image": "/assets/apps-logos/ritekit.svg",
    "app_name": "ritekit",
    "isAvailable": true
  },
  {
    "title": "Rkvst",
    "description": "Integrate Rkvst to seamlessly execute automated workflows, synchronize data, and orchestrate Rkvst actions directly within Alti.",
    "image": "/assets/apps-logos/rkvst.svg",
    "app_name": "rkvst",
    "isAvailable": true
  },
  {
    "title": "Rocket Reach",
    "description": "Integrate Rocket Reach to seamlessly execute automated workflows, synchronize data, and orchestrate Rocket Reach actions directly within Alti.",
    "image": "/assets/apps-logos/rocket_reach.svg",
    "app_name": "rocket_reach",
    "isAvailable": true
  },
  {
    "title": "Rocketlane",
    "description": "Integrate Rocketlane to seamlessly execute automated workflows, synchronize data, and orchestrate Rocketlane actions directly within Alti.",
    "image": "/assets/apps-logos/rocketlane.svg",
    "app_name": "rocketlane",
    "isAvailable": true
  },
  {
    "title": "Rootly",
    "description": "Integrate Rootly to seamlessly execute automated workflows, synchronize data, and orchestrate Rootly actions directly within Alti.",
    "image": "/assets/apps-logos/rootly.svg",
    "app_name": "rootly",
    "isAvailable": true
  },
  {
    "title": "Rosette Text Analytics",
    "description": "Integrate Rosette Text Analytics to seamlessly execute automated workflows, synchronize data, and orchestrate Rosette Text Analytics actions directly within Alti.",
    "image": "/assets/apps-logos/rosette_text_analytics.svg",
    "app_name": "rosette_text_analytics",
    "isAvailable": true
  },
  {
    "title": "Route4me",
    "description": "Integrate Route4me to seamlessly execute automated workflows, synchronize data, and orchestrate Route4me actions directly within Alti.",
    "image": "/assets/apps-logos/route4me.svg",
    "app_name": "route4me",
    "isAvailable": true
  },
  {
    "title": "Safetyculture",
    "description": "Integrate Safetyculture to seamlessly execute automated workflows, synchronize data, and orchestrate Safetyculture actions directly within Alti.",
    "image": "/assets/apps-logos/safetyculture.svg",
    "app_name": "safetyculture",
    "isAvailable": true
  },
  {
    "title": "Sage",
    "description": "Integrate Sage to seamlessly execute automated workflows, synchronize data, and orchestrate Sage actions directly within Alti.",
    "image": "/assets/apps-logos/sage.svg",
    "app_name": "sage",
    "isAvailable": true
  },
  {
    "title": "Salesforce Marketing Cloud",
    "description": "Integrate Salesforce Marketing Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Salesforce Marketing Cloud actions directly within Alti.",
    "image": "/assets/apps-logos/salesforce_marketing_cloud.svg",
    "app_name": "salesforce_marketing_cloud",
    "isAvailable": true
  },
  {
    "title": "Salesforce Service Cloud",
    "description": "Integrate Salesforce Service Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Salesforce Service Cloud actions directly within Alti.",
    "image": "/assets/apps-logos/salesforce_service_cloud.svg",
    "app_name": "salesforce_service_cloud",
    "isAvailable": true
  },
  {
    "title": "Sap Successfactors",
    "description": "Integrate Sap Successfactors to seamlessly execute automated workflows, synchronize data, and orchestrate Sap Successfactors actions directly within Alti.",
    "image": "/assets/apps-logos/sap_successfactors.svg",
    "app_name": "sap_successfactors",
    "isAvailable": true
  },
  {
    "title": "Satismeter",
    "description": "Integrate Satismeter to seamlessly execute automated workflows, synchronize data, and orchestrate Satismeter actions directly within Alti.",
    "image": "/assets/apps-logos/satismeter.svg",
    "app_name": "satismeter",
    "isAvailable": true
  },
  {
    "title": "Scrape Do",
    "description": "Integrate Scrape Do to seamlessly execute automated workflows, synchronize data, and orchestrate Scrape Do actions directly within Alti.",
    "image": "/assets/apps-logos/scrape_do.svg",
    "app_name": "scrape_do",
    "isAvailable": true
  },
  {
    "title": "Scrapegraph AI",
    "description": "Integrate Scrapegraph AI to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapegraph AI actions directly within Alti.",
    "image": "/assets/apps-logos/scrapegraph_ai.svg",
    "app_name": "scrapegraph_ai",
    "isAvailable": true
  },
  {
    "title": "Scrapfly",
    "description": "Integrate Scrapfly to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapfly actions directly within Alti.",
    "image": "/assets/apps-logos/scrapfly.svg",
    "app_name": "scrapfly",
    "isAvailable": true
  },
  {
    "title": "Scrapingant",
    "description": "Integrate Scrapingant to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapingant actions directly within Alti.",
    "image": "/assets/apps-logos/scrapingant.svg",
    "app_name": "scrapingant",
    "isAvailable": true
  },
  {
    "title": "Scrapingbee",
    "description": "Integrate Scrapingbee to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapingbee actions directly within Alti.",
    "image": "/assets/apps-logos/scrapingbee.svg",
    "app_name": "scrapingbee",
    "isAvailable": true
  },
  {
    "title": "Screenshot Fyi",
    "description": "Integrate Screenshot Fyi to seamlessly execute automated workflows, synchronize data, and orchestrate Screenshot Fyi actions directly within Alti.",
    "image": "/assets/apps-logos/screenshot_fyi.svg",
    "app_name": "screenshot_fyi",
    "isAvailable": true
  },
  {
    "title": "Screenshotone",
    "description": "Integrate Screenshotone to seamlessly execute automated workflows, synchronize data, and orchestrate Screenshotone actions directly within Alti.",
    "image": "/assets/apps-logos/screenshotone.svg",
    "app_name": "screenshotone",
    "isAvailable": true
  },
  {
    "title": "Seat Geek",
    "description": "Integrate Seat Geek to seamlessly execute automated workflows, synchronize data, and orchestrate Seat Geek actions directly within Alti.",
    "image": "/assets/apps-logos/seat_geek.svg",
    "app_name": "seat_geek",
    "isAvailable": true
  },
  {
    "title": "Securitytrails",
    "description": "Integrate Securitytrails to seamlessly execute automated workflows, synchronize data, and orchestrate Securitytrails actions directly within Alti.",
    "image": "/assets/apps-logos/securitytrails.svg",
    "app_name": "securitytrails",
    "isAvailable": true
  },
  {
    "title": "Segment",
    "description": "Integrate Segment to seamlessly execute automated workflows, synchronize data, and orchestrate Segment actions directly within Alti.",
    "image": "/assets/apps-logos/segment.svg",
    "app_name": "segment",
    "isAvailable": true
  },
  {
    "title": "Segmetrics",
    "description": "Integrate Segmetrics to seamlessly execute automated workflows, synchronize data, and orchestrate Segmetrics actions directly within Alti.",
    "image": "/assets/apps-logos/segmetrics.svg",
    "app_name": "segmetrics",
    "isAvailable": true
  },
  {
    "title": "Seismic",
    "description": "Integrate Seismic to seamlessly execute automated workflows, synchronize data, and orchestrate Seismic actions directly within Alti.",
    "image": "/assets/apps-logos/seismic.svg",
    "app_name": "seismic",
    "isAvailable": true
  },
  {
    "title": "Semrush",
    "description": "Integrate Semrush to seamlessly execute automated workflows, synchronize data, and orchestrate Semrush actions directly within Alti.",
    "image": "/assets/apps-logos/semrush.svg",
    "app_name": "semrush",
    "isAvailable": true
  },
  {
    "title": "Sendbird",
    "description": "Integrate Sendbird to seamlessly execute automated workflows, synchronize data, and orchestrate Sendbird actions directly within Alti.",
    "image": "/assets/apps-logos/sendbird.svg",
    "app_name": "sendbird",
    "isAvailable": true
  },
  {
    "title": "Sendbird AI Chabot",
    "description": "Integrate Sendbird AI Chabot to seamlessly execute automated workflows, synchronize data, and orchestrate Sendbird AI Chabot actions directly within Alti.",
    "image": "/assets/apps-logos/sendbird_ai_chabot.svg",
    "app_name": "sendbird_ai_chabot",
    "isAvailable": true
  },
  {
    "title": "Sendfox",
    "description": "Integrate Sendfox to seamlessly execute automated workflows, synchronize data, and orchestrate Sendfox actions directly within Alti.",
    "image": "/assets/apps-logos/sendfox.svg",
    "app_name": "sendfox",
    "isAvailable": true
  },
  {
    "title": "Sendlane",
    "description": "Integrate Sendlane to seamlessly execute automated workflows, synchronize data, and orchestrate Sendlane actions directly within Alti.",
    "image": "/assets/apps-logos/sendlane.svg",
    "app_name": "sendlane",
    "isAvailable": true
  },
  {
    "title": "Sendloop",
    "description": "Integrate Sendloop to seamlessly execute automated workflows, synchronize data, and orchestrate Sendloop actions directly within Alti.",
    "image": "/assets/apps-logos/sendloop.svg",
    "app_name": "sendloop",
    "isAvailable": true
  },
  {
    "title": "Sendspark",
    "description": "Integrate Sendspark to seamlessly execute automated workflows, synchronize data, and orchestrate Sendspark actions directly within Alti.",
    "image": "/assets/apps-logos/sendspark.svg",
    "app_name": "sendspark",
    "isAvailable": true
  },
  {
    "title": "Sensibo",
    "description": "Integrate Sensibo to seamlessly execute automated workflows, synchronize data, and orchestrate Sensibo actions directly within Alti.",
    "image": "/assets/apps-logos/sensibo.svg",
    "app_name": "sensibo",
    "isAvailable": true
  },
  {
    "title": "Seqera",
    "description": "Integrate Seqera to seamlessly execute automated workflows, synchronize data, and orchestrate Seqera actions directly within Alti.",
    "image": "/assets/apps-logos/seqera.svg",
    "app_name": "seqera",
    "isAvailable": true
  },
  {
    "title": "Serpdog",
    "description": "Integrate Serpdog to seamlessly execute automated workflows, synchronize data, and orchestrate Serpdog actions directly within Alti.",
    "image": "/assets/apps-logos/serpdog.svg",
    "app_name": "serpdog",
    "isAvailable": true
  },
  {
    "title": "Serply",
    "description": "Integrate Serply to seamlessly execute automated workflows, synchronize data, and orchestrate Serply actions directly within Alti.",
    "image": "/assets/apps-logos/serply.svg",
    "app_name": "serply",
    "isAvailable": true
  },
  {
    "title": "Sevdesk",
    "description": "Integrate Sevdesk to seamlessly execute automated workflows, synchronize data, and orchestrate Sevdesk actions directly within Alti.",
    "image": "/assets/apps-logos/sevdesk.svg",
    "app_name": "sevdesk",
    "isAvailable": true
  },
  {
    "title": "Shipengine",
    "description": "Integrate Shipengine to seamlessly execute automated workflows, synchronize data, and orchestrate Shipengine actions directly within Alti.",
    "image": "/assets/apps-logos/shipengine.svg",
    "app_name": "shipengine",
    "isAvailable": true
  },
  {
    "title": "Short Io",
    "description": "Integrate Short Io to seamlessly execute automated workflows, synchronize data, and orchestrate Short Io actions directly within Alti.",
    "image": "/assets/apps-logos/short_io.svg",
    "app_name": "short_io",
    "isAvailable": true
  },
  {
    "title": "Short Menu",
    "description": "Integrate Short Menu to seamlessly execute automated workflows, synchronize data, and orchestrate Short Menu actions directly within Alti.",
    "image": "/assets/apps-logos/short_menu.svg",
    "app_name": "short_menu",
    "isAvailable": true
  },
  {
    "title": "Shorten Rest",
    "description": "Integrate Shorten Rest to seamlessly execute automated workflows, synchronize data, and orchestrate Shorten Rest actions directly within Alti.",
    "image": "/assets/apps-logos/shorten_rest.svg",
    "app_name": "shorten_rest",
    "isAvailable": true
  },
  {
    "title": "Shortpixel",
    "description": "Integrate Shortpixel to seamlessly execute automated workflows, synchronize data, and orchestrate Shortpixel actions directly within Alti.",
    "image": "/assets/apps-logos/shortpixel.svg",
    "app_name": "shortpixel",
    "isAvailable": true
  },
  {
    "title": "Shotstack",
    "description": "Integrate Shotstack to seamlessly execute automated workflows, synchronize data, and orchestrate Shotstack actions directly within Alti.",
    "image": "/assets/apps-logos/shotstack.svg",
    "app_name": "shotstack",
    "isAvailable": true
  },
  {
    "title": "Sidetracker",
    "description": "Integrate Sidetracker to seamlessly execute automated workflows, synchronize data, and orchestrate Sidetracker actions directly within Alti.",
    "image": "/assets/apps-logos/sidetracker.svg",
    "app_name": "sidetracker",
    "isAvailable": true
  },
  {
    "title": "Signaturely",
    "description": "Integrate Signaturely to seamlessly execute automated workflows, synchronize data, and orchestrate Signaturely actions directly within Alti.",
    "image": "/assets/apps-logos/signaturely.svg",
    "app_name": "signaturely",
    "isAvailable": true
  },
  {
    "title": "Signpath",
    "description": "Integrate Signpath to seamlessly execute automated workflows, synchronize data, and orchestrate Signpath actions directly within Alti.",
    "image": "/assets/apps-logos/signpath.svg",
    "app_name": "signpath",
    "isAvailable": true
  },
  {
    "title": "Signwell",
    "description": "Integrate Signwell to seamlessly execute automated workflows, synchronize data, and orchestrate Signwell actions directly within Alti.",
    "image": "/assets/apps-logos/signwell.svg",
    "app_name": "signwell",
    "isAvailable": true
  },
  {
    "title": "Similarweb Digitalrank API",
    "description": "Integrate Similarweb Digitalrank API to seamlessly execute automated workflows, synchronize data, and orchestrate Similarweb Digitalrank API actions directly within Alti.",
    "image": "/assets/apps-logos/similarweb_digitalrank_api.svg",
    "app_name": "similarweb_digitalrank_api",
    "isAvailable": true
  },
  {
    "title": "Simla Com",
    "description": "Integrate Simla Com to seamlessly execute automated workflows, synchronize data, and orchestrate Simla Com actions directly within Alti.",
    "image": "/assets/apps-logos/simla_com.svg",
    "app_name": "simla_com",
    "isAvailable": true
  },
  {
    "title": "Simple Analytics",
    "description": "Integrate Simple Analytics to seamlessly execute automated workflows, synchronize data, and orchestrate Simple Analytics actions directly within Alti.",
    "image": "/assets/apps-logos/simple_analytics.svg",
    "app_name": "simple_analytics",
    "isAvailable": true
  },
  {
    "title": "Sitespeakai",
    "description": "Integrate Sitespeakai to seamlessly execute automated workflows, synchronize data, and orchestrate Sitespeakai actions directly within Alti.",
    "image": "/assets/apps-logos/sitespeakai.svg",
    "app_name": "sitespeakai",
    "isAvailable": true
  },
  {
    "title": "Skyfire",
    "description": "Integrate Skyfire to seamlessly execute automated workflows, synchronize data, and orchestrate Skyfire actions directly within Alti.",
    "image": "/assets/apps-logos/skyfire.svg",
    "app_name": "skyfire",
    "isAvailable": true
  },
  {
    "title": "Smartproxy",
    "description": "Integrate Smartproxy to seamlessly execute automated workflows, synchronize data, and orchestrate Smartproxy actions directly within Alti.",
    "image": "/assets/apps-logos/smartproxy.svg",
    "app_name": "smartproxy",
    "isAvailable": true
  },
  {
    "title": "Smartrecruiters",
    "description": "Integrate Smartrecruiters to seamlessly execute automated workflows, synchronize data, and orchestrate Smartrecruiters actions directly within Alti.",
    "image": "/assets/apps-logos/smartrecruiters.svg",
    "app_name": "smartrecruiters",
    "isAvailable": true
  },
  {
    "title": "SMS Alert",
    "description": "Integrate SMS Alert to seamlessly execute automated workflows, synchronize data, and orchestrate SMS Alert actions directly within Alti.",
    "image": "/assets/apps-logos/sms_alert.svg",
    "app_name": "sms_alert",
    "isAvailable": true
  },
  {
    "title": "Smtp2go",
    "description": "Integrate Smtp2go to seamlessly execute automated workflows, synchronize data, and orchestrate Smtp2go actions directly within Alti.",
    "image": "/assets/apps-logos/smtp2go.svg",
    "app_name": "smtp2go",
    "isAvailable": true
  },
  {
    "title": "Smugmug",
    "description": "Integrate Smugmug to seamlessly execute automated workflows, synchronize data, and orchestrate Smugmug actions directly within Alti.",
    "image": "/assets/apps-logos/smugmug.svg",
    "app_name": "smugmug",
    "isAvailable": true
  },
  {
    "title": "Snowflake Basic",
    "description": "Integrate Snowflake Basic to seamlessly execute automated workflows, synchronize data, and orchestrate Snowflake Basic actions directly within Alti.",
    "image": "/assets/apps-logos/snowflake_basic.svg",
    "app_name": "snowflake_basic",
    "isAvailable": true
  },
  {
    "title": "Sourcegraph",
    "description": "Integrate Sourcegraph to seamlessly execute automated workflows, synchronize data, and orchestrate Sourcegraph actions directly within Alti.",
    "image": "/assets/apps-logos/sourcegraph.svg",
    "app_name": "sourcegraph",
    "isAvailable": true
  },
  {
    "title": "Splitwise",
    "description": "Integrate Splitwise to seamlessly execute automated workflows, synchronize data, and orchestrate Splitwise actions directly within Alti.",
    "image": "/assets/apps-logos/splitwise.svg",
    "app_name": "splitwise",
    "isAvailable": true
  },
  {
    "title": "Spoki",
    "description": "Integrate Spoki to seamlessly execute automated workflows, synchronize data, and orchestrate Spoki actions directly within Alti.",
    "image": "/assets/apps-logos/spoki.svg",
    "app_name": "spoki",
    "isAvailable": true
  },
  {
    "title": "Spondyr",
    "description": "Integrate Spondyr to seamlessly execute automated workflows, synchronize data, and orchestrate Spondyr actions directly within Alti.",
    "image": "/assets/apps-logos/spondyr.svg",
    "app_name": "spondyr",
    "isAvailable": true
  },
  {
    "title": "Spotlightr",
    "description": "Integrate Spotlightr to seamlessly execute automated workflows, synchronize data, and orchestrate Spotlightr actions directly within Alti.",
    "image": "/assets/apps-logos/spotlightr.svg",
    "app_name": "spotlightr",
    "isAvailable": true
  },
  {
    "title": "Square",
    "description": "Integrate Square to seamlessly execute automated workflows, synchronize data, and orchestrate Square actions directly within Alti.",
    "image": "/assets/apps-logos/square.svg",
    "app_name": "square",
    "isAvailable": true
  },
  {
    "title": "Sslmate Cert Spotter API",
    "description": "Integrate Sslmate Cert Spotter API to seamlessly execute automated workflows, synchronize data, and orchestrate Sslmate Cert Spotter API actions directly within Alti.",
    "image": "/assets/apps-logos/sslmate_cert_spotter_api.svg",
    "app_name": "sslmate_cert_spotter_api",
    "isAvailable": true
  },
  {
    "title": "Stannp",
    "description": "Integrate Stannp to seamlessly execute automated workflows, synchronize data, and orchestrate Stannp actions directly within Alti.",
    "image": "/assets/apps-logos/stannp.svg",
    "app_name": "stannp",
    "isAvailable": true
  },
  {
    "title": "Starton",
    "description": "Integrate Starton to seamlessly execute automated workflows, synchronize data, and orchestrate Starton actions directly within Alti.",
    "image": "/assets/apps-logos/starton.svg",
    "app_name": "starton",
    "isAvailable": true
  },
  {
    "title": "Statuscake",
    "description": "Integrate Statuscake to seamlessly execute automated workflows, synchronize data, and orchestrate Statuscake actions directly within Alti.",
    "image": "/assets/apps-logos/statuscake.svg",
    "app_name": "statuscake",
    "isAvailable": true
  },
  {
    "title": "Storeganise",
    "description": "Integrate Storeganise to seamlessly execute automated workflows, synchronize data, and orchestrate Storeganise actions directly within Alti.",
    "image": "/assets/apps-logos/storeganise.svg",
    "app_name": "storeganise",
    "isAvailable": true
  },
  {
    "title": "Storerocket",
    "description": "Integrate Storerocket to seamlessly execute automated workflows, synchronize data, and orchestrate Storerocket actions directly within Alti.",
    "image": "/assets/apps-logos/storerocket.svg",
    "app_name": "storerocket",
    "isAvailable": true
  },
  {
    "title": "Stormglass Io",
    "description": "Integrate Stormglass Io to seamlessly execute automated workflows, synchronize data, and orchestrate Stormglass Io actions directly within Alti.",
    "image": "/assets/apps-logos/stormglass_io.svg",
    "app_name": "stormglass_io",
    "isAvailable": true
  },
  {
    "title": "Strava",
    "description": "Integrate Strava to seamlessly execute automated workflows, synchronize data, and orchestrate Strava actions directly within Alti.",
    "image": "/assets/apps-logos/strava.svg",
    "app_name": "strava",
    "isAvailable": true
  },
  {
    "title": "Streamtime",
    "description": "Integrate Streamtime to seamlessly execute automated workflows, synchronize data, and orchestrate Streamtime actions directly within Alti.",
    "image": "/assets/apps-logos/streamtime.svg",
    "app_name": "streamtime",
    "isAvailable": true
  },
  {
    "title": "Supadata",
    "description": "Integrate Supadata to seamlessly execute automated workflows, synchronize data, and orchestrate Supadata actions directly within Alti.",
    "image": "/assets/apps-logos/supadata.svg",
    "app_name": "supadata",
    "isAvailable": true
  },
  {
    "title": "Superchat",
    "description": "Integrate Superchat to seamlessly execute automated workflows, synchronize data, and orchestrate Superchat actions directly within Alti.",
    "image": "/assets/apps-logos/superchat.svg",
    "app_name": "superchat",
    "isAvailable": true
  },
  {
    "title": "Supportbee",
    "description": "Integrate Supportbee to seamlessly execute automated workflows, synchronize data, and orchestrate Supportbee actions directly within Alti.",
    "image": "/assets/apps-logos/supportbee.svg",
    "app_name": "supportbee",
    "isAvailable": true
  },
  {
    "title": "Supportivekoala",
    "description": "Integrate Supportivekoala to seamlessly execute automated workflows, synchronize data, and orchestrate Supportivekoala actions directly within Alti.",
    "image": "/assets/apps-logos/supportivekoala.svg",
    "app_name": "supportivekoala",
    "isAvailable": true
  },
  {
    "title": "Survey Monkey",
    "description": "Integrate Survey Monkey to seamlessly execute automated workflows, synchronize data, and orchestrate Survey Monkey actions directly within Alti.",
    "image": "/assets/apps-logos/survey_monkey.svg",
    "app_name": "survey_monkey",
    "isAvailable": true
  },
  {
    "title": "Svix",
    "description": "Integrate Svix to seamlessly execute automated workflows, synchronize data, and orchestrate Svix actions directly within Alti.",
    "image": "/assets/apps-logos/svix.svg",
    "app_name": "svix",
    "isAvailable": true
  },
  {
    "title": "Sympla",
    "description": "Integrate Sympla to seamlessly execute automated workflows, synchronize data, and orchestrate Sympla actions directly within Alti.",
    "image": "/assets/apps-logos/sympla.svg",
    "app_name": "sympla",
    "isAvailable": true
  },
  {
    "title": "Synthflow AI",
    "description": "Integrate Synthflow AI to seamlessly execute automated workflows, synchronize data, and orchestrate Synthflow AI actions directly within Alti.",
    "image": "/assets/apps-logos/synthflow_ai.svg",
    "app_name": "synthflow_ai",
    "isAvailable": true
  },
  {
    "title": "Taggun",
    "description": "Integrate Taggun to seamlessly execute automated workflows, synchronize data, and orchestrate Taggun actions directly within Alti.",
    "image": "/assets/apps-logos/taggun.svg",
    "app_name": "taggun",
    "isAvailable": true
  },
  {
    "title": "Talenthr",
    "description": "Integrate Talenthr to seamlessly execute automated workflows, synchronize data, and orchestrate Talenthr actions directly within Alti.",
    "image": "/assets/apps-logos/talenthr.svg",
    "app_name": "talenthr",
    "isAvailable": true
  },
  {
    "title": "Tally",
    "description": "Integrate Tally to seamlessly execute automated workflows, synchronize data, and orchestrate Tally actions directly within Alti.",
    "image": "/assets/apps-logos/tally.svg",
    "app_name": "tally",
    "isAvailable": true
  },
  {
    "title": "Tapfiliate",
    "description": "Integrate Tapfiliate to seamlessly execute automated workflows, synchronize data, and orchestrate Tapfiliate actions directly within Alti.",
    "image": "/assets/apps-logos/tapfiliate.svg",
    "app_name": "tapfiliate",
    "isAvailable": true
  },
  {
    "title": "Tapform",
    "description": "Integrate Tapform to seamlessly execute automated workflows, synchronize data, and orchestrate Tapform actions directly within Alti.",
    "image": "/assets/apps-logos/tapform.svg",
    "app_name": "tapform",
    "isAvailable": true
  },
  {
    "title": "Taxjar",
    "description": "Integrate Taxjar to seamlessly execute automated workflows, synchronize data, and orchestrate Taxjar actions directly within Alti.",
    "image": "/assets/apps-logos/taxjar.svg",
    "app_name": "taxjar",
    "isAvailable": true
  },
  {
    "title": "Teamcamp",
    "description": "Integrate Teamcamp to seamlessly execute automated workflows, synchronize data, and orchestrate Teamcamp actions directly within Alti.",
    "image": "/assets/apps-logos/teamcamp.svg",
    "app_name": "teamcamp",
    "isAvailable": true
  },
  {
    "title": "Telegram",
    "description": "Integrate Telegram to seamlessly execute automated workflows, synchronize data, and orchestrate Telegram actions directly within Alti.",
    "image": "/assets/apps-logos/telegram.svg",
    "app_name": "telegram",
    "isAvailable": true
  },
  {
    "title": "Telnyx",
    "description": "Integrate Telnyx to seamlessly execute automated workflows, synchronize data, and orchestrate Telnyx actions directly within Alti.",
    "image": "/assets/apps-logos/telnyx.svg",
    "app_name": "telnyx",
    "isAvailable": true
  },
  {
    "title": "Teltel",
    "description": "Integrate Teltel to seamlessly execute automated workflows, synchronize data, and orchestrate Teltel actions directly within Alti.",
    "image": "/assets/apps-logos/teltel.svg",
    "app_name": "teltel",
    "isAvailable": true
  },
  {
    "title": "Templated",
    "description": "Integrate Templated to seamlessly execute automated workflows, synchronize data, and orchestrate Templated actions directly within Alti.",
    "image": "/assets/apps-logos/templated.svg",
    "app_name": "templated",
    "isAvailable": true
  },
  {
    "title": "Terminus",
    "description": "Integrate Terminus to seamlessly execute automated workflows, synchronize data, and orchestrate Terminus actions directly within Alti.",
    "image": "/assets/apps-logos/terminus.svg",
    "app_name": "terminus",
    "isAvailable": true
  },
  {
    "title": "Test App",
    "description": "Integrate Test App to seamlessly execute automated workflows, synchronize data, and orchestrate Test App actions directly within Alti.",
    "image": "/assets/apps-logos/test_app.svg",
    "app_name": "test_app",
    "isAvailable": true
  },
  {
    "title": "Text To PDF",
    "description": "Integrate Text To PDF to seamlessly execute automated workflows, synchronize data, and orchestrate Text To PDF actions directly within Alti.",
    "image": "/assets/apps-logos/text_to_pdf.svg",
    "app_name": "text_to_pdf",
    "isAvailable": true
  },
  {
    "title": "Textcortex",
    "description": "Integrate Textcortex to seamlessly execute automated workflows, synchronize data, and orchestrate Textcortex actions directly within Alti.",
    "image": "/assets/apps-logos/textcortex.svg",
    "app_name": "textcortex",
    "isAvailable": true
  },
  {
    "title": "Textit",
    "description": "Integrate Textit to seamlessly execute automated workflows, synchronize data, and orchestrate Textit actions directly within Alti.",
    "image": "/assets/apps-logos/textit.svg",
    "app_name": "textit",
    "isAvailable": true
  },
  {
    "title": "Thanks Io",
    "description": "Integrate Thanks Io to seamlessly execute automated workflows, synchronize data, and orchestrate Thanks Io actions directly within Alti.",
    "image": "/assets/apps-logos/thanks_io.svg",
    "app_name": "thanks_io",
    "isAvailable": true
  },
  {
    "title": "The Odds API",
    "description": "Integrate The Odds API to seamlessly execute automated workflows, synchronize data, and orchestrate The Odds API actions directly within Alti.",
    "image": "/assets/apps-logos/the_odds_api.svg",
    "app_name": "the_odds_api",
    "isAvailable": true
  },
  {
    "title": "Ticketmaster",
    "description": "Integrate Ticketmaster to seamlessly execute automated workflows, synchronize data, and orchestrate Ticketmaster actions directly within Alti.",
    "image": "/assets/apps-logos/ticketmaster.svg",
    "app_name": "ticketmaster",
    "isAvailable": true
  },
  {
    "title": "Tiktok",
    "description": "Integrate Tiktok to seamlessly execute automated workflows, synchronize data, and orchestrate Tiktok actions directly within Alti.",
    "image": "/assets/apps-logos/tiktok.svg",
    "app_name": "tiktok",
    "isAvailable": true
  },
  {
    "title": "Timecamp",
    "description": "Integrate Timecamp to seamlessly execute automated workflows, synchronize data, and orchestrate Timecamp actions directly within Alti.",
    "image": "/assets/apps-logos/timecamp.svg",
    "app_name": "timecamp",
    "isAvailable": true
  },
  {
    "title": "Timekit",
    "description": "Integrate Timekit to seamlessly execute automated workflows, synchronize data, and orchestrate Timekit actions directly within Alti.",
    "image": "/assets/apps-logos/timekit.svg",
    "app_name": "timekit",
    "isAvailable": true
  },
  {
    "title": "Timelinesai",
    "description": "Integrate Timelinesai to seamlessly execute automated workflows, synchronize data, and orchestrate Timelinesai actions directly within Alti.",
    "image": "/assets/apps-logos/timelinesai.svg",
    "app_name": "timelinesai",
    "isAvailable": true
  },
  {
    "title": "Timelink",
    "description": "Integrate Timelink to seamlessly execute automated workflows, synchronize data, and orchestrate Timelink actions directly within Alti.",
    "image": "/assets/apps-logos/timelink.svg",
    "app_name": "timelink",
    "isAvailable": true
  },
  {
    "title": "Tinypng",
    "description": "Integrate Tinypng to seamlessly execute automated workflows, synchronize data, and orchestrate Tinypng actions directly within Alti.",
    "image": "/assets/apps-logos/tinypng.svg",
    "app_name": "tinypng",
    "isAvailable": true
  },
  {
    "title": "Tisane",
    "description": "Integrate Tisane to seamlessly execute automated workflows, synchronize data, and orchestrate Tisane actions directly within Alti.",
    "image": "/assets/apps-logos/tisane.svg",
    "app_name": "tisane",
    "isAvailable": true
  },
  {
    "title": "Toggl",
    "description": "Integrate Toggl to seamlessly execute automated workflows, synchronize data, and orchestrate Toggl actions directly within Alti.",
    "image": "/assets/apps-logos/toggl.svg",
    "app_name": "toggl",
    "isAvailable": true
  },
  {
    "title": "Token Metrics",
    "description": "Integrate Token Metrics to seamlessly execute automated workflows, synchronize data, and orchestrate Token Metrics actions directly within Alti.",
    "image": "/assets/apps-logos/token_metrics.svg",
    "app_name": "token_metrics",
    "isAvailable": true
  },
  {
    "title": "Tomba",
    "description": "Integrate Tomba to seamlessly execute automated workflows, synchronize data, and orchestrate Tomba actions directly within Alti.",
    "image": "/assets/apps-logos/tomba.svg",
    "app_name": "tomba",
    "isAvailable": true
  },
  {
    "title": "Tomtom",
    "description": "Integrate Tomtom to seamlessly execute automated workflows, synchronize data, and orchestrate Tomtom actions directly within Alti.",
    "image": "/assets/apps-logos/tomtom.svg",
    "app_name": "tomtom",
    "isAvailable": true
  },
  {
    "title": "Toneden",
    "description": "Integrate Toneden to seamlessly execute automated workflows, synchronize data, and orchestrate Toneden actions directly within Alti.",
    "image": "/assets/apps-logos/toneden.svg",
    "app_name": "toneden",
    "isAvailable": true
  },
  {
    "title": "Tpscheck",
    "description": "Integrate Tpscheck to seamlessly execute automated workflows, synchronize data, and orchestrate Tpscheck actions directly within Alti.",
    "image": "/assets/apps-logos/tpscheck.svg",
    "app_name": "tpscheck",
    "isAvailable": true
  },
  {
    "title": "Triggercmd",
    "description": "Integrate Triggercmd to seamlessly execute automated workflows, synchronize data, and orchestrate Triggercmd actions directly within Alti.",
    "image": "/assets/apps-logos/triggercmd.svg",
    "app_name": "triggercmd",
    "isAvailable": true
  },
  {
    "title": "Tripadvisor Content API",
    "description": "Integrate Tripadvisor Content API to seamlessly execute automated workflows, synchronize data, and orchestrate Tripadvisor Content API actions directly within Alti.",
    "image": "/assets/apps-logos/tripadvisor_content_api.svg",
    "app_name": "tripadvisor_content_api",
    "isAvailable": true
  },
  {
    "title": "Turbot Pipes",
    "description": "Integrate Turbot Pipes to seamlessly execute automated workflows, synchronize data, and orchestrate Turbot Pipes actions directly within Alti.",
    "image": "/assets/apps-logos/turbot_pipes.svg",
    "app_name": "turbot_pipes",
    "isAvailable": true
  },
  {
    "title": "Turso",
    "description": "Integrate Turso to seamlessly execute automated workflows, synchronize data, and orchestrate Turso actions directly within Alti.",
    "image": "/assets/apps-logos/turso.svg",
    "app_name": "turso",
    "isAvailable": true
  },
  {
    "title": "Twelve Data",
    "description": "Integrate Twelve Data to seamlessly execute automated workflows, synchronize data, and orchestrate Twelve Data actions directly within Alti.",
    "image": "/assets/apps-logos/twelve_data.svg",
    "app_name": "twelve_data",
    "isAvailable": true
  },
  {
    "title": "Twitch",
    "description": "Integrate Twitch to seamlessly execute automated workflows, synchronize data, and orchestrate Twitch actions directly within Alti.",
    "image": "/assets/apps-logos/twitch.svg",
    "app_name": "twitch",
    "isAvailable": true
  },
  {
    "title": "Twitter",
    "description": "Integrate Twitter to seamlessly execute automated workflows, synchronize data, and orchestrate Twitter actions directly within Alti.",
    "image": "/assets/apps-logos/twitter.svg",
    "app_name": "twitter",
    "isAvailable": true
  },
  {
    "title": "Twocaptcha",
    "description": "Integrate Twocaptcha to seamlessly execute automated workflows, synchronize data, and orchestrate Twocaptcha actions directly within Alti.",
    "image": "/assets/apps-logos/twocaptcha.svg",
    "app_name": "twocaptcha",
    "isAvailable": true
  },
  {
    "title": "Typless",
    "description": "Integrate Typless to seamlessly execute automated workflows, synchronize data, and orchestrate Typless actions directly within Alti.",
    "image": "/assets/apps-logos/typless.svg",
    "app_name": "typless",
    "isAvailable": true
  },
  {
    "title": "U301",
    "description": "Integrate U301 to seamlessly execute automated workflows, synchronize data, and orchestrate U301 actions directly within Alti.",
    "image": "/assets/apps-logos/u301.svg",
    "app_name": "u301",
    "isAvailable": true
  },
  {
    "title": "Unione",
    "description": "Integrate Unione to seamlessly execute automated workflows, synchronize data, and orchestrate Unione actions directly within Alti.",
    "image": "/assets/apps-logos/unione.svg",
    "app_name": "unione",
    "isAvailable": true
  },
  {
    "title": "Updown Io",
    "description": "Integrate Updown Io to seamlessly execute automated workflows, synchronize data, and orchestrate Updown Io actions directly within Alti.",
    "image": "/assets/apps-logos/updown_io.svg",
    "app_name": "updown_io",
    "isAvailable": true
  },
  {
    "title": "Uploadcare",
    "description": "Integrate Uploadcare to seamlessly execute automated workflows, synchronize data, and orchestrate Uploadcare actions directly within Alti.",
    "image": "/assets/apps-logos/uploadcare.svg",
    "app_name": "uploadcare",
    "isAvailable": true
  },
  {
    "title": "Uptimerobot",
    "description": "Integrate Uptimerobot to seamlessly execute automated workflows, synchronize data, and orchestrate Uptimerobot actions directly within Alti.",
    "image": "/assets/apps-logos/uptimerobot.svg",
    "app_name": "uptimerobot",
    "isAvailable": true
  },
  {
    "title": "Userlist",
    "description": "Integrate Userlist to seamlessly execute automated workflows, synchronize data, and orchestrate Userlist actions directly within Alti.",
    "image": "/assets/apps-logos/userlist.svg",
    "app_name": "userlist",
    "isAvailable": true
  },
  {
    "title": "V0",
    "description": "Integrate V0 to seamlessly execute automated workflows, synchronize data, and orchestrate V0 actions directly within Alti.",
    "image": "/assets/apps-logos/v0.svg",
    "app_name": "v0",
    "isAvailable": true
  },
  {
    "title": "Venly",
    "description": "Integrate Venly to seamlessly execute automated workflows, synchronize data, and orchestrate Venly actions directly within Alti.",
    "image": "/assets/apps-logos/venly.svg",
    "app_name": "venly",
    "isAvailable": true
  },
  {
    "title": "Veo",
    "description": "Integrate Veo to seamlessly execute automated workflows, synchronize data, and orchestrate Veo actions directly within Alti.",
    "image": "/assets/apps-logos/veo.svg",
    "app_name": "veo",
    "isAvailable": true
  },
  {
    "title": "Vercel",
    "description": "Integrate Vercel to seamlessly execute automated workflows, synchronize data, and orchestrate Vercel actions directly within Alti.",
    "image": "/assets/apps-logos/vercel.svg",
    "app_name": "vercel",
    "isAvailable": true
  },
  {
    "title": "Verifiedemail",
    "description": "Integrate Verifiedemail to seamlessly execute automated workflows, synchronize data, and orchestrate Verifiedemail actions directly within Alti.",
    "image": "/assets/apps-logos/verifiedemail.svg",
    "app_name": "verifiedemail",
    "isAvailable": true
  },
  {
    "title": "Veriphone",
    "description": "Integrate Veriphone to seamlessly execute automated workflows, synchronize data, and orchestrate Veriphone actions directly within Alti.",
    "image": "/assets/apps-logos/veriphone.svg",
    "app_name": "veriphone",
    "isAvailable": true
  },
  {
    "title": "Vero",
    "description": "Integrate Vero to seamlessly execute automated workflows, synchronize data, and orchestrate Vero actions directly within Alti.",
    "image": "/assets/apps-logos/vero.svg",
    "app_name": "vero",
    "isAvailable": true
  },
  {
    "title": "Vestaboard",
    "description": "Integrate Vestaboard to seamlessly execute automated workflows, synchronize data, and orchestrate Vestaboard actions directly within Alti.",
    "image": "/assets/apps-logos/vestaboard.svg",
    "app_name": "vestaboard",
    "isAvailable": true
  },
  {
    "title": "Virustotal",
    "description": "Integrate Virustotal to seamlessly execute automated workflows, synchronize data, and orchestrate Virustotal actions directly within Alti.",
    "image": "/assets/apps-logos/virustotal.svg",
    "app_name": "virustotal",
    "isAvailable": true
  },
  {
    "title": "Visme",
    "description": "Integrate Visme to seamlessly execute automated workflows, synchronize data, and orchestrate Visme actions directly within Alti.",
    "image": "/assets/apps-logos/visme.svg",
    "app_name": "visme",
    "isAvailable": true
  },
  {
    "title": "Waboxapp",
    "description": "Integrate Waboxapp to seamlessly execute automated workflows, synchronize data, and orchestrate Waboxapp actions directly within Alti.",
    "image": "/assets/apps-logos/waboxapp.svg",
    "app_name": "waboxapp",
    "isAvailable": true
  },
  {
    "title": "Wachete",
    "description": "Integrate Wachete to seamlessly execute automated workflows, synchronize data, and orchestrate Wachete actions directly within Alti.",
    "image": "/assets/apps-logos/wachete.svg",
    "app_name": "wachete",
    "isAvailable": true
  },
  {
    "title": "Waiverfile",
    "description": "Integrate Waiverfile to seamlessly execute automated workflows, synchronize data, and orchestrate Waiverfile actions directly within Alti.",
    "image": "/assets/apps-logos/waiverfile.svg",
    "app_name": "waiverfile",
    "isAvailable": true
  },
  {
    "title": "Wakatime",
    "description": "Integrate Wakatime to seamlessly execute automated workflows, synchronize data, and orchestrate Wakatime actions directly within Alti.",
    "image": "/assets/apps-logos/wakatime.svg",
    "app_name": "wakatime",
    "isAvailable": true
  },
  {
    "title": "Wati",
    "description": "Integrate Wati to seamlessly execute automated workflows, synchronize data, and orchestrate Wati actions directly within Alti.",
    "image": "/assets/apps-logos/wati.svg",
    "app_name": "wati",
    "isAvailable": true
  },
  {
    "title": "Wave Accounting",
    "description": "Integrate Wave Accounting to seamlessly execute automated workflows, synchronize data, and orchestrate Wave Accounting actions directly within Alti.",
    "image": "/assets/apps-logos/wave_accounting.svg",
    "app_name": "wave_accounting",
    "isAvailable": true
  },
  {
    "title": "Weathermap",
    "description": "Integrate Weathermap to seamlessly execute automated workflows, synchronize data, and orchestrate Weathermap actions directly within Alti.",
    "image": "/assets/apps-logos/weathermap.svg",
    "app_name": "weathermap",
    "isAvailable": true
  },
  {
    "title": "Webscraping AI",
    "description": "Integrate Webscraping AI to seamlessly execute automated workflows, synchronize data, and orchestrate Webscraping AI actions directly within Alti.",
    "image": "/assets/apps-logos/webscraping_ai.svg",
    "app_name": "webscraping_ai",
    "isAvailable": true
  },
  {
    "title": "Webvizio",
    "description": "Integrate Webvizio to seamlessly execute automated workflows, synchronize data, and orchestrate Webvizio actions directly within Alti.",
    "image": "/assets/apps-logos/webvizio.svg",
    "app_name": "webvizio",
    "isAvailable": true
  },
  {
    "title": "Whatsapp",
    "description": "Integrate Whatsapp to seamlessly execute automated workflows, synchronize data, and orchestrate Whatsapp actions directly within Alti.",
    "image": "/assets/apps-logos/whatsapp.svg",
    "app_name": "whatsapp",
    "isAvailable": true
  },
  {
    "title": "Whautomate",
    "description": "Integrate Whautomate to seamlessly execute automated workflows, synchronize data, and orchestrate Whautomate actions directly within Alti.",
    "image": "/assets/apps-logos/whautomate.svg",
    "app_name": "whautomate",
    "isAvailable": true
  },
  {
    "title": "Winston AI",
    "description": "Integrate Winston AI to seamlessly execute automated workflows, synchronize data, and orchestrate Winston AI actions directly within Alti.",
    "image": "/assets/apps-logos/winston_ai.svg",
    "app_name": "winston_ai",
    "isAvailable": true
  },
  {
    "title": "Wit AI",
    "description": "Integrate Wit AI to seamlessly execute automated workflows, synchronize data, and orchestrate Wit AI actions directly within Alti.",
    "image": "/assets/apps-logos/wit_ai.svg",
    "app_name": "wit_ai",
    "isAvailable": true
  },
  {
    "title": "Wiz",
    "description": "Integrate Wiz to seamlessly execute automated workflows, synchronize data, and orchestrate Wiz actions directly within Alti.",
    "image": "/assets/apps-logos/wiz.svg",
    "app_name": "wiz",
    "isAvailable": true
  },
  {
    "title": "Wolfram Alpha API",
    "description": "Integrate Wolfram Alpha API to seamlessly execute automated workflows, synchronize data, and orchestrate Wolfram Alpha API actions directly within Alti.",
    "image": "/assets/apps-logos/wolfram_alpha_api.svg",
    "app_name": "wolfram_alpha_api",
    "isAvailable": true
  },
  {
    "title": "Woodpecker Co",
    "description": "Integrate Woodpecker Co to seamlessly execute automated workflows, synchronize data, and orchestrate Woodpecker Co actions directly within Alti.",
    "image": "/assets/apps-logos/woodpecker_co.svg",
    "app_name": "woodpecker_co",
    "isAvailable": true
  },
  {
    "title": "Workable",
    "description": "Integrate Workable to seamlessly execute automated workflows, synchronize data, and orchestrate Workable actions directly within Alti.",
    "image": "/assets/apps-logos/workable.svg",
    "app_name": "workable",
    "isAvailable": true
  },
  {
    "title": "Workday",
    "description": "Integrate Workday to seamlessly execute automated workflows, synchronize data, and orchestrate Workday actions directly within Alti.",
    "image": "/assets/apps-logos/workday.svg",
    "app_name": "workday",
    "isAvailable": true
  },
  {
    "title": "Worksnaps",
    "description": "Integrate Worksnaps to seamlessly execute automated workflows, synchronize data, and orchestrate Worksnaps actions directly within Alti.",
    "image": "/assets/apps-logos/worksnaps.svg",
    "app_name": "worksnaps",
    "isAvailable": true
  },
  {
    "title": "Writer",
    "description": "Integrate Writer to seamlessly execute automated workflows, synchronize data, and orchestrate Writer actions directly within Alti.",
    "image": "/assets/apps-logos/writer.svg",
    "app_name": "writer",
    "isAvailable": true
  },
  {
    "title": "Y Gy",
    "description": "Integrate Y Gy to seamlessly execute automated workflows, synchronize data, and orchestrate Y Gy actions directly within Alti.",
    "image": "/assets/apps-logos/y_gy.svg",
    "app_name": "y_gy",
    "isAvailable": true
  },
  {
    "title": "Yelp",
    "description": "Integrate Yelp to seamlessly execute automated workflows, synchronize data, and orchestrate Yelp actions directly within Alti.",
    "image": "/assets/apps-logos/yelp.svg",
    "app_name": "yelp",
    "isAvailable": true
  },
  {
    "title": "Ynab",
    "description": "Integrate Ynab to seamlessly execute automated workflows, synchronize data, and orchestrate Ynab actions directly within Alti.",
    "image": "/assets/apps-logos/ynab.svg",
    "app_name": "ynab",
    "isAvailable": true
  },
  {
    "title": "Zenserp",
    "description": "Integrate Zenserp to seamlessly execute automated workflows, synchronize data, and orchestrate Zenserp actions directly within Alti.",
    "image": "/assets/apps-logos/zenserp.svg",
    "app_name": "zenserp",
    "isAvailable": true
  },
  {
    "title": "Zeplin",
    "description": "Integrate Zeplin to seamlessly execute automated workflows, synchronize data, and orchestrate Zeplin actions directly within Alti.",
    "image": "/assets/apps-logos/zeplin.svg",
    "app_name": "zeplin",
    "isAvailable": true
  },
  {
    "title": "Zerobounce",
    "description": "Integrate Zerobounce to seamlessly execute automated workflows, synchronize data, and orchestrate Zerobounce actions directly within Alti.",
    "image": "/assets/apps-logos/zerobounce.svg",
    "app_name": "zerobounce",
    "isAvailable": true
  },
  {
    "title": "Zoho Books",
    "description": "Integrate Zoho Books to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Books actions directly within Alti.",
    "image": "/assets/apps-logos/zoho_books.svg",
    "app_name": "zoho_books",
    "isAvailable": true
  },
  {
    "title": "Zoho Desk",
    "description": "Integrate Zoho Desk to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Desk actions directly within Alti.",
    "image": "/assets/apps-logos/zoho_desk.svg",
    "app_name": "zoho_desk",
    "isAvailable": true
  },
  {
    "title": "Zoho Inventory",
    "description": "Integrate Zoho Inventory to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Inventory actions directly within Alti.",
    "image": "/assets/apps-logos/zoho_inventory.svg",
    "app_name": "zoho_inventory",
    "isAvailable": true
  },
  {
    "title": "Zoho Mail",
    "description": "Integrate Zoho Mail to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Mail actions directly within Alti.",
    "image": "/assets/apps-logos/zoho_mail.svg",
    "app_name": "zoho_mail",
    "isAvailable": true
  },
  {
    "title": "Zylvie",
    "description": "Integrate Zylvie to seamlessly execute automated workflows, synchronize data, and orchestrate Zylvie actions directly within Alti.",
    "image": "/assets/apps-logos/zylvie.svg",
    "app_name": "zylvie",
    "isAvailable": true
  },
  {
    "title": "Zyte API",
    "description": "Integrate Zyte API to seamlessly execute automated workflows, synchronize data, and orchestrate Zyte API actions directly within Alti.",
    "image": "/assets/apps-logos/zyte_api.svg",
    "app_name": "zyte_api",
    "isAvailable": true
  }
];

export const toolsNeedsToAdd = [
  "box",
  "confluence",
  "discord",
  "freshbooks",
  "twitter",
  "survey_monkey"
];
