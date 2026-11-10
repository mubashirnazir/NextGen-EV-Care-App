import React, { useState } from 'react';
import { 
  Gauge, 
  CheckCircle2, 
  ArrowRight, 
  SlidersHorizontal, 
  Activity, 
  Sparkles,
  TrendingDown,
  Layers,
  Fuel
} from 'lucide-react';
import { ActiveTab, PortfolioItem } from '../../types';

interface DiagnosticPreviewProps {
  setActiveTab: (tab: ActiveTab) => void;
  featuredProjects: PortfolioItem[];
  onSelectProject: (project: PortfolioItem) => void;
}

export const DiagnosticPreview: React.FC<DiagnosticPreviewProps> = ({
  setActiveTab,
  featuredProjects,
  onSelectProject
}) => {
  // Mini interactive fuel calculator teaser state
  const [dailyKm, setDailyKm] = useState<number>(35);
  const petrolPrice = 280; // Rs/L
  const petrolMileage = 45; // km/L for 70cc
  const evUnitsPer100Km = 3.2; // kWh per 100km
  const electricityKwh = 42; // Rs/kWh

  const monthlyKm = dailyKm * 30;
  const monthlyPetrolCost = Math.round((monthlyKm / petrolMileage) * petrolPrice);
  const monthlyEvCost = Math.round((monthlyKm / 100) * evUnitsPer100Km * electricityKwh);
  const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyEvCost);

  return (
    <section className="space-y-10" aria-labelledby="diagnostic-preview-heading">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span className="uppercase tracking-widest text-[11px] font-bold">VERIFIED REPAIR OUTCOMES & DYNO DATA</span>
          </div>
          <h2 id="diagnostic-preview-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Real Gujranwala Case Studies & Savings Diagnostics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-2xl">
            Inspect our transparent repair bench results: before-and-after diagnostics, component cost savings, and direct fuel economy calculations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className="h-10 px-4 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 liquid-glass-subtle hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>View All Case Studies</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: 2/3 Case Studies, 1/3 Interactive Savings Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 2 Top Verified Outcome Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {featuredProjects.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectProject(item)}
              className="group cursor-pointer rounded-2xl liquid-glass-card overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-white/10 uppercase tracking-wider">
                    {item.vehicleModel}
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.completedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>Gujranwala</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">{item.metrics.label}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 text-sm">
                    {item.metrics.value}
                  </span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Interactive Dyno / Fuel Savings Calculator Teaser */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl liquid-glass-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly EV Fuel Savings
                </h3>
                <p className="text-[11px] text-slate-500">Gujranwala Commuter Live Dyno</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              70cc vs EV
            </span>
          </div>

          {/* Interactive Daily Commute Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Daily Commute Distance:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{dailyKm} km / day</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={dailyKm}
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10 km (Local)</span>
              <span>50 km (Cross-City)</span>
              <span>100 km (Courier)</span>
            </div>
          </div>

          {/* Cost Comparison Pill Boxes */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                <span>Petrol 70cc</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                Rs. {monthlyPetrolCost.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Rs. {petrolPrice}/L @ 45km/L</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 mb-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Electric Scooty</span>
              </div>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                Rs. {monthlyEvCost.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">Rs. {electricityKwh}/unit</p>
            </div>
          </div>

          {/* Monthly Savings Result */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                You Pocket Each Month:
              </p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Rs. {monthlySavings.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                {Math.round(((monthlyPetrolCost - monthlyEvCost) / (monthlyPetrolCost || 1)) * 100)}% Cheaper
              </span>
            </div>
          </div>

          {/* Full Calculator Jump Button */}
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className="w-full h-11 px-4 text-xs font-bold text-slate-900 dark:text-white liquid-glass hover:bg-white/90 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Launch Advanced ROI & Battery Health Calculator</span>
            <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
