import React, { useState, useEffect, useRef } from 'react';
import {
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ActiveTab } from '../types';

interface MaintenanceTip {
  id: number;
  category: string;
  icon: 'battery' | 'motor' | 'range' | 'maintenance' | 'safety';
  title: string;
  tip: string;
  actionText?: string;
  actionTab?: ActiveTab;
}

const EV_MAINTENANCE_TIPS: MaintenanceTip[] = [
  {
    id: 1,
    category: 'Monsoon & Rainy Season',
    icon: 'safety',
    title: 'Never wade through deep puddles.',
    tip: 'Submerging the hub motor axle or floorboard controller housing above axle level will trigger a BMS lockout or short-circuit your controller.',
    actionText: 'Book Doorstep Inspection',
    actionTab: 'contact'
  },
  {
    id: 2,
    category: 'Monsoon & Rainy Season',
    icon: 'maintenance',
    title: 'Dry the charging port completely.',
    tip: 'Always wipe the charging socket with a dry cloth before inserting the charger plug during humid or rainy days to prevent pin arcing.',
    actionText: 'EV Knowledge Base',
    actionTab: 'blog'
  },
  {
    id: 3,
    category: 'Long-Term Standby Storage',
    icon: 'battery',
    title: 'Storing your EV for weeks?',
    tip: 'Charge or discharge the lithium battery to 50%–60% state-of-charge before parking. Disconnect the main circuit breaker or battery MCB under the seat, and top it up to 50% every 4 to 6 weeks to prevent deep self-discharge cell damage.',
    actionText: 'Battery Care Pro-Tips',
    actionTab: 'blog'
  },
  {
    id: 4,
    category: 'Safe Cleaning & Washing',
    icon: 'safety',
    title: 'No high-pressure car-wash guns.',
    tip: 'Never spray high-pressure water directly under the seat compartment or near the hub motor axle seals. Always wash with a gentle bucket wash and wipe dry with a microfiber cloth.',
    actionText: 'Book Doorstep Inspection',
    actionTab: 'contact'
  },
  {
    id: 5,
    category: 'Battery Thermal Health',
    icon: 'battery',
    title: 'Wait 20 mins before hot summer charging.',
    tip: 'Let your battery cool for 20–30 minutes in shade after a long summer ride (>35°C) before plugging in the charger.',
    actionText: 'Check Battery Diagnostic',
    actionTab: 'calculator'
  },
  {
    id: 6,
    category: 'Battery Cycle Life',
    icon: 'battery',
    title: 'Follow the 20% to 80% daily rule.',
    tip: 'Charging between 20% and 80–85% for daily city commutes can more than double your lithium battery cycle life.',
    actionText: 'Simulate Cycle Life',
    actionTab: 'calculator'
  },
  {
    id: 7,
    category: 'Range Optimization',
    icon: 'range',
    title: 'Check tire pressure every two weeks.',
    tip: 'Under-inflated scooty tires (below 32 PSI) add drag, pull extra amps from your hub motor, and cut range by 15%–20%.',
    actionText: 'Calculate Range & PSI',
    actionTab: 'calculator'
  },
  {
    id: 8,
    category: 'BMS Cell Balancing',
    icon: 'maintenance',
    title: 'Do one monthly full-balance charge.',
    tip: 'Once a month, leave the charger plugged in for 60 minutes after reaching 100% so the Smart BMS can balance all cells.',
    actionText: 'EV Knowledge Base',
    actionTab: 'blog'
  }
];

interface DidYouKnowToastProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const DidYouKnowToast: React.FC<DidYouKnowToastProps> = ({ setActiveTab }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('nextgen_did_you_know_dismissed') === 'true';
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTip = EV_MAINTENANCE_TIPS[currentIndex];

  // Auto-cycle through tips every 12 seconds when not paused and not minimized
  useEffect(() => {
    if (isDismissed || isMinimized || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EV_MAINTENANCE_TIPS.length);
    }, 12000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDismissed, isMinimized, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % EV_MAINTENANCE_TIPS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + EV_MAINTENANCE_TIPS.length) % EV_MAINTENANCE_TIPS.length);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('nextgen_did_you_know_dismissed', 'true');
  };

  const handleActionClick = (tab?: ActiveTab) => {
    if (tab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isDismissed) {
    // Inverted frosted liquid-glass restore trigger pill
    return (
      <div className="fixed bottom-5 left-5 z-30">
        <button
          type="button"
          onClick={() => {
            setIsDismissed(false);
            sessionStorage.removeItem('nextgen_did_you_know_dismissed');
          }}
          className="did-you-know-float-glow flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl hover:border-emerald-400/60 hover:text-emerald-300 dark:bg-white/85 dark:text-slate-900 dark:border-white/40 dark:shadow-2xl dark:hover:border-emerald-600/60 dark:hover:text-emerald-700 text-xs font-semibold transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          title="Show EV Maintenance Tips"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 shrink-0" />
          <span>EV Pro Tips</span>
        </button>
      </div>
    );
  }

  // Minimized compact pill state (inverted frosted liquid-glass + float & glow)
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 left-5 z-30 max-w-xs animate-in fade-in slide-in-from-bottom-2">
        <div className="did-you-know-float-glow flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl dark:bg-white/85 dark:text-slate-900 dark:border-white/40 dark:shadow-2xl text-xs transition-all duration-300 hover:scale-[1.01]">
          <Lightbulb className="w-4 h-4 text-amber-400 dark:text-amber-600 shrink-0" />
          <span className="font-semibold text-white dark:text-slate-900 truncate">
            {currentTip.title}
          </span>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 transition-colors cursor-pointer"
            title="Expand tip card"
            aria-label="Expand maintenance tip"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 transition-colors cursor-pointer"
            title="Dismiss for this session"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="EV Maintenance Tips"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="did-you-know-float-glow fixed bottom-5 left-4 sm:left-5 z-30 w-[calc(100%-2rem)] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl p-6 md:p-8 space-y-5 backdrop-blur-xl bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl dark:bg-white/85 dark:text-slate-900 dark:border-white/40 dark:shadow-2xl transition-all duration-300 hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-3 overflow-hidden"
    >
      {/* Subtle breathing emerald/cyan ambient neon sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-emerald-400/15 via-cyan-400/10 to-transparent opacity-70 animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      {/* Top Banner & Control Bar */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800 dark:border-slate-200/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-300 dark:bg-amber-100 dark:border-amber-300 dark:text-amber-900 text-[11px] font-bold tracking-wide uppercase whitespace-nowrap">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 shrink-0" />
            <span>Did you know?</span>
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tabular-nums">
            {currentIndex + 1}/{EV_MAINTENANCE_TIPS.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-600 dark:hover:text-slate-900 dark:border-slate-200 transition-colors cursor-pointer"
            title="Previous tip"
            aria-label="Previous tip"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-600 dark:hover:text-slate-900 dark:border-slate-200 transition-colors cursor-pointer"
            title="Next tip"
            aria-label="Next tip"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-600 dark:hover:text-slate-900 dark:border-slate-200 transition-colors cursor-pointer"
            title="Minimize toast"
            aria-label="Minimize toast"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-600 dark:hover:text-slate-900 dark:border-slate-200 transition-colors cursor-pointer"
            title="Close for session"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Toast Content */}
      <div className="space-y-3">
        <div className="space-y-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 dark:bg-emerald-100 dark:border-emerald-300 dark:text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            {currentTip.category}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white dark:text-slate-900 leading-snug">
            {currentTip.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-700 leading-relaxed">
          {currentTip.tip}
        </p>

        {/* Action Link & Auto-rotation indicator */}
        <div className="flex items-center justify-between pt-1">
          {currentTip.actionText && (
            <button
              type="button"
              onClick={() => handleActionClick(currentTip.actionTab)}
              className="text-xs font-bold text-emerald-400 dark:text-emerald-700 hover:underline flex items-center gap-1 group cursor-pointer"
            >
              <span>{currentTip.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {EV_MAINTENANCE_TIPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-4 bg-emerald-400 dark:bg-emerald-600'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-600 dark:bg-slate-300 dark:hover:bg-slate-400'
                }`}
                title={`Go to tip ${idx + 1}`}
                aria-label={`Go to tip ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      {/* 
      <div className="pt-3.5 border-t border-slate-200/70 dark:border-white/10 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
        <span>
          <strong className="font-semibold text-slate-700 dark:text-slate-300">Advisory Note:</strong> AI-generated info related to EV scooty behaviors is an advisory benchmark and not fully implemented on your specific vehicle.
        </span>
      </div>
         */}
    </aside>
  );
};
