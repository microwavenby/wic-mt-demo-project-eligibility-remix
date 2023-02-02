import { test, expect } from "@playwright/test";
import { parseEligibilityID } from "../helpers/cookies";
import AxeBuilder from "@axe-core/playwright";
import {
  fillClinic,
  fillContact,
  fillIncome,
  fillEligibilityAdjunctive,
  fillEligibilityNoAdjunctive,
} from "../helpers/formFillers";
test("review has no automatically detectable accessibility errors", async ({
  page,
}) => {
  await page.goto("/eligibility");
  await fillEligibilityAdjunctive(page, "/choose-clinic", "Continue");
  await fillClinic(page, "/contact", "Select this clinic and continue");
  await fillContact(page, "/review", "Continue", false);
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("has title and header", async ({ page }) => {
  await page.goto("/eligibility");
  await fillEligibilityAdjunctive(page, "/choose-clinic", "Continue");
  await fillClinic(page, "/contact", "Select this clinic and continue");
  await fillContact(page, "/review", "Continue", false);
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Review and submit your information/);
  await expect(page.getByRole("banner")).toHaveText(/Apply for WIC in Montana/);

  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });
});

test("has no data for a new cookie; routes to /eligibility", async ({
  page,
}) => {
  await page.goto("/review");
  await expect(page).toHaveURL("/eligibility?missing-data=true");
  const missingDataAlert = page.getByRole("alert");
  expect(await missingDataAlert.innerText()).toMatch(
    /Some required responses are missing./
  );
});

test("editing clinic page from /review works", async ({ page }) => {
  await page.goto("/eligibility");
  await fillEligibilityAdjunctive(page, "/choose-clinic", "Continue");
  await fillClinic(page, "/contact", "Select this clinic and continue");
  await fillContact(page, "/review", "Continue", false);
  await page
    .getByRole("heading", { name: "Choose a clinic" })
    .getByRole("link", { name: "Edit" })
    .click();
  await expect(page).toHaveURL("/choose-clinic?mode=review&zip=59873");

  // Search for and select a clinic
  await page.getByTestId("textInput").fill("59853");
  await page.getByRole("button").click();
  await page
    .getByRole("group", {
      name: "Choose a clinic from the following list",
    })
    .getByText("NOXON", { exact: true })
    .click();
  const updateButton = page.getByRole("button", { name: "Update" });
  expect(await updateButton.textContent()).toBe("Update");
  await updateButton.click();
  await expect(page).toHaveURL("/review");
  const clinicSectionText = await page
    .getByTestId("review-section-ChooseClinic.title")
    .innerText();
  expect(clinicSectionText).toMatch(
    /59853.*NOXON.*1419 Hwy 200, Noxon, MT 59853.*\(406\) 827-6931/s
  );
});

test("editing contact page from /review works", async ({ page }) => {
  await page.goto("/eligibility");
  await fillEligibilityAdjunctive(page, "/choose-clinic", "Continue");
  await fillClinic(page, "/contact", "Select this clinic and continue");
  await fillContact(page, "/review", "Continue", false);
  await page
    .getByRole("heading", { name: "Contact information" })
    .getByRole("link", { name: "Edit" })
    .click();
  await expect(page).toHaveURL("/contact?mode=review");

  // Fill out the form required contact info
  await page.getByLabel("First name").type("Jack");
  await page.getByLabel("Last name").type("Pumpkin");
  await page.getByLabel("Phone number").type("908-765-4321");
  const updateButton = page.getByTestId("button");
  expect(await updateButton.textContent()).toBe("Update");
  await updateButton.click();
  await expect(page).toHaveURL("/review");
  const contactSectionText = await page
    .getByTestId("review-section-Contact.title")
    .innerText();
  expect(contactSectionText).toMatch(/Jack.*Pumpkin.*908-765-4321/s);
  expect(contactSectionText).not.toMatch(
    /Comments, questions, other information/
  );

  // Return to contact page and update comments field
  await page
    .getByRole("heading", { name: "Contact information" })
    .getByRole("link", { name: "Edit" })
    .click();
  await page
    .getByLabel("Comments, questions, other information")
    .type("WIC is awesome!");
  await page.getByTestId("button").click();
  expect(
    await page.getByTestId("review-section-Contact.title").innerText()
  ).toMatch(/Comments, questions, other information.*WIC is awesome\!/s);
});
