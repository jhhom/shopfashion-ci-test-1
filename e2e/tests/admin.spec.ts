import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_URL = "http://localhost:9801";

test("can login to store admin", async ({ page }) => {
  await page.goto(ADMIN_URL);

  const email = await page.getByRole("textbox", { name: "email" });
  await email.fill("admin");

  const password = await page.getByRole("textbox", { name: "password" });
  await password.fill("admin123");

  const signin = await page.getByText("Sign in", { exact: true });

  await signin.click();

  await page.waitForURL(ADMIN_URL);

  const salesSummary = await page.getByText("Sales summary");
  await expect(salesSummary).toBeVisible();
});
