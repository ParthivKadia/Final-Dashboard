import React from 'react';

export type LayoutOption = 'table' | 'grid' | 'list';

const ICONS: Record<LayoutOption, React.ReactNode> = {
  table: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1"   width="14" height="3" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="1" y="6.5" width="14" height="3" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="1" y="12"  width="14" height="3" rx="1" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  list: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1"   width="14" height="3" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="1" y="6.5" width="14" height="3" rx="1" fill="currentColor" opacity="0.9"/>
      <rect x="1" y="12"  width="14" height="3" rx="1" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  grid: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.9"/>
      <rect x="9" y="1" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.9"/>
      <rect x="1" y="9" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.9"/>
      <rect x="9" y="9" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
};

const LABELS: Record<LayoutOption, string> = {
  table: 'Table',
  list:  'List',
  grid:  'Grid',
};

interface LayoutToggleProps<T extends LayoutOption> {
  value:      T;
  onChange:   (v: T) => void;
  options?:   T[];
  showLabel?: boolean;
}

export function LayoutToggle<T extends LayoutOption>({
  value,
  onChange,
  options = ['table', 'grid'] as T[],
  showLabel = false,
}: LayoutToggleProps<T>) {
  return (
    <div className="site-layout-toggle">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          title={LABELS[opt]}
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={`site-layout-toggle-btn ${value === opt ? 'site-layout-toggle-btn--active' : ''}`}
        >
          {ICONS[opt]}
          {showLabel && <span className="ml-1.5 text-xs font-semibold">{LABELS[opt]}</span>}
        </button>
      ))}
    </div>
  );
}

export default LayoutToggle;