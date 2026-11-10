import { INITIAL_PORTFOLIO, INITIAL_BLOGS } from '../data/initialData';
import { SITE_ORIGIN } from './seo';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

/**
 * Returns an array of dynamic sitemap URLs for all pages, services, and portfolio case studies
 */
export function getSitemapEntries(): SitemapUrlEntry[] {
  const today = new Date().toISOString().split('T')[0];

  // 1. Primary Sections
  const coreSections: SitemapUrlEntry[] = [
    {
      loc: `${SITE_ORIGIN}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${SITE_ORIGIN}/#services`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${SITE_ORIGIN}/#calculator`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${SITE_ORIGIN}/#portfolio`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${SITE_ORIGIN}/#blog`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${SITE_ORIGIN}/#faq`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${SITE_ORIGIN}/#about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${SITE_ORIGIN}/#contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.9
    }
  ];

  // 2. Dynamic Portfolio Case Studies
  const portfolioEntries: SitemapUrlEntry[] = INITIAL_PORTFOLIO.map((project) => ({
    loc: `${SITE_ORIGIN}/#portfolio?id=${encodeURIComponent(project.id)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.8
  }));

  // 3. Dynamic Technical Articles & Maintenance Guides
  const blogEntries: SitemapUrlEntry[] = INITIAL_BLOGS.map((post) => ({
    loc: `${SITE_ORIGIN}/#blog?slug=${encodeURIComponent(post.slug)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.8
  }));

  return [...coreSections, ...portfolioEntries, ...blogEntries];
}

/**
 * Generates formatted sitemap.xml XML string
 */
export function generateSitemapXml(): string {
  const entries = getSitemapEntries();

  const xmlUrls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}
