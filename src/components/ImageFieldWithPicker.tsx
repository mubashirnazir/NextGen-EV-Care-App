import React, { useRef } from 'react';
import { MediaAsset } from '../types';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  FolderOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ImageFieldWithPickerProps {
  label?: string;
  sublabel?: string;
  value: string;
  onChange: (url: string) => void;
  onOpenPicker: () => void;
  onAddMedia: (asset: MediaAsset) => void;
  onNotify: (msg: string) => void;
  required?: boolean;
}

export const ImageFieldWithPicker: React.FC<ImageFieldWithPickerProps> = ({
  label = 'Photo Asset',
  sublabel = 'Select from workshop assets, upload new photos, or remove image',
  value,
  onChange,
  onOpenPicker,
  onAddMedia,
  onNotify,
  required = false
}) => {
  const directInputRef = useRef<HTMLInputElement>(null);

  const handleDirectUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/jpg'];

    if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpe?g|png|webp|svg)$/i)) {
      onNotify(`Invalid format for "${file.name}". Supported: JPEG, PNG, WebP, SVG`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onNotify('Image exceeds 5MB limit. Please upload an optimized file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newAsset: MediaAsset = {
        id: `media-upload-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: dataUrl,
        sizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
        sizeBytes: file.size,
        type: file.type || 'image/jpeg',
        source: 'upload',
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      onAddMedia(newAsset);
      onChange(dataUrl);
      onNotify(`Uploaded and set "${file.name}" as photo.`);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    onChange('');
    onNotify('Image removed from this record.');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
            {label} {required && <span className="text-emerald-500">*</span>}
          </label>
          {sublabel && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {sublabel}
            </p>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={handleClearImage}
            className="h-7 px-2.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-lg flex items-center gap-1 transition-colors"
            title="Remove and unbind image from this item"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Preview Container */}
        <div className="relative w-full sm:w-28 h-20 sm:h-20 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center group shadow-xs">
          {value ? (
            <>
              <img
                src={value}
                alt="Selected media"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                title="Remove image"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 text-center p-2">
              <ImageIcon className="w-6 h-6 mb-1 text-slate-300 dark:text-slate-600" />
              <span className="text-[10px] font-medium">No Image</span>
            </div>
          )}
        </div>

        {/* Input & Action Buttons */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste image URL or click Browse..."
              className="flex-1 h-10 px-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenPicker}
              className="h-9 px-3.5 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Browse Library</span>
            </button>

            <button
              type="button"
              onClick={() => directInputRef.current?.click()}
              className="h-9 px-3 text-xs font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-500" />
              <span>Upload from Device</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleClearImage}
                className="h-9 px-3 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear / Remove</span>
              </button>
            )}

            <input
              ref={directInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => handleDirectUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
