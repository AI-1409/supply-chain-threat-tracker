import type { Metadata } from 'next';
import { Source_Sans_3, Space_Grotesk } from 'next/font/google';
import './globals.css';

// Distinctive Display Font
const displayFont = Space_Grotesk({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-display',
});

// Refined Body Font
const bodyFont = Source_Sans_3({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Supply Chain Threat Tracker',
  description: 'Monitor and track security threats across software supply chains',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="terracotta"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
