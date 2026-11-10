import React from 'react';
import { Truck, Phone, MessageCircle, Gauge, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { ActiveTab } from '../../types';

interface CTASectionProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ setActiveTab }) => {
  return (
    <section className="relative rounded-3xl overflow-hidden liquid-glass border border-emerald-500/30 p-8 sm:p-12 shadow-2xl text-center sm:text-left">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Copy */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>DISPATCHING TODAY IN GUJRANWALA</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Scooty Stopped Running? <br className="hidden sm:inline" />
            We Bring the Workshop to Your Driveway.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Call or WhatsApp our mobile technician van directly. We arrive with factory replacement sensors, cell balancers, and testing equipment. 85% of repairs completed on the spot.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Transparent Estimates
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4 text-emerald-500" />
              All Sectors Covered
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Mughal Plaza GT Road Hub
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <a
            href="https://wa.me/923217436463?text=Hello%20Next%20Gen%20EV%20Care!%20My%20electric%20scooty%20needs%20doorstep%20repair%20in%20Gujranwala."
            target="_blank"
            rel="noreferrer"
            className="h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>WhatsApp Dispatch Now</span>
          </a>

          <a
            href="tel:+923217436463"
            className="h-11 px-5 rounded-xl liquid-glass hover:bg-white/90 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>Call (+92) 321 7436463</span>
          </a>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className="h-11 px-5 rounded-xl bg-slate-900 dark:bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-800 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Book Online Doorstep Slot</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
