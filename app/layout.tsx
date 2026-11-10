import React from 'react';
import JsonLd from '../src/components/JsonLd';
import '../src/index.css';

// Type definitions matching Next.js App Router (next/types)
export interface Viewport {
  themeColor?: Array<{ media: string; color: string }> | string;
  width?: string;
  initialScale?: number;
  maximumScale?: number;
}

export interface Metadata {
  metadataBase?: URL;
  title?: { default: string; template: string } | string;
  description?: string;
  applicationName?: string;
  authors?: Array<{ name: string; url?: string }>;
  generator?: string;
  keywords?: string[];
  creator?: string;
  publisher?: string;
  formatDetection?: Record<string, boolean>;
  alternates?: { canonical: string };
  openGraph?: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{ url: string; width: number; height: number; alt: string }>;
    locale: string;
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator: string;
  };
  robots?: Record<string, any>;
  icons?: Record<string, string>;
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.nextgenevcare.com'),
  title: {
    default: 'Next Gen EV Care | Door-to-Door Electric Scooty & E-Bike Repair in Gujranwala',
    template: '%s | Next Gen EV Care Gujranwala'
  },
  description:
    'Certified on-call doorstep electric scooty, e-bike, and lithium battery repair in Gujranwala. Zero-rewinding hall sensor replacements, active cell balancing, and BLDC controller micro-rework.',
  applicationName: 'Next Gen EV Care',
  authors: [{ name: 'Next Gen EV Care Engineering Team', url: 'https://www.nextgenevcare.com' }],
  generator: 'Next Gen EV Care Platform',
  keywords: [
    'electric scooty repair Gujranwala',
    'door to door EV repair Gujranwala',
    'doorstep scooty mechanic Gujranwala',
    'lithium battery servicing Gujranwala',
    'hall sensor repair electric scooty',
    'no winding motor repair',
    'BLDC controller MOSFET repair',
    'Yadea scooty repair Gujranwala',
    'Metro EV scooty repair',
    'Crown electric scooty mechanic',
    'United electric bike repair',
    'Graphene battery balancing Gujranwala',
    'e-bike doorstep service Gujranwala'
  ],
  creator: 'Next Gen EV Care',
  publisher: 'Next Gen EV Care',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: 'https://www.nextgenevcare.com'
  },
  openGraph: {
    title: 'Next Gen EV Care | Door-to-Door Electric Scooty & E-Bike Repair in Gujranwala',
    description:
      'Expert mobile technicians dispatched to your doorstep in Gujranwala. Zero motor rewinding, certified lithium cell balancing, and BLDC electronics troubleshooting.',
    url: 'https://www.nextgenevcare.com',
    siteName: 'Next Gen EV Care',
    images: [
      {
        url: 'https://www.nextgenevcare.com/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png',
        width: 1200,
        height: 630,
        alt: 'Next Gen EV Care - Mobile EV Scooty Workshop in Gujranwala'
      }
    ],
    locale: 'en_PK',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next Gen EV Care | Mobile Electric Scooty Repair in Gujranwala',
    description:
      'Certified door-to-door electric scooty and lithium battery repair in Gujranwala. 85% of issues resolved right on your driveway.',
    images: [
      'https://www.nextgenevcare.com/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png'
    ],
    creator: '@nextgenevcare'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png',
    shortcut: '/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png',
    apple: '/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Inject Schema.org JSON-LD Structured Data for AI & Search Recognition */}
        <JsonLd />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
