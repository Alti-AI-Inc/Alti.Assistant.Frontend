import { ModalProvider } from '@/components/modals/ModalProvider';
import Providers from '@/components/Providers';
import { DesktopStatusBadge } from '@/components/DesktopStatusBadge';
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
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e1e1e1' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://aphura.ai'),
  title: {
    default: 'Aphura — Sovereign Data Intelligence Engine',
    template: '%s | Aphura',
  },
  description:
    "The world's most powerful sovereign data intelligence engine. Real-time neural search, 45 autonomous tools, direct government data moats, and high-velocity reasoning.",
  keywords: [
    'Sovereign AI',
    'Data Intelligence',
    'Real-time Search',
    'Autonomous Tools',
    'Exa Neural Search',
    'Composio Connectors',
    'LangGraph',
    'Together AI',
    'Deep Research',
  ],
  authors: [{ name: 'Aphura AI Inc' }],
  creator: 'Aphura AI Inc',
  publisher: 'Aphura AI Inc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aphura.ai',
    siteName: 'Aphura AI',
    title: 'Aphura — Sovereign Data Intelligence Engine',
    description:
      "The world's most powerful sovereign data intelligence engine. Real-time neural search, 45 autonomous tools, direct government data moats, and high-velocity reasoning.",
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'Aphura Sovereign Intelligence Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aphura — Sovereign Data Intelligence Engine',
    description:
      "The world's most powerful sovereign data intelligence engine. Real-time neural search, 45 autonomous tools, direct government data moats, and high-velocity reasoning.",
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
          <DesktopStatusBadge />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
