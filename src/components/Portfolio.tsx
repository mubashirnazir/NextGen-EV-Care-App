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
  Layers
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header and Taxonomy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <span>VERIFIED WORKSHOP CASE STUDIES</span>
            <span aria-hidden="true">·</span>
            <span>Real Builds & Repairs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portfolio & Experience Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            Explore verified build logs, custom lithium pack fabrications, powertrain retrofits, and high-precision motor and inverter diagnostics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search model or component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
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

      {/* Filter Category Tabs (Functional Segmented Buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl mb-8 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Projects ({projects.length})
        </button>

        <button
          onClick={() => setSelectedCategory('conversions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'conversions'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-emerald-500" />
          <span>EV Conversions</span>
        </button>

        <button
          onClick={() => setSelectedCategory('battery')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'battery'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
          <span>Battery Tech</span>
        </button>

        <button
          onClick={() => setSelectedCategory('diagnostics')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'diagnostics'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-500" />
          <span>Diagnostics & Repair</span>
        </button>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No projects found</p>
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
              className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
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
                    {project.category === 'conversions'
                      ? 'EV Conversion'
                      : project.category === 'battery'
                      ? 'Battery Tech'
                      : 'Diagnostics & Repair'}
                  </span>

                  <span className="bg-slate-900/90 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
                    {project.status}
                  </span>
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
                    <span className="text-slate-400 block text-[10px]">Voltage / Capacity</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-200 truncate block">
                      {project.technicalSpecs.voltage} · {project.technicalSpecs.capacity}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{project.metrics.label}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                      {project.metrics.value}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Detail Trigger */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 group/btn"
                  >
                    <span>Inspect Build Log</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>

                  <span className="text-[11px] text-slate-400">
                    {project.highlights.length} Technical Milestones
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== DETAILED PROJECT BUILD MODAL ===================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {selectedProject.category.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Vehicle: {selectedProject.vehicleModel}
                </span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Main Image & Media Slot */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full aspect-[16/9] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="px-3 py-1.5 bg-slate-950/90 text-white hover:text-emerald-400 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Watch Dyno & Test Drive Clip</span>
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Full Technical Specifications Grid */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Engineering Specifications Sheet</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">System Voltage:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                      {selectedProject.technicalSpecs.voltage}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Battery Pack Capacity:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                      {selectedProject.technicalSpecs.capacity}
                    </span>
                  </div>
                  {selectedProject.technicalSpecs.motor && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Motor Powertrain:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                        {selectedProject.technicalSpecs.motor}
                      </span>
                    </div>
                  )}
                  {selectedProject.technicalSpecs.bms && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">BMS & Balancing:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                        {selectedProject.technicalSpecs.bms}
                      </span>
                    </div>
                  )}
                  {selectedProject.technicalSpecs.rangeGain && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block text-[11px]">Tested Performance Delta:</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
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
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Owner Verification & Test Ride</p>
                  <p className="italic text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProject.clientFeedback}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <span className="text-xs text-slate-500">
                Completed {selectedProject.completedDate}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Request Similar Service</span>
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
                <span>Workshop Dynamometer Load Test & Build Footage</span>
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
              <p className="text-sm font-bold text-white">Full Dyno & Road Test Video Stream</p>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                4K technical video capturing continuous 60A motor load testing, thermal imaging during hill climbs, and regenerative braking deceleration telemetry.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-slate-900/80 px-3 py-1 rounded border border-slate-700">
                <span>Phase Current: 58.4A</span>
                <span>·</span>
                <span>Motor Temp: 46°C</span>
                <span>·</span>
                <span>BMS Delta: 4mV</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200"
              >
                Close Video Player
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
