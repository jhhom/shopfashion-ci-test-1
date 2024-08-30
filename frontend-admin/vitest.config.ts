import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
    reporters: process.env.GITHUB_ACTIONS
      ? ["html", "github-actions", "verbose"]
      : ["verbose"],
    outputFile: "./test-output/test-output.html",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@api-contract": path.resolve(__dirname, "./src/api-contract"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
});
