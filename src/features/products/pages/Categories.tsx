// src/pages/Products/Categories.tsx

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from "@/shared/stores/useAppStore";
import { useCategoryStore } from "@/shared/stores/useCategoryStore";
import type { Category } from "@/shared/stores/useCategoryStore";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  createCategories,
  updateCategories,
  activateCategories,
  deactivateCategories,
} from "@/shared/services/productService";
import type { Store as StoreType } from "@/shared/types/store";
import CloudinaryUploadWidget from "@/shared/components/forms/CloudinaryUploadWidget";
import { generateSlug } from "@/shared/utils/slug";
import { SlugCell } from './AllProducts';
import { MobileDrawerRow, DrawerField } from "@/shared/components/ui/MobileDrawer";
import { toast } from 'sonner';
import { AlertTriangle, Check, Pause, Tag, FolderOpen, FileText, Store as StoreIcon } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isRootCat = (c: Category) => !c.parentId || c.parentId === 0;

function sortByDisplayOrder<T extends { displayOrder?: number | null }>(list: T[]): T[] {
  return [...list].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface CategoryForm {
  name:         string;
  slug:         string;
  description:  string;
  imageUrl:     string;
  parentId:     number;
  displayOrder: number | 'priority';
}

// ─── Parent option builder ────────────────────────────────────────────────────

function buildParentOptions(
  allCategories: Category[],
  parentId: number,
  excludeId: number | undefined,
  depth: number,
): React.ReactNode[] {
  const prefix = '\u00a0\u00a0\u00a0\u00a0'.repeat(depth);
  const arrow  = depth > 0 ? '↳ ' : '';
  return allCategories
    .filter(c => (c.parentId === parentId) && c.id !== excludeId)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .flatMap(c => [
      <option key={c.id} value={c.id}>{prefix}{arrow}{c.name}</option>,
      ...buildParentOptions(allCategories, c.id, excludeId, depth + 1),
    ]);
}

// ─── Category Dialog ──────────────────────────────────────────────────────────

interface CategoryDialogProps {
  mode:             'create' | 'edit';
  initial?:         Category;
  defaultParentId?: number;
  allCategories:    Category[];
  storeUsername:    string;
  priorityValue:    number;
  onSuccess:        () => void;
  onClose:          () => void;
}

function CategoryDialog({
  mode, initial, defaultParentId = 0,
  allCategories, storeUsername, priorityValue,
  onSuccess, onClose,
}: CategoryDialogProps) {
  const [form, setForm] = useState<CategoryForm>(
    initial
      ? {
          name:         initial.name,
          slug:         initial.slug,
          description:  initial.description  ?? '',
          imageUrl:     initial.imageUrl     ?? '',
          parentId:     initial.parentId     ?? 0,
          displayOrder: initial.displayOrder ?? 0,
        }
      : { name: '', slug: '', description: '', imageUrl: '', parentId: defaultParentId, displayOrder: 0 }
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const update = <K extends keyof CategoryForm>(field: K, value: CategoryForm[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleNameChange = (name: string) =>
    setForm(prev => ({ ...prev, name, slug: generateSlug(name) }));

  const handleImageUpload = useCallback((url: string) =>
    setForm(prev => ({ ...prev, imageUrl: url })), []);

  const resolvedOrder  = form.displayOrder === 'priority' ? priorityValue : Number(form.displayOrder);
  const parentLabel    = allCategories.find(p => p.id === form.parentId)?.name;

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.slug.trim()) { setError('Slug is required.'); return; }
    setSaving(true); setError(null);
    try {
      const body = {
        name:         form.name.trim(),
        slug:         form.slug.trim(),
        description:  form.description.trim(),
        imageUrl:     form.imageUrl.trim(),
        parentId:     form.parentId,
        displayOrder: resolvedOrder,
      };
      await toast.promise(
        mode === 'create'
          ? createCategories(storeUsername, body)
          : updateCategories(initial!.id, body),
        {
          loading: mode === 'create' ? 'Creating category…' : 'Saving changes…',
          success: mode === 'create' ? `"${form.name}" created` : `"${form.name}" updated`,
          error: (err: any) => err?.message || `Failed to ${mode}.`,
        }
      ).unwrap();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || `Failed to ${mode}.`); // stays inline — dialog is still open
      setSaving(false);
    }
  };

  return createPortal(
    <div className="site-modal-overlay">
      <div className="site-modal">

        {/* Header */}
        <div className="site-modal-header">
          <div>
            <h2 className="h3 site-heading">
              {mode === 'create'
                ? (form.parentId ? '↳ New Sub-category' : 'New Category')
                : 'Edit Category'}
            </h2>
            <p className="text-xs site-text-muted mt-0.5">
              {mode === 'create'
                ? (parentLabel ? `Child of "${parentLabel}"` : `Top-level · @${storeUsername}`)
                : `Editing "${initial?.name}"`}
            </p>
          </div>
          <button className="site-btn-icon" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="site-modal-body space-y-4">
          {error && (
            <div className="site-banner site-banner-error">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" aria-hidden="true" />
              <span>{error}</span>
              <button className="text-lg leading-none opacity-60 hover:opacity-100 ml-2"
                onClick={() => setError(null)}>×</button>
            </div>
          )}

          <div>
            <label className="site-label">
              Parent Category <span className="font-normal text-xs site-text-muted">(none = top-level)</span>
            </label>
            <select
              value={form.parentId === 0 ? '' : form.parentId}
              onChange={e => update('parentId', e.target.value === '' ? 0 : Number(e.target.value))}
              className="site-input"
            >
              <option value="">Root (top-level category)</option>
              {buildParentOptions(allCategories, 0, initial?.id, 0)}
            </select>
          </div>

          <div>
            <label className="site-label">Name <span className="text-[var(--danger-solid)]">*</span></label>
            <input
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g. Clothing"
              className="site-input"
              autoFocus
            />
          </div>

          <div>
            <label className="site-label">Slug <span className="text-[var(--danger-solid)]">*</span></label>
            <input
              value={form.slug}
              readOnly
              onChange={e => update('slug', e.target.value)}
              placeholder="clothing"
              className="site-input site-input-mono"
            />
            <p className="text-[11px] site-text-muted mt-1">Auto-generated · unique ID attached</p>
          </div>

          <div>
            <label className="site-label">
              Description <span className="font-normal text-xs site-text-muted">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe this category…"
              rows={3}
              className="site-input"
            />
          </div>

          <div>
            <label className="site-label">
              Image <span className="font-normal text-xs site-text-muted">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              <CloudinaryUploadWidget key={initial?.id ?? 'new'} onUpload={handleImageUpload} />
              {form.imageUrl ? (
                <div className="relative site-thumb shrink-0"
                  style={{ width: '4rem', height: '4rem', border: '1px solid var(--border-medium)' }}>
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <button type="button"
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600 transition-colors"
                    onClick={() => update('imageUrl', '')}>✕</button>
                </div>
              ) : (
                <div className="site-upload-zone shrink-0 flex items-center justify-center text-2xl"
                  style={{ width: '4rem', height: '4rem', padding: 0 }}></div>
              )}
            </div>
            {form.imageUrl && (
              <p className="text-[11px] site-text-muted mt-1.5 site-truncate">{form.imageUrl}</p>
            )}
          </div>

          <div>
            <label className="site-label">Display Order</label>
            <select
              value={String(form.displayOrder)}
              onChange={e => update('displayOrder', e.target.value === 'priority' ? 'priority' : Number(e.target.value))}
              className="site-input"
            >
              <option value="0">High Priority</option>
              <option value="1">Medium Priority</option>
              <option value="2">Low Priority</option>
              {/* <option value="priority">⚡ Priority — auto-assign (end of list · #{priorityValue})</option> */}
            </select>
            {/* <p className="text-[11px] site-text-muted mt-1">
              {form.displayOrder === 'priority'
                ? `Will be saved as order ${priorityValue} (after all existing categories)`
                : 'Lower number = shown first. 0 appears before 1, 1 before 2.'}
            </p> */}
          </div>
        </div>

        {/* Footer */}
        <div className="site-modal-footer">
          <button className="site-btn site-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="site-btn site-btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving
              ? <><span className="site-spinner" /> Saving…</>
              : mode === 'create' ? 'Create Category' : 'Save Changes'
            }
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Toggle Confirm Dialog ────────────────────────────────────────────────────

function ToggleConfirmDialog({ type, category, onConfirm, onCancel, loading }: {
  type:      'activate' | 'deactivate';
  category:  Category;
  onConfirm: () => void;
  onCancel:  () => void;
  loading:   boolean;
}) {
  const isActivate = type === 'activate';
  return createPortal(
    <div className="site-modal-overlay">
      <div className="site-modal site-modal-sm">
        <div className="site-modal-body text-center">
          <div className="text-4xl mb-3">
            {isActivate
              ? <Check className="w-12 h-12 mx-auto text-green-500" aria-hidden="true" />
              : <Pause className="w-12 h-12 mx-auto text-amber-500" aria-hidden="true" />}
          </div>
          <h2 className="h3 site-heading mb-2">{isActivate ? 'Activate' : 'Deactivate'} Category?</h2>
          <p className="text-sm site-subtext mb-1">You are about to {type}:</p>
          <p className="text-sm font-semibold site-heading mb-4">"{category.name}"</p>
          {!isActivate && (
            <div className="site-banner site-banner-info justify-center text-center mb-2">
              <p className="text-xs">Products remain visible but won't appear in category filters.</p>
            </div>
          )}
        </div>
        <div className="site-modal-footer">
          <button className="site-btn site-btn-ghost flex-1" onClick={onCancel}>Cancel</button>
          <button
            className="site-btn flex-1 disabled:opacity-50"
            style={{
              backgroundColor: isActivate ? 'var(--status-active-dot)' : 'var(--featured-color)',
              color: '#fff', border: 'none', borderRadius: '0.75rem',
              padding: '0.625rem 1.25rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <><span className="site-spinner" /> Working…</> : isActivate ? 'Activate' : 'Deactivate'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Priority badge ───────────────────────────────────────────────────────────

function PriorityBadge({ order }: { order: number }) {
  if (order === 0) return (
    <span className="site-badge" style={{ backgroundColor: 'var(--status-featured-bg)', color: 'var(--status-featured-text)' }}>▲ High</span>
  );
  if (order === 1) return <span className="site-badge site-badge--brand">● Medium</span>;
  if (order === 2) return (
    <span className="site-badge" style={{ backgroundColor: 'var(--surface-secondary)', color: 'var(--text-secondary)' }}>▼ Low</span>
  );
  return <span className="text-xs site-text-muted">{order}</span>;
}

// ─── Category Row ─────────────────────────────────────────────────────────────

type CategoryWithChildren = Category & { _children: CategoryWithChildren[] };

function CategoryRow({ cat, children, onEdit, onToggle, onAddChild, depth = 0, mobile = false }: {
  cat:        CategoryWithChildren;
  children:   CategoryWithChildren[];
  onEdit:     (c: Category) => void;
  onToggle:   (c: Category, t: 'activate' | 'deactivate') => void;
  onAddChild: (parentId: number) => void;
  depth?:     number;
  mobile?:    boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const isActive    = cat.active !== false;
  const hasChildren = children.length > 0;
  const categoryIcon = depth === 0 ? <Tag className="w-5 h-5" aria-hidden="true" /> : depth === 1 ? <FolderOpen className="w-5 h-5" aria-hidden="true" /> : <FileText className="w-5 h-5" aria-hidden="true" />;

  // ── Mobile card rendering ──────────────────────────────────────────────────
  if (mobile) {
    return (
      <>
        <div className={!isActive ? 'opacity-60' : ''}>
          <MobileDrawerRow
            thumb={
              <div className="site-thumb shrink-0"
                style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem' }}>
                {cat.imageUrl
                  ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  : <span className="text-lg">{categoryIcon}</span>
                }
              </div>
            }
            primary={
              <span className="flex items-center gap-1.5">
                {depth > 0 && (
                  <span className="site-text-muted text-xs" style={{ letterSpacing: '-0.05em' }}>
                    {'↳'.repeat(depth)}
                  </span>
                )}
                {cat.name}
              </span>
            }
            secondary={`ID ${cat.id}${cat.parentId && cat.parentId !== 0 ? ` · child of ${cat.parentId}` : ''}${depth > 1 ? ` · depth ${depth}` : ''}`}
            badge={
              <span className={`site-badge ${isActive ? 'site-badge--active' : ''}`}
                style={!isActive ? { backgroundColor: 'var(--surface-secondary)', color: 'var(--text-secondary)' } : undefined}>
                <span className="site-badge-dot"
                  style={!isActive ? { backgroundColor: 'var(--text-muted)' } : undefined} />
                {isActive ? 'Active' : 'Inactive'}
              </span>
            }
            drawer={
              <>
                <div className="flex gap-2 flex-wrap">
                  <DrawerField label="Slug">
                    {/* <span className="site-mono text-[11px]">{cat.slug}</span> */}
                    <SlugCell slug={cat.slug} />
                  </DrawerField>
                  <DrawerField label="Priority">
                    <PriorityBadge order={cat.displayOrder ?? 0} />
                  </DrawerField>
                </div>

                {cat.description && (
                  <DrawerField label="Description">
                    {cat.description}
                  </DrawerField>
                )}

                {hasChildren && (
                  <DrawerField label="Sub-categories">
                    <span className="flex items-center gap-2">
                      {children.length} sub-{children.length === 1 ? 'category' : 'categories'}
                      <button
                        className="text-[11px] site-text-brand font-semibold"
                        onClick={() => setExpanded(v => !v)}
                      >
                        {expanded ? 'Collapse ▾' : 'Expand ▸'}
                      </button>
                    </span>
                  </DrawerField>
                )}

                <div className="flex gap-2 pt-1 flex-wrap">
                  <button className="site-btn site-btn-outline site-btn-sm"
                    onClick={() => onEdit(cat)}>Edit</button>
                  <button className="site-btn site-btn-ghost site-btn-sm"
                    onClick={() => onAddChild(cat.id)}>+ Sub</button>
                  {isActive
                    ? <button className="site-btn site-btn-sm"
                        style={{ backgroundColor: 'var(--status-featured-bg)', color: 'var(--status-featured-text)', border: 'none' }}
                        onClick={() => onToggle(cat, 'deactivate')}>Disable</button>
                    : <button className="site-btn site-btn-sm"
                        style={{ backgroundColor: 'var(--status-active-bg)', color: 'var(--status-active-text)', border: 'none' }}
                        onClick={() => onToggle(cat, 'activate')}>Enable</button>
                  }
                </div>
              </>
            }
          />
        </div>

        {expanded && children.map(child => (
          <CategoryRow
            key={child.id}
            cat={child}
            children={child._children ?? []}
            onEdit={onEdit}
            onToggle={onToggle}
            onAddChild={onAddChild}
            depth={depth + 1}
            mobile
          />
        ))}
      </>
    );
  }

  // ── Desktop table row rendering ────────────────────────────────────────────
  return (
    <>
      <tr
        className={`transition-colors ${!isActive ? 'opacity-60' : ''}`}
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-secondary)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-2.5" style={{ paddingLeft: depth * 20 }}>
            <button
              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                hasChildren ? 'site-surface-secondary site-subtext' : 'invisible'
              }`}
              onClick={() => setExpanded(v => !v)}
            >
              {hasChildren ? (expanded ? '▾' : '▸') : null}
            </button>

            {depth > 0 && !hasChildren && (
              <span className="w-5 h-5 flex items-center justify-center site-text-muted text-[10px] shrink-0">↳</span>
            )}

            <div className="site-thumb"
              style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', flexShrink: 0 }}>
              {cat.imageUrl
                ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                : <span className="text-sm">{categoryIcon}</span>
              }
            </div>

            <div>
              <p className="text-sm font-semibold site-heading">{cat.name}</p>
              <p className="text-xs site-text-muted">
                ID {cat.id}
                {cat.parentId && cat.parentId !== 0 ? ` · child of ${cat.parentId}` : ''}
                {depth > 1 ? ` · depth ${depth}` : ''}
              </p>
            </div>
          </div>
        </td>

        <td className="py-3 px-4">
          <span className="text-xs site-mono site-text-muted whitespace-nowrap">
            <SlugCell slug={cat.slug} />
          </span>
        </td>

        <td className="py-3 px-4">
          <p className="text-xs site-subtext max-w-[160px] site-truncate">
            {cat.description || <span className="site-text-muted">—</span>}
          </p>
        </td>

        <td className="py-3 px-4">
          <PriorityBadge order={cat.displayOrder ?? 0} />
        </td>

        <td className="py-3 px-4">
          <span className={`site-badge ${isActive ? 'site-badge--active' : ''}`}
            style={!isActive ? { backgroundColor: 'var(--surface-secondary)', color: 'var(--text-secondary)' } : undefined}>
            <span className="site-badge-dot"
              style={!isActive ? { backgroundColor: 'var(--text-muted)' } : undefined} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </td>

        <td className="py-3 px-4">
          <div className="flex gap-1.5 flex-wrap">
            <button className="site-btn site-btn-outline site-btn-sm" onClick={() => onEdit(cat)}>Edit</button>
            <button className="site-btn site-btn-ghost site-btn-sm" onClick={() => onAddChild(cat.id)}>+ Sub</button>
            {isActive
              ? <button className="site-btn site-btn-sm"
                  style={{ backgroundColor: 'var(--status-featured-bg)', color: 'var(--status-featured-text)', border: 'none' }}
                  onClick={() => onToggle(cat, 'deactivate')}>Disable</button>
              : <button className="site-btn site-btn-sm"
                  style={{ backgroundColor: 'var(--status-active-bg)', color: 'var(--status-active-text)', border: 'none' }}
                  onClick={() => onToggle(cat, 'activate')}>Enable</button>
            }
          </div>
        </td>
      </tr>

      {expanded && children.map(child => (
        <CategoryRow
          key={child.id}
          cat={child}
          children={child._children ?? []}
          onEdit={onEdit}
          onToggle={onToggle}
          onAddChild={onAddChild}
          depth={depth + 1}
        />
      ))}
    </>
  );
}

// ─── Store Switcher ───────────────────────────────────────────────────────────

function StoreSwitcher({ stores, activeStore, setActiveStore, onSwitch }: {
  stores:         StoreType[];
  activeStore:    StoreType | null;
  setActiveStore: (s: StoreType) => void;
  onSwitch:       () => void;
}) {
  const [open, setOpen] = useState(false);

  if (stores.length <= 1) {
    return <p className="site-page-subtitle">{activeStore ? `@${activeStore.username}` : 'Loading…'}</p>;
  }

  return (
    <div className="relative mt-1.5">
      <button className="site-store-trigger" onClick={() => setOpen(v => !v)}>
        {activeStore?.logoUrl && (
          <img src={activeStore.logoUrl} alt="" className="w-4 h-4 rounded-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}
        <span className="site-subtext">@{activeStore?.username}</span>
        <span className="site-badge site-badge--brand">{stores.length} stores</span>
        <span className="site-text-muted text-xs">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)} />
          <div className="site-dropdown">
            <p className="site-dropdown-label">Switch Store</p>
            {stores.map(store => (
              <button key={store.id}
                className={`site-dropdown-item ${activeStore?.id === store.id ? 'site-dropdown-item--active' : ''}`}
                onClick={() => { setActiveStore(store); setOpen(false); onSwitch(); }}>
                <div className="site-thumb site-thumb-sm" style={{ borderRadius: '0.75rem', width: '2rem', height: '2rem' }}>
                  {store.logoUrl
                    ? <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    : <StoreIcon className="text-base" aria-hidden="true" />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold truncate ${activeStore?.id === store.id ? 'site-text-brand' : 'site-heading'}`}>
                    {store.name}
                  </p>
                  <p className="text-xs truncate site-subtext">@{store.username}</p>
                </div>
                {activeStore?.id === store.id && <span className="text-xs font-bold site-text-brand">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Tree builder ─────────────────────────────────────────────────────────────

function buildTree(all: Category[], parentId = 0): CategoryWithChildren[] {
  return sortByDisplayOrder(all.filter(c => (c.parentId ?? 0) === parentId))
    .map(c => ({ ...c, _children: buildTree(all, c.id) }));
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Categories() {
  const navigate        = useNavigate();
  const { isVerifying } = useAuth();
  const { stores, activeStore, setActiveStore } = useAppStore();
  const { fetchCategories, invalidate }         = useCategoryStore();

  const storeUsername = activeStore?.username ?? '';

  const [categories, setCategories]   = useState<Category[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [toggling, setToggling]       = useState(false);

  const [dialog, setDialog] = useState<
    null | { mode: 'create'; defaultParentId: number } | { mode: 'edit'; category: Category }
  >(null);

  const [toggleTarget, setToggleTarget] = useState<{
    category: Category; type: 'activate' | 'deactivate';
  } | null>(null);

  const load = useCallback(async (force = false) => {
    if (!storeUsername) return;
    setLoading(true); setError(null);
    const list = await fetchCategories(storeUsername, force);
    if (list !== null) setCategories(list);
    else setError('Failed to load categories.');
    setLoading(false);
  }, [storeUsername, fetchCategories]);

  useEffect(() => {
    if (storeUsername && !isVerifying) load();
  }, [storeUsername, isVerifying, load]);

  const handleToggle = async () => {
    if (!toggleTarget) return;
    setToggling(true); setActionError(null);
    try {
      await toast.promise(
        toggleTarget.type === 'activate'
          ? activateCategories(toggleTarget.category.id)
          : deactivateCategories(toggleTarget.category.id),
        {
          loading: toggleTarget.type === 'activate' ? 'Activating…' : 'Deactivating…',
          success: toggleTarget.type === 'activate'
            ? `"${toggleTarget.category.name}" activated`
            : `"${toggleTarget.category.name}" deactivated`,
          error: (err: any) => err?.message || `Failed to ${toggleTarget.type}.`,
        }
      ).unwrap();
      invalidate(storeUsername);
      setToggleTarget(null);
      await load(true);
    } catch (err: any) {
      setToggleTarget(null); // close confirm modal — toast already carries the message
    } finally {
      setToggling(false);
    }
  };

  const sortedCategories = sortByDisplayOrder(categories);
  const rootTree         = buildTree(categories);
  const parentCount      = sortedCategories.filter(isRootCat).length;
  const childCount       = sortedCategories.filter(c => !isRootCat(c)).length;
  const maxOrder         = categories.reduce((m, c) => Math.max(m, c.displayOrder ?? 0), -1);
  const priorityValue    = maxOrder + 1;

  const q            = search.toLowerCase();
  const isFiltering  = !!q;
  const displayedRows: CategoryWithChildren[] = isFiltering
    ? sortByDisplayOrder(sortedCategories.filter(c =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      )).map(c => ({ ...c, _children: [] }))
    : rootTree;

  if (isVerifying) return (
    <div className="site-page flex items-center justify-center h-screen">
      <p className="text-sm site-subtext">Loading…</p>
    </div>
  );

  return (
    <div className="site-page site-page-padding">

      {/* ── Header ── */}
      <div className="site-page-header">
        <div>
          <h1 className="site-page-title">Categories</h1>
          <StoreSwitcher stores={stores} activeStore={activeStore}
            setActiveStore={setActiveStore} onSwitch={() => setCategories([])} />
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="site-btn site-btn-ghost" onClick={() => load(true)}>Refresh</button>
          <button className="site-btn site-btn-primary" disabled={!storeUsername}
            onClick={() => setDialog({ mode: 'create', defaultParentId: 0 })}>
            + Add Category
          </button>
        </div>
      </div>

      {/* ── Banners ── */}
      {error && (
        <div className="site-banner site-banner-error mb-5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" aria-hidden="true" />
          <span>{error}</span>
          <button className="text-xs font-semibold underline ml-4" onClick={() => load(true)}>Retry</button>
        </div>
      )}
      {actionError && (
        <div className="site-banner site-banner-error mb-5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" aria-hidden="true" />
          <span>{actionError}</span>
          <button className="text-lg leading-none opacity-60 hover:opacity-100 ml-2"
            onClick={() => setActionError(null)}>×</button>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total',   value: categories.length },
          { label: 'Parents', value: parentCount },
          { label: 'Active',  value: categories.filter(c => c.active !== false).length },
        ].map(s => (
          <div key={s.label} className="site-stat-card">
            <span className="site-stat-card-label">{s.label}</span>
            <div className="site-stat-card-value">
              {loading ? <span className="site-skeleton inline-block w-8 h-6 rounded" /> : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="site-card site-card-body mb-4">
        <div className="site-search-wrap">
          {/* <Search className="site-search-icon w-5 h-5" /> */}
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or slug…" className="site-input" />
        </div>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="site-card overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="site-skeleton-row">
              <div className="site-skeleton site-skeleton-block"
                style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', flexShrink: 0 }} />
              <div className="flex-1 space-y-2">
                <div className="site-skeleton site-skeleton-block h-3.5 w-40" />
                <div className="site-skeleton site-skeleton-block h-2.5 w-24" />
              </div>
              <div className="site-skeleton site-skeleton-block h-6 w-16 rounded-full" />
              <div className="site-skeleton site-skeleton-block h-8 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* ── Table ── */}
      {!loading && (
        <div className="site-card overflow-hidden">

          {!isFiltering && parentCount > 0 && (
            <div className="px-4 py-2.5 site-border-bottom site-surface-secondary flex items-center gap-4">
              <span className="text-xs site-text-muted">
                {parentCount} parent {parentCount === 1 ? 'category' : 'categories'}
              </span>
              {childCount > 0 && (
                <span className="text-xs site-text-muted">
                  ↳ {childCount} sub-{childCount === 1 ? 'category' : 'categories'}
                </span>
              )}
              <span className="text-xs site-text-muted ml-1 hidden sm:inline">
                · Click ▸ to expand / collapse
              </span>
            </div>
          )}

          {/* ── Desktop table (hidden on mobile) ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="site-table min-w-[720px]">
              <thead>
                <tr>
                  {['Category', 'Slug', 'Description', 'Priority', 'Status', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedRows.map(cat => (
                  <CategoryRow
                    key={cat.id}
                    cat={cat}
                    children={isFiltering ? [] : cat._children}
                    onEdit={c => setDialog({ mode: 'edit', category: c })}
                    onToggle={(c, t) => setToggleTarget({ category: c, type: t })}
                    onAddChild={pid => setDialog({ mode: 'create', defaultParentId: pid })}
                    depth={isFiltering && !isRootCat(cat) ? 1 : 0}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list (hidden on desktop) ── */}
          <div className="sm:hidden">
            {displayedRows.map(cat => (
              <CategoryRow
                key={cat.id}
                cat={cat}
                children={isFiltering ? [] : cat._children}
                onEdit={c => setDialog({ mode: 'edit', category: c })}
                onToggle={(c, t) => setToggleTarget({ category: c, type: t })}
                onAddChild={pid => setDialog({ mode: 'create', defaultParentId: pid })}
                depth={isFiltering && !isRootCat(cat) ? 1 : 0}
                mobile
              />
            ))}
          </div>


          {displayedRows.length === 0 && (
            <div className="site-empty-state">
              <Tag className="site-empty-icon w-12 h-12 text-muted-foreground" aria-hidden="true" />
              <p className="site-empty-title">
                {search ? 'No categories match your search' : 'No categories yet'}
              </p>
              <p className="site-empty-desc">
                {search ? 'Try a different search term' : 'Create your first category to organise products'}
              </p>
              {!search && (
                <button className="site-btn site-btn-primary site-btn-sm mt-4"
                  onClick={() => setDialog({ mode: 'create', defaultParentId: 0 })}>
                  + Add Category
                </button>
              )}
            </div>
          )}

          {displayedRows.length > 0 && (
            <div className="px-4 py-3 site-border-top flex items-center justify-between">
              <span className="text-sm site-subtext">
                {isFiltering
                  ? `Showing ${displayedRows.length} of ${categories.length}`
                  : `${parentCount} parent · ${childCount} sub-categories`}
              </span>
              <button className="text-xs site-text-brand font-semibold hover:underline"
                onClick={() => navigate('/products')}>
                + Add product →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Dialogs ── */}
      {dialog?.mode === 'create' && (
        <CategoryDialog
          mode="create"
          defaultParentId={dialog.defaultParentId}
          allCategories={sortedCategories}
          storeUsername={storeUsername}
          priorityValue={priorityValue}
          onSuccess={() => { setDialog(null); invalidate(storeUsername); load(true); }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.mode === 'edit' && (
        <CategoryDialog
          mode="edit"
          initial={dialog.category}
          allCategories={sortedCategories}
          storeUsername={storeUsername}
          priorityValue={priorityValue}
          onSuccess={() => { setDialog(null); invalidate(storeUsername); load(true); }}
          onClose={() => setDialog(null)}
        />
      )}
      {toggleTarget && (
        <ToggleConfirmDialog
          type={toggleTarget.type}
          category={toggleTarget.category}
          onConfirm={handleToggle}
          onCancel={() => setToggleTarget(null)}
          loading={toggling}
        />
      )}
    </div>
  );
}