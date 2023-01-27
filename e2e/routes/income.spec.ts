import { test, expect } from "@playwright/test";
import { parseEligibilityID } from "../helpers/cookies";
import AxeBuilder from "@axe-core/playwright";

test("income has no automatically detectable accessibility errors", async ({
  page,
}) => {
  await page.goto("/income");
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("has title and header", async ({ page }) => {
  await page.goto("/income");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Check your eligibility/);
  await expect(page.getByRole("banner")).toHaveText(/Apply for WIC in Montana/);

  await expect(page).toHaveScreenshot();
});

test("has a back link to /eligibility", async ({ page }) => {
  await page.goto("/income");
  // Expect a title "to contain" a correct app title.
  await page.getByRole("link", { name: "back" }).click(),
    await expect(page).toHaveURL("/eligibility");
});

test(`the income form submits a POST request, and on return to the page,
      a GET request that repopulates the form`, async ({ page }) => {
  await page.goto("/income");
  const cookies = await page.context().cookies();
  const eligibilityID = await parseEligibilityID(cookies[0]);
  // Fill in the form with basic answers
  const householdSizeInput = page.getByTestId("dropdown");
  await householdSizeInput.selectOption("2");

  // Test that the screenshot for the filled out form matches
  await expect(page).toHaveScreenshot({ fullPage: true });

  // Catch the POST request to the API with the form data while we click "Continue"
  //         response.url().includes("income?_data=routes%2Fincome") &&
  const [postRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("income?_data=routes%2Fincome") &&
        response.status() === 204,
      { timeout: 3000 }
    ),
    await page.getByTestId("button").click(),
  ]);

  // Test that the submitted JSON matches the form state
  const postedData = await postRequest.request().postDataJSON();
  expect(postRequest.request().method()).toBe("POST");
  expect(postedData).toMatchObject({
    __rvfInternalFormId: "incomeForm",
    householdSize: "2",
    action: "continue",
  });

  // Check that we've moved to the Choose-Clinic page
  await expect(page).toHaveURL("/choose-clinic");

  // Capture the GET request when we load the /eligibility page again by clicking "Back"
  const [getRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("income?_data=routes%2Fincome") &&
        response.status() === 200,
      { timeout: 3000 }
    ),
    await page.getByRole("link", { name: "back" }).click(),
  ]);
  await expect(page).toHaveURL("/income");
  // Verify that the API returns the expected form state
  // (lists of 1 are expected from the api; forms use strings for 1 value, even if many can be sent)
  const getData = await getRequest.json();
  expect(getRequest.request().method()).toBe("GET");
  expect(getData).toMatchObject({
    selected: {
      householdSize: "2",
    },
    eligibilityID: eligibilityID,
    reviewMode: false,
  });

  // Check that the reconstituted form matches the screenshot
  await expect(page).toHaveScreenshot({ fullPage: true });

  // This is not verifying Playwright checked the boxes, but that the form repopulates
  // from the database record created by submitting the form
  expect(await page.getByTestId("dropdown").inputValue()).toBe("2");
});
