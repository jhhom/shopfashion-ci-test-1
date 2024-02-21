import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const STORE_URL = "http://localhost:9802";

test("can visit store front", async ({ page }) => {
  await page.goto(STORE_URL);

  const menCategoryNavDropdown = await page.getByRole("button", {
    name: /Men/,
  });

  const womenCategoryNavDropdown = await page.getByRole("button", {
    name: /Women/,
  });

  await expect(menCategoryNavDropdown).toBeVisible();

  await expect(womenCategoryNavDropdown).toBeVisible();
});
