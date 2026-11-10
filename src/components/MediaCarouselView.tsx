import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Image as ImageIcon, 
  Maximize2, 
  X, 
  Film,
  Sparkles
} from 'lucide-react';
import { VideoEmbed, parseVideoUrl, PlatformIcon, getPlatformBadgeStyle } from './VideoEmbed';

export interface MediaCarouselViewProps {
  primaryImage?: string;
  images?: string[];
  videoUrl?: string;
  title: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'photo' | 'auto';
  autoAdvance?: boolean;
}

export type MediaSlide = 
  | { type: 'image'; url: string; id: string }
  | { type: 'video'; url: string; id: string };

export const MediaCarouselView: React.FC<MediaCarouselViewProps> = ({
  primaryImage,
  images = [],
  videoUrl,
  title,
  className = '',
  aspectRatio = 'photo',
  autoAdvance = false
}) => {
  // Aggregate and deduplicate images up to max 8
  const mediaSlides: MediaSlide[] = useMemo(() => {
    const list: MediaSlide[] = [];
    const seen = new Set<string>();

    // 1. Add primary image first if valid
    if (primaryImage && primaryImage.trim()) {
      list.push({ type: 'image', url: primaryImage.trim(), id: `img-0` });
      seen.add(primaryImage.trim());
    }

    // 2. Add extra gallery images up to max 8 images total
    if (Array.isArray(images)) {
      for (const img of images) {
        if (list.filter((s) => s.type === 'image').length >= 8) break;
        if (img && img.trim() && !seen.has(img.trim())) {
          list.push({ type: 'image', url: img.trim(), id: `img-${list.length}` });
          seen.add(img.trim());
        }
      }
    }

    // 3. Add video slide if present (1 max)
    if (videoUrl && videoUrl.trim()) {
      list.push({ type: 'video', url: videoUrl.trim(), id: 'video-main' });
    }

    return list;
  }, [primaryImage, images, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Keep index within bounds
  useEffect(() => {
    if (activeIndex >= mediaSlides.length && mediaSlides.length > 0) {
      setActiveIndex(0);
    }
  }, [mediaSlides.length, activeIndex]);

  const currentSlide = mediaSlides[activeIndex] || mediaSlides[0];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? mediaSlides.length - 1 : prev - 1));
  }, [mediaSlides.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === mediaSlides.length - 1 ? 0 : prev + 1));
  }, [mediaSlides.length]);

  // Touch Swipe for Mobile Shopping Gallery feel
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-scroll the thumbnail strip to center active thumbnail
  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeBtn = thumbnailStripRef.current.children[activeIndex] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [activeIndex]);

  if (mediaSlides.length === 0) {
    return (
      <div className={`aspect-[16/10] rounded-2xl liquid-glass flex flex-col items-center justify-center p-8 text-center text-slate-400 ${className}`}>
        <ImageIcon className="w-10 h-10 text-emerald-500/50 mb-2" />
        <span className="text-xs font-semibold text-slate-300">No Media Attached</span>
      </div>
    );
  }

  // Aspect ratio class definition
  const aspectClass = 
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'photo' ? 'aspect-[16/10]' : 'aspect-[16/10]';

  return (
    <div className={`space-y-3 select-none ${className}`}>
      
      {/* ===================== MAIN MEDIA VIEWER ===================== */}
      <div 
        className="relative rounded-2xl overflow-hidden liquid-glass border border-white/80 dark:border-white/10 shadow-xl group bg-slate-950"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`w-full ${aspectClass} relative flex items-center justify-center overflow-hidden`}>
          
          {currentSlide.type === 'image' ? (
            <img
              src={currentSlide.url}
              alt={`${title} - view ${activeIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full">
              <VideoEmbed 
                url={currentSlide.url} 
                title={`${title} Teardown Stream`}
                showDetailsBar={false}
                autoPlay={false}
                className="h-full rounded-none border-none shadow-none"
              />
            </div>
          )}

          {/* Top Left Media Badge: Image count or Video Live Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-10">
            {currentSlide.type === 'video' ? (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-md flex items-center gap-1.5 animate-pulse">
                <Play className="w-3 h-3 fill-emerald-400" />
                <span>In-App Video Stream</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-950/80 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-emerald-400" />
                <span>{activeIndex + 1} / {mediaSlides.length}</span>
              </span>
            )}
          </div>

          {/* Top Right Fullscreen Button */}
          {currentSlide.type === 'image' && (
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-slate-950/75 hover:bg-slate-950 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 z-10 cursor-pointer shadow-sm"
              title="View full size photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}

          {/* Navigation Arrows (Visible if multiple slides) */}
          {mediaSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full liquid-glass hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-800 dark:text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 shadow-lg active:scale-95 z-10 cursor-pointer border border-white/80 dark:border-white/20"
              >
                <ChevronLeft className="w-5 h-5 -ml-0.5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full liquid-glass hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-800 dark:text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 shadow-lg active:scale-95 z-10 cursor-pointer border border-white/80 dark:border-white/20"
              >
                <ChevronRight className="w-5 h-5 -mr-0.5" />
              </button>
            </>
          )}

          {/* Subtle Bottom Specular / Title Caption */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-3.5 text-white flex items-center justify-between text-xs pointer-events-none">
            <span className="truncate font-medium text-slate-200">{title}</span>
            <span className="text-[10px] font-mono text-emerald-400 shrink-0 ml-2">
              {currentSlide.type === 'video' ? 'Interactive Teardown' : `Photo ${activeIndex + 1}`}
            </span>
          </div>

        </div>
      </div>

      {/* ===================== SHOPPING-APP STYLE THUMBNAIL STRIP ===================== */}
      {mediaSlides.length > 1 && (
        <div 
          ref={thumbnailStripRef}
          className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
        >
          {mediaSlides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            const isVideo = slide.type === 'video';

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer border ${
                  isActive 
                    ? 'ring-2 ring-emerald-500 scale-105 border-emerald-400 shadow-md shadow-emerald-500/20' 
                    : 'border-slate-200/80 dark:border-white/10 hover:border-emerald-500/40 opacity-70 hover:opacity-100'
                }`}
              >
                {isVideo ? (
                  <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-center p-1 relative">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm mb-0.5">
                      <Play className="w-3 h-3 fill-emerald-400 ml-0.5" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      Video
                    </span>
                    {isActive && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                ) : (
                  <>
                    <img
                      src={slide.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/20" />
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono text-white/90 bg-slate-950/70 px-1 rounded">
                      {idx + 1}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ===================== FULLSCREEN LIGHTBOX MODAL ===================== */}
      {isFullscreen && currentSlide.type === 'image' && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-emerald-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentSlide.url}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-3 text-center text-xs text-slate-300">
              <span>{title}</span> · <span>Photo {activeIndex + 1} of {mediaSlides.filter((s) => s.type === 'image').length}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
