import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Exo_2 } from 'next/font/google';
import './globals.css';

const geistExo2 = Exo_2({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Chat Alti',
  description: 'Chat Alti',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistExo2.variable} bg-secondary antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
