import React from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { 
  Zap, 
  Youtube, 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  ArrowUp,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  openPrivacy: () => void;
  theme?: ThemeMode;
  toggleTheme?: (mode?: ThemeMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  setActiveTab, 
  openPrivacy,
  theme,
  toggleTheme
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-900">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                <img
                  src="/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png"
                  alt="Next Gen EV Care Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Next Gen <span className="text-emerald-600 dark:text-emerald-400">EV Care</span>
              </span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              Specialized door-to-door EV care, computerized electrification diagnostics, component motor repair (hall sensors & bearings — no winding), controller rebuilds, and full periodic maintenance. Conversions coming soon!
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Mirror */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveTab('home'); scrollToTop(); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('calculator'); scrollToTop(); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  EV Range & Charge Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('portfolio'); scrollToTop(); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Portfolio Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('blog'); scrollToTop(); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Technical Knowledge Base
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('about'); scrollToTop(); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  About Next Gen
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('faq'); scrollToTop(); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('contact'); scrollToTop(); }}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Book Door-to-Door Service
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Specializations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Specializations
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>Door-to-Door Doorstep EV Service (Main Focus)</li>
              <li>Electrification Diagnostics & Cell Delta Tests</li>
              <li>Motor Repair (Hall Sensors & Bearings - No Winding)</li>
              <li>Controller & Inverter MOSFET Rebuilds</li>
              <li>24-Point Comprehensive Full Maintenance</li>
              <li>Honda CD 70 / CG 125 EV Conversions (Coming Soon)</li>
            </ul>
          </div>

          {/* Workshop Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Workshop Lab
            </h4>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Mughal Plaza, Mughal Chok, Service Road Main gate Muhafiz Town Gujranwala, Pakistan.</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <a href="tel:03217436463" className="font-mono text-slate-800 dark:text-slate-200 font-semibold hover:text-emerald-500">
                  03217436463
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <a href="mailto:nextgenevcare@gmail.com" className="text-slate-800 dark:text-slate-200 hover:text-emerald-500 underline font-mono">
                  nextgenevcare@gmail.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Next Gen EV Care. All rights reserved. Precision Electric Mobility Engineering.
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {toggleTheme && (
              <button
                onClick={() => toggleTheme()}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors"
                title={`Current: ${theme}. Click to switch theme.`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark (Switch Light)</span>
                  </>
                ) : theme === 'light' ? (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Light (Switch System)</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-500" />
                    <span>System (Switch Dark)</span>
                  </>
                )}
              </button>
            )}

            <span>·</span>

            <button
              onClick={openPrivacy}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => { setActiveTab('admin'); scrollToTop(); }}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-400"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Owner Portal</span>
            </button>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
