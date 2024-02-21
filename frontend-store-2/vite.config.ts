import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9802,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 9810,
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@api-contract": path.resolve(__dirname, "./src/api-contract"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
});
