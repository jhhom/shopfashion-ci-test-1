import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
    // environment: "jsdom",
    reporters: ["github-actions"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@api-contract": path.resolve(__dirname, "./src/api-contract"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
});
