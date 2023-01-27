// eligibility.spec.ts
import { test, expect, Response } from "@playwright/test";
import { validateCookie, parseEligibilityID } from "../helpers/cookies";
import AxeBuilder from "@axe-core/playwright";

test("eligiblity has no automatically detectable accessibility errors", async ({
  page,
}) => {
  await page.goto("/eligibility");
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

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
  await validateCookie(cookies[0]);
});

test(`the eligibility form submits a POST request, and on return to the page,
      a GET request that repopulates the form`, async ({ page }) => {
  await page.goto("/eligibility");
  const cookies = await page.context().cookies();
  const eligibilityID = await parseEligibilityID(cookies[0]);

  // Fill in the form with basic answers
  const residentialYesInput = await page
    .getByRole("group", { name: "Do you live or work in Montana?" })
    .getByText("Yes");
  await residentialYesInput.click();
  const pregnantCheckbox = await page.getByText("I'm pregnant");
  await pregnantCheckbox.click();

  const noPreviousBenefits = await page
    .getByRole("group", {
      name: "Have you or someone in your household received WIC benefits before?",
    })
    .getByText("No");
  await noPreviousBenefits.click();
  const noAdjunctive = await page
    .getByRole("group", {
      name: "Are you or someone in your household currently enrolled in any of the following programs in Montana?",
    })
    .getByText("None of the above");
  await noAdjunctive.click();

  // Test that the screenshot for the filled out form matches
  await expect(page).toHaveScreenshot({ fullPage: true });

  // Catch the POST request to the API with the form data while we click "Continue"
  const [postRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("eligibility?_data=routes%2Feligibility") &&
        response.status() === 204,
      { timeout: 2000 }
    ),
    await page.getByTestId("button").click(),
  ]);

  // Test that the submitted JSON matches the form state
  const postedData = await postRequest.request().postDataJSON();
  expect(postRequest.request().method()).toBe("POST");
  expect(postedData).toMatchObject({
    __rvfInternalFormId: "eligiblityForm",
    residential: "yes",
    categorical: "pregnant",
    previouslyEnrolled: "no",
    adjunctive: "none",
    action: "continue",
  });

  // Check that we've moved to the Income page based on our eligibility
  await expect(page).toHaveURL("/income");

  // Capture the GET request when we load the /eligibility page again by clicking "Back"
  const [getRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("eligibility?_data=routes%2Feligibility") &&
        response.status() === 200,
      { timeout: 2000 }
    ),
    await page.getByRole("link", { name: "back" }).click(),
  ]);
  await expect(page).toHaveURL("/eligibility");

  // Verify that the API returns the expected form state
  // (lists of 1 are expected from the api; forms use strings for 1 value, even if many can be sent)
  const getData = await getRequest.json();
  expect(getRequest.request().method()).toBe("GET");
  expect(getData).toMatchObject({
    __rvfInternalFormDefaults_eligiblityForm: {
      residential: "yes",
      categorical: ["pregnant"],
      previouslyEnrolled: "no",
      adjunctive: ["none"],
    },
    eligibilityID: eligibilityID,
    reviewMode: false,
  });

  // Check that the reconstituted form matches the screenshot
  await expect(page).toHaveScreenshot({ fullPage: true });

  // This is not verifying Playwright checked the boxes, but that the form repopulates
  // from the database record created by submitting the form
  await expect(
    page
      .getByRole("group", { name: "Do you live or work in Montana?" })
      .getByText("Yes")
  ).toBeChecked();
  await expect(page.getByText("I'm pregnant")).toBeChecked();
  await expect(
    page
      .getByRole("group", {
        name: "Have you or someone in your household received WIC benefits before?",
      })
      .getByText("No")
  ).toBeChecked();
  await expect(
    page
      .getByRole("group", {
        name: "Are you or someone in your household currently enrolled in any of the following programs in Montana?",
      })
      .getByText("None of the above")
  ).toBeChecked();
});

test("it validates None and another option for categorical cannot be selected", async ({
  page,
}) => {
  await page.goto("/eligibility");

  // Create an invalid state by clicking "I'm pregnant" and then "None of the above"
  const categoricalGroup = page.getByRole("group", {
    name: "Please select all the following that apply to your household:",
  });
  await Promise.all([
    await categoricalGroup.getByText("I'm pregnant").click(),
    await categoricalGroup.getByText("None of the above").click(),
    await page.getByTestId("button").click(), // Webkit doesn't do the clientside validation 🤯
    await expect(categoricalGroup).toContainText(
      "Cannot select None and another option"
    ),
  ]);
  await expect(page).toHaveScreenshot({ fullPage: true });
});

test("it validates None and another option for adjunctive cannot be selected", async ({
  page,
}) => {
  await page.goto("/eligibility");

  // Create an invalid state by clicking "I'm pregnant" and then "None of the above"
  const adjunctiveGroup = page.getByRole("group", {
    name: "Are you or someone in your household currently enrolled in any of the following programs in Montana?",
  });
  await Promise.all([
    await adjunctiveGroup
      .getByText("Medicaid/Healthy Montana Kids Plus")
      .click(),
    await adjunctiveGroup.getByText("None of the above").click(),
    await page.getByTestId("button").click(), // Webkit doesn't do the clientside validation 🤯
    await expect(adjunctiveGroup).toContainText(
      "Cannot select None and another option"
    ),
  ]);
  await expect(page).toHaveScreenshot({
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
});

test("it validates that you must select yes/no for Montana residency", async ({
  page,
}) => {
  await page.goto("/eligibility");
  const residency = page.getByRole("group", {
    name: "Do you live or work in Montana?",
  });
  await expect(residency).not.toContainText("Required");
  await page.getByTestId("button").click();
  await expect(residency).toContainText("Required");
});

test("it validates that you must select yes/no for receiving WIC benefits before", async ({
  page,
}) => {
  await page.goto("/eligibility");
  const previousBenefits = page.getByRole("group", {
    name: "Have you or someone in your household received WIC benefits before?",
  });
  await expect(previousBenefits).not.toContainText("Required");
  await page.getByTestId("button").click();
  await expect(previousBenefits).toContainText("Required");
});
