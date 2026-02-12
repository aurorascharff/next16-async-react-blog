import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';

import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  description:
    'The In-Between States: loading screens, errors, and pending states. Async React patterns with Next.js 16 for designing great UX in the moments between user action and final render.',
  title: 'The In-Between States | Next.js 16',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body className={`${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <main>{children}</main>
          <ThemeToggle />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
