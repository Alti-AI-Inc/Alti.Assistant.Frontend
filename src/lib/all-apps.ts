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
    "image": "https://logos.composio.dev/api/_21risk",
    "app_name": "_21risk",
    "isAvailable": true
  },
  {
    "title": " 2chat",
    "description": "Integrate  2chat to seamlessly execute automated workflows, synchronize data, and orchestrate  2chat actions directly within Alti.",
    "image": "https://logos.composio.dev/api/_2chat",
    "app_name": "_2chat",
    "isAvailable": true
  },
  {
    "title": "Abstract",
    "description": "Integrate Abstract to seamlessly execute automated workflows, synchronize data, and orchestrate Abstract actions directly within Alti.",
    "image": "https://logos.composio.dev/api/abstract",
    "app_name": "abstract",
    "isAvailable": true
  },
  {
    "title": "Abuselpdb",
    "description": "Integrate Abuselpdb to seamlessly execute automated workflows, synchronize data, and orchestrate Abuselpdb actions directly within Alti.",
    "image": "https://logos.composio.dev/api/abuselpdb",
    "app_name": "abuselpdb",
    "isAvailable": true
  },
  {
    "title": "Abyssale",
    "description": "Integrate Abyssale to seamlessly execute automated workflows, synchronize data, and orchestrate Abyssale actions directly within Alti.",
    "image": "https://logos.composio.dev/api/abyssale",
    "app_name": "abyssale",
    "isAvailable": true
  },
  {
    "title": "Accelo",
    "description": "Integrate Accelo to seamlessly execute automated workflows, synchronize data, and orchestrate Accelo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/accelo",
    "app_name": "accelo",
    "isAvailable": true
  },
  {
    "title": "Accredible Certificates",
    "description": "Integrate Accredible Certificates to seamlessly execute automated workflows, synchronize data, and orchestrate Accredible Certificates actions directly within Alti.",
    "image": "https://logos.composio.dev/api/accredible_certificates",
    "app_name": "accredible_certificates",
    "isAvailable": true
  },
  {
    "title": "Addresszen",
    "description": "Integrate Addresszen to seamlessly execute automated workflows, synchronize data, and orchestrate Addresszen actions directly within Alti.",
    "image": "https://logos.composio.dev/api/addresszen",
    "app_name": "addresszen",
    "isAvailable": true
  },
  {
    "title": "Adobe",
    "description": "Integrate Adobe to seamlessly execute automated workflows, synchronize data, and orchestrate Adobe actions directly within Alti.",
    "image": "https://logos.composio.dev/api/adobe",
    "app_name": "adobe",
    "isAvailable": true
  },
  {
    "title": "Adrapid",
    "description": "Integrate Adrapid to seamlessly execute automated workflows, synchronize data, and orchestrate Adrapid actions directly within Alti.",
    "image": "https://logos.composio.dev/api/adrapid",
    "app_name": "adrapid",
    "isAvailable": true
  },
  {
    "title": "Adyntel",
    "description": "Integrate Adyntel to seamlessly execute automated workflows, synchronize data, and orchestrate Adyntel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/adyntel",
    "app_name": "adyntel",
    "isAvailable": true
  },
  {
    "title": "Aero Workflow",
    "description": "Integrate Aero Workflow to seamlessly execute automated workflows, synchronize data, and orchestrate Aero Workflow actions directly within Alti.",
    "image": "https://logos.composio.dev/api/aero_workflow",
    "app_name": "aero_workflow",
    "isAvailable": true
  },
  {
    "title": "Aeroleads",
    "description": "Integrate Aeroleads to seamlessly execute automated workflows, synchronize data, and orchestrate Aeroleads actions directly within Alti.",
    "image": "https://logos.composio.dev/api/aeroleads",
    "app_name": "aeroleads",
    "isAvailable": true
  },
  {
    "title": "Affinda",
    "description": "Integrate Affinda to seamlessly execute automated workflows, synchronize data, and orchestrate Affinda actions directly within Alti.",
    "image": "https://logos.composio.dev/api/affinda",
    "app_name": "affinda",
    "isAvailable": true
  },
  {
    "title": "Agent Mail",
    "description": "Integrate Agent Mail to seamlessly execute automated workflows, synchronize data, and orchestrate Agent Mail actions directly within Alti.",
    "image": "https://logos.composio.dev/api/agent_mail",
    "app_name": "agent_mail",
    "isAvailable": true
  },
  {
    "title": "Agentql",
    "description": "Integrate Agentql to seamlessly execute automated workflows, synchronize data, and orchestrate Agentql actions directly within Alti.",
    "image": "https://logos.composio.dev/api/agentql",
    "app_name": "agentql",
    "isAvailable": true
  },
  {
    "title": "Agenty",
    "description": "Integrate Agenty to seamlessly execute automated workflows, synchronize data, and orchestrate Agenty actions directly within Alti.",
    "image": "https://logos.composio.dev/api/agenty",
    "app_name": "agenty",
    "isAvailable": true
  },
  {
    "title": "Agiled",
    "description": "Integrate Agiled to seamlessly execute automated workflows, synchronize data, and orchestrate Agiled actions directly within Alti.",
    "image": "https://logos.composio.dev/api/agiled",
    "app_name": "agiled",
    "isAvailable": true
  },
  {
    "title": "Agility CMS",
    "description": "Integrate Agility CMS to seamlessly execute automated workflows, synchronize data, and orchestrate Agility CMS actions directly within Alti.",
    "image": "https://logos.composio.dev/api/agility_cms",
    "app_name": "agility_cms",
    "isAvailable": true
  },
  {
    "title": "AI Ml API",
    "description": "Integrate AI Ml API to seamlessly execute automated workflows, synchronize data, and orchestrate AI Ml API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ai_ml_api",
    "app_name": "ai_ml_api",
    "isAvailable": true
  },
  {
    "title": "Aivoov",
    "description": "Integrate Aivoov to seamlessly execute automated workflows, synchronize data, and orchestrate Aivoov actions directly within Alti.",
    "image": "https://logos.composio.dev/api/aivoov",
    "app_name": "aivoov",
    "isAvailable": true
  },
  {
    "title": "Alchemy",
    "description": "Integrate Alchemy to seamlessly execute automated workflows, synchronize data, and orchestrate Alchemy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/alchemy",
    "app_name": "alchemy",
    "isAvailable": true
  },
  {
    "title": "Algodocs",
    "description": "Integrate Algodocs to seamlessly execute automated workflows, synchronize data, and orchestrate Algodocs actions directly within Alti.",
    "image": "https://logos.composio.dev/api/algodocs",
    "app_name": "algodocs",
    "isAvailable": true
  },
  {
    "title": "Algolia",
    "description": "Integrate Algolia to seamlessly execute automated workflows, synchronize data, and orchestrate Algolia actions directly within Alti.",
    "image": "https://logos.composio.dev/api/algolia",
    "app_name": "algolia",
    "isAvailable": true
  },
  {
    "title": "All Images AI",
    "description": "Integrate All Images AI to seamlessly execute automated workflows, synchronize data, and orchestrate All Images AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/all_images_ai",
    "app_name": "all_images_ai",
    "isAvailable": true
  },
  {
    "title": "Alpha Vantage",
    "description": "Integrate Alpha Vantage to seamlessly execute automated workflows, synchronize data, and orchestrate Alpha Vantage actions directly within Alti.",
    "image": "https://logos.composio.dev/api/alpha_vantage",
    "app_name": "alpha_vantage",
    "isAvailable": true
  },
  {
    "title": "Altoviz",
    "description": "Integrate Altoviz to seamlessly execute automated workflows, synchronize data, and orchestrate Altoviz actions directly within Alti.",
    "image": "https://logos.composio.dev/api/altoviz",
    "app_name": "altoviz",
    "isAvailable": true
  },
  {
    "title": "Alttext AI",
    "description": "Integrate Alttext AI to seamlessly execute automated workflows, synchronize data, and orchestrate Alttext AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/alttext_ai",
    "app_name": "alttext_ai",
    "isAvailable": true
  },
  {
    "title": "Amara",
    "description": "Integrate Amara to seamlessly execute automated workflows, synchronize data, and orchestrate Amara actions directly within Alti.",
    "image": "https://logos.composio.dev/api/amara",
    "app_name": "amara",
    "isAvailable": true
  },
  {
    "title": "Amazon",
    "description": "Integrate Amazon to seamlessly execute automated workflows, synchronize data, and orchestrate Amazon actions directly within Alti.",
    "image": "https://logos.composio.dev/api/amazon",
    "app_name": "amazon",
    "isAvailable": true
  },
  {
    "title": "Ambee",
    "description": "Integrate Ambee to seamlessly execute automated workflows, synchronize data, and orchestrate Ambee actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ambee",
    "app_name": "ambee",
    "isAvailable": true
  },
  {
    "title": "Ambient Weather",
    "description": "Integrate Ambient Weather to seamlessly execute automated workflows, synchronize data, and orchestrate Ambient Weather actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ambient_weather",
    "app_name": "ambient_weather",
    "isAvailable": true
  },
  {
    "title": "Anchor Browser",
    "description": "Integrate Anchor Browser to seamlessly execute automated workflows, synchronize data, and orchestrate Anchor Browser actions directly within Alti.",
    "image": "https://logos.composio.dev/api/anchor_browser",
    "app_name": "anchor_browser",
    "isAvailable": true
  },
  {
    "title": "Anonyflow",
    "description": "Integrate Anonyflow to seamlessly execute automated workflows, synchronize data, and orchestrate Anonyflow actions directly within Alti.",
    "image": "https://logos.composio.dev/api/anonyflow",
    "app_name": "anonyflow",
    "isAvailable": true
  },
  {
    "title": "Anthropic Administrator",
    "description": "Integrate Anthropic Administrator to seamlessly execute automated workflows, synchronize data, and orchestrate Anthropic Administrator actions directly within Alti.",
    "image": "https://logos.composio.dev/api/anthropic_administrator",
    "app_name": "anthropic_administrator",
    "isAvailable": true
  },
  {
    "title": "Apex27",
    "description": "Integrate Apex27 to seamlessly execute automated workflows, synchronize data, and orchestrate Apex27 actions directly within Alti.",
    "image": "https://logos.composio.dev/api/apex27",
    "app_name": "apex27",
    "isAvailable": true
  },
  {
    "title": "API Bible",
    "description": "Integrate API Bible to seamlessly execute automated workflows, synchronize data, and orchestrate API Bible actions directly within Alti.",
    "image": "https://logos.composio.dev/api/api_bible",
    "app_name": "api_bible",
    "isAvailable": true
  },
  {
    "title": "API Labz",
    "description": "Integrate API Labz to seamlessly execute automated workflows, synchronize data, and orchestrate API Labz actions directly within Alti.",
    "image": "https://logos.composio.dev/api/api_labz",
    "app_name": "api_labz",
    "isAvailable": true
  },
  {
    "title": "API Ninjas",
    "description": "Integrate API Ninjas to seamlessly execute automated workflows, synchronize data, and orchestrate API Ninjas actions directly within Alti.",
    "image": "https://logos.composio.dev/api/api_ninjas",
    "app_name": "api_ninjas",
    "isAvailable": true
  },
  {
    "title": "API Sports",
    "description": "Integrate API Sports to seamlessly execute automated workflows, synchronize data, and orchestrate API Sports actions directly within Alti.",
    "image": "https://logos.composio.dev/api/api_sports",
    "app_name": "api_sports",
    "isAvailable": true
  },
  {
    "title": "Api2pdf",
    "description": "Integrate Api2pdf to seamlessly execute automated workflows, synchronize data, and orchestrate Api2pdf actions directly within Alti.",
    "image": "https://logos.composio.dev/api/api2pdf",
    "app_name": "api2pdf",
    "isAvailable": true
  },
  {
    "title": "Apiflash",
    "description": "Integrate Apiflash to seamlessly execute automated workflows, synchronize data, and orchestrate Apiflash actions directly within Alti.",
    "image": "https://logos.composio.dev/api/apiflash",
    "app_name": "apiflash",
    "isAvailable": true
  },
  {
    "title": "Apify",
    "description": "Integrate Apify to seamlessly execute automated workflows, synchronize data, and orchestrate Apify actions directly within Alti.",
    "image": "https://logos.composio.dev/api/apify",
    "app_name": "apify",
    "isAvailable": true
  },
  {
    "title": "Apilio",
    "description": "Integrate Apilio to seamlessly execute automated workflows, synchronize data, and orchestrate Apilio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/apilio",
    "app_name": "apilio",
    "isAvailable": true
  },
  {
    "title": "Apipie AI",
    "description": "Integrate Apipie AI to seamlessly execute automated workflows, synchronize data, and orchestrate Apipie AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/apipie_ai",
    "app_name": "apipie_ai",
    "isAvailable": true
  },
  {
    "title": "Apitemplate Io",
    "description": "Integrate Apitemplate Io to seamlessly execute automated workflows, synchronize data, and orchestrate Apitemplate Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/apitemplate_io",
    "app_name": "apitemplate_io",
    "isAvailable": true
  },
  {
    "title": "Apiverve",
    "description": "Integrate Apiverve to seamlessly execute automated workflows, synchronize data, and orchestrate Apiverve actions directly within Alti.",
    "image": "https://logos.composio.dev/api/apiverve",
    "app_name": "apiverve",
    "isAvailable": true
  },
  {
    "title": "Appcircle",
    "description": "Integrate Appcircle to seamlessly execute automated workflows, synchronize data, and orchestrate Appcircle actions directly within Alti.",
    "image": "https://logos.composio.dev/api/appcircle",
    "app_name": "appcircle",
    "isAvailable": true
  },
  {
    "title": "Appdrag",
    "description": "Integrate Appdrag to seamlessly execute automated workflows, synchronize data, and orchestrate Appdrag actions directly within Alti.",
    "image": "https://logos.composio.dev/api/appdrag",
    "app_name": "appdrag",
    "isAvailable": true
  },
  {
    "title": "Appointo",
    "description": "Integrate Appointo to seamlessly execute automated workflows, synchronize data, and orchestrate Appointo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/appointo",
    "app_name": "appointo",
    "isAvailable": true
  },
  {
    "title": "Appsflyer",
    "description": "Integrate Appsflyer to seamlessly execute automated workflows, synchronize data, and orchestrate Appsflyer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/appsflyer",
    "app_name": "appsflyer",
    "isAvailable": true
  },
  {
    "title": "Appveyor",
    "description": "Integrate Appveyor to seamlessly execute automated workflows, synchronize data, and orchestrate Appveyor actions directly within Alti.",
    "image": "https://logos.composio.dev/api/appveyor",
    "app_name": "appveyor",
    "isAvailable": true
  },
  {
    "title": "Aryn",
    "description": "Integrate Aryn to seamlessly execute automated workflows, synchronize data, and orchestrate Aryn actions directly within Alti.",
    "image": "https://logos.composio.dev/api/aryn",
    "app_name": "aryn",
    "isAvailable": true
  },
  {
    "title": "Ascora",
    "description": "Integrate Ascora to seamlessly execute automated workflows, synchronize data, and orchestrate Ascora actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ascora",
    "app_name": "ascora",
    "isAvailable": true
  },
  {
    "title": "Ashby",
    "description": "Integrate Ashby to seamlessly execute automated workflows, synchronize data, and orchestrate Ashby actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ashby",
    "app_name": "ashby",
    "isAvailable": true
  },
  {
    "title": "Astica AI",
    "description": "Integrate Astica AI to seamlessly execute automated workflows, synchronize data, and orchestrate Astica AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/astica_ai",
    "app_name": "astica_ai",
    "isAvailable": true
  },
  {
    "title": "Async Interview",
    "description": "Integrate Async Interview to seamlessly execute automated workflows, synchronize data, and orchestrate Async Interview actions directly within Alti.",
    "image": "https://logos.composio.dev/api/async_interview",
    "app_name": "async_interview",
    "isAvailable": true
  },
  {
    "title": "Atlassian",
    "description": "Integrate Atlassian to seamlessly execute automated workflows, synchronize data, and orchestrate Atlassian actions directly within Alti.",
    "image": "https://logos.composio.dev/api/atlassian",
    "app_name": "atlassian",
    "isAvailable": true
  },
  {
    "title": "Auth0",
    "description": "Integrate Auth0 to seamlessly execute automated workflows, synchronize data, and orchestrate Auth0 actions directly within Alti.",
    "image": "https://logos.composio.dev/api/auth0",
    "app_name": "auth0",
    "isAvailable": true
  },
  {
    "title": "Autobound",
    "description": "Integrate Autobound to seamlessly execute automated workflows, synchronize data, and orchestrate Autobound actions directly within Alti.",
    "image": "https://logos.composio.dev/api/autobound",
    "app_name": "autobound",
    "isAvailable": true
  },
  {
    "title": "Autom",
    "description": "Integrate Autom to seamlessly execute automated workflows, synchronize data, and orchestrate Autom actions directly within Alti.",
    "image": "https://logos.composio.dev/api/autom",
    "app_name": "autom",
    "isAvailable": true
  },
  {
    "title": "Axonaut",
    "description": "Integrate Axonaut to seamlessly execute automated workflows, synchronize data, and orchestrate Axonaut actions directly within Alti.",
    "image": "https://logos.composio.dev/api/axonaut",
    "app_name": "axonaut",
    "isAvailable": true
  },
  {
    "title": "Ayrshare",
    "description": "Integrate Ayrshare to seamlessly execute automated workflows, synchronize data, and orchestrate Ayrshare actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ayrshare",
    "app_name": "ayrshare",
    "isAvailable": true
  },
  {
    "title": "Backendless",
    "description": "Integrate Backendless to seamlessly execute automated workflows, synchronize data, and orchestrate Backendless actions directly within Alti.",
    "image": "https://logos.composio.dev/api/backendless",
    "app_name": "backendless",
    "isAvailable": true
  },
  {
    "title": "Bamboohr",
    "description": "Integrate Bamboohr to seamlessly execute automated workflows, synchronize data, and orchestrate Bamboohr actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bamboohr",
    "app_name": "bamboohr",
    "isAvailable": true
  },
  {
    "title": "Bart",
    "description": "Integrate Bart to seamlessly execute automated workflows, synchronize data, and orchestrate Bart actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bart",
    "app_name": "bart",
    "isAvailable": true
  },
  {
    "title": "Basin",
    "description": "Integrate Basin to seamlessly execute automated workflows, synchronize data, and orchestrate Basin actions directly within Alti.",
    "image": "https://logos.composio.dev/api/basin",
    "app_name": "basin",
    "isAvailable": true
  },
  {
    "title": "Battlenet",
    "description": "Integrate Battlenet to seamlessly execute automated workflows, synchronize data, and orchestrate Battlenet actions directly within Alti.",
    "image": "https://logos.composio.dev/api/battlenet",
    "app_name": "battlenet",
    "isAvailable": true
  },
  {
    "title": "Beaconchain",
    "description": "Integrate Beaconchain to seamlessly execute automated workflows, synchronize data, and orchestrate Beaconchain actions directly within Alti.",
    "image": "https://logos.composio.dev/api/beaconchain",
    "app_name": "beaconchain",
    "isAvailable": true
  },
  {
    "title": "Beaconstac",
    "description": "Integrate Beaconstac to seamlessly execute automated workflows, synchronize data, and orchestrate Beaconstac actions directly within Alti.",
    "image": "https://logos.composio.dev/api/beaconstac",
    "app_name": "beaconstac",
    "isAvailable": true
  },
  {
    "title": "Beamer",
    "description": "Integrate Beamer to seamlessly execute automated workflows, synchronize data, and orchestrate Beamer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/beamer",
    "app_name": "beamer",
    "isAvailable": true
  },
  {
    "title": "Beeminder",
    "description": "Integrate Beeminder to seamlessly execute automated workflows, synchronize data, and orchestrate Beeminder actions directly within Alti.",
    "image": "https://logos.composio.dev/api/beeminder",
    "app_name": "beeminder",
    "isAvailable": true
  },
  {
    "title": "Bench",
    "description": "Integrate Bench to seamlessly execute automated workflows, synchronize data, and orchestrate Bench actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bench",
    "app_name": "bench",
    "isAvailable": true
  },
  {
    "title": "Benchmark Email",
    "description": "Integrate Benchmark Email to seamlessly execute automated workflows, synchronize data, and orchestrate Benchmark Email actions directly within Alti.",
    "image": "https://logos.composio.dev/api/benchmark_email",
    "app_name": "benchmark_email",
    "isAvailable": true
  },
  {
    "title": "Benzinga",
    "description": "Integrate Benzinga to seamlessly execute automated workflows, synchronize data, and orchestrate Benzinga actions directly within Alti.",
    "image": "https://logos.composio.dev/api/benzinga",
    "app_name": "benzinga",
    "isAvailable": true
  },
  {
    "title": "Bestbuy",
    "description": "Integrate Bestbuy to seamlessly execute automated workflows, synchronize data, and orchestrate Bestbuy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bestbuy",
    "app_name": "bestbuy",
    "isAvailable": true
  },
  {
    "title": "Better Proposals",
    "description": "Integrate Better Proposals to seamlessly execute automated workflows, synchronize data, and orchestrate Better Proposals actions directly within Alti.",
    "image": "https://logos.composio.dev/api/better_proposals",
    "app_name": "better_proposals",
    "isAvailable": true
  },
  {
    "title": "Better Stack",
    "description": "Integrate Better Stack to seamlessly execute automated workflows, synchronize data, and orchestrate Better Stack actions directly within Alti.",
    "image": "https://logos.composio.dev/api/better_stack",
    "app_name": "better_stack",
    "isAvailable": true
  },
  {
    "title": "Bidsketch",
    "description": "Integrate Bidsketch to seamlessly execute automated workflows, synchronize data, and orchestrate Bidsketch actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bidsketch",
    "app_name": "bidsketch",
    "isAvailable": true
  },
  {
    "title": "Big Data Cloud",
    "description": "Integrate Big Data Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Big Data Cloud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/big_data_cloud",
    "app_name": "big_data_cloud",
    "isAvailable": true
  },
  {
    "title": "Bigmailer",
    "description": "Integrate Bigmailer to seamlessly execute automated workflows, synchronize data, and orchestrate Bigmailer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bigmailer",
    "app_name": "bigmailer",
    "isAvailable": true
  },
  {
    "title": "Bigml",
    "description": "Integrate Bigml to seamlessly execute automated workflows, synchronize data, and orchestrate Bigml actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bigml",
    "app_name": "bigml",
    "isAvailable": true
  },
  {
    "title": "Bigpicture Io",
    "description": "Integrate Bigpicture Io to seamlessly execute automated workflows, synchronize data, and orchestrate Bigpicture Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bigpicture_io",
    "app_name": "bigpicture_io",
    "isAvailable": true
  },
  {
    "title": "Bill",
    "description": "Integrate Bill to seamlessly execute automated workflows, synchronize data, and orchestrate Bill actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bill",
    "app_name": "bill",
    "isAvailable": true
  },
  {
    "title": "Bitquery",
    "description": "Integrate Bitquery to seamlessly execute automated workflows, synchronize data, and orchestrate Bitquery actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bitquery",
    "app_name": "bitquery",
    "isAvailable": true
  },
  {
    "title": "Bitwarden",
    "description": "Integrate Bitwarden to seamlessly execute automated workflows, synchronize data, and orchestrate Bitwarden actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bitwarden",
    "app_name": "bitwarden",
    "isAvailable": true
  },
  {
    "title": "Blackbaud",
    "description": "Integrate Blackbaud to seamlessly execute automated workflows, synchronize data, and orchestrate Blackbaud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/blackbaud",
    "app_name": "blackbaud",
    "isAvailable": true
  },
  {
    "title": "Blackboard",
    "description": "Integrate Blackboard to seamlessly execute automated workflows, synchronize data, and orchestrate Blackboard actions directly within Alti.",
    "image": "https://logos.composio.dev/api/blackboard",
    "app_name": "blackboard",
    "isAvailable": true
  },
  {
    "title": "Blazemeter",
    "description": "Integrate Blazemeter to seamlessly execute automated workflows, synchronize data, and orchestrate Blazemeter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/blazemeter",
    "app_name": "blazemeter",
    "isAvailable": true
  },
  {
    "title": "Blocknative",
    "description": "Integrate Blocknative to seamlessly execute automated workflows, synchronize data, and orchestrate Blocknative actions directly within Alti.",
    "image": "https://logos.composio.dev/api/blocknative",
    "app_name": "blocknative",
    "isAvailable": true
  },
  {
    "title": "Boldsign",
    "description": "Integrate Boldsign to seamlessly execute automated workflows, synchronize data, and orchestrate Boldsign actions directly within Alti.",
    "image": "https://logos.composio.dev/api/boldsign",
    "app_name": "boldsign",
    "isAvailable": true
  },
  {
    "title": "Boloforms",
    "description": "Integrate Boloforms to seamlessly execute automated workflows, synchronize data, and orchestrate Boloforms actions directly within Alti.",
    "image": "https://logos.composio.dev/api/boloforms",
    "app_name": "boloforms",
    "isAvailable": true
  },
  {
    "title": "Bolt IoT",
    "description": "Integrate Bolt IoT to seamlessly execute automated workflows, synchronize data, and orchestrate Bolt IoT actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bolt_iot",
    "app_name": "bolt_iot",
    "isAvailable": true
  },
  {
    "title": "Bonsai",
    "description": "Integrate Bonsai to seamlessly execute automated workflows, synchronize data, and orchestrate Bonsai actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bonsai",
    "app_name": "bonsai",
    "isAvailable": true
  },
  {
    "title": "Bookingmood",
    "description": "Integrate Bookingmood to seamlessly execute automated workflows, synchronize data, and orchestrate Bookingmood actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bookingmood",
    "app_name": "bookingmood",
    "isAvailable": true
  },
  {
    "title": "Booqable",
    "description": "Integrate Booqable to seamlessly execute automated workflows, synchronize data, and orchestrate Booqable actions directly within Alti.",
    "image": "https://logos.composio.dev/api/booqable",
    "app_name": "booqable",
    "isAvailable": true
  },
  {
    "title": "Botbaba",
    "description": "Integrate Botbaba to seamlessly execute automated workflows, synchronize data, and orchestrate Botbaba actions directly within Alti.",
    "image": "https://logos.composio.dev/api/botbaba",
    "app_name": "botbaba",
    "isAvailable": true
  },
  {
    "title": "Botpress",
    "description": "Integrate Botpress to seamlessly execute automated workflows, synchronize data, and orchestrate Botpress actions directly within Alti.",
    "image": "https://logos.composio.dev/api/botpress",
    "app_name": "botpress",
    "isAvailable": true
  },
  {
    "title": "Botsonic",
    "description": "Integrate Botsonic to seamlessly execute automated workflows, synchronize data, and orchestrate Botsonic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/botsonic",
    "app_name": "botsonic",
    "isAvailable": true
  },
  {
    "title": "Botstar",
    "description": "Integrate Botstar to seamlessly execute automated workflows, synchronize data, and orchestrate Botstar actions directly within Alti.",
    "image": "https://logos.composio.dev/api/botstar",
    "app_name": "botstar",
    "isAvailable": true
  },
  {
    "title": "Bouncer",
    "description": "Integrate Bouncer to seamlessly execute automated workflows, synchronize data, and orchestrate Bouncer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bouncer",
    "app_name": "bouncer",
    "isAvailable": true
  },
  {
    "title": "Box",
    "description": "Integrate Box to seamlessly execute automated workflows, synchronize data, and orchestrate Box actions directly within Alti.",
    "image": "https://logos.composio.dev/api/box",
    "app_name": "box",
    "isAvailable": true
  },
  {
    "title": "Boxhero",
    "description": "Integrate Boxhero to seamlessly execute automated workflows, synchronize data, and orchestrate Boxhero actions directly within Alti.",
    "image": "https://logos.composio.dev/api/boxhero",
    "app_name": "boxhero",
    "isAvailable": true
  },
  {
    "title": "Braintree",
    "description": "Integrate Braintree to seamlessly execute automated workflows, synchronize data, and orchestrate Braintree actions directly within Alti.",
    "image": "https://logos.composio.dev/api/braintree",
    "app_name": "braintree",
    "isAvailable": true
  },
  {
    "title": "Breeze",
    "description": "Integrate Breeze to seamlessly execute automated workflows, synchronize data, and orchestrate Breeze actions directly within Alti.",
    "image": "https://logos.composio.dev/api/breeze",
    "app_name": "breeze",
    "isAvailable": true
  },
  {
    "title": "Breezy HR",
    "description": "Integrate Breezy HR to seamlessly execute automated workflows, synchronize data, and orchestrate Breezy HR actions directly within Alti.",
    "image": "https://logos.composio.dev/api/breezy_hr",
    "app_name": "breezy_hr",
    "isAvailable": true
  },
  {
    "title": "Brevo",
    "description": "Integrate Brevo to seamlessly execute automated workflows, synchronize data, and orchestrate Brevo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/brevo",
    "app_name": "brevo",
    "isAvailable": true
  },
  {
    "title": "Brex Staging",
    "description": "Integrate Brex Staging to seamlessly execute automated workflows, synchronize data, and orchestrate Brex Staging actions directly within Alti.",
    "image": "https://logos.composio.dev/api/brex_staging",
    "app_name": "brex_staging",
    "isAvailable": true
  },
  {
    "title": "Brightdata",
    "description": "Integrate Brightdata to seamlessly execute automated workflows, synchronize data, and orchestrate Brightdata actions directly within Alti.",
    "image": "https://logos.composio.dev/api/brightdata",
    "app_name": "brightdata",
    "isAvailable": true
  },
  {
    "title": "Brightpearl",
    "description": "Integrate Brightpearl to seamlessly execute automated workflows, synchronize data, and orchestrate Brightpearl actions directly within Alti.",
    "image": "https://logos.composio.dev/api/brightpearl",
    "app_name": "brightpearl",
    "isAvailable": true
  },
  {
    "title": "Brilliant Directories",
    "description": "Integrate Brilliant Directories to seamlessly execute automated workflows, synchronize data, and orchestrate Brilliant Directories actions directly within Alti.",
    "image": "https://logos.composio.dev/api/brilliant_directories",
    "app_name": "brilliant_directories",
    "isAvailable": true
  },
  {
    "title": "Browser Tool",
    "description": "Integrate Browser Tool to seamlessly execute automated workflows, synchronize data, and orchestrate Browser Tool actions directly within Alti.",
    "image": "https://logos.composio.dev/api/browser_tool",
    "app_name": "browser_tool",
    "isAvailable": true
  },
  {
    "title": "Browserbase Tool",
    "description": "Integrate Browserbase Tool to seamlessly execute automated workflows, synchronize data, and orchestrate Browserbase Tool actions directly within Alti.",
    "image": "https://logos.composio.dev/api/browserbase_tool",
    "app_name": "browserbase_tool",
    "isAvailable": true
  },
  {
    "title": "Browserhub",
    "description": "Integrate Browserhub to seamlessly execute automated workflows, synchronize data, and orchestrate Browserhub actions directly within Alti.",
    "image": "https://logos.composio.dev/api/browserhub",
    "app_name": "browserhub",
    "isAvailable": true
  },
  {
    "title": "Browserless",
    "description": "Integrate Browserless to seamlessly execute automated workflows, synchronize data, and orchestrate Browserless actions directly within Alti.",
    "image": "https://logos.composio.dev/api/browserless",
    "app_name": "browserless",
    "isAvailable": true
  },
  {
    "title": "Btcpay Server",
    "description": "Integrate Btcpay Server to seamlessly execute automated workflows, synchronize data, and orchestrate Btcpay Server actions directly within Alti.",
    "image": "https://logos.composio.dev/api/btcpay_server",
    "app_name": "btcpay_server",
    "isAvailable": true
  },
  {
    "title": "Bubble",
    "description": "Integrate Bubble to seamlessly execute automated workflows, synchronize data, and orchestrate Bubble actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bubble",
    "app_name": "bubble",
    "isAvailable": true
  },
  {
    "title": "Bugbug",
    "description": "Integrate Bugbug to seamlessly execute automated workflows, synchronize data, and orchestrate Bugbug actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bugbug",
    "app_name": "bugbug",
    "isAvailable": true
  },
  {
    "title": "Bugherd",
    "description": "Integrate Bugherd to seamlessly execute automated workflows, synchronize data, and orchestrate Bugherd actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bugherd",
    "app_name": "bugherd",
    "isAvailable": true
  },
  {
    "title": "Bugsnag",
    "description": "Integrate Bugsnag to seamlessly execute automated workflows, synchronize data, and orchestrate Bugsnag actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bugsnag",
    "app_name": "bugsnag",
    "isAvailable": true
  },
  {
    "title": "Buildkite",
    "description": "Integrate Buildkite to seamlessly execute automated workflows, synchronize data, and orchestrate Buildkite actions directly within Alti.",
    "image": "https://logos.composio.dev/api/buildkite",
    "app_name": "buildkite",
    "isAvailable": true
  },
  {
    "title": "Builtwith",
    "description": "Integrate Builtwith to seamlessly execute automated workflows, synchronize data, and orchestrate Builtwith actions directly within Alti.",
    "image": "https://logos.composio.dev/api/builtwith",
    "app_name": "builtwith",
    "isAvailable": true
  },
  {
    "title": "Bunnycdn",
    "description": "Integrate Bunnycdn to seamlessly execute automated workflows, synchronize data, and orchestrate Bunnycdn actions directly within Alti.",
    "image": "https://logos.composio.dev/api/bunnycdn",
    "app_name": "bunnycdn",
    "isAvailable": true
  },
  {
    "title": "Byteforms",
    "description": "Integrate Byteforms to seamlessly execute automated workflows, synchronize data, and orchestrate Byteforms actions directly within Alti.",
    "image": "https://logos.composio.dev/api/byteforms",
    "app_name": "byteforms",
    "isAvailable": true
  },
  {
    "title": "Cabinpanda",
    "description": "Integrate Cabinpanda to seamlessly execute automated workflows, synchronize data, and orchestrate Cabinpanda actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cabinpanda",
    "app_name": "cabinpanda",
    "isAvailable": true
  },
  {
    "title": "Callerapi",
    "description": "Integrate Callerapi to seamlessly execute automated workflows, synchronize data, and orchestrate Callerapi actions directly within Alti.",
    "image": "https://logos.composio.dev/api/callerapi",
    "app_name": "callerapi",
    "isAvailable": true
  },
  {
    "title": "Callingly",
    "description": "Integrate Callingly to seamlessly execute automated workflows, synchronize data, and orchestrate Callingly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/callingly",
    "app_name": "callingly",
    "isAvailable": true
  },
  {
    "title": "Callpage",
    "description": "Integrate Callpage to seamlessly execute automated workflows, synchronize data, and orchestrate Callpage actions directly within Alti.",
    "image": "https://logos.composio.dev/api/callpage",
    "app_name": "callpage",
    "isAvailable": true
  },
  {
    "title": "Campaign Cleaner",
    "description": "Integrate Campaign Cleaner to seamlessly execute automated workflows, synchronize data, and orchestrate Campaign Cleaner actions directly within Alti.",
    "image": "https://logos.composio.dev/api/campaign_cleaner",
    "app_name": "campaign_cleaner",
    "isAvailable": true
  },
  {
    "title": "Campayn",
    "description": "Integrate Campayn to seamlessly execute automated workflows, synchronize data, and orchestrate Campayn actions directly within Alti.",
    "image": "https://logos.composio.dev/api/campayn",
    "app_name": "campayn",
    "isAvailable": true
  },
  {
    "title": "Canny",
    "description": "Integrate Canny to seamlessly execute automated workflows, synchronize data, and orchestrate Canny actions directly within Alti.",
    "image": "https://logos.composio.dev/api/canny",
    "app_name": "canny",
    "isAvailable": true
  },
  {
    "title": "Carbone",
    "description": "Integrate Carbone to seamlessly execute automated workflows, synchronize data, and orchestrate Carbone actions directly within Alti.",
    "image": "https://logos.composio.dev/api/carbone",
    "app_name": "carbone",
    "isAvailable": true
  },
  {
    "title": "Cardly",
    "description": "Integrate Cardly to seamlessly execute automated workflows, synchronize data, and orchestrate Cardly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cardly",
    "app_name": "cardly",
    "isAvailable": true
  },
  {
    "title": "Castingwords",
    "description": "Integrate Castingwords to seamlessly execute automated workflows, synchronize data, and orchestrate Castingwords actions directly within Alti.",
    "image": "https://logos.composio.dev/api/castingwords",
    "app_name": "castingwords",
    "isAvailable": true
  },
  {
    "title": "Cats",
    "description": "Integrate Cats to seamlessly execute automated workflows, synchronize data, and orchestrate Cats actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cats",
    "app_name": "cats",
    "isAvailable": true
  },
  {
    "title": "Cdr Platform",
    "description": "Integrate Cdr Platform to seamlessly execute automated workflows, synchronize data, and orchestrate Cdr Platform actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cdr_platform",
    "app_name": "cdr_platform",
    "isAvailable": true
  },
  {
    "title": "Census Bureau",
    "description": "Integrate Census Bureau to seamlessly execute automated workflows, synchronize data, and orchestrate Census Bureau actions directly within Alti.",
    "image": "https://logos.composio.dev/api/census_bureau",
    "app_name": "census_bureau",
    "isAvailable": true
  },
  {
    "title": "Centralstationcrm",
    "description": "Integrate Centralstationcrm to seamlessly execute automated workflows, synchronize data, and orchestrate Centralstationcrm actions directly within Alti.",
    "image": "https://logos.composio.dev/api/centralstationcrm",
    "app_name": "centralstationcrm",
    "isAvailable": true
  },
  {
    "title": "Certifier",
    "description": "Integrate Certifier to seamlessly execute automated workflows, synchronize data, and orchestrate Certifier actions directly within Alti.",
    "image": "https://logos.composio.dev/api/certifier",
    "app_name": "certifier",
    "isAvailable": true
  },
  {
    "title": "Chaser",
    "description": "Integrate Chaser to seamlessly execute automated workflows, synchronize data, and orchestrate Chaser actions directly within Alti.",
    "image": "https://logos.composio.dev/api/chaser",
    "app_name": "chaser",
    "isAvailable": true
  },
  {
    "title": "Chatbotkit",
    "description": "Integrate Chatbotkit to seamlessly execute automated workflows, synchronize data, and orchestrate Chatbotkit actions directly within Alti.",
    "image": "https://logos.composio.dev/api/chatbotkit",
    "app_name": "chatbotkit",
    "isAvailable": true
  },
  {
    "title": "Chatfai",
    "description": "Integrate Chatfai to seamlessly execute automated workflows, synchronize data, and orchestrate Chatfai actions directly within Alti.",
    "image": "https://logos.composio.dev/api/chatfai",
    "app_name": "chatfai",
    "isAvailable": true
  },
  {
    "title": "Chmeetings",
    "description": "Integrate Chmeetings to seamlessly execute automated workflows, synchronize data, and orchestrate Chmeetings actions directly within Alti.",
    "image": "https://logos.composio.dev/api/chmeetings",
    "app_name": "chmeetings",
    "isAvailable": true
  },
  {
    "title": "Cincopa",
    "description": "Integrate Cincopa to seamlessly execute automated workflows, synchronize data, and orchestrate Cincopa actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cincopa",
    "app_name": "cincopa",
    "isAvailable": true
  },
  {
    "title": "Circleci",
    "description": "Integrate Circleci to seamlessly execute automated workflows, synchronize data, and orchestrate Circleci actions directly within Alti.",
    "image": "https://logos.composio.dev/api/circleci",
    "app_name": "circleci",
    "isAvailable": true
  },
  {
    "title": "Claid AI",
    "description": "Integrate Claid AI to seamlessly execute automated workflows, synchronize data, and orchestrate Claid AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/claid_ai",
    "app_name": "claid_ai",
    "isAvailable": true
  },
  {
    "title": "Classmarker",
    "description": "Integrate Classmarker to seamlessly execute automated workflows, synchronize data, and orchestrate Classmarker actions directly within Alti.",
    "image": "https://logos.composio.dev/api/classmarker",
    "app_name": "classmarker",
    "isAvailable": true
  },
  {
    "title": "Clearout",
    "description": "Integrate Clearout to seamlessly execute automated workflows, synchronize data, and orchestrate Clearout actions directly within Alti.",
    "image": "https://logos.composio.dev/api/clearout",
    "app_name": "clearout",
    "isAvailable": true
  },
  {
    "title": "Clickhouse",
    "description": "Integrate Clickhouse to seamlessly execute automated workflows, synchronize data, and orchestrate Clickhouse actions directly within Alti.",
    "image": "https://logos.composio.dev/api/clickhouse",
    "app_name": "clickhouse",
    "isAvailable": true
  },
  {
    "title": "Clickmeeting",
    "description": "Integrate Clickmeeting to seamlessly execute automated workflows, synchronize data, and orchestrate Clickmeeting actions directly within Alti.",
    "image": "https://logos.composio.dev/api/clickmeeting",
    "app_name": "clickmeeting",
    "isAvailable": true
  },
  {
    "title": "Clockify",
    "description": "Integrate Clockify to seamlessly execute automated workflows, synchronize data, and orchestrate Clockify actions directly within Alti.",
    "image": "https://logos.composio.dev/api/clockify",
    "app_name": "clockify",
    "isAvailable": true
  },
  {
    "title": "Cloudconvert",
    "description": "Integrate Cloudconvert to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudconvert actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cloudconvert",
    "app_name": "cloudconvert",
    "isAvailable": true
  },
  {
    "title": "Cloudflare",
    "description": "Integrate Cloudflare to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudflare actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cloudflare",
    "app_name": "cloudflare",
    "isAvailable": true
  },
  {
    "title": "Cloudflare API Key",
    "description": "Integrate Cloudflare API Key to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudflare API Key actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cloudflare_api_key",
    "app_name": "cloudflare_api_key",
    "isAvailable": true
  },
  {
    "title": "Cloudflare Browser Rendering",
    "description": "Integrate Cloudflare Browser Rendering to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudflare Browser Rendering actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cloudflare_browser_rendering",
    "app_name": "cloudflare_browser_rendering",
    "isAvailable": true
  },
  {
    "title": "Cloudinary",
    "description": "Integrate Cloudinary to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudinary actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cloudinary",
    "app_name": "cloudinary",
    "isAvailable": true
  },
  {
    "title": "Cloudlayer",
    "description": "Integrate Cloudlayer to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudlayer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cloudlayer",
    "app_name": "cloudlayer",
    "isAvailable": true
  },
  {
    "title": "Cloudpress",
    "description": "Integrate Cloudpress to seamlessly execute automated workflows, synchronize data, and orchestrate Cloudpress actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cloudpress",
    "app_name": "cloudpress",
    "isAvailable": true
  },
  {
    "title": "Coassemble",
    "description": "Integrate Coassemble to seamlessly execute automated workflows, synchronize data, and orchestrate Coassemble actions directly within Alti.",
    "image": "https://logos.composio.dev/api/coassemble",
    "app_name": "coassemble",
    "isAvailable": true
  },
  {
    "title": "Codacy",
    "description": "Integrate Codacy to seamlessly execute automated workflows, synchronize data, and orchestrate Codacy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/codacy",
    "app_name": "codacy",
    "isAvailable": true
  },
  {
    "title": "Codeinterpreter",
    "description": "Integrate Codeinterpreter to seamlessly execute automated workflows, synchronize data, and orchestrate Codeinterpreter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/codeinterpreter",
    "app_name": "codeinterpreter",
    "isAvailable": true
  },
  {
    "title": "Codereadr",
    "description": "Integrate Codereadr to seamlessly execute automated workflows, synchronize data, and orchestrate Codereadr actions directly within Alti.",
    "image": "https://logos.composio.dev/api/codereadr",
    "app_name": "codereadr",
    "isAvailable": true
  },
  {
    "title": "Coinmarketcal",
    "description": "Integrate Coinmarketcal to seamlessly execute automated workflows, synchronize data, and orchestrate Coinmarketcal actions directly within Alti.",
    "image": "https://logos.composio.dev/api/coinmarketcal",
    "app_name": "coinmarketcal",
    "isAvailable": true
  },
  {
    "title": "Coinmarketcap",
    "description": "Integrate Coinmarketcap to seamlessly execute automated workflows, synchronize data, and orchestrate Coinmarketcap actions directly within Alti.",
    "image": "https://logos.composio.dev/api/coinmarketcap",
    "app_name": "coinmarketcap",
    "isAvailable": true
  },
  {
    "title": "College Football Data",
    "description": "Integrate College Football Data to seamlessly execute automated workflows, synchronize data, and orchestrate College Football Data actions directly within Alti.",
    "image": "https://logos.composio.dev/api/college_football_data",
    "app_name": "college_football_data",
    "isAvailable": true
  },
  {
    "title": "Composio",
    "description": "Integrate Composio to seamlessly execute automated workflows, synchronize data, and orchestrate Composio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/composio",
    "app_name": "composio",
    "isAvailable": true
  },
  {
    "title": "Composio Search",
    "description": "Integrate Composio Search to seamlessly execute automated workflows, synchronize data, and orchestrate Composio Search actions directly within Alti.",
    "image": "https://logos.composio.dev/api/composio_search",
    "app_name": "composio_search",
    "isAvailable": true
  },
  {
    "title": "Confluence",
    "description": "Integrate Confluence to seamlessly execute automated workflows, synchronize data, and orchestrate Confluence actions directly within Alti.",
    "image": "https://logos.composio.dev/api/confluence",
    "app_name": "confluence",
    "isAvailable": true
  },
  {
    "title": "Connecteam",
    "description": "Integrate Connecteam to seamlessly execute automated workflows, synchronize data, and orchestrate Connecteam actions directly within Alti.",
    "image": "https://logos.composio.dev/api/connecteam",
    "app_name": "connecteam",
    "isAvailable": true
  },
  {
    "title": "Contentful Graphql",
    "description": "Integrate Contentful Graphql to seamlessly execute automated workflows, synchronize data, and orchestrate Contentful Graphql actions directly within Alti.",
    "image": "https://logos.composio.dev/api/contentful_graphql",
    "app_name": "contentful_graphql",
    "isAvailable": true
  },
  {
    "title": "Control D",
    "description": "Integrate Control D to seamlessly execute automated workflows, synchronize data, and orchestrate Control D actions directly within Alti.",
    "image": "https://logos.composio.dev/api/control_d",
    "app_name": "control_d",
    "isAvailable": true
  },
  {
    "title": "Conversion Tools",
    "description": "Integrate Conversion Tools to seamlessly execute automated workflows, synchronize data, and orchestrate Conversion Tools actions directly within Alti.",
    "image": "https://logos.composio.dev/api/conversion_tools",
    "app_name": "conversion_tools",
    "isAvailable": true
  },
  {
    "title": "Convertapi",
    "description": "Integrate Convertapi to seamlessly execute automated workflows, synchronize data, and orchestrate Convertapi actions directly within Alti.",
    "image": "https://logos.composio.dev/api/convertapi",
    "app_name": "convertapi",
    "isAvailable": true
  },
  {
    "title": "Conveyor",
    "description": "Integrate Conveyor to seamlessly execute automated workflows, synchronize data, and orchestrate Conveyor actions directly within Alti.",
    "image": "https://logos.composio.dev/api/conveyor",
    "app_name": "conveyor",
    "isAvailable": true
  },
  {
    "title": "Convolo AI",
    "description": "Integrate Convolo AI to seamlessly execute automated workflows, synchronize data, and orchestrate Convolo AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/convolo_ai",
    "app_name": "convolo_ai",
    "isAvailable": true
  },
  {
    "title": "Corrently",
    "description": "Integrate Corrently to seamlessly execute automated workflows, synchronize data, and orchestrate Corrently actions directly within Alti.",
    "image": "https://logos.composio.dev/api/corrently",
    "app_name": "corrently",
    "isAvailable": true
  },
  {
    "title": "Countdown API",
    "description": "Integrate Countdown API to seamlessly execute automated workflows, synchronize data, and orchestrate Countdown API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/countdown_api",
    "app_name": "countdown_api",
    "isAvailable": true
  },
  {
    "title": "Coupa",
    "description": "Integrate Coupa to seamlessly execute automated workflows, synchronize data, and orchestrate Coupa actions directly within Alti.",
    "image": "https://logos.composio.dev/api/coupa",
    "app_name": "coupa",
    "isAvailable": true
  },
  {
    "title": "Craftmypdf",
    "description": "Integrate Craftmypdf to seamlessly execute automated workflows, synchronize data, and orchestrate Craftmypdf actions directly within Alti.",
    "image": "https://logos.composio.dev/api/craftmypdf",
    "app_name": "craftmypdf",
    "isAvailable": true
  },
  {
    "title": "Crowdin",
    "description": "Integrate Crowdin to seamlessly execute automated workflows, synchronize data, and orchestrate Crowdin actions directly within Alti.",
    "image": "https://logos.composio.dev/api/crowdin",
    "app_name": "crowdin",
    "isAvailable": true
  },
  {
    "title": "Cults",
    "description": "Integrate Cults to seamlessly execute automated workflows, synchronize data, and orchestrate Cults actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cults",
    "app_name": "cults",
    "isAvailable": true
  },
  {
    "title": "Curated",
    "description": "Integrate Curated to seamlessly execute automated workflows, synchronize data, and orchestrate Curated actions directly within Alti.",
    "image": "https://logos.composio.dev/api/curated",
    "app_name": "curated",
    "isAvailable": true
  },
  {
    "title": "Currents API",
    "description": "Integrate Currents API to seamlessly execute automated workflows, synchronize data, and orchestrate Currents API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/currents_api",
    "app_name": "currents_api",
    "isAvailable": true
  },
  {
    "title": "Customer Io",
    "description": "Integrate Customer Io to seamlessly execute automated workflows, synchronize data, and orchestrate Customer Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/customer_io",
    "app_name": "customer_io",
    "isAvailable": true
  },
  {
    "title": "Customgpt",
    "description": "Integrate Customgpt to seamlessly execute automated workflows, synchronize data, and orchestrate Customgpt actions directly within Alti.",
    "image": "https://logos.composio.dev/api/customgpt",
    "app_name": "customgpt",
    "isAvailable": true
  },
  {
    "title": "Customjs",
    "description": "Integrate Customjs to seamlessly execute automated workflows, synchronize data, and orchestrate Customjs actions directly within Alti.",
    "image": "https://logos.composio.dev/api/customjs",
    "app_name": "customjs",
    "isAvailable": true
  },
  {
    "title": "Cutt Ly",
    "description": "Integrate Cutt Ly to seamlessly execute automated workflows, synchronize data, and orchestrate Cutt Ly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/cutt_ly",
    "app_name": "cutt_ly",
    "isAvailable": true
  },
  {
    "title": "Dadata Ru",
    "description": "Integrate Dadata Ru to seamlessly execute automated workflows, synchronize data, and orchestrate Dadata Ru actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dadata_ru",
    "app_name": "dadata_ru",
    "isAvailable": true
  },
  {
    "title": "Daffy",
    "description": "Integrate Daffy to seamlessly execute automated workflows, synchronize data, and orchestrate Daffy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/daffy",
    "app_name": "daffy",
    "isAvailable": true
  },
  {
    "title": "Datagma",
    "description": "Integrate Datagma to seamlessly execute automated workflows, synchronize data, and orchestrate Datagma actions directly within Alti.",
    "image": "https://logos.composio.dev/api/datagma",
    "app_name": "datagma",
    "isAvailable": true
  },
  {
    "title": "Datarobot",
    "description": "Integrate Datarobot to seamlessly execute automated workflows, synchronize data, and orchestrate Datarobot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/datarobot",
    "app_name": "datarobot",
    "isAvailable": true
  },
  {
    "title": "Deadline Funnel",
    "description": "Integrate Deadline Funnel to seamlessly execute automated workflows, synchronize data, and orchestrate Deadline Funnel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/deadline_funnel",
    "app_name": "deadline_funnel",
    "isAvailable": true
  },
  {
    "title": "Deel",
    "description": "Integrate Deel to seamlessly execute automated workflows, synchronize data, and orchestrate Deel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/deel",
    "app_name": "deel",
    "isAvailable": true
  },
  {
    "title": "Deepgram",
    "description": "Integrate Deepgram to seamlessly execute automated workflows, synchronize data, and orchestrate Deepgram actions directly within Alti.",
    "image": "https://logos.composio.dev/api/deepgram",
    "app_name": "deepgram",
    "isAvailable": true
  },
  {
    "title": "Demio",
    "description": "Integrate Demio to seamlessly execute automated workflows, synchronize data, and orchestrate Demio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/demio",
    "app_name": "demio",
    "isAvailable": true
  },
  {
    "title": "Desktime",
    "description": "Integrate Desktime to seamlessly execute automated workflows, synchronize data, and orchestrate Desktime actions directly within Alti.",
    "image": "https://logos.composio.dev/api/desktime",
    "app_name": "desktime",
    "isAvailable": true
  },
  {
    "title": "Detrack",
    "description": "Integrate Detrack to seamlessly execute automated workflows, synchronize data, and orchestrate Detrack actions directly within Alti.",
    "image": "https://logos.composio.dev/api/detrack",
    "app_name": "detrack",
    "isAvailable": true
  },
  {
    "title": "Dialmycalls",
    "description": "Integrate Dialmycalls to seamlessly execute automated workflows, synchronize data, and orchestrate Dialmycalls actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dialmycalls",
    "app_name": "dialmycalls",
    "isAvailable": true
  },
  {
    "title": "Dictionary API",
    "description": "Integrate Dictionary API to seamlessly execute automated workflows, synchronize data, and orchestrate Dictionary API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dictionary_api",
    "app_name": "dictionary_api",
    "isAvailable": true
  },
  {
    "title": "Diffbot",
    "description": "Integrate Diffbot to seamlessly execute automated workflows, synchronize data, and orchestrate Diffbot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/diffbot",
    "app_name": "diffbot",
    "isAvailable": true
  },
  {
    "title": "Digicert",
    "description": "Integrate Digicert to seamlessly execute automated workflows, synchronize data, and orchestrate Digicert actions directly within Alti.",
    "image": "https://logos.composio.dev/api/digicert",
    "app_name": "digicert",
    "isAvailable": true
  },
  {
    "title": "Digital Ocean",
    "description": "Integrate Digital Ocean to seamlessly execute automated workflows, synchronize data, and orchestrate Digital Ocean actions directly within Alti.",
    "image": "https://logos.composio.dev/api/digital_ocean",
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
    "image": "https://logos.composio.dev/api/dnsfilter",
    "app_name": "dnsfilter",
    "isAvailable": true
  },
  {
    "title": "Dock Certs",
    "description": "Integrate Dock Certs to seamlessly execute automated workflows, synchronize data, and orchestrate Dock Certs actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dock_certs",
    "app_name": "dock_certs",
    "isAvailable": true
  },
  {
    "title": "Docker Hub",
    "description": "Integrate Docker Hub to seamlessly execute automated workflows, synchronize data, and orchestrate Docker Hub actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docker_hub",
    "app_name": "docker_hub",
    "isAvailable": true
  },
  {
    "title": "Docmosis",
    "description": "Integrate Docmosis to seamlessly execute automated workflows, synchronize data, and orchestrate Docmosis actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docmosis",
    "app_name": "docmosis",
    "isAvailable": true
  },
  {
    "title": "Docnify",
    "description": "Integrate Docnify to seamlessly execute automated workflows, synchronize data, and orchestrate Docnify actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docnify",
    "app_name": "docnify",
    "isAvailable": true
  },
  {
    "title": "Docsbot AI",
    "description": "Integrate Docsbot AI to seamlessly execute automated workflows, synchronize data, and orchestrate Docsbot AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docsbot_ai",
    "app_name": "docsbot_ai",
    "isAvailable": true
  },
  {
    "title": "Docsumo",
    "description": "Integrate Docsumo to seamlessly execute automated workflows, synchronize data, and orchestrate Docsumo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docsumo",
    "app_name": "docsumo",
    "isAvailable": true
  },
  {
    "title": "Docugenerate",
    "description": "Integrate Docugenerate to seamlessly execute automated workflows, synchronize data, and orchestrate Docugenerate actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docugenerate",
    "app_name": "docugenerate",
    "isAvailable": true
  },
  {
    "title": "Documenso",
    "description": "Integrate Documenso to seamlessly execute automated workflows, synchronize data, and orchestrate Documenso actions directly within Alti.",
    "image": "https://logos.composio.dev/api/documenso",
    "app_name": "documenso",
    "isAvailable": true
  },
  {
    "title": "Documint",
    "description": "Integrate Documint to seamlessly execute automated workflows, synchronize data, and orchestrate Documint actions directly within Alti.",
    "image": "https://logos.composio.dev/api/documint",
    "app_name": "documint",
    "isAvailable": true
  },
  {
    "title": "Docupilot",
    "description": "Integrate Docupilot to seamlessly execute automated workflows, synchronize data, and orchestrate Docupilot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docupilot",
    "app_name": "docupilot",
    "isAvailable": true
  },
  {
    "title": "Docupost",
    "description": "Integrate Docupost to seamlessly execute automated workflows, synchronize data, and orchestrate Docupost actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docupost",
    "app_name": "docupost",
    "isAvailable": true
  },
  {
    "title": "Docuseal",
    "description": "Integrate Docuseal to seamlessly execute automated workflows, synchronize data, and orchestrate Docuseal actions directly within Alti.",
    "image": "https://logos.composio.dev/api/docuseal",
    "app_name": "docuseal",
    "isAvailable": true
  },
  {
    "title": "Doppler Marketing Automation",
    "description": "Integrate Doppler Marketing Automation to seamlessly execute automated workflows, synchronize data, and orchestrate Doppler Marketing Automation actions directly within Alti.",
    "image": "https://logos.composio.dev/api/doppler_marketing_automation",
    "app_name": "doppler_marketing_automation",
    "isAvailable": true
  },
  {
    "title": "Doppler Secretops",
    "description": "Integrate Doppler Secretops to seamlessly execute automated workflows, synchronize data, and orchestrate Doppler Secretops actions directly within Alti.",
    "image": "https://logos.composio.dev/api/doppler_secretops",
    "app_name": "doppler_secretops",
    "isAvailable": true
  },
  {
    "title": "Dotsimple",
    "description": "Integrate Dotsimple to seamlessly execute automated workflows, synchronize data, and orchestrate Dotsimple actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dotsimple",
    "app_name": "dotsimple",
    "isAvailable": true
  },
  {
    "title": "Dovetail",
    "description": "Integrate Dovetail to seamlessly execute automated workflows, synchronize data, and orchestrate Dovetail actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dovetail",
    "app_name": "dovetail",
    "isAvailable": true
  },
  {
    "title": "Dpd2",
    "description": "Integrate Dpd2 to seamlessly execute automated workflows, synchronize data, and orchestrate Dpd2 actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dpd2",
    "app_name": "dpd2",
    "isAvailable": true
  },
  {
    "title": "Draftable",
    "description": "Integrate Draftable to seamlessly execute automated workflows, synchronize data, and orchestrate Draftable actions directly within Alti.",
    "image": "https://logos.composio.dev/api/draftable",
    "app_name": "draftable",
    "isAvailable": true
  },
  {
    "title": "Dreamstudio",
    "description": "Integrate Dreamstudio to seamlessly execute automated workflows, synchronize data, and orchestrate Dreamstudio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dreamstudio",
    "app_name": "dreamstudio",
    "isAvailable": true
  },
  {
    "title": "Drip Jobs",
    "description": "Integrate Drip Jobs to seamlessly execute automated workflows, synchronize data, and orchestrate Drip Jobs actions directly within Alti.",
    "image": "https://logos.composio.dev/api/drip_jobs",
    "app_name": "drip_jobs",
    "isAvailable": true
  },
  {
    "title": "Dripcel",
    "description": "Integrate Dripcel to seamlessly execute automated workflows, synchronize data, and orchestrate Dripcel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dripcel",
    "app_name": "dripcel",
    "isAvailable": true
  },
  {
    "title": "Dromo",
    "description": "Integrate Dromo to seamlessly execute automated workflows, synchronize data, and orchestrate Dromo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dromo",
    "app_name": "dromo",
    "isAvailable": true
  },
  {
    "title": "Dropbox Sign",
    "description": "Integrate Dropbox Sign to seamlessly execute automated workflows, synchronize data, and orchestrate Dropbox Sign actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dropbox_sign",
    "app_name": "dropbox_sign",
    "isAvailable": true
  },
  {
    "title": "Dropcontact",
    "description": "Integrate Dropcontact to seamlessly execute automated workflows, synchronize data, and orchestrate Dropcontact actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dropcontact",
    "app_name": "dropcontact",
    "isAvailable": true
  },
  {
    "title": "Dungeon Fighter Online",
    "description": "Integrate Dungeon Fighter Online to seamlessly execute automated workflows, synchronize data, and orchestrate Dungeon Fighter Online actions directly within Alti.",
    "image": "https://logos.composio.dev/api/dungeon_fighter_online",
    "app_name": "dungeon_fighter_online",
    "isAvailable": true
  },
  {
    "title": "Elasticsearch",
    "description": "Integrate Elasticsearch to seamlessly execute automated workflows, synchronize data, and orchestrate Elasticsearch actions directly within Alti.",
    "image": "https://logos.composio.dev/api/elasticsearch",
    "app_name": "elasticsearch",
    "isAvailable": true
  },
  {
    "title": "Elevenlabs",
    "description": "Integrate Elevenlabs to seamlessly execute automated workflows, synchronize data, and orchestrate Elevenlabs actions directly within Alti.",
    "image": "https://logos.composio.dev/api/elevenlabs",
    "app_name": "elevenlabs",
    "isAvailable": true
  },
  {
    "title": "Elorus",
    "description": "Integrate Elorus to seamlessly execute automated workflows, synchronize data, and orchestrate Elorus actions directly within Alti.",
    "image": "https://logos.composio.dev/api/elorus",
    "app_name": "elorus",
    "isAvailable": true
  },
  {
    "title": "Emailable",
    "description": "Integrate Emailable to seamlessly execute automated workflows, synchronize data, and orchestrate Emailable actions directly within Alti.",
    "image": "https://logos.composio.dev/api/emailable",
    "app_name": "emailable",
    "isAvailable": true
  },
  {
    "title": "Emaillistverify",
    "description": "Integrate Emaillistverify to seamlessly execute automated workflows, synchronize data, and orchestrate Emaillistverify actions directly within Alti.",
    "image": "https://logos.composio.dev/api/emaillistverify",
    "app_name": "emaillistverify",
    "isAvailable": true
  },
  {
    "title": "Emailoctopus",
    "description": "Integrate Emailoctopus to seamlessly execute automated workflows, synchronize data, and orchestrate Emailoctopus actions directly within Alti.",
    "image": "https://logos.composio.dev/api/emailoctopus",
    "app_name": "emailoctopus",
    "isAvailable": true
  },
  {
    "title": "Emelia",
    "description": "Integrate Emelia to seamlessly execute automated workflows, synchronize data, and orchestrate Emelia actions directly within Alti.",
    "image": "https://logos.composio.dev/api/emelia",
    "app_name": "emelia",
    "isAvailable": true
  },
  {
    "title": "Encodian",
    "description": "Integrate Encodian to seamlessly execute automated workflows, synchronize data, and orchestrate Encodian actions directly within Alti.",
    "image": "https://logos.composio.dev/api/encodian",
    "app_name": "encodian",
    "isAvailable": true
  },
  {
    "title": "Endorsal",
    "description": "Integrate Endorsal to seamlessly execute automated workflows, synchronize data, and orchestrate Endorsal actions directly within Alti.",
    "image": "https://logos.composio.dev/api/endorsal",
    "app_name": "endorsal",
    "isAvailable": true
  },
  {
    "title": "Enginemailer",
    "description": "Integrate Enginemailer to seamlessly execute automated workflows, synchronize data, and orchestrate Enginemailer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/enginemailer",
    "app_name": "enginemailer",
    "isAvailable": true
  },
  {
    "title": "Enigma",
    "description": "Integrate Enigma to seamlessly execute automated workflows, synchronize data, and orchestrate Enigma actions directly within Alti.",
    "image": "https://logos.composio.dev/api/enigma",
    "app_name": "enigma",
    "isAvailable": true
  },
  {
    "title": "Entelligence",
    "description": "Integrate Entelligence to seamlessly execute automated workflows, synchronize data, and orchestrate Entelligence actions directly within Alti.",
    "image": "https://logos.composio.dev/api/entelligence",
    "app_name": "entelligence",
    "isAvailable": true
  },
  {
    "title": "Eodhd Apis",
    "description": "Integrate Eodhd Apis to seamlessly execute automated workflows, synchronize data, and orchestrate Eodhd Apis actions directly within Alti.",
    "image": "https://logos.composio.dev/api/eodhd_apis",
    "app_name": "eodhd_apis",
    "isAvailable": true
  },
  {
    "title": "Epic Games",
    "description": "Integrate Epic Games to seamlessly execute automated workflows, synchronize data, and orchestrate Epic Games actions directly within Alti.",
    "image": "https://logos.composio.dev/api/epic_games",
    "app_name": "epic_games",
    "isAvailable": true
  },
  {
    "title": "Esignatures Io",
    "description": "Integrate Esignatures Io to seamlessly execute automated workflows, synchronize data, and orchestrate Esignatures Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/esignatures_io",
    "app_name": "esignatures_io",
    "isAvailable": true
  },
  {
    "title": "Espocrm",
    "description": "Integrate Espocrm to seamlessly execute automated workflows, synchronize data, and orchestrate Espocrm actions directly within Alti.",
    "image": "https://logos.composio.dev/api/espocrm",
    "app_name": "espocrm",
    "isAvailable": true
  },
  {
    "title": "Esputnik",
    "description": "Integrate Esputnik to seamlessly execute automated workflows, synchronize data, and orchestrate Esputnik actions directly within Alti.",
    "image": "https://logos.composio.dev/api/esputnik",
    "app_name": "esputnik",
    "isAvailable": true
  },
  {
    "title": "Etermin",
    "description": "Integrate Etermin to seamlessly execute automated workflows, synchronize data, and orchestrate Etermin actions directly within Alti.",
    "image": "https://logos.composio.dev/api/etermin",
    "app_name": "etermin",
    "isAvailable": true
  },
  {
    "title": "Evenium",
    "description": "Integrate Evenium to seamlessly execute automated workflows, synchronize data, and orchestrate Evenium actions directly within Alti.",
    "image": "https://logos.composio.dev/api/evenium",
    "app_name": "evenium",
    "isAvailable": true
  },
  {
    "title": "Eventee",
    "description": "Integrate Eventee to seamlessly execute automated workflows, synchronize data, and orchestrate Eventee actions directly within Alti.",
    "image": "https://logos.composio.dev/api/eventee",
    "app_name": "eventee",
    "isAvailable": true
  },
  {
    "title": "Eventzilla",
    "description": "Integrate Eventzilla to seamlessly execute automated workflows, synchronize data, and orchestrate Eventzilla actions directly within Alti.",
    "image": "https://logos.composio.dev/api/eventzilla",
    "app_name": "eventzilla",
    "isAvailable": true
  },
  {
    "title": "Everhour",
    "description": "Integrate Everhour to seamlessly execute automated workflows, synchronize data, and orchestrate Everhour actions directly within Alti.",
    "image": "https://logos.composio.dev/api/everhour",
    "app_name": "everhour",
    "isAvailable": true
  },
  {
    "title": "Eversign",
    "description": "Integrate Eversign to seamlessly execute automated workflows, synchronize data, and orchestrate Eversign actions directly within Alti.",
    "image": "https://logos.composio.dev/api/eversign",
    "app_name": "eversign",
    "isAvailable": true
  },
  {
    "title": "Excel",
    "description": "Integrate Excel to seamlessly execute automated workflows, synchronize data, and orchestrate Excel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/excel",
    "app_name": "excel",
    "isAvailable": true
  },
  {
    "title": "Exist",
    "description": "Integrate Exist to seamlessly execute automated workflows, synchronize data, and orchestrate Exist actions directly within Alti.",
    "image": "https://logos.composio.dev/api/exist",
    "app_name": "exist",
    "isAvailable": true
  },
  {
    "title": "Expofp",
    "description": "Integrate Expofp to seamlessly execute automated workflows, synchronize data, and orchestrate Expofp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/expofp",
    "app_name": "expofp",
    "isAvailable": true
  },
  {
    "title": "Extracta AI",
    "description": "Integrate Extracta AI to seamlessly execute automated workflows, synchronize data, and orchestrate Extracta AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/extracta_ai",
    "app_name": "extracta_ai",
    "isAvailable": true
  },
  {
    "title": "Faceup",
    "description": "Integrate Faceup to seamlessly execute automated workflows, synchronize data, and orchestrate Faceup actions directly within Alti.",
    "image": "https://logos.composio.dev/api/faceup",
    "app_name": "faceup",
    "isAvailable": true
  },
  {
    "title": "Factorial",
    "description": "Integrate Factorial to seamlessly execute automated workflows, synchronize data, and orchestrate Factorial actions directly within Alti.",
    "image": "https://logos.composio.dev/api/factorial",
    "app_name": "factorial",
    "isAvailable": true
  },
  {
    "title": "Feathery",
    "description": "Integrate Feathery to seamlessly execute automated workflows, synchronize data, and orchestrate Feathery actions directly within Alti.",
    "image": "https://logos.composio.dev/api/feathery",
    "app_name": "feathery",
    "isAvailable": true
  },
  {
    "title": "Felt",
    "description": "Integrate Felt to seamlessly execute automated workflows, synchronize data, and orchestrate Felt actions directly within Alti.",
    "image": "https://logos.composio.dev/api/felt",
    "app_name": "felt",
    "isAvailable": true
  },
  {
    "title": "Fibery",
    "description": "Integrate Fibery to seamlessly execute automated workflows, synchronize data, and orchestrate Fibery actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fibery",
    "app_name": "fibery",
    "isAvailable": true
  },
  {
    "title": "Fidel API",
    "description": "Integrate Fidel API to seamlessly execute automated workflows, synchronize data, and orchestrate Fidel API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fidel_api",
    "app_name": "fidel_api",
    "isAvailable": true
  },
  {
    "title": "Files Com",
    "description": "Integrate Files Com to seamlessly execute automated workflows, synchronize data, and orchestrate Files Com actions directly within Alti.",
    "image": "https://logos.composio.dev/api/files_com",
    "app_name": "files_com",
    "isAvailable": true
  },
  {
    "title": "Fillout Forms",
    "description": "Integrate Fillout Forms to seamlessly execute automated workflows, synchronize data, and orchestrate Fillout Forms actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fillout_forms",
    "app_name": "fillout_forms",
    "isAvailable": true
  },
  {
    "title": "Finage",
    "description": "Integrate Finage to seamlessly execute automated workflows, synchronize data, and orchestrate Finage actions directly within Alti.",
    "image": "https://logos.composio.dev/api/finage",
    "app_name": "finage",
    "isAvailable": true
  },
  {
    "title": "Findymail",
    "description": "Integrate Findymail to seamlessly execute automated workflows, synchronize data, and orchestrate Findymail actions directly within Alti.",
    "image": "https://logos.composio.dev/api/findymail",
    "app_name": "findymail",
    "isAvailable": true
  },
  {
    "title": "Finerworks",
    "description": "Integrate Finerworks to seamlessly execute automated workflows, synchronize data, and orchestrate Finerworks actions directly within Alti.",
    "image": "https://logos.composio.dev/api/finerworks",
    "app_name": "finerworks",
    "isAvailable": true
  },
  {
    "title": "Fingertip",
    "description": "Integrate Fingertip to seamlessly execute automated workflows, synchronize data, and orchestrate Fingertip actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fingertip",
    "app_name": "fingertip",
    "isAvailable": true
  },
  {
    "title": "Finmei",
    "description": "Integrate Finmei to seamlessly execute automated workflows, synchronize data, and orchestrate Finmei actions directly within Alti.",
    "image": "https://logos.composio.dev/api/finmei",
    "app_name": "finmei",
    "isAvailable": true
  },
  {
    "title": "Firmao",
    "description": "Integrate Firmao to seamlessly execute automated workflows, synchronize data, and orchestrate Firmao actions directly within Alti.",
    "image": "https://logos.composio.dev/api/firmao",
    "app_name": "firmao",
    "isAvailable": true
  },
  {
    "title": "Fitbit",
    "description": "Integrate Fitbit to seamlessly execute automated workflows, synchronize data, and orchestrate Fitbit actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fitbit",
    "app_name": "fitbit",
    "isAvailable": true
  },
  {
    "title": "Fixer",
    "description": "Integrate Fixer to seamlessly execute automated workflows, synchronize data, and orchestrate Fixer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fixer",
    "app_name": "fixer",
    "isAvailable": true
  },
  {
    "title": "Fixer Io",
    "description": "Integrate Fixer Io to seamlessly execute automated workflows, synchronize data, and orchestrate Fixer Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fixer_io",
    "app_name": "fixer_io",
    "isAvailable": true
  },
  {
    "title": "Flexisign",
    "description": "Integrate Flexisign to seamlessly execute automated workflows, synchronize data, and orchestrate Flexisign actions directly within Alti.",
    "image": "https://logos.composio.dev/api/flexisign",
    "app_name": "flexisign",
    "isAvailable": true
  },
  {
    "title": "Flowiseai",
    "description": "Integrate Flowiseai to seamlessly execute automated workflows, synchronize data, and orchestrate Flowiseai actions directly within Alti.",
    "image": "https://logos.composio.dev/api/flowiseai",
    "app_name": "flowiseai",
    "isAvailable": true
  },
  {
    "title": "Flutterwave",
    "description": "Integrate Flutterwave to seamlessly execute automated workflows, synchronize data, and orchestrate Flutterwave actions directly within Alti.",
    "image": "https://logos.composio.dev/api/flutterwave",
    "app_name": "flutterwave",
    "isAvailable": true
  },
  {
    "title": "Fluxguard",
    "description": "Integrate Fluxguard to seamlessly execute automated workflows, synchronize data, and orchestrate Fluxguard actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fluxguard",
    "app_name": "fluxguard",
    "isAvailable": true
  },
  {
    "title": "Fomo",
    "description": "Integrate Fomo to seamlessly execute automated workflows, synchronize data, and orchestrate Fomo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fomo",
    "app_name": "fomo",
    "isAvailable": true
  },
  {
    "title": "Forcemanager",
    "description": "Integrate Forcemanager to seamlessly execute automated workflows, synchronize data, and orchestrate Forcemanager actions directly within Alti.",
    "image": "https://logos.composio.dev/api/forcemanager",
    "app_name": "forcemanager",
    "isAvailable": true
  },
  {
    "title": "Formbricks",
    "description": "Integrate Formbricks to seamlessly execute automated workflows, synchronize data, and orchestrate Formbricks actions directly within Alti.",
    "image": "https://logos.composio.dev/api/formbricks",
    "app_name": "formbricks",
    "isAvailable": true
  },
  {
    "title": "Formcarry",
    "description": "Integrate Formcarry to seamlessly execute automated workflows, synchronize data, and orchestrate Formcarry actions directly within Alti.",
    "image": "https://logos.composio.dev/api/formcarry",
    "app_name": "formcarry",
    "isAvailable": true
  },
  {
    "title": "Formdesk",
    "description": "Integrate Formdesk to seamlessly execute automated workflows, synchronize data, and orchestrate Formdesk actions directly within Alti.",
    "image": "https://logos.composio.dev/api/formdesk",
    "app_name": "formdesk",
    "isAvailable": true
  },
  {
    "title": "Fraudlabs Pro",
    "description": "Integrate Fraudlabs Pro to seamlessly execute automated workflows, synchronize data, and orchestrate Fraudlabs Pro actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fraudlabs_pro",
    "app_name": "fraudlabs_pro",
    "isAvailable": true
  },
  {
    "title": "Freshbooks",
    "description": "Integrate Freshbooks to seamlessly execute automated workflows, synchronize data, and orchestrate Freshbooks actions directly within Alti.",
    "image": "https://logos.composio.dev/api/freshbooks",
    "app_name": "freshbooks",
    "isAvailable": true
  },
  {
    "title": "Freshservice",
    "description": "Integrate Freshservice to seamlessly execute automated workflows, synchronize data, and orchestrate Freshservice actions directly within Alti.",
    "image": "https://logos.composio.dev/api/freshservice",
    "app_name": "freshservice",
    "isAvailable": true
  },
  {
    "title": "Front",
    "description": "Integrate Front to seamlessly execute automated workflows, synchronize data, and orchestrate Front actions directly within Alti.",
    "image": "https://logos.composio.dev/api/front",
    "app_name": "front",
    "isAvailable": true
  },
  {
    "title": "Fullenrich",
    "description": "Integrate Fullenrich to seamlessly execute automated workflows, synchronize data, and orchestrate Fullenrich actions directly within Alti.",
    "image": "https://logos.composio.dev/api/fullenrich",
    "app_name": "fullenrich",
    "isAvailable": true
  },
  {
    "title": "Gagelist",
    "description": "Integrate Gagelist to seamlessly execute automated workflows, synchronize data, and orchestrate Gagelist actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gagelist",
    "app_name": "gagelist",
    "isAvailable": true
  },
  {
    "title": "Gamma",
    "description": "Integrate Gamma to seamlessly execute automated workflows, synchronize data, and orchestrate Gamma actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gamma",
    "app_name": "gamma",
    "isAvailable": true
  },
  {
    "title": "Gan AI",
    "description": "Integrate Gan AI to seamlessly execute automated workflows, synchronize data, and orchestrate Gan AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gan_ai",
    "app_name": "gan_ai",
    "isAvailable": true
  },
  {
    "title": "Gatherup",
    "description": "Integrate Gatherup to seamlessly execute automated workflows, synchronize data, and orchestrate Gatherup actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gatherup",
    "app_name": "gatherup",
    "isAvailable": true
  },
  {
    "title": "Gemini",
    "description": "Integrate Gemini to seamlessly execute automated workflows, synchronize data, and orchestrate Gemini actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gemini",
    "app_name": "gemini",
    "isAvailable": true
  },
  {
    "title": "Gender API",
    "description": "Integrate Gender API to seamlessly execute automated workflows, synchronize data, and orchestrate Gender API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gender_api",
    "app_name": "gender_api",
    "isAvailable": true
  },
  {
    "title": "Genderapi Io",
    "description": "Integrate Genderapi Io to seamlessly execute automated workflows, synchronize data, and orchestrate Genderapi Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/genderapi_io",
    "app_name": "genderapi_io",
    "isAvailable": true
  },
  {
    "title": "Genderize",
    "description": "Integrate Genderize to seamlessly execute automated workflows, synchronize data, and orchestrate Genderize actions directly within Alti.",
    "image": "https://logos.composio.dev/api/genderize",
    "app_name": "genderize",
    "isAvailable": true
  },
  {
    "title": "Geoapify",
    "description": "Integrate Geoapify to seamlessly execute automated workflows, synchronize data, and orchestrate Geoapify actions directly within Alti.",
    "image": "https://logos.composio.dev/api/geoapify",
    "app_name": "geoapify",
    "isAvailable": true
  },
  {
    "title": "Geocodio",
    "description": "Integrate Geocodio to seamlessly execute automated workflows, synchronize data, and orchestrate Geocodio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/geocodio",
    "app_name": "geocodio",
    "isAvailable": true
  },
  {
    "title": "Geokeo",
    "description": "Integrate Geokeo to seamlessly execute automated workflows, synchronize data, and orchestrate Geokeo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/geokeo",
    "app_name": "geokeo",
    "isAvailable": true
  },
  {
    "title": "Getform",
    "description": "Integrate Getform to seamlessly execute automated workflows, synchronize data, and orchestrate Getform actions directly within Alti.",
    "image": "https://logos.composio.dev/api/getform",
    "app_name": "getform",
    "isAvailable": true
  },
  {
    "title": "Gift Up",
    "description": "Integrate Gift Up to seamlessly execute automated workflows, synchronize data, and orchestrate Gift Up actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gift_up",
    "app_name": "gift_up",
    "isAvailable": true
  },
  {
    "title": "Gigasheet",
    "description": "Integrate Gigasheet to seamlessly execute automated workflows, synchronize data, and orchestrate Gigasheet actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gigasheet",
    "app_name": "gigasheet",
    "isAvailable": true
  },
  {
    "title": "Giphy",
    "description": "Integrate Giphy to seamlessly execute automated workflows, synchronize data, and orchestrate Giphy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/giphy",
    "app_name": "giphy",
    "isAvailable": true
  },
  {
    "title": "Gist",
    "description": "Integrate Gist to seamlessly execute automated workflows, synchronize data, and orchestrate Gist actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gist",
    "app_name": "gist",
    "isAvailable": true
  },
  {
    "title": "GitLab",
    "description": "Integrate GitLab to seamlessly execute automated workflows, synchronize data, and orchestrate GitLab actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gitlab",
    "app_name": "gitlab",
    "isAvailable": true
  },
  {
    "title": "Givebutter",
    "description": "Integrate Givebutter to seamlessly execute automated workflows, synchronize data, and orchestrate Givebutter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/givebutter",
    "app_name": "givebutter",
    "isAvailable": true
  },
  {
    "title": "Gladia",
    "description": "Integrate Gladia to seamlessly execute automated workflows, synchronize data, and orchestrate Gladia actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gladia",
    "app_name": "gladia",
    "isAvailable": true
  },
  {
    "title": "Gleap",
    "description": "Integrate Gleap to seamlessly execute automated workflows, synchronize data, and orchestrate Gleap actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gleap",
    "app_name": "gleap",
    "isAvailable": true
  },
  {
    "title": "Globalping",
    "description": "Integrate Globalping to seamlessly execute automated workflows, synchronize data, and orchestrate Globalping actions directly within Alti.",
    "image": "https://logos.composio.dev/api/globalping",
    "app_name": "globalping",
    "isAvailable": true
  },
  {
    "title": "Go To Webinar",
    "description": "Integrate Go To Webinar to seamlessly execute automated workflows, synchronize data, and orchestrate Go To Webinar actions directly within Alti.",
    "image": "https://logos.composio.dev/api/go_to_webinar",
    "app_name": "go_to_webinar",
    "isAvailable": true
  },
  {
    "title": "Godial",
    "description": "Integrate Godial to seamlessly execute automated workflows, synchronize data, and orchestrate Godial actions directly within Alti.",
    "image": "https://logos.composio.dev/api/godial",
    "app_name": "godial",
    "isAvailable": true
  },
  {
    "title": "Gong",
    "description": "Integrate Gong to seamlessly execute automated workflows, synchronize data, and orchestrate Gong actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gong",
    "app_name": "gong",
    "isAvailable": true
  },
  {
    "title": "Goodbits",
    "description": "Integrate Goodbits to seamlessly execute automated workflows, synchronize data, and orchestrate Goodbits actions directly within Alti.",
    "image": "https://logos.composio.dev/api/goodbits",
    "app_name": "goodbits",
    "isAvailable": true
  },
  {
    "title": "Goody",
    "description": "Integrate Goody to seamlessly execute automated workflows, synchronize data, and orchestrate Goody actions directly within Alti.",
    "image": "https://logos.composio.dev/api/goody",
    "app_name": "goody",
    "isAvailable": true
  },
  {
    "title": "Google Address Validation",
    "description": "Integrate Google Address Validation to seamlessly execute automated workflows, synchronize data, and orchestrate Google Address Validation actions directly within Alti.",
    "image": "https://logos.composio.dev/api/google_address_validation",
    "app_name": "google_address_validation",
    "isAvailable": true
  },
  {
    "title": "Google Classroom",
    "description": "Integrate Google Classroom to seamlessly execute automated workflows, synchronize data, and orchestrate Google Classroom actions directly within Alti.",
    "image": "https://logos.composio.dev/api/google_classroom",
    "app_name": "google_classroom",
    "isAvailable": true
  },
  {
    "title": "Google Cloud Vision",
    "description": "Integrate Google Cloud Vision to seamlessly execute automated workflows, synchronize data, and orchestrate Google Cloud Vision actions directly within Alti.",
    "image": "https://logos.composio.dev/api/google_cloud_vision",
    "app_name": "google_cloud_vision",
    "isAvailable": true
  },
  {
    "title": "Google Search Console",
    "description": "Integrate Google Search Console to seamlessly execute automated workflows, synchronize data, and orchestrate Google Search Console actions directly within Alti.",
    "image": "https://logos.composio.dev/api/google_search_console",
    "app_name": "google_search_console",
    "isAvailable": true
  },
  {
    "title": "Google Ads",
    "description": "Integrate Google Ads to seamlessly execute automated workflows, synchronize data, and orchestrate Google Ads actions directly within Alti.",
    "image": "https://logos.composio.dev/api/googleads",
    "app_name": "googleads",
    "isAvailable": true
  },
  {
    "title": "Gosquared",
    "description": "Integrate Gosquared to seamlessly execute automated workflows, synchronize data, and orchestrate Gosquared actions directly within Alti.",
    "image": "https://logos.composio.dev/api/gosquared",
    "app_name": "gosquared",
    "isAvailable": true
  },
  {
    "title": "Grafbase",
    "description": "Integrate Grafbase to seamlessly execute automated workflows, synchronize data, and orchestrate Grafbase actions directly within Alti.",
    "image": "https://logos.composio.dev/api/grafbase",
    "app_name": "grafbase",
    "isAvailable": true
  },
  {
    "title": "Graphhopper",
    "description": "Integrate Graphhopper to seamlessly execute automated workflows, synchronize data, and orchestrate Graphhopper actions directly within Alti.",
    "image": "https://logos.composio.dev/api/graphhopper",
    "app_name": "graphhopper",
    "isAvailable": true
  },
  {
    "title": "Griptape",
    "description": "Integrate Griptape to seamlessly execute automated workflows, synchronize data, and orchestrate Griptape actions directly within Alti.",
    "image": "https://logos.composio.dev/api/griptape",
    "app_name": "griptape",
    "isAvailable": true
  },
  {
    "title": "Grist",
    "description": "Integrate Grist to seamlessly execute automated workflows, synchronize data, and orchestrate Grist actions directly within Alti.",
    "image": "https://logos.composio.dev/api/grist",
    "app_name": "grist",
    "isAvailable": true
  },
  {
    "title": "Groqcloud",
    "description": "Integrate Groqcloud to seamlessly execute automated workflows, synchronize data, and orchestrate Groqcloud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/groqcloud",
    "app_name": "groqcloud",
    "isAvailable": true
  },
  {
    "title": "Guru",
    "description": "Integrate Guru to seamlessly execute automated workflows, synchronize data, and orchestrate Guru actions directly within Alti.",
    "image": "https://logos.composio.dev/api/guru",
    "app_name": "guru",
    "isAvailable": true
  },
  {
    "title": "Habitica",
    "description": "Integrate Habitica to seamlessly execute automated workflows, synchronize data, and orchestrate Habitica actions directly within Alti.",
    "image": "https://logos.composio.dev/api/habitica",
    "app_name": "habitica",
    "isAvailable": true
  },
  {
    "title": "Hackernews",
    "description": "Integrate Hackernews to seamlessly execute automated workflows, synchronize data, and orchestrate Hackernews actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hackernews",
    "app_name": "hackernews",
    "isAvailable": true
  },
  {
    "title": "Hackerrank Work",
    "description": "Integrate Hackerrank Work to seamlessly execute automated workflows, synchronize data, and orchestrate Hackerrank Work actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hackerrank_work",
    "app_name": "hackerrank_work",
    "isAvailable": true
  },
  {
    "title": "Happy Scribe",
    "description": "Integrate Happy Scribe to seamlessly execute automated workflows, synchronize data, and orchestrate Happy Scribe actions directly within Alti.",
    "image": "https://logos.composio.dev/api/happy_scribe",
    "app_name": "happy_scribe",
    "isAvailable": true
  },
  {
    "title": "Hashnode",
    "description": "Integrate Hashnode to seamlessly execute automated workflows, synchronize data, and orchestrate Hashnode actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hashnode",
    "app_name": "hashnode",
    "isAvailable": true
  },
  {
    "title": "Helcim",
    "description": "Integrate Helcim to seamlessly execute automated workflows, synchronize data, and orchestrate Helcim actions directly within Alti.",
    "image": "https://logos.composio.dev/api/helcim",
    "app_name": "helcim",
    "isAvailable": true
  },
  {
    "title": "Helloleads",
    "description": "Integrate Helloleads to seamlessly execute automated workflows, synchronize data, and orchestrate Helloleads actions directly within Alti.",
    "image": "https://logos.composio.dev/api/helloleads",
    "app_name": "helloleads",
    "isAvailable": true
  },
  {
    "title": "Helpdesk",
    "description": "Integrate Helpdesk to seamlessly execute automated workflows, synchronize data, and orchestrate Helpdesk actions directly within Alti.",
    "image": "https://logos.composio.dev/api/helpdesk",
    "app_name": "helpdesk",
    "isAvailable": true
  },
  {
    "title": "Helpwise",
    "description": "Integrate Helpwise to seamlessly execute automated workflows, synchronize data, and orchestrate Helpwise actions directly within Alti.",
    "image": "https://logos.composio.dev/api/helpwise",
    "app_name": "helpwise",
    "isAvailable": true
  },
  {
    "title": "Here",
    "description": "Integrate Here to seamlessly execute automated workflows, synchronize data, and orchestrate Here actions directly within Alti.",
    "image": "https://logos.composio.dev/api/here",
    "app_name": "here",
    "isAvailable": true
  },
  {
    "title": "Heyreach",
    "description": "Integrate Heyreach to seamlessly execute automated workflows, synchronize data, and orchestrate Heyreach actions directly within Alti.",
    "image": "https://logos.composio.dev/api/heyreach",
    "app_name": "heyreach",
    "isAvailable": true
  },
  {
    "title": "Heyzine",
    "description": "Integrate Heyzine to seamlessly execute automated workflows, synchronize data, and orchestrate Heyzine actions directly within Alti.",
    "image": "https://logos.composio.dev/api/heyzine",
    "app_name": "heyzine",
    "isAvailable": true
  },
  {
    "title": "Highergov",
    "description": "Integrate Highergov to seamlessly execute automated workflows, synchronize data, and orchestrate Highergov actions directly within Alti.",
    "image": "https://logos.composio.dev/api/highergov",
    "app_name": "highergov",
    "isAvailable": true
  },
  {
    "title": "Highlevel",
    "description": "Integrate Highlevel to seamlessly execute automated workflows, synchronize data, and orchestrate Highlevel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/highlevel",
    "app_name": "highlevel",
    "isAvailable": true
  },
  {
    "title": "Honeybadger",
    "description": "Integrate Honeybadger to seamlessly execute automated workflows, synchronize data, and orchestrate Honeybadger actions directly within Alti.",
    "image": "https://logos.composio.dev/api/honeybadger",
    "app_name": "honeybadger",
    "isAvailable": true
  },
  {
    "title": "Honeyhive",
    "description": "Integrate Honeyhive to seamlessly execute automated workflows, synchronize data, and orchestrate Honeyhive actions directly within Alti.",
    "image": "https://logos.composio.dev/api/honeyhive",
    "app_name": "honeyhive",
    "isAvailable": true
  },
  {
    "title": "Hookdeck",
    "description": "Integrate Hookdeck to seamlessly execute automated workflows, synchronize data, and orchestrate Hookdeck actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hookdeck",
    "app_name": "hookdeck",
    "isAvailable": true
  },
  {
    "title": "Hotspotsystem",
    "description": "Integrate Hotspotsystem to seamlessly execute automated workflows, synchronize data, and orchestrate Hotspotsystem actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hotspotsystem",
    "app_name": "hotspotsystem",
    "isAvailable": true
  },
  {
    "title": "Html To Image",
    "description": "Integrate Html To Image to seamlessly execute automated workflows, synchronize data, and orchestrate Html To Image actions directly within Alti.",
    "image": "https://logos.composio.dev/api/html_to_image",
    "app_name": "html_to_image",
    "isAvailable": true
  },
  {
    "title": "Humanitix",
    "description": "Integrate Humanitix to seamlessly execute automated workflows, synchronize data, and orchestrate Humanitix actions directly within Alti.",
    "image": "https://logos.composio.dev/api/humanitix",
    "app_name": "humanitix",
    "isAvailable": true
  },
  {
    "title": "Hunter",
    "description": "Integrate Hunter to seamlessly execute automated workflows, synchronize data, and orchestrate Hunter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hunter",
    "app_name": "hunter",
    "isAvailable": true
  },
  {
    "title": "Hypeauditor",
    "description": "Integrate Hypeauditor to seamlessly execute automated workflows, synchronize data, and orchestrate Hypeauditor actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hypeauditor",
    "app_name": "hypeauditor",
    "isAvailable": true
  },
  {
    "title": "Hyperbrowser",
    "description": "Integrate Hyperbrowser to seamlessly execute automated workflows, synchronize data, and orchestrate Hyperbrowser actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hyperbrowser",
    "app_name": "hyperbrowser",
    "isAvailable": true
  },
  {
    "title": "Hyperise",
    "description": "Integrate Hyperise to seamlessly execute automated workflows, synchronize data, and orchestrate Hyperise actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hyperise",
    "app_name": "hyperise",
    "isAvailable": true
  },
  {
    "title": "Hystruct",
    "description": "Integrate Hystruct to seamlessly execute automated workflows, synchronize data, and orchestrate Hystruct actions directly within Alti.",
    "image": "https://logos.composio.dev/api/hystruct",
    "app_name": "hystruct",
    "isAvailable": true
  },
  {
    "title": "Icims Talent Cloud",
    "description": "Integrate Icims Talent Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Icims Talent Cloud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/icims_talent_cloud",
    "app_name": "icims_talent_cloud",
    "isAvailable": true
  },
  {
    "title": "Icypeas",
    "description": "Integrate Icypeas to seamlessly execute automated workflows, synchronize data, and orchestrate Icypeas actions directly within Alti.",
    "image": "https://logos.composio.dev/api/icypeas",
    "app_name": "icypeas",
    "isAvailable": true
  },
  {
    "title": "Idea Scale",
    "description": "Integrate Idea Scale to seamlessly execute automated workflows, synchronize data, and orchestrate Idea Scale actions directly within Alti.",
    "image": "https://logos.composio.dev/api/idea_scale",
    "app_name": "idea_scale",
    "isAvailable": true
  },
  {
    "title": "Identitycheck",
    "description": "Integrate Identitycheck to seamlessly execute automated workflows, synchronize data, and orchestrate Identitycheck actions directly within Alti.",
    "image": "https://logos.composio.dev/api/identitycheck",
    "app_name": "identitycheck",
    "isAvailable": true
  },
  {
    "title": "Ignisign",
    "description": "Integrate Ignisign to seamlessly execute automated workflows, synchronize data, and orchestrate Ignisign actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ignisign",
    "app_name": "ignisign",
    "isAvailable": true
  },
  {
    "title": "Imagekit Io",
    "description": "Integrate Imagekit Io to seamlessly execute automated workflows, synchronize data, and orchestrate Imagekit Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/imagekit_io",
    "app_name": "imagekit_io",
    "isAvailable": true
  },
  {
    "title": "Imagior",
    "description": "Integrate Imagior to seamlessly execute automated workflows, synchronize data, and orchestrate Imagior actions directly within Alti.",
    "image": "https://logos.composio.dev/api/imagior",
    "app_name": "imagior",
    "isAvailable": true
  },
  {
    "title": "Imejis Io",
    "description": "Integrate Imejis Io to seamlessly execute automated workflows, synchronize data, and orchestrate Imejis Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/imejis_io",
    "app_name": "imejis_io",
    "isAvailable": true
  },
  {
    "title": "Imgbb",
    "description": "Integrate Imgbb to seamlessly execute automated workflows, synchronize data, and orchestrate Imgbb actions directly within Alti.",
    "image": "https://logos.composio.dev/api/imgbb",
    "app_name": "imgbb",
    "isAvailable": true
  },
  {
    "title": "Imgix",
    "description": "Integrate Imgix to seamlessly execute automated workflows, synchronize data, and orchestrate Imgix actions directly within Alti.",
    "image": "https://logos.composio.dev/api/imgix",
    "app_name": "imgix",
    "isAvailable": true
  },
  {
    "title": "Influxdb Cloud",
    "description": "Integrate Influxdb Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Influxdb Cloud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/influxdb_cloud",
    "app_name": "influxdb_cloud",
    "isAvailable": true
  },
  {
    "title": "Insighto AI",
    "description": "Integrate Insighto AI to seamlessly execute automated workflows, synchronize data, and orchestrate Insighto AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/insighto_ai",
    "app_name": "insighto_ai",
    "isAvailable": true
  },
  {
    "title": "Instacart",
    "description": "Integrate Instacart to seamlessly execute automated workflows, synchronize data, and orchestrate Instacart actions directly within Alti.",
    "image": "https://logos.composio.dev/api/instacart",
    "app_name": "instacart",
    "isAvailable": true
  },
  {
    "title": "Instagram",
    "description": "Integrate Instagram to seamlessly execute automated workflows, synchronize data, and orchestrate Instagram actions directly within Alti.",
    "image": "https://logos.composio.dev/api/instagram",
    "app_name": "instagram",
    "isAvailable": true
  },
  {
    "title": "Instantly",
    "description": "Integrate Instantly to seamlessly execute automated workflows, synchronize data, and orchestrate Instantly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/instantly",
    "app_name": "instantly",
    "isAvailable": true
  },
  {
    "title": "Intelliprint",
    "description": "Integrate Intelliprint to seamlessly execute automated workflows, synchronize data, and orchestrate Intelliprint actions directly within Alti.",
    "image": "https://logos.composio.dev/api/intelliprint",
    "app_name": "intelliprint",
    "isAvailable": true
  },
  {
    "title": "Interzoid",
    "description": "Integrate Interzoid to seamlessly execute automated workflows, synchronize data, and orchestrate Interzoid actions directly within Alti.",
    "image": "https://logos.composio.dev/api/interzoid",
    "app_name": "interzoid",
    "isAvailable": true
  },
  {
    "title": "Ip2location",
    "description": "Integrate Ip2location to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2location actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ip2location",
    "app_name": "ip2location",
    "isAvailable": true
  },
  {
    "title": "Ip2location Io",
    "description": "Integrate Ip2location Io to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2location Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ip2location_io",
    "app_name": "ip2location_io",
    "isAvailable": true
  },
  {
    "title": "Ip2proxy",
    "description": "Integrate Ip2proxy to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2proxy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ip2proxy",
    "app_name": "ip2proxy",
    "isAvailable": true
  },
  {
    "title": "Ip2whois",
    "description": "Integrate Ip2whois to seamlessly execute automated workflows, synchronize data, and orchestrate Ip2whois actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ip2whois",
    "app_name": "ip2whois",
    "isAvailable": true
  },
  {
    "title": "Ipdata Co",
    "description": "Integrate Ipdata Co to seamlessly execute automated workflows, synchronize data, and orchestrate Ipdata Co actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ipdata_co",
    "app_name": "ipdata_co",
    "isAvailable": true
  },
  {
    "title": "Ipinfo Io",
    "description": "Integrate Ipinfo Io to seamlessly execute automated workflows, synchronize data, and orchestrate Ipinfo Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ipinfo_io",
    "app_name": "ipinfo_io",
    "isAvailable": true
  },
  {
    "title": "Iqair Airvisual",
    "description": "Integrate Iqair Airvisual to seamlessly execute automated workflows, synchronize data, and orchestrate Iqair Airvisual actions directly within Alti.",
    "image": "https://logos.composio.dev/api/iqair_airvisual",
    "app_name": "iqair_airvisual",
    "isAvailable": true
  },
  {
    "title": "Jigsawstack",
    "description": "Integrate Jigsawstack to seamlessly execute automated workflows, synchronize data, and orchestrate Jigsawstack actions directly within Alti.",
    "image": "https://logos.composio.dev/api/jigsawstack",
    "app_name": "jigsawstack",
    "isAvailable": true
  },
  {
    "title": "Jotform",
    "description": "Integrate Jotform to seamlessly execute automated workflows, synchronize data, and orchestrate Jotform actions directly within Alti.",
    "image": "https://logos.composio.dev/api/jotform",
    "app_name": "jotform",
    "isAvailable": true
  },
  {
    "title": "Jumpcloud",
    "description": "Integrate Jumpcloud to seamlessly execute automated workflows, synchronize data, and orchestrate Jumpcloud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/jumpcloud",
    "app_name": "jumpcloud",
    "isAvailable": true
  },
  {
    "title": "Kadoa",
    "description": "Integrate Kadoa to seamlessly execute automated workflows, synchronize data, and orchestrate Kadoa actions directly within Alti.",
    "image": "https://logos.composio.dev/api/kadoa",
    "app_name": "kadoa",
    "isAvailable": true
  },
  {
    "title": "Kaggle",
    "description": "Integrate Kaggle to seamlessly execute automated workflows, synchronize data, and orchestrate Kaggle actions directly within Alti.",
    "image": "https://logos.composio.dev/api/kaggle",
    "app_name": "kaggle",
    "isAvailable": true
  },
  {
    "title": "Kaleido",
    "description": "Integrate Kaleido to seamlessly execute automated workflows, synchronize data, and orchestrate Kaleido actions directly within Alti.",
    "image": "https://logos.composio.dev/api/kaleido",
    "app_name": "kaleido",
    "isAvailable": true
  },
  {
    "title": "Keap",
    "description": "Integrate Keap to seamlessly execute automated workflows, synchronize data, and orchestrate Keap actions directly within Alti.",
    "image": "https://logos.composio.dev/api/keap",
    "app_name": "keap",
    "isAvailable": true
  },
  {
    "title": "Keen Io",
    "description": "Integrate Keen Io to seamlessly execute automated workflows, synchronize data, and orchestrate Keen Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/keen_io",
    "app_name": "keen_io",
    "isAvailable": true
  },
  {
    "title": "Kickbox",
    "description": "Integrate Kickbox to seamlessly execute automated workflows, synchronize data, and orchestrate Kickbox actions directly within Alti.",
    "image": "https://logos.composio.dev/api/kickbox",
    "app_name": "kickbox",
    "isAvailable": true
  },
  {
    "title": "Kit",
    "description": "Integrate Kit to seamlessly execute automated workflows, synchronize data, and orchestrate Kit actions directly within Alti.",
    "image": "https://logos.composio.dev/api/kit",
    "app_name": "kit",
    "isAvailable": true
  },
  {
    "title": "Klipfolio",
    "description": "Integrate Klipfolio to seamlessly execute automated workflows, synchronize data, and orchestrate Klipfolio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/klipfolio",
    "app_name": "klipfolio",
    "isAvailable": true
  },
  {
    "title": "Ko Fi",
    "description": "Integrate Ko Fi to seamlessly execute automated workflows, synchronize data, and orchestrate Ko Fi actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ko_fi",
    "app_name": "ko_fi",
    "isAvailable": true
  },
  {
    "title": "Kontent AI",
    "description": "Integrate Kontent AI to seamlessly execute automated workflows, synchronize data, and orchestrate Kontent AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/kontent_ai",
    "app_name": "kontent_ai",
    "isAvailable": true
  },
  {
    "title": "Kraken Io",
    "description": "Integrate Kraken Io to seamlessly execute automated workflows, synchronize data, and orchestrate Kraken Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/kraken_io",
    "app_name": "kraken_io",
    "isAvailable": true
  },
  {
    "title": "L2s",
    "description": "Integrate L2s to seamlessly execute automated workflows, synchronize data, and orchestrate L2s actions directly within Alti.",
    "image": "https://logos.composio.dev/api/l2s",
    "app_name": "l2s",
    "isAvailable": true
  },
  {
    "title": "Labs64 Netlicensing",
    "description": "Integrate Labs64 Netlicensing to seamlessly execute automated workflows, synchronize data, and orchestrate Labs64 Netlicensing actions directly within Alti.",
    "image": "https://logos.composio.dev/api/labs64_netlicensing",
    "app_name": "labs64_netlicensing",
    "isAvailable": true
  },
  {
    "title": "Landbot",
    "description": "Integrate Landbot to seamlessly execute automated workflows, synchronize data, and orchestrate Landbot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/landbot",
    "app_name": "landbot",
    "isAvailable": true
  },
  {
    "title": "Langbase",
    "description": "Integrate Langbase to seamlessly execute automated workflows, synchronize data, and orchestrate Langbase actions directly within Alti.",
    "image": "https://logos.composio.dev/api/langbase",
    "app_name": "langbase",
    "isAvailable": true
  },
  {
    "title": "Lastpass",
    "description": "Integrate Lastpass to seamlessly execute automated workflows, synchronize data, and orchestrate Lastpass actions directly within Alti.",
    "image": "https://logos.composio.dev/api/lastpass",
    "app_name": "lastpass",
    "isAvailable": true
  },
  {
    "title": "Launch Darkly",
    "description": "Integrate Launch Darkly to seamlessly execute automated workflows, synchronize data, and orchestrate Launch Darkly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/launch_darkly",
    "app_name": "launch_darkly",
    "isAvailable": true
  },
  {
    "title": "Leadfeeder",
    "description": "Integrate Leadfeeder to seamlessly execute automated workflows, synchronize data, and orchestrate Leadfeeder actions directly within Alti.",
    "image": "https://logos.composio.dev/api/leadfeeder",
    "app_name": "leadfeeder",
    "isAvailable": true
  },
  {
    "title": "Leadoku",
    "description": "Integrate Leadoku to seamlessly execute automated workflows, synchronize data, and orchestrate Leadoku actions directly within Alti.",
    "image": "https://logos.composio.dev/api/leadoku",
    "app_name": "leadoku",
    "isAvailable": true
  },
  {
    "title": "Leiga",
    "description": "Integrate Leiga to seamlessly execute automated workflows, synchronize data, and orchestrate Leiga actions directly within Alti.",
    "image": "https://logos.composio.dev/api/leiga",
    "app_name": "leiga",
    "isAvailable": true
  },
  {
    "title": "Lemlist",
    "description": "Integrate Lemlist to seamlessly execute automated workflows, synchronize data, and orchestrate Lemlist actions directly within Alti.",
    "image": "https://logos.composio.dev/api/lemlist",
    "app_name": "lemlist",
    "isAvailable": true
  },
  {
    "title": "Lessonspace",
    "description": "Integrate Lessonspace to seamlessly execute automated workflows, synchronize data, and orchestrate Lessonspace actions directly within Alti.",
    "image": "https://logos.composio.dev/api/lessonspace",
    "app_name": "lessonspace",
    "isAvailable": true
  },
  {
    "title": "Lever",
    "description": "Integrate Lever to seamlessly execute automated workflows, synchronize data, and orchestrate Lever actions directly within Alti.",
    "image": "https://logos.composio.dev/api/lever",
    "app_name": "lever",
    "isAvailable": true
  },
  {
    "title": "Lever Sandbox",
    "description": "Integrate Lever Sandbox to seamlessly execute automated workflows, synchronize data, and orchestrate Lever Sandbox actions directly within Alti.",
    "image": "https://logos.composio.dev/api/lever_sandbox",
    "app_name": "lever_sandbox",
    "isAvailable": true
  },
  {
    "title": "Leverly",
    "description": "Integrate Leverly to seamlessly execute automated workflows, synchronize data, and orchestrate Leverly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/leverly",
    "app_name": "leverly",
    "isAvailable": true
  },
  {
    "title": "Lexoffice",
    "description": "Integrate Lexoffice to seamlessly execute automated workflows, synchronize data, and orchestrate Lexoffice actions directly within Alti.",
    "image": "https://logos.composio.dev/api/lexoffice",
    "app_name": "lexoffice",
    "isAvailable": true
  },
  {
    "title": "Linguapop",
    "description": "Integrate Linguapop to seamlessly execute automated workflows, synchronize data, and orchestrate Linguapop actions directly within Alti.",
    "image": "https://logos.composio.dev/api/linguapop",
    "app_name": "linguapop",
    "isAvailable": true
  },
  {
    "title": "Listclean",
    "description": "Integrate Listclean to seamlessly execute automated workflows, synchronize data, and orchestrate Listclean actions directly within Alti.",
    "image": "https://logos.composio.dev/api/listclean",
    "app_name": "listclean",
    "isAvailable": true
  },
  {
    "title": "Listennotes",
    "description": "Integrate Listennotes to seamlessly execute automated workflows, synchronize data, and orchestrate Listennotes actions directly within Alti.",
    "image": "https://logos.composio.dev/api/listennotes",
    "app_name": "listennotes",
    "isAvailable": true
  },
  {
    "title": "Livesession",
    "description": "Integrate Livesession to seamlessly execute automated workflows, synchronize data, and orchestrate Livesession actions directly within Alti.",
    "image": "https://logos.composio.dev/api/livesession",
    "app_name": "livesession",
    "isAvailable": true
  },
  {
    "title": "Lodgify",
    "description": "Integrate Lodgify to seamlessly execute automated workflows, synchronize data, and orchestrate Lodgify actions directly within Alti.",
    "image": "https://logos.composio.dev/api/lodgify",
    "app_name": "lodgify",
    "isAvailable": true
  },
  {
    "title": "Logo Dev",
    "description": "Integrate Logo Dev to seamlessly execute automated workflows, synchronize data, and orchestrate Logo Dev actions directly within Alti.",
    "image": "https://logos.composio.dev/api/logo_dev",
    "app_name": "logo_dev",
    "isAvailable": true
  },
  {
    "title": "Loomio",
    "description": "Integrate Loomio to seamlessly execute automated workflows, synchronize data, and orchestrate Loomio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/loomio",
    "app_name": "loomio",
    "isAvailable": true
  },
  {
    "title": "Loyverse",
    "description": "Integrate Loyverse to seamlessly execute automated workflows, synchronize data, and orchestrate Loyverse actions directly within Alti.",
    "image": "https://logos.composio.dev/api/loyverse",
    "app_name": "loyverse",
    "isAvailable": true
  },
  {
    "title": "Magnetic",
    "description": "Integrate Magnetic to seamlessly execute automated workflows, synchronize data, and orchestrate Magnetic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/magnetic",
    "app_name": "magnetic",
    "isAvailable": true
  },
  {
    "title": "Mailbluster",
    "description": "Integrate Mailbluster to seamlessly execute automated workflows, synchronize data, and orchestrate Mailbluster actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mailbluster",
    "app_name": "mailbluster",
    "isAvailable": true
  },
  {
    "title": "Mailboxlayer",
    "description": "Integrate Mailboxlayer to seamlessly execute automated workflows, synchronize data, and orchestrate Mailboxlayer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mailboxlayer",
    "app_name": "mailboxlayer",
    "isAvailable": true
  },
  {
    "title": "Mailcheck",
    "description": "Integrate Mailcheck to seamlessly execute automated workflows, synchronize data, and orchestrate Mailcheck actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mailcheck",
    "app_name": "mailcheck",
    "isAvailable": true
  },
  {
    "title": "Mailcoach",
    "description": "Integrate Mailcoach to seamlessly execute automated workflows, synchronize data, and orchestrate Mailcoach actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mailcoach",
    "app_name": "mailcoach",
    "isAvailable": true
  },
  {
    "title": "Mailerlite",
    "description": "Integrate Mailerlite to seamlessly execute automated workflows, synchronize data, and orchestrate Mailerlite actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mailerlite",
    "app_name": "mailerlite",
    "isAvailable": true
  },
  {
    "title": "Mailersend",
    "description": "Integrate Mailersend to seamlessly execute automated workflows, synchronize data, and orchestrate Mailersend actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mailersend",
    "app_name": "mailersend",
    "isAvailable": true
  },
  {
    "title": "Mails So",
    "description": "Integrate Mails So to seamlessly execute automated workflows, synchronize data, and orchestrate Mails So actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mails_so",
    "app_name": "mails_so",
    "isAvailable": true
  },
  {
    "title": "Mailsoftly",
    "description": "Integrate Mailsoftly to seamlessly execute automated workflows, synchronize data, and orchestrate Mailsoftly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mailsoftly",
    "app_name": "mailsoftly",
    "isAvailable": true
  },
  {
    "title": "Maintainx",
    "description": "Integrate Maintainx to seamlessly execute automated workflows, synchronize data, and orchestrate Maintainx actions directly within Alti.",
    "image": "https://logos.composio.dev/api/maintainx",
    "app_name": "maintainx",
    "isAvailable": true
  },
  {
    "title": "Make",
    "description": "Integrate Make to seamlessly execute automated workflows, synchronize data, and orchestrate Make actions directly within Alti.",
    "image": "https://logos.composio.dev/api/make",
    "app_name": "make",
    "isAvailable": true
  },
  {
    "title": "Many Chat",
    "description": "Integrate Many Chat to seamlessly execute automated workflows, synchronize data, and orchestrate Many Chat actions directly within Alti.",
    "image": "https://logos.composio.dev/api/many_chat",
    "app_name": "many_chat",
    "isAvailable": true
  },
  {
    "title": "Mapbox",
    "description": "Integrate Mapbox to seamlessly execute automated workflows, synchronize data, and orchestrate Mapbox actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mapbox",
    "app_name": "mapbox",
    "isAvailable": true
  },
  {
    "title": "Mapulus",
    "description": "Integrate Mapulus to seamlessly execute automated workflows, synchronize data, and orchestrate Mapulus actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mapulus",
    "app_name": "mapulus",
    "isAvailable": true
  },
  {
    "title": "Mboum",
    "description": "Integrate Mboum to seamlessly execute automated workflows, synchronize data, and orchestrate Mboum actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mboum",
    "app_name": "mboum",
    "isAvailable": true
  },
  {
    "title": "Melo",
    "description": "Integrate Melo to seamlessly execute automated workflows, synchronize data, and orchestrate Melo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/melo",
    "app_name": "melo",
    "isAvailable": true
  },
  {
    "title": "Mem",
    "description": "Integrate Mem to seamlessly execute automated workflows, synchronize data, and orchestrate Mem actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mem",
    "app_name": "mem",
    "isAvailable": true
  },
  {
    "title": "Memberspot",
    "description": "Integrate Memberspot to seamlessly execute automated workflows, synchronize data, and orchestrate Memberspot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/memberspot",
    "app_name": "memberspot",
    "isAvailable": true
  },
  {
    "title": "Memberstack",
    "description": "Integrate Memberstack to seamlessly execute automated workflows, synchronize data, and orchestrate Memberstack actions directly within Alti.",
    "image": "https://logos.composio.dev/api/memberstack",
    "app_name": "memberstack",
    "isAvailable": true
  },
  {
    "title": "Membervault",
    "description": "Integrate Membervault to seamlessly execute automated workflows, synchronize data, and orchestrate Membervault actions directly within Alti.",
    "image": "https://logos.composio.dev/api/membervault",
    "app_name": "membervault",
    "isAvailable": true
  },
  {
    "title": "Metaads",
    "description": "Integrate Metaads to seamlessly execute automated workflows, synchronize data, and orchestrate Metaads actions directly within Alti.",
    "image": "https://logos.composio.dev/api/metaads",
    "app_name": "metaads",
    "isAvailable": true
  },
  {
    "title": "Metaphor",
    "description": "Integrate Metaphor to seamlessly execute automated workflows, synchronize data, and orchestrate Metaphor actions directly within Alti.",
    "image": "https://logos.composio.dev/api/metaphor",
    "app_name": "metaphor",
    "isAvailable": true
  },
  {
    "title": "Metatextai",
    "description": "Integrate Metatextai to seamlessly execute automated workflows, synchronize data, and orchestrate Metatextai actions directly within Alti.",
    "image": "https://logos.composio.dev/api/metatextai",
    "app_name": "metatextai",
    "isAvailable": true
  },
  {
    "title": "Mezmo",
    "description": "Integrate Mezmo to seamlessly execute automated workflows, synchronize data, and orchestrate Mezmo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mezmo",
    "app_name": "mezmo",
    "isAvailable": true
  },
  {
    "title": "Microsoft Tenant",
    "description": "Integrate Microsoft Tenant to seamlessly execute automated workflows, synchronize data, and orchestrate Microsoft Tenant actions directly within Alti.",
    "image": "https://logos.composio.dev/api/microsoft_tenant",
    "app_name": "microsoft_tenant",
    "isAvailable": true
  },
  {
    "title": "Minerstat",
    "description": "Integrate Minerstat to seamlessly execute automated workflows, synchronize data, and orchestrate Minerstat actions directly within Alti.",
    "image": "https://logos.composio.dev/api/minerstat",
    "app_name": "minerstat",
    "isAvailable": true
  },
  {
    "title": "Missive",
    "description": "Integrate Missive to seamlessly execute automated workflows, synchronize data, and orchestrate Missive actions directly within Alti.",
    "image": "https://logos.composio.dev/api/missive",
    "app_name": "missive",
    "isAvailable": true
  },
  {
    "title": "Mistral AI",
    "description": "Integrate Mistral AI to seamlessly execute automated workflows, synchronize data, and orchestrate Mistral AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mistral_ai",
    "app_name": "mistral_ai",
    "isAvailable": true
  },
  {
    "title": "Mocean",
    "description": "Integrate Mocean to seamlessly execute automated workflows, synchronize data, and orchestrate Mocean actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mocean",
    "app_name": "mocean",
    "isAvailable": true
  },
  {
    "title": "Moco",
    "description": "Integrate Moco to seamlessly execute automated workflows, synchronize data, and orchestrate Moco actions directly within Alti.",
    "image": "https://logos.composio.dev/api/moco",
    "app_name": "moco",
    "isAvailable": true
  },
  {
    "title": "Modelry",
    "description": "Integrate Modelry to seamlessly execute automated workflows, synchronize data, and orchestrate Modelry actions directly within Alti.",
    "image": "https://logos.composio.dev/api/modelry",
    "app_name": "modelry",
    "isAvailable": true
  },
  {
    "title": "Moneybird",
    "description": "Integrate Moneybird to seamlessly execute automated workflows, synchronize data, and orchestrate Moneybird actions directly within Alti.",
    "image": "https://logos.composio.dev/api/moneybird",
    "app_name": "moneybird",
    "isAvailable": true
  },
  {
    "title": "Moonclerk",
    "description": "Integrate Moonclerk to seamlessly execute automated workflows, synchronize data, and orchestrate Moonclerk actions directly within Alti.",
    "image": "https://logos.composio.dev/api/moonclerk",
    "app_name": "moonclerk",
    "isAvailable": true
  },
  {
    "title": "Moosend",
    "description": "Integrate Moosend to seamlessly execute automated workflows, synchronize data, and orchestrate Moosend actions directly within Alti.",
    "image": "https://logos.composio.dev/api/moosend",
    "app_name": "moosend",
    "isAvailable": true
  },
  {
    "title": "Mopinion",
    "description": "Integrate Mopinion to seamlessly execute automated workflows, synchronize data, and orchestrate Mopinion actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mopinion",
    "app_name": "mopinion",
    "isAvailable": true
  },
  {
    "title": "Moxie",
    "description": "Integrate Moxie to seamlessly execute automated workflows, synchronize data, and orchestrate Moxie actions directly within Alti.",
    "image": "https://logos.composio.dev/api/moxie",
    "app_name": "moxie",
    "isAvailable": true
  },
  {
    "title": "Moz",
    "description": "Integrate Moz to seamlessly execute automated workflows, synchronize data, and orchestrate Moz actions directly within Alti.",
    "image": "https://logos.composio.dev/api/moz",
    "app_name": "moz",
    "isAvailable": true
  },
  {
    "title": "Msg91",
    "description": "Integrate Msg91 to seamlessly execute automated workflows, synchronize data, and orchestrate Msg91 actions directly within Alti.",
    "image": "https://logos.composio.dev/api/msg91",
    "app_name": "msg91",
    "isAvailable": true
  },
  {
    "title": "Mx Technologies",
    "description": "Integrate Mx Technologies to seamlessly execute automated workflows, synchronize data, and orchestrate Mx Technologies actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mx_technologies",
    "app_name": "mx_technologies",
    "isAvailable": true
  },
  {
    "title": "Mx Toolbox",
    "description": "Integrate Mx Toolbox to seamlessly execute automated workflows, synchronize data, and orchestrate Mx Toolbox actions directly within Alti.",
    "image": "https://logos.composio.dev/api/mx_toolbox",
    "app_name": "mx_toolbox",
    "isAvailable": true
  },
  {
    "title": "Nango",
    "description": "Integrate Nango to seamlessly execute automated workflows, synchronize data, and orchestrate Nango actions directly within Alti.",
    "image": "https://logos.composio.dev/api/nango",
    "app_name": "nango",
    "isAvailable": true
  },
  {
    "title": "Nano Nets",
    "description": "Integrate Nano Nets to seamlessly execute automated workflows, synchronize data, and orchestrate Nano Nets actions directly within Alti.",
    "image": "https://logos.composio.dev/api/nano_nets",
    "app_name": "nano_nets",
    "isAvailable": true
  },
  {
    "title": "Nasa",
    "description": "Integrate Nasa to seamlessly execute automated workflows, synchronize data, and orchestrate Nasa actions directly within Alti.",
    "image": "https://logos.composio.dev/api/nasa",
    "app_name": "nasa",
    "isAvailable": true
  },
  {
    "title": "Nasdaq",
    "description": "Integrate Nasdaq to seamlessly execute automated workflows, synchronize data, and orchestrate Nasdaq actions directly within Alti.",
    "image": "https://logos.composio.dev/api/nasdaq",
    "app_name": "nasdaq",
    "isAvailable": true
  },
  {
    "title": "Ncscale",
    "description": "Integrate Ncscale to seamlessly execute automated workflows, synchronize data, and orchestrate Ncscale actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ncscale",
    "app_name": "ncscale",
    "isAvailable": true
  },
  {
    "title": "Needle",
    "description": "Integrate Needle to seamlessly execute automated workflows, synchronize data, and orchestrate Needle actions directly within Alti.",
    "image": "https://logos.composio.dev/api/needle",
    "app_name": "needle",
    "isAvailable": true
  },
  {
    "title": "Netsuite",
    "description": "Integrate Netsuite to seamlessly execute automated workflows, synchronize data, and orchestrate Netsuite actions directly within Alti.",
    "image": "https://logos.composio.dev/api/netsuite",
    "app_name": "netsuite",
    "isAvailable": true
  },
  {
    "title": "Neuronwriter",
    "description": "Integrate Neuronwriter to seamlessly execute automated workflows, synchronize data, and orchestrate Neuronwriter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/neuronwriter",
    "app_name": "neuronwriter",
    "isAvailable": true
  },
  {
    "title": "Neutrino",
    "description": "Integrate Neutrino to seamlessly execute automated workflows, synchronize data, and orchestrate Neutrino actions directly within Alti.",
    "image": "https://logos.composio.dev/api/neutrino",
    "app_name": "neutrino",
    "isAvailable": true
  },
  {
    "title": "Neverbounce",
    "description": "Integrate Neverbounce to seamlessly execute automated workflows, synchronize data, and orchestrate Neverbounce actions directly within Alti.",
    "image": "https://logos.composio.dev/api/neverbounce",
    "app_name": "neverbounce",
    "isAvailable": true
  },
  {
    "title": "New Relic",
    "description": "Integrate New Relic to seamlessly execute automated workflows, synchronize data, and orchestrate New Relic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/new_relic",
    "app_name": "new_relic",
    "isAvailable": true
  },
  {
    "title": "News API",
    "description": "Integrate News API to seamlessly execute automated workflows, synchronize data, and orchestrate News API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/news_api",
    "app_name": "news_api",
    "isAvailable": true
  },
  {
    "title": "Nextdns",
    "description": "Integrate Nextdns to seamlessly execute automated workflows, synchronize data, and orchestrate Nextdns actions directly within Alti.",
    "image": "https://logos.composio.dev/api/nextdns",
    "app_name": "nextdns",
    "isAvailable": true
  },
  {
    "title": "Ninox",
    "description": "Integrate Ninox to seamlessly execute automated workflows, synchronize data, and orchestrate Ninox actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ninox",
    "app_name": "ninox",
    "isAvailable": true
  },
  {
    "title": "Npm",
    "description": "Integrate Npm to seamlessly execute automated workflows, synchronize data, and orchestrate Npm actions directly within Alti.",
    "image": "https://logos.composio.dev/api/npm",
    "app_name": "npm",
    "isAvailable": true
  },
  {
    "title": "Ocr Web Service",
    "description": "Integrate Ocr Web Service to seamlessly execute automated workflows, synchronize data, and orchestrate Ocr Web Service actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ocr_web_service",
    "app_name": "ocr_web_service",
    "isAvailable": true
  },
  {
    "title": "Ocrspace",
    "description": "Integrate Ocrspace to seamlessly execute automated workflows, synchronize data, and orchestrate Ocrspace actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ocrspace",
    "app_name": "ocrspace",
    "isAvailable": true
  },
  {
    "title": "Omnisend",
    "description": "Integrate Omnisend to seamlessly execute automated workflows, synchronize data, and orchestrate Omnisend actions directly within Alti.",
    "image": "https://logos.composio.dev/api/omnisend",
    "app_name": "omnisend",
    "isAvailable": true
  },
  {
    "title": "Oncehub",
    "description": "Integrate Oncehub to seamlessly execute automated workflows, synchronize data, and orchestrate Oncehub actions directly within Alti.",
    "image": "https://logos.composio.dev/api/oncehub",
    "app_name": "oncehub",
    "isAvailable": true
  },
  {
    "title": "Onedesk",
    "description": "Integrate Onedesk to seamlessly execute automated workflows, synchronize data, and orchestrate Onedesk actions directly within Alti.",
    "image": "https://logos.composio.dev/api/onedesk",
    "app_name": "onedesk",
    "isAvailable": true
  },
  {
    "title": "Onesignal Rest API",
    "description": "Integrate Onesignal Rest API to seamlessly execute automated workflows, synchronize data, and orchestrate Onesignal Rest API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/onesignal_rest_api",
    "app_name": "onesignal_rest_api",
    "isAvailable": true
  },
  {
    "title": "Onesignal User Auth",
    "description": "Integrate Onesignal User Auth to seamlessly execute automated workflows, synchronize data, and orchestrate Onesignal User Auth actions directly within Alti.",
    "image": "https://logos.composio.dev/api/onesignal_user_auth",
    "app_name": "onesignal_user_auth",
    "isAvailable": true
  },
  {
    "title": "Open Sea",
    "description": "Integrate Open Sea to seamlessly execute automated workflows, synchronize data, and orchestrate Open Sea actions directly within Alti.",
    "image": "https://logos.composio.dev/api/open_sea",
    "app_name": "open_sea",
    "isAvailable": true
  },
  {
    "title": "Openai",
    "description": "Integrate Openai to seamlessly execute automated workflows, synchronize data, and orchestrate Openai actions directly within Alti.",
    "image": "https://logos.composio.dev/api/openai",
    "app_name": "openai",
    "isAvailable": true
  },
  {
    "title": "Opencage",
    "description": "Integrate Opencage to seamlessly execute automated workflows, synchronize data, and orchestrate Opencage actions directly within Alti.",
    "image": "https://logos.composio.dev/api/opencage",
    "app_name": "opencage",
    "isAvailable": true
  },
  {
    "title": "Opengraph Io",
    "description": "Integrate Opengraph Io to seamlessly execute automated workflows, synchronize data, and orchestrate Opengraph Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/opengraph_io",
    "app_name": "opengraph_io",
    "isAvailable": true
  },
  {
    "title": "Openperplex",
    "description": "Integrate Openperplex to seamlessly execute automated workflows, synchronize data, and orchestrate Openperplex actions directly within Alti.",
    "image": "https://logos.composio.dev/api/openperplex",
    "app_name": "openperplex",
    "isAvailable": true
  },
  {
    "title": "Openrouter",
    "description": "Integrate Openrouter to seamlessly execute automated workflows, synchronize data, and orchestrate Openrouter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/openrouter",
    "app_name": "openrouter",
    "isAvailable": true
  },
  {
    "title": "Openweather API",
    "description": "Integrate Openweather API to seamlessly execute automated workflows, synchronize data, and orchestrate Openweather API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/openweather_api",
    "app_name": "openweather_api",
    "isAvailable": true
  },
  {
    "title": "Optimoroute",
    "description": "Integrate Optimoroute to seamlessly execute automated workflows, synchronize data, and orchestrate Optimoroute actions directly within Alti.",
    "image": "https://logos.composio.dev/api/optimoroute",
    "app_name": "optimoroute",
    "isAvailable": true
  },
  {
    "title": "Owl Protocol",
    "description": "Integrate Owl Protocol to seamlessly execute automated workflows, synchronize data, and orchestrate Owl Protocol actions directly within Alti.",
    "image": "https://logos.composio.dev/api/owl_protocol",
    "app_name": "owl_protocol",
    "isAvailable": true
  },
  {
    "title": "Page X",
    "description": "Integrate Page X to seamlessly execute automated workflows, synchronize data, and orchestrate Page X actions directly within Alti.",
    "image": "https://logos.composio.dev/api/page_x",
    "app_name": "page_x",
    "isAvailable": true
  },
  {
    "title": "Paradym",
    "description": "Integrate Paradym to seamlessly execute automated workflows, synchronize data, and orchestrate Paradym actions directly within Alti.",
    "image": "https://logos.composio.dev/api/paradym",
    "app_name": "paradym",
    "isAvailable": true
  },
  {
    "title": "Parallel",
    "description": "Integrate Parallel to seamlessly execute automated workflows, synchronize data, and orchestrate Parallel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/parallel",
    "app_name": "parallel",
    "isAvailable": true
  },
  {
    "title": "Parma",
    "description": "Integrate Parma to seamlessly execute automated workflows, synchronize data, and orchestrate Parma actions directly within Alti.",
    "image": "https://logos.composio.dev/api/parma",
    "app_name": "parma",
    "isAvailable": true
  },
  {
    "title": "Parsehub",
    "description": "Integrate Parsehub to seamlessly execute automated workflows, synchronize data, and orchestrate Parsehub actions directly within Alti.",
    "image": "https://logos.composio.dev/api/parsehub",
    "app_name": "parsehub",
    "isAvailable": true
  },
  {
    "title": "Parsera",
    "description": "Integrate Parsera to seamlessly execute automated workflows, synchronize data, and orchestrate Parsera actions directly within Alti.",
    "image": "https://logos.composio.dev/api/parsera",
    "app_name": "parsera",
    "isAvailable": true
  },
  {
    "title": "Parseur",
    "description": "Integrate Parseur to seamlessly execute automated workflows, synchronize data, and orchestrate Parseur actions directly within Alti.",
    "image": "https://logos.composio.dev/api/parseur",
    "app_name": "parseur",
    "isAvailable": true
  },
  {
    "title": "Passcreator",
    "description": "Integrate Passcreator to seamlessly execute automated workflows, synchronize data, and orchestrate Passcreator actions directly within Alti.",
    "image": "https://logos.composio.dev/api/passcreator",
    "app_name": "passcreator",
    "isAvailable": true
  },
  {
    "title": "Passslot",
    "description": "Integrate Passslot to seamlessly execute automated workflows, synchronize data, and orchestrate Passslot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/passslot",
    "app_name": "passslot",
    "isAvailable": true
  },
  {
    "title": "PDF API Io",
    "description": "Integrate PDF API Io to seamlessly execute automated workflows, synchronize data, and orchestrate PDF API Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pdf_api_io",
    "app_name": "pdf_api_io",
    "isAvailable": true
  },
  {
    "title": "PDF Co",
    "description": "Integrate PDF Co to seamlessly execute automated workflows, synchronize data, and orchestrate PDF Co actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pdf_co",
    "app_name": "pdf_co",
    "isAvailable": true
  },
  {
    "title": "Pdf4me",
    "description": "Integrate Pdf4me to seamlessly execute automated workflows, synchronize data, and orchestrate Pdf4me actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pdf4me",
    "app_name": "pdf4me",
    "isAvailable": true
  },
  {
    "title": "Pdfless",
    "description": "Integrate Pdfless to seamlessly execute automated workflows, synchronize data, and orchestrate Pdfless actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pdfless",
    "app_name": "pdfless",
    "isAvailable": true
  },
  {
    "title": "Pdfmonkey",
    "description": "Integrate Pdfmonkey to seamlessly execute automated workflows, synchronize data, and orchestrate Pdfmonkey actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pdfmonkey",
    "app_name": "pdfmonkey",
    "isAvailable": true
  },
  {
    "title": "Perigon",
    "description": "Integrate Perigon to seamlessly execute automated workflows, synchronize data, and orchestrate Perigon actions directly within Alti.",
    "image": "https://logos.composio.dev/api/perigon",
    "app_name": "perigon",
    "isAvailable": true
  },
  {
    "title": "Persistiq",
    "description": "Integrate Persistiq to seamlessly execute automated workflows, synchronize data, and orchestrate Persistiq actions directly within Alti.",
    "image": "https://logos.composio.dev/api/persistiq",
    "app_name": "persistiq",
    "isAvailable": true
  },
  {
    "title": "Pexels",
    "description": "Integrate Pexels to seamlessly execute automated workflows, synchronize data, and orchestrate Pexels actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pexels",
    "app_name": "pexels",
    "isAvailable": true
  },
  {
    "title": "Phantombuster",
    "description": "Integrate Phantombuster to seamlessly execute automated workflows, synchronize data, and orchestrate Phantombuster actions directly within Alti.",
    "image": "https://logos.composio.dev/api/phantombuster",
    "app_name": "phantombuster",
    "isAvailable": true
  },
  {
    "title": "Piggy",
    "description": "Integrate Piggy to seamlessly execute automated workflows, synchronize data, and orchestrate Piggy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/piggy",
    "app_name": "piggy",
    "isAvailable": true
  },
  {
    "title": "Piloterr",
    "description": "Integrate Piloterr to seamlessly execute automated workflows, synchronize data, and orchestrate Piloterr actions directly within Alti.",
    "image": "https://logos.composio.dev/api/piloterr",
    "app_name": "piloterr",
    "isAvailable": true
  },
  {
    "title": "Pilvio",
    "description": "Integrate Pilvio to seamlessly execute automated workflows, synchronize data, and orchestrate Pilvio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pilvio",
    "app_name": "pilvio",
    "isAvailable": true
  },
  {
    "title": "Pingdom",
    "description": "Integrate Pingdom to seamlessly execute automated workflows, synchronize data, and orchestrate Pingdom actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pingdom",
    "app_name": "pingdom",
    "isAvailable": true
  },
  {
    "title": "Pipeline CRM",
    "description": "Integrate Pipeline CRM to seamlessly execute automated workflows, synchronize data, and orchestrate Pipeline CRM actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pipeline_crm",
    "app_name": "pipeline_crm",
    "isAvailable": true
  },
  {
    "title": "Placid",
    "description": "Integrate Placid to seamlessly execute automated workflows, synchronize data, and orchestrate Placid actions directly within Alti.",
    "image": "https://logos.composio.dev/api/placid",
    "app_name": "placid",
    "isAvailable": true
  },
  {
    "title": "Plain",
    "description": "Integrate Plain to seamlessly execute automated workflows, synchronize data, and orchestrate Plain actions directly within Alti.",
    "image": "https://logos.composio.dev/api/plain",
    "app_name": "plain",
    "isAvailable": true
  },
  {
    "title": "Plasmic",
    "description": "Integrate Plasmic to seamlessly execute automated workflows, synchronize data, and orchestrate Plasmic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/plasmic",
    "app_name": "plasmic",
    "isAvailable": true
  },
  {
    "title": "Platerecognizer",
    "description": "Integrate Platerecognizer to seamlessly execute automated workflows, synchronize data, and orchestrate Platerecognizer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/platerecognizer",
    "app_name": "platerecognizer",
    "isAvailable": true
  },
  {
    "title": "Plisio",
    "description": "Integrate Plisio to seamlessly execute automated workflows, synchronize data, and orchestrate Plisio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/plisio",
    "app_name": "plisio",
    "isAvailable": true
  },
  {
    "title": "Polygon",
    "description": "Integrate Polygon to seamlessly execute automated workflows, synchronize data, and orchestrate Polygon actions directly within Alti.",
    "image": "https://logos.composio.dev/api/polygon",
    "app_name": "polygon",
    "isAvailable": true
  },
  {
    "title": "Polygon Io",
    "description": "Integrate Polygon Io to seamlessly execute automated workflows, synchronize data, and orchestrate Polygon Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/polygon_io",
    "app_name": "polygon_io",
    "isAvailable": true
  },
  {
    "title": "Poptin",
    "description": "Integrate Poptin to seamlessly execute automated workflows, synchronize data, and orchestrate Poptin actions directly within Alti.",
    "image": "https://logos.composio.dev/api/poptin",
    "app_name": "poptin",
    "isAvailable": true
  },
  {
    "title": "Postgrid",
    "description": "Integrate Postgrid to seamlessly execute automated workflows, synchronize data, and orchestrate Postgrid actions directly within Alti.",
    "image": "https://logos.composio.dev/api/postgrid",
    "app_name": "postgrid",
    "isAvailable": true
  },
  {
    "title": "Postgrid Verify",
    "description": "Integrate Postgrid Verify to seamlessly execute automated workflows, synchronize data, and orchestrate Postgrid Verify actions directly within Alti.",
    "image": "https://logos.composio.dev/api/postgrid_verify",
    "app_name": "postgrid_verify",
    "isAvailable": true
  },
  {
    "title": "Postmark",
    "description": "Integrate Postmark to seamlessly execute automated workflows, synchronize data, and orchestrate Postmark actions directly within Alti.",
    "image": "https://logos.composio.dev/api/postmark",
    "app_name": "postmark",
    "isAvailable": true
  },
  {
    "title": "Precoro",
    "description": "Integrate Precoro to seamlessly execute automated workflows, synchronize data, and orchestrate Precoro actions directly within Alti.",
    "image": "https://logos.composio.dev/api/precoro",
    "app_name": "precoro",
    "isAvailable": true
  },
  {
    "title": "Prerender",
    "description": "Integrate Prerender to seamlessly execute automated workflows, synchronize data, and orchestrate Prerender actions directly within Alti.",
    "image": "https://logos.composio.dev/api/prerender",
    "app_name": "prerender",
    "isAvailable": true
  },
  {
    "title": "Printautopilot",
    "description": "Integrate Printautopilot to seamlessly execute automated workflows, synchronize data, and orchestrate Printautopilot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/printautopilot",
    "app_name": "printautopilot",
    "isAvailable": true
  },
  {
    "title": "Printnode",
    "description": "Integrate Printnode to seamlessly execute automated workflows, synchronize data, and orchestrate Printnode actions directly within Alti.",
    "image": "https://logos.composio.dev/api/printnode",
    "app_name": "printnode",
    "isAvailable": true
  },
  {
    "title": "Prisma",
    "description": "Integrate Prisma to seamlessly execute automated workflows, synchronize data, and orchestrate Prisma actions directly within Alti.",
    "image": "https://logos.composio.dev/api/prisma",
    "app_name": "prisma",
    "isAvailable": true
  },
  {
    "title": "Prismic",
    "description": "Integrate Prismic to seamlessly execute automated workflows, synchronize data, and orchestrate Prismic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/prismic",
    "app_name": "prismic",
    "isAvailable": true
  },
  {
    "title": "Procfu",
    "description": "Integrate Procfu to seamlessly execute automated workflows, synchronize data, and orchestrate Procfu actions directly within Alti.",
    "image": "https://logos.composio.dev/api/procfu",
    "app_name": "procfu",
    "isAvailable": true
  },
  {
    "title": "Productboard",
    "description": "Integrate Productboard to seamlessly execute automated workflows, synchronize data, and orchestrate Productboard actions directly within Alti.",
    "image": "https://logos.composio.dev/api/productboard",
    "app_name": "productboard",
    "isAvailable": true
  },
  {
    "title": "Productlane",
    "description": "Integrate Productlane to seamlessly execute automated workflows, synchronize data, and orchestrate Productlane actions directly within Alti.",
    "image": "https://logos.composio.dev/api/productlane",
    "app_name": "productlane",
    "isAvailable": true
  },
  {
    "title": "Project Bubble",
    "description": "Integrate Project Bubble to seamlessly execute automated workflows, synchronize data, and orchestrate Project Bubble actions directly within Alti.",
    "image": "https://logos.composio.dev/api/project_bubble",
    "app_name": "project_bubble",
    "isAvailable": true
  },
  {
    "title": "Promptmate Io",
    "description": "Integrate Promptmate Io to seamlessly execute automated workflows, synchronize data, and orchestrate Promptmate Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/promptmate_io",
    "app_name": "promptmate_io",
    "isAvailable": true
  },
  {
    "title": "Proofly",
    "description": "Integrate Proofly to seamlessly execute automated workflows, synchronize data, and orchestrate Proofly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/proofly",
    "app_name": "proofly",
    "isAvailable": true
  },
  {
    "title": "Proxiedmail",
    "description": "Integrate Proxiedmail to seamlessly execute automated workflows, synchronize data, and orchestrate Proxiedmail actions directly within Alti.",
    "image": "https://logos.composio.dev/api/proxiedmail",
    "app_name": "proxiedmail",
    "isAvailable": true
  },
  {
    "title": "Pushover",
    "description": "Integrate Pushover to seamlessly execute automated workflows, synchronize data, and orchestrate Pushover actions directly within Alti.",
    "image": "https://logos.composio.dev/api/pushover",
    "app_name": "pushover",
    "isAvailable": true
  },
  {
    "title": "Quaderno",
    "description": "Integrate Quaderno to seamlessly execute automated workflows, synchronize data, and orchestrate Quaderno actions directly within Alti.",
    "image": "https://logos.composio.dev/api/quaderno",
    "app_name": "quaderno",
    "isAvailable": true
  },
  {
    "title": "Qualaroo",
    "description": "Integrate Qualaroo to seamlessly execute automated workflows, synchronize data, and orchestrate Qualaroo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/qualaroo",
    "app_name": "qualaroo",
    "isAvailable": true
  },
  {
    "title": "Radar",
    "description": "Integrate Radar to seamlessly execute automated workflows, synchronize data, and orchestrate Radar actions directly within Alti.",
    "image": "https://logos.composio.dev/api/radar",
    "app_name": "radar",
    "isAvailable": true
  },
  {
    "title": "Rafflys",
    "description": "Integrate Rafflys to seamlessly execute automated workflows, synchronize data, and orchestrate Rafflys actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rafflys",
    "app_name": "rafflys",
    "isAvailable": true
  },
  {
    "title": "Ragic",
    "description": "Integrate Ragic to seamlessly execute automated workflows, synchronize data, and orchestrate Ragic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ragic",
    "app_name": "ragic",
    "isAvailable": true
  },
  {
    "title": "Raisely",
    "description": "Integrate Raisely to seamlessly execute automated workflows, synchronize data, and orchestrate Raisely actions directly within Alti.",
    "image": "https://logos.composio.dev/api/raisely",
    "app_name": "raisely",
    "isAvailable": true
  },
  {
    "title": "Ravenseotools",
    "description": "Integrate Ravenseotools to seamlessly execute automated workflows, synchronize data, and orchestrate Ravenseotools actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ravenseotools",
    "app_name": "ravenseotools",
    "isAvailable": true
  },
  {
    "title": "Re Amaze",
    "description": "Integrate Re Amaze to seamlessly execute automated workflows, synchronize data, and orchestrate Re Amaze actions directly within Alti.",
    "image": "https://logos.composio.dev/api/re_amaze",
    "app_name": "re_amaze",
    "isAvailable": true
  },
  {
    "title": "Realphonevalidation",
    "description": "Integrate Realphonevalidation to seamlessly execute automated workflows, synchronize data, and orchestrate Realphonevalidation actions directly within Alti.",
    "image": "https://logos.composio.dev/api/realphonevalidation",
    "app_name": "realphonevalidation",
    "isAvailable": true
  },
  {
    "title": "Recruitee",
    "description": "Integrate Recruitee to seamlessly execute automated workflows, synchronize data, and orchestrate Recruitee actions directly within Alti.",
    "image": "https://logos.composio.dev/api/recruitee",
    "app_name": "recruitee",
    "isAvailable": true
  },
  {
    "title": "Refiner",
    "description": "Integrate Refiner to seamlessly execute automated workflows, synchronize data, and orchestrate Refiner actions directly within Alti.",
    "image": "https://logos.composio.dev/api/refiner",
    "app_name": "refiner",
    "isAvailable": true
  },
  {
    "title": "Remarkety",
    "description": "Integrate Remarkety to seamlessly execute automated workflows, synchronize data, and orchestrate Remarkety actions directly within Alti.",
    "image": "https://logos.composio.dev/api/remarkety",
    "app_name": "remarkety",
    "isAvailable": true
  },
  {
    "title": "Remote Retrieval",
    "description": "Integrate Remote Retrieval to seamlessly execute automated workflows, synchronize data, and orchestrate Remote Retrieval actions directly within Alti.",
    "image": "https://logos.composio.dev/api/remote_retrieval",
    "app_name": "remote_retrieval",
    "isAvailable": true
  },
  {
    "title": "Remove Bg",
    "description": "Integrate Remove Bg to seamlessly execute automated workflows, synchronize data, and orchestrate Remove Bg actions directly within Alti.",
    "image": "https://logos.composio.dev/api/remove_bg",
    "app_name": "remove_bg",
    "isAvailable": true
  },
  {
    "title": "Render",
    "description": "Integrate Render to seamlessly execute automated workflows, synchronize data, and orchestrate Render actions directly within Alti.",
    "image": "https://logos.composio.dev/api/render",
    "app_name": "render",
    "isAvailable": true
  },
  {
    "title": "Renderform",
    "description": "Integrate Renderform to seamlessly execute automated workflows, synchronize data, and orchestrate Renderform actions directly within Alti.",
    "image": "https://logos.composio.dev/api/renderform",
    "app_name": "renderform",
    "isAvailable": true
  },
  {
    "title": "Repairshopr",
    "description": "Integrate Repairshopr to seamlessly execute automated workflows, synchronize data, and orchestrate Repairshopr actions directly within Alti.",
    "image": "https://logos.composio.dev/api/repairshopr",
    "app_name": "repairshopr",
    "isAvailable": true
  },
  {
    "title": "Replicate",
    "description": "Integrate Replicate to seamlessly execute automated workflows, synchronize data, and orchestrate Replicate actions directly within Alti.",
    "image": "https://logos.composio.dev/api/replicate",
    "app_name": "replicate",
    "isAvailable": true
  },
  {
    "title": "Reply",
    "description": "Integrate Reply to seamlessly execute automated workflows, synchronize data, and orchestrate Reply actions directly within Alti.",
    "image": "https://logos.composio.dev/api/reply",
    "app_name": "reply",
    "isAvailable": true
  },
  {
    "title": "Reply Io",
    "description": "Integrate Reply Io to seamlessly execute automated workflows, synchronize data, and orchestrate Reply Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/reply_io",
    "app_name": "reply_io",
    "isAvailable": true
  },
  {
    "title": "Resend",
    "description": "Integrate Resend to seamlessly execute automated workflows, synchronize data, and orchestrate Resend actions directly within Alti.",
    "image": "https://logos.composio.dev/api/resend",
    "app_name": "resend",
    "isAvailable": true
  },
  {
    "title": "Respond Io",
    "description": "Integrate Respond Io to seamlessly execute automated workflows, synchronize data, and orchestrate Respond Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/respond_io",
    "app_name": "respond_io",
    "isAvailable": true
  },
  {
    "title": "Retailed",
    "description": "Integrate Retailed to seamlessly execute automated workflows, synchronize data, and orchestrate Retailed actions directly within Alti.",
    "image": "https://logos.composio.dev/api/retailed",
    "app_name": "retailed",
    "isAvailable": true
  },
  {
    "title": "Retently",
    "description": "Integrate Retently to seamlessly execute automated workflows, synchronize data, and orchestrate Retently actions directly within Alti.",
    "image": "https://logos.composio.dev/api/retently",
    "app_name": "retently",
    "isAvailable": true
  },
  {
    "title": "Rev AI",
    "description": "Integrate Rev AI to seamlessly execute automated workflows, synchronize data, and orchestrate Rev AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rev_ai",
    "app_name": "rev_ai",
    "isAvailable": true
  },
  {
    "title": "Revolt",
    "description": "Integrate Revolt to seamlessly execute automated workflows, synchronize data, and orchestrate Revolt actions directly within Alti.",
    "image": "https://logos.composio.dev/api/revolt",
    "app_name": "revolt",
    "isAvailable": true
  },
  {
    "title": "Ring Central",
    "description": "Integrate Ring Central to seamlessly execute automated workflows, synchronize data, and orchestrate Ring Central actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ring_central",
    "app_name": "ring_central",
    "isAvailable": true
  },
  {
    "title": "Rippling",
    "description": "Integrate Rippling to seamlessly execute automated workflows, synchronize data, and orchestrate Rippling actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rippling",
    "app_name": "rippling",
    "isAvailable": true
  },
  {
    "title": "Ritekit",
    "description": "Integrate Ritekit to seamlessly execute automated workflows, synchronize data, and orchestrate Ritekit actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ritekit",
    "app_name": "ritekit",
    "isAvailable": true
  },
  {
    "title": "Rkvst",
    "description": "Integrate Rkvst to seamlessly execute automated workflows, synchronize data, and orchestrate Rkvst actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rkvst",
    "app_name": "rkvst",
    "isAvailable": true
  },
  {
    "title": "Rocket Reach",
    "description": "Integrate Rocket Reach to seamlessly execute automated workflows, synchronize data, and orchestrate Rocket Reach actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rocket_reach",
    "app_name": "rocket_reach",
    "isAvailable": true
  },
  {
    "title": "Rocketlane",
    "description": "Integrate Rocketlane to seamlessly execute automated workflows, synchronize data, and orchestrate Rocketlane actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rocketlane",
    "app_name": "rocketlane",
    "isAvailable": true
  },
  {
    "title": "Rootly",
    "description": "Integrate Rootly to seamlessly execute automated workflows, synchronize data, and orchestrate Rootly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rootly",
    "app_name": "rootly",
    "isAvailable": true
  },
  {
    "title": "Rosette Text Analytics",
    "description": "Integrate Rosette Text Analytics to seamlessly execute automated workflows, synchronize data, and orchestrate Rosette Text Analytics actions directly within Alti.",
    "image": "https://logos.composio.dev/api/rosette_text_analytics",
    "app_name": "rosette_text_analytics",
    "isAvailable": true
  },
  {
    "title": "Route4me",
    "description": "Integrate Route4me to seamlessly execute automated workflows, synchronize data, and orchestrate Route4me actions directly within Alti.",
    "image": "https://logos.composio.dev/api/route4me",
    "app_name": "route4me",
    "isAvailable": true
  },
  {
    "title": "Safetyculture",
    "description": "Integrate Safetyculture to seamlessly execute automated workflows, synchronize data, and orchestrate Safetyculture actions directly within Alti.",
    "image": "https://logos.composio.dev/api/safetyculture",
    "app_name": "safetyculture",
    "isAvailable": true
  },
  {
    "title": "Sage",
    "description": "Integrate Sage to seamlessly execute automated workflows, synchronize data, and orchestrate Sage actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sage",
    "app_name": "sage",
    "isAvailable": true
  },
  {
    "title": "Salesforce Marketing Cloud",
    "description": "Integrate Salesforce Marketing Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Salesforce Marketing Cloud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/salesforce_marketing_cloud",
    "app_name": "salesforce_marketing_cloud",
    "isAvailable": true
  },
  {
    "title": "Salesforce Service Cloud",
    "description": "Integrate Salesforce Service Cloud to seamlessly execute automated workflows, synchronize data, and orchestrate Salesforce Service Cloud actions directly within Alti.",
    "image": "https://logos.composio.dev/api/salesforce_service_cloud",
    "app_name": "salesforce_service_cloud",
    "isAvailable": true
  },
  {
    "title": "Sap Successfactors",
    "description": "Integrate Sap Successfactors to seamlessly execute automated workflows, synchronize data, and orchestrate Sap Successfactors actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sap_successfactors",
    "app_name": "sap_successfactors",
    "isAvailable": true
  },
  {
    "title": "Satismeter",
    "description": "Integrate Satismeter to seamlessly execute automated workflows, synchronize data, and orchestrate Satismeter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/satismeter",
    "app_name": "satismeter",
    "isAvailable": true
  },
  {
    "title": "Scrape Do",
    "description": "Integrate Scrape Do to seamlessly execute automated workflows, synchronize data, and orchestrate Scrape Do actions directly within Alti.",
    "image": "https://logos.composio.dev/api/scrape_do",
    "app_name": "scrape_do",
    "isAvailable": true
  },
  {
    "title": "Scrapegraph AI",
    "description": "Integrate Scrapegraph AI to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapegraph AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/scrapegraph_ai",
    "app_name": "scrapegraph_ai",
    "isAvailable": true
  },
  {
    "title": "Scrapfly",
    "description": "Integrate Scrapfly to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapfly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/scrapfly",
    "app_name": "scrapfly",
    "isAvailable": true
  },
  {
    "title": "Scrapingant",
    "description": "Integrate Scrapingant to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapingant actions directly within Alti.",
    "image": "https://logos.composio.dev/api/scrapingant",
    "app_name": "scrapingant",
    "isAvailable": true
  },
  {
    "title": "Scrapingbee",
    "description": "Integrate Scrapingbee to seamlessly execute automated workflows, synchronize data, and orchestrate Scrapingbee actions directly within Alti.",
    "image": "https://logos.composio.dev/api/scrapingbee",
    "app_name": "scrapingbee",
    "isAvailable": true
  },
  {
    "title": "Screenshot Fyi",
    "description": "Integrate Screenshot Fyi to seamlessly execute automated workflows, synchronize data, and orchestrate Screenshot Fyi actions directly within Alti.",
    "image": "https://logos.composio.dev/api/screenshot_fyi",
    "app_name": "screenshot_fyi",
    "isAvailable": true
  },
  {
    "title": "Screenshotone",
    "description": "Integrate Screenshotone to seamlessly execute automated workflows, synchronize data, and orchestrate Screenshotone actions directly within Alti.",
    "image": "https://logos.composio.dev/api/screenshotone",
    "app_name": "screenshotone",
    "isAvailable": true
  },
  {
    "title": "Seat Geek",
    "description": "Integrate Seat Geek to seamlessly execute automated workflows, synchronize data, and orchestrate Seat Geek actions directly within Alti.",
    "image": "https://logos.composio.dev/api/seat_geek",
    "app_name": "seat_geek",
    "isAvailable": true
  },
  {
    "title": "Securitytrails",
    "description": "Integrate Securitytrails to seamlessly execute automated workflows, synchronize data, and orchestrate Securitytrails actions directly within Alti.",
    "image": "https://logos.composio.dev/api/securitytrails",
    "app_name": "securitytrails",
    "isAvailable": true
  },
  {
    "title": "Segment",
    "description": "Integrate Segment to seamlessly execute automated workflows, synchronize data, and orchestrate Segment actions directly within Alti.",
    "image": "https://logos.composio.dev/api/segment",
    "app_name": "segment",
    "isAvailable": true
  },
  {
    "title": "Segmetrics",
    "description": "Integrate Segmetrics to seamlessly execute automated workflows, synchronize data, and orchestrate Segmetrics actions directly within Alti.",
    "image": "https://logos.composio.dev/api/segmetrics",
    "app_name": "segmetrics",
    "isAvailable": true
  },
  {
    "title": "Seismic",
    "description": "Integrate Seismic to seamlessly execute automated workflows, synchronize data, and orchestrate Seismic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/seismic",
    "app_name": "seismic",
    "isAvailable": true
  },
  {
    "title": "Semrush",
    "description": "Integrate Semrush to seamlessly execute automated workflows, synchronize data, and orchestrate Semrush actions directly within Alti.",
    "image": "https://logos.composio.dev/api/semrush",
    "app_name": "semrush",
    "isAvailable": true
  },
  {
    "title": "Sendbird",
    "description": "Integrate Sendbird to seamlessly execute automated workflows, synchronize data, and orchestrate Sendbird actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sendbird",
    "app_name": "sendbird",
    "isAvailable": true
  },
  {
    "title": "Sendbird AI Chabot",
    "description": "Integrate Sendbird AI Chabot to seamlessly execute automated workflows, synchronize data, and orchestrate Sendbird AI Chabot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sendbird_ai_chabot",
    "app_name": "sendbird_ai_chabot",
    "isAvailable": true
  },
  {
    "title": "Sendfox",
    "description": "Integrate Sendfox to seamlessly execute automated workflows, synchronize data, and orchestrate Sendfox actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sendfox",
    "app_name": "sendfox",
    "isAvailable": true
  },
  {
    "title": "Sendlane",
    "description": "Integrate Sendlane to seamlessly execute automated workflows, synchronize data, and orchestrate Sendlane actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sendlane",
    "app_name": "sendlane",
    "isAvailable": true
  },
  {
    "title": "Sendloop",
    "description": "Integrate Sendloop to seamlessly execute automated workflows, synchronize data, and orchestrate Sendloop actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sendloop",
    "app_name": "sendloop",
    "isAvailable": true
  },
  {
    "title": "Sendspark",
    "description": "Integrate Sendspark to seamlessly execute automated workflows, synchronize data, and orchestrate Sendspark actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sendspark",
    "app_name": "sendspark",
    "isAvailable": true
  },
  {
    "title": "Sensibo",
    "description": "Integrate Sensibo to seamlessly execute automated workflows, synchronize data, and orchestrate Sensibo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sensibo",
    "app_name": "sensibo",
    "isAvailable": true
  },
  {
    "title": "Seqera",
    "description": "Integrate Seqera to seamlessly execute automated workflows, synchronize data, and orchestrate Seqera actions directly within Alti.",
    "image": "https://logos.composio.dev/api/seqera",
    "app_name": "seqera",
    "isAvailable": true
  },
  {
    "title": "Serpdog",
    "description": "Integrate Serpdog to seamlessly execute automated workflows, synchronize data, and orchestrate Serpdog actions directly within Alti.",
    "image": "https://logos.composio.dev/api/serpdog",
    "app_name": "serpdog",
    "isAvailable": true
  },
  {
    "title": "Serply",
    "description": "Integrate Serply to seamlessly execute automated workflows, synchronize data, and orchestrate Serply actions directly within Alti.",
    "image": "https://logos.composio.dev/api/serply",
    "app_name": "serply",
    "isAvailable": true
  },
  {
    "title": "Sevdesk",
    "description": "Integrate Sevdesk to seamlessly execute automated workflows, synchronize data, and orchestrate Sevdesk actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sevdesk",
    "app_name": "sevdesk",
    "isAvailable": true
  },
  {
    "title": "Shipengine",
    "description": "Integrate Shipengine to seamlessly execute automated workflows, synchronize data, and orchestrate Shipengine actions directly within Alti.",
    "image": "https://logos.composio.dev/api/shipengine",
    "app_name": "shipengine",
    "isAvailable": true
  },
  {
    "title": "Short Io",
    "description": "Integrate Short Io to seamlessly execute automated workflows, synchronize data, and orchestrate Short Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/short_io",
    "app_name": "short_io",
    "isAvailable": true
  },
  {
    "title": "Short Menu",
    "description": "Integrate Short Menu to seamlessly execute automated workflows, synchronize data, and orchestrate Short Menu actions directly within Alti.",
    "image": "https://logos.composio.dev/api/short_menu",
    "app_name": "short_menu",
    "isAvailable": true
  },
  {
    "title": "Shorten Rest",
    "description": "Integrate Shorten Rest to seamlessly execute automated workflows, synchronize data, and orchestrate Shorten Rest actions directly within Alti.",
    "image": "https://logos.composio.dev/api/shorten_rest",
    "app_name": "shorten_rest",
    "isAvailable": true
  },
  {
    "title": "Shortpixel",
    "description": "Integrate Shortpixel to seamlessly execute automated workflows, synchronize data, and orchestrate Shortpixel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/shortpixel",
    "app_name": "shortpixel",
    "isAvailable": true
  },
  {
    "title": "Shotstack",
    "description": "Integrate Shotstack to seamlessly execute automated workflows, synchronize data, and orchestrate Shotstack actions directly within Alti.",
    "image": "https://logos.composio.dev/api/shotstack",
    "app_name": "shotstack",
    "isAvailable": true
  },
  {
    "title": "Sidetracker",
    "description": "Integrate Sidetracker to seamlessly execute automated workflows, synchronize data, and orchestrate Sidetracker actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sidetracker",
    "app_name": "sidetracker",
    "isAvailable": true
  },
  {
    "title": "Signaturely",
    "description": "Integrate Signaturely to seamlessly execute automated workflows, synchronize data, and orchestrate Signaturely actions directly within Alti.",
    "image": "https://logos.composio.dev/api/signaturely",
    "app_name": "signaturely",
    "isAvailable": true
  },
  {
    "title": "Signpath",
    "description": "Integrate Signpath to seamlessly execute automated workflows, synchronize data, and orchestrate Signpath actions directly within Alti.",
    "image": "https://logos.composio.dev/api/signpath",
    "app_name": "signpath",
    "isAvailable": true
  },
  {
    "title": "Signwell",
    "description": "Integrate Signwell to seamlessly execute automated workflows, synchronize data, and orchestrate Signwell actions directly within Alti.",
    "image": "https://logos.composio.dev/api/signwell",
    "app_name": "signwell",
    "isAvailable": true
  },
  {
    "title": "Similarweb Digitalrank API",
    "description": "Integrate Similarweb Digitalrank API to seamlessly execute automated workflows, synchronize data, and orchestrate Similarweb Digitalrank API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/similarweb_digitalrank_api",
    "app_name": "similarweb_digitalrank_api",
    "isAvailable": true
  },
  {
    "title": "Simla Com",
    "description": "Integrate Simla Com to seamlessly execute automated workflows, synchronize data, and orchestrate Simla Com actions directly within Alti.",
    "image": "https://logos.composio.dev/api/simla_com",
    "app_name": "simla_com",
    "isAvailable": true
  },
  {
    "title": "Simple Analytics",
    "description": "Integrate Simple Analytics to seamlessly execute automated workflows, synchronize data, and orchestrate Simple Analytics actions directly within Alti.",
    "image": "https://logos.composio.dev/api/simple_analytics",
    "app_name": "simple_analytics",
    "isAvailable": true
  },
  {
    "title": "Sitespeakai",
    "description": "Integrate Sitespeakai to seamlessly execute automated workflows, synchronize data, and orchestrate Sitespeakai actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sitespeakai",
    "app_name": "sitespeakai",
    "isAvailable": true
  },
  {
    "title": "Skyfire",
    "description": "Integrate Skyfire to seamlessly execute automated workflows, synchronize data, and orchestrate Skyfire actions directly within Alti.",
    "image": "https://logos.composio.dev/api/skyfire",
    "app_name": "skyfire",
    "isAvailable": true
  },
  {
    "title": "Smartproxy",
    "description": "Integrate Smartproxy to seamlessly execute automated workflows, synchronize data, and orchestrate Smartproxy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/smartproxy",
    "app_name": "smartproxy",
    "isAvailable": true
  },
  {
    "title": "Smartrecruiters",
    "description": "Integrate Smartrecruiters to seamlessly execute automated workflows, synchronize data, and orchestrate Smartrecruiters actions directly within Alti.",
    "image": "https://logos.composio.dev/api/smartrecruiters",
    "app_name": "smartrecruiters",
    "isAvailable": true
  },
  {
    "title": "SMS Alert",
    "description": "Integrate SMS Alert to seamlessly execute automated workflows, synchronize data, and orchestrate SMS Alert actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sms_alert",
    "app_name": "sms_alert",
    "isAvailable": true
  },
  {
    "title": "Smtp2go",
    "description": "Integrate Smtp2go to seamlessly execute automated workflows, synchronize data, and orchestrate Smtp2go actions directly within Alti.",
    "image": "https://logos.composio.dev/api/smtp2go",
    "app_name": "smtp2go",
    "isAvailable": true
  },
  {
    "title": "Smugmug",
    "description": "Integrate Smugmug to seamlessly execute automated workflows, synchronize data, and orchestrate Smugmug actions directly within Alti.",
    "image": "https://logos.composio.dev/api/smugmug",
    "app_name": "smugmug",
    "isAvailable": true
  },
  {
    "title": "Snowflake Basic",
    "description": "Integrate Snowflake Basic to seamlessly execute automated workflows, synchronize data, and orchestrate Snowflake Basic actions directly within Alti.",
    "image": "https://logos.composio.dev/api/snowflake_basic",
    "app_name": "snowflake_basic",
    "isAvailable": true
  },
  {
    "title": "Sourcegraph",
    "description": "Integrate Sourcegraph to seamlessly execute automated workflows, synchronize data, and orchestrate Sourcegraph actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sourcegraph",
    "app_name": "sourcegraph",
    "isAvailable": true
  },
  {
    "title": "Splitwise",
    "description": "Integrate Splitwise to seamlessly execute automated workflows, synchronize data, and orchestrate Splitwise actions directly within Alti.",
    "image": "https://logos.composio.dev/api/splitwise",
    "app_name": "splitwise",
    "isAvailable": true
  },
  {
    "title": "Spoki",
    "description": "Integrate Spoki to seamlessly execute automated workflows, synchronize data, and orchestrate Spoki actions directly within Alti.",
    "image": "https://logos.composio.dev/api/spoki",
    "app_name": "spoki",
    "isAvailable": true
  },
  {
    "title": "Spondyr",
    "description": "Integrate Spondyr to seamlessly execute automated workflows, synchronize data, and orchestrate Spondyr actions directly within Alti.",
    "image": "https://logos.composio.dev/api/spondyr",
    "app_name": "spondyr",
    "isAvailable": true
  },
  {
    "title": "Spotlightr",
    "description": "Integrate Spotlightr to seamlessly execute automated workflows, synchronize data, and orchestrate Spotlightr actions directly within Alti.",
    "image": "https://logos.composio.dev/api/spotlightr",
    "app_name": "spotlightr",
    "isAvailable": true
  },
  {
    "title": "Square",
    "description": "Integrate Square to seamlessly execute automated workflows, synchronize data, and orchestrate Square actions directly within Alti.",
    "image": "https://logos.composio.dev/api/square",
    "app_name": "square",
    "isAvailable": true
  },
  {
    "title": "Sslmate Cert Spotter API",
    "description": "Integrate Sslmate Cert Spotter API to seamlessly execute automated workflows, synchronize data, and orchestrate Sslmate Cert Spotter API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sslmate_cert_spotter_api",
    "app_name": "sslmate_cert_spotter_api",
    "isAvailable": true
  },
  {
    "title": "Stannp",
    "description": "Integrate Stannp to seamlessly execute automated workflows, synchronize data, and orchestrate Stannp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/stannp",
    "app_name": "stannp",
    "isAvailable": true
  },
  {
    "title": "Starton",
    "description": "Integrate Starton to seamlessly execute automated workflows, synchronize data, and orchestrate Starton actions directly within Alti.",
    "image": "https://logos.composio.dev/api/starton",
    "app_name": "starton",
    "isAvailable": true
  },
  {
    "title": "Statuscake",
    "description": "Integrate Statuscake to seamlessly execute automated workflows, synchronize data, and orchestrate Statuscake actions directly within Alti.",
    "image": "https://logos.composio.dev/api/statuscake",
    "app_name": "statuscake",
    "isAvailable": true
  },
  {
    "title": "Storeganise",
    "description": "Integrate Storeganise to seamlessly execute automated workflows, synchronize data, and orchestrate Storeganise actions directly within Alti.",
    "image": "https://logos.composio.dev/api/storeganise",
    "app_name": "storeganise",
    "isAvailable": true
  },
  {
    "title": "Storerocket",
    "description": "Integrate Storerocket to seamlessly execute automated workflows, synchronize data, and orchestrate Storerocket actions directly within Alti.",
    "image": "https://logos.composio.dev/api/storerocket",
    "app_name": "storerocket",
    "isAvailable": true
  },
  {
    "title": "Stormglass Io",
    "description": "Integrate Stormglass Io to seamlessly execute automated workflows, synchronize data, and orchestrate Stormglass Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/stormglass_io",
    "app_name": "stormglass_io",
    "isAvailable": true
  },
  {
    "title": "Strava",
    "description": "Integrate Strava to seamlessly execute automated workflows, synchronize data, and orchestrate Strava actions directly within Alti.",
    "image": "https://logos.composio.dev/api/strava",
    "app_name": "strava",
    "isAvailable": true
  },
  {
    "title": "Streamtime",
    "description": "Integrate Streamtime to seamlessly execute automated workflows, synchronize data, and orchestrate Streamtime actions directly within Alti.",
    "image": "https://logos.composio.dev/api/streamtime",
    "app_name": "streamtime",
    "isAvailable": true
  },
  {
    "title": "Supadata",
    "description": "Integrate Supadata to seamlessly execute automated workflows, synchronize data, and orchestrate Supadata actions directly within Alti.",
    "image": "https://logos.composio.dev/api/supadata",
    "app_name": "supadata",
    "isAvailable": true
  },
  {
    "title": "Superchat",
    "description": "Integrate Superchat to seamlessly execute automated workflows, synchronize data, and orchestrate Superchat actions directly within Alti.",
    "image": "https://logos.composio.dev/api/superchat",
    "app_name": "superchat",
    "isAvailable": true
  },
  {
    "title": "Supportbee",
    "description": "Integrate Supportbee to seamlessly execute automated workflows, synchronize data, and orchestrate Supportbee actions directly within Alti.",
    "image": "https://logos.composio.dev/api/supportbee",
    "app_name": "supportbee",
    "isAvailable": true
  },
  {
    "title": "Supportivekoala",
    "description": "Integrate Supportivekoala to seamlessly execute automated workflows, synchronize data, and orchestrate Supportivekoala actions directly within Alti.",
    "image": "https://logos.composio.dev/api/supportivekoala",
    "app_name": "supportivekoala",
    "isAvailable": true
  },
  {
    "title": "Survey Monkey",
    "description": "Integrate Survey Monkey to seamlessly execute automated workflows, synchronize data, and orchestrate Survey Monkey actions directly within Alti.",
    "image": "https://logos.composio.dev/api/survey_monkey",
    "app_name": "survey_monkey",
    "isAvailable": true
  },
  {
    "title": "Svix",
    "description": "Integrate Svix to seamlessly execute automated workflows, synchronize data, and orchestrate Svix actions directly within Alti.",
    "image": "https://logos.composio.dev/api/svix",
    "app_name": "svix",
    "isAvailable": true
  },
  {
    "title": "Sympla",
    "description": "Integrate Sympla to seamlessly execute automated workflows, synchronize data, and orchestrate Sympla actions directly within Alti.",
    "image": "https://logos.composio.dev/api/sympla",
    "app_name": "sympla",
    "isAvailable": true
  },
  {
    "title": "Synthflow AI",
    "description": "Integrate Synthflow AI to seamlessly execute automated workflows, synchronize data, and orchestrate Synthflow AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/synthflow_ai",
    "app_name": "synthflow_ai",
    "isAvailable": true
  },
  {
    "title": "Taggun",
    "description": "Integrate Taggun to seamlessly execute automated workflows, synchronize data, and orchestrate Taggun actions directly within Alti.",
    "image": "https://logos.composio.dev/api/taggun",
    "app_name": "taggun",
    "isAvailable": true
  },
  {
    "title": "Talenthr",
    "description": "Integrate Talenthr to seamlessly execute automated workflows, synchronize data, and orchestrate Talenthr actions directly within Alti.",
    "image": "https://logos.composio.dev/api/talenthr",
    "app_name": "talenthr",
    "isAvailable": true
  },
  {
    "title": "Tally",
    "description": "Integrate Tally to seamlessly execute automated workflows, synchronize data, and orchestrate Tally actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tally",
    "app_name": "tally",
    "isAvailable": true
  },
  {
    "title": "Tapfiliate",
    "description": "Integrate Tapfiliate to seamlessly execute automated workflows, synchronize data, and orchestrate Tapfiliate actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tapfiliate",
    "app_name": "tapfiliate",
    "isAvailable": true
  },
  {
    "title": "Tapform",
    "description": "Integrate Tapform to seamlessly execute automated workflows, synchronize data, and orchestrate Tapform actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tapform",
    "app_name": "tapform",
    "isAvailable": true
  },
  {
    "title": "Taxjar",
    "description": "Integrate Taxjar to seamlessly execute automated workflows, synchronize data, and orchestrate Taxjar actions directly within Alti.",
    "image": "https://logos.composio.dev/api/taxjar",
    "app_name": "taxjar",
    "isAvailable": true
  },
  {
    "title": "Teamcamp",
    "description": "Integrate Teamcamp to seamlessly execute automated workflows, synchronize data, and orchestrate Teamcamp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/teamcamp",
    "app_name": "teamcamp",
    "isAvailable": true
  },
  {
    "title": "Telegram",
    "description": "Integrate Telegram to seamlessly execute automated workflows, synchronize data, and orchestrate Telegram actions directly within Alti.",
    "image": "https://logos.composio.dev/api/telegram",
    "app_name": "telegram",
    "isAvailable": true
  },
  {
    "title": "Telnyx",
    "description": "Integrate Telnyx to seamlessly execute automated workflows, synchronize data, and orchestrate Telnyx actions directly within Alti.",
    "image": "https://logos.composio.dev/api/telnyx",
    "app_name": "telnyx",
    "isAvailable": true
  },
  {
    "title": "Teltel",
    "description": "Integrate Teltel to seamlessly execute automated workflows, synchronize data, and orchestrate Teltel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/teltel",
    "app_name": "teltel",
    "isAvailable": true
  },
  {
    "title": "Templated",
    "description": "Integrate Templated to seamlessly execute automated workflows, synchronize data, and orchestrate Templated actions directly within Alti.",
    "image": "https://logos.composio.dev/api/templated",
    "app_name": "templated",
    "isAvailable": true
  },
  {
    "title": "Terminus",
    "description": "Integrate Terminus to seamlessly execute automated workflows, synchronize data, and orchestrate Terminus actions directly within Alti.",
    "image": "https://logos.composio.dev/api/terminus",
    "app_name": "terminus",
    "isAvailable": true
  },
  {
    "title": "Test App",
    "description": "Integrate Test App to seamlessly execute automated workflows, synchronize data, and orchestrate Test App actions directly within Alti.",
    "image": "https://logos.composio.dev/api/test_app",
    "app_name": "test_app",
    "isAvailable": true
  },
  {
    "title": "Text To PDF",
    "description": "Integrate Text To PDF to seamlessly execute automated workflows, synchronize data, and orchestrate Text To PDF actions directly within Alti.",
    "image": "https://logos.composio.dev/api/text_to_pdf",
    "app_name": "text_to_pdf",
    "isAvailable": true
  },
  {
    "title": "Textcortex",
    "description": "Integrate Textcortex to seamlessly execute automated workflows, synchronize data, and orchestrate Textcortex actions directly within Alti.",
    "image": "https://logos.composio.dev/api/textcortex",
    "app_name": "textcortex",
    "isAvailable": true
  },
  {
    "title": "Textit",
    "description": "Integrate Textit to seamlessly execute automated workflows, synchronize data, and orchestrate Textit actions directly within Alti.",
    "image": "https://logos.composio.dev/api/textit",
    "app_name": "textit",
    "isAvailable": true
  },
  {
    "title": "Thanks Io",
    "description": "Integrate Thanks Io to seamlessly execute automated workflows, synchronize data, and orchestrate Thanks Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/thanks_io",
    "app_name": "thanks_io",
    "isAvailable": true
  },
  {
    "title": "The Odds API",
    "description": "Integrate The Odds API to seamlessly execute automated workflows, synchronize data, and orchestrate The Odds API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/the_odds_api",
    "app_name": "the_odds_api",
    "isAvailable": true
  },
  {
    "title": "Ticketmaster",
    "description": "Integrate Ticketmaster to seamlessly execute automated workflows, synchronize data, and orchestrate Ticketmaster actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ticketmaster",
    "app_name": "ticketmaster",
    "isAvailable": true
  },
  {
    "title": "Tiktok",
    "description": "Integrate Tiktok to seamlessly execute automated workflows, synchronize data, and orchestrate Tiktok actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tiktok",
    "app_name": "tiktok",
    "isAvailable": true
  },
  {
    "title": "Timecamp",
    "description": "Integrate Timecamp to seamlessly execute automated workflows, synchronize data, and orchestrate Timecamp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/timecamp",
    "app_name": "timecamp",
    "isAvailable": true
  },
  {
    "title": "Timekit",
    "description": "Integrate Timekit to seamlessly execute automated workflows, synchronize data, and orchestrate Timekit actions directly within Alti.",
    "image": "https://logos.composio.dev/api/timekit",
    "app_name": "timekit",
    "isAvailable": true
  },
  {
    "title": "Timelinesai",
    "description": "Integrate Timelinesai to seamlessly execute automated workflows, synchronize data, and orchestrate Timelinesai actions directly within Alti.",
    "image": "https://logos.composio.dev/api/timelinesai",
    "app_name": "timelinesai",
    "isAvailable": true
  },
  {
    "title": "Timelink",
    "description": "Integrate Timelink to seamlessly execute automated workflows, synchronize data, and orchestrate Timelink actions directly within Alti.",
    "image": "https://logos.composio.dev/api/timelink",
    "app_name": "timelink",
    "isAvailable": true
  },
  {
    "title": "Tinypng",
    "description": "Integrate Tinypng to seamlessly execute automated workflows, synchronize data, and orchestrate Tinypng actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tinypng",
    "app_name": "tinypng",
    "isAvailable": true
  },
  {
    "title": "Tisane",
    "description": "Integrate Tisane to seamlessly execute automated workflows, synchronize data, and orchestrate Tisane actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tisane",
    "app_name": "tisane",
    "isAvailable": true
  },
  {
    "title": "Toggl",
    "description": "Integrate Toggl to seamlessly execute automated workflows, synchronize data, and orchestrate Toggl actions directly within Alti.",
    "image": "https://logos.composio.dev/api/toggl",
    "app_name": "toggl",
    "isAvailable": true
  },
  {
    "title": "Token Metrics",
    "description": "Integrate Token Metrics to seamlessly execute automated workflows, synchronize data, and orchestrate Token Metrics actions directly within Alti.",
    "image": "https://logos.composio.dev/api/token_metrics",
    "app_name": "token_metrics",
    "isAvailable": true
  },
  {
    "title": "Tomba",
    "description": "Integrate Tomba to seamlessly execute automated workflows, synchronize data, and orchestrate Tomba actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tomba",
    "app_name": "tomba",
    "isAvailable": true
  },
  {
    "title": "Tomtom",
    "description": "Integrate Tomtom to seamlessly execute automated workflows, synchronize data, and orchestrate Tomtom actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tomtom",
    "app_name": "tomtom",
    "isAvailable": true
  },
  {
    "title": "Toneden",
    "description": "Integrate Toneden to seamlessly execute automated workflows, synchronize data, and orchestrate Toneden actions directly within Alti.",
    "image": "https://logos.composio.dev/api/toneden",
    "app_name": "toneden",
    "isAvailable": true
  },
  {
    "title": "Tpscheck",
    "description": "Integrate Tpscheck to seamlessly execute automated workflows, synchronize data, and orchestrate Tpscheck actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tpscheck",
    "app_name": "tpscheck",
    "isAvailable": true
  },
  {
    "title": "Triggercmd",
    "description": "Integrate Triggercmd to seamlessly execute automated workflows, synchronize data, and orchestrate Triggercmd actions directly within Alti.",
    "image": "https://logos.composio.dev/api/triggercmd",
    "app_name": "triggercmd",
    "isAvailable": true
  },
  {
    "title": "Tripadvisor Content API",
    "description": "Integrate Tripadvisor Content API to seamlessly execute automated workflows, synchronize data, and orchestrate Tripadvisor Content API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/tripadvisor_content_api",
    "app_name": "tripadvisor_content_api",
    "isAvailable": true
  },
  {
    "title": "Turbot Pipes",
    "description": "Integrate Turbot Pipes to seamlessly execute automated workflows, synchronize data, and orchestrate Turbot Pipes actions directly within Alti.",
    "image": "https://logos.composio.dev/api/turbot_pipes",
    "app_name": "turbot_pipes",
    "isAvailable": true
  },
  {
    "title": "Turso",
    "description": "Integrate Turso to seamlessly execute automated workflows, synchronize data, and orchestrate Turso actions directly within Alti.",
    "image": "https://logos.composio.dev/api/turso",
    "app_name": "turso",
    "isAvailable": true
  },
  {
    "title": "Twelve Data",
    "description": "Integrate Twelve Data to seamlessly execute automated workflows, synchronize data, and orchestrate Twelve Data actions directly within Alti.",
    "image": "https://logos.composio.dev/api/twelve_data",
    "app_name": "twelve_data",
    "isAvailable": true
  },
  {
    "title": "Twitch",
    "description": "Integrate Twitch to seamlessly execute automated workflows, synchronize data, and orchestrate Twitch actions directly within Alti.",
    "image": "https://logos.composio.dev/api/twitch",
    "app_name": "twitch",
    "isAvailable": true
  },
  {
    "title": "Twitter",
    "description": "Integrate Twitter to seamlessly execute automated workflows, synchronize data, and orchestrate Twitter actions directly within Alti.",
    "image": "https://logos.composio.dev/api/twitter",
    "app_name": "twitter",
    "isAvailable": true
  },
  {
    "title": "Twocaptcha",
    "description": "Integrate Twocaptcha to seamlessly execute automated workflows, synchronize data, and orchestrate Twocaptcha actions directly within Alti.",
    "image": "https://logos.composio.dev/api/twocaptcha",
    "app_name": "twocaptcha",
    "isAvailable": true
  },
  {
    "title": "Typless",
    "description": "Integrate Typless to seamlessly execute automated workflows, synchronize data, and orchestrate Typless actions directly within Alti.",
    "image": "https://logos.composio.dev/api/typless",
    "app_name": "typless",
    "isAvailable": true
  },
  {
    "title": "U301",
    "description": "Integrate U301 to seamlessly execute automated workflows, synchronize data, and orchestrate U301 actions directly within Alti.",
    "image": "https://logos.composio.dev/api/u301",
    "app_name": "u301",
    "isAvailable": true
  },
  {
    "title": "Unione",
    "description": "Integrate Unione to seamlessly execute automated workflows, synchronize data, and orchestrate Unione actions directly within Alti.",
    "image": "https://logos.composio.dev/api/unione",
    "app_name": "unione",
    "isAvailable": true
  },
  {
    "title": "Updown Io",
    "description": "Integrate Updown Io to seamlessly execute automated workflows, synchronize data, and orchestrate Updown Io actions directly within Alti.",
    "image": "https://logos.composio.dev/api/updown_io",
    "app_name": "updown_io",
    "isAvailable": true
  },
  {
    "title": "Uploadcare",
    "description": "Integrate Uploadcare to seamlessly execute automated workflows, synchronize data, and orchestrate Uploadcare actions directly within Alti.",
    "image": "https://logos.composio.dev/api/uploadcare",
    "app_name": "uploadcare",
    "isAvailable": true
  },
  {
    "title": "Uptimerobot",
    "description": "Integrate Uptimerobot to seamlessly execute automated workflows, synchronize data, and orchestrate Uptimerobot actions directly within Alti.",
    "image": "https://logos.composio.dev/api/uptimerobot",
    "app_name": "uptimerobot",
    "isAvailable": true
  },
  {
    "title": "Userlist",
    "description": "Integrate Userlist to seamlessly execute automated workflows, synchronize data, and orchestrate Userlist actions directly within Alti.",
    "image": "https://logos.composio.dev/api/userlist",
    "app_name": "userlist",
    "isAvailable": true
  },
  {
    "title": "V0",
    "description": "Integrate V0 to seamlessly execute automated workflows, synchronize data, and orchestrate V0 actions directly within Alti.",
    "image": "https://logos.composio.dev/api/v0",
    "app_name": "v0",
    "isAvailable": true
  },
  {
    "title": "Venly",
    "description": "Integrate Venly to seamlessly execute automated workflows, synchronize data, and orchestrate Venly actions directly within Alti.",
    "image": "https://logos.composio.dev/api/venly",
    "app_name": "venly",
    "isAvailable": true
  },
  {
    "title": "Veo",
    "description": "Integrate Veo to seamlessly execute automated workflows, synchronize data, and orchestrate Veo actions directly within Alti.",
    "image": "https://logos.composio.dev/api/veo",
    "app_name": "veo",
    "isAvailable": true
  },
  {
    "title": "Vercel",
    "description": "Integrate Vercel to seamlessly execute automated workflows, synchronize data, and orchestrate Vercel actions directly within Alti.",
    "image": "https://logos.composio.dev/api/vercel",
    "app_name": "vercel",
    "isAvailable": true
  },
  {
    "title": "Verifiedemail",
    "description": "Integrate Verifiedemail to seamlessly execute automated workflows, synchronize data, and orchestrate Verifiedemail actions directly within Alti.",
    "image": "https://logos.composio.dev/api/verifiedemail",
    "app_name": "verifiedemail",
    "isAvailable": true
  },
  {
    "title": "Veriphone",
    "description": "Integrate Veriphone to seamlessly execute automated workflows, synchronize data, and orchestrate Veriphone actions directly within Alti.",
    "image": "https://logos.composio.dev/api/veriphone",
    "app_name": "veriphone",
    "isAvailable": true
  },
  {
    "title": "Vero",
    "description": "Integrate Vero to seamlessly execute automated workflows, synchronize data, and orchestrate Vero actions directly within Alti.",
    "image": "https://logos.composio.dev/api/vero",
    "app_name": "vero",
    "isAvailable": true
  },
  {
    "title": "Vestaboard",
    "description": "Integrate Vestaboard to seamlessly execute automated workflows, synchronize data, and orchestrate Vestaboard actions directly within Alti.",
    "image": "https://logos.composio.dev/api/vestaboard",
    "app_name": "vestaboard",
    "isAvailable": true
  },
  {
    "title": "Virustotal",
    "description": "Integrate Virustotal to seamlessly execute automated workflows, synchronize data, and orchestrate Virustotal actions directly within Alti.",
    "image": "https://logos.composio.dev/api/virustotal",
    "app_name": "virustotal",
    "isAvailable": true
  },
  {
    "title": "Visme",
    "description": "Integrate Visme to seamlessly execute automated workflows, synchronize data, and orchestrate Visme actions directly within Alti.",
    "image": "https://logos.composio.dev/api/visme",
    "app_name": "visme",
    "isAvailable": true
  },
  {
    "title": "Waboxapp",
    "description": "Integrate Waboxapp to seamlessly execute automated workflows, synchronize data, and orchestrate Waboxapp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/waboxapp",
    "app_name": "waboxapp",
    "isAvailable": true
  },
  {
    "title": "Wachete",
    "description": "Integrate Wachete to seamlessly execute automated workflows, synchronize data, and orchestrate Wachete actions directly within Alti.",
    "image": "https://logos.composio.dev/api/wachete",
    "app_name": "wachete",
    "isAvailable": true
  },
  {
    "title": "Waiverfile",
    "description": "Integrate Waiverfile to seamlessly execute automated workflows, synchronize data, and orchestrate Waiverfile actions directly within Alti.",
    "image": "https://logos.composio.dev/api/waiverfile",
    "app_name": "waiverfile",
    "isAvailable": true
  },
  {
    "title": "Wakatime",
    "description": "Integrate Wakatime to seamlessly execute automated workflows, synchronize data, and orchestrate Wakatime actions directly within Alti.",
    "image": "https://logos.composio.dev/api/wakatime",
    "app_name": "wakatime",
    "isAvailable": true
  },
  {
    "title": "Wati",
    "description": "Integrate Wati to seamlessly execute automated workflows, synchronize data, and orchestrate Wati actions directly within Alti.",
    "image": "https://logos.composio.dev/api/wati",
    "app_name": "wati",
    "isAvailable": true
  },
  {
    "title": "Wave Accounting",
    "description": "Integrate Wave Accounting to seamlessly execute automated workflows, synchronize data, and orchestrate Wave Accounting actions directly within Alti.",
    "image": "https://logos.composio.dev/api/wave_accounting",
    "app_name": "wave_accounting",
    "isAvailable": true
  },
  {
    "title": "Weathermap",
    "description": "Integrate Weathermap to seamlessly execute automated workflows, synchronize data, and orchestrate Weathermap actions directly within Alti.",
    "image": "https://logos.composio.dev/api/weathermap",
    "app_name": "weathermap",
    "isAvailable": true
  },
  {
    "title": "Webscraping AI",
    "description": "Integrate Webscraping AI to seamlessly execute automated workflows, synchronize data, and orchestrate Webscraping AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/webscraping_ai",
    "app_name": "webscraping_ai",
    "isAvailable": true
  },
  {
    "title": "Webvizio",
    "description": "Integrate Webvizio to seamlessly execute automated workflows, synchronize data, and orchestrate Webvizio actions directly within Alti.",
    "image": "https://logos.composio.dev/api/webvizio",
    "app_name": "webvizio",
    "isAvailable": true
  },
  {
    "title": "Whatsapp",
    "description": "Integrate Whatsapp to seamlessly execute automated workflows, synchronize data, and orchestrate Whatsapp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/whatsapp",
    "app_name": "whatsapp",
    "isAvailable": true
  },
  {
    "title": "Whautomate",
    "description": "Integrate Whautomate to seamlessly execute automated workflows, synchronize data, and orchestrate Whautomate actions directly within Alti.",
    "image": "https://logos.composio.dev/api/whautomate",
    "app_name": "whautomate",
    "isAvailable": true
  },
  {
    "title": "Winston AI",
    "description": "Integrate Winston AI to seamlessly execute automated workflows, synchronize data, and orchestrate Winston AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/winston_ai",
    "app_name": "winston_ai",
    "isAvailable": true
  },
  {
    "title": "Wit AI",
    "description": "Integrate Wit AI to seamlessly execute automated workflows, synchronize data, and orchestrate Wit AI actions directly within Alti.",
    "image": "https://logos.composio.dev/api/wit_ai",
    "app_name": "wit_ai",
    "isAvailable": true
  },
  {
    "title": "Wiz",
    "description": "Integrate Wiz to seamlessly execute automated workflows, synchronize data, and orchestrate Wiz actions directly within Alti.",
    "image": "https://logos.composio.dev/api/wiz",
    "app_name": "wiz",
    "isAvailable": true
  },
  {
    "title": "Wolfram Alpha API",
    "description": "Integrate Wolfram Alpha API to seamlessly execute automated workflows, synchronize data, and orchestrate Wolfram Alpha API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/wolfram_alpha_api",
    "app_name": "wolfram_alpha_api",
    "isAvailable": true
  },
  {
    "title": "Woodpecker Co",
    "description": "Integrate Woodpecker Co to seamlessly execute automated workflows, synchronize data, and orchestrate Woodpecker Co actions directly within Alti.",
    "image": "https://logos.composio.dev/api/woodpecker_co",
    "app_name": "woodpecker_co",
    "isAvailable": true
  },
  {
    "title": "Workable",
    "description": "Integrate Workable to seamlessly execute automated workflows, synchronize data, and orchestrate Workable actions directly within Alti.",
    "image": "https://logos.composio.dev/api/workable",
    "app_name": "workable",
    "isAvailable": true
  },
  {
    "title": "Workday",
    "description": "Integrate Workday to seamlessly execute automated workflows, synchronize data, and orchestrate Workday actions directly within Alti.",
    "image": "https://logos.composio.dev/api/workday",
    "app_name": "workday",
    "isAvailable": true
  },
  {
    "title": "Worksnaps",
    "description": "Integrate Worksnaps to seamlessly execute automated workflows, synchronize data, and orchestrate Worksnaps actions directly within Alti.",
    "image": "https://logos.composio.dev/api/worksnaps",
    "app_name": "worksnaps",
    "isAvailable": true
  },
  {
    "title": "Writer",
    "description": "Integrate Writer to seamlessly execute automated workflows, synchronize data, and orchestrate Writer actions directly within Alti.",
    "image": "https://logos.composio.dev/api/writer",
    "app_name": "writer",
    "isAvailable": true
  },
  {
    "title": "Y Gy",
    "description": "Integrate Y Gy to seamlessly execute automated workflows, synchronize data, and orchestrate Y Gy actions directly within Alti.",
    "image": "https://logos.composio.dev/api/y_gy",
    "app_name": "y_gy",
    "isAvailable": true
  },
  {
    "title": "Yelp",
    "description": "Integrate Yelp to seamlessly execute automated workflows, synchronize data, and orchestrate Yelp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/yelp",
    "app_name": "yelp",
    "isAvailable": true
  },
  {
    "title": "Ynab",
    "description": "Integrate Ynab to seamlessly execute automated workflows, synchronize data, and orchestrate Ynab actions directly within Alti.",
    "image": "https://logos.composio.dev/api/ynab",
    "app_name": "ynab",
    "isAvailable": true
  },
  {
    "title": "Zenserp",
    "description": "Integrate Zenserp to seamlessly execute automated workflows, synchronize data, and orchestrate Zenserp actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zenserp",
    "app_name": "zenserp",
    "isAvailable": true
  },
  {
    "title": "Zeplin",
    "description": "Integrate Zeplin to seamlessly execute automated workflows, synchronize data, and orchestrate Zeplin actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zeplin",
    "app_name": "zeplin",
    "isAvailable": true
  },
  {
    "title": "Zerobounce",
    "description": "Integrate Zerobounce to seamlessly execute automated workflows, synchronize data, and orchestrate Zerobounce actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zerobounce",
    "app_name": "zerobounce",
    "isAvailable": true
  },
  {
    "title": "Zoho Books",
    "description": "Integrate Zoho Books to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Books actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zoho_books",
    "app_name": "zoho_books",
    "isAvailable": true
  },
  {
    "title": "Zoho Desk",
    "description": "Integrate Zoho Desk to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Desk actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zoho_desk",
    "app_name": "zoho_desk",
    "isAvailable": true
  },
  {
    "title": "Zoho Inventory",
    "description": "Integrate Zoho Inventory to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Inventory actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zoho_inventory",
    "app_name": "zoho_inventory",
    "isAvailable": true
  },
  {
    "title": "Zoho Mail",
    "description": "Integrate Zoho Mail to seamlessly execute automated workflows, synchronize data, and orchestrate Zoho Mail actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zoho_mail",
    "app_name": "zoho_mail",
    "isAvailable": true
  },
  {
    "title": "Zylvie",
    "description": "Integrate Zylvie to seamlessly execute automated workflows, synchronize data, and orchestrate Zylvie actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zylvie",
    "app_name": "zylvie",
    "isAvailable": true
  },
  {
    "title": "Zyte API",
    "description": "Integrate Zyte API to seamlessly execute automated workflows, synchronize data, and orchestrate Zyte API actions directly within Alti.",
    "image": "https://logos.composio.dev/api/zyte_api",
    "app_name": "zyte_api",
    "isAvailable": true
  },
  {
    "title": "Toast POS",
    "description": "Toast POS is a leading restaurant management platform integrating front-of-house, back-of-house, and online ordering database systems.",
    "image": "https://www.google.com/s2/favicons?domain=toasttab.com&sz=128",
    "app_name": "toast",
    "isAvailable": true
  },
  {
    "title": "Dutchie POS",
    "description": "Dutchie POS is a premier cannabis retail and e-commerce platform managing compliant transaction records and inventory.",
    "image": "https://www.google.com/s2/favicons?domain=dutchie.com&sz=128",
    "app_name": "dutchie",
    "isAvailable": true
  },
  {
    "title": "Oracle MICROS",
    "description": "Oracle MICROS POS delivers enterprise-grade hospitality and restaurant transaction management globally.",
    "image": "https://www.google.com/s2/favicons?domain=oracle.com&sz=128",
    "app_name": "oracle_micros",
    "isAvailable": true
  },
  {
    "title": "NCR Aloha",
    "description": "NCR Aloha POS provides reliable restaurant point-of-sale terminal management and retail workflow logs.",
    "image": "https://www.google.com/s2/favicons?domain=ncr.com&sz=128",
    "app_name": "ncr_aloha",
    "isAvailable": true
  },
  {
    "title": "Clover POS",
    "description": "Clover POS integrates small-business payment terminals, merchant services, and customer loyalty histories.",
    "image": "https://www.google.com/s2/favicons?domain=clover.com&sz=128",
    "app_name": "clover",
    "isAvailable": true
  },
  {
    "title": "TouchBistro",
    "description": "TouchBistro POS is a dedicated iPad restaurant management system tracking table flows, staff tips, and sales.",
    "image": "https://www.google.com/s2/favicons?domain=touchbistro.com&sz=128",
    "app_name": "touchbistro",
    "isAvailable": true
  },
  {
    "title": "Revel Systems",
    "description": "Revel Systems POS provides cloud-based iPad retail and quick-service operations tracking ingredient-level inventory.",
    "image": "https://www.google.com/s2/favicons?domain=revelsystems.com&sz=128",
    "app_name": "revel_systems",
    "isAvailable": true
  },
  {
    "title": "Flowhub",
    "description": "Flowhub is a compliant cannabis retail POS managing seed-to-sale Metrc databases and compliance logs.",
    "image": "https://www.google.com/s2/favicons?domain=flowhub.com&sz=128",
    "app_name": "flowhub",
    "isAvailable": true
  },
  {
    "title": "Cova",
    "description": "Cova POS is a robust, compliance-centric cannabis retail system tracking excise taxes and state-limit allocations.",
    "image": "https://www.google.com/s2/favicons?domain=covasoftware.com&sz=128",
    "app_name": "cova",
    "isAvailable": true
  },
  {
    "title": "Treez",
    "description": "Treez is a cannabis POS and automated cashless payment system tracking retail drawers and wholesale trends.",
    "image": "https://www.google.com/s2/favicons?domain=treez.io&sz=128",
    "app_name": "treez",
    "isAvailable": true
  },
  {
    "title": "Mindbody",
    "description": "Mindbody is the leading fitness, yoga, and wellness class scheduling and membership management system.",
    "image": "https://www.google.com/s2/favicons?domain=mindbodyonline.com&sz=128",
    "app_name": "mindbody",
    "isAvailable": true
  },
  {
    "title": "Vagaro",
    "description": "Vagaro is a popular salon, spa, and beauty booking POS managing stylist calendars and rentals.",
    "image": "https://www.google.com/s2/favicons?domain=vagaro.com&sz=128",
    "app_name": "vagaro",
    "isAvailable": true
  },
  {
    "title": "Boulevard",
    "description": "Boulevard is a premium beauty salon and spa management platform tracking client intake and bookings.",
    "image": "https://www.google.com/s2/favicons?domain=joinblvd.com&sz=128",
    "app_name": "boulevard",
    "isAvailable": true
  },
  {
    "title": "Zenoti",
    "description": "Zenoti is an enterprise spa and salon franchise software system tracking multi-location transactions.",
    "image": "https://www.google.com/s2/favicons?domain=zenoti.com&sz=128",
    "app_name": "zenoti",
    "isAvailable": true
  },
  {
    "title": "Lightspeed Retail",
    "description": "Lightspeed POS manages multi-location retail store inventories, purchase orders, and customer records.",
    "image": "https://www.google.com/s2/favicons?domain=lightspeedhq.com&sz=128",
    "app_name": "lightspeed",
    "isAvailable": true
  },
  {
    "title": "Oracle NetSuite",
    "description": "Oracle NetSuite is a leading enterprise cloud ERP managing general ledgers, CRM, and supply chain databases.",
    "image": "https://www.google.com/s2/favicons?domain=netsuite.com&sz=128",
    "app_name": "oracle_netsuite",
    "isAvailable": true
  },
  {
    "title": "Epicor",
    "description": "Epicor is a powerful industrial ERP system tracking manufacturing bill-of-materials and warehouse logs.",
    "image": "https://www.google.com/s2/favicons?domain=epicor.com&sz=128",
    "app_name": "epicor",
    "isAvailable": true
  },
  {
    "title": "Athenahealth",
    "description": "Athenahealth EHR manages medical practice calendars, billing codes, and insurance claims.",
    "image": "https://www.google.com/s2/favicons?domain=athenahealth.com&sz=128",
    "app_name": "athenahealth",
    "isAvailable": true
  },
  {
    "title": "DrChrono",
    "description": "DrChrono is a mobile-first EHR practice management platform tracking clinical notes and scheduling.",
    "image": "https://www.google.com/s2/favicons?domain=drchrono.com&sz=128",
    "app_name": "drchrono",
    "isAvailable": true
  },
  {
    "title": "Open Dental",
    "description": "Open Dental EHR manages comprehensive patient dental charting, scheduling, and lab reports.",
    "image": "https://www.google.com/s2/favicons?domain=opendental.com&sz=128",
    "app_name": "open_dental",
    "isAvailable": true
  },
  {
    "title": "Dentrix",
    "description": "Dentrix is an enterprise dental clinic practice management database tracking treatment plans.",
    "image": "https://www.google.com/s2/favicons?domain=dentrix.com&sz=128",
    "app_name": "dentrix",
    "isAvailable": true
  },
  {
    "title": "Jane App",
    "description": "Jane App is a specialized clinic booking and charting database for practitioners and therapists.",
    "image": "https://www.google.com/s2/favicons?domain=jane.app&sz=128",
    "app_name": "jane_app",
    "isAvailable": true
  },
  {
    "title": "AppFolio",
    "description": "AppFolio is a top property management database tracking tenant lease ledgers and maintenance requests.",
    "image": "https://www.google.com/s2/favicons?domain=appfolio.com&sz=128",
    "app_name": "appfolio",
    "isAvailable": true
  },
  {
    "title": "Yardi Systems",
    "description": "Yardi is an enterprise real estate and asset performance ERP managing general ledger logs.",
    "image": "https://www.google.com/s2/favicons?domain=yardi.com&sz=128",
    "app_name": "yardi_systems",
    "isAvailable": true
  },
  {
    "title": "Entrata",
    "description": "Entrata is a multifamily property leasing and rent collection platform tracking tenant profiles.",
    "image": "https://www.google.com/s2/favicons?domain=entrata.com&sz=128",
    "app_name": "entrata",
    "isAvailable": true
  },
  {
    "title": "CoinGecko",
    "description": "CoinGecko provides independent cryptocurrency prices, trading volumes, and global crypto market capitalization charts.",
    "image": "https://www.google.com/s2/favicons?domain=coingecko.com&sz=128",
    "app_name": "coingecko",
    "isAvailable": true
  },
  {
    "title": "ExchangeRate-API",
    "description": "ExchangeRate-API provides fast, reliable real-time and historical global currency conversion rates.",
    "image": "https://www.google.com/s2/favicons?domain=exchangerate-api.com&sz=128",
    "app_name": "exchangerate",
    "isAvailable": true
  },
  {
    "title": "Frankfurter API",
    "description": "Frankfurter is a completely open-source currency exchange rate API tracking Reference Rates from the European Central Bank.",
    "image": "https://www.google.com/s2/favicons?domain=frankfurter.app&sz=128",
    "app_name": "frankfurter",
    "isAvailable": true
  },
  {
    "title": "IP-API",
    "description": "IP-API provides instant geolocation information mapping IP addresses to regional ISPs, cities, and countries.",
    "image": "https://www.google.com/s2/favicons?domain=ip-api.com&sz=128",
    "app_name": "ip_api",
    "isAvailable": true
  },
  {
    "title": "REST Countries",
    "description": "REST Countries delivers structured geographic and cultural details of global country profiles and flag vectors.",
    "image": "https://www.google.com/s2/favicons?domain=restcountries.com&sz=128",
    "app_name": "rest_countries",
    "isAvailable": true
  },
  {
    "title": "Open-Meteo",
    "description": "Open-Meteo provides completely open global weather forecasts, marine conditions, and historical climate datasets.",
    "image": "https://www.google.com/s2/favicons?domain=open-meteo.com&sz=128",
    "app_name": "open_meteo",
    "isAvailable": true
  },
  {
    "title": "FRED",
    "description": "FRED (Federal Reserve Economic Data) publishes over 800,000 national and international economic time series indexes.",
    "image": "https://www.google.com/s2/favicons?domain=fred.stlouisfed.org&sz=128",
    "app_name": "fred",
    "isAvailable": true
  },
  {
    "title": "Bureau of Labor Statistics",
    "description": "Bureau of Labor Statistics publishes critical economic indicators including Consumer Price Index, PPI, and labor rates.",
    "image": "https://www.google.com/s2/favicons?domain=bls.gov&sz=128",
    "app_name": "bls",
    "isAvailable": true
  },
  {
    "title": "OMDb API",
    "description": "OMDb API (Open Movie Database) provides comprehensive movie/show metadata, IMDb ratings, and poster assets.",
    "image": "https://www.google.com/s2/favicons?domain=omdbapi.com&sz=128",
    "app_name": "omdb",
    "isAvailable": true
  },
  {
    "title": "NASA Open APIs",
    "description": "NASA Open APIs provide public space exploration feeds, including near-Earth objects trackers and Mars Rover logs.",
    "image": "https://www.google.com/s2/favicons?domain=api.nasa.gov&sz=128",
    "app_name": "nasa",
    "isAvailable": true
  },
  {
    "title": "DuckDuckGo Search",
    "description": "DuckDuckGo Search provides quick instant answers, official summaries, and quick definitions for search terms.",
    "image": "https://www.google.com/s2/favicons?domain=duckduckgo.com&sz=128",
    "app_name": "duckduckgo",
    "isAvailable": true
  },
  {
    "title": "Open Food Facts",
    "description": "Open Food Facts is a collaborative, open database tracking food product ingredients, allergens, and nutritional specs.",
    "image": "https://www.google.com/s2/favicons?domain=openfoodfacts.org&sz=128",
    "app_name": "open_food_facts",
    "isAvailable": true
  },
  {
    "title": "Rainforest API",
    "description": "Rainforest API retrieves structured real-time e-commerce catalog pricing, product logs, and reviews from Amazon.",
    "image": "https://www.google.com/s2/favicons?domain=rainforestapi.com&sz=128",
    "app_name": "rainforest",
    "isAvailable": true
  },
  {
    "title": "CoinAPI",
    "description": "CoinAPI provides standard cryptocurrency market data, integration feeds, and pricing histories across 100+ exchanges.",
    "image": "https://www.google.com/s2/favicons?domain=coinapi.io&sz=128",
    "app_name": "coinapi",
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
