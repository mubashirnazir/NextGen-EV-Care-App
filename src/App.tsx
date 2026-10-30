/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, ThemeMode, PortfolioItem, BlogPost, CustomerInquiry } from './types';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS, INITIAL_INQUIRIES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EVCalculator } from './components/EVCalculator';
import { Portfolio } from './components/Portfolio';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyModal } from './components/PrivacyModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { DidYouKnowToast } from './components/DidYouKnowToast';
import { Footer } from './components/Footer';

export default function App() {
  // --- Navigation & Views ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  // --- Dark / Light / System Theme Mode Manager ---
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('nextgen_theme');
    return (saved as ThemeMode) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    applyTheme();
    localStorage.setItem('nextgen_theme', theme);

    if (theme === 'system') {
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const toggleTheme = (targetTheme?: ThemeMode) => {
    if (targetTheme) {
      setTheme(targetTheme);
      return;
    }
    // Cycle: dark -> light -> system -> dark
    setTheme((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  };

  // --- Admin Authentication State ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nextgen_admin_auth') === 'true';
  });

  // --- Persistent Portfolio Data ---
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('nextgen_portfolio_pk_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PORTFOLIO;
      }
    }
    return INITIAL_PORTFOLIO;
  });

  useEffect(() => {
    localStorage.setItem('nextgen_portfolio_pk_v3', JSON.stringify(portfolio));
  }, [portfolio]);

  // --- Persistent Blog Data ---
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('nextgen_blogs_pk_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_BLOGS;
      }
    }
    return INITIAL_BLOGS;
  });

  useEffect(() => {
    localStorage.setItem('nextgen_blogs_pk_v3', JSON.stringify(blogs));
  }, [blogs]);

  // --- Persistent Inquiries Data ---
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    const saved = localStorage.getItem('nextgen_inquiries_pk_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_INQUIRIES;
      }
    }
    return INITIAL_INQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem('nextgen_inquiries_pk_v3', JSON.stringify(inquiries));
  }, [inquiries]);

  // Reset to Factory Defaults
  const handleResetToDefaults = () => {
    setPortfolio(INITIAL_PORTFOLIO);
    setBlogs(INITIAL_BLOGS);
    setInquiries(INITIAL_INQUIRIES);
    localStorage.removeItem('nextgen_portfolio_pk_v3');
    localStorage.removeItem('nextgen_blogs_pk_v3');
    localStorage.removeItem('nextgen_inquiries_pk_v3');
    localStorage.removeItem('nextgen_portfolio_pk_v2');
    localStorage.removeItem('nextgen_blogs_pk_v2');
    localStorage.removeItem('nextgen_inquiries_pk_v2');
    localStorage.removeItem('nextgen_portfolio');
    localStorage.removeItem('nextgen_blogs');
    localStorage.removeItem('nextgen_inquiries');
  };

  // Add inquiry handler
  const handleAddInquiry = (newInquiry: CustomerInquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // Switch to contact with prefilled vehicle from a project
  const handleBookServiceForProject = (project: PortfolioItem) => {
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      {/* Ambient Refractive Background Orbs for Liquid Glass Depth */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-teal-400/15 dark:bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Google Maps Quota Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Sticky Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        isAdminAuthenticated={isAdminAuthenticated}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full min-w-0 overflow-x-clip">
        {activeTab === 'home' && (
          <Hero
            setActiveTab={setActiveTab}
            featuredProjects={portfolio}
            topGuides={blogs}
            onSelectProject={(proj) => {
              setSelectedProject(proj);
              setActiveTab('portfolio');
            }}
            onSelectGuide={(guide) => {
              setSelectedPost(guide);
              setActiveTab('blog');
            }}
          />
        )}

        {activeTab === 'calculator' && (
          <EVCalculator />
        )}

        {activeTab === 'portfolio' && (
          <Portfolio
            projects={portfolio}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            onBookServiceForProject={handleBookServiceForProject}
          />
        )}

        {activeTab === 'blog' && (
          <KnowledgeBase
            posts={blogs}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
            onNavigateToCalculator={() => {
              setActiveTab('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutSection setActiveTab={setActiveTab} />
        )}

        {activeTab === 'faq' && (
          <FAQSection setActiveTab={setActiveTab} />
        )}

        {activeTab === 'contact' && (
          <ContactSection onAddInquiry={handleAddInquiry} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            isAuthenticated={isAdminAuthenticated}
            setIsAuthenticated={setIsAdminAuthenticated}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            blogs={blogs}
            setBlogs={setBlogs}
            inquiries={inquiries}
            setInquiries={setInquiries}
            onResetToDefaults={handleResetToDefaults}
          />
        )}
      </main>

      {/* Did You Know? Pro Maintenance Tips Toast Notification (Homepage only) */}
      {activeTab === 'home' && (
        <DidYouKnowToast setActiveTab={setActiveTab} />
      )}

      {/* WhatsApp Floating Chat Widget */}
      <WhatsAppWidget />

      {/* Privacy Policy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Site Footer */}
      <Footer
        setActiveTab={setActiveTab}
        openPrivacy={() => setIsPrivacyOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

    </div>
  );
}
