import React, { useState } from 'react';
import { CategoryDefinition, SubcategoryItem, PortfolioItem, BlogPost } from '../types';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Layers,
  Tag,
  Truck,
  Cpu,
  BatteryCharging,
  Activity,
  Wrench,
  Sparkles,
  Info
} from 'lucide-react';

interface CategoryManagerProps {
  categories: CategoryDefinition[];
  setCategories: React.Dispatch<React.SetStateAction<CategoryDefinition[]>>;
  portfolio: PortfolioItem[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  onNotify: (msg: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  setCategories,
  portfolio,
  setPortfolio,
  blogs,
  setBlogs,
  onNotify
}) => {
  // New Category Form State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Layers');

  // Edit Category State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');

  // New Subcategory Input State per Category (keyed by catId)
  const [newSubcatName, setNewSubcatName] = useState<{ [catId: string]: string }>({});

  // Safe Deletion & Fallback Reassignment Modal State
  const [pendingDeleteCat, setPendingDeleteCat] = useState<CategoryDefinition | null>(null);
  const [reassignTargetCatId, setReassignTargetCatId] = useState<string>('doorstep');

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const id = newCatSlug.trim() ? slugify(newCatSlug) : slugify(newCatName);

    if (categories.some((c) => c.id === id)) {
      onNotify(`Category with ID "${id}" already exists.`);
      return;
    }

    const newCategory: CategoryDefinition = {
      id,
      name: newCatName.trim(),
      description: newCatDesc.trim() || undefined,
      iconName: newCatIcon,
      subcategories: []
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    setShowAddCategory(false);
    onNotify(`Category "${newCategory.name}" created successfully.`);
  };

  const handleStartEditCategory = (cat: CategoryDefinition) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || '');
  };

  const handleSaveEditCategory = (catId: string) => {
    if (!editCatName.trim()) return;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, name: editCatName.trim(), description: editCatDesc.trim() || undefined }
          : c
      )
    );
    setEditingCatId(null);
    onNotify('Category updated successfully.');
  };

  const handleAddSubcategory = (catId: string) => {
    const rawName = (newSubcatName[catId] || '').trim();
    if (!rawName) return;

    const subId = slugify(rawName);

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        if (c.subcategories.some((s) => s.id === subId)) {
          onNotify(`Subcategory "${rawName}" already exists in this category.`);
          return c;
        }
        return {
          ...c,
          subcategories: [...c.subcategories, { id: subId, name: rawName }]
        };
      })
    );

    setNewSubcatName((prev) => ({ ...prev, [catId]: '' }));
    onNotify(`Added subcategory "${rawName}".`);
  };

  const handleRemoveSubcategory = (catId: string, subcatId: string, subcatName: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        return {
          ...c,
          subcategories: c.subcategories.filter((s) => s.id !== subcatId)
        };
      })
    );
    onNotify(`Removed subcategory "${subcatName}".`);
  };

  // Safe delete initiation
  const handleInitiateDeleteCategory = (cat: CategoryDefinition) => {
    if (categories.length <= 1) {
      onNotify('At least one default category must remain in the system.');
      return;
    }

    const linkedProjects = portfolio.filter((p) => p.category === cat.id);
    const linkedBlogs = blogs.filter((b) => b.category === cat.id);

    if (linkedProjects.length > 0 || linkedBlogs.length > 0) {
      // Must prompt for reassignment
      const firstAvailableFallback = categories.find((c) => c.id !== cat.id)?.id || 'doorstep';
      setReassignTargetCatId(firstAvailableFallback);
      setPendingDeleteCat(cat);
    } else {
      // Safe to delete immediately
      if (window.confirm(`Delete empty category "${cat.name}"?`)) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        onNotify(`Category "${cat.name}" removed.`);
      }
    }
  };

  const handleConfirmReassignmentAndDelete = () => {
    if (!pendingDeleteCat) return;

    const oldId = pendingDeleteCat.id;
    const newId = reassignTargetCatId;

    // Reassign portfolio items
    setPortfolio((prev) =>
      prev.map((p) => (p.category === oldId ? { ...p, category: newId } : p))
    );

    // Reassign blogs
    setBlogs((prev) =>
      prev.map((b) => (b.category === oldId ? { ...b, category: newId } : b))
    );

    // Remove category
    setCategories((prev) => prev.filter((c) => c.id !== oldId));

    const remappedProjects = portfolio.filter((p) => p.category === oldId).length;
    const remappedBlogs = blogs.filter((b) => b.category === oldId).length;

    onNotify(
      `Deleted "${pendingDeleteCat.name}". Reassigned ${remappedProjects} projects and ${remappedBlogs} articles.`
    );
    setPendingDeleteCat(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-500" />
            <span>Categories & Subcategories Architecture</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define top-level service categories and nested specialized subcategories across Projects, Guides, and Leads.
          </p>
        </div>

        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="h-11 px-4 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddCategory ? 'Close Form' : 'Add Top Category'}</span>
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <form
          onSubmit={handleCreateCategory}
          className="p-5 rounded-2xl liquid-glass-card border border-white/80 dark:border-white/10 shadow-lg space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Create New Top-Level Service Category</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddCategory(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category Display Name *
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (!newCatSlug) {
                    setNewCatSlug(slugify(e.target.value));
                  }
                }}
                placeholder="e.g. High-Voltage Chargers & Inverters"
                className="w-full h-11 px-3.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category ID / Slug
              </label>
              <input
                type="text"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(slugify(e.target.value))}
                placeholder="e.g. ev-chargers"
                className="w-full h-11 px-3.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Scope & Technical Description
            </label>
            <input
              type="text"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Brief summary of what this category covers..."
              className="w-full h-11 px-3.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddCategory(false)}
              className="h-11 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const isEditing = editingCatId === cat.id;
          const linkedProjectsCount = portfolio.filter((p) => p.category === cat.id).length;
          const linkedBlogsCount = blogs.filter((b) => b.category === cat.id).length;

          return (
            <div
              key={cat.id}
              className="rounded-2xl liquid-glass-card border border-white/80 dark:border-white/10 p-4 sm:p-5 shadow-sm space-y-4"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 min-w-0 flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="w-full h-10 px-3 text-xs font-bold rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={editCatDesc}
                        onChange={(e) => setEditCatDesc(e.target.value)}
                        placeholder="Description..."
                        className="w-full h-9 px-3 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEditCategory(cat.id)}
                          className="h-8 px-3 text-xs font-semibold rounded-lg bg-emerald-500 text-slate-950 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          className="h-8 px-3 text-xs rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {cat.name}
                        </h3>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          ID: {cat.id}
                        </span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {linkedProjectsCount} Projects · {linkedBlogsCount} Guides
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {cat.description}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-1.5 shrink-0 self-start">
                    <button
                      type="button"
                      onClick={() => handleStartEditCategory(cat)}
                      className="h-9 px-3 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                      title="Edit Category Name & Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInitiateDeleteCategory(cat)}
                      className="h-9 px-3 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Nested Subcategories Section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Specialized Subcategories ({cat.subcategories.length})</span>
                  </span>
                </div>

                {/* Subcategory Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {cat.subcategories.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No subcategories defined yet.</span>
                  ) : (
                    cat.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 group"
                      >
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(cat.id, sub.id, sub.name)}
                          className="w-4 h-4 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 flex items-center justify-center transition-colors"
                          title="Remove subcategory"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Subcategory Inline Input */}
                <div className="flex items-center gap-2 pt-1 max-w-md">
                  <input
                    type="text"
                    value={newSubcatName[cat.id] || ''}
                    onChange={(e) =>
                      setNewSubcatName((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategory(cat.id);
                      }
                    }}
                    placeholder="Add specialized subcategory (e.g. Hall Sensors, MOSFET Overhaul)..."
                    className="flex-1 h-9 px-3 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSubcategory(cat.id)}
                    className="h-9 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Relational Integrity Reassignment Modal */}
      {pendingDeleteCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl liquid-glass-card border border-white/20 bg-white dark:bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Safe Category Reassignment
                </h3>
                <p className="text-xs text-slate-500">
                  Category &ldquo;{pendingDeleteCat.name}&rdquo; has active content records.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Before deleting this category, please select a destination category to safely reassign all existing case studies and tech articles so no records are lost.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Reassign Content To:
              </label>
              <select
                value={reassignTargetCatId}
                onChange={(e) => setReassignTargetCatId(e.target.value)}
                className="w-full h-11 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {categories
                  .filter((c) => c.id !== pendingDeleteCat.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPendingDeleteCat(null)}
                className="h-10 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReassignmentAndDelete}
                className="h-10 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-sm transition-colors"
              >
                Reassign & Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
