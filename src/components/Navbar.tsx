import React, { useState } from 'react';
import { ActiveTab, ThemeMode } from '../types';
import { 
  Zap, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  PhoneCall,
  Youtube,
  Facebook,
  Instagram
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

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'calculator', label: 'EV Tools' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'blog', label: 'Knowledge Base' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 dark:bg-slate-950/90 bg-white/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-400 transition-colors">
            <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500/30" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
              Next Gen <span className="text-emerald-500 dark:text-emerald-400">EV Care</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider block">
              Bike & Scooty Care Hub
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean Typography, Single Line) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions Group (Theme Toggle, Social Icons & Quick CTA) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Social Links */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 dark:text-slate-500 border-r border-slate-200 dark:border-slate-800 pr-2.5">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube Channel"
              className="p-1.5 rounded-md hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Page"
              className="p-1.5 rounded-md hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Profile"
              className="p-1.5 rounded-md hover:text-pink-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={() => handleNavClick('admin')}
            aria-label="Admin Dashboard"
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              activeTab === 'admin'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border-transparent hover:border-slate-300 dark:hover:border-slate-800'
            }`}
            title="Owner Admin Dashboard"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden xl:inline">{isAdminAuthenticated ? 'Admin Active' : 'Admin'}</span>
            </span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleNavClick('contact')}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Book Service</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 space-y-1 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 text-xs text-slate-500">
            <span>Follow our channels:</span>
            <div className="flex items-center gap-3">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-500">YouTube</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500">Instagram</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
