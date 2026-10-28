import React, { useState } from 'react';
import { MessageSquare, X, Zap } from 'lucide-react';

export const WhatsAppWidget: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl =
    'https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20would%20like%20to%20inquire%20about%20electric%20scooter%20/%20bike%20service%20in%20Gujranwala.';

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 group">
      
      {/* Friendly Tooltip Bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 dark:bg-slate-900 border border-slate-700/80 text-white px-3 py-1.5 rounded-xl shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Chat with Master EV Tech</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 p-0.5"
            aria-label="Dismiss chat tip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp Chat with Next Gen EV Care"
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
      >
        {/* WhatsApp Icon representation */}
        <MessageSquare className="w-6 h-6 fill-slate-950 text-slate-950" />

        {/* Small lightning indicator badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
          <Zap className="w-3 h-3 fill-emerald-400" />
        </span>
      </a>

    </div>
  );
};
