import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Flame, 
  Wrench, 
  Microscope,
  Zap,
  Users
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      
      {/* Hero / Overview */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
          <span>ABOUT NEXT GEN EV CARE</span>
          <span aria-hidden="true">·</span>
          <span>Precision Two-Wheeler Engineers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pioneering Reliable, High-Performance Electric 2-Wheeler Care
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          Founded by certified EV powertrain specialists and battery engineers, Next Gen EV Care bridges the gap between unreliable roadside mechanics and expensive whole-assembly replacements by authorized dealerships.
        </p>
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
              When an authorized brand service center quotes ₹30,000 to replace an entire motor or battery pack due to a single burnt component, our technicians diagnose down to the discrete MOSFET, hall sensor, or series cell delta.
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
                  Laser-clean pure nickel 0.2mm connections preventing cold joints, high resistance, and localized heat hotspots.
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
              Every repaired motor and conversion undergoes continuous full-throttle load bench testing before handing the keys to the rider.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
