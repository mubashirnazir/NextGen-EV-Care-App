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
    category: 'Battery Thermal Health',
    icon: 'battery',
    title: 'Wait 20 Mins Before Hot Summer Charging',
    tip: 'Never plug your lithium battery immediately after a long ride in peak Pakistani summer (>35°C). Let cells cool down for 20–30 mins to prevent accelerated capacity fade.',
    actionText: 'Check Battery Diagnostic',
    actionTab: 'calculator'
  },
  {
    id: 2,
    category: 'Motor & Ingress Safety',
    icon: 'safety',
    title: 'Never Pressure-Wash Hub Motors or Under-Seat',
    tip: 'Car-wash pressure guns force water past hub axle oil seals and into the controller compartment. Always clean motor wheels and harness covers with a damp microfiber cloth.',
    actionText: 'Book Doorstep Inspection',
    actionTab: 'contact'
  },
  {
    id: 3,
    category: 'Battery Cycle Life',
    icon: 'battery',
    title: 'The 20% to 80% Daily Commuter Rule',
    tip: 'For daily city commuting, charging between 20% and 80–85% can more than double your lithium battery cycle life from 1,000 cycles to over 2,500 cycles.',
    actionText: 'Simulate Cycle Life',
    actionTab: 'calculator'
  },
  {
    id: 4,
    category: 'Range Optimization',
    icon: 'range',
    title: 'Low Tire Pressure Can Steal 15–20% Range',
    tip: 'Under-inflated scooty tires (under 32 PSI) cause severe rolling resistance, forcing your hub motor to draw 4–6 extra Amps and robbing up to 15 km per charge.',
    actionText: 'Calculate Range & PSI',
    actionTab: 'calculator'
  },
  {
    id: 5,
    category: 'BMS Cell Balancing',
    icon: 'maintenance',
    title: 'Perform a Monthly Equalizing Charge',
    tip: 'Once a month, leave your charger connected for an extra 60–90 minutes after reaching 100%. This allows the Smart BMS to balance individual series cell voltages.',
    actionText: 'EV Knowledge Base',
    actionTab: 'blog'
  },
  {
    id: 6,
    category: 'Mechanical Protection',
    icon: 'motor',
    title: 'Replace Hub Wheel Bearings Promptly',
    tip: 'If you feel vibration or faint grinding in the rear wheel, replace hub bearings with sealed Japanese SKF/NTN units immediately to prevent motor magnets from touching the stator.',
    actionText: 'Our Repair Portfolio',
    actionTab: 'portfolio'
  },
  {
    id: 7,
    category: 'Electrical Diagnostics',
    icon: 'safety',
    title: 'Brake Lever Sensor Cutoffs',
    tip: 'If your scooty suddenly loses acceleration after bumps, check your brake lever micro-switches. Road dust can stick the cutoff sensor, telling the controller to block throttle.',
    actionText: 'Talk to EV Tech',
    actionTab: 'contact'
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
    // Subtle frosted liquid-glass restore trigger pill
    return (
      <div className="fixed bottom-5 left-5 z-30">
        <button
          type="button"
          onClick={() => {
            setIsDismissed(false);
            sessionStorage.removeItem('nextgen_did_you_know_dismissed');
          }}
          className="did-you-know-float-glow flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/75 dark:bg-slate-900/65 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 hover:border-emerald-500/60 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold transition-colors duration-300 cursor-pointer"
          title="Show EV Maintenance Tips"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
          <span>EV Pro Tips</span>
        </button>
      </div>
    );
  }

  // Minimized compact pill state (frosted liquid-glass + gentle float & glow)
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 left-5 z-30 max-w-xs animate-in fade-in slide-in-from-bottom-2">
        <div className="did-you-know-float-glow flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl bg-white/75 dark:bg-slate-900/65 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 text-xs transition-colors duration-300">
          <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white truncate">
            {currentTip.title}
          </span>
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            title="Expand tip card"
            aria-label="Expand maintenance tip"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
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
      className="did-you-know-float-glow fixed bottom-5 left-4 sm:left-5 z-30 w-[calc(100%-2rem)] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl p-6 md:p-8 space-y-5 backdrop-blur-xl bg-white/75 dark:bg-slate-900/65 border border-white/60 dark:border-white/10 text-slate-900 dark:text-slate-100 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-3 overflow-hidden"
    >
      {/* Subtle breathing emerald/cyan ambient neon sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-emerald-400/15 via-cyan-400/10 to-transparent opacity-70 animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      {/* Top Banner & Control Bar */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200/70 dark:border-white/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-800 dark:text-amber-300 text-[11px] font-bold tracking-wide uppercase whitespace-nowrap">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
            <span>Did you know?</span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {currentIndex + 1}/{EV_MAINTENANCE_TIPS.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/15 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
            title="Previous tip"
            aria-label="Previous tip"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/15 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
            title="Next tip"
            aria-label="Next tip"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/15 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
            title="Minimize toast"
            aria-label="Minimize toast"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/15 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
            {currentTip.category}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
            {currentTip.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentTip.tip}
        </p>

        {/* Action Link & Auto-rotation indicator */}
        <div className="flex items-center justify-between pt-1">
          {currentTip.actionText && (
            <button
              type="button"
              onClick={() => handleActionClick(currentTip.actionTab)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 group cursor-pointer"
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
                    ? 'w-4 bg-emerald-500 dark:bg-emerald-400'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600'
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
