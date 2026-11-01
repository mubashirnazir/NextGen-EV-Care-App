import React, { useState, useRef } from 'react';
import { MediaAsset } from '../types';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Search,
  ExternalLink,
  Plus,
  FileText,
  AlertCircle
} from 'lucide-react';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  onRemoveImage?: () => void;
  currentImage?: string;
  mediaLibrary: MediaAsset[];
  onAddMedia: (asset: MediaAsset) => void;
  onDeleteMedia: (id: string) => void;
  onNotify: (msg: string) => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  onRemoveImage,
  currentImage,
  mediaLibrary,
  onAddMedia,
  onDeleteMedia,
  onNotify
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'upload' | 'preset'>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredMedia = mediaLibrary.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.source === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg'];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpe?g|png|webp|svg)$/i)) {
        onNotify(`Skipped "${file.name}": Unsupported format. Allowed: JPEG, PNG, WebP, SVG`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onNotify(`File "${file.name}" is over 5MB. Please choose a smaller file.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        
        // Extract dimensions if possible
        const img = new Image();
        img.onload = () => {
          const newAsset: MediaAsset = {
            id: `media-upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: resultUrl,
            sizeFormatted: formatFileSize(file.size),
            sizeBytes: file.size,
            type: file.type || 'image/jpeg',
            source: 'upload',
            width: img.width,
            height: img.height,
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
          onAddMedia(newAsset);
          onNotify(`Uploaded "${file.name}" successfully.`);
        };
        img.onerror = () => {
          const newAsset: MediaAsset = {
            id: `media-upload-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            url: resultUrl,
            sizeFormatted: formatFileSize(file.size),
            sizeBytes: file.size,
            type: file.type || 'image/jpeg',
            source: 'upload',
            uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
          onAddMedia(newAsset);
          onNotify(`Uploaded "${file.name}" successfully.`);
        };
        img.src = resultUrl;
      };
      reader.readAsDataURL(file);
    });

    setIsProcessing(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col liquid-glass-card rounded-2xl shadow-2xl border border-white/80 dark:border-white/10 overflow-hidden bg-white/95 dark:bg-slate-900/95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 id="media-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                Media & Image Asset Selector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse existing assets, upload from device, or remove media from this item
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onRemoveImage && currentImage && (
              <button
                type="button"
                onClick={() => {
                  onRemoveImage();
                  onClose();
                  onNotify('Media removed from record.');
                }}
                className="h-9 px-3 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center gap-1.5 transition-colors"
                title="Remove image from this record"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Media</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload Zone & URL Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
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
            className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
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
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Click to browse device or drag & drop images here
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports JPEG, PNG, WebP, SVG (Max 5MB each) · Mobile gallery & camera supported
                </p>
              </div>
            </div>
          </div>

          {/* Quick URL Add */}
          <form onSubmit={handleAddCustomUrl} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Or paste external image URL / public path (e.g. /public/logo.png)..."
                className="w-full h-11 px-3.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="h-11 px-4 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </form>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by name..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`h-8 px-3 text-xs rounded-lg font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({mediaLibrary.length})
            </button>
            <button
              onClick={() => setActiveFilter('upload')}
              className={`h-8 px-3 text-xs rounded-lg font-medium transition-colors ${
                activeFilter === 'upload'
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Uploaded
            </button>
            <button
              onClick={() => setActiveFilter('preset')}
              className={`h-8 px-3 text-xs rounded-lg font-medium transition-colors ${
                activeFilter === 'preset'
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Workshop Assets
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredMedia.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs text-slate-500">No media assets match your search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredMedia.map((asset) => {
                const isSelected = currentImage === asset.url;
                return (
                  <div
                    key={asset.id}
                    className={`group relative rounded-xl border overflow-hidden transition-all duration-200 flex flex-col bg-white dark:bg-slate-900 ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div 
                      onClick={() => {
                        onSelectImage(asset.url);
                        onClose();
                      }}
                      className="aspect-4/3 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden relative cursor-pointer"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback icon on broken image
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        <span className="text-[11px] font-semibold text-white bg-slate-950/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                          {isSelected ? 'Currently Selected' : 'Choose Image'}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-2.5 flex items-center justify-between gap-1.5 text-left border-t border-slate-100 dark:border-slate-800/80">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {asset.sizeFormatted || 'Standard'} {asset.width ? `· ${asset.width}x${asset.height}` : ''}
                        </p>
                      </div>

                      {/* Delete button (for uploaded or custom media) */}
                      {asset.source !== 'preset' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${asset.name}" from library?`)) {
                              onDeleteMedia(asset.id);
                              if (currentImage === asset.url && onRemoveImage) {
                                onRemoveImage();
                              }
                              onNotify('Media asset deleted.');
                            }
                          }}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center shrink-0 transition-colors"
                          title="Delete from media library"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredMedia.length} of {mediaLibrary.length} assets</span>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
