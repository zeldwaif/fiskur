import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// Vite config. Environment variables prefixed with VITE_ are exposed to the client.
//
// PWA note: the manifest name/colours here mirror src/app/config.ts (appName, pwa.*).
// If you rename the app or change its identity, update both places - this file can't
// import runtime app code since it only runs at build time.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Fiskur",
        short_name: "Fiskur",
        description: "Fiskur - fishing intelligence, maps, and logs.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.hostname.includes("arcgisonline.com") || url.hostname.includes("tile.openstreetmap.org"),
            handler: "CacheFirst",
            options: {
              cacheName: "map-tiles",
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname.includes("nominatim.openstreetmap.org"),
            handler: "NetworkFirst",
            options: { cacheName: "geocoding", expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 } },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
