import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function page() {
  const privacyPolicy = {
    title: 'Privacy Policy for "chat alti"',
    intro:
      'At chat alti, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide when using our website and mobile app.',
    sections: [
      {
        heading: '1. Information We Collect',
        content: [
          {
            text: 'Registration Information:',
            description:
              'When you create an account with chat alti, we collect your email address and a password of your choice.',
          },
          {
            text: 'User Interactions:',
            description:
              'We may store the conversations you have with our AI to improve our services and provide a better user experience. However, all conversations are encrypted end-to-end, and only you have access to the content. We cannot read your messages.',
          },
        ],
      },
      {
        heading: '2. How We Use Your Information',
        content: [
          {
            text: 'Account Creation:',
            description:
              'We use your email address and password to create and maintain your chat alti account, allowing you to securely access our services.',
          },
          {
            text: 'Communication:',
            description:
              'We may use your email address to send you important updates, notifications, and promotional messages related to chat alti. You can opt-out of receiving promotional emails at any time.',
          },
        ],
      },
      {
        heading: '3. Data Security',
        content: [
          {
            text: 'Encryption:',
            description:
              'All data transmitted between your device and our servers is encrypted end-to-end using industry-standard encryption protocols.',
          },
          {
            text: 'Secure Storage:',
            description:
              'We store your personal information on private and secure servers and implement strict access controls to prevent unauthorized access.',
          },
          {
            text: 'No Third-Party Access:',
            description:
              'We do not share your personal information with any third parties, except when required by law or to comply with legal processes.',
          },
        ],
      },
      {
        heading: '4. Your Rights',
        content: [
          {
            text: 'Access and Rectification:',
            description:
              'You have the right to access and update your personal information at any time by logging into your chat alti account.',
          },
          {
            text: 'Data Deletion:',
            description:
              'You may request the deletion of your personal information and account by contacting our support team.',
          },
        ],
      },
      {
        heading: '5. Changes to the Privacy Policy',
        content:
          'We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or through our website and mobile app.',
      },
    ],
    conclusion:
      'By using chat alti, you consent to the collection and use of your personal information as described in this Privacy Policy.',
  };

  const terms = {
    title: 'Terms of Use for "chat alti"',
    intro:
      'By accessing or using the chat alti website or mobile app, you agree to be bound by these Terms of Use and our Privacy Policy.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content:
          'By accessing or using the chat alti website or mobile app, you agree to be bound by these Terms of Use and our Privacy Policy.',
      },
      {
        heading: '2. User Conduct',
        content:
          'You agree to use chat alti only for lawful purposes and in compliance with all applicable laws and regulations. You must not use our services to create, store, or share any content that is illegal, harmful, or infringes upon the rights of others.',
      },
      {
        heading: '3. Intellectual Property',
        content:
          'chat alti and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.',
      },
      {
        heading: '4. Disclaimer of Warranties',
        content:
          'chat alti is provided on an "as is" and "as available" basis. We do not guarantee that our services will be uninterrupted, error-free, or completely secure.',
      },
      {
        heading: '5. Limitation of Liability',
        content:
          'To the fullest extent permitted by law, chat alti shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.',
      },
      {
        heading: '6. Termination',
        content:
          'We reserve the right to terminate or suspend your access to chat alti at any time and without prior notice if we believe you have violated these Terms of Use.',
      },
      {
        heading: '7. Governing Law',
        content:
          'These Terms of Use shall be governed by and construed in accordance with the laws of Oakland County, Michigan.',
      },
    ],
    conclusion:
      'By using chat alti, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.',
  };

  const cookiesPolicy = {
    title: 'Chat Alti Cookies Policy',
    intro:
      'At chat alti, we strive to be transparent about how we collect and use data. This Cookies Policy explains how we use cookies and similar technologies when you access our website or mobile application. This policy should be read alongside our Privacy Policy and Terms of Use.',
    sections: [
      {
        heading: '1. What are Cookies?',
        content:
          'Cookies are small text files that are placed on your device when you visit a website or use an application. They are widely used to make websites and applications work more efficiently and to provide information to the owners of the site or app.',
      },
      {
        heading: '2. How We Use Cookies',
        content: (
          <ul className="ml-6 list-inside list-decimal space-y-2">
            <li>
              <span className="font-semibold">Essential Cookies:</span> These
              cookies are necessary for the website to function properly. They
              enable core functionality such as security, network management,
              and accessibility.
            </li>
            <li>
              <span className="font-semibold">Functional Cookies:</span> These
              cookies enable us to provide enhanced functionality and
              personalization. They may be set by us or by third-party providers
              whose services we have added to our pages.
            </li>
            <li>
              <span className="font-semibold">
                Analytical/Performance Cookies:
              </span>{' '}
              These cookies allow us to recognize and count the number of
              visitors and to see how visitors move around our website when they
              are using it. This helps us to improve the way our services work,
              for example, by ensuring that users are finding what they are
              looking for easily.
            </li>
            <li>
              <span className="font-semibold">User Interaction Cookies:</span>{' '}
              As mentioned in our Privacy Policy, we may store conversations you
              have with our AI to comply with global laws and regulations. These
              interactions are encrypted end-to-end, and only you have access to
              the content.
            </li>
          </ul>
        ),
      },
      {
        heading: '3. Your Choices Regarding Cookies',
        content: `Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit www.aboutcookies.org or www.allaboutcookies.org. Please note that disabling certain cookies may impact the functionality of our website.`,
      },
      {
        heading: '4. Changes to Our Cookies Policy',
        content:
          'We may update this Cookies Policy from time to time. We will notify you of any significant changes via email or through our website, as outlined in our Privacy Policy.',
      },
      {
        heading: '5. Contact Us',
        content:
          'If you have any questions about our use of cookies or this Cookies Policy, please contact our support team. By continuing to use chat alti, you consent to the use of cookies as described in this policy.',
      },
    ],
    conclusion:
      'By continuing to use chat alti, you consent to the use of cookies as described in this policy.',
  };

  return (
    <Tabs defaultValue="privacyPolicy" className="mx-auto max-w-5xl px-4 pb-10">
      {/* Sticky header with scrollable tab list */}
      <div className="sticky top-0 z-10 bg-white pt-6">
        <TabsList className="mx-auto mb-6 flex w-full max-w-full overflow-x-auto sm:grid sm:w-[600px] sm:grid-cols-3">
          <TabsTrigger className="md:min-w-[150px] flex-1 cursor-pointer" value="privacyPolicy">
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger className="md:min-w-[150px] flex-1 cursor-pointer" value="termsOfUsage">
            Terms of Use
          </TabsTrigger>
          <TabsTrigger className="md:min-w-[150px] flex-1 cursor-pointer" value="cookiesPolicy">
            Cookies Policy
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Privacy Policy */}
      <TabsContent value="privacyPolicy">
        <div className="mx-auto rounded-lg text-sm sm:text-base">
          <p className="mb-4">{privacyPolicy.intro}</p>
          {privacyPolicy.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="mb-3 text-lg font-semibold sm:text-xl">{section.heading}</h2>
              {Array.isArray(section.content) ? (
                <ul className="mb-4 list-disc pl-6 space-y-2">
                  {section.content.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.text}</strong> {item.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-4">{section.content}</p>
              )}
            </div>
          ))}
          <p className="mt-6">{privacyPolicy.conclusion}</p>
        </div>
      </TabsContent>

      {/* Terms of Use */}
      <TabsContent value="termsOfUsage">
        <div className="mx-auto rounded-lg text-sm sm:text-base">
          <p className="mb-4">{terms?.intro}</p>
          {terms.sections.map((section, index) => (
            <div key={index} className="mb-5">
              <h2 className="mb-2 text-lg font-semibold sm:text-xl">{section?.heading}</h2>
              <p>{section?.content}</p>
            </div>
          ))}
          <p className="mt-6">{terms?.conclusion}</p>
        </div>
      </TabsContent>

      {/* Cookies Policy */}
      <TabsContent value="cookiesPolicy">
        <div className="mx-auto rounded-lg text-sm sm:text-base">
          <p className="mb-4">{cookiesPolicy?.intro}</p>
          {cookiesPolicy.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="mb-3 text-lg font-semibold sm:text-xl">{section?.heading}</h2>
              <div>{section?.content}</div>
            </div>
          ))}
          <p className="mt-6 font-medium">{cookiesPolicy?.conclusion}</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
