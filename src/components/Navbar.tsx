import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { 
  Zap, 
  Sun, 
  Moon, 
  Monitor,
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
  ChevronDown,
  Check,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  toggleTheme: (mode?: ThemeMode) => void;
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
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mobileThemeDropdownOpen, setMobileThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setThemeDropdownOpen(false);
        setMobileThemeDropdownOpen(false);
      }
    };

    if (themeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [themeDropdownOpen]);

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

      {/* Main Sticky Header with Frosted Glassmorphism */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl saturate-180 bg-white/75 dark:bg-slate-950/75 border-b border-white/80 dark:border-white/10 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
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
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
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
            <div className="hidden xl:flex items-center gap-1 text-slate-400 dark:text-slate-500 border-r border-slate-200/60 dark:border-white/10 pr-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                className="p-1.5 rounded-lg hover:text-red-500 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                className="p-1.5 rounded-lg hover:text-blue-500 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="p-1.5 rounded-lg hover:text-pink-500 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Theme Switcher Dropdown Functionality (Liquid Glass & Uniform h-10) */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                type="button"
                onClick={() => setThemeDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={themeDropdownOpen}
                aria-label="Color theme selector"
                className="h-10 px-2.5 sm:px-3 rounded-xl liquid-glass text-slate-800 dark:text-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                title={`Theme: ${theme === 'system' ? 'System Default' : theme === 'dark' ? 'Dark Mode' : 'Light Mode'}. Click to change.`}
              >
                {theme === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                ) : theme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Monitor className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <span className="hidden sm:inline capitalize font-medium text-xs">
                  {theme === 'system' ? 'System' : theme}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${themeDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>

              {/* Floating Dropdown Menu (Tactile Frosted Glass) */}
              {themeDropdownOpen && (
                <div 
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-36 sm:w-40 z-50 rounded-xl liquid-glass shadow-2xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Theme
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      toggleTheme('light');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Light</span>
                    </div>
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      toggleTheme('dark');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dark</span>
                    </div>
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      toggleTheme('system');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      theme === 'system'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>System</span>
                    </div>
                    {theme === 'system' && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Admin Portal Shortcut (Uniform h-10) */}
            <button
              onClick={() => handleNavClick('admin')}
              aria-label="Admin Dashboard"
              className={`hidden md:flex items-center gap-1.5 h-10 px-3 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'liquid-glass text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
              title="Owner Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden xl:inline">{isAdminAuthenticated ? 'Admin Active' : 'Admin'}</span>
            </button>

            {/* Book Doorstep CTA (Uniform h-10) */}
            <button
              onClick={() => handleNavClick('contact')}
              className="h-10 px-3 sm:px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Doorstep</span>
              <span className="sm:hidden">Book</span>
            </button>

            {/* Mobile Hamburger Button with Accessible Touch Target & Uniform h-10 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl liquid-glass text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white focus:outline-none transition-colors cursor-pointer"
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
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md -z-10"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu Container (Liquid Glass) */}
          <div className="w-full liquid-glass border-b border-white/80 dark:border-white/10 shadow-2xl max-h-[calc(100vh-95px)] overflow-y-auto p-4 space-y-4">
            
            {/* Mobile Drawer Brand Header */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
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
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">Door-to-Door EV Diagnostics & Repairs</span>
              </div>
            </div>
            
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

            {/* Display Theme Selector (Mobile Friendly Dropdown Functionality) */}
            <div className="p-3.5 rounded-xl liquid-glass-subtle space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Display Theme</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono capitalize">
                  {theme === 'system' ? 'System Sync' : `${theme} Mode`}
                </span>
              </div>

              {/* Interactive Mobile Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMobileThemeDropdownOpen((prev) => !prev)}
                  aria-expanded={mobileThemeDropdownOpen}
                  aria-haspopup="true"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl liquid-glass text-xs font-semibold text-slate-900 dark:text-white shadow-2xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {theme === 'light' ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : theme === 'dark' ? (
                      <Moon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    <span>{theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'System Default Sync'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileThemeDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                </button>

                {/* Mobile Dropdown Menu Options */}
                {mobileThemeDropdownOpen && (
                  <div className="mt-1.5 p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 shadow-lg space-y-0.5 animate-in fade-in duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme('light');
                        setMobileThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        theme === 'light'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <span>Light Mode</span>
                      </div>
                      {theme === 'light' && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme('dark');
                        setMobileThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Moon className="w-4 h-4 text-emerald-400" />
                        <span>Dark Mode</span>
                      </div>
                      {theme === 'dark' && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme('system');
                        setMobileThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        theme === 'system'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span>System Default Sync</span>
                      </div>
                      {theme === 'system' && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>
                  </div>
                )}
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
