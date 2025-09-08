import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

export default function page() {
  const privacyPolicy = {
    title: 'Privacy Policy',
    intro: '',
    sections: [
      {
        heading: '1. Information We Collect',
        content: [
          {
            text: 'Registration Information:',
            description:
              'When you create an account with inso, we collect your email address and a password of your choice.',
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
              'We use your email address and password to create and maintain your inso account, allowing you to securely access our services.',
          },
          {
            text: 'Communication:',
            description:
              'We may use your email address to send you important updates, notifications, and promotional messages related to inso. You can opt-out of receiving promotional emails at any time.',
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
              'You have the right to access and update your personal information at any time by logging into your inso account.',
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
      'By using inso, you consent to the collection and use of your personal information as described in this Privacy Policy.',
  };

  const termsOfUse = {
    title: 'Terms of Use',
    intro: '',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content:
          'By accessing or using the inso website or mobile app, you agree to be bound by these Terms of Use and our Privacy Policy.',
      },
      {
        heading: '2. User Conduct',
        content:
          'You agree to use inso only for lawful purposes and in compliance with all applicable laws and regulations. You must not use our services to create, store, or share any content that is illegal, harmful, or infringes upon the rights of others.',
      },
      {
        heading: '3. Intellectual Property',
        content:
          'inso and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.',
      },
      {
        heading: '4. Disclaimer of Warranties',
        content:
          'inso is provided on an "as is" and "as available" basis. We do not guarantee that our services will be uninterrupted, error-free, or completely secure.',
      },
      {
        heading: '5. Limitation of Liability',
        content:
          'To the fullest extent permitted by law, inso shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.',
      },
      {
        heading: '6. Termination',
        content:
          'We reserve the right to terminate or suspend your access to inso at any time and without prior notice if we believe you have violated these Terms of Use.',
      },
      {
        heading: '7. Governing Law',
        content:
          'These Terms of Use shall be governed by and construed in accordance with the laws of Oakland County, Michigan.',
      },
    ],
    conclusion:
      'By using inso, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.',
  };

  return (
    <div className="mx-auto mt-4 mb-10 w-4xl p-4">
      <Tabs defaultValue="privacyPolicy">
        <TabsList className="mx-auto mb-10 w-[400px]">
          <TabsTrigger className="cursor-pointer" value="privacyPolicy">
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="termsPolicy">
            Terms Policy
          </TabsTrigger>
        </TabsList>
        <TabsContent value="privacyPolicy">
          <h1 className="mb-8 text-center text-6xl">Privacy Policy</h1>
          <div className="mx-auto w-4xl p-5 sm:p-2 md:p-3">
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
            <p className="dark:text-n-9 mt-6 text-left text-lg">
              {privacyPolicy?.conclusion}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="termsPolicy">
          <h1 className="mb-8 text-center text-6xl">Terms Policy</h1>
          <div className="p-5 sm:p-2 md:p-3">
            {termsOfUse.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h2 className="dark:text-n-9 mb-4 text-xl font-semibold">
                  {section.heading}
                </h2>
                <p className="dark:text-n-9 mb-4 text-lg">{section.content}</p>
              </div>
            ))}
            <p className="dark:text-n-9 mt-6 text-left text-lg">
              {termsOfUse?.conclusion}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
