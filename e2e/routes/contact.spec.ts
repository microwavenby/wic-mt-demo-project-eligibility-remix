import { test, expect } from "@playwright/test";
import { parseEligibilityID } from "../helpers/cookies";
import AxeBuilder from "@axe-core/playwright";
import { fillClinic, fillEligibilityAdjunctive } from "../helpers/formFillers";
test("contact has no automatically detectable accessibility errors", async ({
  page,
}) => {
  await page.goto("/contact");
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("has title and header", async ({ page }) => {
  await page.goto("/contact");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Contact information/);
  await expect(page.getByRole("banner")).toHaveText(/Apply for WIC in Montana/);

  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });
});

test("first name is required", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("First name").click();
  // This is just a click elsewhere to trigger the onBlur validation
  await page.getByRole("banner").click();
  const firstnameError = page.locator("#firstName-error-message");
  await expect(firstnameError).toHaveCount(1);
  expect(await firstnameError.textContent()).toBe("Required");
});

test("last name is required", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Last name").click();
  // This is just a click elsewhere to trigger the onBlur validation
  await page.getByRole("banner").click();
  const lastnameError = page.locator("#lastName-error-message");
  await expect(lastnameError).toHaveCount(1);
  expect(await lastnameError.textContent()).toBe("Required");
});

test("phone number is required", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Phone number").click();
  // This is just a click elsewhere to trigger the onBlur validation
  await page.getByRole("banner").click();
  const phoneError = page.locator("#phone-error-message");
  await expect(phoneError).toHaveCount(1);
  expect(await phoneError.textContent()).toBe("Required");
});

test("phone number field does not allow non-digit typing", async ({ page }) => {
  await page.goto("/contact");
  const phoneField = page.getByLabel("Phone number");
  await phoneField.type("not a number at all");
  expect(await phoneField.inputValue()).toBe("");
});

test("phone number field requires 10 digits", async ({ page }) => {
  await page.goto("/contact");
  const phoneField = page.getByLabel("Phone number");
  await phoneField.type("123456789");
  // Firefox and Chromium have a trailing space, WebKit does not
  await page.getByRole("banner").click();

  expect(await phoneField.inputValue()).toMatch(/123-456-789/);
  const phoneError = page.locator("#phone-error-message");
  await expect(phoneError).toHaveCount(1);
  expect(await phoneError.textContent()).toBe(
    "Phone number should be 10 digits"
  );
});

test("phone number field inserts dashes correctly without dashes typed", async ({
  page,
}) => {
  await page.goto("/contact");
  const phoneField = page.getByLabel("Phone number");
  // Webkit has a race condition that needed this Promise wrapper to resolve 🤷🏻‍♀️
  Promise.all([
    await phoneField.type("1234567890"),
    expect(await phoneField.inputValue()).toBe("123-456-7890"),
  ]);
});

test("phone number field inserts dashes correctly with dashes typed", async ({
  page,
}) => {
  await page.goto("/contact");
  const phoneField = await page.getByLabel("Phone number");
  await phoneField.type("123-456-7890");
  expect(await phoneField.inputValue()).toBe("123-456-7890");
});

test("comments are NOT required", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Comments, questions, other information").click();
  // This is just a click elsewhere to trigger the onBlur validation
  await page.getByRole("banner").click();
  await expect(page.getByTestId("errorMessage")).toHaveCount(0);
});

test(`the contact form submits a POST request, and on return to the page,
      a GET request that repopulates the form`, async ({ page }) => {
  await page.goto("/eligibility");
  await fillEligibilityAdjunctive(page, "/choose-clinic", "Continue");
  await fillClinic(page, "/contact", "Select this clinic and continue");
  const cookies = await page.context().cookies();
  const eligibilityID = await parseEligibilityID(cookies[0]);
  await page.getByLabel("First name").type("Jane");
  await page.getByLabel("Last name").type("McIntyre");
  await page.getByLabel("Phone number").type("123-456-7890");
  await page
    .getByLabel("Comments, questions, other information")
    .type("WIC is awesome!");

  // Catch the POST request to the API with the form data while we click "Continue"
  const [postRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("contact?_data=routes%2Fcontact") &&
        response.status() === 204,
      { timeout: 3000 }
    ),
    await page.getByRole("button").click(),
  ]);
  const postedData = await postRequest.request().postDataJSON();
  expect(postRequest.request().method()).toBe("POST");
  expect(postedData).toMatchObject({
    __rvfInternalFormId: "contactForm",
    firstName: "Jane",
    lastName: "McIntyre",
    phone: "123-456-7890",
    comments: "WIC is awesome!",
  });

  await expect(page).toHaveURL("/review");

  // Capture the GET request when we load the /eligibility page again by clicking "Back"
  const [getRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("contact?_data=routes%2Fcontact") &&
        response.status() === 200,
      { timeout: 3000 }
    ),
    await page.getByRole("link", { name: "back" }).click(),
  ]);
  await expect(page).toHaveURL("/contact");

  // Verify that the API returns the expected form state
  const getData = await getRequest.json();
  expect(getRequest.request().method()).toBe("GET");
  expect(getData).toMatchObject({
    __rvfInternalFormDefaults_contactForm: {
      phone: "1234567890",
      comments: "WIC is awesome!",
      lastName: "McIntyre",
      firstName: "Jane",
    },
    default_phone: "1234567890",
    eligibilityID: eligibilityID,
    reviewMode: false,
  });

  expect(await page.getByLabel("First name").inputValue()).toBe("Jane");
  expect(await page.getByLabel("Last name").inputValue()).toBe("McIntyre");
  expect(await page.getByLabel("Phone number").inputValue()).toBe(
    "123-456-7890"
  );
  expect(
    await page.getByLabel("Comments, questions, other information").inputValue()
  ).toBe("WIC is awesome!");

  // Check that the reconstituted form matches the screenshot
  await expect(page).toHaveScreenshot({ fullPage: true });
});

// LOCATORS
//   await page.locator('#firstName-error-message').click();
//  await page.locator('#lastName-error-message').click();
//   await page.getByLabel('First name *').click();
//   await page.getByLabel('Last name *').click();
//   await page.getByLabel('Phone number').click();
//   await page.getByTestId('textarea').click();
//  await page.getByTestId('button').click();
//  await page.locator('#phone-error-message').click();
