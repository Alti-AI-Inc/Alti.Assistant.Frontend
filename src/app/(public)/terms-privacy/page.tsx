import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

const LAST_UPDATED = 'May 20, 2025';

export default function page() {
  const privacyPolicy = {
    title: 'Privacy Policy',
    intro:
      'This Privacy Policy describes how Alti ("Alti," "we," "us," or "our") collects, uses, stores, shares, and protects information when you access or use our website at altihq.com, our mobile applications, and any related services (collectively, the "Platform"). By using the Platform, you agree to the collection and use of information in accordance with this policy. If you do not agree with this Privacy Policy, please do not use the Platform.',
    sections: [
      {
        heading: '1. Information We Collect',
        content: [
          {
            text: '1.1 Account Registration Information.',
            description:
              'When you create an account, we collect your email address and a password that you choose. Passwords are cryptographically hashed and are never stored in plaintext.',
          },
          {
            text: '1.2 Social Login Information.',
            description:
              'If you choose to register or log in through a third-party authentication provider (Google, Facebook, Apple, Microsoft, GitHub, Discord, or Twitter/X), we receive your name, email address, profile picture, and a unique provider identifier from that service. We do not receive or store your password from these third-party providers.',
          },
          {
            text: '1.3 User-Generated Content.',
            description:
              'We collect and store the conversations, prompts, and messages you exchange with our AI assistants. Conversation data is encrypted at rest using AES-256-CBC encryption. We also collect any files you upload to the Platform, images you generate, knowledge bases you create, and any other content you produce while using the Platform.',
          },
          {
            text: '1.4 Organization and Team Data.',
            description:
              'If you create or join an Organization on the Platform, we collect the organization name, member email addresses, roles, permissions, and invitation data.',
          },
          {
            text: '1.5 Payment Information.',
            description:
              'We use Stripe, Inc. as our payment processor. Your payment card details are collected and processed directly by Stripe. We do not receive, store, or have access to your full credit or debit card numbers.',
          },
          {
            text: '1.6 Usage and Technical Data.',
            description:
              'We automatically collect information about how you use the Platform, including usage metrics, IP address, browser type, device information, and operating system.',
          },
        ],
      },
      {
        heading: '2. How We Use Your Information',
        content: [
          {
            text: '2.1 Providing the Platform.',
            description:
              'We use your information to create and maintain your account, deliver AI-powered features, process your prompts and queries, and provide customer support.',
          },
          {
            text: '2.2 AI Processing.',
            description:
              'To deliver our AI features, your prompts and relevant context are processed exclusively using Google native AI models (Gemini and Imagen) hosted on Google Cloud Platform. Your data is used solely for generating AI responses to your requests. We do not use your data to train AI models.',
          },
          {
            text: '2.3 Communications.',
            description:
              'We use your email address to send essential communications including account verification, password resets, billing receipts, and important service updates.',
          },
          {
            text: '2.4 Security.',
            description:
              'We use your information to protect the Platform against unauthorized access, detect and prevent fraud, and comply with legal obligations.',
          },
        ],
      },
      {
        heading: '3. Data Security',
        content: [
          {
            text: '3.1 Encryption.',
            description:
              'Your conversation data is encrypted at rest using AES-256-CBC. All data in transit is protected using TLS/SSL encryption.',
          },
          {
            text: '3.2 Infrastructure.',
            description:
              'Your data is stored on Google Cloud Platform infrastructure with strict access controls.',
          },
          {
            text: '3.3 Important Clarification.',
            description:
              'Conversations are decrypted server-side when transmitted to Google Cloud APIs for processing. This encryption is not end-to-end in the cryptographic sense.',
          },
        ],
      },
      {
        heading: '4. Third-Party Service Providers',
        content:
          'We share information with third-party providers solely to operate the Platform: payment processing (Stripe), email delivery (Google Workspace SMTP), authentication providers (when using social login), and cloud infrastructure (Google Cloud Platform, MongoDB Atlas). AI model generation, web search grounding, and audio transcriptions are processed exclusively by native Google Cloud and Google APIs. We do not sell your personal information.',
      },
      {
        heading: '5. Your Rights',
        content: [
          {
            text: 'Access and Correction.',
            description:
              'You have the right to access and update your personal information through your account settings.',
          },
          {
            text: 'Deletion.',
            description:
              'You may request deletion of your account and personal data by contacting us at legal@altihq.com. Deletion requests are processed within thirty (30) days.',
          },
          {
            text: 'Jurisdiction-Specific Rights.',
            description:
              'You may have additional rights under CCPA, GDPR, or other applicable laws. Contact us at legal@altihq.com to exercise these rights.',
          },
        ],
      },
      {
        heading: '6. Children\'s Privacy',
        content:
          'The Platform is not intended for individuals under the age of eighteen (18). We do not knowingly collect personal information from children.',
      },
      {
        heading: '7. Changes to This Policy',
        content:
          'We may update this Privacy Policy from time to time. Material changes will be communicated via the Platform or by email.',
      },
      {
        heading: '8. Contact Us',
        content:
          'If you have questions about this Privacy Policy, contact us at: legal@altihq.com, or by mail at: Alti, 280 N Old Woodward, Birmingham, MI 48009.',
      },
    ],
    conclusion: '',
  };

  const termsOfUse = {
    title: 'Terms of Use',
    intro:
      'These Terms of Use ("Terms") govern your access to and use of the Alti platform at altihq.com and all related services. By using the Platform, you agree to be bound by these Terms.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content:
          'By accessing or using the Platform, you agree to be bound by these Terms, our Privacy Policy, and our Cookies Policy. We may modify these Terms at any time; continued use constitutes acceptance.',
      },
      {
        heading: '2. Eligibility',
        content:
          'You must be at least eighteen (18) years of age to use the Platform. If using on behalf of an organization, you represent that you have authority to bind that organization.',
      },
      {
        heading: '3. Account Security',
        content:
          'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately at legal@altihq.com if you suspect unauthorized access.',
      },
      {
        heading: '4. User Conduct',
        content:
          'You agree to use the Platform only for lawful purposes. You must not use the Platform to generate illegal or harmful content, reverse engineer the Platform, infringe on third-party rights, circumvent security features, or resell access without written consent.',
      },
      {
        heading: '5. Intellectual Property',
        content:
          'You retain ownership of your content. You own AI-generated outputs subject to these Terms. The Platform and its underlying technology remain the exclusive property of Alti, protected by intellectual property laws. We do not use your content to train AI models.',
      },
      {
        heading: '6. Subscriptions and Payments',
        content:
          'Paid subscriptions are billed monthly through Stripe on a per-user basis. You may cancel anytime; access continues through the end of the billing period. No refunds for partial periods except where required by law.',
      },
      {
        heading: '7. Disclaimer of Warranties',
        content:
          'THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT AI OUTPUTS WILL BE ACCURATE, COMPLETE, OR SUITABLE FOR ANY PURPOSE. YOU ASSUME ALL RESPONSIBILITY FOR EVALUATING AI-GENERATED CONTENT.',
      },
      {
        heading: '8. Limitation of Liability',
        content:
          'TO THE MAXIMUM EXTENT PERMITTED BY LAW, ALTI SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF THE AMOUNT YOU PAID IN THE PRECEDING TWELVE (12) MONTHS OR ONE HUNDRED DOLLARS ($100).',
      },
      {
        heading: '9. Termination',
        content:
          'We may suspend or terminate your access at any time for violation of these Terms. You may delete your account at any time through your settings.',
      },
      {
        heading: '10. Governing Law',
        content:
          'These Terms are governed by the laws of the State of Michigan. Disputes shall be resolved through binding arbitration in Oakland County, Michigan.',
      },
      {
        heading: '11. Contact',
        content:
          'Questions about these Terms may be directed to: legal@altihq.com, or by mail at: Alti, 280 N Old Woodward, Birmingham, MI 48009.',
      },
    ],
    conclusion: '',
  };

  return (
    <div className="mx-auto mt-4 mb-10 max-w-4xl p-4">
      <Tabs defaultValue="privacyPolicy">
        <TabsList className="mx-auto mb-10 w-[400px]">
          <TabsTrigger className="cursor-pointer" value="privacyPolicy">
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="termsPolicy">
            Terms of Use
          </TabsTrigger>
        </TabsList>
        <TabsContent value="privacyPolicy">
          <h1 className="mb-8 text-center text-4xl font-bold sm:text-5xl">
            Privacy Policy
          </h1>
          <div className="mx-auto max-w-4xl p-5 sm:p-2 md:p-3">
            <p className="mb-2 text-xs text-gray-500">
              Last Updated: {LAST_UPDATED}
            </p>
            <p className="mb-6 text-lg">{privacyPolicy.intro}</p>
            {privacyPolicy.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="dark:text-n-9 mb-4 text-xl font-semibold">
                  {section?.heading}
                </h2>
                {Array.isArray(section?.content) ? (
                  <ul className="mb-4 list-disc pl-6">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="dark:text-n-9 mb-2 text-lg">
                        <strong>{item?.text}</strong> {item?.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="dark:text-n-9 mb-4 text-lg">
                    {section?.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="termsPolicy">
          <h1 className="mb-8 text-center text-4xl font-bold sm:text-5xl">
            Terms of Use
          </h1>
          <div className="p-5 sm:p-2 md:p-3">
            <p className="mb-2 text-xs text-gray-500">
              Last Updated: {LAST_UPDATED}
            </p>
            <p className="mb-6 text-lg">{termsOfUse.intro}</p>
            {termsOfUse.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="dark:text-n-9 mb-4 text-xl font-semibold">
                  {section.heading}
                </h2>
                <p className="dark:text-n-9 mb-4 text-lg">{section.content}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
