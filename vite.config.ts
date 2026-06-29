import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";
import { routeIntegrityPlugin } from "./vite-plugins/route-integrity";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagetools(),
    mode === 'development' && componentTagger(),
    routeIntegrityPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Content-hashed, immutable filenames for every emitted asset
        // (including imagetools-generated AVIF/WebP variants). The hash means
        // a changed image gets a brand-new URL, so the bytes at any given URL
        // never change and can be cached forever.
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks(id) {
          // Bundle all lucide-react icons into one chunk instead of
          // hundreds of tiny per-icon files. This avoids overwhelming
          // the deploy upload with concurrent requests for many objects.
          if (id.includes("node_modules/lucide-react")) {
            return "lucide-icons";
          }
          if (id.includes("node_modules/react")) {
            return "react-vendor";
          }
        },
      },
    },
  },
}));
