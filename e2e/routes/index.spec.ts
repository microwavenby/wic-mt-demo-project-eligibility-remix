// index.spec.ts - tests for the index page
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Start an application for WIC/);
  await expect(page).toHaveScreenshot();
});

test("get started link", async ({ page }) => {
  await page.goto("/");

  // Click the get started button.
  await page.getByRole("button", { name: "Get started" }).click();

  // Expects the URL to contain /how-it-works.
  await expect(page).toHaveURL(/how-it-works/);
});

// We should check that the demo banner and link show up
test("demo banner and link", async ({ page }) => {
  await page.goto("/");
  const warning_banner = page.getByTestId("alert");
  await expect(warning_banner).toHaveClass(/alert--warning/);
  await expect(warning_banner).toHaveText(
    /demonstration project and for example purposes/
  );
  const link = await page.getByTestId("alert").getByRole("link");
  await expect(link).toHaveAttribute("href", "https://signupwic.com");
  await expect(link).toHaveText("SignUpWIC.com");
});

// This page shouldn't set cookies
test("the index page sets no cookies", async ({ page }) => {
  await page.goto("/");
  const cookies = await page.context().cookies();
  await expect(cookies).toHaveLength(0);
});
