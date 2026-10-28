import React, { useState, useEffect } from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { 
  Zap, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
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

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  isAdminAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  isAdminAuthenticated
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      {/* Top Mobile-Friendly Quick Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-b border-slate-800 text-[11px] py-1.5 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="relative flex items-center gap-1.5 truncate min-w-0">
            {/* Blinking Live Indicator Dot on Call Icon */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 animate-pulse"></span>
            </span>
            <span className="font-semibold text-emerald-400 shrink-0">Gujranwala:</span>
            <span className="truncate">Door-to-Door EV Diagnose & Repair</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:03217436463"
              className="flex items-center gap-1.5 font-mono font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group"
              title="Call Next Gen EV Care (Doorstep Dispatch & Support)"
            >
              <div className="relative flex items-center justify-center">
                
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform absolute inline-flex animate-ping" />
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform relative inline-flex animate-pulse" />
              </div>
              <span>0321-7436463</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">Mughal Plaza, Muhafiz Town</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-2.5 text-left group shrink-0 focus:outline-none min-w-0"
            aria-label="Next Gen EV Care Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-400 transition-colors shrink-0">
              <Zap className="w-5 h-5 fill-emerald-500/20" />
            </div>
            <div className="truncate">
              <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
                Next Gen <span className="text-emerald-600 dark:text-emerald-400">EV Care</span>
              </span>
              <span className="hidden xs:block text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider truncate">
                Door-to-Door & Workshop
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
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Elements */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Desktop Social Channels */}
            <div className="hidden xl:flex items-center gap-1 text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 pr-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                className="p-1.5 rounded-lg hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                className="p-1.5 rounded-lg hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="p-1.5 rounded-lg hover:text-pink-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all shrink-0 flex items-center justify-center shadow-xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode (Currently ${theme})`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Desktop Admin Portal Shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              aria-label="Admin Dashboard"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                activeTab === 'admin'
                  ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/40'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent hover:border-slate-300 dark:hover:border-slate-800'
              }`}
              title="Owner Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden xl:inline">{isAdminAuthenticated ? 'Admin Active' : 'Admin'}</span>
            </button>

            {/* Book Doorstep CTA (Full text on sm+, icon/compact on xs) */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Doorstep</span>
              <span className="sm:hidden">Book</span>
            </button>

            {/* Mobile Hamburger Button with accessible 44px touch target */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer & Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[88px] z-50 lg:hidden flex flex-col animate-in fade-in duration-200">
          
          {/* Dark Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm -z-10"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu Container */}
          <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl max-h-[calc(100vh-95px)] overflow-y-auto p-4 space-y-4">
            
            {/* Navigation Links with Icons */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500 text-slate-950' 
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
            </div>

            {/* Doorstep Emergency Hotline Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Door-to-Door Rapid Dispatch</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-semibold">
                  Gujranwala
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Electric bike or scooty breakdown? Our mobile technicians come right to your doorstep.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:03217436463"
                  className="py-2 px-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span className="relative flex items-center justify-center">
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    </span>
                    <div className="relative flex items-center justify-center">
                
                <PhoneCall className="w-3.5 h-3.5 text-slate-950 group-hover:scale-110 transition-transform absolute inline-flex animate-ping" />
                <PhoneCall className="w-3.5 h-3.5 text-slate-950 group-hover:scale-110 transition-transform relative inline-flex animate-pulse" />
              </div>
                  </span>
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/923217436463"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Display Theme Selector (Mobile Friendly) */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Display Theme</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono capitalize">
                  {theme} Mode Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    theme === 'light'
                      ? 'bg-white text-slate-900 border border-slate-300 shadow-sm'
                      : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>Light Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900 text-white border border-slate-700 shadow-sm'
                      : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* Admin Portal Link */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Owner Admin Dashboard</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {isAdminAuthenticated ? 'Logged In' : 'Passcode Required'}
                </span>
              </button>
            </div>

            {/* Address & Social Footnotes */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex items-start gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Mughal Plaza, Mughal Chok, Service Road Main Gate Muhafiz Town, Gujranwala</span>
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px]">Follow our updates:</span>
                <div className="flex items-center gap-3">
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-1 hover:text-red-500 transition-colors" aria-label="YouTube">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-1 hover:text-blue-500 transition-colors" aria-label="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-1 hover:text-pink-500 transition-colors" aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
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
