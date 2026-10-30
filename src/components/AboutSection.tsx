import React from 'react';
import { ActiveTab } from '../types';
import { 
  ShieldCheck, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Wrench, 
  Microscope, 
  Zap, 
  HelpCircle, 
  MessageSquare, 
  ArrowRight, 
  Sliders, 
  Truck, 
  MapPin, 
  Clock, 
  ChevronRight,
  Activity
} from 'lucide-react';

interface AboutSectionProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-16 md:space-y-20">
      
      {/* 1. Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
          <span>ABOUT NEXT GEN EV CARE</span>
          <span aria-hidden="true">·</span>
          <span>GUJRANWALA SPECIALISTS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Pioneering Door-to-Door Electric Scooty Care & Diagnostics
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Founded by certified EV engineers, Next Gen EV Care replaces the hassle of loader-rickshaw towing with dedicated mobile doorstep technicians and workshop component-level repairs.
        </p>
      </div>

      {/* 2. Highlight Bento Banner: Door-to-Door Services in Liquid Glass */}
      <div className="p-7 sm:p-9 rounded-2xl liquid-glass-card shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Truck className="w-4 h-4 shrink-0" />
              <span>MAIN FOCUS: MOBILE DOORSTEP CARE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              A High-Tech EV Diagnostic Lab Right On Your Driveway
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Towing a broken scooter across town damages motors and wastes hours. Our mobile units visit your residence or office equipped with 4-channel oscilloscopes, battery cell delta testers, and genuine Honeywell hall effect sensors.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>On-site hall sensor & bearing fitting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Battery SOH & cell delta impedance audits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Controller MOSFET & wiring short tracing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hydraulic brake fluid flush & pad replacement</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <a
              href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20would%20like%20to%20book%20a%20Door-to-Door%20doorstep%20service%20in%20Gujranwala."
              target="_blank"
              rel="noreferrer"
              className="h-11 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <Truck className="w-4 h-4 text-slate-950" />
              <span>Book Doorstep Visit (03217436463)</span>
            </a>
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mughal Plaza, Gujranwala & Metro Area</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 4 Core Pillars Grid */}
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>ENGINEERING PHILOSOPHY</span>
            <span aria-hidden="true">·</span>
            <span>PRECISION BENCH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Component Precision Over Costly Whole-Unit Replacements
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            We repair the discrete failed components rather than forcing customers into overpriced imported assembly swaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl liquid-glass-card flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Doorstep Model</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Mobile Van Support</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mobile technicians arrive directly at your location. Over 85% of repairs completed on your driveway with zero towing fees.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/50 dark:border-white/10 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Model Town, Cantt & DC Colony
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl liquid-glass-card flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Zero Rewinding</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Motor Component Repair</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We replace hall sensors, press Japanese SKF bearings, and de-rust stators. We protect factory robotic copper windings without rewinding.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/50 dark:border-white/10 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Honeywell 150°C Sensors
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl liquid-glass-card flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Micro-Electronics</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Controller Rebuilds</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Desoldering shorted power MOSFETs, rebuilding gate driver networks, and restoring smooth FOC sine-wave throttle curves.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/50 dark:border-white/10 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              IRFB4110 MOSFET Bench
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl liquid-glass-card flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">24-Point Audit</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Full Maintenance</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computerized battery delta tests under dynamic load, wiring harness short tracing, hydraulic brake bleeding, and monsoon seals.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/50 dark:border-white/10 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Computerized Scan Protocol
            </div>
          </div>

        </div>
      </div>

      {/* 4. Lab Bench & Instrumentation Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
              <span>WORKSHOP FACILITY</span>
              <span aria-hidden="true">·</span>
              <span>CALIBRATED TOOLS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Laboratory-Grade Diagnostics Across Gujranwala
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              When dealership centers recommend a PKR 60,000+ motor or battery assembly replacement, our instruments isolate the exact faulty resistor, hall chip, or series cell delta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl liquid-glass-card space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Microscope className="w-4 h-4" />
                <span>4-Wire AC IR Testing</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Measures individual cell milliohm impedance to isolate weak bottlenecks before thermal degradation occurs.
              </p>
            </div>

            <div className="p-4 rounded-xl liquid-glass-card space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Activity className="w-4 h-4" />
                <span>Digital Oscilloscopes</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Real-time back-EMF waveform analysis and phase angle synchronization for BLDC hub motors.
              </p>
            </div>

            <div className="p-4 rounded-xl liquid-glass-card space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Smart BMS Calibration</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Active cell balancing, over-current calibration, and Bluetooth state-of-health verification.
              </p>
            </div>

            <div className="p-4 rounded-xl liquid-glass-card space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <Award className="w-4 h-4" />
                <span>Japanese SKF Bearings</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Precision press fit sealed bearings ensuring zero rolling friction and silent axle rotation.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Lab Column in Frosted Glass Container */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden liquid-glass shadow-xl">
            <img
              src="/src/assets/images/ev_battery_pack_tech_1792957574705.jpg"
              alt="Battery pack engineering bench"
              className="w-full aspect-square object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="rounded-2xl overflow-hidden liquid-glass shadow-xl mt-5">
            <img
              src="/src/assets/images/ev_diagnostics_motor_1792957576018.jpg"
              alt="Oscilloscope motor diagnostics"
              className="w-full aspect-square object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* 5. Minimalist FAQ Reference Banner in Tactile Liquid Glass Card */}
      <section className="p-7 sm:p-9 rounded-2xl liquid-glass-card shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Have Questions Regarding Doorstep Visits or Motor Repairs?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Find answers on mobile dispatch times in Gujranwala, hall sensor replacement turnaround, controller FET micro-rebuilds, and conversion waitlists.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3">
            {setActiveTab && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('faq');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-11 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <span>Explore FAQ Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <a
              href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20have%20a%20technical%20question%20about%20my%20electric%20scooter%20in%20Gujranwala."
              target="_blank"
              rel="noreferrer"
              className="h-11 px-5 rounded-xl liquid-glass text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-800/90 active:scale-[0.98] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
