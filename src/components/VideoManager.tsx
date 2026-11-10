import React, { useState, useMemo } from 'react';
import { PortfolioItem, BlogPost } from '../types';
import { 
  VideoEmbed, 
  parseVideoUrl, 
  PlatformIcon, 
  getPlatformBadgeStyle, 
  VideoPlatform 
} from './VideoEmbed';
import { 
  Film, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  Wrench, 
  FileText, 
  Play, 
  Search, 
  X,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

interface VideoManagerProps {
  portfolio: PortfolioItem[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  onNotify?: (message: string) => void;
}

const PRESET_SAMPLE_VIDEOS = [
  {
    label: 'YouTube (BLDC Oscilloscope Diagnostic)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube' as const,
    type: 'project' as const
  },
  {
    label: 'YouTube Shorts (Hall Sensor Quick Swap)',
    url: 'https://www.youtube.com/shorts/5O9Z8T5xK3Q',
    platform: 'youtube' as const,
    type: 'project' as const
  },
  {
    label: 'TikTok (@nextgenevcare Doorstep Driveway Fix)',
    url: 'https://www.tiktok.com/@nextgenevcare/video/7345678901234567890',
    platform: 'tiktok' as const,
    type: 'project' as const
  },
  {
    label: 'Instagram Reel (72V MOSFET Transistor Rework)',
    url: 'https://www.instagram.com/reel/C1234567890/',
    platform: 'instagram' as const,
    type: 'blog' as const
  },
  {
    label: 'Facebook Watch (Smart BMS Cell Balancing Scan)',
    url: 'https://www.facebook.com/watch/?v=10158234567890123',
    platform: 'facebook' as const,
    type: 'blog' as const
  }
];

export const VideoManager: React.FC<VideoManagerProps> = ({
  portfolio,
  setPortfolio,
  blogs,
  setBlogs,
  onNotify
}) => {
  // Input form state
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [targetType, setTargetType] = useState<'project' | 'blog'>('project');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewModalVideo, setPreviewModalVideo] = useState<{ url: string; title: string } | null>(null);

  // Parse entered URL on the fly
  const parsedCurrent = useMemo(() => parseVideoUrl(videoUrlInput), [videoUrlInput]);

  // Set default target ID when targetType changes or options load
  React.useEffect(() => {
    if (targetType === 'project' && portfolio.length > 0 && !selectedTargetId) {
      setSelectedTargetId(portfolio[0].id);
    } else if (targetType === 'blog' && blogs.length > 0 && !selectedTargetId) {
      setSelectedTargetId(blogs[0].id);
    }
  }, [targetType, portfolio, blogs, selectedTargetId]);

  // All attached video items collected
  const allVideoItems = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      videoUrl: string;
      platform: VideoPlatform;
      type: 'project' | 'blog';
      category: string;
      itemRef: PortfolioItem | BlogPost;
    }> = [];

    portfolio.forEach((p) => {
      if (p.videoUrl && p.videoUrl.trim()) {
        const parsed = parseVideoUrl(p.videoUrl);
        list.push({
          id: p.id,
          title: p.title,
          videoUrl: p.videoUrl,
          platform: parsed.platform,
          type: 'project',
          category: p.category,
          itemRef: p
        });
      }
    });

    blogs.forEach((b) => {
      if (b.videoUrl && b.videoUrl.trim()) {
        const parsed = parseVideoUrl(b.videoUrl);
        list.push({
          id: b.id,
          title: b.title,
          videoUrl: b.videoUrl,
          platform: parsed.platform,
          type: 'blog',
          category: b.category,
          itemRef: b
        });
      }
    });

    return list;
  }, [portfolio, blogs]);

  // Filtered list
  const filteredVideos = useMemo(() => {
    return allVideoItems.filter((item) => {
      const matchesPlatform = filterPlatform === 'all' || item.platform === filterPlatform || item.type === filterPlatform;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.videoUrl.toLowerCase().includes(query);
      return matchesPlatform && matchesSearch;
    });
  }, [allVideoItems, filterPlatform, searchQuery]);

  const handleBindVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = videoUrlInput.trim();
    if (!cleanUrl) {
      onNotify?.('Please paste a valid video URL from YouTube, TikTok, Instagram, or Facebook');
      return;
    }

    if (!selectedTargetId) {
      onNotify?.('Please select a Case Study or Tech Article to bind this video to');
      return;
    }

    if (targetType === 'project') {
      const targetProj = portfolio.find((p) => p.id === selectedTargetId);
      if (!targetProj) return;

      setPortfolio((prev) =>
        prev.map((p) =>
          p.id === selectedTargetId
            ? { ...p, videoUrl: cleanUrl, videoPlatform: parsedCurrent.platform }
            : p
        )
      );
      onNotify?.(`Video attached to Case Study "${targetProj.title}"!`);
    } else {
      const targetBlog = blogs.find((b) => b.id === selectedTargetId);
      if (!targetBlog) return;

      setBlogs((prev) =>
        prev.map((b) =>
          b.id === selectedTargetId
            ? { ...b, videoUrl: cleanUrl, videoPlatform: parsedCurrent.platform }
            : b
        )
      );
      onNotify?.(`Video attached to Tech Guide "${targetBlog.title}"!`);
    }

    setVideoUrlInput('');
  };

  const handleRemoveVideo = (id: string, type: 'project' | 'blog', title: string) => {
    if (window.confirm(`Unbind and remove video from "${title}"?`)) {
      if (type === 'project') {
        setPortfolio((prev) =>
          prev.map((p) => (p.id === id ? { ...p, videoUrl: undefined, videoPlatform: undefined } : p))
        );
      } else {
        setBlogs((prev) =>
          prev.map((b) => (b.id === id ? { ...b, videoUrl: undefined, videoPlatform: undefined } : b))
        );
      }
      onNotify?.(`Video removed from "${title}"`);
    }
  };

  const handleCopy = (url: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top Banner with Liquid Glass Header */}
      <div className="p-6 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Film className="w-4 h-4" />
            <span>UNIFIED MULTI-PLATFORM VIDEO STREAMING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Social & Teardown Video Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Seamlessly embed and stream live repair teardowns and diagnostic clips via direct URL from YouTube, TikTok, Instagram, and Facebook without external redirects.
          </p>
        </div>

        {/* Quick KPI Count */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-lg font-mono">
              {allVideoItems.length}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Active Videos</div>
              <div className="text-[10px] text-slate-500">Across Projects & Guides</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Add/Attach Panel (Left) & Preset Helpers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form: Paste URL & Assign */}
        <div className="lg:col-span-7 p-6 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Attach Social Video Link</span>
            </h3>
            {videoUrlInput && parsedCurrent.platform !== 'unknown' && (
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${getPlatformBadgeStyle(parsedCurrent.platform)}`}>
                <PlatformIcon platform={parsedCurrent.platform} className="w-3.5 h-3.5" />
                <span>{parsedCurrent.platformLabel} {parsedCurrent.isVertical ? '(Vertical 9:16)' : '(Standard 16:9)'}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleBindVideo} className="space-y-4">
            
            {/* Video URL Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Video URL (YouTube, TikTok, Instagram, Facebook, or Direct MP4)
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or tiktok.com/@user/video/..."
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  className="w-full h-11 px-4 text-xs sm:text-sm rounded-xl liquid-glass text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
                {videoUrlInput && (
                  <button
                    type="button"
                    onClick={() => setVideoUrlInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports YouTube watch/shorts/embeds, TikTok video links, Instagram Reels/posts, and Facebook watch URLs.
              </p>
            </div>

            {/* Target Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Content Type
                </label>
                <div className="flex rounded-xl liquid-glass p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType('project');
                      if (portfolio.length > 0) setSelectedTargetId(portfolio[0].id);
                    }}
                    className={`flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      targetType === 'project'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Case Study</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType('blog');
                      if (blogs.length > 0) setSelectedTargetId(blogs[0].id);
                    }}
                    className={`flex-1 h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      targetType === 'blog'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Tech Guide</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Assign To Specific Record
                </label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full h-11 px-3 text-xs rounded-xl liquid-glass text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {targetType === 'project'
                    ? portfolio.map((p) => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                          {p.title} ({p.vehicleModel})
                        </option>
                      ))
                    : blogs.map((b) => (
                        <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                          {b.title}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={!videoUrlInput.trim()}
                className="h-11 px-5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Bind Video to Record</span>
              </button>
            </div>

          </form>

          {/* Real-Time Inline Preview if URL is entered */}
          {videoUrlInput && (
            <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-Time In-App Player Preview</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {parsedCurrent.isVertical ? 'Vertical 9:16 Aspect' : 'Widescreen 16:9 Aspect'}
                </span>
              </div>
              <VideoEmbed 
                url={videoUrlInput} 
                title="Live Preview Stream"
                className="max-h-[380px]"
              />
            </div>
          )}
        </div>

        {/* Quick Presets & Platform Guide (Right Column) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>One-Click Test Presets</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Test parsing and in-app streaming with real diagnostic clips from Next Gen EV Care's laboratory:
            </p>

            <div className="space-y-2">
              {PRESET_SAMPLE_VIDEOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setVideoUrlInput(preset.url);
                    setTargetType(preset.type);
                    if (preset.type === 'project' && portfolio.length > 0) {
                      setSelectedTargetId(portfolio[0].id);
                    } else if (preset.type === 'blog' && blogs.length > 0) {
                      setSelectedTargetId(blogs[0].id);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl liquid-glass-subtle hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group cursor-pointer border border-transparent"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`p-1.5 rounded-lg border shrink-0 ${getPlatformBadgeStyle(preset.platform)}`}>
                      <PlatformIcon platform={preset.platform} className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {preset.label}
                    </span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Platform Capability Overview */}
          <div className="p-5 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 text-xs space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white">Supported Video Platforms</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5">
                <PlatformIcon platform="youtube" className="w-3.5 h-3.5" />
                <span>YouTube & Shorts</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <PlatformIcon platform="tiktok" className="w-3.5 h-3.5" />
                <span>TikTok Clips</span>
              </div>
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 flex items-center gap-1.5">
                <PlatformIcon platform="instagram" className="w-3.5 h-3.5" />
                <span>Instagram Reels</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                <PlatformIcon platform="facebook" className="w-3.5 h-3.5" />
                <span>Facebook Watch</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Videos render inside responsive, sandboxed iframes styled with our frosted liquid glass tokens, guaranteeing smooth in-app playback with zero layout shifts.
            </p>
          </div>

        </div>

      </div>

      {/* Attached Videos Showcase & Management Table */}
      <div className="p-6 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-sm space-y-5">
        
        {/* Strip: Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Currently Attached Videos ({allVideoItems.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, play, share, or unbind videos assigned to case studies and tech articles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 text-xs rounded-xl liquid-glass text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto w-full text-xs">
          {[
            { id: 'all', label: `All (${allVideoItems.length})` },
            { id: 'youtube', label: 'YouTube' },
            { id: 'tiktok', label: 'TikTok' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'facebook', label: 'Facebook' },
            { id: 'project', label: 'Projects Only' },
            { id: 'blog', label: 'Guides Only' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterPlatform(tab.id)}
              className={`h-8 px-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterPlatform === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        {filteredVideos.length === 0 ? (
          <div className="py-12 text-center rounded-xl liquid-glass-subtle space-y-2">
            <Film className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No videos match your filter</p>
            <p className="text-[11px] text-slate-500">Paste a link above or reset filters to view all entries.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <div
                key={`${video.type}-${video.id}`}
                className="rounded-2xl liquid-glass-card overflow-hidden flex flex-col justify-between border border-white/80 dark:border-white/10 hover:border-emerald-500/30 transition-all p-4 space-y-3"
              >
                {/* Card Top: Platform Badge & Target Indicator */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${getPlatformBadgeStyle(video.platform)}`}>
                    <PlatformIcon platform={video.platform} className="w-3 h-3" />
                    <span className="capitalize">{video.platform}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    {video.type === 'project' ? <Wrench className="w-2.5 h-2.5 text-emerald-500" /> : <FileText className="w-2.5 h-2.5 text-emerald-500" />}
                    <span>{video.type === 'project' ? 'Case Study' : 'Tech Guide'}</span>
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-1 font-mono">
                    {video.videoUrl}
                  </p>
                </div>

                {/* Actions: Preview, Copy, Remove */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewModalVideo({ url: video.videoUrl, title: video.title })}
                      className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-emerald-500" />
                      <span>Play</span>
                    </button>

                    <button
                      onClick={() => handleCopy(video.videoUrl, video.id)}
                      className="h-8 px-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === video.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleRemoveVideo(video.id, video.type, video.title)}
                    className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                    title="Unbind video from record"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Unbind</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Standalone Player Modal */}
      {previewModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {previewModalVideo.title}
                </span>
              </div>
              <button
                onClick={() => setPreviewModalVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <VideoEmbed 
              url={previewModalVideo.url} 
              title={previewModalVideo.title}
              showDetailsBar={false}
            />

            <div className="flex items-center justify-end">
              <button
                onClick={() => setPreviewModalVideo(null)}
                className="h-9 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Dismiss Player
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
