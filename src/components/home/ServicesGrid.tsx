import React, { useState } from 'react';
import { 
  BatteryCharging, 
  Wrench, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { BrandLogoCarousel } from '../BrandLogoCarousel';

interface ServicesGridProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ setActiveTab }) => {
  // Accordion state to toggle detailed technical specifications cleanly without cluttering the primary view
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleAccordion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCard(prev => prev === id ? null : id);
  };

  return (
    <section className="space-y-10" aria-labelledby="services-grid-heading">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span className="uppercase tracking-widest text-[11px] font-bold">SPECIALIZED REPAIR LAB · GUJRANWALA</span>
          </div>
          <h2 id="services-grid-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Specialized Electric Scooty & E-Bike Services
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Certified doorstep service and micro-level electronics repairs calibrated for Gujranwala’s road conditions, humidity, and peak summer heat.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>View 24-Point Audit Checklist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3-Column Modern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Card 1: Lithium Battery Servicing & Cell Balancing */}
        <div 
          onClick={() => setActiveTab('contact')}
          className="group cursor-pointer p-6 sm:p-7 rounded-2xl liquid-glass-card flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                LiFePO4 & Graphene
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Power Systems</span>
                <span aria-hidden="true">·</span>
                <span>Diagnostics</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Lithium Battery Servicing & Cell Balancing
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Restore lost mileage, fix sudden battery cutoffs, and resolve BMS lockout. We test individual cell delta voltage under dynamic load and execute computerized micro-balancing.
            </p>

            {/* Accordion Expandable for Technical Specs */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => toggleAccordion('battery', e)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cell Balancing & BMS Protocols</span>
                </span>
                {expandedCard === 'battery' ? (
                  <ChevronUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedCard === 'battery' && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>0.015V Delta Ceiling:</strong> Multi-channel active balancing to eliminate weak-cell premature cutoff.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>Smart BMS Re-Flashing:</strong> Over-discharge protection, temp sensor verification, and UART/Bluetooth telemetry check.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>Graphene Pack Desulfation:</strong> High-frequency pulse conditioning to recover usable ampere-hours.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Restores 20–40% Range</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:underline">
              Book Battery Audit <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: No-Winding Hub Motor & Hall Sensor Repair */}
        <div 
          onClick={() => setActiveTab('portfolio')}
          className="group cursor-pointer p-6 sm:p-7 rounded-2xl liquid-glass-card flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                150°C Honeywell
              </span>
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
              Cure motor stutter, shuddering, and wheel lockup without destructive rewinding. We replace burnt sensors with Japanese high-temp ICs and press SKF sealed bearings.
            </p>

            {/* Accordion Expandable for Technical Specs */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => toggleAccordion('motor', e)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Stator Protection & Bearing Specs</span>
                </span>
                {expandedCard === 'motor' ? (
                  <ChevronUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedCard === 'motor' && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>Factory Copper Preservation:</strong> Zero hand-rewind compromises; maintain OEM electromagnetic efficiency.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>150°C Rated Sensors:</strong> Automotive-grade Honeywell bipolar latching hall ICs immune to summer thermal shutdown.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>SKF Sealed Bearings:</strong> Double-lipped rubber seals prevent monsoon rainwater and dust ingress.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Save 70%+ vs New Hub</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:underline">
              View Motor Cases <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Controller MOSFET & Circuit Diagnostics */}
        <div 
          onClick={() => setActiveTab('contact')}
          className="group cursor-pointer p-6 sm:p-7 rounded-2xl liquid-glass-card flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Component Level
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Electronics Bench</span>
                <span aria-hidden="true">·</span>
                <span>MOSFET Rework</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Controller MOSFET & Circuit Troubleshooting
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Don't discard a Rs. 18,000 BLDC controller for a blown 500-rupee transistor. We diagnose gate drivers, replace burned MOSFETs, and apply premium thermal compounds.
            </p>

            {/* Accordion Expandable for Technical Specs */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => toggleAccordion('controller', e)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>MOSFET Dissipation & Trace Protocols</span>
                </span>
                {expandedCard === 'controller' ? (
                  <ChevronUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedCard === 'controller' && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>6.0 W/mK Thermal Pasting:</strong> Upgraded alumina thermal pads to prevent thermal runaway under 40°C Gujranwala summers.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>PWM Gate Trace Verification:</strong> Dual-trace oscilloscope capture to guarantee identical timing across all 3 phases.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong>Throttle Shunt Calibration:</strong> Fine-tuning low-speed current limits for smooth takeoff and extended range.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Oscilloscope Verified</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:underline">
              Request Rework <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>

      {/* Brand Logo Infinite Marquee Strip - Positioned directly beneath services */}
      <BrandLogoCarousel setActiveTab={setActiveTab} />
    </section>
  );
};
