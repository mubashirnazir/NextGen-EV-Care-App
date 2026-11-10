import React, { useState, useEffect } from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { TikTokIcon, SnapchatIcon, SOCIAL_LINKS } from './SocialIcons';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Phone,
  PhoneCall,
  Youtube, 
  Facebook, 
  Instagram, 
  Truck,
  Home,
  Cpu,
  Wrench,
  BookOpen,
  Info,
  MapPin,
  ChevronRight,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  toggleTheme: (mode?: ThemeMode) => void;
  isAdminAuthenticated?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calculator', label: 'EV Tools', icon: Cpu, badge: 'Calculators' },
    { id: 'portfolio', label: 'Portfolio', icon: Wrench },
    { id: 'blog', label: 'Knowledge Base', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: Phone }
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Instant toggling for the minimalist icon-only button
  const handleToggleTheme = () => {
    if (toggleTheme) {
      // Toggle cleanly: if dark -> light, if light/system -> dark
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      toggleTheme(nextTheme);
    }
  };

  return (
    <>
      {/* Top Mobile-Friendly Emergency Hotline Bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="relative flex items-center gap-1.5 truncate min-w-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 animate-pulse"></span>
            </span>
            <span className="font-semibold text-emerald-400 shrink-0">Gujranwala:</span>
            <span className="truncate">On-Call Doorstep Electric Scooty & E-Bike Repair</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:03217436463"
              className="flex items-center gap-1.5 font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group"
              title="Call Next Gen EV Care Doorstep Dispatch"
            >
              <div className="relative flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform absolute inline-flex animate-ping" />
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform relative inline-flex animate-pulse" />
              </div>
              <span>0321-7436463</span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-slate-400">Mughal Plaza, GT Road</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header with Frosted Glassmorphism (Clutter-Free Customer Header) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl saturate-180 bg-white/80 dark:bg-slate-950/80 border-b border-white/80 dark:border-white/10 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo & Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group shrink-0 focus:outline-none min-w-0 cursor-pointer"
            aria-label="Next Gen EV Care Home"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl liquid-glass p-1 flex items-center justify-center shadow-xs group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10 transition-all shrink-0 overflow-hidden">
              <img
                src="/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png"
                alt="Next Gen EV Care Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div className="truncate">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
                Next Gen <span className="text-emerald-600 dark:text-emerald-400">EV Care</span>
              </span>
              <span className="hidden xs:block text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider truncate">
                Doorstep & Workshop · Gujranwala
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Elements (Customer-Focused & Clutter-Free) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Desktop Social Channels */}
            <div className="hidden xl:flex items-center gap-1 text-slate-400 dark:text-slate-500 border-r border-slate-200/60 dark:border-white/10 pr-2">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                title="YouTube (@NextGenEvCare)"
                className="p-2 rounded-lg hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                title="Facebook (/nextgenevcare)"
                className="p-2 rounded-lg hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                title="Instagram (@nextgenevcare)"
                className="p-2 rounded-lg hover:text-pink-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok Handle"
                title="TikTok (@nextgenevcare)"
                className="p-2 rounded-lg hover:text-cyan-400 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.snapchat}
                target="_blank"
                rel="noreferrer"
                aria-label="Snapchat Profile"
                title="Snapchat (@nextgenevcare)"
                className="p-2 rounded-lg hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <SnapchatIcon className="w-4 h-4" />
              </a>
            </div>

            {/* Streamlined Minimalist Icon-Only Theme Switcher Button */}
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Theme: ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'}. Click to toggle.`}
              className="h-10 w-10 rounded-xl liquid-glass flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/40 active:scale-95 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-600 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Book Doorstep Service CTA Button (Uniform Sizing: h-10 px-4 rounded-xl) */}
            <button
              onClick={() => handleNavClick('contact')}
              className="h-10 px-3.5 sm:px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Book Repair</span>
            </button>

            {/* Mobile Hamburger Button with Accessible Touch Target & Uniform h-10 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl liquid-glass text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white focus:outline-none transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer & Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-50 lg:hidden flex flex-col animate-in fade-in duration-200">
          
          {/* Dark Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md -z-10"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu Container (Liquid Glass Aesthetic) */}
          <div className="w-full liquid-glass border-b border-white/80 dark:border-white/10 shadow-2xl max-h-[calc(100vh-95px)] overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* Mobile Drawer Header with Quick Theme Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                  <img 
                    src="/NextGen-EV-Care-for-Social-Media-on-call-Electric%20Scooty-services-gujranwala.png" 
                    alt="Next Gen EV Care" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Next Gen <span className="text-emerald-500">EV Care</span></span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">Mobile EV Workshop</span>
                </div>
              </div>

              {/* Minimalist Icon-Only Theme Toggle in Mobile Drawer */}
              <button
                type="button"
                onClick={handleToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="h-9 w-9 rounded-xl liquid-glass flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-500 shadow-2xs"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-600" />
                )}
              </button>
            </div>
            
            {/* Primary Navigation Links with Generous Tap Targets */}
            <nav className="space-y-1" aria-label="Mobile Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Doorstep Emergency Hotline Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Doorstep Van Dispatch</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Gujranwala
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Electric scooty or bike breakdown? Mobile technicians dispatched to your location with diagnostic bench and replacement sensors.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:03217436463"
                  className="py-2.5 px-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/923217436463"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Address & Social Footnotes */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Mughal Plaza, Mughal Chok, Service Road Main Gate Muhafiz Town, Gujranwala</span>
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px]">Follow our guides:</span>
                <div className="flex items-center gap-2">
                  <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" aria-label="YouTube" title="YouTube">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors" aria-label="Facebook" title="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-pink-500 transition-colors" aria-label="Instagram" title="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors" aria-label="TikTok" title="TikTok">
                    <TikTokIcon className="w-4 h-4" />
                  </a>
                  <a href={SOCIAL_LINKS.snapchat} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors" aria-label="Snapchat" title="Snapchat">
                    <SnapchatIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
