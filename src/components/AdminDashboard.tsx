import React, { useState, useMemo } from 'react';
import { PortfolioItem, BlogPost, CustomerInquiry, ServiceCategory } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Download,
  Users,
  LogOut,
  Phone,
  Search,
  Check,
  X,
  Save,
  Tag,
  Star,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Clock,
  Truck,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  portfolio: PortfolioItem[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  inquiries: CustomerInquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<CustomerInquiry[]>>;
  onResetToDefaults: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isAuthenticated,
  setIsAuthenticated,
  portfolio,
  setPortfolio,
  blogs,
  setBlogs,
  inquiries,
  setInquiries,
  onResetToDefaults
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState<'portfolio' | 'blogs' | 'inquiries' | 'settings'>('portfolio');

  // Search & Filter state
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [portfolioCategoryFilter, setPortfolioCategoryFilter] = useState<string>('all');
  const [blogSearch, setBlogSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // --- New Portfolio Form State ---
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortCategory, setNewPortCategory] = useState<ServiceCategory>('doorstep');
  const [newPortVehicle, setNewPortVehicle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortVoltage, setNewPortVoltage] = useState('60V Nominal');
  const [newPortCapacity, setNewPortCapacity] = useState('32Ah (1.92 kWh)');
  const [newPortMotor, setNewPortMotor] = useState('2.5kW BLDC Hub Motor (Factory Hall Repaired)');
  const [newPortRange, setNewPortRange] = useState('85 km real-world city range');
  const [newPortBms, setNewPortBms] = useState('Smart Bluetooth BMS 40A Active Balancing');
  const [newPortStatus, setNewPortStatus] = useState<PortfolioItem['status']>('Completed');
  const [newPortIsComingSoon, setNewPortIsComingSoon] = useState(false);
  const [newPortMetricLabel, setNewPortMetricLabel] = useState('True City Range');
  const [newPortMetricValue, setNewPortMetricValue] = useState('85 km');
  const [newPortImage, setNewPortImage] = useState('/src/assets/images/custom_ev_conversion_1792957575143.jpg');
  const [newPortHighlight, setNewPortHighlight] = useState('');

  // --- Edit Portfolio Modal State ---
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);

  // --- New Blog Form State ---
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState<'battery-tech' | 'diagnostics' | 'maintenance' | 'retrofitting'>('battery-tech');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogAuthorName, setNewBlogAuthorName] = useState('Engr. Hamza Mughal');
  const [newBlogAuthorRole, setNewBlogAuthorRole] = useState('Master EV Powertrain Specialist');
  const [newBlogReadTime, setNewBlogReadTime] = useState('5 min read');
  const [newBlogTags, setNewBlogTags] = useState('Doorstep, Diagnostics, Gujranwala');
  const [newBlogImage, setNewBlogImage] = useState('/src/assets/images/ev_battery_pack_tech_1792957574705.jpg');
  const [newBlogFeatured, setNewBlogFeatured] = useState(false);

  // --- Edit Blog Modal State ---
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // --- Edit Inquiry Modal State ---
  const [editingInquiry, setEditingInquiry] = useState<CustomerInquiry | null>(null);

  // --- Quick Phone Lead Add State ---
  const [showAddInquiry, setShowAddInquiry] = useState(false);
  const [newInqName, setNewInqName] = useState('');
  const [newInqPhone, setNewInqPhone] = useState('');
  const [newInqVehicle, setNewInqVehicle] = useState('Crown Electric / Yadea T5');
  const [newInqService, setNewInqService] = useState('Door-to-Door Service');
  const [newInqDate, setNewInqDate] = useState('Today / Immediate');
  const [newInqMessage, setNewInqMessage] = useState('');

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'evcare2026' || passwordInput === 'admin123' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('nextgen_admin_auth', 'true');
      showToast('Welcome back, Admin!');
    } else {
      setLoginError('Invalid password. Default demo passcode is: evcare2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nextgen_admin_auth');
    setPasswordInput('');
  };

  // ==================== PORTFOLIO CRUD ====================
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim() || !newPortVehicle.trim() || !newPortDesc.trim()) {
      alert('Please fill in title, vehicle model, and description');
      return;
    }

    const highlightsArray = newPortHighlight
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const isComingSoonFlag = newPortCategory === 'conversions' || newPortStatus === 'Coming Soon' || newPortIsComingSoon;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newPortTitle.trim(),
      category: newPortCategory,
      vehicleModel: newPortVehicle.trim(),
      description: newPortDesc.trim(),
      technicalSpecs: {
        voltage: newPortVoltage,
        capacity: newPortCapacity,
        motor: newPortMotor,
        rangeGain: newPortRange,
        bms: newPortBms
      },
      status: newPortStatus,
      isComingSoon: isComingSoonFlag,
      metrics: {
        label: newPortMetricLabel,
        value: newPortMetricValue
      },
      image: newPortImage,
      completedDate: isComingSoonFlag ? 'Coming Soon (R&D)' : 'Recently Completed',
      highlights: highlightsArray.length > 0 ? highlightsArray : [
        '100% precision digital diagnostics and verification',
        'Repaired with automotive-grade OEM components'
      ]
    };

    setPortfolio([newItem, ...portfolio]);
    showToast(`Project "${newItem.title}" added successfully!`);

    setNewPortTitle('');
    setNewPortVehicle('');
    setNewPortDesc('');
    setNewPortHighlight('');
    setShowAddPortfolio(false);
  };

  const handleStartEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolio({ ...item });
  };

  const handleSaveEditPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio) return;

    if (!editingPortfolio.title.trim() || !editingPortfolio.vehicleModel.trim()) {
      alert('Title and vehicle model cannot be empty.');
      return;
    }

    const updated = {
      ...editingPortfolio,
      isComingSoon: editingPortfolio.category === 'conversions' || editingPortfolio.status === 'Coming Soon' || editingPortfolio.isComingSoon
    };

    setPortfolio(portfolio.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPortfolio(null);
    showToast(`Project "${updated.title}" updated successfully!`);
  };

  const handleDeletePortfolio = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      setPortfolio(portfolio.filter((p) => p.id !== id));
      showToast(`Project "${title}" deleted.`);
    }
  };

  // ==================== BLOG CRUD ====================
  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogExcerpt.trim() || !newBlogContent.trim()) {
      alert('Please fill in article title, excerpt, and content paragraphs');
      return;
    }

    const paragraphs = newBlogContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const tagsArray = newBlogTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: newBlogTitle.trim(),
      slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newBlogCategory,
      excerpt: newBlogExcerpt.trim(),
      content: paragraphs,
      readTime: newBlogReadTime,
      publishedAt: 'October 2026',
      author: {
        name: newBlogAuthorName.trim() || 'Next Gen EV Specialist',
        role: newBlogAuthorRole.trim() || 'EV Master Engineer'
      },
      tags: tagsArray.length > 0 ? tagsArray : ['Technical Guide', 'EV Care'],
      image: newBlogImage,
      featured: newBlogFeatured
    };

    setBlogs([newPost, ...blogs]);
    showToast(`Article "${newPost.title}" published!`);

    setNewBlogTitle('');
    setNewBlogExcerpt('');
    setNewBlogContent('');
    setShowAddBlog(false);
  };

  const handleStartEditBlog = (post: BlogPost) => {
    setEditingBlog({ ...post });
  };

  const handleSaveEditBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    if (!editingBlog.title.trim() || !editingBlog.excerpt.trim()) {
      alert('Article title and summary excerpt cannot be empty.');
      return;
    }

    setBlogs(blogs.map((b) => (b.id === editingBlog.id ? editingBlog : b)));
    setEditingBlog(null);
    showToast(`Article "${editingBlog.title}" updated successfully!`);
  };

  const handleDeleteBlog = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete article "${title}"? This cannot be undone.`)) {
      setBlogs(blogs.filter((b) => b.id !== id));
      showToast(`Article "${title}" deleted.`);
    }
  };

  // ==================== INQUIRIES CRUD ====================
  const handleAddInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInqName.trim() || !newInqPhone.trim()) {
      alert('Please fill in customer name and phone number');
      return;
    }

    const newInquiryItem: CustomerInquiry = {
      id: `lead-${Date.now()}`,
      name: newInqName.trim(),
      phone: newInqPhone.trim(),
      email: 'phone-booking@nextgenev.pk',
      vehicleModel: newInqVehicle.trim(),
      serviceType: newInqService.trim(),
      message: newInqMessage.trim() || 'Direct phone booking recorded via Admin Portal',
      preferredDate: newInqDate.trim(),
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'New'
    };

    setInquiries([newInquiryItem, ...inquiries]);
    showToast(`Inquiry for "${newInquiryItem.name}" logged successfully!`);
    setNewInqName('');
    setNewInqPhone('');
    setNewInqMessage('');
    setShowAddInquiry(false);
  };

  const handleUpdateInquiryStatus = (id: string, newStatus: CustomerInquiry['status']) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    showToast(`Status updated to "${newStatus}"`);
  };

  const handleSaveEditInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry) return;

    setInquiries(inquiries.map((inq) => (inq.id === editingInquiry.id ? editingInquiry : inq)));
    setEditingInquiry(null);
    showToast(`Inquiry #${editingInquiry.id} updated!`);
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm('Delete this inquiry record from the database?')) {
      setInquiries(inquiries.filter((inq) => inq.id !== id));
      showToast('Inquiry record deleted.');
    }
  };

  const handleExportData = () => {
    const data = {
      portfolio,
      blogs,
      inquiries,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `next_gen_ev_care_content_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported successfully!');
  };

  const filteredPortfolio = useMemo(() => {
    return portfolio.filter((item) => {
      const matchSearch = 
        item.title.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
        item.vehicleModel.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(portfolioSearch.toLowerCase());
      const matchCat = portfolioCategoryFilter === 'all' || item.category === portfolioCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [portfolio, portfolioSearch, portfolioCategoryFilter]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((item) => {
      return (
        item.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(blogSearch.toLowerCase()) ||
        item.author.name.toLowerCase().includes(blogSearch.toLowerCase())
      );
    });
  }, [blogs, blogSearch]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.phone.includes(inquirySearch) ||
        inq.vehicleModel.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        inq.serviceType.toLowerCase().includes(inquirySearch.toLowerCase());
      const matchStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [inquiries, inquirySearch, inquiryStatusFilter]);

  // ==================== AUTH LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Business Owner Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with your master passcode to manage portfolio projects, knowledge base guides, and customer leads across all devices.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              {loginError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Unlock className="w-4 h-4 text-slate-950" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">Default Demo Passcode:</span>
            <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">evcare2026</code>
          </div>
        </div>
      </div>
    );
  }

  // ==================== AUTHENTICATED ADMIN DASHBOARD ====================
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-3 sm:right-6 z-50 max-w-sm w-full p-3.5 rounded-xl bg-emerald-500 text-slate-950 shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-2 text-xs font-bold border border-emerald-400">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-slate-950" />
          <span className="flex-1 truncate">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-0.5 hover:opacity-75">
            <X className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                Next Gen EV Care Owner Dashboard
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono shrink-0">
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Manage case studies, knowledge base articles, and doorstep booking leads.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-end">
          <button
            onClick={handleExportData}
            className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            title="Download JSON data snapshot"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics Strip (Responsive 2-col on mobile, 4-col on desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight font-mono">
              {portfolio.length}
            </div>
            <div className="text-[11px] text-slate-500 truncate">Case Studies</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight font-mono">
              {blogs.length}
            </div>
            <div className="text-[11px] text-slate-500 truncate">Tech Guides</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight font-mono">
              {inquiries.filter((i) => i.status === 'New').length} / {inquiries.length}
            </div>
            <div className="text-[11px] text-slate-500 truncate">New / Total Leads</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
              Active
            </div>
            <div className="text-[11px] text-slate-500 truncate">Door-to-Door Care</div>
          </div>
        </div>
      </div>

      {/* Admin Tab Switcher (Touch friendly, no scrollbar cutoffs) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto w-full">
        <button
          onClick={() => setAdminTab('portfolio')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            adminTab === 'portfolio'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Projects ({portfolio.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('blogs')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            adminTab === 'blogs'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Articles ({blogs.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('inquiries')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            adminTab === 'inquiries'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Leads ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            adminTab === 'settings'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="hidden sm:inline">Reset Defaults</span>
          <span className="sm:hidden">Reset</span>
        </button>
      </div>

      {/* ==================== TAB 1: PORTFOLIO MANAGEMENT ==================== */}
      {adminTab === 'portfolio' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Portfolio & Case Studies Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showcase doorstep repairs, motor hall fixes, controller overhauls, and coming-soon conversions.
              </p>
            </div>
            <button
              onClick={() => setShowAddPortfolio(!showAddPortfolio)}
              className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddPortfolio ? 'Close Form' : 'Add New Portfolio Entry'}</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={portfolioSearch}
                onChange={(e) => setPortfolioSearch(e.target.value)}
                placeholder="Search by title, vehicle model, or keyword..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">Category:</span>
              <select
                value={portfolioCategoryFilter}
                onChange={(e) => setPortfolioCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Categories ({portfolio.length})</option>
                <option value="doorstep">Door-to-Door Service</option>
                <option value="motor-controller">Motor & Controller</option>
                <option value="diagnostics">Diagnostics</option>
                <option value="maintenance">Maintenance</option>
                <option value="battery">Battery Tech</option>
                <option value="conversions">Conversions (Coming Soon)</option>
              </select>
            </div>
          </div>

          {/* Add Portfolio Entry Form */}
          {showAddPortfolio && (
            <form onSubmit={handleAddPortfolio} className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-500" />
                  <span>Create New Portfolio Project</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddPortfolio(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={newPortTitle}
                    onChange={(e) => setNewPortTitle(e.target.value)}
                    placeholder="e.g. Doorstep Controller MOSFET Repair for Crown Electric Scooter"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newPortCategory}
                    onChange={(e) => {
                      const cat = e.target.value as ServiceCategory;
                      setNewPortCategory(cat);
                      if (cat === 'conversions') {
                        setNewPortStatus('Coming Soon');
                        setNewPortIsComingSoon(true);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="doorstep">Door-to-Door Service (Main Focus)</option>
                    <option value="motor-controller">Motor & Controller (Component-Level, No Winding)</option>
                    <option value="diagnostics">Electrification Diagnostics</option>
                    <option value="maintenance">Full 24-Point Maintenance</option>
                    <option value="battery">Battery Tech & Cell Balancing</option>
                    <option value="conversions">Conversions (Coming Soon R&D)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    value={newPortVehicle}
                    onChange={(e) => setNewPortVehicle(e.target.value)}
                    placeholder="e.g. Yadea T5 / Crown Classic / Honda CD 70"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={newPortStatus}
                    onChange={(e) => {
                      const stat = e.target.value as any;
                      setNewPortStatus(stat);
                      if (stat === 'Coming Soon') setNewPortIsComingSoon(true);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Coming Soon">Coming Soon (R&D)</option>
                    <option value="R&D Benchmark">R&D Benchmark</option>
                  </select>
                </div>

                <div className="flex items-center pt-2 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={newPortIsComingSoon}
                      onChange={(e) => setNewPortIsComingSoon(e.target.checked)}
                      className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-400"
                    />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Mark as Coming Soon</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Voltage Spec
                  </label>
                  <input
                    type="text"
                    value={newPortVoltage}
                    onChange={(e) => setNewPortVoltage(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Capacity Spec
                  </label>
                  <input
                    type="text"
                    value={newPortCapacity}
                    onChange={(e) => setNewPortCapacity(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Motor Spec
                  </label>
                  <input
                    type="text"
                    value={newPortMotor}
                    onChange={(e) => setNewPortMotor(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Key Metric *
                  </label>
                  <input
                    type="text"
                    value={newPortMetricValue}
                    onChange={(e) => setNewPortMetricValue(e.target.value)}
                    placeholder="e.g. 100% Repaired"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Photo Asset
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={newPortImage}
                    onChange={(e) => setNewPortImage(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="/src/assets/images/custom_ev_conversion_1792957575143.jpg">EV Scooter Inspection & Powertrain</option>
                    <option value="/src/assets/images/ev_battery_pack_tech_1792957574705.jpg">Battery Pack & Smart BMS Lab</option>
                    <option value="/src/assets/images/ev_diagnostics_motor_1792957576018.jpg">Motor Diagnostics Oscilloscope</option>
                    <option value="/src/assets/images/hero_ev_workshop_1792957574841.jpg">Full Workshop Lift Facility</option>
                  </select>
                  <img src={newPortImage} alt="" className="w-16 h-10 rounded object-cover border border-slate-300 dark:border-slate-700 shrink-0 self-start" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Description & Diagnostic Summary *
                </label>
                <textarea
                  rows={3}
                  value={newPortDesc}
                  onChange={(e) => setNewPortDesc(e.target.value)}
                  placeholder="Detail symptoms, door-to-door diagnostic process, component replacement, and final dyno test..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Technical Highlights (One bullet point per line)
                </label>
                <textarea
                  rows={2}
                  value={newPortHighlight}
                  onChange={(e) => setNewPortHighlight(e.target.value)}
                  placeholder="Replaced 3x Honeywell hall sensors without stator rewinding&#10;Sealed with marine waterproof dielectric compound"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPortfolio(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish to Portfolio</span>
                </button>
              </div>
            </form>
          )}

          {/* Mobile Card View (Visible on screens < md) */}
          <div className="md:hidden space-y-3">
            {filteredPortfolio.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                No projects found.
              </div>
            ) : (
              filteredPortfolio.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-14 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.vehicleModel}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                      {item.category.replace('-', ' ')}
                    </span>
                    {item.isComingSoon || item.status === 'Coming Soon' ? (
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                    )}
                    <span className="ml-auto font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.metrics.value}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleStartEditPortfolio(item)}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePortfolio(item.id, item.title)}
                      className="py-1.5 px-3 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (Visible on screens >= md) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Vehicle Model</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Key Metric</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredPortfolio.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        No projects match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPortfolio.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-8 rounded object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs block">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: {item.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-slate-700 dark:text-slate-300 font-medium">
                            {item.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {item.vehicleModel}
                        </td>
                        <td className="py-3 px-4">
                          {item.isComingSoon || item.status === 'Coming Soon' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              Coming Soon
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              {item.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.metrics.value}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleStartEditPortfolio(item)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                              title="Edit Project"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePortfolio(item.id, item.title)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT PORTFOLIO MODAL ==================== */}
      {editingPortfolio && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-2xl w-full my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Edit Portfolio Case Study
                  </h3>
                  <p className="text-[11px] text-slate-500">ID: {editingPortfolio.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPortfolio(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPortfolio} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={editingPortfolio.title}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingPortfolio.category}
                    onChange={(e) => {
                      const cat = e.target.value as ServiceCategory;
                      setEditingPortfolio({ 
                        ...editingPortfolio, 
                        category: cat,
                        isComingSoon: cat === 'conversions' ? true : editingPortfolio.isComingSoon
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="doorstep">Door-to-Door Service (Main Focus)</option>
                    <option value="motor-controller">Motor & Controller (No Winding)</option>
                    <option value="diagnostics">Electrification Diagnostics</option>
                    <option value="maintenance">Full 24-Point Maintenance</option>
                    <option value="battery">Battery Tech & SOH</option>
                    <option value="conversions">Conversions (Coming Soon R&D)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    value={editingPortfolio.vehicleModel}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, vehicleModel: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingPortfolio.status}
                    onChange={(e) => {
                      const stat = e.target.value as any;
                      setEditingPortfolio({ 
                        ...editingPortfolio, 
                        status: stat,
                        isComingSoon: stat === 'Coming Soon' ? true : editingPortfolio.isComingSoon
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="R&D Benchmark">R&D Benchmark</option>
                  </select>
                </div>

                <div className="flex items-center pt-2 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!editingPortfolio.isComingSoon}
                      onChange={(e) => setEditingPortfolio({ ...editingPortfolio, isComingSoon: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-400"
                    />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Coming Soon Flag</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Voltage
                  </label>
                  <input
                    type="text"
                    value={editingPortfolio.technicalSpecs.voltage}
                    onChange={(e) => setEditingPortfolio({
                      ...editingPortfolio,
                      technicalSpecs: { ...editingPortfolio.technicalSpecs, voltage: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={editingPortfolio.technicalSpecs.capacity}
                    onChange={(e) => setEditingPortfolio({
                      ...editingPortfolio,
                      technicalSpecs: { ...editingPortfolio.technicalSpecs, capacity: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Metric Value
                  </label>
                  <input
                    type="text"
                    value={editingPortfolio.metrics.value}
                    onChange={(e) => setEditingPortfolio({
                      ...editingPortfolio,
                      metrics: { ...editingPortfolio.metrics, value: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Metric Label
                  </label>
                  <input
                    type="text"
                    value={editingPortfolio.metrics.label}
                    onChange={(e) => setEditingPortfolio({
                      ...editingPortfolio,
                      metrics: { ...editingPortfolio.metrics, label: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Photo Asset
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={editingPortfolio.image}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, image: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="/src/assets/images/custom_ev_conversion_1792957575143.jpg">EV Scooter Inspection & Powertrain</option>
                    <option value="/src/assets/images/ev_battery_pack_tech_1792957574705.jpg">Battery Pack & Smart BMS Lab</option>
                    <option value="/src/assets/images/ev_diagnostics_motor_1792957576018.jpg">Motor Diagnostics Oscilloscope</option>
                    <option value="/src/assets/images/hero_ev_workshop_1792957574841.jpg">Full Workshop Lift Facility</option>
                  </select>
                  <img src={editingPortfolio.image} alt="" className="w-16 h-10 rounded object-cover border border-slate-300 dark:border-slate-700 shrink-0 self-start" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={3}
                  value={editingPortfolio.description}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Highlights (One bullet point per line)
                </label>
                <textarea
                  rows={2}
                  value={editingPortfolio.highlights.join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n');
                    setEditingPortfolio({ ...editingPortfolio, highlights: lines });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPortfolio(null)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Project Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: ARTICLES MANAGEMENT ==================== */}
      {adminTab === 'blogs' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Knowledge Base & Diagnostic Guides Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Articles covering motor hall repairs, controller debugging, battery pack thermal balancing, and monsoon protection.
              </p>
            </div>
            <button
              onClick={() => setShowAddBlog(!showAddBlog)}
              className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddBlog ? 'Close Form' : 'Add New Article'}</span>
            </button>
          </div>

          {/* Blog Search Bar */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={blogSearch}
                onChange={(e) => setBlogSearch(e.target.value)}
                placeholder="Search articles by title, excerpt, or author..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Add Blog Form */}
          {showAddBlog && (
            <form onSubmit={handleAddBlog} className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-500" />
                  <span>Publish New Technical Guide</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddBlog(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    placeholder="e.g. Diagnosing Stiff Electric Scooter Wheels: Shorted MOSFET vs Burnt Coil"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newBlogCategory}
                    onChange={(e) => setNewBlogCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="battery-tech">Battery Tech & Cell Balancing</option>
                    <option value="diagnostics">Diagnostics & Electrical</option>
                    <option value="maintenance">Maintenance & Monsoon Care</option>
                    <option value="retrofitting">EV Retrofitting & Powertrains</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newBlogAuthorName}
                    onChange={(e) => setNewBlogAuthorName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={newBlogAuthorRole}
                    onChange={(e) => setNewBlogAuthorRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={newBlogReadTime}
                    onChange={(e) => setNewBlogReadTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center pt-2 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={newBlogFeatured}
                      onChange={(e) => setNewBlogFeatured(e.target.checked)}
                      className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-400"
                    />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Featured</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newBlogTags}
                  onChange={(e) => setNewBlogTags(e.target.value)}
                  placeholder="e.g. Controller, MOSFETs, BLDC, Doorstep"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Summary Excerpt (Shown on cards) *
                </label>
                <textarea
                  rows={2}
                  value={newBlogExcerpt}
                  onChange={(e) => setNewBlogExcerpt(e.target.value)}
                  placeholder="Short summary highlighting the symptoms, diagnostic method, and technical solution..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Article Body (Separate paragraphs with double enter) *
                </label>
                <textarea
                  rows={5}
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  placeholder="Write complete technical steps, multimeter measurements, component part numbers, and safety warnings..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlog(false)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          )}

          {/* Mobile Card View (Screens < md) */}
          <div className="md:hidden space-y-3">
            {filteredBlogs.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                No articles match your criteria.
              </div>
            ) : (
              filteredBlogs.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5 min-w-0">
                      {item.featured && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                      )}
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {item.category.replace('-', ' ')}
                    </span>
                    <span>·</span>
                    <span>{item.author.name}</span>
                    <span>·</span>
                    <span className="font-mono">{item.readTime}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleStartEditBlog(item)}
                      className="flex-1 py-1.5 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(item.id, item.title)}
                      className="py-1.5 px-3 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (Screens >= md) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Read Time</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        No articles match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {item.featured && (
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                            )}
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-sm block">
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                /{item.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400">
                          {item.category.replace('-', ' ')}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {item.author.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {item.readTime}
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">
                          {item.publishedAt}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleStartEditBlog(item)}
                              className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(item.id, item.title)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT BLOG MODAL ==================== */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-2xl w-full my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Edit Technical Article
                  </h3>
                  <p className="text-[11px] text-slate-500">ID: {editingBlog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingBlog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBlog} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingBlog.category}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="battery-tech">Battery Tech</option>
                    <option value="diagnostics">Diagnostics</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retrofitting">EV Retrofitting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={editingBlog.author.name}
                    onChange={(e) => setEditingBlog({
                      ...editingBlog,
                      author: { ...editingBlog.author, name: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={editingBlog.author.role}
                    onChange={(e) => setEditingBlog({
                      ...editingBlog,
                      author: { ...editingBlog.author, role: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={editingBlog.readTime}
                    onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center pt-2 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!editingBlog.featured}
                      onChange={(e) => setEditingBlog({ ...editingBlog, featured: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-400"
                    />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Featured</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingBlog.tags.join(', ')}
                  onChange={(e) => {
                    const tagArr = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                    setEditingBlog({ ...editingBlog, tags: tagArr });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Summary Excerpt *
                </label>
                <textarea
                  rows={2}
                  value={editingBlog.excerpt}
                  onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Article Content (Paragraphs separated by blank lines) *
                </label>
                <textarea
                  rows={5}
                  value={editingBlog.content.join('\n\n')}
                  onChange={(e) => {
                    const paragraphs = e.target.value.split('\n\n').map((p) => p.trim()).filter(Boolean);
                    setEditingBlog({ ...editingBlog, content: paragraphs });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-sans"
                  required
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Article Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: INQUIRIES & LEADS ==================== */}
      {adminTab === 'inquiries' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Service Bookings & Leads
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage appointment requests, phone leads, doorstep dispatches, and customer status.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddInquiry(!showAddInquiry)}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddInquiry ? 'Cancel' : 'Log Phone Booking'}</span>
              </button>
            </div>
          </div>

          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                placeholder="Search leads by customer name, phone number, vehicle, or service..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">Status:</span>
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Statuses ({inquiries.length})</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Quick Add Inquiry Form (Phone Booking) */}
          {showAddInquiry && (
            <form onSubmit={handleAddInquiry} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-md space-y-3 animate-in fade-in">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Log New Customer Phone Call / Direct Booking</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={newInqName}
                    onChange={(e) => setNewInqName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (PK) *
                  </label>
                  <input
                    type="text"
                    value={newInqPhone}
                    onChange={(e) => setNewInqPhone(e.target.value)}
                    placeholder="0321-XXXXXXX"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Model
                  </label>
                  <input
                    type="text"
                    value={newInqVehicle}
                    onChange={(e) => setNewInqVehicle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Service Requested
                  </label>
                  <select
                    value={newInqService}
                    onChange={(e) => setNewInqService(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Door-to-Door Service">Door-to-Door Service (Main Focus)</option>
                    <option value="Motor Repair (Component Level)">Motor Repair (Component Level - No Winding)</option>
                    <option value="Controller Diagnostic & MOSFET Repair">Controller Diagnostic & MOSFET Repair</option>
                    <option value="Full 24-Point Maintenance">Full 24-Point Maintenance</option>
                    <option value="Battery Health & Balancing">Battery Health & Balancing</option>
                    <option value="Conversions Inquiry (Coming Soon)">Conversions Inquiry (Coming Soon)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Appointment Date/Time
                  </label>
                  <input
                    type="text"
                    value={newInqDate}
                    onChange={(e) => setNewInqDate(e.target.value)}
                    placeholder="e.g. Tomorrow 3:00 PM"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Customer Issue Notes
                </label>
                <textarea
                  rows={2}
                  value={newInqMessage}
                  onChange={(e) => setNewInqMessage(e.target.value)}
                  placeholder="e.g. Rear wheel vibrating heavily at 25 km/h, customer requested doorstep visit in Model Town Gujranwala."
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddInquiry(false)}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm"
                >
                  Save Booking Lead
                </button>
              </div>
            </form>
          )}

          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No inquiries found matching your filters.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {inq.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        #{inq.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-500">Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border ${
                          inq.status === 'New'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                            : inq.status === 'Scheduled'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Resolved">Resolved</option>
                      </select>

                      <button
                        onClick={() => setEditingInquiry({ ...inq })}
                        className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                        title="Edit Customer Details / Notes"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${inq.phone}`} className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                        {inq.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400">Vehicle: </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{inq.vehicleModel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Date: </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{inq.preferredDate}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5">
                      Service: {inq.serviceType}
                    </p>
                    <p className="leading-relaxed">"{inq.message}"</p>
                  </div>

                  {/* Quick Action Contact Strip for Mobile Operators */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${inq.phone}`}
                      className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Client</span>
                    </a>
                    <a
                      href={`https://wa.me/92${inq.phone.replace(/[^0-9]/g, '').replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== EDIT INQUIRY MODAL ==================== */}
      {editingInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-md w-full my-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Edit Customer Appointment Details
                  </h3>
                  <p className="text-[11px] text-slate-500">#{editingInquiry.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingInquiry(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditInquiry} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={editingInquiry.name}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingInquiry.phone}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  value={editingInquiry.vehicleModel}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, vehicleModel: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Service Type
                </label>
                <input
                  type="text"
                  value={editingInquiry.serviceType}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, serviceType: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Appointment Date
                </label>
                <input
                  type="text"
                  value={editingInquiry.preferredDate}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, preferredDate: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editingInquiry.status}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, status: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Notes & Symptoms
                </label>
                <textarea
                  rows={3}
                  value={editingInquiry.message}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, message: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingInquiry(null)}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SETTINGS & RESET ==================== */}
      {adminTab === 'settings' && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Maintenance & Reset Defaults
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore the original showcase projects, knowledge base guides, and initial Pakistani EV service demo records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Reset to Workshop Initial Defaults</span>
            </p>
            <p className="leading-relaxed">
              This action restores the original verified case studies, doorstep service guides, and technical articles. Any newly added items stored in your local browser cache will be reset.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all portfolio entries, blogs, and inquiries to workshop defaults?')) {
                  onResetToDefaults();
                  showToast('Database reset to factory defaults.');
                }
              }}
              className="mt-2 w-full sm:w-auto px-4 py-2 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors text-center"
            >
              Confirm Reset to Factory Defaults
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
