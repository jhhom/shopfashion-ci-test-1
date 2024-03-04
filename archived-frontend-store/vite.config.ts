import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9020,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@api-contract": path.resolve(__dirname, "./src/shared/api-contract"),
      "@config": path.resolve(__dirname, "./src/shared/config"),
    },
  },
});
