import React from 'react';
import { ActiveTab, PortfolioItem, BlogPost } from '../types';
import { HomeHero, ServicesGrid, DiagnosticPreview, HomeTestimonials, CTASection, ScrollFade } from './home';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
  featuredProjects: PortfolioItem[];
  topGuides: BlogPost[];
  onSelectProject: (project: PortfolioItem) => void;
  onSelectGuide: (guide: BlogPost) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setActiveTab,
  featuredProjects,
  topGuides,
  onSelectProject,
  onSelectGuide
}) => {
  return (
    <div className="space-y-16 md:space-y-24 py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Modular High-Performance Hero (Eager loaded, zero delay for primary fold performance) */}
      <ScrollFade delay={0} duration={500} distance={10}>
        <HomeHero setActiveTab={setActiveTab} />
      </ScrollFade>

      {/* 2. Modular Services Grid with Technical Accordions & Infinite Brand Carousel */}
      <ScrollFade delay={100} duration={650} distance={20}>
        <ServicesGrid setActiveTab={setActiveTab} />
      </ScrollFade>

      {/* 3. Diagnostic & Outcome Preview with Live Dyno Teaser */}
      <ScrollFade delay={100} duration={650} distance={20}>
        <DiagnosticPreview 
          setActiveTab={setActiveTab}
          featuredProjects={featuredProjects}
          onSelectProject={onSelectProject}
        />
      </ScrollFade>

      {/* 4. Technical Knowledge Base Preview */}
      <ScrollFade delay={100} duration={650} distance={20}>
        <section className="space-y-8" aria-labelledby="guides-preview-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
                <span className="uppercase tracking-widest text-[11px] font-bold">WORKBENCH TELEMETRY & GUIDES</span>
              </div>
              <h2 id="guides-preview-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Electric Scooty Technical & Maintenance Guides
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Step-by-step diagnostic workflows, multimeter measurement guides, and battery maintenance rules written by certified technicians.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('blog')}
              className="h-10 px-4 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 liquid-glass-subtle hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Explore All Technical Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topGuides.slice(0, 2).map((guide, idx) => (
              <ScrollFade key={guide.id} delay={idx * 100} duration={500} distance={15}>
                <div
                  onClick={() => onSelectGuide(guide)}
                  className="cursor-pointer group p-6 rounded-2xl liquid-glass-card flex flex-col justify-between h-full space-y-4 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{guide.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{guide.author.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{guide.publishedAt}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {guide.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {guide.tags[0]} {guide.tags[1] ? `· ${guide.tags[1]}` : ''}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </ScrollFade>
            ))}
          </div>
        </section>
      </ScrollFade>

      {/* 5. Customer Testimonials & Doorstep Guarantees */}
      <ScrollFade delay={100} duration={650} distance={20}>
        <HomeTestimonials />
      </ScrollFade>

      {/* 6. High-Conversion CTA Section */}
      <ScrollFade delay={100} duration={650} distance={20}>
        <CTASection setActiveTab={setActiveTab} />
      </ScrollFade>

    </div>
  );
};
