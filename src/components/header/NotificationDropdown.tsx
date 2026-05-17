// src/components/header/NotificationDropdown.tsx
// All colours from site-theme.css — zero hardcoded Tailwind colour classes.

import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

const NOTIFICATIONS = [
  { id: 1, user: "Terry Franci",    avatar: "/images/user/user-02.jpg", online: true,  project: "Nganter App", time: "5 min ago"  },
  { id: 2, user: "Alena Franci",   avatar: "/images/user/user-03.jpg", online: true,  project: "Nganter App", time: "8 min ago"  },
  { id: 3, user: "Jocelyn Kenter", avatar: "/images/user/user-04.jpg", online: true,  project: "Nganter App", time: "15 min ago" },
  { id: 4, user: "Brandon Philips",avatar: "/images/user/user-05.jpg", online: false, project: "Nganter App", time: "1 hr ago"   },
  { id: 5, user: "Terry Franci",   avatar: "/images/user/user-02.jpg", online: true,  project: "Nganter App", time: "5 min ago"  },
  { id: 6, user: "Alena Franci",   avatar: "/images/user/user-03.jpg", online: true,  project: "Nganter App", time: "8 min ago"  },
  { id: 7, user: "Jocelyn Kenter", avatar: "/images/user/user-04.jpg", online: true,  project: "Nganter App", time: "15 min ago" },
  { id: 8, user: "Brandon Philips",avatar: "/images/user/user-05.jpg", online: false, project: "Nganter App", time: "1 hr ago"   },
];

export default function NotificationDropdown() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [notifying, setNotifying] = useState(true);

  const toggle = () => {
    setIsOpen(v => !v);
    setNotifying(false);
  };

  return (
    <div className="relative">

      {/* Bell button */}
      <button
        className="notif-bell relative flex items-center justify-center h-11 w-11 rounded-full border transition-colors"
        onClick={toggle}
        aria-label="Notifications"
      >
        {/* Ping dot */}
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--featured-color)' }}>
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: 'var(--featured-color)' }} />
          </span>
        )}

        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
          <path fillRule="evenodd" clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827
               9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916
               14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809
               15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375
               5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924
               4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004
               17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12
               17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943
               8.00004 17.7085Z"
            fill="currentColor" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="notif-panel fixed left-2 right-2 top-[130px]
          sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-[361px]
          mt-0 sm:mt-[17px]
          z-[99999] flex h-[480px] flex-col rounded-2xl p-3"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between pb-3 mb-3 site-border-bottom">
          <h5 className="text-lg font-semibold site-heading">Notifications</h5>
          <button className="site-text-muted hover:site-heading transition-colors" onClick={toggle}>
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775
                   6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854
                   5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782
                   16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721
                   16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967
                   17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* Notification list */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {NOTIFICATIONS.map(n => (
            <li key={n.id}>
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                className="notif-item flex gap-3 rounded-lg px-4 py-3"
              >
                {/* Avatar + online dot */}
                <span className="relative block w-10 h-10 rounded-full shrink-0 z-[1]">
                  <img width={40} height={40} src={n.avatar} alt={n.user}
                    className="w-full h-full overflow-hidden rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 z-10 h-2.5 w-2.5 rounded-full border-2 border-[var(--card-bg)]"
                    style={{ backgroundColor: n.online ? 'var(--status-active-dot)' : 'var(--status-out-dot)' }} />
                </span>

                {/* Text */}
                <span className="block min-w-0">
                  <span className="mb-1.5 block text-sm site-subtext leading-snug">
                    <span className="font-semibold site-heading">{n.user}</span>
                    {" "}requests permission to change{" "}
                    <span className="font-semibold site-heading">Project — {n.project}</span>
                  </span>
                  <span className="flex items-center gap-2 text-xs site-text-muted">
                    <span>Project</span>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
                    <span>{n.time}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>

        {/* View all link */}
        <Link to="/"
          className="notif-view-all block px-4 py-2 mt-3 text-sm font-medium text-center rounded-lg transition-colors">
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}