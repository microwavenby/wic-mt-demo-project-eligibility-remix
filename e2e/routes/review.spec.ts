import { test, expect } from "@playwright/test";
import { parseEligibilityID } from "../helpers/cookies";
import AxeBuilder from "@axe-core/playwright";

test("contact has no automatically detectable accessibility errors", async ({
  page,
}) => {
  await page.goto("/review");
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("has title and header", async ({ page }) => {
  await page.goto("/review");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Review and submit your information/);
  await expect(page.getByRole("banner")).toHaveText(/Apply for WIC in Montana/);

  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });
});

test("has no data for a new cookie", async ({ page }) => {
  await page.goto("/review");
  expect(
    await page
      .getByRole("heading", { name: "Eligibility questions" })
      .innerText()
  ).toMatch(/Eligibility questions\s*Edit/);
  expect(
    await page.getByRole("heading", { name: "Choose a clinic" }).innerText()
  ).toMatch(/Choose a clinic\s*Edit/);
  expect(
    await page.getByRole("heading", { name: "Contact information" }).innerText()
  ).toMatch(/Contact information\s*Edit/);
});

test("editing eligibility on an empty review page CAN lead to income before returning", async ({
  page,
}) => {
  await page.goto("/review");
  await page
    .getByRole("heading", { name: "Eligibility questions" })
    .getByRole("link", { name: "Edit" })
    .click();
  await expect(page).toHaveURL("/eligibility?mode=review");

  // Fill out the form with categorical, but no adjunctive eligibility
  await page
    .getByRole("group", { name: "Do you live or work in Montana?" })
    .getByText("Yes")
    .click();
  await page.getByText("I'm pregnant").click();
  await page
    .getByRole("group", {
      name: "Have you or someone in your household received WIC benefits before?",
    })
    .getByText("No")
    .click();
  await page
    .getByRole("group", {
      name: "Are you or someone in your household currently enrolled in any of the following programs in Montana?",
    })
    .getByText("None of the above")
    .click();
  const eligibilityButton = page.getByTestId("button");
  expect(await eligibilityButton.textContent()).toBe("Update");
  await eligibilityButton.click();

  // Now fill out the income form
  await expect(page).toHaveURL("/income?mode=review");
  await page.getByTestId("dropdown").selectOption("2");
  const incomeButton = await page.getByTestId("button");
  expect(await incomeButton.textContent()).toBe("Update");
  await incomeButton.click();

  // And we have returned to Review
  await expect(page).toHaveURL("/review");
  const eligibilitySectionText = await page
    .getByTestId("review-section-Review.eligibilityTitle")
    .innerText();
  expect(eligibilitySectionText).toMatch(
    /Yes.*I'm pregnant.*No.*None of the above/s
  );
  const incomeSectionText = await page
    .getByTestId("review-section-Income.householdSize")
    .innerText();
  expect(incomeSectionText).toMatch(/Household size\s*2/s);
});

test("editing eligibility on an empty review page SKIP income before returning", async ({
  page,
}) => {
  await page.goto("/review");
  await page
    .getByRole("heading", { name: "Eligibility questions" })
    .getByRole("link", { name: "Edit" })
    .click();
  await expect(page).toHaveURL("/eligibility?mode=review");

  // Fill out the form with categorical and adjunctive eligibility
  await page
    .getByRole("group", { name: "Do you live or work in Montana?" })
    .getByText("Yes")
    .click();
  await page.getByText("I'm pregnant").click();
  await page
    .getByRole("group", {
      name: "Have you or someone in your household received WIC benefits before?",
    })
    .getByText("No")
    .click();
  await page
    .getByRole("group", {
      name: "Are you or someone in your household currently enrolled in any of the following programs in Montana?",
    })
    .getByText("Medicaid/Healthy Montana Kids Plus")
    .click();

  await page.getByTestId("button").click();

  // And we have returned to Review
  await expect(page).toHaveURL("/review");
  const eligibilitySectionText = await page
    .getByTestId("review-section-Review.eligibilityTitle")
    .innerText();
  expect(eligibilitySectionText).toMatch(
    /Yes.*I'm pregnant.*No.*Medicaid\/Healthy Montana Kids Plus/s
  );
  await expect(
    page.getByTestId("review-section-Income.householdSize")
  ).toHaveCount(0);
});

test("editing clinic page from /review works", async ({ page }) => {
  await page.goto("/review");
  await page
    .getByRole("heading", { name: "Choose a clinic" })
    .getByRole("link", { name: "Edit" })
    .click();
  await expect(page).toHaveURL("/choose-clinic?mode=review&zip=undefined");

  // Search for and select a clinic
  await page.getByTestId("textInput").type("59873");
  await page.getByRole("button").click();
  await page
    .getByRole("group", {
      name: "Choose a clinic from the following list",
    })
    .getByText("THOMPSON FALLS", { exact: true })
    .click();
  const updateButton = page.getByRole("button", { name: "Update" });
  expect(await updateButton.textContent()).toBe("Update");
  await updateButton.click();
  await expect(page).toHaveURL("/review");
  const clinicSectionText = await page
    .getByTestId("review-section-ChooseClinic.title")
    .innerText();
  expect(clinicSectionText).toMatch(
    /59873.*THOMPSON FALLS.*1111 Main St. Room 120 Thompson Falls, MT 59873.*\(406\) 827-6931/s
  );
});

test("editing contact page from /review works", async ({ page }) => {
  await page.goto("/review");
  await page
    .getByRole("heading", { name: "Contact information" })
    .getByRole("link", { name: "Edit" })
    .click();
  await expect(page).toHaveURL("/contact?mode=review");

  // Fill out the form required contact info
  await page.getByLabel("First name").type("Jane");
  await page.getByLabel("Last name").type("McIntyre");
  await page.getByLabel("Phone number").type("123-456-7890");
  const updateButton = page.getByTestId("button");
  expect(await updateButton.textContent()).toBe("Update");
  await updateButton.click();
  await expect(page).toHaveURL("/review");
  const contactSectionText = await page
    .getByTestId("review-section-Contact.title")
    .innerText();
  expect(contactSectionText).toMatch(/Jane.*McIntyre.*123-456-7890/s);
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
