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

  // --- Dark / Light Theme Mode (Defaults to dark tech mode) ---
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('nextgen_theme');
    return (saved as ThemeMode) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('nextgen_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
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
