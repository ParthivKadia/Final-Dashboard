// src/components/categories/CategorySelector.tsx
//
// Multi-select category picker. Works with category IDs (number[]).
// Renders categories recursively — supports unlimited nesting depth.
// Supports inline creation of new categories.
//
// Props:
//   storeUsername  — which store to load categories for
//   selectedIds    — currently selected category IDs
//   onChange       — (ids: number[]) => void
//   allowCreate    — show inline create form (default true)
//   required       — show red asterisk on label (default false)
//   label          — label text (default "Categories")
//   maxSelect      — max selectable (default unlimited)

import { useState, useEffect } from 'react';
import { useCategoryStore } from '../../store/useCategoryStore';
import type { Category } from '../../store/useCategoryStore';
import { useNavigate } from 'react-router-dom';

interface CategorySelectorProps {
  storeUsername: string;
  selectedIds:   number[];
  onChange:      (ids: number[]) => void;
  allowCreate?:  boolean;
  required?:     boolean;
  label?:        string;
  className?:    string;
}

// ─── Recursive row renderer ────────────────────────────────────────────────────

interface CategoryRowProps {
  cat:         Category;
  depth:       number;
  allCats:     Category[];
  selectedIds: number[];
  toggle:      (id: number) => void;
}

function CategoryRow({ cat, depth, allCats, selectedIds, toggle }: CategoryRowProps) {
  const directChildren = allCats.filter(c => c.parentId === cat.id);
  const isSelected     = selectedIds.includes(cat.id);
  const isInactive     = cat.active === false || (cat as any).active === false;

  return (
    <>
      {/* This category's row */}
      <label
        className={`flex items-center gap-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
          isSelected
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
        }`}
        style={{ paddingLeft: `${0.625 + depth * 1.25}rem`, paddingRight: '0.625rem' }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggle(cat.id)}
          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 shrink-0"
          style={{ width: depth === 0 ? '1rem' : '0.875rem', height: depth === 0 ? '1rem' : '0.875rem' }}
        />
        <span className={`flex items-center gap-1 ${
          depth === 0
            ? 'text-sm font-semibold text-slate-800 dark:text-slate-200'
            : 'text-xs text-slate-600 dark:text-slate-400'
        }`}>
          {depth > 0 && <span className="text-slate-300 dark:text-slate-600">↳</span>}
          {cat.name}
        </span>
        {isInactive && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded ml-auto">
            Inactive
          </span>
        )}
      </label>

      {/* Recurse into children at next depth */}
      {directChildren.map(child => (
        <CategoryRow
          key={child.id}
          cat={child}
          depth={depth + 1}
          allCats={allCats}
          selectedIds={selectedIds}
          toggle={toggle}
        />
      ))}
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CategorySelector({
  storeUsername,
  selectedIds,
  onChange,
  required    = false,
  label       = 'Categories',
  className   = '',
}: CategorySelectorProps) {
  const navigate = useNavigate();
  const { fetchCategories } = useCategoryStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'error' | 'empty' | 'loaded'>('idle');

  useEffect(() => {
    if (!storeUsername) return;
    let cancelled = false;
    setFetchState('loading');

    fetchCategories(storeUsername).then(list => {
      if (cancelled) return;
      if (list === null)          { setFetchState('error'); }
      else if (list.length === 0) { setFetchState('empty'); setCategories([]); }
      else                        { setFetchState('loaded'); setCategories(list); }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername]);

  const toggle = (id: number) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter(x => x !== id));
    else                          onChange([...selectedIds, id]);
  };

  // Only true root categories — parentId null, undefined, or 0
  const roots = categories.filter(c => c.parentId === 0 || c.parentId === null);

  const selectedNames = selectedIds
    .map(id => categories.find(c => c.id === id)?.name)
    .filter(Boolean);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {/* ── Loading ── */}
      {(fetchState === 'idle' || fetchState === 'loading') && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500 text-sm">
          <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin shrink-0" />
          Loading categories…
        </div>
      )}

      {/* ── Error ── */}
      {fetchState === 'error' && (
        <div className="px-3.5 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs flex items-center justify-between">
          <span>⚠️ Couldn't load categories.</span>
          <button
            type="button"
            onClick={() => {
              setFetchState('loading');
              fetchCategories(storeUsername, true).then(list => {
                if (list === null)          setFetchState('error');
                else if (list.length === 0) { setFetchState('empty'); setCategories([]); }
                else                        { setFetchState('loaded'); setCategories(list); }
              });
            }}
            className="text-xs font-semibold underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty ── */}
      {fetchState === 'empty' && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No categories yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              <button
                type="button"
                onClick={() => navigate('/products/categories')}
                className="text-blue-600 dark:text-blue-400 underline font-medium"
              >
                Manage categories
              </button>{' '}
              to create one first.
            </p>
          </div>
        </div>
      )}

      {/* ── Loaded: recursive checkbox list ── */}
      {fetchState === 'loaded' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">

          {/* Selected pills */}
          {selectedNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-3">
              {selectedIds.map(id => {
                const cat = categories.find(c => c.id === id);
                if (!cat) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      className="text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 ml-0.5 text-sm leading-none"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Scrollable recursive list */}
          <div className="max-h-48 overflow-y-auto p-2 space-y-0.5">
            {roots.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 px-3 py-2">No categories found.</p>
            ) : (
              roots.map(root => (
                <CategoryRow
                  key={root.id}
                  cat={root}
                  depth={0}
                  allCats={categories}
                  selectedIds={selectedIds}
                  toggle={toggle}
                />
              ))
            )}
          </div>
        </div>
      )}

      {selectedIds.length === 0 && fetchState === 'loaded' && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          Select one or more categories above
        </p>
      )}
    </div>
  );
}