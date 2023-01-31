import { test, expect } from "@playwright/test";
import { parseEligibilityID } from "../helpers/cookies";
import AxeBuilder from "@axe-core/playwright";

test("choose-clinic has no automatically detectable accessibility errors", async ({
  page,
}) => {
  await page.goto("/choose-clinic");
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("has title and header", async ({ page }) => {
  await page.goto("/choose-clinic");
  // Expect a title "to contain" a correct app title.
  await expect(page).toHaveTitle(/Choose a clinic/);
  await expect(page.getByRole("banner")).toHaveText(/Apply for WIC in Montana/);

  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });
});

test("error banner shows if non-MT zipcode entered", async ({ page }) => {
  await page.goto("/choose-clinic");
  const zipSearchBox = page.getByTestId("textInput");
  await zipSearchBox.type("12345");
  await page.getByRole("button").click();
  expect(page).toHaveURL("/choose-clinic?zip=12345");
  const alert = page.getByRole("alert");
  expect(await alert.textContent()).toMatch(
    /Sorry, we could not find a match for this ZIP code in Montana/
  );
});

test("error banner disappears when the user edits zip", async ({ page }) => {
  await page.goto("/choose-clinic");
  const zipSearchBox = page.getByTestId("textInput");
  await zipSearchBox.type("12345");
  await page.getByRole("button").click();
  expect(page).toHaveURL("/choose-clinic?zip=12345");
  const alert = page.getByRole("alert");
  expect(await alert.textContent()).toMatch(
    /Sorry, we could not find a match for this ZIP code in Montana/
  );
  await zipSearchBox.type("44444");
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("clicking search sends a GET request for clinics", async ({ page }) => {
  await page.goto("/choose-clinic");
  const zipSearchBox = page.getByTestId("textInput");
  await zipSearchBox.type("59873");
  const [getRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response
          .url()
          .includes("/choose-clinic?zip=59873&_data=routes%2Fchoose-clinic") &&
        response.status() === 200,
      { timeout: 3000 }
    ),
    await page.getByRole("button").click(),
  ]);
  expect(page).toHaveURL("/choose-clinic?zip=59873");

  const getData = await getRequest.json();
  expect(getRequest.request().method()).toBe("GET");
  expect(getData.clinics).toHaveLength(8);
  expect(getData.clinics[0]).toMatchObject({ clinic: "THOMPSON FALLS" });
});

test("textbox and results populated if you navigate with a zip", async ({
  page,
}) => {
  await page.goto("/choose-clinic?zip=59845");
  await expect(page.getByTestId("textInput")).toHaveValue("59845");
  const clinicResults = page.getByRole("group", {
    name: "Choose a clinic from the following list",
  });
  await expect(clinicResults.getByRole("radio")).toHaveCount(4);
});

test("you must select an option", async ({ page }) => {
  await page.goto("/choose-clinic?zip=59845");
  await page
    .getByRole("button", { name: "Select this clinic and continue" })
    .click();
  const required = page.getByTestId("errorMessage");
  expect(await required.textContent()).toBe("Required");
});

test("you must enter a 5 digit zipcode", async ({ page }) => {
  await page.goto("/choose-clinic");
  const zipSearchBox = page.getByTestId("textInput");
  await zipSearchBox.type("999");
  await page.getByRole("button").click();
  const required = page.getByRole("alert");
  expect(await required.innerText()).toBe(
    "Please enter 5 digits for the ZIP code."
  );
});

test("clicking 'show more' increases results to 8", async ({ page }) => {
  await page.goto("/choose-clinic?zip=59845");
  await expect(page.getByTestId("textInput")).toHaveValue("59845");
  await page.getByRole("button", { name: "Show more clinic options" }).click();
  await expect(
    page
      .getByRole("group", {
        name: "Choose a clinic from the following list",
      })
      .getByRole("radio")
  ).toHaveCount(8);
});

test(`the choose-clinic form submits a POST request, and on return to the page,
      a GET request that repopulates the form, and selects the clinic`, async ({
  page,
}) => {
  await page.goto("/choose-clinic");
  const cookies = await page.context().cookies();
  const eligibilityID = await parseEligibilityID(cookies[0]);
  const zipSearchBox = page.getByTestId("textInput");
  await zipSearchBox.type("59873");

  await page.getByRole("button").click();
  expect(page).toHaveURL("/choose-clinic?zip=59873");
  await page
    .getByRole("group", {
      name: "Choose a clinic from the following list",
    })
    .getByText("THOMPSON FALLS", { exact: true })
    .click();
  await expect(page).toHaveScreenshot({
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
  // Catch the POST request to the API with the form data while we click "Continue"
  const [postRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response
          .url()
          .includes("/choose-clinic?zip=59873&_data=routes%2Fchoose-clinic") &&
        response.status() === 204,
      { timeout: 3000 }
    ),
    await page
      .getByRole("button", { name: "Select this clinic and continue" })
      .click(),
  ]);
  const postedData = await postRequest.request().postDataJSON();
  expect(postRequest.request().method()).toBe("POST");
  expect(postedData).toMatchObject({
    __rvfInternalFormId: "clinicForm",
    clinic: "THOMPSON FALLS",
    action: "ChooseClinic.button",
  });

  await expect(page).toHaveURL("/contact");

  // Capture the GET request when we load the /eligibility page again by clicking "Back"
  const [getRequest] = await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("_data=routes%2Fchoose-clinic") &&
        response.status() === 200,
      { timeout: 3000 }
    ),
    await page.getByRole("link", { name: "back" }).click(),
  ]);
  await expect(page).toHaveURL("/choose-clinic?zip=59873");
  // Verify that the API returns the expected form state
  // (lists of 1 are expected from the api; forms use strings for 1 value, even if many can be sent)
  const getData = await getRequest.json();
  expect(getRequest.request().method()).toBe("GET");
  expect(getData).toMatchObject({
    clinics: [
      {
        clinic: "THOMPSON FALLS",
        zipCode: "59873",
        clinicAddress: "1111  Main St. Room 120 Thompson Falls, MT 59873",
        clinicTelephone: "(406) 827-6931",
      },
    ],
    eligibilityID: eligibilityID,
    reviewMode: false,
  });

  const clinicResults = page.getByRole("group", {
    name: "Choose a clinic from the following list",
  });
  await expect(clinicResults.getByRole("radio")).toHaveCount(1);

  // This is not verifying Playwright checked the clinic option, but that the form repopulates
  // from the database record created by submitting the form
  await expect(
    clinicResults.getByText("THOMPSON FALLS", { exact: true })
  ).toBeChecked();

  // Check that the reconstituted form matches the screenshot
  await expect(page).toHaveScreenshot({ fullPage: true });
});
