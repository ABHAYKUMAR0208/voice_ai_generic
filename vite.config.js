import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Local dev runs at http://localhost:5173/voice_ai_agent.
// Production builds are served from GitHub Pages at /voice_ai_generic/ (the repo name).
// Override the build path with VITE_BASE, e.g. VITE_BASE=/ npm run build for a site at the domain root.
const DEV_BASE = "/voice_ai_agent/";
const BUILD_BASE = process.env.VITE_BASE || "/voice_ai_generic/";

// Lets the dev/preview server open the site at "/voice_ai_agent" (no trailing slash) too.
function baseWithoutSlash(base) {
  const bare = base.slice(0, -1);
  const rewrite = (req, _res, next) => {
    if (bare && (req.url === bare || req.url?.startsWith(`${bare}?`))) req.url = base + req.url.slice(bare.length);
    next();
  };
  return {
    name: "base-without-trailing-slash",
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

// GitHub Pages has no SPA fallback: a copy of index.html as 404.html makes
// deep links like /voice_ai_generic/walkthrough load the app instead of a 404 page.
function spaFallback() {
  return {
    name: "spa-404-fallback",
    apply: "build",
    closeBundle() {
      const out = resolve("dist");
      copyFileSync(resolve(out, "index.html"), resolve(out, "404.html"));
    },
  };
}

export default defineConfig(({ command, isPreview }) => {
  const base = command === "build" || isPreview ? BUILD_BASE : DEV_BASE;
  return {
    base,
    plugins: [baseWithoutSlash(base), react(), spaFallback()],
    server: {
      host: true,
      port: 5173,
    },
    preview: {
      host: true,
      port: 4173,
    },
  };
});
