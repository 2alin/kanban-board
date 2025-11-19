/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/kanban-board",
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  test: {
    projects: [
      {
        test: {
          include: [
            "./**/*.browser.test.{ts,tsx}",
            "vitest-example/*.test.tsx",
          ],
          name: "browser",
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        test: {
          include: ["./**/*.unit.test.{ts,tsx}"],
          name: "unit",
          environment: "node",
        },
      },
    ],
  },
});
