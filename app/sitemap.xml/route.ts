import { generateSitemapXml } from '../../src/utils/sitemap';

/**
 * Next.js App Router Route Handler for /sitemap.xml
 */
export async function GET() {
  const xml = generateSitemapXml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
}
