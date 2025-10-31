import { ModalProvider } from '@/components/modals/ModalProvider';
import Providers from '@/components/Providers';
import type { Metadata } from 'next';
import { Exo_2 } from 'next/font/google';
import './globals.css';

const geistExo2 = Exo_2({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Alti',
  description: 'Alti',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistExo2.variable} antialiased`}>
        <Providers>
          {children}
          <ModalProvider />
        </Providers>
      </body>
    </html>
  );
}
