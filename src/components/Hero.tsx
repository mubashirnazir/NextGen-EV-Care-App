import React from 'react';
import { ActiveTab, PortfolioItem, BlogPost } from '../types';
import { 
  Truck, 
  Wrench, 
  Percent, 
  Gauge, 
  ArrowRight, 
  ArrowUpRight, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  BookOpen
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
    <div className="space-y-20 md:space-y-28 py-6 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Section Cleanup */}
      <section className="relative pt-4 sm:pt-8" aria-labelledby="main-hero-heading">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Domain Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="uppercase">DOORSTEP & WORKSHOP SERVICE · GUJRANWALA</span>
              <span aria-hidden="true">·</span>
              <span>Next Gen EV Care</span>
            </div>

            {/* Single Powerful H1 */}
            <h1 
              id="main-hero-heading" 
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              Door-to-Door Electric Scooty & Bike Repair in Gujranwala
            </h1>

            {/* Concise Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Mobile door-to-door doorstep technicians and workshop specialists. Fast computerized diagnostics, hall sensor and controller micro-repairs without destructive motor rewinding, and comprehensive routine maintenance.
            </p>

            {/* Two Clean Call-to-Action Buttons (Uniform Sizing: h-11 px-5 rounded-xl) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className="h-11 px-5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Book Doorstep Service</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className="h-11 px-5 text-sm font-semibold text-slate-800 dark:text-slate-100 liquid-glass hover:bg-white/90 dark:hover:bg-slate-800/90 active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Gauge className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Calculate EV Fuel Savings</span>
              </button>
            </div>

            {/* Single Row of 3 Minimalist Badge-Icons (iPhone Liquid Glass & Uniform Height) */}
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
                    No-Winding Motor Care
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

          {/* Right Media Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden liquid-glass shadow-xl group">
              <img
                src="/src/assets/images/hero_ev_workshop_1792957574841.jpg"
                alt="Next Gen EV Care mobile technician facility and electric scooty diagnostics workshop in Gujranwala"
                className="w-full aspect-[4/3] object-cover group-hover:scale-[1.015] transition-transform duration-500"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 sm:p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-400">Mobile Unit & Mughal Plaza Hub</p>
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

        {/* Minimalist Proof Strip in Tactile Liquid Glass Card */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl liquid-glass-card grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
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
              Versus whole-assembly replacement
            </p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              0 Winding
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1">
              Factory Stator Care
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Original copper coils preserved
            </p>
          </div>
        </div>
      </section>

      {/* 2. Core Services Grid (Modern, Border-Subtle 3-Column Grid) */}
      <section className="space-y-8" aria-labelledby="core-services-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              <span>SPECIALIZED SERVICES</span>
              <span aria-hidden="true">·</span>
              <span>GUJRANWALA</span>
            </div>
            <h2 id="core-services-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Specialized Electric Scooty & Bike Services
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Certified doorstep service and component-level repairs designed specifically for the unique road and climate demands of Gujranwala.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>View Full 24-Point Audit Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Service Card Grid with Hover Micro-Interactions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Doorstep Service */}
          <div 
            onClick={() => setActiveTab('contact')}
            className="group cursor-pointer p-7 rounded-2xl liquid-glass-card flex flex-col justify-between h-full"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Door-to-Door</span>
                  <span aria-hidden="true">·</span>
                  <span>Primary Focus</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Doorstep Electric Scooty Repair
                </h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Zero towing hassle. Mobile technicians dispatched directly to your home or office in Gujranwala with calibrated diagnostic scopes, replacement sensors, and tools. 85% of issues resolved right on your driveway.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Model Town, Cantt & DC Colony</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:underline">
                Book Doorstep <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: No-Winding Motor Repair */}
          <div 
            onClick={() => setActiveTab('portfolio')}
            className="group cursor-pointer p-7 rounded-2xl liquid-glass-card flex flex-col justify-between h-full"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Motor Precision</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero Rewinding</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  No-Winding Motor & Hall Sensor Repair
                </h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We cure motor stutter, buzzing, and wheel lockup by replacing burnt hall sensors with 150°C Honeywell units and pressing Japanese SKF sealed bearings while safeguarding original robotic copper windings.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Save 70%+ vs New Motor</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:underline">
                View Case Studies <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Computerized Diagnostics & Controller Micro-Rework */}
          <div 
            onClick={() => setActiveTab('contact')}
            className="group cursor-pointer p-7 rounded-2xl liquid-glass-card flex flex-col justify-between h-full"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Electronics Bench</span>
                  <span aria-hidden="true">·</span>
                  <span>Component Micro-Rework</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Diagnostics & Controller Micro-Rework
                </h3>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Computerized battery pack delta voltage testing under dynamic load, controller MOSFET transistor replacement, wiring short-circuit tracing, and hydraulic brake flushing.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Oscilloscope Calibrated</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:underline">
                Schedule Diagnostic <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>

        {/* Minimalist Pilot Notice for Conversions (Liquid Glass Banner) */}
        <div className="p-4 rounded-xl liquid-glass-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px]">Upcoming R&D:</span>
            <span>Honda CD 70 & CG 125 Petrol-to-EV conversions are undergoing GT Road durability testing.</span>
          </div>
          <a
            href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20Please%20reserve%20my%20spot%20on%20the%20Honda%20CD%2070%20/%20CG%20125%20EV%20Conversion%20Waitlist."
            target="_blank"
            rel="noreferrer"
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Join Conversion Waitlist</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </section>

      {/* 3. Case Studies Grid (Neat, Scannable Cards) */}
      <section className="space-y-8" aria-labelledby="case-studies-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              <span>VERIFIED CASE STUDIES</span>
              <span aria-hidden="true">·</span>
              <span>GUJRANWALA OUTCOMES</span>
            </div>
            <h2 id="case-studies-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent EV Repairs & Case Studies
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className="h-9 px-3.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 liquid-glass-subtle hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>View All {featuredProjects.length}+ Case Studies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.slice(0, 3).map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="cursor-pointer group rounded-2xl liquid-glass-card overflow-hidden flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-400 border border-white/10 shadow-sm">
                    {project.category === 'doorstep'
                      ? 'Doorstep Visit'
                      : project.category === 'motor-controller'
                      ? 'No Winding Repair'
                      : project.category === 'diagnostics'
                      ? 'Electrification Scan'
                      : 'Full Maintenance'}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{project.completedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{project.vehicleModel}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">{project.metrics.label}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 text-sm">
                    {project.metrics.value}
                  </span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Knowledge Base Section (Neat, Scannable Cards) */}
      <section className="space-y-8" aria-labelledby="guides-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              <span>MAINTENANCE GUIDES</span>
              <span aria-hidden="true">·</span>
              <span>TECHNICAL KNOWLEDGE</span>
            </div>
            <h2 id="guides-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Electric Scooty Technical & Maintenance Guides
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('blog')}
            className="h-9 px-3.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 liquid-glass-subtle hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All Technical Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topGuides.slice(0, 2).map((guide) => (
            <div
              key={guide.id}
              onClick={() => onSelectGuide(guide)}
              className="cursor-pointer group p-6 rounded-2xl liquid-glass-card flex flex-col justify-between h-full space-y-4"
            >
              <div className="space-y-3">
                {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{guide.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.author.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.publishedAt}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {guide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {guide.tags[0]} · {guide.tags[1]}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
