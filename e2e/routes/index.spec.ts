// my-test.ts
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Start an application for WIC/);
});

test("get started link", async ({ page }) => {
  await page.goto("/");

  // Click the get started button.
  await page.getByRole("button", { name: "Get started" }).click();

  // Expects the URL to contain /how-it-works.
  await expect(page).toHaveURL(/how-it-works/);
});
