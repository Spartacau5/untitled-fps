import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  base: "./",
  server: {
    port: 5173,
    open: true,
    strictPort: true,
  },
  preview: {
    port: 4177,
    open: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "es2022",
    assetsInlineLimit: 0,
  },
});
