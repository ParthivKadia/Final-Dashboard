// src/components/common/SidebarWidget.tsx

export default function SidebarWidget() {
  return (
    <div
      className="mx-auto mb-10 w-full max-w-60 rounded-2xl px-4 py-5 text-center"
      style={{ backgroundColor: "rgba(33, 80, 212, 0.12)" }}
    >
      <h3
        className="mb-2 font-semibold"
        style={{ color: "var(--navbar-text)" }}
      >
        #1 Tailwind CSS Dashboard
      </h3>
      <p
        className="mb-4 text-theme-sm"
        style={{ color: "var(--navbar-subtext)" }}
      >
        Leading Tailwind CSS Admin Template with 400+ UI Component and Pages.
      </p>
      <a
        href="https://tailadmin.com/pricing"
        target="_blank"
        rel="nofollow"
        className="flex items-center justify-center p-3 font-medium rounded-lg text-theme-sm transition-colors"
        style={{
          backgroundColor: "var(--btn-primary-bg)",
          color: "var(--btn-primary-text)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--btn-primary-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--btn-primary-bg)")
        }
      >
        Purchase Plan
      </a>
    </div>
  );
}