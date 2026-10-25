import React, { useState, useMemo } from 'react';
import { BlogPost } from '../types';
import { 
  BookOpen, 
  Search, 
  Clock, 
  User, 
  ArrowRight, 
  X, 
  Share2, 
  Tag, 
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

interface KnowledgeBaseProps {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  setSelectedPost: (post: BlogPost | null) => void;
  onNavigateToCalculator?: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  posts,
  selectedPost,
  setSelectedPost,
  onNavigateToCalculator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'battery-tech', label: 'Battery Tech' },
    { id: 'diagnostics', label: 'Diagnostics & Electrical' },
    { id: 'maintenance', label: 'Maintenance & Monsoon' },
    { id: 'retrofitting', label: 'EV Retrofitting' }
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
            <span>ENGINEERING PAPERS & REPAIR PROCEDURES</span>
            <span aria-hidden="true">·</span>
            <span>Technical Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EV Care Knowledge Base & Guides
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            In-depth guides on lithium battery chemistry, troubleshooting hall sensors, waterproofing controllers, and custom electric conversions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, BMS, sensors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills/Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-3xl mb-8 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">No articles match your query</p>
          <p className="text-xs text-slate-500 mt-1">Try another keyword or select All Articles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Optional Post Hero Image */}
              {post.image && (
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-emerald-400 border border-slate-700">
                    {post.tags[0] || 'Technical Guide'}
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{post.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{post.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[130px]">{post.author.name}</span>
                  </div>

                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ===================== FULL ARTICLE READER MODAL ===================== */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {selectedPost.tags[0] || 'Technical Paper'}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{selectedPost.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="Copy link to article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {copiedLink && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium">
                  Link copied to clipboard!
                </div>
              )}

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedPost.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400">Published by: </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{selectedPost.author.name}</span>
                    <span className="text-slate-500"> ({selectedPost.author.role})</span>
                  </div>
                  <span>·</span>
                  <span>{selectedPost.publishedAt}</span>
                </div>
              </div>

              {/* Featured Image if present */}
              {selectedPost.image && (
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[16/9]">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Article Content Paragraphs */}
              <div className="prose dark:prose-invert max-w-none space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedPost.content.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {selectedPost.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Workshop Callout Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-900 dark:text-white">Facing similar issues on your electric bike or scooty?</p>
                  <p className="text-slate-500">Our technicians provide computerized cell testing and hall sensor repair.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    if (onNavigateToCalculator) onNavigateToCalculator();
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg whitespace-nowrap self-start sm:self-auto"
                >
                  Test On Range Calculator
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
