import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BrandItem {
  id: string;
  name: string;
  tagline: string;
  models: string;
  batteryTech: 'Graphene' | 'Li-Ion' | 'LiFePO4' | 'Dual';
  badgeColor?: string;
  symbol: string;
}

const EV_BRANDS: BrandItem[] = [
  {
    id: 'yadea',
    name: 'YADEA',
    tagline: 'Global Smart Mobility',
    models: 'T5 · E8S · Ruibin · G5',
    batteryTech: 'Dual',
    symbol: 'Y'
  },
  {
    id: 'metro',
    name: 'METRO EV',
    tagline: 'Urban Commuter Series',
    models: 'E8S Pro · T9 · M6',
    batteryTech: 'Graphene',
    symbol: 'M'
  },
  {
    id: 'crown',
    name: 'CROWN EV',
    tagline: 'Benling Powertrains',
    models: 'Hunter · Spark · Benling',
    batteryTech: 'Dual',
    symbol: 'C'
  },
  {
    id: 'united',
    name: 'UNITED EV',
    tagline: 'High Torque BLDC',
    models: 'Revolt · Bullet · Spark',
    batteryTech: 'Li-Ion',
    symbol: 'U'
  },
  {
    id: 'road-prince',
    name: 'ROAD PRINCE',
    tagline: 'Precision Inverters',
    models: 'Bella · Zeus · Robin',
    batteryTech: 'Graphene',
    symbol: 'RP'
  },
  {
    id: 'super-power',
    name: 'SUPER POWER',
    tagline: 'Economic Electric Commuters',
    models: 'Leo EV · Flyer · E-Scoot',
    batteryTech: 'Graphene',
    symbol: 'SP'
  },
  {
    id: 'honda-ev',
    name: 'HONDA EV',
    tagline: '72V Conversions & U-Go',
    models: 'CD 70 EV · CG 125 EV · U-Go',
    batteryTech: 'LiFePO4',
    symbol: 'H'
  },
  {
    id: 'evee',
    name: 'EVEE ELECTRIC',
    tagline: 'Modern Retro Scooters',
    models: 'C1 · C1 Pro · Gen-Z',
    batteryTech: 'Dual',
    symbol: 'E'
  },
  {
    id: 'vlektra',
    name: 'VLEKTRA',
    tagline: 'Performance Street E-Bikes',
    models: 'Retro · Bolt · 1969',
    batteryTech: 'Li-Ion',
    symbol: 'V'
  },
  {
    id: 'ms-jaggi',
    name: 'MS JAGGI EV',
    tagline: 'Heavy Duty Commercial',
    models: 'City Runner · Cargo Pro',
    batteryTech: 'Dual',
    symbol: 'MS'
  }
];

interface BrandLogoCarouselProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const BrandLogoCarousel: React.FC<BrandLogoCarouselProps> = ({ setActiveTab }) => {
  // Duplicate list to achieve continuous seamless -50% marquee loop
  const marqueeItems = [...EV_BRANDS, ...EV_BRANDS];

  return (
    <section 
      className="space-y-6 pt-2 pb-4 overflow-hidden select-none"
      aria-label="Supported EV Brands & Platforms"
    >
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="max-w-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="uppercase">TRUSTED EXPERTISE ACROSS ALL MAJOR PLATFORMS & MODELS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Repair & Diagnostic Support for Every Brand
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            From factory Sino-Pakistani electric scooties to custom lithium builds, our mobile technicians carry genuine hall sensors, sealed SKF bearings, and calibrated testing gear for all popular makes in Gujranwala.
          </p>
        </div>

        {setActiveTab && (
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Test Your Model On Range Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Marquee Wrapper with Horizontal Edge Vignette Fading */}
      <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] py-2">
        <div className="flex w-max items-center gap-4 sm:gap-6 animate-infinite-scroll hover:[animation-play-state:paused] will-change-transform">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              onClick={() => {
                if (setActiveTab) setActiveTab('contact');
              }}
              className="group cursor-pointer shrink-0 w-[240px] sm:w-[260px] p-4 sm:p-5 rounded-2xl liquid-glass border border-white/80 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Brand Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Monogram / Vector Symbol Pill */}
                    <div className="w-9 h-9 rounded-xl bg-slate-950 dark:bg-white text-emerald-400 dark:text-slate-950 font-extrabold text-xs flex items-center justify-center font-mono shadow-md border border-white/20 dark:border-slate-800">
                      {brand.symbol}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wider group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {brand.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {brand.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {brand.batteryTech}
                  </span>
                </div>

                {/* Popular Models Strip */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/10">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block mb-1">
                    Serviced Models:
                  </span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 font-mono truncate">
                    {brand.models}
                  </p>
                </div>
              </div>

              {/* Card Footer Coverage Tag */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Doorstep Ready</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  <span>Book</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
