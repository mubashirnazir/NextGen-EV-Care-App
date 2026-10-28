import React from 'react';
import { ActiveTab, PortfolioItem, BlogPost } from '../types';
import { 
  Zap, 
  BatteryCharging, 
  Gauge, 
  ArrowRight, 
  Wrench, 
  Sliders, 
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Truck,
  Cpu,
  Microscope,
  PhoneCall
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
                <span className="uppercase">DOOR-TO-DOOR SERVICES · GUJRANWALA & SURROUNDING AREAS</span>
                <span aria-hidden="true">·</span>
                <span>Mobile & Workshop Care</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
                Door-to-Door Care, Diagnostics & Component Repairs for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Electric Bikes & Scooters</span>.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Gujranwala's premier EV specialists with dedicated <strong>door-to-door doorstep service</strong>. We come to your home for computerized electrification diagnostics, motor repair (hall sensors & bearings — <em>no winding</em>), controller micro-repairs, and 24-point full maintenance. <em>Petrol-to-EV conversions coming soon!</em>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('contact')}
                  className="px-5 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition-all flex items-center gap-2 group whitespace-nowrap shrink-0"
                >
                  <Truck className="w-4 h-4 text-slate-950" />
                  <span>Book Door-to-Door Service</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('calculator')}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Gauge className="w-4 h-4 text-emerald-500" />
                  <span>EV Tools & Battery Health</span>
                </button>
              </div>

              {/* Trust Attributes */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Doorstep Service Across Gujranwala</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Motor Repair (No Winding)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Controller MOSFET Bench</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Conversions Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Right Media Column - Dominant Focal Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl group">
                <img
                  src="/src/assets/images/hero_ev_workshop_1792957574841.jpg"
                  alt="Next Gen EV Care mobile technicians and workshop facility"
                  className="w-full aspect-[16/10] sm:aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-400">Doorstep & Workshop Facility</p>
                      <p className="text-sm font-bold text-white">Mobile Diagnostics & Motor/Controller Bench</p>
                    </div>
                    <span className="text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold px-2.5 py-1 rounded">
                      Door-to-Door Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Adjacent Quantitative Proof Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                85%+
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Doorstep Resolution Rate
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Fixed on client driveway
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                1,450+
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                EV 2-Wheelers Serviced
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Metro, Yadea, Crown, United
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
                70%+
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Customer Cost Savings
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                vs Whole-unit replacement
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                0 Winding
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Pure Component Repair
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500">
                Factory copper coils preserved
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
              <span>CORE FOCUS & WORKSHOP SERVICES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Specialized Care Tailored for Electric 2-Wheelers
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
            Dedicated door-to-door doorstep service, component motor repairs, controller micro-electronics, and full maintenance across Gujranwala.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Door-to-Door Services (MAIN FOCUS) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 hover:border-emerald-500 transition-all flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">01. Main Focus: Door-to-Door</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Doorstep Service in Gujranwala</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zero towing hassle. Our mobile technicians visit your residence or workplace equipped with battery analyzers, digital oscilloscopes, and parts. 85% of issues resolved right on your driveway.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Model Town, Cantt, DC Colony</span>
              <button 
                onClick={() => setActiveTab('contact')} 
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                Book Doorstep <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Motor Repair (No Winding) & Controller Micro-Rework */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">02. Component Precision</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Motor (No Winding) & Controller Repair</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We fix motor shuddering and lockups by replacing hall sensors (Honeywell 150°C), pressing Japanese SKF bearings, and desoldering blown controller MOSFETs. No destructive rewinding.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Save 70%+ vs New Units</span>
              <button 
                onClick={() => setActiveTab('portfolio')} 
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
              >
                View Repairs <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Electrification Diagnostics & Full Service */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">03. Zero Guesswork</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Diagnostics & Full Maintenance</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Computerized cell delta testing under dynamic load, wiring short-circuit tracing, hydraulic brake fluid flushing, suspension greasing, and monsoon waterproofing.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">24-Point Health Audit</span>
              <button 
                onClick={() => setActiveTab('about')} 
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
              >
                Explore Checklist <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Coming Soon Conversion Spotlight Banner */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Coming Soon Project</span>
                <span className="text-slate-600 dark:text-slate-500">·</span>
                <span className="text-xs text-slate-400">In Pilot R&D Durability Testing</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                Honda CD 70 & CG 125 Petrol-to-Electric Conversions are launching soon following GT Road road-testing and PSQCA certification.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20Please%20reserve%20my%20spot%20on%20the%20Honda%20CD%2070%20/%20CG%20125%20EV%20Conversion%20Waitlist."
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs whitespace-nowrap self-start sm:self-auto transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Join Conversion Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Featured Projects Highlight Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <span>PROVEN WORKSHOP & DOORSTEP OUTCOMES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent Repairs, Diagnostics & Field Services
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('portfolio')}
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All {featuredProjects.length}+ Case Studies</span>
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
                  {project.category === 'doorstep'
                    ? 'Door-to-Door Service'
                    : project.category === 'motor-controller'
                    ? 'Motor & Controller (No Winding)'
                    : project.category === 'diagnostics'
                    ? 'Electrification Diagnostic'
                    : project.category === 'maintenance'
                    ? 'Full Maintenance'
                    : project.isComingSoon
                    ? 'Coming Soon (R&D)'
                    : 'EV Service'}
                </div>
                {project.isComingSoon && (
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    Coming Soon
                  </div>
                )}
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
