import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpacesLayout from '@/components/sidebars/SpacesLayout';

export const dynamic = 'force-dynamic';

const LAST_UPDATED = 'May 20, 2025';

export default function page() {
  const privacyPolicy = {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy describes how Inso AI ("Inso AI," "we," "us," or "our") collects, uses, stores, shares, and protects information when you access or use our website at insoai.com, our mobile applications, and any related services (collectively, the "Platform"). By using the Platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with this Privacy Policy, please do not use the Platform.',
    sections: [
      {
        heading: '1. Information We Collect',
        content: [
          {
            text: '1.1 Account Registration Information.',
            description:
              'When you create an account, we collect your email address and a password that you choose. Passwords are cryptographically hashed using bcrypt and are never stored in plaintext.',
          },
          {
            text: '1.2 Social Login Information.',
            description:
              'If you choose to register or log in through a third-party authentication provider (Google, Facebook, Apple, Microsoft, GitHub, Discord, or Twitter/X), we receive your name, email address, profile picture, and a unique provider identifier from that service. We do not receive or store your password from these third-party providers.',
          },
          {
            text: '1.3 User-Generated Content.',
            description:
              'We collect and store the conversations, prompts, and messages you exchange with our AI assistants. Conversation titles and message contents are encrypted at rest using AES-256-CBC encryption. We also collect any files you upload to the Platform (including but not limited to PDF, DOCX, XLSX, PPTX, CSV, TXT, JSON, XML, HTML, and Markdown files), images you generate, knowledge bases you create, notes, and any other content you produce while using the Platform.',
          },
          {
            text: '1.4 Organization and Team Data.',
            description:
              'If you create or join an Organization on the Platform, we collect the organization name, member email addresses, roles, permissions, and invitation data. Content created within an Organization (conversations, knowledge bases, and files) may be accessible to other authorized members of that Organization based on configured permissions.',
          },
          {
            text: '1.5 Payment Information.',
            description:
              'We use Stripe, Inc. as our payment processor. When you subscribe to a paid plan, your payment card details are collected and processed directly by Stripe. We do not receive, store, or have access to your full credit or debit card numbers. We retain only your Stripe customer identifier, subscription plan details, and billing history for account management purposes.',
          },
          {
            text: '1.6 Usage and Technical Data.',
            description:
              'We automatically collect information about how you use the Platform, including the number of prompts and requests you make, AI models selected, features accessed, file storage usage, and timestamps of your interactions. We also collect standard technical data such as your IP address, browser type, device information, operating system, and referring URLs.',
          },
          {
            text: '1.7 Communication Data.',
            description:
              'If you contact us through our contact form or support channels, we collect your name, email address, and the content of your communication.',
          },
        ],
      },
      {
        heading: '2. How We Use Your Information',
        content: [
          {
            text: '2.1 Providing and Operating the Platform.',
            description:
              'We use your information to create and maintain your account, authenticate your identity, deliver AI-powered features, process your prompts and queries, store your conversations and files, manage your Organization, and provide customer support.',
          },
          {
            text: '2.2 AI Processing.',
            description:
              'To deliver our AI features, your prompts, messages, and relevant context (such as documents in your knowledge base) are processed exclusively using Google native AI models (Gemini and Imagen) hosted on Google Cloud Platform. Your data is transmitted to Google APIs solely for the purpose of generating AI responses to your requests. Please see Section 4 (Third-Party Service Providers) for more details.',
          },
          {
            text: '2.3 Search and Research Features.',
            description:
              'When you use search-enabled or research features, your queries may be transmitted to Google Custom Search and Live Web Grounding to retrieve relevant web results.',
          },
          {
            text: '2.4 Billing and Payments.',
            description:
              'We use Stripe to process subscription payments, manage seat-based billing for Organizations, issue invoices, and handle payment-related communications.',
          },
          {
            text: '2.5 Transactional Communications.',
            description:
              'We use your email address to send you essential communications including account verification emails, password reset requests, Organization invitation notifications, billing receipts, and important service updates. These transactional emails are sent via Google Workspace SMTP.',
          },
          {
            text: '2.6 Security and Fraud Prevention.',
            description:
              'We use your information to protect the Platform against unauthorized access, detect and prevent fraud, enforce rate limits, and comply with our legal obligations.',
          },
          {
            text: '2.7 Service Improvement.',
            description:
              'We may use aggregated, anonymized, and de-identified data to analyze usage patterns, improve Platform performance, and develop new features. We do not use your personal conversations or uploaded files to train AI models.',
          },
        ],
      },
      {
        heading: '3. Data Storage and Security',
        content: [
          {
            text: '3.1 Encryption at Rest.',
            description:
              'Your conversation titles and message contents are encrypted at rest using AES-256-CBC encryption. Passwords are hashed using bcrypt.',
          },
          {
            text: '3.2 Encryption in Transit.',
            description:
              'All data transmitted between your device and our servers is protected using TLS/SSL encryption. Our servers enforce HTTPS for all connections.',
          },
          {
            text: '3.3 Cloud Infrastructure.',
            description:
              'Your data is stored on servers hosted on Google Cloud Platform (GCP) infrastructure. Uploaded files are stored in Google Cloud Storage. Our database services include MongoDB Atlas (user and conversation data), PostgreSQL (knowledge base embeddings and retrieval-augmented generation data), Redis (caching and session management), and Qdrant (vector search).',
          },
          {
            text: '3.4 Access Controls.',
            description:
              'We implement strict role-based access controls, use HTTP security headers (via Helmet), enforce rate limiting on API requests, and restrict cross-origin access to authorized domains. Administrative access to production systems is limited to authorized personnel.',
          },
          {
            text: '3.5 Important Clarification Regarding Encryption.',
            description:
              'While your conversations are encrypted at rest in our database, they must be decrypted server-side when you access them and when they are transmitted to third-party AI providers for processing. This means the encryption is not end-to-end in the cryptographic sense — our servers do have the ability to decrypt your conversations to deliver the service. We take this responsibility seriously and implement robust server-side security measures to protect your data during processing.',
          },
        ],
      },
      {
        heading: '4. Third-Party Service Providers',
        content: (
          <>
            <p className="mb-4">
              We share your information with the following categories of
              third-party service providers, solely to the extent necessary to
              operate the Platform. We do not sell your personal information to
              any third party.
            </p>
            <ul className="mb-4 list-disc space-y-3 pl-6">
              <li>
                <strong>AI Model Providers:</strong> Google (Gemini and Imagen)
                receives your prompts and relevant context to generate AI responses. All 
                AI models are hosted exclusively on Google Cloud Platform. We configure our 
                usage to request that the models do not use your data for training.
              </li>
              <li>
                <strong>Payment Processing:</strong> Stripe, Inc. processes all
                payment transactions and is PCI-DSS Level 1 certified.
              </li>
              <li>
                <strong>Email Services:</strong> Google Workspace SMTP is used
                to deliver transactional emails on our behalf.
              </li>
              <li>
                <strong>Authentication Providers:</strong> If you use social
                login, the respective provider (Google, Facebook, Apple,
                Microsoft, GitHub, Discord, or Twitter/X) facilitates
                authentication.
              </li>
              <li>
                <strong>Cloud Infrastructure:</strong> Google Cloud Platform
                provides hosting, storage, document processing (Document AI), and
                translation services. MongoDB Atlas provides database hosting.
              </li>
              <li>
                <strong>Search Services:</strong> Google Custom Search and
                Live Web Grounding process search queries when you use research
                and web search features.
              </li>
              <li>
                <strong>External Integrations (Optional):</strong> If you choose
                to connect third-party services through our integration features
                (such as Gmail, GitHub, Slack, or Salesforce via Composio), data
                will be shared with those services according to the permissions
                you grant. These connections are entirely optional and
                user-initiated.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: '5. Data Retention',
        content:
          'We retain your personal information and user-generated content for as long as your account remains active. If you delete your account, we will delete or anonymize your personal data within thirty (30) days, except where we are required to retain certain information by law (for example, transaction records for tax purposes). Shared conversations remain accessible via their share links until they expire or are deactivated by the original creator. Backup copies of your data may persist in our backup systems for up to ninety (90) days after deletion.',
      },
      {
        heading: '6. Your Rights and Choices',
        content: [
          {
            text: '6.1 Access and Portability.',
            description:
              'You have the right to access the personal information we hold about you. You can view and update your profile information at any time through your account settings.',
          },
          {
            text: '6.2 Correction.',
            description:
              'You have the right to request correction of any inaccurate personal information we maintain about you.',
          },
          {
            text: '6.3 Deletion.',
            description:
              'You may request the deletion of your account and personal data by using the account deletion feature in your settings or by contacting us at legal@insoai.com. We will process deletion requests within thirty (30) days.',
          },
          {
            text: '6.4 Opt-Out of Communications.',
            description:
              'You may opt out of receiving promotional emails by following the unsubscribe instructions in those emails. You cannot opt out of transactional communications that are essential to your use of the Platform (such as password resets and billing notices).',
          },
          {
            text: '6.5 Cookie Preferences.',
            description:
              'You can manage your cookie preferences through your browser settings. Please see our Cookies Policy for more details.',
          },
          {
            text: '6.6 Rights Under Specific Jurisdictions.',
            description:
              'Depending on your location, you may have additional rights under laws such as the California Consumer Privacy Act (CCPA), the General Data Protection Regulation (GDPR), or other applicable data protection laws. These may include the right to object to processing, the right to restrict processing, and the right to lodge a complaint with a supervisory authority. To exercise any of these rights, please contact us at legal@insoai.com.',
          },
        ],
      },
      {
        heading: '7. Children\'s Privacy',
        content:
          'The Platform is not intended for individuals under the age of eighteen (18). We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly. If you believe a child has provided us with personal information, please contact us at legal@insoai.com.',
      },
      {
        heading: '8. International Data Transfers',
        content:
          'Our servers and service providers are located in the United States. If you access the Platform from outside the United States, your information will be transferred to and processed in the United States. By using the Platform, you consent to the transfer of your information to the United States, which may have data protection laws that differ from those in your jurisdiction.',
      },
      {
        heading: '9. Changes to This Privacy Policy',
        content:
          'We may update this Privacy Policy from time to time. If we make material changes, we will notify you by posting the updated policy on the Platform with a revised "Last Updated" date, and where required by law, we will provide additional notice (such as via email). Your continued use of the Platform after such changes constitutes your acceptance of the updated Privacy Policy.',
      },
      {
        heading: '10. Contact Us',
        content:
          'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at: legal@insoai.com, or by mail at: Inso AI, 280 N Old Woodward, Birmingham, MI 48009.',
      },
    ],
    conclusion: '',
  };

  const terms = {
    title: 'Terms of Use',
    intro:
      'These Terms of Use ("Terms") constitute a legally binding agreement between you ("you," "your," or "User") and Inso AI ("Inso AI," "we," "us," or "our") governing your access to and use of the Platform at insoai.com, our mobile applications, and all related services (collectively, the "Platform"). By creating an account or using the Platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use the Platform.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content:
          'By accessing, browsing, or using the Platform in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and our Cookies Policy, all of which are incorporated herein by reference. We reserve the right to modify these Terms at any time. Material changes will be communicated via the Platform or by email. Your continued use of the Platform following such modifications constitutes your acceptance of the revised Terms.',
      },
      {
        heading: '2. Eligibility',
        content:
          'You must be at least eighteen (18) years of age and have the legal capacity to enter into a binding agreement to use the Platform. By using the Platform, you represent and warrant that you meet these eligibility requirements. If you are using the Platform on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.',
      },
      {
        heading: '3. Account Registration and Security',
        content:
          'To access certain features of the Platform, you must create an account by providing a valid email address and creating a password, or by authenticating through a supported third-party provider (Google, Facebook, Apple, Microsoft, GitHub, Discord, or Twitter/X). You are responsible for maintaining the confidentiality of your account credentials, for all activities that occur under your account, and for notifying us immediately at legal@insoai.com if you suspect any unauthorized use of your account. We reserve the right to suspend or terminate accounts that we reasonably believe have been compromised.',
      },
      {
        heading: '4. Description of the Platform',
        content:
          'Inso AI is an AI-powered productivity and intelligence platform that provides access to advanced artificial intelligence capabilities including, but not limited to, conversational AI chat, deep research, web search, image and video generation, audio transcription, code generation, writing and editing tools, legal contract review, presentation creation, report generation, knowledge base management with retrieval-augmented generation (RAG), and third-party integrations. The Platform routes and processes your requests exclusively using Google native AI models (Gemini and Imagen) hosted on Google Cloud Platform to deliver responses.',
      },
      {
        heading: '5. Subscription Plans and Payments',
        content: (
          <>
            <p className="mb-3">
              <strong>5.1 Plans.</strong> The Platform offers both free and paid
              subscription plans. Free plans are subject to daily usage limits.
              Paid plans (Explore, Execute, and Command) offer increased usage
              limits, storage capacity, and team collaboration features. Details
              of current plans and pricing are available on our pricing page.
            </p>
            <p className="mb-3">
              <strong>5.2 Billing.</strong> Paid subscriptions are billed on a
              monthly, per-user basis through Stripe. By subscribing to a paid
              plan, you authorize us to charge the payment method on file for the
              recurring subscription fee. Organization plans support seat-based
              billing, and adding or removing seats will be prorated
              accordingly.
            </p>
            <p className="mb-3">
              <strong>5.3 Cancellation and Refunds.</strong> You may cancel your
              subscription at any time through your account settings. Upon
              cancellation, your subscription will remain active until the end of
              the current billing period. We do not provide refunds for partial
              billing periods, except where required by applicable law.
            </p>
            <p>
              <strong>5.4 Free Plan Limitations.</strong> Free plan users are
              subject to a daily request limit (currently ten (10) requests per
              day) and may have limited access to certain features, models, and
              storage capacity. We reserve the right to modify free plan
              limitations at any time.
            </p>
          </>
        ),
      },
      {
        heading: '6. User Conduct and Acceptable Use',
        content: (
          <>
            <p className="mb-3">
              You agree to use the Platform only for lawful purposes and in
              compliance with all applicable local, state, national, and
              international laws and regulations. You shall not:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Use the Platform to generate, store, or distribute content that
                is illegal, harmful, threatening, abusive, harassing,
                defamatory, obscene, or otherwise objectionable;
              </li>
              <li>
                Attempt to reverse engineer, decompile, disassemble, or
                otherwise derive the source code of the Platform;
              </li>
              <li>
                Use the Platform to infringe upon the intellectual property
                rights, privacy rights, or other rights of any third party;
              </li>
              <li>
                Circumvent, disable, or otherwise interfere with any
                security-related features of the Platform, including rate limits
                and access controls;
              </li>
              <li>
                Use automated scripts, bots, or other means to access the
                Platform in a manner that exceeds reasonable use or circumvents
                usage limits;
              </li>
              <li>
                Resell, sublicense, or commercially redistribute access to the
                Platform or any AI-generated output without our prior written
                consent;
              </li>
              <li>
                Use the Platform to develop competing AI products or services by
                systematically extracting model outputs;
              </li>
              <li>
                Upload files that contain malware, viruses, or other malicious
                code;
              </li>
              <li>
                Impersonate any person or entity, or misrepresent your
                affiliation with any person or entity.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: '7. User Content and Intellectual Property',
        content: (
          <>
            <p className="mb-3">
              <strong>7.1 Your Content.</strong> You retain all ownership rights
              in the content you create, upload, or input into the Platform
              ("User Content"), including your prompts, uploaded documents, and
              knowledge bases. By using the Platform, you grant us a limited,
              non-exclusive, worldwide license to use, process, store, and
              transmit your User Content solely for the purpose of operating and
              providing the Platform to you.
            </p>
            <p className="mb-3">
              <strong>7.2 AI-Generated Output.</strong> Subject to these Terms
              and applicable law, you own the output generated by the AI in
              response to your prompts ("Output"). You acknowledge that AI
              outputs may not be unique and that other users providing similar
              prompts may receive similar or identical outputs. We make no
              representations regarding the accuracy, completeness, or
              originality of any Output.
            </p>
            <p className="mb-3">
              <strong>7.3 No Training on Your Data.</strong> We do not use your
              User Content or personal conversations to train, fine-tune, or
              improve AI models. Your data is processed by third-party AI
              providers solely to generate responses to your requests, subject to
              each provider&apos;s data processing terms.
            </p>
            <p>
              <strong>7.4 Platform Intellectual Property.</strong> The Platform,
              including its design, software, features, branding, logos,
              documentation, and all underlying technology, is and remains the
              exclusive property of Inso AI and is protected by United States and
              international intellectual property laws, including copyright,
              trademark, patent, and trade secret laws.
            </p>
          </>
        ),
      },
      {
        heading: '8. Organizations and Team Features',
        content:
          'If you create or administer an Organization on the Platform, you are responsible for managing member access, permissions, and roles within that Organization. Organization owners and administrators may have the ability to view, manage, and delete content created by Organization members within the Organization scope. Members should be aware that content created in an Organization context may be visible to other authorized members. The Organization owner is responsible for ensuring that all members comply with these Terms.',
      },
      {
        heading: '9. Shared Content',
        content:
          'The Platform allows you to share conversations via shareable links. When you share a conversation, you acknowledge that anyone with the link may be able to view the shared content. You are solely responsible for the content you choose to share and for revoking access when appropriate. We are not responsible for any consequences arising from your decision to share content publicly.',
      },
      {
        heading: '10. Third-Party Integrations',
        content:
          'The Platform may offer the ability to connect to third-party services (such as Gmail, GitHub, Slack, and Salesforce) through integration features. These connections are optional and user-initiated. When you authorize a third-party integration, data may flow between the Platform and the third-party service in accordance with the permissions you grant. We are not responsible for the privacy or security practices of third-party services you choose to integrate. Your use of those services is governed by their respective terms and privacy policies.',
      },
      {
        heading: '11. Disclaimer of Warranties',
        content:
          'THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ALTI DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ACCURACY. WE DO NOT WARRANT THAT (A) THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS; (B) AI-GENERATED OUTPUTS WILL BE ACCURATE, COMPLETE, RELIABLE, OR SUITABLE FOR ANY PARTICULAR PURPOSE; (C) ANY DEFECTS OR ERRORS WILL BE CORRECTED; OR (D) THE PLATFORM WILL MEET YOUR SPECIFIC REQUIREMENTS. YOU ACKNOWLEDGE THAT AI-GENERATED CONTENT MAY CONTAIN ERRORS, HALLUCINATIONS, OR INACCURACIES, AND YOU ASSUME ALL RESPONSIBILITY FOR EVALUATING AND RELYING UPON SUCH CONTENT.',
      },
      {
        heading: '12. Limitation of Liability',
        content:
          'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ALTI, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES (INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES) ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE PLATFORM, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100).',
      },
      {
        heading: '13. Indemnification',
        content:
          'You agree to indemnify, defend, and hold harmless Inso AI and its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys\' fees) arising out of or relating to: (a) your use of the Platform; (b) your User Content; (c) your violation of these Terms; (d) your violation of any applicable law or regulation; or (e) your violation of any rights of a third party.',
      },
      {
        heading: '14. Termination',
        content:
          'We reserve the right to suspend or terminate your access to the Platform at any time and for any reason, including but not limited to a violation of these Terms, at our sole discretion and without prior notice or liability. You may terminate your account at any time by using the account deletion feature in your settings. Upon termination, your right to use the Platform ceases immediately, and we may delete your data in accordance with our Privacy Policy.',
      },
      {
        heading: '15. Dispute Resolution',
        content:
          'Any dispute, claim, or controversy arising out of or relating to these Terms or the Platform shall first be resolved through good-faith negotiation between the parties. If the parties are unable to resolve the dispute within thirty (30) days of written notice, either party may pursue resolution through binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, conducted in Oakland County, Michigan. You agree to waive your right to a jury trial and to participate in a class action lawsuit or class-wide arbitration.',
      },
      {
        heading: '16. Governing Law',
        content:
          'These Terms shall be governed by and construed in accordance with the laws of the State of Michigan, without regard to its conflict of laws principles. Any legal proceedings that are not subject to arbitration shall be brought exclusively in the state or federal courts located in Oakland County, Michigan, and you consent to the personal jurisdiction of such courts.',
      },
      {
        heading: '17. Severability',
        content:
          'If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable.',
      },
      {
        heading: '18. Entire Agreement',
        content:
          'These Terms, together with our Privacy Policy and Cookies Policy, constitute the entire agreement between you and Inso AI regarding your use of the Platform and supersede all prior and contemporaneous agreements, representations, and understandings, whether written or oral.',
      },
      {
        heading: '19. Contact Information',
        content:
          'If you have any questions about these Terms of Use, please contact us at: legal@insoai.com, or by mail at: Inso AI, 280 N Old Woodward, Birmingham, MI 48009.',
      },
    ],
    conclusion: '',
  };

  const cookiesPolicy = {
    title: 'Cookies Policy',
    intro:
      'This Cookies Policy explains how Inso AI ("Inso AI," "we," "us," or "our") uses cookies and similar technologies when you use our Platform at insoai.com and our mobile applications. This policy should be read in conjunction with our Privacy Policy and Terms of Use.',
    sections: [
      {
        heading: '1. What Are Cookies?',
        content:
          'Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website or use an application. Cookies are widely used to make websites and applications function properly, improve performance, and provide information to website operators. Similar technologies include local storage, session storage, and web beacons, which serve comparable purposes.',
      },
      {
        heading: '2. Cookies We Use',
        content: (
          <ul className="ml-6 list-inside list-decimal space-y-4">
            <li>
              <span className="font-semibold">
                Strictly Necessary (Authentication) Cookies.
              </span>{' '}
              These cookies are essential for the operation of the Platform. They
              enable you to log in, maintain your authenticated session, and
              navigate securely between pages. Without these cookies, the
              Platform cannot function. These include:
              <ul className="ml-6 mt-2 list-disc space-y-1">
                <li>
                  <strong>Session Token Cookie</strong> — Set by our
                  authentication system (NextAuth) to maintain your login
                  session. This cookie contains an encrypted JSON Web Token (JWT)
                  with your session identifier and expiry information. It expires
                  after seven (7) days of inactivity.
                </li>
                <li>
                  <strong>Refresh Token Cookie</strong> — A secure, HTTP-only
                  cookie used to refresh your authentication session without
                  requiring you to log in again. This cookie has a maximum
                  lifetime of three hundred sixty-five (365) days.
                </li>
                <li>
                  <strong>CSRF Protection Cookie</strong> — Used to prevent
                  cross-site request forgery attacks and ensure the security of
                  form submissions and API requests.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Functional Cookies.</span> These
              cookies enable enhanced functionality and personalization, such as
              remembering your preferred AI model selection, sidebar
              preferences, theme settings (light or dark mode), and selected
              Organization context. If you disable these cookies, some features
              may not function as intended.
            </li>
            <li>
              <span className="font-semibold">
                Payment Processing Cookies.
              </span>{' '}
              When you access payment or billing features, our payment processor
              Stripe may set cookies that are necessary to process transactions
              securely, detect fraud, and comply with financial regulations.
              These cookies are governed by{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Stripe&apos;s Privacy Policy
              </a>
              .
            </li>
          </ul>
        ),
      },
      {
        heading: '3. Cookies We Do Not Use',
        content:
          'We do not use advertising or tracking cookies. We do not use third-party analytics services (such as Google Analytics or Mixpanel) that set cookies to track your browsing behavior across websites. We do not engage in behavioral advertising or sell cookie data to third parties. We do not use social media tracking pixels or cookies.',
      },
      {
        heading: '4. Third-Party Cookies',
        content:
          'Aside from the Stripe payment processing cookies described above, we do not allow third parties to set cookies through our Platform. If you use social login (Google, Facebook, Apple, Microsoft, GitHub, Discord, or Twitter/X), the authentication process occurs on the third-party provider\'s domain. Any cookies set during that process are governed by the respective provider\'s cookie and privacy policies and are not set on our domain.',
      },
      {
        heading: '5. Managing Your Cookie Preferences',
        content: (
          <>
            <p className="mb-3">
              You can control and manage cookies through your browser settings.
              Most browsers allow you to:
            </p>
            <ul className="mb-3 list-disc space-y-2 pl-6">
              <li>View what cookies are set on your device;</li>
              <li>Delete all or specific cookies;</li>
              <li>
                Block cookies from all sites or specific sites;
              </li>
              <li>Block third-party cookies;</li>
              <li>Accept or reject cookies on a case-by-case basis.</li>
            </ul>
            <p className="mb-3">
              <strong>Important:</strong> If you disable or delete strictly
              necessary cookies, you will not be able to log in to or use the
              Platform, as these cookies are required for authentication and
              session management.
            </p>
            <p>
              For more information about managing cookies, visit{' '}
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                www.aboutcookies.org
              </a>{' '}
              or{' '}
              <a
                href="https://www.allaboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                www.allaboutcookies.org
              </a>
              .
            </p>
          </>
        ),
      },
      {
        heading: '6. Data Retention for Cookies',
        content:
          'Session cookies are automatically deleted when you close your browser. Persistent cookies (such as the refresh token cookie) remain on your device until they expire or you manually delete them. Our authentication session token expires after seven (7) days, and our refresh token cookie has a maximum lifetime of three hundred sixty-five (365) days.',
      },
      {
        heading: '7. Updates to This Cookies Policy',
        content:
          'We may update this Cookies Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. If we make material changes, we will update the "Last Updated" date at the top of this page and, where appropriate, notify you via the Platform or by email.',
      },
      {
        heading: '8. Contact Us',
        content:
          'If you have any questions about our use of cookies or this Cookies Policy, please contact us at: legal@insoai.com, or by mail at: Inso AI, 280 N Old Woodward, Birmingham, MI 48009.',
      },
    ],
    conclusion: '',
  };

  return (
    <SpacesLayout showColumnPanels={false}>
      <Tabs defaultValue="privacyPolicy" className="h-full flex flex-col gap-0 bg-[#e1e1e1] dark:bg-gray-955 overflow-hidden">
        {/* Dynamic Header */}
        <div className="h-[52px] border-b border-black/10 dark:border-white/10 flex items-center justify-between px-8 flex-none bg-white dark:bg-gray-950">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">
            Legal Documents
          </h1>
          <TabsList className="bg-white dark:bg-zinc-800 p-[3px] rounded-lg h-9 border border-black/10 dark:border-white/10 shadow-xs">
            <TabsTrigger
              className="cursor-pointer px-4 text-xs data-[state=active]:bg-[#e1e1e1] dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-xs transition-all duration-200"
              value="privacyPolicy"
            >
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer px-4 text-xs data-[state=active]:bg-[#e1e1e1] dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-xs transition-all duration-200"
              value="termsOfUsage"
            >
              Terms of Use
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer px-4 text-xs data-[state=active]:bg-[#e1e1e1] dark:data-[state=active]:bg-zinc-700 data-[state=active]:text-black dark:data-[state=active]:text-white data-[state=active]:shadow-xs transition-all duration-200"
              value="cookiesPolicy"
            >
              Cookies Policy
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Main Workspace Body */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-6">
          <div className="mx-auto max-w-5xl px-4 pb-10">
            {/* Privacy Policy */}
            <TabsContent value="privacyPolicy">
              <div className="mx-auto rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100">
                <p className="mb-2 text-xs text-gray-500 dark:text-zinc-500">
                  Last Updated: {LAST_UPDATED}
                </p>
                <p className="mb-6 leading-relaxed">{privacyPolicy.intro}</p>
                {privacyPolicy.sections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h2 className="mb-3 text-lg font-semibold sm:text-xl text-gray-900 dark:text-white">
                      {section.heading}
                    </h2>
                    {Array.isArray(section.content) ? (
                      <ul className="mb-4 list-disc space-y-2 pl-6">
                        {section.content.map((item, idx) => (
                          <li key={idx}>
                            <strong>{item.text}</strong> {item.description}
                          </li>
                        ))}
                      </ul>
                    ) : typeof section.content === 'string' ? (
                      <p className="mb-4 leading-relaxed">{section.content}</p>
                    ) : (
                      <div className="mb-4 leading-relaxed">{section.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Terms of Use */}
            <TabsContent value="termsOfUsage">
              <div className="mx-auto rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100">
                <p className="mb-2 text-xs text-gray-500 dark:text-zinc-500">
                  Last Updated: {LAST_UPDATED}
                </p>
                <p className="mb-6 leading-relaxed">{terms.intro}</p>
                {terms.sections.map((section, index) => (
                  <div key={index} className="mb-5">
                    <h2 className="mb-2 text-lg font-semibold sm:text-xl text-gray-900 dark:text-white">
                      {section.heading}
                    </h2>
                    {typeof section.content === 'string' ? (
                      <p className="leading-relaxed">{section.content}</p>
                    ) : (
                      <div className="leading-relaxed">{section.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Cookies Policy */}
            <TabsContent value="cookiesPolicy">
              <div className="mx-auto rounded-lg text-sm sm:text-base text-gray-900 dark:text-zinc-100">
                <p className="mb-2 text-xs text-gray-500 dark:text-zinc-500">
                  Last Updated: {LAST_UPDATED}
                </p>
                <p className="mb-6 leading-relaxed">{cookiesPolicy.intro}</p>
                {cookiesPolicy.sections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h2 className="mb-3 text-lg font-semibold sm:text-xl text-gray-900 dark:text-white">
                      {section.heading}
                    </h2>
                    {typeof section.content === 'string' ? (
                      <p className="leading-relaxed">{section.content}</p>
                    ) : (
                      <div className="leading-relaxed">{section.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </SpacesLayout>
  );
}
