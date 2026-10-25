import React from 'react';
import { ActiveTab } from '../types';
import { 
  Zap, 
  Youtube, 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  openPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openPrivacy }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-900">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-4 h-4 fill-emerald-400/30 text-emerald-400" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Next Gen <span className="text-emerald-400">EV Care</span>
              </span>
            </div>
            
            <p className="text-slate-400 leading-relaxed text-xs">
              Specialized electric two-wheeler maintenance, custom lithium pack fabrication, oscilloscope diagnostics, and IC-engine conversions.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Mirror */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { setActiveTab('home'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('calculator'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  EV Range & Charge Tool
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('portfolio'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Portfolio Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('blog'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Technical Knowledge Base
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('about'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About Our EV Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('contact'); scrollToTop(); }}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Book Service Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Specializations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Specializations
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Lithium-Ion & LFP Pack Assembly</li>
              <li>Active Cell Balancing & SOH Tests</li>
              <li>BLDC Hub & Mid-Drive Motor Rewinding</li>
              <li>FOC Sine-Wave Controller Tuning</li>
              <li>Honda Activa EV Conversions</li>
              <li>Monsoon Wiring Waterproofing</li>
            </ul>
          </div>

          {/* Workshop Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Workshop Lab
            </h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Plot 42, Green Energy Tech Corridor, Industrial Area Phase II, Bengaluru</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-300">+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:nextgenevcare@gmail.com" className="text-slate-300 hover:text-emerald-400 underline font-mono">
                  nextgenevcare@gmail.com
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Next Gen EV Care. All rights reserved. Precision Electric Mobility Engineering.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openPrivacy}
              className="hover:text-slate-300 transition-colors underline"
            >
              Privacy Policy & Telemetry
            </button>
            <span>·</span>
            <button
              onClick={() => { setActiveTab('admin'); scrollToTop(); }}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-slate-400"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Owner Portal</span>
            </button>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1"
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
