import { ModalProvider } from '@/components/modals/ModalProvider';
import Providers from '@/components/Providers';
import type { Metadata, Viewport } from 'next';
import { Exo_2 } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistExo2 = Exo_2({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: 'Aphura',
  description: 'Aphura',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistExo2.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <ModalProvider />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
