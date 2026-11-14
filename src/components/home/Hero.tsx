import React from 'react';
import {
  Truck,
  ArrowRight,
  Gauge,
  BatteryCharging,
  HeartPulse,
  MapPin,
  Wrench,
  Percent
} from 'lucide-react';
import { ActiveTab } from '../../types';
import type { CalculatorTab } from '../EVCalculator';

interface HomeHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCalculator?: (tab: CalculatorTab) => void;
}

interface CalculatorCardConfig {
  id: CalculatorTab;
  title: string;
  benefit: string;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientClass: string;
  borderGlowClass: string;
  iconBoxClass: string;
  accentTextClass: string;
  pulseDotClass: string;
}

const CALCULATOR_CARDS: CalculatorCardConfig[] = [
  {
    id: 'range',
    title: 'Range & Savings',
    benefit: 'Simulate real-world km per charge, weather impact, and monthly PKR fuel savings.',
    ctaLabel: 'Open Range Tool',
    icon: Gauge,
    gradientClass: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/25',
    borderGlowClass: 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]',
    iconBoxClass: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-600 dark:text-emerald-300',
    accentTextClass: 'text-emerald-700 dark:text-emerald-300',
    pulseDotClass: 'bg-emerald-400',
  },
  {
    id: 'health',
    title: 'Battery Health',
    benefit: 'Check remaining lithium SOH %, cycle life expectancy, and pack wear status.',
    ctaLabel: 'Check Lifespan',
    icon: HeartPulse,
    gradientClass: 'from-amber-500/20 via-orange-500/10 to-yellow-500/25',
    borderGlowClass: 'border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    iconBoxClass: 'bg-amber-500/15 border-amber-500/35 text-amber-600 dark:text-amber-300',
    accentTextClass: 'text-amber-700 dark:text-amber-300',
    pulseDotClass: 'bg-amber-400',
  },
  {
    id: 'charge',
    title: 'Charge Time & Cost',
    benefit: 'Calculate exact recharge duration by charger amps and WAPDA unit bill cost.',
    ctaLabel: 'Estimate Charge',
    icon: BatteryCharging,
    gradientClass: 'from-violet-500/20 via-purple-500/10 to-pink-500/25',
    borderGlowClass: 'border-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)]',
    iconBoxClass: 'bg-violet-500/15 border-violet-500/35 text-violet-600 dark:text-violet-300',
    accentTextClass: 'text-violet-700 dark:text-violet-300',
    pulseDotClass: 'bg-violet-400',
  },
];

export const HomeHero: React.FC<HomeHeroProps> = ({ setActiveTab, onOpenCalculator }) => {
  const handleSelectCalculator = (tab: CalculatorTab) => {
    if (onOpenCalculator) {
      onOpenCalculator(tab);
    } else {
      setActiveTab('calculator');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-2 sm:pt-6" aria-labelledby="home-hero-heading">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left Headline & Value Prop */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Domain Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="uppercase tracking-widest text-[11px] font-bold">DOORSTEP & WORKSHOP SERVICE · GUJRANWALA</span>
          </div>

          {/* High-Impact Headline */}
          <h1 
            id="home-hero-heading" 
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
            style={{ textWrap: 'balance' }}
          >
            Mobile EV & E-Bike Repair in Gujranwala
          </h1>

          {/* Concise Value Proposition */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Fast, reliable, and certified on-call doorstep repair for electric scooties, lithium packs, and e-bikes. 
            Whether you ride a <span className="text-slate-900 dark:text-white font-semibold">Yadea, Metro, Crown, Evee, or United</span>, 
            our certified technicians resolve 85% of motor, battery, and controller issues directly on your driveway across Gujranwala.
          </p>

          {/* Primary Call-to-Action Button */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className="h-11 px-5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Truck className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Book Repair</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>

          {/* Minimalist Micro Badges */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-xl liquid-glass-subtle">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  Doorstep in Gujranwala
                </span>
              </div>

              <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-xl liquid-glass-subtle">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  Zero Rewinding Guarantee
                </span>
              </div>

              <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-xl liquid-glass-subtle">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  70%+ Cost Savings
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Media Column - Zero Lazy Loading for First Fold 100% Performance */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden liquid-glass shadow-xl group">
            <img
              src="/src/assets/images/hero_ev_workshop_1792957574841.jpg"
              alt="Next Gen EV Care mobile technician facility and electric scooty diagnostics workshop in Gujranwala"
              className="w-full aspect-[4/3] object-cover group-hover:scale-[1.015] transition-transform duration-500"
              loading="eager"
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 sm:p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-400">Mobile Van & Mughal Plaza Hub</p>
                  <p className="text-sm font-bold text-white">Gujranwala Doorstep & Workshop Facility</p>
                </div>
                <div className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg backdrop-blur-md">
                  Active On-Call
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Full-Width Liquid-Glass Neon Calculators Grid */}
      <div className="w-full py-6 mt-10 sm:mt-14 space-y-5" aria-labelledby="hero-calculators-heading">
        <div className="space-y-1.5">
          <h2
            id="hero-calculators-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Calculators
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Instant real-world EV tools for range, lithium battery health, and running costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CALCULATOR_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleSelectCalculator(card.id)}
                className={`relative overflow-hidden text-left group backdrop-blur-2xl bg-white/70 dark:bg-slate-900/60 border rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer flex flex-col justify-between gap-6 min-h-[210px] ${card.borderGlowClass}`}
              >
                {/* Ambient Neon Gradient Glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradientClass} opacity-80 group-hover:opacity-100 transition-opacity -z-10`}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${card.iconBoxClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${card.accentTextClass}`}>
                      <span className={`w-2 h-2 rounded-full animate-pulse ${card.pulseDotClass}`} />
                      <span>Live Tool</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {card.benefit}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-white/10 text-xs sm:text-sm font-bold ${card.accentTextClass}`}>
                  <span>{card.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimalist Proof Metrics Strip */}
      <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl liquid-glass-card grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            85%+
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">
            Doorstep Resolution
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resolved right on your driveway
          </p>
        </div>

        <div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            1,450+
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">
            EV 2-Wheelers Serviced
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Metro, Yadea, Crown, United & Honda
          </p>
        </div>

        <div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            70%+
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">
            Average Cost Savings
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Versus full assembly replacement
          </p>
        </div>

        <div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            500+
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">
            Happy Scooties
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Serviced in Gujranwala City
          </p>
        </div>
      </div>
    </section>
  );
};
