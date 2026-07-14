// src/layout/AuthLayout.tsx
// All colours/surfaces from site-theme.css. Zero hardcoded Tailwind colour classes.

import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
const logo = "/images/brand/storely_logo.png";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen auth-layout-root">

      {/* ── Full-screen flex container ── */}
      <div className="relative flex flex-col lg:flex-row w-full min-h-screen">

        {/* ── LEFT: Auth form (children) ── */}
        <div className="auth-form-side flex flex-col justify-center w-full lg:w-1/2 min-h-screen p-6 sm:p-10">
          {children}
        </div>

        {/* ── RIGHT: Brand panel — desktop only ── */}
        <div className="auth-brand-panel hidden lg:flex lg:w-1/2 min-h-screen items-center justify-center relative overflow-hidden">

          {/* Grid background decoration */}
          <GridShape />

          {/* Brand content */}
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm px-8 text-center">

            {/* Logo mark + wordmark */}
            {/* <Link to="/" className="flex flex-col items-center gap-3 group"> */}
              <div className="auth-logo-wrap">
                <img
                  src={logo}
                  alt="Storely logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="auth-wordmark">Storly</span>
            {/* </Link> */}

            {/* Tagline */}
            <p className="auth-tagline">Store. Simplified.</p>

            {/* Decorative dots */}
            <div className="flex gap-2 mt-2">
              {[0, 1, 2].map(i => (
                <span key={i} className="auth-dot" style={{ opacity: i === 0 ? 1 : i === 1 ? 0.5 : 0.25 }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile top bar: logo (shown only on mobile) ── */}
        <div className="auth-mobile-bar lg:hidden absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="auth-logo-wrap-sm">
              <img
                src={logo}
                alt="Storely logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="auth-wordmark-sm">Storly</span>
          </Link>
        </div>

        {/* ── Floating theme toggle ── */}
        <div className="fixed z-50 bottom-6 right-6">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}