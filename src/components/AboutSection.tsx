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
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface AboutSectionProps {
  setActiveTab?: (tab: ActiveTab) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      
      {/* Hero / Overview */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
          <span>ABOUT NEXT GEN EV CARE</span>
          <span aria-hidden="true">·</span>
          <span>Gujranwala Doorstep & Workshop Specialists</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pioneering Door-to-Door Care, Precision Diagnostics & Component Repairs
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          Founded by certified EV powertrain specialists and battery engineers, Next Gen EV Care eliminates the hassle of towing broken electric bikes. We bring computerized diagnostics, motor repair (hall sensors & bearings — not winding), controller micro-repairs, and full periodic maintenance directly to your doorstep across Gujranwala.
        </p>
      </div>

      {/* Primary Feature Banner: Door-to-Door Services (MAIN FOCUS) */}
      <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500/40 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Our Main Focus: Door-to-Door EV Care</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              We Bring The High-Tech EV Workshop Right To Your Doorstep
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Towing a broken electric scooter on a loader rickshaw is frustrating, costly, and can damage the motor. Our specialized mobile EV service units come directly to your home, office, or breakdown spot in Gujranwala, Cantt, Model Town, DC Colony, Rahwali, and Muhafiz Town.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>On-site hall sensor & bearing replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Digital battery pack SOH & cell delta audits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Controller testing & wiring short-circuit tracing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hydraulic brake fluid flush & pad fitting</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
            <a
              href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20would%20like%20to%20book%20a%20Door-to-Door%20doorstep%20service%20in%20Gujranwala."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Truck className="w-4 h-4 text-slate-950" />
              <span>Book Doorstep Visit (03217436463)</span>
            </a>
            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mughal Plaza, Gujranwala & Doorstep Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars of Service */}
      <div className="space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            OUR SPECIALIZED FOCUS AREAS
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Component Precision Over Whole-Assembly Replacements
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            We repair the discrete components that actually fail, rather than forcing you to buy whole replacement motors, controllers, or batteries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Doorstep Service */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/40 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Main Focus</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Door-to-Door Services</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Mobile technicians arrive directly at your home with digital diagnostic gear. Over 85% of repairs completed on your driveway with zero towing fees.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Gujranwala & Surroundings
            </div>
          </div>

          {/* Pillar 2: Motor Repair (No Winding) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zero Rewinding</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Motor Component Repair</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We fix hall effect sensors, press Japanese SKF sealed bearings, de-rust stators, and align axles. We do NOT rewind coils because automated factory windings rarely burn!
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500">
              Honeywell 150°C Hall Sensors
            </div>
          </div>

          {/* Pillar 3: Controller Repair */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Micro-Electronics</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Controller & Inverter Fix</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Desoldering shorted high-power MOSFETs, repairing gate drivers, replacing 5V buck regulators, and remapping FOC sine-wave throttle curves.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500">
              IRFB4110 / N-Channel FETs
            </div>
          </div>

          {/* Pillar 4: Electrification Diagnostics & 24-Point Maintenance */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Multi-Point</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Diagnostics & Full Service</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computerized battery pack delta voltage testing, wiring harness short-circuit tracing, hydraulic brake fluid flushing, and monsoon waterproofing.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500">
              24-Point Health Audit
            </div>
          </div>

        </div>
      </div>

      {/* Conversions Coming Soon Spotlight Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming Project · Coming Soon</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Petrol-to-Electric Conversions (Honda CD 70 / CG 125): In Pilot R&D Testing
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            While our active day-to-day focus is on Door-to-Door Service, Diagnostics, Motor Repair (no winding), and Controller Rebuilds, our engineering team is actively developing certified, PSQCA-compliant petrol-to-EV conversion kits for Honda CD 70 and CG 125 motorcycles. Commercial bookings will open following rigorous 10,000-km GT Road durability tests.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <a
            href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20Please%20add%20me%20to%20the%20Priority%20Waitlist%20for%20Honda%20CD%2070%20/%20CG%20125%20EV%20conversions."
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <span>Join Conversion Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Workshop Lab & Instrumentation Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Laboratory & Diagnostics Setup
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Component-Level Precision Rather Than Guesswork
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When an authorized brand service center quotes PKR 65,000 to replace an entire motor or battery pack due to a single burnt component, our technicians diagnose down to the discrete MOSFET, hall sensor, or series cell delta.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Calibrated 4-Wire AC Internal Resistance (IR) Testing</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Measures individual cell milliohm impedance to isolate weak bottlenecks before thermal degradation occurs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Digital Phase Oscilloscopes & Hall Analyzers</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time back-EMF waveform analysis and phase angle synchronization for BLDC hub and mid-drive motors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Pneumatic Pulse Micro-Arc Spot Welders</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Laser-clean pure nickel connections preventing cold joints, high resistance, and localized hotspots.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Lab Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img
              src="/src/assets/images/ev_battery_pack_tech_1792957574705.jpg"
              alt="Battery pack engineering bench"
              className="w-full aspect-square object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 mt-6">
            <img
              src="/src/assets/images/ev_diagnostics_motor_1792957576018.jpg"
              alt="Oscilloscope motor diagnostics"
              className="w-full aspect-square object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Safety & Quality Core Standards */}
      <div className="p-8 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            OUR QUALITY CHARTER
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Zero-Compromise Safety Protocols
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Lithium battery packs demand uncompromising electrical and thermal discipline. Every build adheres to automotive industrial standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Hardware BMS Protection</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every pack incorporates dual overcharge, overdischarge, short-circuit, and high-temp cutoffs with genuine Daly or ANT smart management.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <Award className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Grade-A Verified Cells Only</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We never use salvaged b-grade laptop cells. All packs utilize matched batch EVE, Samsung 50E, or BAK cylindrical and prismatic cells.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Full Dynamometer Burn-In</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every repaired motor and controller undergoes continuous full-throttle load bench testing before handing the keys to the rider.
            </p>
          </div>
        </div>
      </div>

      {/* ===================== STANDALONE FAQ DEDICATED CALLOUT BANNER ===================== */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 border-2 border-emerald-500/30 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dedicated Help & Knowledge Center</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Got Questions About EV Service, Motor Repairs, or Doorstep Visits?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We have created a dedicated, searchable <strong className="text-emerald-400 font-semibold">Frequently Asked Questions (FAQ) section</strong> answering common inquiries on door-to-door dispatch timelines, BLDC hall sensor repairs (no winding), controller MOSFET diagnosis, monsoon waterproofing, and conversion waitlists.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">Door-to-Door Service</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">Motor & Controller Repairs</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">Electrification Diagnostics</span>
              <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">Upcoming Conversions</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
            {setActiveTab && (
              <button
                onClick={() => {
                  setActiveTab('faq');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 group cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-slate-950" />
                <span>Visit Dedicated FAQ Section</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            <a
              href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20I%20have%20a%20technical%20question%20about%20my%20electric%20scooter%20in%20Gujranwala."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask via WhatsApp (03217436463)</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
