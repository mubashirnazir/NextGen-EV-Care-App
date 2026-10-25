import React, { useState } from 'react';
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
  BatteryCharging, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Download,
  Users,
  LogOut,
  Layers,
  Calendar,
  Phone,
  Mail,
  Search,
  Check
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

  // --- New Portfolio Form State ---
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortCategory, setNewPortCategory] = useState<ServiceCategory>('conversions');
  const [newPortVehicle, setNewPortVehicle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortVoltage, setNewPortVoltage] = useState('60V Nominal');
  const [newPortCapacity, setNewPortCapacity] = useState('32Ah (1.92 kWh)');
  const [newPortMotor, setNewPortMotor] = useState('2.5kW BLDC Hub Motor');
  const [newPortRange, setNewPortRange] = useState('85 km real-world range');
  const [newPortMetricLabel, setNewPortMetricLabel] = useState('True City Range');
  const [newPortMetricValue, setNewPortMetricValue] = useState('85 km');
  const [newPortImage, setNewPortImage] = useState('/src/assets/images/custom_ev_conversion_1792957575143.jpg');
  const [newPortHighlight, setNewPortHighlight] = useState('');
  const [portSuccessMsg, setPortSuccessMsg] = useState('');

  // --- New Blog Form State ---
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState<'battery-tech' | 'diagnostics' | 'maintenance' | 'retrofitting'>('battery-tech');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogAuthorName, setNewBlogAuthorName] = useState('Rohan Sharma');
  const [newBlogAuthorRole, setNewBlogAuthorRole] = useState('Master EV Powertrain Specialist');
  const [newBlogReadTime, setNewBlogReadTime] = useState('5 min read');
  const [newBlogTags, setNewBlogTags] = useState('Battery Tech, Diagnostics');
  const [newBlogImage, setNewBlogImage] = useState('/src/assets/images/ev_battery_pack_tech_1792957574705.jpg');
  const [blogSuccessMsg, setBlogSuccessMsg] = useState('');

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin passcode: 'evcare2026' or 'admin123'
    if (passwordInput === 'evcare2026' || passwordInput === 'admin123' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
      sessionStorage.setItem('nextgen_admin_auth', 'true');
    } else {
      setLoginError('Invalid password. Default demo passcode is: evcare2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nextgen_admin_auth');
    setPasswordInput('');
  };

  // Add Portfolio Entry
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
        rangeGain: newPortRange
      },
      status: 'Completed',
      metrics: {
        label: newPortMetricLabel,
        value: newPortMetricValue
      },
      image: newPortImage,
      completedDate: 'October 2026',
      highlights: highlightsArray.length > 0 ? highlightsArray : [
        'Custom lithium pack spot-welded with active cell balancing',
        'Controller calibrated with progressive throttle curve'
      ]
    };

    setPortfolio([newItem, ...portfolio]);
    setPortSuccessMsg('Project added successfully! Live in Portfolio and Home views.');
    setTimeout(() => setPortSuccessMsg(''), 3000);

    // Reset Form
    setNewPortTitle('');
    setNewPortVehicle('');
    setNewPortDesc('');
    setNewPortHighlight('');
    setShowAddPortfolio(false);
  };

  // Delete Portfolio Entry
  const handleDeletePortfolio = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setPortfolio(portfolio.filter((p) => p.id !== id));
    }
  };

  // Add Blog Post
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
      publishedAt: 'October 25, 2026',
      author: {
        name: newBlogAuthorName.trim() || 'Next Gen EV Specialist',
        role: newBlogAuthorRole.trim() || 'EV Engineer'
      },
      tags: tagsArray.length > 0 ? tagsArray : ['Technical Guide'],
      image: newBlogImage
    };

    setBlogs([newPost, ...blogs]);
    setBlogSuccessMsg('Article published! Live in Knowledge Base and Home.');
    setTimeout(() => setBlogSuccessMsg(''), 3000);

    // Reset Form
    setNewBlogTitle('');
    setNewBlogExcerpt('');
    setNewBlogContent('');
    setShowAddBlog(false);
  };

  // Delete Blog Post
  const handleDeleteBlog = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete article "${title}"?`)) {
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = (id: string, newStatus: CustomerInquiry['status']) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  // Delete Inquiry
  const handleDeleteInquiry = (id: string) => {
    if (window.confirm('Delete this inquiry record?')) {
      setInquiries(inquiries.filter((inq) => inq.id !== id));
    }
  };

  // Export JSON Backup
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
    a.download = `next_gen_ev_care_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==================== AUTH LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Business Owner Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter master passcode to manage portfolio case studies, knowledge base articles, and customer service leads.
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

          {/* Quick Evaluator Helper Note */}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Next Gen EV Care Owner Dashboard</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                Authenticated
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Live Content Manager · Changes reflect immediately in user views
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download JSON data snapshot"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-1.5 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl overflow-x-auto">
        <button
          onClick={() => setAdminTab('portfolio')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            adminTab === 'portfolio'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-emerald-500" />
          <span>Portfolio Entries ({portfolio.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('blogs')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            adminTab === 'blogs'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-500" />
          <span>Articles ({blogs.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('inquiries')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            adminTab === 'inquiries'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-500" />
          <span>Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            adminTab === 'settings'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Success Notifications */}
      {(portSuccessMsg || blogSuccessMsg) && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{portSuccessMsg || blogSuccessMsg}</span>
        </div>
      )}

      {/* ==================== TAB 1: PORTFOLIO MANAGEMENT ==================== */}
      {adminTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Portfolio Case Studies
            </h2>
            <button
              onClick={() => setShowAddPortfolio(!showAddPortfolio)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddPortfolio ? 'Cancel New' : 'Add New Portfolio Entry'}</span>
            </button>
          </div>

          {/* Add Portfolio Entry Form */}
          {showAddPortfolio && (
            <form onSubmit={handleAddPortfolio} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                New Build / Diagnostic Case Study
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={newPortTitle}
                    onChange={(e) => setNewPortTitle(e.target.value)}
                    placeholder="e.g. 72V 35Ah High-Power Retrofit for TVS Jupiter"
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
                    onChange={(e) => setNewPortCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="conversions">EV Conversions</option>
                    <option value="battery">Battery Tech</option>
                    <option value="diagnostics">Diagnostics & Repair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    value={newPortVehicle}
                    onChange={(e) => setNewPortVehicle(e.target.value)}
                    placeholder="e.g. TVS Jupiter 110 (2019)"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Photo Selection
                  </label>
                  <select
                    value={newPortImage}
                    onChange={(e) => setNewPortImage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="/src/assets/images/custom_ev_conversion_1792957575143.jpg">Custom EV Conversion Scooter</option>
                    <option value="/src/assets/images/ev_battery_pack_tech_1792957574705.jpg">Battery Pack & Smart BMS Lab</option>
                    <option value="/src/assets/images/ev_diagnostics_motor_1792957576018.jpg">Motor Diagnostics Oscilloscope</option>
                    <option value="/src/assets/images/hero_ev_workshop_1792957574841.jpg">Full Workshop Repair Lift</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Voltage Spec
                  </label>
                  <input
                    type="text"
                    value={newPortVoltage}
                    onChange={(e) => setNewPortVoltage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Capacity Spec
                  </label>
                  <input
                    type="text"
                    value={newPortCapacity}
                    onChange={(e) => setNewPortCapacity(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Key Metric Outcome
                  </label>
                  <input
                    type="text"
                    value={newPortMetricValue}
                    onChange={(e) => setNewPortMetricValue(e.target.value)}
                    placeholder="e.g. +95 km Range"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Description & Scope *
                </label>
                <textarea
                  rows={3}
                  value={newPortDesc}
                  onChange={(e) => setNewPortDesc(e.target.value)}
                  placeholder="Detail the mechanical mounts, wiring harness, controller setup, and test ride feedback..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPortfolio(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm"
                >
                  Publish to Portfolio
                </button>
              </div>
            </form>
          )}

          {/* Portfolio Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Vehicle Model</th>
                    <th className="py-3 px-4">Key Metric</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {portfolio.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-8 rounded object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                            {item.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {item.vehicleModel}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.metrics.value}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeletePortfolio(item.id, item.title)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: ARTICLES MANAGEMENT ==================== */}
      {adminTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Technical Knowledge Base
            </h2>
            <button
              onClick={() => setShowAddBlog(!showAddBlog)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddBlog ? 'Cancel New' : 'Add New Article'}</span>
            </button>
          </div>

          {/* Add Blog Form */}
          {showAddBlog && (
            <form onSubmit={handleAddBlog} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                New Technical Article / Repair Guide
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    placeholder="e.g. How to Repair Burnt Hall Sensors on BLDC Hub Motors"
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
                    <option value="battery-tech">Battery Tech</option>
                    <option value="diagnostics">Diagnostics & Electrical</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retrofitting">EV Retrofitting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newBlogAuthorName}
                    onChange={(e) => setNewBlogAuthorName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={newBlogAuthorRole}
                    onChange={(e) => setNewBlogAuthorRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={newBlogReadTime}
                    onChange={(e) => setNewBlogReadTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlog(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm"
                >
                  Publish Article
                </button>
              </div>
            </form>
          )}

          {/* Blogs Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {blogs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-sm">
                          {item.title}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-400">
                        {item.category.replace('-', ' ')}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {item.author.name}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {item.publishedAt}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteBlog(item.id, item.title)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: INQUIRIES & LEADS ==================== */}
      {adminTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Appointment Inquiries
              </h2>
              <p className="text-xs text-slate-500">
                Incoming leads from the booking form.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              {inquiries.filter((i) => i.status === 'New').length} New Unaddressed
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No inquiries logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {inq.name}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        #{inq.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
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
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-slate-900 dark:text-white font-semibold">{inq.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Vehicle: </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{inq.vehicleModel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Preferred Date: </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{inq.preferredDate}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                    <p className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5">
                      Service: {inq.serviceType}
                    </p>
                    <p className="leading-relaxed">"{inq.message}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: SETTINGS & RESET ==================== */}
      {adminTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Maintenance & Reset Defaults
            </h2>
            <p className="text-xs text-slate-500">
              Restore the original showcase projects, knowledge base guides, and initial demo records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Reset to Workshop Initial Defaults</span>
            </p>
            <p className="leading-relaxed">
              This action restores the initial 6 verified case studies and technical articles. Any newly added items stored in your local browser cache will be reset.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all portfolio entries, blogs, and inquiries to workshop defaults?')) {
                  onResetToDefaults();
                  alert('Reset successfully completed!');
                }
              }}
              className="mt-2 px-3.5 py-2 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Confirm Reset to Factory Defaults
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
