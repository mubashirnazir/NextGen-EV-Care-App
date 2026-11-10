import React from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { TikTokIcon, SnapchatIcon, SOCIAL_LINKS } from './SocialIcons';
import { 
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
  Clock,
  ExternalLink
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

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    scrollToTop();
  };

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* 4-Column High-Readability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Col 1: Brand & Social Channels */}
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
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs max-w-sm">
              Specialized doorstep EV care, computerized electrification diagnostics, no-winding motor hall sensor repairs, controller rebuilds, and lithium battery cell balancing in Gujranwala.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                title="YouTube (@NextGenEvCare)"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                title="Facebook (/nextgenevcare)"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                title="Instagram (@nextgenevcare)"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok Handle"
                title="TikTok (@nextgenevcare)"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.snapchat}
                target="_blank"
                rel="noreferrer"
                aria-label="Snapchat Profile"
                title="Snapchat (@nextgenevcare)"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-amber-400 transition-colors"
              >
                <SnapchatIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation & Relocated Admin Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation & Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('calculator')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  EV Fuel & Savings Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('portfolio')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Portfolio & Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('blog')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Technical Knowledge Base
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About Next Gen EV Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('faq')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium cursor-pointer"
                >
                  Book Door-to-Door Service
                </button>
              </li>

              {/* Relocated Admin Dashboard Link (Discreetly Positioned in Footer) */}
              <li className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="group flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium cursor-pointer"
                  title="Authorized Staff Administration Portal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>Admin Dashboard (Owner Portal)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Specializations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Specializations
            </h4>
            <ul className="space-y-2.5 text-slate-600 dark:text-slate-400 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">·</span>
                <span>Door-to-Door Rapid Diagnostic Van</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">·</span>
                <span>150°C Honeywell Sensor Hub Motor Repair</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">·</span>
                <span>Zero Motor Rewinding Guarantee</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">·</span>
                <span>Lithium Cell Delta-V Active Balancing</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">·</span>
                <span>BLDC Controller MOSFET Micro-Rework</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">·</span>
                <span>Honda 70cc Petrol-to-EV Conversions (R&D)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Workshop Lab & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Workshop Lab
            </h4>
            <div className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Mughal Plaza, Mughal Chok, Service Road Main Gate Muhafiz Town, Gujranwala.</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:03217436463" className="font-mono text-slate-800 dark:text-slate-200 font-semibold hover:text-emerald-500 transition-colors">
                  0321-7436463
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:nextgenevcare@gmail.com" className="text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition-colors underline font-mono">
                  nextgenevcare@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Mon–Sat: 9:00 AM – 8:00 PM | Fri: 2:00 PM – 8:00 PM</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Next Gen EV Care. Precision Electric Scooty & E-Bike Care in Gujranwala.
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Minimalist Theme Toggle in Footer */}
            {toggleTheme && (
              <button
                onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                title={`Current: ${theme === 'dark' ? 'Dark' : 'Light'} Mode. Click to toggle.`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-emerald-600" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}

            <span>·</span>

            <button
              onClick={openPrivacy}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors underline cursor-pointer"
            >
              Privacy Policy
            </button>
            
            <span>·</span>

            {/* Secondary Footer Shortcut to Owner Admin Portal */}
            <button
              onClick={() => handleNavClick('admin')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Owner Portal</span>
            </button>

            <span>·</span>

            <button
              onClick={scrollToTop}
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
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
