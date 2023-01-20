// eligibility.spec.ts
import { test, expect } from "@playwright/test";

test("has title and header", async ({ page }) => {
  await page.goto("/eligibility");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Check your eligibility/);
  await expect(page.getByRole("banner")).toHaveText(/Apply for WIC in Montana/);

  await expect(page).toHaveScreenshot();
});

// This page needs to set a cookie
test("the eligibilty page sets an eligibilityID cookie", async ({ page }) => {
  await page.goto("/eligibility");
  const cookies = await page.context().cookies();
  await expect(cookies).toHaveLength(1);
  await expect(cookies[0].value).toBe(undefined);
});
