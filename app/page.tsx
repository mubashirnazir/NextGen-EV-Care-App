'use client';

import React, { useState } from 'react';
import { HomeHero, ServicesGrid, DiagnosticPreview, HomeTestimonials, CTASection, ScrollFade } from '../src/components/home';
import { INITIAL_PORTFOLIO, INITIAL_BLOGS } from '../src/data/initialData';
import { ActiveTab, PortfolioItem, BlogPost } from '../src/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [featuredProjects] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [topGuides] = useState<BlogPost[]>(INITIAL_BLOGS);

  const handleSelectProject = (project: PortfolioItem) => {
    console.log('Selected Project:', project.title);
  };

  const handleSelectGuide = (guide: BlogPost) => {
    console.log('Selected Guide:', guide.title);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="space-y-16 md:space-y-24 py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Mobile-First Hero Section with Dual CTAs */}
        <ScrollFade delay={0} duration={500} distance={10}>
          <HomeHero setActiveTab={setActiveTab} />
        </ScrollFade>

        {/* 2. Specialized Services Grid with Accordions & Infinite Marquee */}
        <ScrollFade delay={100} duration={650} distance={20}>
          <ServicesGrid setActiveTab={setActiveTab} />
        </ScrollFade>

        {/* 3. Diagnostic & Outcome Preview with Live Dyno Teaser */}
        <ScrollFade delay={100} duration={650} distance={20}>
          <DiagnosticPreview
            setActiveTab={setActiveTab}
            featuredProjects={featuredProjects}
            onSelectProject={handleSelectProject}
          />
        </ScrollFade>

        {/* 4. Verified Customer Testimonials & Doorstep Guarantees */}
        <ScrollFade delay={100} duration={650} distance={20}>
          <HomeTestimonials />
        </ScrollFade>

        {/* 5. High-Impact CTA Conversion Section */}
        <ScrollFade delay={100} duration={650} distance={20}>
          <CTASection setActiveTab={setActiveTab} />
        </ScrollFade>

      </div>
    </main>
  );
}
