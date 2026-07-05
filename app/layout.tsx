/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navigation from "@/components/Navigation";
import { DynamicTitle } from "@/components/ui/DynamicTitle";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ankush.dev'),
  title: 'Ankush Singh Rawat | Software Developer',
  description: 'Portfolio of Ankush Singh Rawat - Software Developer specializing in building robust applications, AI integration, and aesthetic user experiences.',
  icons: {
    icon: '/images/logo.webp'
  },
  openGraph: {
    title: 'Ankush Singh Rawat | Software Developer',
    description: 'Portfolio of Ankush Singh Rawat - Software Developer specializing in building robust applications, AI integration, and aesthetic user experiences.',
    url: 'https://ankush.dev',
    siteName: 'Ankush Singh Rawat Portfolio',
    images: [
      {
        url: '/images/logo.webp', // Ideally, an absolute URL to a generated OG image
        width: 1200,
        height: 630,
        alt: 'Ankush Singh Rawat | Software Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased relative`}>
        <Providers>
          <DynamicTitle />
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
