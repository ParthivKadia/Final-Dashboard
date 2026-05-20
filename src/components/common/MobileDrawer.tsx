// src/components/common/MobileDrawer.tsx
import { useState, useRef, useEffect } from 'react';

interface MobileDrawerRowProps {
  thumb: React.ReactNode;
  primary: React.ReactNode;
  secondary: React.ReactNode;
  badge: React.ReactNode;
  drawer: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function MobileDrawerRow({
  thumb, primary, secondary, badge, drawer,
  isSelected, onSelect,
}: MobileDrawerRowProps) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: 'var(--border-subtle)', backgroundColor: isSelected ? 'rgba(26,86,219,0.04)' : undefined }}
    >
      {/* Compact row */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded shrink-0"
          />
        )}
        <div className="shrink-0">{thumb}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold site-heading truncate">{primary}</div>
          <div className="text-xs site-subtext mt-0.5">{secondary}</div>
        </div>
        <div className="shrink-0">{badge}</div>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Hide details' : 'Show details'}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-colors"
          style={{
            border: '1px solid var(--border-medium)',
            backgroundColor: open ? 'var(--btn-primary-bg)' : 'var(--surface-secondary)',
            color: open ? '#fff' : 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1,
          }}
        >
          ⋯
        </button>
      </div>

      {/* Animated drawer */}
      <div
        ref={drawerRef}
        style={{
          maxHeight: open ? `${drawerRef.current?.scrollHeight ?? 600}px` : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.25s ease',
          backgroundColor: 'var(--surface-secondary)',
          borderTop: open ? '1px solid var(--border-subtle)' : 'none',
        }}
      >
        <div className="px-3 py-3 space-y-3">{drawer}</div>
      </div>
    </div>
  );
}

// Helper: a small labelled field inside the drawer
export function DrawerField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex-1"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '0.625rem',
        padding: '6px 10px',
        minWidth: '90px',
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-wide site-text-muted mb-1">{label}</div>
      <div className="text-xs font-medium site-heading">{children}</div>
    </div>
  );
}