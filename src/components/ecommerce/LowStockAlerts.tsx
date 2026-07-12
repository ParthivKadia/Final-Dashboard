import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import { useProductStore } from "../../store/useProductStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { getUrgency, LOW_STOCK_MAX, PAGE_SIZE, resolveCategory, Urgency } from "../../pages/Products/LowStock";


// Constants 
const PREVIEW_LIMIT = 5;
const LowStockAlerts: React.FC = () => {
  const navigate = useNavigate();

  const { activeStore }                          = useAppStore();
  const { fetchPage }                            = useProductStore();
  const { fetchCategories, getCategories }       = useCategoryStore();

  const storeUsername = activeStore?.username ?? "";

  const [items,   setItems]   = useState<Array<{
    id:          string;
    name:        string;
    imageUrl:    string | null;
    category:    string;
    stockCount:  number;
    inStock:     boolean;
    urgency:     Urgency;
    barPercent:  number;
  }>>([]);
  const [loading,  setLoading]  = useState(false);
  const [hasError, setHasError] = useState(false);

  // Fetch categories

  useEffect(() => {
    if (storeUsername) fetchCategories(storeUsername);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername]);

  // Fetch low-stock products

  const load = useCallback(async () => {
    if (!storeUsername) return;
    setLoading(true);
    setHasError(false);

    const result = await fetchPage(
      { username: storeUsername, page: 1, pageSize: PAGE_SIZE },
      false,
    );

    if (result) {
      const catMap = new Map<number, string>(
        (getCategories(storeUsername) ?? []).map((c) => [c.id, c.name]),
      );

      const lowItems = result.products
        .filter((p) => !p.inStock || p.stockCount <= LOW_STOCK_MAX)
        .sort((a, b) => {
          const order: Record<Urgency, number> = { out: 0, warning: 1 };
          const ua = getUrgency(a.stockCount, a.inStock);
          const ub = getUrgency(b.stockCount, b.inStock);
          const diff = order[ua] - order[ub];
          return diff !== 0 ? diff : a.stockCount - b.stockCount;
        })
        .slice(0, PREVIEW_LIMIT)
        .map((p) => {
          const urgency   = getUrgency(p.stockCount, p.inStock);
          const barPercent =
            urgency === "out"
              ? 0
              : Math.round((p.stockCount / LOW_STOCK_MAX) * 100);

          return {
            id:         p.id,
            name:       p.name,
            imageUrl:   p.imageUrl ?? null,
            category:   resolveCategory(p.categoryIds, catMap),
            stockCount: p.stockCount,
            inStock:    p.inStock,
            urgency,
            barPercent,
          };
        });

      setItems(lowItems);
    } else {
      setHasError(true);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUsername, fetchPage]);

  useEffect(() => {
    load();
  }, [load]);

  // Derived counts

  const outCount     = items.filter((i) => i.urgency === "out").length;
  const warningCount = items.filter((i) => i.urgency === "warning").length;

  // Skeleton rows

  if (loading) {
    return (
      <div className="site-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-500">⚠️</span>
            <h3 className="text-base font-semibold site-heading">Low Stock Alerts</h3>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="site-skeleton site-skeleton-block w-2 h-2 rounded-full" />
                  <div className="space-y-1">
                    <div className="site-skeleton site-skeleton-block h-3 w-36" />
                    <div className="site-skeleton site-skeleton-block h-2.5 w-20" />
                  </div>
                </div>
                <div className="site-skeleton site-skeleton-block h-5 w-14 rounded-full" />
              </div>
              <div className="site-skeleton site-skeleton-block h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state

  if (hasError) {
    return (
      <div className="site-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-500">⚠️</span>
          <h3 className="text-base font-semibold site-heading">Low Stock Alerts</h3>
        </div>
        <div className="site-banner site-banner-error text-sm">
          Failed to load stock data.{" "}
          <button className="underline font-semibold ml-1" onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty / all healthy

  if (items.length === 0) {
    return (
      <div className="site-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* <span className="text-green-500">✅</span> */}
            <h3 className="text-base font-semibold site-heading">Low Stock Alerts</h3>
          </div>
          <button
            className="text-sm font-medium site-text-brand hover:underline"
            onClick={() => navigate("/products/low-stock")}
          >
            Manage →
          </button>
        </div>
        <p className="text-sm site-subtext text-center py-4">
          All items are well stocked! 🎉
        </p>
      </div>
    );
  }

  // Main render

  return (

    <div className="site-card p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-500">⚠️</span>
          <h3 className="text-base font-semibold site-heading">Low Stock Alerts</h3>

          {outCount > 0 && (
            <span className="site-badge site-badge--out text-xs font-semibold">
              <span
                className="site-badge-dot"
                style={{ backgroundColor: "var(--status-out-dot)" }}
              />
              {outCount} out
            </span>
          )}

          {warningCount > 0 && (
            <span className="site-badge site-badge--low text-xs font-semibold">
              <span
                className="site-badge-dot"
                style={{ backgroundColor: "var(--status-low-dot)" }}
              />
              {warningCount} low
            </span>
          )}
        </div>

        <button
          className="text-sm font-medium site-text-brand hover:underline shrink-0"
          onClick={() => navigate("/products/low-stock")}
        >

          Manage →
        </button>
      </div>

      {/* Item rows */}
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const isOut      = item.urgency === "out";
          const dotColor   = isOut ? "var(--status-out-dot)"  : "var(--status-low-dot)";
          const barColor   = isOut ? "var(--status-out-dot)"  : "var(--status-low-dot)";
          const labelColor = isOut ? "var(--status-out-text)" : "var(--status-low-text)";

          return (
            <div key={item.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Status dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />

                  {/* Thumbnail */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-6 h-6 rounded-md object-cover shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-base shrink-0">📦</span>
                  )}

                  {/* Name + category */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium site-heading truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-xs site-text-muted truncate">{item.category}</p>
                  </div>
                </div>

                {/* Stock label */}
                {isOut ? (
                  <span className="site-badge site-badge--out text-xs font-semibold shrink-0">
                    Out of stock
                  </span>
                ) : (
                  <span
                    className="text-xs font-semibold shrink-0"
                    style={{ color: labelColor }}
                  >
                    {item.stockCount} left
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="site-progress-track w-full">
                <div
                  className="site-progress-bar"
                  style={{
                    width:      `${item.barPercent}%`,
                    background: barColor,
                  }}
                />
              </div>

              <p className="text-xs site-text-muted text-right mt-0.5">
                max {LOW_STOCK_MAX}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA footer */}
      <button
        className="site-btn site-btn-primary w-full mt-5 site-btn-sm"
        onClick={() => navigate("/products/low-stock")}
      >
        {outCount > 0
          ? `Restock ${outCount + warningCount} Item${outCount + warningCount > 1 ? "s" : ""} →`
          : `View ${warningCount} Low Stock Item${warningCount > 1 ? "s" : ""} →`
        }
      </button>

    </div>
  );
};

export default LowStockAlerts;