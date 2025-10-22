export type APP = {
  title: string;
  description: string;
  image: string;
  app_name: string;
  isAvailable: boolean;
};

export const allApps: APP[] = [
  {
    title: 'Gmail',
    description:
      'Gmail is Google\u2019s email service, featuring spam protection, search functions, and seamless integration with other G Suite apps for productivity.',
    image: '/assets/apps-logos/gmail.svg',
    app_name: 'gmail',
    isAvailable: true,
  },
  {
    title: 'GitHub',
    description:
      'GitHub is a code hosting platform for version control and collaboration, offering Git-based repository management, issue tracking, and continuous integration features.',
    image: '/assets/apps-logos/github.png',
    app_name: 'github',
    isAvailable: true,
  },
  {
    title: 'Google Calendar',
    description:
      'Google Calendar is a time management tool providing scheduling features, event reminders, and integration with email and other apps for streamlined organization.',
    image: '/assets/apps-logos/google-calendar.svg',
    app_name: 'googlecalendar',
    isAvailable: true,
  },
  {
    title: 'Notion',
    description:
      'Notion centralizes notes, docs, wikis, and tasks in a unified workspace, letting teams build custom workflows for collaboration and knowledge management.',
    image: '/assets/apps-logos/notion.svg',
    app_name: 'notion',
    isAvailable: true,
  },
  {
    title: 'Google Sheets',
    description:
      'Google Sheets is a cloud-based spreadsheet tool enabling real-time collaboration, data analysis, and integration with other Google Workspace apps.',
    image: '/assets/apps-logos/google-sheets.svg',
    app_name: 'googlesheets',
    isAvailable: true,
  },
  {
    title: 'Slack',
    description:
      'Slack is a channel-based messaging platform. With Slack, people can work together more effectively, connect all their software tools and services, and find the information they need to do their best work \u2014 all within a secure, enterprise-grade environment.',
    image: '/assets/apps-logos/slack.svg',
    app_name: 'slack',
    isAvailable: true,
  },
  {
    title: 'Linear',
    description:
      'Linear is a streamlined issue tracking and project planning tool for modern teams, featuring fast workflows, keyboard shortcuts, and GitHub integrations.',
    image: '/assets/apps-logos/linear.png',
    app_name: 'linear',
    isAvailable: true,
  },
  {
    title: 'Trello',
    description: 'A web-based, kanban-style, list-making application.',
    image: '/assets/apps-logos/trello.svg',
    app_name: 'trello',
    isAvailable: true,
  },
  {
    title: 'Supabase',
    description:
      'Supabase is an open-source backend-as-a-service providing a Postgres database, authentication, storage, and real-time subscription APIs for building modern applications.',
    image: '/assets/apps-logos/supabase.jpeg',
    app_name: 'supabase',
    isAvailable: true,
  },
  {
    title: 'Bitbucket',
    description:
      'Bitbucket is a Git-based code hosting and collaboration platform supporting private and public repositories, enabling teams to manage and review code through pull requests and integrations.',
    image: '/assets/apps-logos/bitbucket.svg',
    app_name: 'bitbucket',
    isAvailable: true,
  },
  {
    title: 'Sentry',
    description:
      'Integrate Sentry to manage your error tracking and monitoring.',
    image: '/assets/apps-logos/sentry.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Neon',
    description:
      'Postgres, on a serverless platform designed to help you build reliable and scalable applications faster.',
    image: '/assets/apps-logos/neon.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'ZenRows',
    description:
      'ZenRows is a web scraping API allowing developers to bypass CAPTCHAs and blocks, gather structured data from dynamic websites, and quickly integrate results into applications.',
    image: '/assets/apps-logos/zenrows.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Pagerduty',
    description:
      'Integrate PagerDuty to manage incidents, schedules, and alerts directly from your application.',
    image: '/assets/apps-logos/pagerduty.png',
    app_name: 'pagerduty',
    isAvailable: true,
  },
  {
    title: 'Contentful',
    description:
      'Contentful is a headless CMS allowing developers to create, manage, and distribute content across multiple channels and devices with an API-first approach.',
    image: '/assets/apps-logos/contentful-logo.png',
    app_name: 'contentful',
    isAvailable: true,
  },
  {
    title: 'Ably',
    description:
      'Ably is a real-time messaging platform helping developers build live features, including chat and data synchronization, with global scalability and robust reliability for modern applications.',
    image: '/assets/apps-logos/ably.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Ngrok',
    description:
      'Ngrok creates secure tunnels to locally hosted applications, enabling developers to share and test webhooks or services without configuring complex network settings.',
    image: '/assets/apps-logos/ngrok-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Baserow',
    description:
      'Baserow is an open-source database tool that lets teams build no-code data applications, collaborate on records, and integrate with other services for data management.',
    image: '/assets/apps-logos/baserow-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Datadog',
    description:
      'Datadog offers monitoring, observability, and security for cloud-scale applications, unifying metrics, logs, and traces to help teams detect issues and optimize performance.',
    image: '/assets/apps-logos/datadog-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Outlook',
    description:
      'Outlook is Microsoft\u2019s email and calendaring platform integrating contacts, tasks, and scheduling, enabling users to manage communications and events in a unified workspace.',
    image: '/assets/apps-logos/Outlook.svg',
    app_name: 'outlook',
    isAvailable: true,
  },
  {
    title: 'Slack Bot',
    description:
      'Slack Bot automates responses and reminders within Slack, assisting with tasks like onboarding, FAQs, and notifications to streamline team productivity.',
    image: '/assets/apps-logos/slack.svg',
    app_name: 'slackbot',
    isAvailable: true,
  },
  {
    title: 'Microsoft Teams',
    description:
      'Microsoft Teams integrates chat, video meetings, and file storage within Microsoft 365, providing virtual collaboration and communication for distributed teams.',
    image: '/assets/apps-logos/microsoft-teams-logo.jpeg',
    app_name: 'microsoft_teams',
    isAvailable: true,
  },
  {
    title: 'Discord Bot',
    description:
      'Discord Bot refers to automated programs on Discord servers, performing tasks like moderation, music playback, and user engagement to enhance community interactions.',
    image: '/assets/apps-logos/discord.svg',
    app_name: 'discordbot',
    isAvailable: true,
  },
  {
    title: 'Google Meet',
    description:
      'Google Meet is a secure video conferencing platform that integrates with Google Workspace, facilitating remote meetings, screen sharing, and chat.',
    image: '/assets/apps-logos/google-meet.webp',
    app_name: 'googlemeet',
    isAvailable: true,
  },
  {
    title: 'Zoom',
    description:
      'Zoom is a video conferencing and online meeting platform featuring breakout rooms, screen sharing, and integrations with various enterprise tools.',
    image: '/assets/apps-logos/zoom.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'RetellAI',
    description:
      'RetellAI captures calls and transcripts, enabling businesses to analyze conversations, extract insights, and enhance customer interactions in one centralized platform.',
    image: '/assets/apps-logos/retellai.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'SharePoint',
    description:
      'SharePoint is a Microsoft platform for document management and intranets, enabling teams to collaborate, store, and organize content securely and effectively.',
    image: '/assets/apps-logos/sharepoint-icon.svg',
    app_name: 'share_point',
    isAvailable: true,
  },
  {
    title: 'Webex',
    description:
      'Webex is a Cisco-powered video conferencing and collaboration platform offering online meetings, webinars, screen sharing, and team messaging.',
    image: '/assets/apps-logos/webex.png',
    app_name: 'webex',
    isAvailable: true,
  },
  {
    title: 'Daily Bot',
    description:
      'Daily Bot simplifies team collaboration and tasks with chat-based standups, reminders, polls, and integrations, streamlining workflow automation in popular messaging platforms.',
    image: '/assets/apps-logos/dailybot.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Chatwork',
    description:
      'Chatwork is a team communication platform featuring group chats, file sharing, and task management, aiming to enhance collaboration and productivity for businesses.',
    image: '/assets/apps-logos/chatwork-logo.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Dialpad',
    description:
      'Dialpad is a cloud-based business phone system and contact center platform that enables voice, video, messages and meetings across your existing devices.',
    image: '/assets/apps-logos/dialpad.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Stack Exchange',
    description:
      'Stack Exchange is a network of Q&A communities where users ask questions, share knowledge, and collaborate on topics like coding, math, and more.',
    image: '/assets/apps-logos/stackexchange.png',
    app_name: 'stack_exchange',
    isAvailable: true,
  },
  {
    title: 'EchtPost',
    description:
      'EchtPost facilitates secure digital communication, encryption, and data privacy, providing a reliable channel for sending confidential documents and messages.',
    image: '/assets/apps-logos/echtpost.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Perplexity AI',
    description:
      'Perplexity AI provides conversational AI models for generating human-like text responses.',
    image: '/assets/apps-logos/perplexity.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Mem0',
    description:
      'Mem0 assists with AI-driven note-taking, knowledge recall, and productivity tools, allowing users to organize, search, and generate content from stored information.',
    image: '/assets/apps-logos/mem0.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Semantic Scholar',
    description:
      'Semantic Scholar is an AI-powered academic search engine that helps researchers discover and understand scientific literature.',
    image: '/assets/apps-logos/semanticscholar.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Lmnt',
    description:
      'LMNT focuses on voice and audio manipulation, possibly leveraging AI to generate or transform sound for various creative and technical use cases.',
    image: '/assets/apps-logos/lmnt_logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Typefully',
    description:
      'Typefully is a platform for creating and managing AI-powered content.',
    image: '/assets/apps-logos/typefully.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Humanloop',
    description:
      'Humanloop helps developers build and refine AI applications, offering user feedback loops, model training, and data annotation to iterate on language model performance.',
    image: '/assets/apps-logos/humanloop.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'TextRazor',
    description:
      'TextRazor is a natural language processing API that extracts meaning, entities, and relationships from text, powering advanced content analysis and sentiment detection.',
    image: '/assets/apps-logos/textrazor.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Google Drive',
    description:
      'Google Drive is a cloud storage solution for uploading, sharing, and collaborating on files across devices, with robust search and offline access.',
    image: '/assets/apps-logos/google-drive.svg',
    app_name: 'googledrive',
    isAvailable: true,
  },
  {
    title: 'One drive',
    description:
      'OneDrive is Microsoft\u2019s cloud storage solution enabling users to store, sync, and share files across devices, offering offline access, real-time collaboration, and enterprise-grade security.',
    image: '/assets/apps-logos/one-drive.svg',
    app_name: 'one_drive',
    isAvailable: true,
  },
  {
    title: 'DocuSign',
    description:
      'DocuSign provides eSignature and digital agreement solutions, enabling businesses to send, sign, track, and manage documents electronically.',
    image: '/assets/apps-logos/docusign.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Dropbox',
    description:
      'Dropbox is a cloud storage service offering file syncing, sharing, and collaboration across devices with version control and robust integrations.',
    image: '/assets/apps-logos/dropbox.svg',
    app_name: 'dropbox',
    isAvailable: true,
  },
  {
    title: 'Google Photos',
    description:
      'Google Photos is a cloud-based photo storage and organization service offering automatic backups, AI-assisted search, and shared albums for personal and collaborative media management.',
    image: '/assets/apps-logos/Google_Photos.png',
    app_name: 'googlephotos',
    isAvailable: true,
  },
  {
    title: 'Google Super',
    description:
      'Google Super App combines all Google services including Drive, Calendar, Gmail, Sheets, Analytics, Ads, and more, providing a unified platform for seamless integration and management of your digital life.',
    image: '/assets/apps-logos/google.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Pandadoc',
    description:
      'PandaDoc offers document creation, e-signatures, and workflow automation, helping sales teams and businesses streamline proposals, contracts, and agreement processes.',
    image: '/assets/apps-logos/pandadoc.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Google Docs',
    description:
      'Google Docs is a cloud-based word processor with real-time collaboration, version history, and integration with other Google Workspace apps.',
    image: '/assets/apps-logos/google-docs.svg',
    app_name: 'googledocs',
    isAvailable: true,
  },
  {
    title: 'Airtable',
    description:
      'Airtable merges spreadsheet functionality with database power, enabling teams to organize projects, track tasks, and collaborate through customizable views, automation, and integrations for data management.',
    image: '/assets/apps-logos/airtable.svg',
    app_name: 'airtable',
    isAvailable: true,
  },
  {
    title: 'Google Tasks',
    description:
      'Google Tasks provides a simple to-do list and task management system integrated into Gmail and Google Calendar for quick and easy tracking.',
    image: '/assets/apps-logos/google-tasks.png',
    app_name: 'googletasks',
    isAvailable: true,
  },
  {
    title: 'Wrike',
    description:
      'Wrike is a project management and collaboration tool offering customizable workflows, Gantt charts, reporting, and resource management to boost team productivity.',
    image: '/assets/apps-logos/wrike.png',
    app_name: 'wrike',
    isAvailable: true,
  },
  {
    title: 'ClickUp',
    description:
      'ClickUp unifies tasks, docs, goals, and chat in a single platform, allowing teams to plan, organize, and collaborate across projects with customizable workflows.',
    image: '/assets/apps-logos/clickup.png',
    app_name: 'clickup',
    isAvailable: true,
  },
  {
    title: 'Shortcut',
    description:
      'Shortcut aligns product development work with company objectives so teams can execute with a shared purpose.',
    image: '/assets/apps-logos/shortcut.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Coda',
    description:
      'Collaborative workspace platform that transforms documents into powerful tools for team productivity and project management.',
    image: '/assets/apps-logos/coda.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Monday',
    description:
      'Monday.com is a customizable work management platform for project planning, collaboration, and automation, supporting agile, sales, marketing, and more.',
    image: '/assets/apps-logos/monday.png',
    app_name: 'monday',
    isAvailable: true,
  },
  {
    title: 'Onepage',
    description:
      'API for enriching user and company data, providing endpoints for token validation and generic search.',
    image: '/assets/apps-logos/onepage.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'LinkHut',
    description:
      'LinkHut manages bookmarked links in a minimalistic, shareable interface, helping teams organize URLs and track references in one place.',
    image: '/assets/apps-logos/linkhut.svg',
    app_name: 'linkhut',
    isAvailable: true,
  },
  {
    title: 'Timely',
    description:
      'Timely is an automatic time-tracking platform capturing activity across applications, calendars, and devices, creating detailed timesheets for billing or productivity insights.',
    image: '/assets/apps-logos/timely.png',
    app_name: 'timely',
    isAvailable: true,
  },
  {
    title: 'Todoist',
    description:
      'Todoist is a task management tool allowing users to create to-do lists, set deadlines, and collaborate on projects with reminders and cross-platform syncing.',
    image: '/assets/apps-logos/todoist.svg',
    app_name: 'todoist',
    isAvailable: true,
  },
  {
    title: 'Harvest',
    description:
      'Harvest is a time-tracking and invoicing tool designed for teams and freelancers, helping them log billable hours, manage projects, and streamline payments.',
    image: '/assets/apps-logos/harvest.png',
    app_name: 'harvest',
    isAvailable: true,
  },
  {
    title: 'Google Slides',
    description:
      'Google Slides is a cloud-based presentation editor with real-time collaboration, template gallery, and integration with other Google Workspace apps.',
    image: '/assets/apps-logos/google-slides.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Hubspot',
    description:
      'HubSpot is an inbound marketing, sales, and customer service platform integrating CRM, email automation, and analytics to facilitate lead nurturing and seamless customer experiences.',
    image: '/assets/apps-logos/hubspot.webp',
    app_name: 'hubspot',
    isAvailable: true,
  },
  {
    title: 'Salesforce',
    description:
      'Salesforce is a leading CRM platform integrating sales, service, marketing, and analytics to build customer relationships and drive business growth.',
    image: '/assets/apps-logos/salesforce.svg',
    app_name: 'salesforce',
    isAvailable: true,
  },
  {
    title: 'Apollo',
    description:
      'Apollo provides CRM and lead generation capabilities, helping businesses discover contacts, manage outreach, and track sales pipelines for consistent customer relationship development.',
    image: '/assets/apps-logos/apollo.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Attio',
    description:
      "Attio is a fully customizable workspace for your team's relationships and workflows.",
    image: '/assets/apps-logos/attio.webp',
    app_name: 'attio',
    isAvailable: true,
  },
  {
    title: 'Zoho',
    description:
      'Zoho is a suite of cloud applications including CRM, email marketing, and collaboration tools, enabling businesses to automate and scale operations.',
    image: '/assets/apps-logos/zoho.png',
    app_name: 'zoho',
    isAvailable: true,
  },
  {
    title: 'Freshdesk',
    description:
      'Freshdesk provides customer support software with ticketing, knowledge base, and automation features for efficient helpdesk operations and better customer experiences.',
    image: '/assets/apps-logos/freshdesk.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'AccuLynx',
    description:
      'Using the AccuLynx API, data can be seamlessly exchanged between AccuLynx and other applications for greater efficiency and productivity.',
    image: '/assets/apps-logos/acculynx.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Affinity',
    description:
      'Affinity helps private capital investors to find, manage, and close more deals.',
    image: '/assets/apps-logos/affinity.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'AgencyZoom',
    description:
      "AgencyZoom is for the P&C insurance agent that's looking to increase sales, boost retention and analyze agency & producer performance.",
    image: '/assets/apps-logos/agencyzoom_logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Pipedrive',
    description:
      'Pipedrive is a sales management tool built around pipeline visualization, lead tracking, activity reminders, and automation to keep deals progressing.',
    image: '/assets/apps-logos/pipedrive.svg',
    app_name: 'pipedrive',
    isAvailable: true,
  },
  {
    title: 'Dynamics365',
    description:
      'Dynamics 365 from Microsoft combines CRM, ERP, and productivity apps to streamline sales, marketing, customer service, and operations in one integrated platform.',
    image: '/assets/apps-logos/Dynamics365.svg',
    app_name: 'dynamics365',
    isAvailable: true,
  },
  {
    title: 'Zendesk',
    description:
      'Zendesk provides customer support software with ticketing, live chat, and knowledge base features, enabling efficient helpdesk operations and customer engagement.',
    image: '/assets/apps-logos/zendesk.svg',
    app_name: 'zendesk',
    isAvailable: true,
  },
  {
    title: 'Close',
    description:
      'Close is a CRM platform designed to help businesses manage and streamline their sales processes, including calling, email automation, and predictive dialers.',
    image: '/assets/apps-logos/close-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Simplesat',
    description:
      'Simplesat captures customer feedback and CSAT scores through surveys, integrating directly with helpdesk systems for real-time performance insights.',
    image: '/assets/apps-logos/simplesat.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Zoho Bigin',
    description:
      'Zoho Bigin is a simplified CRM solution from Zoho tailored for small businesses, focusing on pipeline tracking and relationship management.',
    image: '/assets/apps-logos/zoho.png',
    app_name: 'zoho_bigin',
    isAvailable: true,
  },
  {
    title: 'Gorgias',
    description:
      'Gorgias is a helpdesk and live chat platform specializing in e-commerce, offering automated support, order management, and unified customer communication.',
    image: '/assets/apps-logos/gorgias.png',
    app_name: 'gorgias',
    isAvailable: true,
  },
  {
    title: 'Kommo',
    description:
      'Kommo CRM (formerly amoCRM) integration tool for managing customer relationships, sales pipelines, and business processes.',
    image: '/assets/apps-logos/kommo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Zoominfo',
    description:
      "AgencyZoom is for the P&C insurance agent that's looking to increase sales, boost retention and analyze agency & producer performance.",
    image: '/assets/apps-logos/zoominfo.ico',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Intercom',
    description:
      'Intercom provides live chat, messaging, and customer engagement tools, enabling businesses to drive conversions, handle support, and personalize communication at scale.',
    image: '/assets/apps-logos/intercom.svg',
    app_name: 'intercom',
    isAvailable: true,
  },
  {
    title: 'Capsule CRM',
    description:
      'Capsule CRM is a simple yet powerful CRM platform designed to help businesses manage customer relationships, sales pipelines, and tasks efficiently.',
    image: '/assets/apps-logos/capsule_crm-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Fireberry',
    description:
      'Fireberry is a CRM platform that offers integrations with various tools and applications to streamline business processes.',
    image: '/assets/apps-logos/fireberry-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Folk',
    description:
      'folk is a next-generation CRM designed for teams to manage and nurture their relationships efficiently.',
    image: '/assets/apps-logos/folk_round3_20250722.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'JobNimbus',
    description:
      'JobNimbus is a CRM and project management software designed for contractors, helping streamline scheduling, estimates, invoicing, and job tracking.',
    image: '/assets/apps-logos/jobnimbus-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'noCRM.io',
    description:
      'noCRM.io is a lead management software designed to help sales teams track and close deals efficiently.',
    image: '/assets/apps-logos/nocrm_io_round2_20250722.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Salesmate',
    description:
      'Salesmate is an AI-powered CRM platform designed to help businesses engage leads, close deals faster, nurture relationships, and provide seamless support through a unified, intuitive interface.',
    image: '/assets/apps-logos/salesmate-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'SerpApi',
    description:
      'SerpApi provides a real-time API for structured search engine results, allowing developers to scrape, parse, and analyze SERP data for SEO and research.',
    image: '/assets/apps-logos/serpapi.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Firecrawl',
    description:
      'Firecrawl automates web crawling and data extraction, enabling organizations to gather content, index sites, and gain insights from online sources at scale.',
    image: '/assets/apps-logos/firecrawl.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Tavily',
    description:
      'Tavily offers search and data retrieval solutions, helping teams quickly locate and filter relevant information from documents, databases, or web sources.',
    image: '/assets/apps-logos/tavily.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Exa',
    description:
      'Exa focuses on data extraction and search, helping teams gather, analyze, and visualize information from websites, APIs, or internal databases.',
    image: '/assets/apps-logos/exa.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Snowflake',
    description:
      'Snowflake is a cloud-based data warehouse offering elastic scaling, secure data sharing, and SQL analytics across multiple cloud environments.',
    image: '/assets/apps-logos/snowflake.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'PeopleDataLabs',
    description:
      'PeopleDataLabs provides B2B data enrichment and identity resolution, empowering organizations to build enriched user profiles and validate customer information.',
    image: '/assets/apps-logos/pdl.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'PostHog',
    description:
      'PostHog is an open-source product analytics platform tracking user interactions and behaviors to help teams refine features, improve funnels, and reduce churn.',
    image: '/assets/apps-logos/posthog.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Fireflies',
    description:
      'Fireflies.ai helps your team transcribe, summarize, search, and analyze voice conversations.',
    image: '/assets/apps-logos/fireflies.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Mixpanel',
    description:
      'Mixpanel is a product analytics platform tracking user interactions and engagement, providing cohort analysis, funnels, and A/B testing to improve user experiences.',
    image: '/assets/apps-logos/mixpanel.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Amplitude',
    description:
      'Amplitude Inc. is an American publicly trading company that develops digital analytics software.',
    image: '/assets/apps-logos/amplitude.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Google BigQuery',
    description:
      'Google BigQuery is a fully managed data warehouse for large-scale data analytics, offering fast SQL queries and machine learning capabilities on massive datasets.',
    image: '/assets/apps-logos/googl-bigquery.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Microsoft Clarity',
    description:
      'Microsoft Clarity is a free user behavior analytics tool that captures heatmaps, session recordings, and engagement metrics to help improve website experiences.',
    image: '/assets/apps-logos/microsoft-clarity-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Servicenow',
    description:
      'Servicenow provides IT Service Management Transform service management to boost productivity and maximize ROI.',
    image: '/assets/apps-logos/servicenow.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Google Analytics',
    description:
      'Google Analytics tracks and reports website traffic, user behavior, and conversion data, enabling marketers to optimize online performance and customer journeys.',
    image: '/assets/apps-logos/googleanalytics.png',
    app_name: 'google_analytics',
    isAvailable: true,
  },
  {
    title: 'BrowseAI',
    description:
      'Browse.ai allows you to turn any website into an API using its advanced web automation and data extraction tools, enabling easy monitoring and data retrieval from websites.',
    image: '/assets/apps-logos/browseai.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Placekey',
    description:
      'Placekey standardizes location data by assigning unique IDs to physical addresses, simplifying address matching and enabling data sharing across platforms.',
    image: '/assets/apps-logos/placekey.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Kibana',
    description:
      'Kibana is a visualization and analytics platform for Elasticsearch, offering dashboards, data exploration, and monitoring capabilities for gaining insights from data.',
    image: '/assets/apps-logos/kibana.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Jira',
    description:
      'A tool for bug tracking, issue tracking, and agile project management.',
    image: '/assets/apps-logos/jira.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Asana',
    description: 'Tool to help teams organize, track, and manage their work.',
    image: '/assets/apps-logos/asana.png',
    app_name: 'asana',
    isAvailable: true,
  },
  {
    title: 'Bolna',
    description:
      'Create conversational voice agents using Bolna AI to enhance interactions, streamline operations and automate support.',
    image: '/assets/apps-logos/bolna-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Calendar Hero',
    description:
      'Calendar Hero is a versatile scheduling tool designed to streamline and simplify your calendar management. It integrates seamlessly with your existing calendars, allowing you to efficiently schedule, reschedule, and manage meetings with ease.',
    image: '/assets/apps-logos/calendarhero_fixed_20250722.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Google Admin',
    description:
      'Google Admin Console for managing Google Workspace users, groups, and organizational units.',
    image: '/assets/apps-logos/google-admin.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Pushbullet',
    description:
      'Pushbullet enables seamless sharing of notifications and files across devices.',
    image: '/assets/apps-logos/pushbullet_round3_20250722.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'TickTick',
    description:
      'TickTick is a cross-platform task management and to-do list application designed to help users organize their tasks and schedules efficiently.',
    image: '/assets/apps-logos/ticktick.ico',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'YouTube',
    description:
      'YouTube is a video-sharing platform with user-generated content, live streaming, and monetization opportunities, widely used for marketing, education, and entertainment.',
    image: '/assets/apps-logos/youtube.svg',
    app_name: 'youtube',
    isAvailable: true,
  },
  {
    title: 'Spotify',
    description:
      'Spotify is a digital music and podcast streaming service with millions of tracks, personalized playlists, and social sharing features.',
    image: '/assets/apps-logos/spotify-icon.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Canvas',
    description:
      'Canvas is a learning management system supporting online courses, assignments, grading, and collaboration, widely used by schools and universities for virtual classrooms.',
    image: '/assets/apps-logos/canvas.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'D2L Brightspace',
    description:
      'D2L Brightspace is a learning management system that provides a comprehensive suite of tools for educators to create, manage, and deliver online courses and learning experiences.',
    image: '/assets/apps-logos/d2lbrightspace.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Figma',
    description: 'A collaborative interface design tool.',
    image: '/assets/apps-logos/figma.svg',
    app_name: 'figma',
    isAvailable: true,
  },
  {
    title: 'Miro',
    description:
      'Miro is a collaborative online whiteboard enabling teams to brainstorm ideas, design wireframes, plan workflows, and manage projects visually.',
    image: '/assets/apps-logos/miro.svg',
    app_name: 'miro',
    isAvailable: true,
  },
  {
    title: 'Canva',
    description:
      'Canva offers a drag-and-drop design suite for creating social media graphics, presentations, and marketing materials with prebuilt templates and a vast element library.',
    image: '/assets/apps-logos/canva.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Webflow',
    description:
      'Webflow is a no-code website design and hosting platform, letting users build responsive sites, launch online stores, and maintain content without coding.',
    image: '/assets/apps-logos/webflow.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Mural',
    description:
      'Mural is a digital whiteboard platform enabling distributed teams to visually brainstorm, map ideas, and collaborate in real time with sticky notes and diagrams.',
    image: '/assets/apps-logos/mural.svg',
    app_name: 'mural',
    isAvailable: true,
  },
  {
    title: 'Reddit',
    description:
      'Reddit is a social news platform with user-driven communities (subreddits), offering content sharing, discussions, and viral marketing opportunities for brands.',
    image: '/assets/apps-logos/reddit.svg',
    app_name: 'reddit',
    isAvailable: true,
  },
  {
    title: 'Linkedin',
    description:
      'LinkedIn is a professional networking platform enabling job seekers, companies, and thought leaders to connect, share content, and discover business opportunities.',
    image: '/assets/apps-logos/linkedin.svg',
    app_name: 'linkedin',
    isAvailable: true,
  },
  {
    title: 'Twitter Media',
    description:
      'Twitter Media focuses on multimedia tools and features within Twitter, allowing brands to leverage rich content for marketing campaigns.',
    image: '/assets/apps-logos/twitter.png',
    app_name: 'twitter_media',
    isAvailable: true,
  },
  {
    title: 'Klaviyo',
    description:
      'Klaviyo is a data-driven email and SMS marketing platform that allows e-commerce brands to deliver targeted messages, track conversions, and scale customer relationships.',
    image: '/assets/apps-logos/klaviyo.png',
    app_name: 'klaviyo',
    isAvailable: true,
  },
  {
    title: 'Mailchimp',
    description:
      'Mailchimp is an email marketing and automation platform providing campaign templates, audience segmentation, and performance analytics to drive engagement and conversions.',
    image: '/assets/apps-logos/mailchimp.svg',
    app_name: 'mailchimp',
    isAvailable: true,
  },
  {
    title: 'Ahrefs',
    description:
      'Ahrefs is an SEO and marketing platform offering site audits, keyword research, content analysis, and competitive insights to improve search rankings and drive organic traffic.',
    image: '/assets/apps-logos/ahrefs.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'SendGrid',
    description:
      'SendGrid is a cloud-based email delivery platform providing transactional and marketing email services, with APIs for integration, analytics, and scalability.',
    image: '/assets/apps-logos/sendgrid.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Facebook',
    description:
      'Facebook is a social media and advertising platform used by individuals and businesses to connect, share content, and promote products or services.',
    image: '/assets/apps-logos/facebook.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'CrustData',
    description:
      'CrustData is an AI-powered data intelligence platform that provides real-time company and people data via APIs and webhooks, empowering B2B sales teams, AI SDRs, and investors to act on live signals.',
    image: '/assets/apps-logos/crustdata.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Brandfetch',
    description:
      'Brandfetch offers an API that retrieves company logos, brand colors, and other visual assets, helping marketers and developers maintain consistent branding across apps.',
    image: '/assets/apps-logos/brandfetch-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'AMCards',
    description:
      'AMCards enables users to create personalized greeting cards, automate mailing campaigns, strengthen customer relationships using a convenient online platform for individualized connections.',
    image: '/assets/apps-logos/amcards.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'ActiveCampaign',
    description:
      'ActiveCampaign is a marketing automation and CRM platform enabling businesses to manage email campaigns, sales pipelines, and customer segmentation to boost engagement and drive growth.',
    image: '/assets/apps-logos/activecampaign.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Eventbrite',
    description:
      'Eventbrite enables organizers to plan, promote, and manage events, selling tickets and providing attendee tools for conferences, concerts, and gatherings.',
    image: '/assets/apps-logos/eventbrite.svg',
    app_name: 'eventbrite',
    isAvailable: true,
  },
  {
    title: 'Cal',
    description:
      'Cal simplifies meeting coordination by providing shareable booking pages, calendar syncing, and availability management to streamline the scheduling process.',
    image: '/assets/apps-logos/cal-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Calendly',
    description:
      'Calendly is an appointment scheduling tool that automates meeting invitations, availability checks, and reminders, helping individuals and teams avoid email back-and-forth.',
    image: '/assets/apps-logos/calendly.svg',
    app_name: 'calendly',
    isAvailable: true,
  },
  {
    title: 'Apaleo',
    description:
      'Apaleo is a cloud-based property management platform handling reservations, billing, and daily operations for hospitality businesses.',
    image: '/assets/apps-logos/apaleo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Shopify',
    description:
      'Shopify is an e-commerce platform enabling merchants to create online stores, manage products, and process payments with themes, apps, and integrated marketing tools.',
    image: '/assets/apps-logos/shopify.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Jungle Scout',
    description:
      'Jungle Scout assists Amazon sellers with product research, sales estimates, and competitive insights to optimize inventory, pricing, and listing strategies.',
    image: '/assets/apps-logos/junglescout.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Gumroad',
    description:
      'Gumroad simplifies selling digital goods, physical products, and memberships by offering a streamlined checkout, marketing tools, and direct payout options.',
    image: '/assets/apps-logos/gumroad.svg',
    app_name: 'gumroad',
    isAvailable: true,
  },
  {
    title: 'ASIN Data API',
    description:
      'ASIN Data API provides detailed product data from Amazon, including price, rank, reviews, and more, enabling real-time insights for e-commerce professionals, marketers, and data analysts.',
    image: '/assets/apps-logos/asin-data-api.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'BaseLinker',
    description:
      'BaseLinker is a comprehensive e-commerce management platform that integrates with various marketplaces, online stores, carriers, and accounting systems to streamline order processing, inventory management, and sales automation.',
    image: '/assets/apps-logos/baselinker-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Cloud Cart',
    description:
      'Cloud Cart is an e-commerce platform that enables businesses to create and manage online stores efficiently.',
    image: '/assets/apps-logos/cloudcart.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Lemon Squeezy',
    description:
      'Lemon Squeezy is a platform designed to simplify payments, taxes, and subscriptions for software companies, offering a powerful API and webhooks for seamless integration.',
    image: '/assets/apps-logos/lemonsqueezy-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Payhip',
    description:
      'Payhip is an e-commerce platform that enables individuals and businesses to sell digital products, memberships, and physical goods directly to their audience.',
    image: '/assets/apps-logos/payhip-logo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Google Maps',
    description:
      'Integrate Google Maps to access location data, geocoding, directions, and mapping services in your application.',
    image: '/assets/apps-logos/google_maps.jpeg',
    app_name: 'google_maps',
    isAvailable: true,
  },
  {
    title: 'You Search',
    description:
      'You Search is a search engine or search tool that enables users to find relevant information, possibly with enhanced filtering or privacy-focused features.',
    image: '/assets/apps-logos/you.webp',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Linkup',
    description: 'Search the Web for Relevant Results (RAG Use Case).',
    image: '/assets/apps-logos/linkup.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'More Trees',
    description:
      'More Trees is a sustainability-focused platform planting trees on behalf of individuals or businesses aiming to offset carbon footprints and support reforestation.',
    image: '/assets/apps-logos/more-trees.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Yandex',
    description:
      'Yandex is a Russian internet services provider offering search, email, navigation, and other web-based solutions, often referred to as \u201cRussia\u2019s Google\u201d.',
    image: '/assets/apps-logos/yandex.svg',
    app_name: 'yandex',
    isAvailable: true,
  },
  {
    title: 'Tiny URL',
    description:
      'Tiny URL shortens lengthy URLs, generating concise links for easier sharing and managing, often used in social media and marketing campaigns.',
    image: '/assets/apps-logos/tinyurl-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Foursquare',
    description:
      'Search for places and place recommendations from the Foursquare Places database.',
    image: '/assets/apps-logos/foursquare.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Stripe',
    description:
      'Stripe offers online payment infrastructure, fraud prevention, and APIs enabling businesses to accept and manage payments globally.',
    image: '/assets/apps-logos/stripe.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'RecallAI',
    description: 'The universal API for meeting bots & conversation data.',
    image: '/assets/apps-logos/recall.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Xero',
    description:
      'Xero is a cloud-based accounting software for small businesses, providing invoicing, bank reconciliation, bookkeeping, and financial reporting in real time.',
    image: '/assets/apps-logos/xero.svg',
    app_name: 'xero',
    isAvailable: true,
  },
  {
    title: 'Brex',
    description:
      'Brex provides corporate credit cards, spend management, and financial tools tailored for startups and tech businesses to optimize cash flow, accounting, and growth.',
    image: '/assets/apps-logos/brex-staging-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Zoho Invoice',
    description:
      'Zoho Invoice simplifies billing, recurring payments, and expense management, helping freelancers and small businesses send professional invoices.',
    image: '/assets/apps-logos/zoho.png',
    app_name: 'zoho_invoice',
    isAvailable: true,
  },
  {
    title: 'Quickbooks',
    description:
      'Quickbooks is a cloud-based accounting software that helps you manage your finances, track your income and expenses, and get insights into your business.',
    image: '/assets/apps-logos/quickbooks.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Ramp',
    description:
      'Ramp is a platform that helps you manage your finances, track your income and expenses, and get insights into your business.',
    image: '/assets/apps-logos/ramp.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Borneo',
    description:
      'Borneo is a data security and privacy platform designed for sensitive data discovery and remediation.',
    image: '/assets/apps-logos/borneo.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Heygen',
    description:
      'HeyGen is an innovative video platform that harnesses the power of generative AI to streamline your video creation process.',
    image: '/assets/apps-logos/heygen.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Coinbase',
    description:
      'Coinbase is a platform for buying, selling, transferring, and storing cryptocurrency.',
    image: '/assets/apps-logos/coinbase.svg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Coinranking',
    description:
      'Coinranking provides a comprehensive API for accessing cryptocurrency market data, including coin prices, market caps, and historical data.',
    image: '/assets/apps-logos/Coinranking.ico',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Bannerbear',
    description:
      'Bannerbear offers an automated image and video generation API, allowing businesses to create graphics, social media visuals, and marketing collateral with customizable templates at scale.',
    image: '/assets/apps-logos/bannerbear-logo.jpg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Process Street',
    description:
      'Process Street supports creating and running checklists, SOPs, and workflows, helping teams automate recurring processes and track compliance.',
    image: '/assets/apps-logos/process-street-logo.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Workiom',
    description:
      'Workiom allows businesses to create custom workflows, integrate apps, and automate processes, reducing manual overhead and streamlining operations.',
    image: '/assets/apps-logos/workiom.jpeg',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'Formsite',
    description:
      'Formsite helps users create online forms and surveys with drag-and-drop tools, secure data capture, and integrations to simplify workflows.',
    image: '/assets/apps-logos/formsite.png',
    app_name: '',
    isAvailable: false,
  },
  {
    title: 'ServiceM8',
    description:
      'ServiceM8 helps field service businesses schedule jobs, send quotes, and manage invoices, offering staff mobile apps and real-time job status tracking.',
    image: '/assets/apps-logos/servicem8.svg',
    app_name: 'servicem8',
    isAvailable: true,
  },
];

export const toolsNeedsToAdd = [
  'box',
  'confluence',
  'discord',
  'freshbooks',
  'twitter',
  'survey_monkey',
];
