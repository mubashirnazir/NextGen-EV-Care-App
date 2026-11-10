import React, { useState, useMemo } from 'react';
import { 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Film, 
  Maximize2 
} from 'lucide-react';

export type VideoPlatform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'direct' | 'unknown';

export interface ParsedVideo {
  platform: VideoPlatform;
  embedUrl: string | null;
  originalUrl: string;
  isVertical: boolean;
  platformLabel: string;
  id?: string;
}

/**
 * Robust URL parser for YouTube, TikTok, Instagram, Facebook, and Direct HTML5 video.
 */
export function parseVideoUrl(rawUrl: string): ParsedVideo {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      platform: 'unknown',
      embedUrl: null,
      originalUrl: '',
      isVertical: false,
      platformLabel: 'Unknown Platform'
    };
  }

  const url = rawUrl.trim();

  // 1. YouTube Detection
  // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytShortsMatch = url.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]+)/i);
  if (ytShortsMatch && ytShortsMatch[1]) {
    const videoId = ytShortsMatch[1];
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
      originalUrl: url,
      isVertical: true,
      platformLabel: 'YouTube Shorts',
      id: videoId
    };
  }

  const ytStandardMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytStandardMatch && ytStandardMatch[1]) {
    const videoId = ytStandardMatch[1];
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`,
      originalUrl: url,
      isVertical: false,
      platformLabel: 'YouTube',
      id: videoId
    };
  }

  // 2. TikTok Detection
  // Matches: tiktok.com/@username/video/1234567890 or tiktok.com/v/1234567890
  const tikTokVideoMatch = url.match(/tiktok\.com\/(?:@[^\/]+\/video|v)\/([0-9]+)/i);
  if (tikTokVideoMatch && tikTokVideoMatch[1]) {
    const videoId = tikTokVideoMatch[1];
    return {
      platform: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
      originalUrl: url,
      isVertical: true,
      platformLabel: 'TikTok',
      id: videoId
    };
  }

  if (url.includes('tiktok.com')) {
    // Other TikTok formats (e.g., short links vt.tiktok.com, vm.tiktok.com)
    return {
      platform: 'tiktok',
      embedUrl: null, // Short links cannot always be resolved without backend redirect
      originalUrl: url,
      isVertical: true,
      platformLabel: 'TikTok',
    };
  }

  // 3. Instagram Detection
  // Matches: instagram.com/reel/CODE, /reels/CODE, /p/CODE, /tv/CODE
  const igMatch = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    const code = igMatch[1];
    const isReel = url.includes('/reel');
    return {
      platform: 'instagram',
      embedUrl: `https://www.instagram.com/reel/${code}/embed/`,
      originalUrl: url,
      isVertical: isReel,
      platformLabel: isReel ? 'Instagram Reel' : 'Instagram Post',
      id: code
    };
  }

  // 4. Facebook Detection
  // Matches: facebook.com/watch/?v=ID, facebook.com/.../videos/ID, facebook.com/reel/ID, fb.watch/ID
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    const isReel = url.includes('/reel/') || url.includes('reel');
    // Facebook official embedded video player iframe
    const cleanUrl = url.split('?')[0]; // or keep full url if watch?v=
    const finalFbUrl = url.includes('watch') ? url : cleanUrl;
    const fbEmbed = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(finalFbUrl)}&show_text=false&t=0`;
    return {
      platform: 'facebook',
      embedUrl: fbEmbed,
      originalUrl: url,
      isVertical: isReel,
      platformLabel: isReel ? 'Facebook Reel' : 'Facebook Watch'
    };
  }

  // 5. Direct HTML5 Video
  if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
    return {
      platform: 'direct',
      embedUrl: url,
      originalUrl: url,
      isVertical: false,
      platformLabel: 'Direct Video (MP4)'
    };
  }

  return {
    platform: 'unknown',
    embedUrl: null,
    originalUrl: url,
    isVertical: false,
    platformLabel: 'External Video'
  };
}

// Brand Icons
export const PlatformIcon: React.FC<{ platform: VideoPlatform; className?: string }> = ({ platform, className = "w-4 h-4" }) => {
  switch (platform) {
    case 'youtube':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    default:
      return <Film className={className} />;
  }
};

export const getPlatformBadgeStyle = (platform: VideoPlatform) => {
  switch (platform) {
    case 'youtube':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    case 'tiktok':
      return 'bg-slate-900 text-cyan-400 dark:text-cyan-300 border-cyan-500/30';
    case 'instagram':
      return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20';
    case 'facebook':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'direct':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
  }
};

interface VideoEmbedProps {
  url: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  showDetailsBar?: boolean;
  onRemove?: () => void;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title,
  autoPlay = false,
  className = '',
  showDetailsBar = true,
  onRemove
}) => {
  const [copied, setCopied] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const parsed = useMemo(() => parseVideoUrl(url), [url]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!url || !url.trim()) {
    return null;
  }

  // Fallback if URL is invalid or embedUrl is missing (e.g. unsupported link format)
  if (!parsed.embedUrl && parsed.platform !== 'direct') {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-lg ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${getPlatformBadgeStyle(parsed.platform)}`}>
              <PlatformIcon platform={parsed.platform} className="w-3.5 h-3.5" />
              <span>{parsed.platformLabel}</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              {title || 'EV Workshop Video Clip'}
            </span>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-xs text-red-500 hover:text-red-600 p-1"
              title="Remove video link"
            >
              Remove
            </button>
          )}
        </div>

        <div className="p-6 rounded-xl bg-slate-100/70 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <PlatformIcon platform={parsed.platform} className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Watch on {parsed.platformLabel}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm truncate">
              {url}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Open on {parsed.platformLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleCopy}
              className="h-10 px-3 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Responsive Aspect Ratios
  // - TikTok, Instagram Reels, YouTube Shorts: 9/16 vertical player with constrained max-width
  // - YouTube Standard, Facebook Watch, Direct MP4: 16/9 widescreen player
  const containerAspect = parsed.isVertical 
    ? 'max-w-[340px] sm:max-w-[380px] mx-auto aspect-[9/16] min-h-[460px] sm:min-h-[520px]' 
    : 'w-full aspect-video min-h-[220px] sm:min-h-[360px]';

  return (
    <div className={`overflow-hidden rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/40 ${className}`}>
      
      {/* Top Details & Action Bar */}
      {showDetailsBar && (
        <div className="p-3 sm:px-4 flex items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 shrink-0 ${getPlatformBadgeStyle(parsed.platform)}`}>
              <PlatformIcon platform={parsed.platform} className="w-3.5 h-3.5" />
              <span>{parsed.platformLabel}</span>
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {title || (parsed.isVertical ? 'Field Repair Reel' : 'Engineering Diagnostic Video')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="h-8 px-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 border border-slate-200/60 dark:border-slate-800"
              title="Copy video URL"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-2.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 border border-slate-200/60 dark:border-slate-800"
              title="Open video on original site"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Open</span>
            </a>

            {onRemove && (
              <button
                onClick={onRemove}
                className="h-8 px-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                title="Remove video"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Video Viewport Container */}
      <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden">
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10 space-y-2 pointer-events-none">
            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading {parsed.platformLabel} stream...</span>
          </div>
        )}

        {/* Video Player Render */}
        <div className={`relative w-full ${containerAspect} flex items-center justify-center`}>
          {parsed.platform === 'direct' ? (
            <video
              src={parsed.originalUrl}
              controls
              playsInline
              onLoadedData={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={parsed.embedUrl!}
              title={title || `${parsed.platformLabel} Video Player`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>

        {/* Error Fallback Overlay */}
        {hasError && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <p className="text-sm font-bold text-white">Playback restricted by {parsed.platformLabel}</p>
            <p className="text-xs text-slate-400 max-w-sm">
              Some social platforms restrict embedded iframe playback on certain networks or accounts. You can watch this video directly on their platform.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Watch on {parsed.platformLabel}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

      </div>

      {/* Subtle Bottom Specular / Info Strip */}
      <div className="px-4 py-2 bg-slate-100/50 dark:bg-slate-950/40 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>In-App High-Definition Player</span>
        </span>
        <span className="font-mono text-[10px]">Next Gen EV Diagnostic Lab</span>
      </div>

    </div>
  );
};
