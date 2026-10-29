import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BASE = "/voice_ai_agent/";

// Lets the site open at "/voice_ai_agent" (no trailing slash) as well as "/voice_ai_agent/".
// Vite normally refuses the slash-less form; this quietly serves the same page instead.
function baseWithoutSlash() {
  const bare = BASE.slice(0, -1);
  const rewrite = (req, _res, next) => {
    if (req.url === bare || req.url?.startsWith(`${bare}?`)) req.url = BASE + req.url.slice(bare.length);
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

export default defineConfig({
  base: BASE,
  plugins: [baseWithoutSlash(), react()],
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
