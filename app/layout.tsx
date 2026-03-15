import type { Metadata, Viewport } from 'next';
import { Fraunces, Space_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0c0b09',
};

export const metadata: Metadata = {
  title: {
    default: 'MultiModal Agent',
    template: '%s | MultiModal AI',
  },
  description:
    'An advanced AI agent capable of analyzing images and PDF documents in real-time.',
  keywords: ['AI', 'Multimodal', 'GPT-4o', 'Vision', 'PDF Analysis', 'Next.js'],
  authors: [{ name: 'sheygs' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${spaceMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
