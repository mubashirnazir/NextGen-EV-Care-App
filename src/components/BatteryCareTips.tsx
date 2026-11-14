import React, { useState, useEffect, useCallback } from 'react';
import { BatteryChemistry } from './EVCalculator';
import {
  ChevronLeft,
  ChevronRight,
  BatteryCharging,
  ShieldCheck,
  Thermometer,
  Zap,
  Gauge,
  Pause,
  Play
} from 'lucide-react';

interface ProTipItem {
  id: string;
  tag: string;
  accentTone: 'emerald' | 'amber';
  title: string;
  guidance: string;
  ruleLabel: string;
  ruleValue: string;
}

interface ChemistryTipProfile {
  id: BatteryChemistry;
  label: string;
  shortLabel: string;
  cellVoltage: string;
  cycleExpectancy: string;
  tips: ProTipItem[];
}

const ROTATION_INTERVAL_MS = 15000;
const TICK_INTERVAL_MS = 100;

const BATTERY_TIPS_ENGINE: Record<BatteryChemistry, ChemistryTipProfile> = {
  lifepo4: {
    id: 'lifepo4',
    label: 'LiFePO4 (Lithium Iron Phosphate)',
    shortLabel: 'LiFePO4',
    cellVoltage: '3.2V Nominal / Cell',
    cycleExpectancy: '2,000 – 3,500 Cycles',
    tips: [
      {
        id: 'lfp-balance',
        tag: 'Monthly Calibration',
        accentTone: 'emerald',
        title: 'Run a 100% Full-Charge Balance Once Every Month',
        guidance:
          'LiFePO4 cells maintain a very flat 3.2V–3.3V discharge plateau, making mid-pack state-of-charge hard for the BMS to estimate. Charge fully to 100% (3.65V/cell) once every 30 days so the balancer equalizes all series groups.',
        ruleLabel: 'Target Balance Voltage',
        ruleValue: '3.65V / cell monthly',
      },
      {
        id: 'lfp-cycles',
        tag: 'Cycle Longevity',
        accentTone: 'emerald',
        title: '2,000+ Deep Cycles With Minimal Voltage Sag',
        guidance:
          'Unlike standard chemistries, LiFePO4 handles routine 80%–90% depth of discharge cleanly while delivering steady acceleration torque until the final 10% of pack capacity.',
        ruleLabel: 'Rated Service Life',
        ruleValue: '2,000+ cycles @ 80% DoD',
      },
      {
        id: 'lfp-temp',
        tag: 'Thermal Resilience',
        accentTone: 'amber',
        title: 'High Heat Stability & Sub-Zero Charging Caution',
        guidance:
          'LFP olivine crystal chemistry resists thermal runaway even in peak 45°C Gujranwala summers. However, avoid plugging in a fast charger when cell temperature drops below 0°C to prevent metallic lithium plating.',
        ruleLabel: 'Safe Charge Window',
        ruleValue: '0°C to 45°C',
      },
      {
        id: 'lfp-cutoff',
        tag: 'BMS Protection',
        accentTone: 'amber',
        title: 'Respect the 2.5V/Cell Low-Voltage Cut-Off',
        guidance:
          'Even though LFP tolerates deep discharge well, running past BMS cut-off and leaving the pack uncharged for weeks causes permanent copper shunt corrosion. Recharge promptly after a full drain.',
        ruleLabel: 'Minimum Cell Floor',
        ruleValue: '2.50V / cell cut-off',
      },
    ],
  },
  'li-ion': {
    id: 'li-ion',
    label: 'Lithium-Ion (NMC / NCA)',
    shortLabel: 'Lithium-Ion',
    cellVoltage: '3.6V Nominal / Cell',
    cycleExpectancy: '800 – 1,200 Cycles',
    tips: [
      {
        id: 'nmc-sweetspot',
        tag: '20% – 80% Rule',
        accentTone: 'emerald',
        title: 'Keep Daily Charging Between 20% and 80% SOC',
        guidance:
          'High-density 3.6V NMC/NCA cells experience high cathode lattice stress above 4.10V. Stopping daily top-ups around 80%–85% can nearly double usable cycle count compared to daily 100% charging.',
        ruleLabel: 'Optimal Daily Band',
        ruleValue: '20% – 80% SOC',
      },
      {
        id: 'nmc-heat',
        tag: 'Summer Heat Alert',
        accentTone: 'amber',
        title: 'Never Store at 100% Charge in Gujranwala Summer Heat',
        guidance:
          'Leaving a 3.6V/cell pack parked at 100% (4.20V/cell) inside a hot 40°C+ garage accelerates electrolyte oxidation and permanent range loss. Park at 40%–60% SOC if not riding for more than 48 hours.',
        ruleLabel: 'Storage SOC in Heat',
        ruleValue: '40% – 60% (< 30°C)',
      },
      {
        id: 'nmc-cooldown',
        tag: 'Thermal Protection',
        accentTone: 'amber',
        title: 'Wait 25 Minutes After High-Speed Rides Before Charging',
        guidance:
          'Sustained 45+ km/h throttle heats internal cylindrical cells. Letting the battery cool in shade for 20–30 minutes before plugging in prevents BMS thermal throttling and separator fatigue.',
        ruleLabel: 'Post-Ride Cooldown',
        ruleValue: '20 – 30 mins shaded',
      },
      {
        id: 'nmc-cutoff',
        tag: 'Cell Recovery Care',
        accentTone: 'emerald',
        title: 'Avoid Letting Pack Sit Below 3.0V Per Cell',
        guidance:
          'If your scooty trips low-voltage cut-off, plug it in the same evening. Parasitic BMS draw on an empty pack can pull cells below 2.5V and lock the pack out of standard charging.',
        ruleLabel: 'Cut-Off Threshold',
        ruleValue: '3.00V / cell minimum',
      },
    ],
  },
  graphene: {
    id: 'graphene',
    label: 'Graphene / Lead-Acid Gel',
    shortLabel: 'Graphene',
    cellVoltage: '12V Monoblock Nominal',
    cycleExpectancy: '450 – 650 Cycles',
    tips: [
      {
        id: 'gr-floor',
        tag: 'Sulfation Prevention',
        accentTone: 'amber',
        title: 'Never Drain Below 10.5V Per 12V Block Under Load',
        guidance:
          'Deeply discharging a 48V/60V/72V Graphene or Lead-Acid Gel string below 10.5V per block rapidly forms hard lead-sulfate crystals on the plates, permanently slashing single-charge range.',
        ruleLabel: 'Hard Voltage Floor',
        ruleValue: '10.5V / 12V block',
      },
      {
        id: 'gr-terminals',
        tag: 'Terminal Anti-Oxidation',
        accentTone: 'emerald',
        title: 'Clean Sulfated Busbars & Torque Terminal Bolts Monthly',
        guidance:
          'Loose or oxidized M6/M8 terminal bridges create localized resistance spikes that overheat wiring and unbalance adjacent blocks. Brush terminals clean and apply anti-oxidation grease every 30 days.',
        ruleLabel: 'Inspection Cadence',
        ruleValue: 'Every 30 days',
      },
      {
        id: 'gr-charger',
        tag: 'Charger Current Rating',
        accentTone: 'amber',
        title: 'Match Trickle / Float Charger Amps to 0.1C – 0.15C',
        guidance:
          'Oversized high-amp chargers boil Gel electrolyte and warp battery casings. Always use an automatic 3-stage charger rated around 2.5A–4A with a controlled 13.6V–13.8V per-block float stage.',
        ruleLabel: 'Recommended Charge Rate',
        ruleValue: '0.1C – 0.15C (3-stage)',
      },
      {
        id: 'gr-recharge',
        tag: '100% Habit Rule',
        accentTone: 'emerald',
        title: 'Recharge Right After Every Ride — Never Leave Partial',
        guidance:
          'Unlike lithium packs, Graphene and VRLA Gel batteries perform longest when kept topped up at 100% after cooling. Leaving them at 40% overnight accelerates irreversible plate sulfation.',
        ruleLabel: 'Ideal Resting State',
        ruleValue: '100% SOC after cooldown',
      },
    ],
  },
};

export interface BatteryCareTipsProps {
  activeChemistry: BatteryChemistry;
  onSelectChemistry?: (chemistry: BatteryChemistry) => void;
  onNavigateToCalculator?: () => void;
}

export const BatteryCareTips: React.FC<BatteryCareTipsProps> = ({
  activeChemistry,
  onSelectChemistry,
  onNavigateToCalculator,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const profile = BATTERY_TIPS_ENGINE[activeChemistry] || BATTERY_TIPS_ENGINE['li-ion'];
  const tips = profile.tips;
  const safeIndex = tipIndex % tips.length;
  const currentTip = tips[safeIndex];

  // Reset to first tip & full 15s timer whenever active chemistry changes
  useEffect(() => {
    setTipIndex(0);
    setElapsedMs(0);
  }, [activeChemistry]);

  const handleNext = useCallback(() => {
    setTipIndex((prev) => (prev + 1) % tips.length);
    setElapsedMs(0);
  }, [tips.length]);

  const handlePrev = useCallback(() => {
    setTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
    setElapsedMs(0);
  }, [tips.length]);

  // Automatic 15-second rotating timer with smooth progress tracking
  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + TICK_INTERVAL_MS;
        if (next >= ROTATION_INTERVAL_MS) {
          setTipIndex((idx) => (idx + 1) % tips.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, tips.length]);

  const progressFraction = Math.min(1, Math.max(0, elapsedMs / ROTATION_INTERVAL_MS));
  const secondsRemaining = Math.max(1, Math.ceil((ROTATION_INTERVAL_MS - elapsedMs) / 1000));

  return (
    <section
      aria-label="Battery Care Pro-Tips"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="mb-8 rounded-2xl p-6 sm:p-7 transition-colors duration-300 bg-slate-900 text-slate-100 border border-slate-800 shadow-xl dark:bg-white/90 dark:text-slate-900 dark:border-white/40 dark:shadow-2xl backdrop-blur-xl"
    >
      {/* Top Row: Eyebrow + Chemistry Sync Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800 dark:border-slate-200/90">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 dark:text-emerald-700">
              <BatteryCharging className="w-4 h-4 shrink-0" />
              <span>Battery Care Pro-Tips</span>
            </span>
            <span aria-hidden="true" className="text-slate-600 dark:text-slate-400">
              ·
            </span>
            <span className="text-slate-400 dark:text-slate-600 font-mono tabular-nums">
              Synced with Calculator: {profile.shortLabel} ({profile.cellVoltage})
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white dark:text-slate-900">
            {profile.label} Maintenance &amp; Lifespan Rules
          </h2>
        </div>

        {/* Interactive Chemistry Selector Pills */}
        <div
          role="group"
          aria-label="Select battery chemistry tips"
          className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-800/90 border border-slate-700/80 dark:bg-slate-100 dark:border-slate-200 self-start lg:self-auto"
        >
          {(['lifepo4', 'li-ion', 'graphene'] as BatteryChemistry[]).map((chemKey) => {
            const item = BATTERY_TIPS_ENGINE[chemKey];
            const isActive = activeChemistry === chemKey;
            return (
              <button
                key={chemKey}
                type="button"
                onClick={() => onSelectChemistry?.(chemKey)}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-400 text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-300 hover:text-white dark:text-slate-600 dark:hover:text-slate-900'
                }`}
              >
                {item.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Carousel Snippet Viewport */}
      <div className="py-5 sm:py-6 min-h-[170px] flex flex-col justify-between gap-5" aria-live="polite">
        <div
          key={`${activeChemistry}-${currentTip.id}`}
          className="space-y-3.5 animate-in fade-in duration-300"
        >
          {/* Vibrant Emerald / Amber Accent Badges + Tip Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  currentTip.accentTone === 'emerald'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35 dark:bg-emerald-100 dark:text-emerald-800 dark:border-emerald-300'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/35 dark:bg-amber-100 dark:text-amber-800 dark:border-amber-300'
                }`}
              >
                {currentTip.accentTone === 'emerald' ? (
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Thermometer className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{currentTip.tag}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-800 text-emerald-300 border border-slate-700 dark:bg-slate-100 dark:text-emerald-700 dark:border-slate-300 tabular-nums">
                <Zap className="w-3 h-3 shrink-0" />
                <span>{currentTip.ruleLabel}: {currentTip.ruleValue}</span>
              </span>
            </div>

            <span className="text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500">
              Tip {safeIndex + 1} / {tips.length} · {profile.cycleExpectancy}
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-white dark:text-slate-900 leading-snug">
            {currentTip.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-300 dark:text-slate-700 leading-relaxed max-w-4xl">
            {currentTip.guidance}
          </p>
        </div>
      </div>

      {/* Bottom Controls & 15s Rotation Progress Bar */}
      <div className="pt-4 border-t border-slate-800 dark:border-slate-200/90 space-y-3.5">
        {/* Progress Indicator Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <span>{isPaused ? 'Auto-rotation paused while reading' : 'Rotating automatically every 15s'}</span>
            </span>
            <span>{isPaused ? 'Paused' : `Next tip in ${secondsRemaining}s`}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 dark:bg-slate-200 overflow-hidden">
            <div
              className="h-full w-full bg-emerald-400 dark:bg-emerald-600 origin-left transition-transform duration-100 ease-linear"
              style={{ transform: `scaleX(${progressFraction})` }}
            />
          </div>
        </div>

        {/* Navigation Pills & Dots */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Manual Previous / Next Pills + Pause Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="h-10 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 dark:border-slate-300"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="h-10 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume 15-second auto rotation' : 'Pause 15-second auto rotation'}
              className="h-10 w-10 rounded-full flex items-center justify-center transition-colors cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-700 dark:border-slate-300"
              title={isPaused ? 'Resume rotation' : 'Pause rotation'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Slide Dots + Calculator Sync Link */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Tip slides">
              {tips.map((tip, idx) => (
                <button
                  key={tip.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === safeIndex}
                  aria-label={`Show tip ${idx + 1}: ${tip.title}`}
                  onClick={() => {
                    setTipIndex(idx);
                    setElapsedMs(0);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === safeIndex
                      ? 'w-6 bg-emerald-400 dark:bg-emerald-600'
                      : 'w-2 bg-slate-700 hover:bg-slate-600 dark:bg-slate-300 dark:hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {onNavigateToCalculator && (
              <button
                type="button"
                onClick={onNavigateToCalculator}
                className="h-10 px-3.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 dark:bg-amber-100 dark:hover:bg-amber-200 dark:text-amber-900 dark:border-amber-300"
              >
                <Gauge className="w-3.5 h-3.5 shrink-0" />
                <span>Simulate {profile.shortLabel} Range</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
