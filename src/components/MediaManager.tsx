import React, { useState, useRef } from 'react';
import { MediaAsset } from '../types';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  Plus,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

interface MediaManagerProps {
  mediaLibrary: MediaAsset[];
  onAddMedia: (asset: MediaAsset) => void;
  onDeleteMedia: (id: string) => void;
  onNotify: (msg: string) => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  mediaLibrary,
  onAddMedia,
  onDeleteMedia,
  onNotify
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<'all' | 'upload' | 'preset' | 'url'>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<MediaAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg'];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpe?g|png|webp|svg)$/i)) {
        onNotify(`Skipped "${file.name}": Unsupported format. Allowed: JPEG, PNG, WebP, SVG`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onNotify(`File "${file.name}" exceeds 5MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const newAsset: MediaAsset = {
            id: `media-upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: dataUrl,
            sizeFormatted: formatFileSize(file.size),
            sizeBytes: file.size,
            type: file.type || 'image/jpeg',
            source: 'upload',
            width: img.width,
            height: img.height,
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
          onAddMedia(newAsset);
          onNotify(`Uploaded "${file.name}" to media library.`);
        };
        img.onerror = () => {
          const newAsset: MediaAsset = {
            id: `media-upload-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: dataUrl,
            sizeFormatted: formatFileSize(file.size),
            sizeBytes: file.size,
            type: file.type || 'image/jpeg',
            source: 'upload',
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
          onAddMedia(newAsset);
          onNotify(`Uploaded "${file.name}" to media library.`);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    const newAsset: MediaAsset = {
      id: `media-url-${Date.now()}`,
      name: customUrl.split('/').pop()?.split('?')[0] || 'Web Image Asset',
      url: customUrl.trim(),
      sizeFormatted: 'External Asset',
      source: 'url',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    onAddMedia(newAsset);
    setCustomUrl('');
    onNotify('Image link added to media library.');
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    onNotify('Image URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredMedia = mediaLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterSource === 'all' || item.source === filterSource;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <span>Workshop Media & Image Manager</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse, upload, preview, and permanently remove images for Case Studies, Tech Guides, and Service Leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 px-4 text-xs font-semibold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Images</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Panel */}
      <div className="p-4 sm:p-5 rounded-2xl liquid-glass-card border border-white/80 dark:border-white/10 shadow-sm space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 hover:bg-emerald-500/5'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Drag & drop photos here or click to browse device
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Supports JPG, PNG, WebP, SVG up to 5MB each. Works on mobile photo gallery & camera.
              </p>
            </div>
          </div>
        </div>

        {/* Paste URL Bar */}
        <form onSubmit={handleAddCustomUrl} className="flex flex-col sm:flex-row items-center gap-2.5">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Or register image from URL / public path (e.g. /public/logo.png or https://...)..."
            className="w-full sm:flex-1 h-11 px-4 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="w-full sm:w-auto h-11 px-5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register Image URL</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by filename or link..."
            className="w-full h-11 pl-10 pr-4 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterSource('all')}
            className={`h-11 px-3.5 text-xs rounded-xl font-medium whitespace-nowrap transition-colors ${
              filterSource === 'all'
                ? 'bg-emerald-500 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Assets ({mediaLibrary.length})
          </button>
          <button
            onClick={() => setFilterSource('upload')}
            className={`h-11 px-3.5 text-xs rounded-xl font-medium whitespace-nowrap transition-colors ${
              filterSource === 'upload'
                ? 'bg-emerald-500 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Uploaded ({mediaLibrary.filter(m => m.source === 'upload').length})
          </button>
          <button
            onClick={() => setFilterSource('preset')}
            className={`h-11 px-3.5 text-xs rounded-xl font-medium whitespace-nowrap transition-colors ${
              filterSource === 'preset'
                ? 'bg-emerald-500 text-white font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Workshop Presets ({mediaLibrary.filter(m => m.source === 'preset').length})
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center rounded-2xl liquid-glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No media assets found
          </p>
          <p className="text-xs text-slate-500">
            Upload new images or adjust your search filter above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((asset) => {
            const isCopied = copiedId === asset.id;
            return (
              <div
                key={asset.id}
                className="group rounded-2xl liquid-glass-card border border-white/80 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col bg-white/80 dark:bg-slate-900/80"
              >
                {/* Thumbnail Preview */}
                <div className="aspect-4/3 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setPreviewModalImage(asset)}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-950/70 text-white backdrop-blur-xs capitalize">
                      {asset.source === 'preset' ? 'Workshop Preset' : asset.source}
                    </span>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                    <button
                      type="button"
                      onClick={() => setPreviewModalImage(asset)}
                      className="w-8 h-8 rounded-lg bg-white/90 text-slate-900 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      title="Enlarge preview"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset)}
                      className="w-8 h-8 rounded-lg bg-white/90 text-slate-900 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {asset.source !== 'preset' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Permanently remove "${asset.name}" from media library?`)) {
                            onDeleteMedia(asset.id);
                            onNotify('Image removed from library.');
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate" title={asset.name}>
                      {asset.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {asset.sizeFormatted || 'Standard'} {asset.width ? `· ${asset.width}x${asset.height}` : ''}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset)}
                      className="flex-1 h-8 px-2 text-[11px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    {asset.source !== 'preset' ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Permanently remove "${asset.name}"?`)) {
                            onDeleteMedia(asset.id);
                            onNotify('Image removed from library.');
                          }
                        }}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center shrink-0 transition-colors"
                        title="Remove image from library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 px-1 font-medium">Preset</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewModalImage && (
        <div 
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl liquid-glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 text-white"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <span className="font-bold text-xs truncate">{previewModalImage.name}</span>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.name}
                className="max-h-[60vh] max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="p-4 bg-slate-900 text-xs text-slate-400 flex items-center justify-between">
              <span>{previewModalImage.sizeFormatted} {previewModalImage.width ? `· ${previewModalImage.width}x${previewModalImage.height}` : ''}</span>
              <button
                onClick={() => {
                  handleCopyUrl(previewModalImage);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
