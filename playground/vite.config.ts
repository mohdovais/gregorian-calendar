import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/some-framework/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("playground")) {
            return "app";
          }
          if (id.includes("react")) {
            return "react";
          }
        },
      },
    },
  },
});
