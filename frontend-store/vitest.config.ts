import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
    // TODO: it looks like using environment 'jsdom' will cause GitHub annotation messages to not appear
    environment: "jsdom",
    reporters: process.env.GITHUB_ACTIONS ? ["github-actions"] : ["default"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@api-contract": path.resolve(__dirname, "./src/api-contract"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
});
