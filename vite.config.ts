import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://admin.storely.co.in",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React vendors
          "vendor-react": ["react", "react-dom", "react-router-dom"],

          // State management
          "vendor-zustand": ["zustand"],

          // UI & Styling
          "vendor-ui": ["clsx", "tailwind-merge", "class-variance-authority", "lucide-react", "sonner"],

          // Charts (heavy - separate chunk)
          "vendor-charts": ["recharts", "apexcharts", "react-apexcharts"],

          // Calendar (heavy)
          "vendor-calendar": [
            "@fullcalendar/core",
            "@fullcalendar/react",
            "@fullcalendar/daygrid",
            "@fullcalendar/timegrid",
            "@fullcalendar/list",
            "@fullcalendar/interaction",
          ],

          // Maps
          "vendor-maps": ["@react-jvectormap/core", "@react-jvectormap/world"],

          // Carousel/Slider
          "vendor-swiper": ["swiper"],

          // Drag & Drop
          "vendor-dnd": ["react-dnd", "react-dnd-html5-backend"],

          // Forms & Utils
          "vendor-forms": ["flatpickr", "react-dropzone"],

          // Cloudinary
          "vendor-cloudinary": ["@cloudinary/react", "@cloudinary/url-gen"],

          // Head management
          "vendor-helmet": ["react-helmet-async"],

          // Theming
          "vendor-themes": ["next-themes"],
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});