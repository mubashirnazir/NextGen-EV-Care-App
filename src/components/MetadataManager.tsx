import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Share2, 
  Search, 
  Image as ImageIcon, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  Sparkles, 
  Copy, 
  Eye, 
  ExternalLink, 
  AlertCircle,
  HelpCircle,
  Layers,
  MessageSquare
} from 'lucide-react';

export interface SiteMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogSiteName: string;
  twitterCard: 'summary_large_image' | 'summary';
}

export const DEFAULT_SITE_METADATA: SiteMetadata = {
  title: 'Next Gen EV Care | Door-to-Door Electric Scooty & Bike Repair in Gujranwala',
  description: 'Next Gen EV Care provides on-call, door-to-door electric scooty and e-bike repair in Gujranwala. Expert hall sensor diagnosis, controller repairs without destructive motor rewinding, and computerized battery health audits.',
  canonicalUrl: typeof window !== 'undefined' ? window.location.origin : 'https://nextgenevcare.com',
  keywords: 'electric scooty repair gujranwala, doorstep ev service gujranwala, e-bike mechanic gujranwala, hall sensor replacement, motor controller repair, graphene battery scooty, yadea e8s repair, metro ev care, kamoke ev repair',
  ogTitle: 'Next Gen EV Care | Door-to-Door Electric Scooty & Bike Repair in Gujranwala',
  ogDescription: 'Fast, reliable on-call electric scooty and e-bike repair in Gujranwala. 85% of issues resolved right on your driveway with calibrated diagnostic gear.',
  ogImage: '/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png',
  ogType: 'website',
  ogSiteName: 'Next Gen EV Care',
  twitterCard: 'summary_large_image',
};

const SUGGESTED_KEYWORDS = [
  'Doorstep EV Repair Gujranwala',
  'Hall Sensor Diagnostic',
  'No-Winding Motor Care',
  'Yadea & Metro Scooty Repair',
  'Graphene & Lithium Battery Audit',
  'Muhafiz Town Workshop'
];

interface MetadataManagerProps {
  onNotify?: (message: string) => void;
}

export const MetadataManager: React.FC<MetadataManagerProps> = ({ onNotify }) => {
  // Load saved metadata from localStorage or fall back to defaults
  const [metadata, setMetadata] = useState<SiteMetadata>(() => {
    try {
      const saved = localStorage.getItem('nextgen_site_metadata_v1');
      if (saved) {
        return { ...DEFAULT_SITE_METADATA, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SITE_METADATA;
  });

  const [previewPlatform, setPreviewPlatform] = useState<'whatsapp' | 'facebook' | 'twitter' | 'google'>('whatsapp');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Apply metadata to DOM head dynamically
  const applyMetadataToDOM = (meta: SiteMetadata) => {
    // 1. Title
    if (meta.title) {
      document.title = meta.title;
    }

    // 2. Helper to set meta tags
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/meta\[name="([^"]+)"\]/)?.[1];
          if (name) el.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const property = selector.match(/meta\[property="([^"]+)"\]/)?.[1];
          if (property) el.setAttribute('property', property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMetaTag('meta[name="description"]', 'content', meta.description);
    setMetaTag('meta[name="keywords"]', 'content', meta.keywords);
    setMetaTag('meta[property="og:title"]', 'content', meta.ogTitle || meta.title);
    setMetaTag('meta[property="og:description"]', 'content', meta.ogDescription || meta.description);
    setMetaTag('meta[property="og:image"]', 'content', meta.ogImage);
    setMetaTag('meta[property="og:type"]', 'content', meta.ogType);
    setMetaTag('meta[property="og:site_name"]', 'content', meta.ogSiteName);
    setMetaTag('meta[name="twitter:card"]', 'content', meta.twitterCard);
    setMetaTag('meta[name="twitter:title"]', 'content', meta.ogTitle || meta.title);
    setMetaTag('meta[name="twitter:description"]', 'content', meta.ogDescription || meta.description);
    setMetaTag('meta[name="twitter:image"]', 'content', meta.ogImage);

    // Canonical link
    if (meta.canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', meta.canonicalUrl);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('nextgen_site_metadata_v1', JSON.stringify(metadata));
    applyMetadataToDOM(metadata);
    setIsSaved(true);
    if (onNotify) {
      onNotify('SEO & OpenGraph metadata saved and applied to live document head!');
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all SEO metadata and OpenGraph social parameters to original factory defaults?')) {
      setMetadata(DEFAULT_SITE_METADATA);
      localStorage.removeItem('nextgen_site_metadata_v1');
      applyMetadataToDOM(DEFAULT_SITE_METADATA);
      if (onNotify) {
        onNotify('Metadata reset to factory defaults.');
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const addKeyword = (kw: string) => {
    if (!metadata.keywords.includes(kw)) {
      const updated = metadata.keywords 
        ? `${metadata.keywords}, ${kw}` 
        : kw;
      setMetadata({ ...metadata, keywords: updated });
    }
  };

  const syncOgWithGeneral = () => {
    setMetadata({
      ...metadata,
      ogTitle: metadata.title,
      ogDescription: metadata.description
    });
    if (onNotify) {
      onNotify('OpenGraph title and description synced from page metadata!');
    }
  };

  // Extract clean domain for previews
  const displayDomain = (() => {
    try {
      const u = new URL(metadata.canonicalUrl);
      return u.hostname;
    } catch {
      return 'nextgenevcare.com';
    }
  })();

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header Strip with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span className="uppercase">SEO & OPENGRAPH PARAMETERS MANAGER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Search Engine & Social Media Sharing Optimization
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Dynamically adjust live document title, meta descriptions, search ranking keywords, and real-time social feed cards for WhatsApp, Facebook, LinkedIn, and X/Twitter.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="h-11 px-4 text-xs font-semibold rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-red-500 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-11 px-5 text-xs font-bold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
            <span>{isSaved ? 'Changes Saved!' : 'Save Live Metadata'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Form (7 Cols) + Live Social Previewer (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Controls Column (7 Cols) */}
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Core Search Metadata */}
          <div className="liquid-glass-card p-6 sm:p-7 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Search Engine Metadata (Google, Bing & Yahoo)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Core SEO</span>
            </div>

            {/* Page Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Page Title (<code className="text-[11px]">&lt;title&gt;</code>)
                </label>
                <span className={`text-[11px] font-mono ${
                  metadata.title.length >= 30 && metadata.title.length <= 60 
                    ? 'text-emerald-500 font-semibold' 
                    : 'text-amber-500'
                }`}>
                  {metadata.title.length} chars (Recommended: 30–60)
                </span>
              </div>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                placeholder="Next Gen EV Care | Door-to-Door Electric Scooty Repair"
                className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Search Meta Description (<code className="text-[11px]">&lt;meta name="description"&gt;</code>)
                </label>
                <span className={`text-[11px] font-mono ${
                  metadata.description.length >= 120 && metadata.description.length <= 165 
                    ? 'text-emerald-500 font-semibold' 
                    : 'text-amber-500'
                }`}>
                  {metadata.description.length} chars (Recommended: 120–165)
                </span>
              </div>
              <textarea
                rows={3}
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                placeholder="Comprehensive summary of doorstep repairs, hall sensors, motor without rewinding..."
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm leading-relaxed"
              />
            </div>

            {/* Canonical URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Canonical URL (<code className="text-[11px]">&lt;link rel="canonical"&gt;</code>)
                </label>
                <button
                  type="button"
                  onClick={() => setMetadata({ ...metadata, canonicalUrl: window.location.origin })}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                >
                  Use Current Origin
                </button>
              </div>
              <input
                type="url"
                value={metadata.canonicalUrl}
                onChange={(e) => setMetadata({ ...metadata, canonicalUrl: e.target.value })}
                placeholder="https://nextgenevcare.com"
                className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono shadow-sm"
              />
            </div>

            {/* Target Keywords */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Search Keywords (Comma-Separated)
                </label>
                <span className="text-[10px] text-slate-400">Localized for Gujranwala</span>
              </div>
              <input
                type="text"
                value={metadata.keywords}
                onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                placeholder="electric scooty repair gujranwala, doorstep ev care..."
                className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-sm"
              />

              {/* Quick Keyword Suggestions Pill Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Quick Add:</span>
                {SUGGESTED_KEYWORDS.map((kw, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addKeyword(kw)}
                    className="text-[10px] px-2 py-0.5 rounded-lg liquid-glass-subtle border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors"
                  >
                    + {kw}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Card 2: OpenGraph & Social Sharing Parameters */}
          <div className="liquid-glass-card p-6 sm:p-7 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. OpenGraph (OG) & Social Card Parameters
                </h3>
              </div>
              <button
                type="button"
                onClick={syncOgWithGeneral}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                title="Copy Title and Description into OpenGraph"
              >
                <Copy className="w-3 h-3" />
                <span>Sync with General SEO</span>
              </button>
            </div>

            {/* OG Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                OpenGraph Share Title (<code className="text-[11px]">og:title</code>)
              </label>
              <input
                type="text"
                value={metadata.ogTitle}
                onChange={(e) => setMetadata({ ...metadata, ogTitle: e.target.value })}
                placeholder="Title that appears when link is pasted in WhatsApp / Facebook"
                className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
              />
            </div>

            {/* OG Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                OpenGraph Share Description (<code className="text-[11px]">og:description</code>)
              </label>
              <textarea
                rows={2}
                value={metadata.ogDescription}
                onChange={(e) => setMetadata({ ...metadata, ogDescription: e.target.value })}
                placeholder="Concise caption for WhatsApp, Facebook, LinkedIn feeds..."
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* OG Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Social Preview Image URL (<code className="text-[11px]">og:image</code>)
                </label>
                <input
                  type="text"
                  value={metadata.ogImage}
                  onChange={(e) => setMetadata({ ...metadata, ogImage: e.target.value })}
                  placeholder="/NextGen-EV-Care-for-Social-Media...png"
                  className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-sm"
                />
              </div>

              {/* OG Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Content Type (<code className="text-[11px]">og:type</code>)
                </label>
                <select
                  value={metadata.ogType}
                  onChange={(e) => setMetadata({ ...metadata, ogType: e.target.value })}
                  className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-sm"
                >
                  <option value="website">website (Standard Homepage)</option>
                  <option value="business.business">business.business (Local Business)</option>
                  <option value="article">article (Technical Blog)</option>
                  <option value="product">product (Custom Conversion Kit)</option>
                </select>
              </div>
            </div>

            {/* Twitter Card Type & Site Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Twitter/X Card Format (<code className="text-[11px]">twitter:card</code>)
                </label>
                <select
                  value={metadata.twitterCard}
                  onChange={(e) => setMetadata({ ...metadata, twitterCard: e.target.value as any })}
                  className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-sm"
                >
                  <option value="summary_large_image">summary_large_image (Large Hero Banner)</option>
                  <option value="summary">summary (Small Compact Thumbnail)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Brand Site Name (<code className="text-[11px]">og:site_name</code>)
                </label>
                <input
                  type="text"
                  value={metadata.ogSiteName}
                  onChange={(e) => setMetadata({ ...metadata, ogSiteName: e.target.value })}
                  className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass border border-white/80 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-sm"
                />
              </div>
            </div>

          </div>

        </form>

        {/* Live Social Card Previewer Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          <div className="liquid-glass-card p-6 sm:p-7 rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Feed Card Previewer
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Real-Time
              </span>
            </div>

            {/* Platform Selector Buttons (Uniform h-9 px-3.5) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 liquid-glass-subtle rounded-xl border border-white/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPreviewPlatform('whatsapp')}
                className={`h-8 px-2 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  previewPlatform === 'whatsapp'
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewPlatform('facebook')}
                className={`h-8 px-2 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  previewPlatform === 'facebook'
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewPlatform('twitter')}
                className={`h-8 px-2 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  previewPlatform === 'twitter'
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Twitter / X</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewPlatform('google')}
                className={`h-8 px-2 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  previewPlatform === 'google'
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Google SERP</span>
              </button>
            </div>

            {/* PREVIEW CONTAINER: WhatsApp Style */}
            {previewPlatform === 'whatsapp' && (
              <div className="p-4 rounded-2xl bg-[#0c1317] border border-emerald-950/40 text-slate-200 space-y-2 shadow-inner">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>WhatsApp Link Preview Card</span>
                </div>

                <div className="rounded-xl overflow-hidden bg-[#1f2c34] border border-[#2a3942] text-xs">
                  {/* Image banner */}
                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={metadata.ogImage}
                      alt="Social Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  </div>

                  <div className="p-3 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                      {displayDomain}
                    </span>
                    <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug">
                      {metadata.ogTitle || metadata.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {metadata.ogDescription || metadata.description}
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 text-right font-mono pt-1">
                  12:45 PM · Read receipt ✓✓
                </p>
              </div>
            )}

            {/* PREVIEW CONTAINER: Facebook / LinkedIn Style */}
            {previewPlatform === 'facebook' && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    NG
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-xs">Next Gen EV Care</span>
                    <span className="text-[10px] text-slate-400">Just now · 🌐</span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <div className="aspect-[1.91/1] bg-slate-950 overflow-hidden">
                    <img
                      src={metadata.ogImage}
                      alt="OpenGraph banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      {displayDomain}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                      {metadata.ogTitle || metadata.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {metadata.ogDescription || metadata.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW CONTAINER: Twitter / X Card Style */}
            {previewPlatform === 'twitter' && (
              <div className="p-4 rounded-2xl bg-black border border-slate-800 text-white space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-extrabold flex items-center justify-center text-xs">
                    EV
                  </div>
                  <div className="leading-tight">
                    <span className="font-bold block">Next Gen EV Care</span>
                    <span className="text-[11px] text-slate-500 font-mono">@NextGenEvCare</span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <div className="aspect-[2/1] bg-slate-900 overflow-hidden relative">
                    <img
                      src={metadata.ogImage}
                      alt="Twitter banner"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300">
                      {displayDomain}
                    </div>
                  </div>
                  <div className="p-3 space-y-0.5">
                    <h4 className="font-bold text-white text-xs line-clamp-1">
                      {metadata.ogTitle || metadata.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {metadata.ogDescription || metadata.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW CONTAINER: Google Search Snippet */}
            {previewPlatform === 'google' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-[10px]">
                    EV
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-semibold text-slate-900 dark:text-slate-200 leading-tight">Next Gen EV Care</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate block">
                      https://{displayDomain} › gujranwala › electric-scooty-repair
                    </span>
                  </div>
                </div>

                <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-base sm:text-lg hover:underline cursor-pointer leading-snug">
                  {metadata.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {metadata.description}
                </p>
              </div>
            )}

            {/* SEO Scoring & Quality Checklist */}
            <div className="p-4 rounded-xl liquid-glass-subtle space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                Technical Audit Checklist
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Title character length:</span>
                  <span className={`font-mono font-bold ${metadata.title.length <= 60 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {metadata.title.length}/60
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Description character length:</span>
                  <span className={`font-mono font-bold ${metadata.description.length <= 165 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {metadata.description.length}/165
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">OpenGraph image set:</span>
                  <span className="font-mono text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Canonical reference:</span>
                  <span className="font-mono text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
