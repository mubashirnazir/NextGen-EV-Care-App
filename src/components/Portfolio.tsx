import React, { useState, useMemo } from 'react';
import { PortfolioItem, ServiceCategory } from '../types';
import { 
  Wrench, 
  BatteryCharging, 
  Sliders, 
  Search, 
  CheckCircle2, 
  X, 
  Video, 
  Play, 
  Zap, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Truck,
  Cpu,
  Clock,
  Sparkles
} from 'lucide-react';

interface PortfolioProps {
  projects: PortfolioItem[];
  selectedProject: PortfolioItem | null;
  setSelectedProject: (project: PortfolioItem | null) => void;
  onBookServiceForProject?: (project: PortfolioItem) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  projects,
  selectedProject,
  setSelectedProject,
  onBookServiceForProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.vehicleModel.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const getCategoryLabel = (cat: ServiceCategory) => {
    switch (cat) {
      case 'doorstep':
        return 'Door-to-Door Service';
      case 'motor-controller':
        return 'Motor & Controller (No Winding)';
      case 'diagnostics':
        return 'Electrification Diagnostic';
      case 'maintenance':
        return 'Full Maintenance';
      case 'battery':
        return 'Battery Tech & SOH';
      case 'conversions':
        return 'Conversions (Coming Soon)';
      default:
        return 'EV Service';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header and Taxonomy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <span>VERIFIED FIELD & WORKSHOP LOGS</span>
            <span aria-hidden="true">·</span>
            <span>Gujranwala Doorstep & Bench Case Studies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portfolio & Experience Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            Explore verified door-to-door repair logs, motor component overhauls (hall sensors & bearings — no winding), controller MOSFET repairs, and electrification diagnostics.
          </p>
        </div>

        {/* Search Bar in Liquid Glass */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search model, motor, controller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-9 pr-8 text-xs sm:text-sm rounded-xl liquid-glass text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Tabs (Functional Segmented Buttons in Liquid Glass) */}
      <div className="flex items-center gap-1.5 p-1.5 liquid-glass rounded-xl max-w-4xl mb-8 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          All Logs ({projects.length})
        </button>

        <button
          onClick={() => setSelectedCategory('doorstep')}
          className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'doorstep'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Door-to-Door Service</span>
        </button>

        <button
          onClick={() => setSelectedCategory('motor-controller')}
          className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'motor-controller'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-emerald-500" />
          <span>Motor & Controller (No Winding)</span>
        </button>

        <button
          onClick={() => setSelectedCategory('diagnostics')}
          className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'diagnostics'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-500" />
          <span>Electrification Diagnostics</span>
        </button>

        <button
          onClick={() => setSelectedCategory('maintenance')}
          className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'maintenance'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Full Maintenance</span>
        </button>

        <button
          onClick={() => setSelectedCategory('conversions')}
          className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'conversions'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-white/80 dark:border-white/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Conversions (Coming Soon)</span>
        </button>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 liquid-glass rounded-2xl">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No service logs found</p>
          <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword or reset category filter.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl liquid-glass-card overflow-hidden flex flex-col justify-between h-full"
            >
              {/* Media Container with Fallback Support */}
              <div 
                className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Clean Top Overlay: Category & Status */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-emerald-400 border border-slate-700/80">
                    {getCategoryLabel(project.category)}
                  </span>

                  {project.isComingSoon ? (
                    <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                      {project.status}
                    </span>
                  )}
                </div>

                {/* Media Play Button Indicator */}
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                    <Play className="w-4 h-4 fill-emerald-400 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>{project.vehicleModel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.completedDate}</span>
                  </div>

                  <h3 
                    onClick={() => setSelectedProject(project)}
                    className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technical Specs Miniature Grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px]">System Voltage</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-200">{project.technicalSpecs.voltage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Service Scope</span>
                    <span className="font-mono font-medium text-slate-900 dark:text-slate-200 truncate block">{project.technicalSpecs.capacity}</span>
                  </div>
                </div>

                {/* Card Action Strip */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{project.metrics.label}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 text-sm">
                      {project.metrics.value}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Watch Diagnostic Dyno Video"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View Log</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== PROJECT DETAILS MODAL ===================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto liquid-glass border border-white/80 dark:border-white/10 rounded-2xl shadow-2xl">
            
            {/* Modal Header Media */}
            <div className="relative aspect-[16/9] w-full bg-slate-950">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-950 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-slate-950/90 text-emerald-400 border border-white/10 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-md">
                  {getCategoryLabel(selectedProject.category)}
                </span>
                {selectedProject.isComingSoon ? (
                  <span className="bg-amber-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    Coming Soon · Pilot R&D
                  </span>
                ) : (
                  <span className="bg-emerald-500/90 text-slate-950 px-3 py-1 rounded-lg text-xs font-bold">
                    {selectedProject.status}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {selectedProject.vehicleModel}
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedProject.title}
                </h3>
              </div>

              {selectedProject.isComingSoon && (
                <div className="p-4 rounded-xl liquid-glass-subtle text-xs text-amber-600 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-500 dark:text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>Upcoming Project Status: Coming Soon</span>
                  </div>
                  <p className="leading-relaxed">
                    Commercial conversion bookings will officially launch following final PSQCA certification and 10,000-km GT Road reliability runs. Contact us via WhatsApp to join the priority reservation waitlist!
                  </p>
                </div>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Comprehensive Technical Matrix */}
              <div className="p-4 rounded-xl liquid-glass-subtle space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Engineering Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Nominal Voltage</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedProject.technicalSpecs.voltage}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Scope / Capacity</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedProject.technicalSpecs.capacity}
                    </span>
                  </div>
                  {selectedProject.technicalSpecs.motor && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Motor Component Spec</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {selectedProject.technicalSpecs.motor}
                      </span>
                    </div>
                  )}
                  {selectedProject.technicalSpecs.bms && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">BMS / Phasing Protocol</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {selectedProject.technicalSpecs.bms}
                      </span>
                    </div>
                  )}
                  {selectedProject.technicalSpecs.rangeGain && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">Benchmark Outcome</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedProject.technicalSpecs.rangeGain}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Engineering Highlights List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Key Technical Milestones Completed
                </h4>
                <div className="space-y-2">
                  {selectedProject.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Feedback Quote */}
              {selectedProject.clientFeedback && (
                <div className="p-4 rounded-xl liquid-glass-subtle text-xs space-y-1">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Client Verification & Test Ride</p>
                  <p className="italic text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProject.clientFeedback}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between liquid-glass-subtle">
              <span className="text-xs text-slate-500">
                Log Date: {selectedProject.completedDate}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="h-10 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                {onBookServiceForProject && (
                  <button
                    onClick={() => {
                      const proj = selectedProject;
                      setSelectedProject(null);
                      onBookServiceForProject(proj);
                    }}
                    className="h-10 px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>{selectedProject.isComingSoon ? 'Join Waitlist' : 'Book Doorstep Service'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================== VIDEO PREVIEW MODAL ===================== */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Video className="w-4 h-4" />
                <span>Diagnostics & Component Test Footage</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Placeholder with High Tech Interface */}
            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow-lg">
                <Play className="w-7 h-7 fill-emerald-400 ml-1" />
              </div>
              <p className="text-sm font-bold text-white">Full Oscilloscope & Dyno Test Stream</p>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Field recording capturing doorstep hall sensor synchronization, phase waveforms under 50A load, and SKF bearing sound analysis.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-slate-900/80 px-3 py-1 rounded border border-slate-700">
                <span>Phase Current: 48.2A</span>
                <span>·</span>
                <span>Motor Noise: 18dB (Whisper Quiet)</span>
                <span>·</span>
                <span>Hall Sync: 120.0°</span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
