import path from "path";
import { defineConfig } from "vitest/config";

import GithubActionsReporter from "vitest-github-actions-reporter";

export default defineConfig({
  test: {
    // ...
    environment: "jsdom",
    reporters: process.env.GITHUB_ACTIONS
      ? new GithubActionsReporter()
      : ["default"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@api-contract": path.resolve(__dirname, "./src/api-contract"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
});
