import React from 'react';
import { ActiveTab, PortfolioItem, BlogPost } from '../types';
import { 
  Zap, 
  BatteryCharging, 
  Gauge, 
  ArrowRight, 
  Wrench, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  featuredProjects: PortfolioItem[];
  topGuides: BlogPost[];
  onSelectProject: (project: PortfolioItem) => void;
  onSelectGuide: (guide: BlogPost) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setActiveTab,
  featuredProjects,
  topGuides,
  onSelectProject,
  onSelectGuide
}) => {
  return (
    <div className="space-y-16 md:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Domain Kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-400">
                <span className="uppercase">Precision Two-Wheeler EV Engineering</span>
                <span aria-hidden="true">·</span>
                <span>Bengaluru High-Tech Lab</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
                Next-Gen Maintenance & Custom Conversions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Electric Bikes & Scooters</span>.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Specialized in smart Li-ion battery pack fabrication, BLDC motor rewinding, FOC controller tuning, and IC-engine to highway-ready electric conversions. Fast diagnostics, zero guesswork.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="px-5 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition-all flex items-center gap-2 group whitespace-nowrap shrink-0"
                >
                  <Gauge className="w-4 h-4 text-slate-950" />
                  <span>Launch EV Range & Charge Calculator</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('portfolio')}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Build Case Studies
                </button>
              </div>

              {/* Trust Attributes */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ISO Grade Cell Balancing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>IP67 Waterproof Harnesses</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>48V / 60V / 72V Specialists</span>
                </div>
              </div>
            </div>

            {/* Right Media Column - Dominant Focal Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl group">
                <img
                  src="/src/assets/images/hero_ev_workshop_1792957574841.jpg"
                  alt="Next Gen EV Care Workshop Facility with electric scooter inspection"
                  className="w-full aspect-[16/10] sm:aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-400">Live Diagnostic Bay 01</p>
                      <p className="text-sm font-bold text-white">High-Voltage Battery & Inverter Test Bench</p>
                    </div>
                    <span className="text-xs bg-slate-900/80 border border-slate-700 px-2.5 py-1 rounded text-slate-300 tabular-nums">
                      24h Turnaround
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Adjacent Quantitative Proof Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                1,450+
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                EV 2-Wheelers Serviced
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Multi-brand scooters & bikes
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                99.4%
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Diagnostic Accuracy
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Calibrated oscilloscope testing
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                320+
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Custom Li-ion Packs Built
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Smart BMS & active balancing
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
                4.9 / 5.0
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Customer Satisfaction
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Verified rider ratings
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Core Engineering Capabilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <span>SPECIALIZED WORKSHOP SERVICES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              End-to-End Electric Two-Wheeler Care
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
            From emergency battery revive and controller repair to full custom retrofits with highway homologation guidance.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Battery Tech & Pack Rebuilding (Col span 1) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">01. Cell Diagnostics & Building</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Li-ion & LFP Battery Packs</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Custom cell spot welding with pneumatic pulse rigs, active balancing integration, low-resistance nickel copper busbars, and deep cycle rejuvenation.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Grade A 21700 / Prismatic</span>
              <button 
                onClick={() => setActiveTab('portfolio')} 
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
              >
                View Builds <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Custom Conversions (Col span 1) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">02. IC to Electric Conversions</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Petrol-to-Electric Retrofitting</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Transform Honda Activa, Suzuki Access, Vespa, and vintage scooters into high-torque electric cruisers with disc brake upgrades and clean frame reinforcement.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Up to 130km Range</span>
              <button 
                onClick={() => setActiveTab('contact')} 
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
              >
                Get Conversion Quote <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Inverter & Motor Diagnostics (Col span 1) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">03. Fast Component Repair</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Motor & Controller Diagnostics</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Fix jerky throttle response, hall sensor burnout, low torque cutouts, and CAN-bus telemetry errors for Ather, Ola, Hero Electric, and multi-brand scooters.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Same-Day Oscilloscope Lab</span>
              <button 
                onClick={() => setActiveTab('blog')} 
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
              >
                Read Guides <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Projects Highlight Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <span>PROVEN WORKSHOP OUTCOMES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent EV Conversions & Battery Builds
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('portfolio')}
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All {featuredProjects.length}+ Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="cursor-pointer group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-emerald-400 border border-slate-700">
                  {project.category === 'conversions' ? 'EV Conversion' : project.category === 'battery' ? 'Battery Tech' : 'Diagnostics & Repair'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {project.vehicleModel}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{project.metrics.label}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 text-sm">
                      {project.metrics.value}
                    </span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Troubleshooting Guides Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 border border-slate-800 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold text-emerald-400 tracking-wide mb-1">
                KNOWLEDGE BASE & TECH GUIDES
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Top Troubleshooting & Technical Articles
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('blog')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Explore All Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topGuides.slice(0, 2).map((guide) => (
              <div
                key={guide.id}
                onClick={() => onSelectGuide(guide)}
                className="cursor-pointer p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400 font-medium">{guide.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.author.name}</span>
                </div>
                <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {guide.excerpt}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
