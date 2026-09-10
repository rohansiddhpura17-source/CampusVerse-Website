import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/providers/query-provider';
import { AuthProvider } from '@/lib/context/auth-context';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: {
    default: 'CampusVerse — Unified Campus Academic & Career Ecosystem',
    template: '%s | CampusVerse',
  },
  description:
    'Empowering university students, prospective aspirants, alumni networks, and campus administrators on a single connected platform.',
  keywords: ['CampusVerse', 'university', 'students', 'alumni', 'aspirants', 'career', 'mentorship'],
  metadataBase: new URL('https://campusverse.edu'),
  openGraph: {
    title: 'CampusVerse — Unified Campus Academic & Career Ecosystem',
    description:
      'Empowering university students, prospective aspirants, alumni networks, and campus administrators on a single connected platform.',
    url: 'https://campusverse.edu',
    siteName: 'CampusVerse',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusVerse — Unified Campus Academic & Career Ecosystem',
    description:
      'Empowering university students, prospective aspirants, alumni networks, and campus administrators on a single connected platform.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col font-sans">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
