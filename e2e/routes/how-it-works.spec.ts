// how-it-works.spec.ts
import { test, expect } from "@playwright/test";

test("has title and header", async ({ page }) => {
  await page.goto("/how-it-works");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/How it works/);
  await expect(page.getByRole("banner")).toHaveText(/Apply for WIC in Montana/);

  await expect(page).toHaveScreenshot();
});

test("has back link to index", async ({ page }) => {
  await page.goto("/how-it-works");
  // Find the "back" link.
  await page.getByRole("link", { name: "back" }).click();
  // Expects the URL to contain /how-it-works.
  await expect(page).toHaveURL("/");
});

test("has button to check eligibility", async ({ page }) => {
  await page.goto("/how-it-works");
  // find the button
  await page.getByRole("button", { name: "Check your eligibility" }).click();
  await expect(page).toHaveURL("/eligibility");
});

// This page shouldn't set cookies
test("the how-it-works page sets no cookies", async ({ page }) => {
  await page.goto("/how-it-works");
  const cookies = await page.context().cookies();
  await expect(cookies).toHaveLength(0);
});
