import { PortfolioItem, BlogPost } from '../types';

export const SITE_ORIGIN = 'https://www.nextgenevcare.com';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png`;

export interface DynamicOgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface ServiceMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  images?: string[];
  vehicleModel?: string;
  publishedTime?: string;
  type?: 'website' | 'article';
  keywords?: string[];
}

/**
 * Normalizes any relative or absolute image path to a full canonical URL
 */
export function buildAbsoluteUrl(urlOrPath?: string | null): string {
  if (!urlOrPath || !urlOrPath.trim()) {
    return DEFAULT_OG_IMAGE;
  }
  const clean = urlOrPath.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('/')) {
    return `${SITE_ORIGIN}${clean}`;
  }
  return `${SITE_ORIGIN}/${clean}`;
}

/**
 * Extracts and formats the primary OpenGraph preview image for a specific Case Study / Project
 */
export function getProjectOgImage(project: Partial<PortfolioItem>): DynamicOgImage {
  // Use first image in gallery, or primary image, or fallback
  const candidate = (project.images && project.images.length > 0)
    ? project.images[0]
    : project.image;

  return {
    url: buildAbsoluteUrl(candidate),
    width: 1200,
    height: 630,
    alt: project.title ? `${project.title} - ${project.vehicleModel || 'Next Gen EV Care'}` : 'Next Gen EV Care Case Study Preview'
  };
}

/**
 * Extracts and formats the primary OpenGraph preview image for a Technical Article / Guide
 */
export function getArticleOgImage(post: Partial<BlogPost>): DynamicOgImage {
  const candidate = (post.images && post.images.length > 0)
    ? post.images[0]
    : post.image;

  return {
    url: buildAbsoluteUrl(candidate),
    width: 1200,
    height: 630,
    alt: post.title || 'Next Gen EV Care Technical Guide'
  };
}

/**
 * Generates dynamic OpenGraph and Twitter metadata object matching Next.js App Router Metadata specs
 */
export function generateServiceMetadata({
  title,
  description,
  path = '',
  image,
  images,
  vehicleModel,
  publishedTime,
  type = 'website',
  keywords = []
}: ServiceMetadataOptions) {
  const canonicalUrl = path.startsWith('http') ? path : `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
  
  // Pick primary image
  const primaryImgUrl = images && images.length > 0 
    ? buildAbsoluteUrl(images[0]) 
    : buildAbsoluteUrl(image);

  const formattedTitle = title.includes('Next Gen EV Care') 
    ? title 
    : `${title} | Next Gen EV Care Gujranwala`;

  const ogImages: DynamicOgImage[] = [
    {
      url: primaryImgUrl,
      width: 1200,
      height: 630,
      alt: vehicleModel ? `${title} (${vehicleModel})` : title
    }
  ];

  // If multiple images are provided, include secondary image previews
  if (images && images.length > 1) {
    images.slice(1, 4).forEach((img, idx) => {
      ogImages.push({
        url: buildAbsoluteUrl(img),
        width: 1200,
        height: 630,
        alt: `${title} - Detail Photo ${idx + 2}`
      });
    });
  }

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: formattedTitle,
    description,
    keywords: [
      ...keywords,
      'electric scooty repair Gujranwala',
      'EV repair doorstep',
      'lithium battery service',
      'hall sensor replacement'
    ],
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: formattedTitle,
      description,
      url: canonicalUrl,
      siteName: 'Next Gen EV Care',
      images: ogImages,
      locale: 'en_PK',
      type
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description,
      images: [primaryImgUrl],
      creator: '@nextgenevcare'
    }
  };
}

/**
 * Client-Side Utility: Dynamically updates the HTML document <head> OpenGraph & Twitter tags
 * Ensures shared URLs and previews in WhatsApp, Telegram, Facebook, and Twitter reflect the selected item
 */
export function updateDocumentOpenGraph({
  title,
  description,
  path = '',
  image,
  images
}: ServiceMetadataOptions): void {
  if (typeof document === 'undefined') return;

  const primaryImgUrl = images && images.length > 0 
    ? buildAbsoluteUrl(images[0]) 
    : buildAbsoluteUrl(image);

  const canonicalUrl = path.startsWith('http') ? path : `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
  const formattedTitle = title.includes('Next Gen EV Care') ? title : `${title} | Next Gen EV Care`;

  // Update Document Title
  document.title = formattedTitle;

  // Helper to set or create meta tag
  const setMeta = (attribute: string, attrValue: string, content: string) => {
    let tag = document.querySelector(`meta[${attribute}="${attrValue}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, attrValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Helper to set canonical link
  const setCanonical = (href: string) => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  };

  // Standard Meta
  setMeta('name', 'description', description);
  setCanonical(canonicalUrl);

  // OpenGraph Tags
  setMeta('property', 'og:title', formattedTitle);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:image', primaryImgUrl);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:alt', formattedTitle);

  // Twitter Card Tags
  setMeta('name', 'twitter:title', formattedTitle);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', primaryImgUrl);
  setMeta('name', 'twitter:card', 'summary_large_image');
}
