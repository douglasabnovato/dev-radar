/*
 * vite.config.mjs · build em build/ (usado pelo render.yaml), caminhos relativos e testes com Vitest.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { port: 3000 },
  build: { outDir: "build" },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
/* fim de vite.config.mjs */
