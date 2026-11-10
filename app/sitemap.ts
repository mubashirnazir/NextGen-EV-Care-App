import { getSitemapEntries } from '../src/utils/sitemap';

export interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Standard Next.js App Router Sitemap Metadata Handler
 * Automatically served at /sitemap.xml by Next.js
 */
export default function sitemap(): SitemapEntry[] {
  const entries = getSitemapEntries();

  return entries.map((entry) => ({
    url: entry.loc,
    lastModified: entry.lastmod,
    changeFrequency: entry.changefreq,
    priority: entry.priority
  }));
}
