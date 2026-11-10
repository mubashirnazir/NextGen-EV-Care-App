import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  Image as ImageIcon, 
  AlertCircle,
  FolderOpen
} from 'lucide-react';

interface MultiImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  onOpenPicker: (onSelect: (url: string) => void) => void;
  maxImages?: number;
  label?: string;
  sublabel?: string;
}

export const MultiImageManager: React.FC<MultiImageManagerProps> = ({
  images = [],
  onChange,
  onOpenPicker,
  maxImages = 8,
  label = 'Gallery Photos & Teardown Diagrams',
  sublabel = 'Add up to 8 high-resolution photos for the shopping-app media slider'
}) => {
  const [directUrlInput, setDirectUrlInput] = useState('');
  const [showDirectInput, setShowDirectInput] = useState(false);

  const isAtLimit = images.length >= maxImages;

  const handleAddUrl = (url: string) => {
    const clean = url.trim();
    if (!clean) return;
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed per item.`);
      return;
    }
    if (images.includes(clean)) {
      alert('This image is already in the gallery.');
      return;
    }
    onChange([...images, clean]);
    setDirectUrlInput('');
    setShowDirectInput(false);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleMoveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const item = updated.splice(index, 1)[0];
    updated.unshift(item);
    onChange(updated);
  };

  return (
    <div className="p-4 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-sm space-y-4">
      
      {/* Header with Counter Guard Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>{label}</span>
            </label>
            <span 
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border transition-colors ${
                isAtLimit 
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}
            >
              Images: {images.length}/{maxImages}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {sublabel}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isAtLimit}
            onClick={() => {
              if (isAtLimit) return;
              onOpenPicker((selectedUrl) => {
                handleAddUrl(selectedUrl);
              });
            }}
            className={`h-9 px-3 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              isAtLimit 
                ? 'opacity-40 bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20'
            }`}
            title={isAtLimit ? `Limit reached (${maxImages}/${maxImages})` : 'Choose image from Media Library'}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Select from Library</span>
          </button>

          <button
            type="button"
            disabled={isAtLimit}
            onClick={() => setShowDirectInput((prev) => !prev)}
            className="h-9 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 liquid-glass hover:bg-white/80 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            {showDirectInput ? 'Cancel' : '+ Add URL'}
          </button>
        </div>
      </div>

      {/* Direct URL Input Bar (Collapsible) */}
      {showDirectInput && (
        <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center gap-2 animate-in fade-in">
          <input
            type="url"
            placeholder="Paste public image link (e.g. /src/assets/images/... or https://...)"
            value={directUrlInput}
            onChange={(e) => setDirectUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl(directUrlInput);
              }
            }}
            className="flex-1 h-9 px-3 text-xs rounded-lg liquid-glass text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={() => handleAddUrl(directUrlInput)}
            disabled={!directUrlInput.trim() || isAtLimit}
            className="h-9 px-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg shrink-0 cursor-pointer"
          >
            Add
          </button>
        </div>
      )}

      {/* Warning Alert if Limit Reached */}
      {isAtLimit && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>Maximum image limit of 8 reached. Remove an existing image below to add a new one.</span>
        </div>
      )}

      {/* Images Reorder & Delete Strip */}
      {images.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-1">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No photos in slider gallery</p>
          <p className="text-[11px] text-slate-400">The primary project photo will be used, or click "Select from Library" to populate the slider.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div 
              key={`${url}-${idx}`}
              className="group relative rounded-xl overflow-hidden liquid-glass border border-slate-200/80 dark:border-white/10 flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                <img
                  src={url}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Primary Tag or Position Pill */}
                <div className="absolute top-1.5 left-1.5">
                  {idx === 0 ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-slate-950" />
                      <span>Cover</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-950/75 text-white backdrop-blur-md">
                      #{idx + 1}
                    </span>
                  )}
                </div>

                {/* Remove Quick Action */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Position & Order Controls */}
              <div className="p-1.5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveLeft(idx)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move earlier"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMoveRight(idx)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move later"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Make Cover
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
