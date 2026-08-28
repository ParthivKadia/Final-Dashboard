import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./site-theme.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "@/shared/components/layout/PageMeta.tsx";
import { ThemeProvider } from "@/shared/context/ThemeContext.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <App />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-primary)",
            },
          }}
        />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);