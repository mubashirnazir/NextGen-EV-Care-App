import React from 'react';
import { Truck, ArrowRight, Gauge, MapPin, Wrench, Percent, ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../../types';

interface HomeHeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ setActiveTab }) => {
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

          {/* Dual Call-to-Action Buttons (Uniform Sizing: h-11 px-5 rounded-xl) */}
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

            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className="h-11 px-5 text-sm font-semibold text-slate-800 dark:text-slate-100 liquid-glass hover:bg-white/90 dark:hover:bg-slate-800/90 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Gauge className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Diagnostic Calculator</span>
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

      {/* Minimalist Proof Metrics Strip */}
      <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl liquid-glass-card grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
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
