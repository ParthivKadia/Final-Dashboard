import { useState } from "react";
import { ThemeToggleButton } from "@/shared/components/ui/ThemeToggleButton";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { Link } from "react-router";
import { STORELY_LOGO_URL } from "@/config/constants";

interface HeaderProps {
  onClick?: () => void;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClick, onToggle }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  return (
    <header className="site-navbar sticky top-0 flex w-full z-[99999] lg:border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">

        {/* ── Top bar (always visible on mobile) ── */}
        <div
          className="flex items-center justify-between w-full gap-2 px-3 py-3 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Hamburger — mobile only */}
          <button
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className="header-icon-btn w-10 h-10 rounded-lg lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="15" y2="18" />
            </svg>
          </button>

          {/* Logo — mobile only */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <img src={STORELY_LOGO_URL} alt="Storely" width={28} height={28} className="rounded-lg" />
            <span className="text-white font-bold text-base tracking-tight">Seller Hub</span>
          </Link>

          {/* Sidebar collapse toggle — desktop only */}
          <button
            onClick={onClick}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg header-icon-btn"
            aria-label="Collapse sidebar"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M0 1C0 0.447715 0.447715 0 1 0H17C17.5523 0 18 0.447715 18 1C18 1.55228 17.5523 2 17 2H1C0.447715 2 0 1.55228 0 1ZM0 7C0 6.44772 0.447715 6 1 6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H1C0.447715 8 0 7.55228 0 7ZM1 12C0.447715 12 0 12.4477 0 13C0 13.5523 0.447715 14 1 14H9C9.55228 14 10 13.5523 10 13C10 12.4477 9.55228 12 9 12H1Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Search — desktop only */}
          <div className="hidden lg:block flex-1 max-w-md ml-4">
            <div className="relative">
              <button className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="header-search-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search or type command..."
                className="header-search-input h-10 w-full rounded-xl border pl-10 pr-16 text-sm outline-none transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-md border px-1.5 py-1 text-xs font-medium header-search-kbd">
                ⌘K
              </span>
            </div>
          </div>

          {/* Three-dot menu — mobile only, opens action bar */}
          <button
            onClick={() => setApplicationMenuOpen(v => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-lg header-icon-btn lg:hidden shrink-0"
            aria-label="More options"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M6 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* ── Action bar (theme toggle, bell, user) ── */}
        <div
          className={`${isApplicationMenuOpen ? "flex" : "hidden"} lg:flex items-center justify-between w-full gap-3 px-4 py-3 lg:justify-end lg:px-0 lg:py-0 lg:w-auto`}
          style={{ borderTop: isApplicationMenuOpen ? "1px solid rgba(255,255,255,0.08)" : "none" }}
        >
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>

      </div>
    </header>
  );
};

export default Header;